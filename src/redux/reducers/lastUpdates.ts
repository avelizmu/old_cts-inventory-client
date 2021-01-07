import {SetLastUpdatesAction, LastUpdates} from "../actions/lastUpdates";
import {Reducer} from "redux";

const reducer: Reducer<LastUpdates, SetLastUpdatesAction> = (state: LastUpdates = null, action: SetLastUpdatesAction) => {
    switch (action.type) {
        case "SET_LAST_UPDATES": {
            return action.lastUpdates;
        }
        default: {
            return state;
        }
    }
};

export default reducer;