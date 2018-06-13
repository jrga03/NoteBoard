import {
    CURRENT_USER,
    GET_GOOGLE,
    GET_GOOGLE_SUCCESS,
    GET_GOOGLE_FAIL,
} from "../constants";

const initialState = {
    isFetching: false,
    user: null,
    error: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CURRENT_USER:
            return action.payload;
        case GET_GOOGLE:
            return { ...state, isFetching: true };
        case GET_GOOGLE_SUCCESS:
            return { ...state, isFetching: false, user: action.user };
        case GET_GOOGLE_FAIL:
            return {
                ...state,
                isFetching: false,
                user: null,
                error: action.error,
            };
    }
    return state;
}
