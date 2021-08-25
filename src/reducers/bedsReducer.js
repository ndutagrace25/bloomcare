import {
    FETCH_BEDS,
    SEARCH_BEDS
} from '../actions/types';

const initialState = {
    beds: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_BEDS:
            return {
                ...state,
                beds: action.payload
            };
        case SEARCH_BEDS:
            return {
                ...state,
                beds: action.payload
            };
        default:
            return state;
    }
}