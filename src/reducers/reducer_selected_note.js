import { SELECT_NOTE } from "../actions/constants";

export default function(state = {}, action) {
    switch (action.type) {
        case SELECT_NOTE:
            return action.payload;
        default:
            return state;
    }
}
