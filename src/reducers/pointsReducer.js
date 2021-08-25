import {
    FETCH_POINTS
} from '../actions/types';

const initialState = {
    points: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_POINTS:
            return {
                ...state,
                points: action.payload.items
            };
        default:
            return state;
    }
}