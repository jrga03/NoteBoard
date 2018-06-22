import {
    CURRENT_USER,
    GET_GOOGLE,
    GET_FACEBOOK,
    GET_EMAIL,
} from "../constants";

export function currentUser(user) {
    return {
        type: CURRENT_USER,
        payload: user,
    };
}

export function getEmailUser(email, password) {
    return {
        type: GET_EMAIL,
        payload: {
            email,
            password,
        },
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
