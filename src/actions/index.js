import {
    CURRENT_USER,
    GET_GOOGLE,
    GET_FACEBOOK,
    GET_EMAIL,
    LOGOUT_USER,
    LOGIN_REQUEST,
    LOGIN,
    REGISTER_USER,
    OPEN_NOTE,
    NOTE_LIST_REQUEST,
    EDIT_NOTE_CONTENT,
    EDIT_NOTE_TITLE,
    EDIT_NOTE_ITEM,
    CREATE_NEW_NOTE,
} from "./constants";

export function loginFlowStart() {
    return {
        type: LOGIN,
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

export function registerEmailUser(user) {
    return {
        type: REGISTER_USER,
        payload: user,
    };
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
    };
}

export function getNoteList() {
    return {
        type: NOTE_LIST_REQUEST,
        // payload
    };
}

export function editNoteTitle(text) {
    return {
        type: EDIT_NOTE_TITLE,
        payload: text,
    };
}

export function editNoteContent(index, text) {
    return {
        type: EDIT_NOTE_CONTENT,
        payload: text,
        index,
    };
}

export function openNote(index, note) {
    return {
        type: OPEN_NOTE,
        payload: note,
        index,
    };
}

export function editNoteItem(index, item) {
    return {
        type: EDIT_NOTE_ITEM,
        index,
        payload: item,
    };
}

export function createNote(type) {
    return {
        type: CREATE_NEW_NOTE,
        payload: type,
    };
}
