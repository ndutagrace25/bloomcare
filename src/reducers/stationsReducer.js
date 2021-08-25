import {
    FETCH_STATIONS
} from '../actions/types';

const initialState = {
    stations: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_STATIONS:
            return {
                ...state,
                stations: action.payload
            };
        default:
            return state;
    }
}