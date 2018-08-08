import { SEARCH_CONTACT_SUCCESS } from "../actions/constants";

export default function(state = [], action) {
    switch (action.type) {
        case SEARCH_CONTACT_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
