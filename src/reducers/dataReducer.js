import {
    FETCH_DATA
} from '../actions/types';

const initialState = {
    appData: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_DATA:
            return {
                ...state,
                appData: action.payload
            };
        default:
            return state;
    }
}