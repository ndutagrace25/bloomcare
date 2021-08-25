import AsyncStorage from '@react-native-community/async-storage';
import {
  Actions
} from 'react-native-router-flux';

import NetInfo from '@react-native-community/netinfo';
// import {RNUploader} from 'NativeModules';
// import LZUTF8 from 'lzutf8';

import {
  axios,
  createError,
  setAuthToken
} from '../utils';
import {
  SCOUT_ERRORS,
  FETCH_SCOUT,
  FETCH_NEW_SCOUT
} from './types';

import {
  deleteAllCollectedIssues,
  createScoutHistory
} from '../models/Blocks';

export const fetchScout = () => dispatch => {
  getScout = async key => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        axios
          .get('scout/personnel')
          .then(scout => {
            const storeScout = async data => {
              try {
                await AsyncStorage.setItem('@scout', JSON.stringify(data));

                dispatch({
                  type: FETCH_SCOUT,
                  payload: data,
                });
              } catch (err) {
                dispatch(createError(err, SCOUT_ERRORS));
              }
            };

            // Add access token to local storage
            storeScout(scout.data);
          })
          .catch(err => {
            dispatch(createError(err, SCOUT_ERRORS));
          });
      } else {
        dispatch({
          type: FETCH_SCOUT,
          payload: JSON.parse(value),
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };
  getScout('@scout');
};

export const createNewScout = (
  scout,
  newBlock,
  newBed,
  personnel,
) => dispatch => {
  getData = async key => {
    let newScout;
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        newScout = [];
        newScout.push(scout);
      } else {
        newScout = JSON.parse(value);
        let personnelFound = false;
        let blockFound = false;
        let bedFound = false;
        // console.log(newScout);
        for (let t = 0; t < newScout.length; t++) {
          const personnel = newScout[t];

          if (personnel.phone === scout.phone) {
            personnelFound = true;

            for (let r = 0; r < personnel.blocks.length; r++) {
              const block = personnel.blocks[r];
              // console.log(scout.blocks);
              if (block._id === scout.blocks[0]._id) {
                blockFound = true;

                for (let s = 0; s < block.beds.length; s++) {
                  const beds = block.beds[s];
                  if (beds.bed_name === scout.blocks[0].beds[0].bed_name) {
                    bedFound = true;
                    break;
                  }
                }

                if (!bedFound) {
                  newScout[t].blocks[r].beds.push(scout.blocks[0].beds[0]);
                }
              }
            }

            if (!blockFound) {
              newScout[t].blocks.push(scout.blocks[0]);
            }
          }
        }

        if (!personnelFound) {
          newScout.push(scout);
        }
      }

      storeNewScout(newScout, newBlock, newBed, personnel);
    } catch (e) {
      // console.log(e.message);
      dispatch(createError(e.message, SCOUT_ERRORS));
    }
  };

  const storeNewScout = async (newScout, blk, bd, personnel) => {
    try {
      await AsyncStorage.setItem('@newScout', JSON.stringify(newScout));
      // Actions.stations({
      //     personnel: personnel,
      //     currentBlock: blk,
      //     currentBed: bd
      // });
    } catch (err) {
      dispatch(createError(err, SCOUT_ERRORS));
    }
  };

  getData('@newScout');
};

export const getNewScout = scout => dispatch => {
  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        dispatch(
          createError({
              error: 'Select bed to proceed',
            },
            SCOUT_ERRORS,
          ),
        );
      } else {
        dispatch({
          type: FETCH_NEW_SCOUT,
          payload: JSON.parse(value),
        });
      }
    } catch (e) {
      dispatch(createError(e, SCOUT_ERRORS));
    }
  };

  getData('@newScout');
};

export const syncScouting = (fileContent, fileName, user) => dispatch => {
  // console.log('accessToken');
  // Check if online
  NetInfo.fetch().then(state => {

    if (state.isConnected && state.isInternetReachable) {

      const {
        phone,
        password
      } = user;

      // Log in user
      axios
        .post('personnel/login', {
          phone,
          password,
        })
        .then(res => {
          const {
            accessToken
          } = res.data;

          //set token to auth header
          setAuthToken(accessToken);

          let promises = [];

          let errors = [];

          const fileContentArray = JSON.parse(fileContent);

          // console.log(fileContentArray.length);

          for (let r = 1000; r < fileContentArray.length; r += 1000) {

            // console.log(r);

            let items = fileContentArray.slice(r, (r + 1000));

            // console.log(items.length);

            promises.push(
              axios
              .post(`scout/bulkInsert`, {
                fileContent: JSON.stringify(items),
                fileName,
              })
              .then(res => {})
              .catch(err => {
                errors.push({
                  message: err.message
                });
              })
            );

            // break;
          }

          Promise
            .all(promises)
            .then(() => {
              if (errors.length > 0) {
                dispatch(createError(errors[0], SCOUT_ERRORS));
              } else {
                Actions.sync({
                  personnel: user.phone,
                  personnelToken: user,
                  message: 'success',
                });
              }
            })
            .catch(err => {
              dispatch(createError(err, SCOUT_ERRORS));
            });
        })
        .catch(err => {
          dispatch(createError(err, SCOUT_ERRORS));
        });
    } else {
      dispatch({
        type: SCOUT_ERRORS,
        payload: {
          error: 'You are offline. Please turn on Wi-Fi or data to continue',
        },
      });
    }
  });
};

// export const fetchAllScouts = () => dispatch => {
//   axios
//     .get('scout/personnel')
//     .then(res => {
//       console.log(res.data.items);
//       dispatch({
//         type: FETCH_SCOUT,
//         payload: res.data.items,
//       });

//       createScoutHistory(res.data.items)
//         .then()
//         .catch(error => {
//           console.log(error);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       dispatch(createError(err, GET_ERRORS));
//     });
// };