import {AuthenticateAction, User} from "../actions/user";
import {Reducer} from "redux";

const reducer: Reducer<User, AuthenticateAction> = (state: User = null, action: AuthenticateAction) => {
    switch (action.type) {
        case "AUTHENTICATE": {
            return action.user;
        }
        default: {
            return state;
        }
    }
};

export default reducer;