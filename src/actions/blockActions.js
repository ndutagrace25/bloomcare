import AsyncStorage from '@react-native-community/async-storage';
import {
  Actions
} from 'react-native-router-flux';

import {
  axios,
  createError
} from '../utils';

import {
  createBlock
} from '../models/Blocks';

import {
  GET_ERRORS,
  FETCH_BLOCKS,
  SEARCH_BLOCKS
} from './types';

export const fetchBlocks2 = () => dispatch => {
  getBlocks = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null || value === false) {
        dispatch(
          createError({
              error: 'Blocks not found',
            },
            GET_ERRORS,
          ),
        );
      } else {
        dispatch({
          type: FETCH_BLOCKS,
          payload: JSON.parse(value),
        });
      }
    } catch (e) {
      console.log(e);
      dispatch(createError(e, GET_ERRORS));
    }
  };
  getBlocks('@blocks');
};

export const searchBlocks = _id => dispatch => {
  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null || value === false) {
        dispatch(
          createError({
              error: 'Blocks not found',
            },
            GET_ERRORS,
          ),
        );
      } else {
        const blocks = JSON.parse(value);

        const search = blocks.filter(block => block._id === _id);

        dispatch({
          type: SEARCH_BLOCKS,
          payload: search,
        });
      }
    } catch (e) {
      dispatch(createError(e, GET_ERRORS));
    }
  };

  getData('@blocks');
};

export const fetchBlocks = () => dispatch => {
  axios
    .get('block/all')
    .then(res => {
      dispatch({
        type: FETCH_BLOCKS,
        payload: res.data,
      });

      createBlock(res.data)
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