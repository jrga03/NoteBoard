import { SELECT_CONTACT, CLEAR_SELECTED_CONTACT } from "../actions/constants";

export default function(state = initialState, action) {
    switch (action.type) {
        case SELECT_CONTACT:
            const { displayName, email, id, photoURL, type } = action.payload;
            return {
                displayName,
                email,
                id,
                photoURL,
                type: type === undefined ? "Contact" : type,
            };
        case CLEAR_SELECTED_CONTACT:
            return {};
        default:
            return state;
    }
}

const initialState = {
    displayName: null,
    email: null,
    id: null,
    photoURL: null,
    type: null,
};
