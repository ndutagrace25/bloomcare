import AsyncStorage from '@react-native-community/async-storage';
import {
  Actions
} from 'react-native-router-flux';

import {
  axios,
  createError
} from '../utils';
import {
  createBed
} from '../models/Blocks';

import {
  GET_ERRORS,
  FETCH_BEDS,
  SEARCH_BEDS
} from './types';

// export const fetchBeds = () => dispatch => {

//     getBeds = async (key) => {
//         try {
//             const value = await AsyncStorage.getItem(key);
//             if (value === null || value === false) {
//                 dispatch(createError({
//                     error: "Beds not found"
//                 }, GET_ERRORS));
//             } else {
//                 dispatch({
//                     type: FETCH_BEDS,
//                     payload: JSON.parse(value)
//                 });
//             }
//         } catch (e) {
//             console.log(e);
//             dispatch(createError(e, GET_ERRORS));
//         }
//     }
//     getBeds("@beds");
// }

export const searchBeds = _id => dispatch => {
  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        dispatch(
          createError({
              error: 'Beds not found',
            },
            GET_ERRORS,
          ),
        );
      } else {
        const beds = JSON.parse(value);

        const search = beds.filter(bed => bed._id === _id);
        dispatch({
          type: SEARCH_BEDS,
          payload: search,
        });
      }
    } catch (e) {
      dispatch(createError(e, GET_ERRORS));
    }
  };

  getData('@beds');
};

export const fetchBeds = () => dispatch => {
  axios
    .get('bed/all')
    .then(res => {
      dispatch({
        type: FETCH_BEDS,
        payload: res.data,
      });

      createBed(res.data)
        .then()
        .catch(error => {
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err.response);
      dispatch(createError(err, GET_ERRORS));
    });
};