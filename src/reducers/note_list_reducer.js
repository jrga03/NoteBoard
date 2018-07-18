import { UPDATE_NOTE_LIST } from "../actions/constants";

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NOTE_LIST:
            return action.payload;
        default:
            return state;
    }
}
const initialState = [];
