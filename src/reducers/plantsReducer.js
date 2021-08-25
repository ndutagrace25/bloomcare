import {
    SEARCH_PLANTS
} from '../actions/types';

const initialState = {
    plant: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SEARCH_PLANTS:
            return {
                ...state,
                plant: action.payload[0]
            };
        default:
            return state;
    }
}