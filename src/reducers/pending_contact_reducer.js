import { UPDATE_PENDING_CONTACT_LIST } from "../actions/constants";

export default function(state = [], action) {
    switch (action.type) {
        case UPDATE_PENDING_CONTACT_LIST:
            return action.payload;
        default:
            return state;
    }
}
