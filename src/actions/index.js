import {
    CURRENT_USER,
    GET_GOOGLE,
    GET_FACEBOOK,
    GET_EMAIL,
    LOGOUT_USER,
} from "../constants";

export function currentUser(user) {
    return {
        type: CURRENT_USER,
        payload: user,
    };
}

export function getEmailUser(user) {
    return {
        type: GET_EMAIL,
        payload: user,
    };
}

export function getGoogleUser() {
    return {
        type: GET_GOOGLE,
    };
}

export function getFacebookUser() {
    return {
        type: GET_FACEBOOK,
    };
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
    };
}
