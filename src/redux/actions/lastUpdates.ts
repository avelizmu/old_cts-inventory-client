import {Action} from "redux";

export type LastUpdates = {
    number: string,
    message: string
}[] | null

export interface SetLastUpdatesActionCreator {
    (lastUpdates: LastUpdates): SetLastUpdatesAction
}

export interface SetLastUpdatesAction extends Action<"SET_LAST_UPDATES"> {
    lastUpdates: LastUpdates
}

export const setLastUpdatesActionCreator: SetLastUpdatesActionCreator = (lastUpdates) => {
    return {
        type: "SET_LAST_UPDATES",
        lastUpdates
    }
}