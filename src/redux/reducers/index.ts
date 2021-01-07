import {combineReducers} from "redux";
import user from './user';
import lastUpdates from './lastUpdates';

export default combineReducers({user, lastUpdates});