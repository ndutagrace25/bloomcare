import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from 'react-native-router-flux';

import {axios, createError} from '../utils';
import {
  GET_ERRORS,
  FETCH_ISSUETYPES,
  FETCH_ISSUES,
  FETCH_ISSUECATEGORIES,
} from './types';

import {
  createIssue,
  createIssueType,
  createIssueCategory,
} from '../models/Blocks';

// export const getIssueTypes = () => dispatch => {
//   getData = async key => {
//     try {
//       const value = await AsyncStorage.getItem(key);

//       if (value === null || value === false) {
//         dispatch(
//           createError(
//             {
//               error: 'Issue Types not found',
//             },
//             GET_ERRORS,
//           ),
//         );
//       } else {
//         dispatch({
//           type: FETCH_ISSUETYPES,
//           payload: JSON.parse(value),
//         });
//       }
//     } catch (e) {
//       dispatch(createError(e, GET_ERRORS));
//     }
//   };

//   getData('@issueTypes');
// };

// export const getIssues = () => dispatch => {
//   getData = async key => {
//     try {
//       const value = await AsyncStorage.getItem(key);

//       if (value === null || value === false) {
//         dispatch(
//           createError(
//             {
//               error: 'Issues not found',
//             },
//             GET_ERRORS,
//           ),
//         );
//       } else {
//         dispatch({
//           type: FETCH_ISSUES,
//           payload: JSON.parse(value),
//         });
//       }
//     } catch (e) {
//       dispatch(createError(e, GET_ERRORS));
//     }
//   };

//   getData('@issues');
// };

// export const getIssueCategories = () => dispatch => {
//   getData = async key => {
//     try {
//       const value = await AsyncStorage.getItem(key);

//       if (value === null || value === false) {
//         dispatch(
//           createError(
//             {
//               error: 'Issue Categories not found',
//             },
//             GET_ERRORS,
//           ),
//         );
//       } else {
//         dispatch({
//           type: FETCH_ISSUECATEGORIES,
//           payload: JSON.parse(value),
//         });
//       }
//     } catch (e) {
//       dispatch(createError(e, GET_ERRORS));
//     }
//   };

//   getData('@issueCategories');
// };

export const addScoutIssue = (
  pointId,
  blockId,
  bedId,
  stationId,
  scout,
  user,
) => dispatch => {
  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        dispatch(
          createError(
            {
              error: 'Please select a station and try again',
            },
            GET_ERRORS,
          ),
        );
      } else {
        const newScout = JSON.parse(value);
        let pointFound = false;

        for (let q = 0; q < newScout.length; q++) {
          const personnel = newScout[q];

          if (personnel.phone === user.phone) {
            for (let r = 0; r < personnel.blocks.length; r++) {
              const block = personnel.blocks[r];

              if (block._id === blockId) {
                for (let s = 0; s < block.beds.length; s++) {
                  const beds = block.beds[s];

                  if (beds._id === bedId) {
                    const stations = beds.stations;

                    // console.log(beds.stations);

                    for (let t = 0; t < stations.length; t++) {
                      if (stations[t]._id === stationId) {
                        const points = stations[t].points;

                        for (let u = 0; u < points.length; u++) {
                          if (points[u]._id === pointId) {
                            pointFound = true;
                            newScout[q].blocks[r].beds[s].stations[t].points[
                              u
                            ].issues.push(scout);
                            break;
                          }
                        }

                        break;
                      }
                    }

                    break;
                  }
                }

                break;
              }
            }
            break;
          }
        }

        storeNewScout(newScout, blockId, bedId, stationId, user);
      }
    } catch (e) {
      console.log(e);
      dispatch(createError(e, GET_ERRORS));
    }
  };

  const storeNewScout = async (newScout, block, bed, station, personnel) => {
    try {
      await AsyncStorage.setItem('@newScout', JSON.stringify(newScout));

      Actions.points({
        personnel: personnel,
        currentBlock: block,
        currentBed: bed,
        currentStation: station,
      });
    } catch (err) {
      dispatch(createError(err, GET_ERRORS));
    }
  };

  getData('@newScout');
};

export const getIssueTypes = () => dispatch => {
  axios
    .get(`issue-type/all`)
    .then(res => {
      dispatch({
        type: FETCH_ISSUETYPES,
        payload: res.data,
      });

      createIssueType(res.data)
        .then()
        .catch(error => {
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
      dispatch(createError(err, GET_ERRORS));
    });
};

export const getIssues = () => dispatch => {
  axios
    .get(`issue/all`)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: FETCH_ISSUES,
        payload: res.data,
      });

      createIssue(res.data)
        .then()
        .catch(error => {
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
      dispatch(createError(err, GET_ERRORS));
    });
};

export const getIssueCategories = () => dispatch => {
  axios
    .get(`issue-category/all`)
    .then(res => {
      dispatch({
        type: FETCH_ISSUECATEGORIES,
        payload: res.data,
      });

      createIssueCategory(res.data)
        .then()
        .catch(error => {
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
      dispatch(createError(err, GET_ERRORS));
    });
};
