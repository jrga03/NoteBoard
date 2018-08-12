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
    UPDATE_NOTE_LIST,
    EDIT_NOTE_CONTENT,
    EDIT_NOTE_TITLE,
    EDIT_NOTE_ITEM,
    CREATE_NEW_NOTE,
    DELETE_NOTE,
    TOGGLE_PIN,
    UPDATE_SELECTED_NOTE,
    UPDATE_CONTACT_LIST,
    UPDATE_PENDING_CONTACT_LIST,
    SEARCH_CONTACT,
    UPDATE_CONTACT_LIST_SUCCESS,
    UPDATE_PENDING_CONTACT_LIST_SUCCESS,
    CLEAR_SELECTED_NOTE,
    SELECT_CONTACT,
    CLEAR_SELECTED_CONTACT,
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

export function updateNoteList(newList) {
    return {
        type: UPDATE_NOTE_LIST,
        payload: newList,
    };
}

export function editNoteTitle(text) {
    return {
        type: EDIT_NOTE_TITLE,
        payload: text,
    };
}

export function editNoteContent(index, payload) {
    return {
        type: EDIT_NOTE_CONTENT,
        payload,
        index,
    };
}

export function togglePin(index) {
    return {
        type: TOGGLE_PIN,
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

export function deleteNote(id) {
    return {
        type: DELETE_NOTE,
        payload: id,
    };
}

export function updateSelectedNote(note) {
    return {
        type: UPDATE_SELECTED_NOTE,
        payload: note,
    };
}

export function clearSelectedNote() {
    return {
        type: CLEAR_SELECTED_NOTE,
    };
}

export function fetchContactList() {
    return {
        type: UPDATE_CONTACT_LIST,
    };
}

export function updateContactList(contacts) {
    return {
        type: UPDATE_CONTACT_LIST_SUCCESS,
        payload: contacts,
    };
}

export function fetchPendingContactList() {
    return {
        type: UPDATE_PENDING_CONTACT_LIST,
    };
}

export function updatePendingContactList(contacts) {
    return {
        type: UPDATE_PENDING_CONTACT_LIST_SUCCESS,
        payload: contacts,
    };
}

export function searchContact(searchString) {
    return {
        type: SEARCH_CONTACT,
        payload: searchString,
    };
}

export function selectContact(contact) {
    return {
        type: SELECT_CONTACT,
        payload: contact,
    };
}

export function clearSelectedContact() {
    return {
        type: CLEAR_SELECTED_CONTACT,
    };
}
