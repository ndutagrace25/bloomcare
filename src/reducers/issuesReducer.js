import {
    FETCH_ISSUETYPES,
    FETCH_ISSUES,
    FETCH_ISSUECATEGORIES
} from '../actions/types';

const initialState = {
    issueTypes: [],
    issues: [],
    issueCategories: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_ISSUETYPES:
            return {
                ...state,
                issueTypes: action.payload
            };
        case FETCH_ISSUES:
            return {
                ...state,
                issues: action.payload
            };
        case FETCH_ISSUECATEGORIES:
            return {
                ...state,
                issueCategories: action.payload
            };
        default:
            return state;
    }
}