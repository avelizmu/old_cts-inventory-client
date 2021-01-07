import {createStore, Store} from "redux";
import rootReducer from './reducers';

import {User} from "./actions/user";
import {LastUpdates} from "./actions/lastUpdates";

export interface IAppState {
    readonly user: User
    readonly lastUpdates: LastUpdates
}

// @ts-ignore
export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());