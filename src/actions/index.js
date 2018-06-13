import { CURRENT_USER, GET_GOOGLE } from "../constants";

export function currentUser(user) {
    return {
        type: CURRENT_USER,
        payload: user,
    };
}

export function getGoogleUser() {
    return {
        type: GET_GOOGLE,
    };
}
