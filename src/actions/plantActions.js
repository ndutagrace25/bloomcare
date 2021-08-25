import AsyncStorage from '@react-native-community/async-storage';
import {
    Actions
} from 'react-native-router-flux';

import {
    createError
} from '../utils';
import {
    GET_ERRORS,
    SEARCH_PLANTS
}
from "./types";

export const getBedPlant = (bedId) => dispatch => {
    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value === null || value === false) {
                dispatch(createError({
                    error: "Plants not found"
                }, GET_ERRORS));
            } else {
                const plants = JSON.parse(value);

                const search = plants
                    .filter(plant => plant.bed === bedId);
                dispatch({
                    type: SEARCH_PLANTS,
                    payload: search
                });
            }
        } catch (e) {
            dispatch(createError(e, GET_ERRORS));
        }
    }

    getData("@plants");
}