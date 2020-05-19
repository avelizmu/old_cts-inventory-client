import {Action} from "redux";

export type User = {
    id: number,
    username: string,
    name: string,
    pendingPasswordReset: boolean,
    createdAt: string,
    updatedAt: string
} | null

export interface AuthenticateActionCreator {
    (user: User): AuthenticateAction
}

export interface AuthenticateAction extends Action<"AUTHENTICATE"> {
    user: User
}

export const authenticateActionCreator: AuthenticateActionCreator = (user) => {
    return {
        type: "AUTHENTICATE",
        user
    }
}