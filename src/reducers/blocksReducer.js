import {
    FETCH_BLOCKS,
    SEARCH_BLOCKS
} from '../actions/types';

const initialState = {
    blocks: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_BLOCKS:
            return {
                ...state,
                blocks: action.payload
            };
        case SEARCH_BLOCKS:
            return {
                ...state,
                blocks: action.payload
            };
        default:
            return state;
    }
}