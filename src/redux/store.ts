import {createStore, Store} from "redux";
import rootReducer from './reducers';

import {User} from "./actions/user";

export interface IAppState {
    readonly user: User
}

export default createStore(rootReducer);