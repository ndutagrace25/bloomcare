import {
    isEmpty
} from '../utils';
import {
    SET_CURRENT_PERSONNEL,
    SET_PASSWORD_RESET,
    PERSONNEL_ERRORS
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    personnel: {},
    reset: false,
    errors: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_PERSONNEL:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                    personnel: action.payload
            };
        case SET_PASSWORD_RESET:
            return {
                ...state,
                reset: true
            };
        case PERSONNEL_ERRORS:
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
}