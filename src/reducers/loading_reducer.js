import {
    SEARCH_CONTACT_REQUEST,
    SEARCH_CONTACT_SUCCESS,
    SEARCH_CONTACT_FAIL,
    UPDATE_NOTE_LIST,
    UPDATE_CONTACT_LIST,
    UPDATE_PENDING_CONTACT_LIST,
    UPDATE_NOTE_LIST_FAIL,
    UPDATE_NOTE_LIST_SUCCESS,
    UPDATE_CONTACT_LIST_FAIL,
    UPDATE_CONTACT_LIST_SUCCESS,
    UPDATE_PENDING_CONTACT_LIST_FAIL,
    UPDATE_PENDING_CONTACT_LIST_SUCCESS,
} from "../actions/constants";

export default function(state = false, action) {
    switch (action.type) {
        case SEARCH_CONTACT_REQUEST:
        case UPDATE_NOTE_LIST:
        case UPDATE_CONTACT_LIST:
        case UPDATE_PENDING_CONTACT_LIST:
            return true;
        case SEARCH_CONTACT_SUCCESS:
        case SEARCH_CONTACT_FAIL:
        case UPDATE_NOTE_LIST_SUCCESS:
        case UPDATE_NOTE_LIST_FAIL:
        case UPDATE_CONTACT_LIST_SUCCESS:
        case UPDATE_CONTACT_LIST_FAIL:
        case UPDATE_PENDING_CONTACT_LIST_SUCCESS:
        case UPDATE_PENDING_CONTACT_LIST_FAIL:
            return false;
        default:
            return state;
    }
}
