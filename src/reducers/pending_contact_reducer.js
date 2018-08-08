import { UPDATE_PENDING_CONTACT_LIST_SUCCESS } from "../actions/constants";

export default function(state = [], action) {
    switch (action.type) {
        case UPDATE_PENDING_CONTACT_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}