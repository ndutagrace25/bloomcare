import {
    FETCH_SCOUT,
    FETCH_NEW_SCOUT,
    STATIONS,
    SCOUT_ERRORS
} from '../actions/types';

const initialState = {
    scout: {},
    newScout: [],
    stations: [],
    errors: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_SCOUT:
            return {
                ...state,
                scout: action.payload
            };
        case FETCH_NEW_SCOUT:
            return {
                ...state,
                newScout: action.payload
            };
        case STATIONS:
            return {
                ...state,
                stations: action.payload
            };
        case SCOUT_ERRORS:
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
}