import {
    combineReducers
} from 'redux';
import errorReducer from './errorReducer';
import personnelReducer from './personnelReducer';
import dataReducer from './dataReducer';
import scoutReducer from './scoutReducer';
import blocksReducer from './blocksReducer';
import bedsReducer from './bedsReducer';
import stationsReducer from './stationsReducer';
import pointsReducer from './pointsReducer';
import issuesReducer from './issuesReducer';
import plantsReducer from './plantsReducer';

export default combineReducers({
    errors: errorReducer,
    plants: plantsReducer,
    issues: issuesReducer,
    points: pointsReducer,
    stations: stationsReducer,
    beds: bedsReducer,
    blocks: blocksReducer,
    scout: scoutReducer,
    data: dataReducer,
    auth: personnelReducer,
});