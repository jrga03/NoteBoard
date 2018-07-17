import Moment from "moment";
import { OPEN_NOTE, EDIT_NOTE_TITLE, EDIT_NOTE_CONTENT, EDIT_NOTE_ITEM, CREATE_NEW_NOTE } from "../actions/constants";

export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_NEW_NOTE:
            return {
                index: null,
                note: {
                    ...initialState,
                    type: action.payload,
                },
            };
        case OPEN_NOTE:
            return {
                note: action.payload,
                index: action.index,
            };
        case EDIT_NOTE_ITEM:
            return initialState;
        case EDIT_NOTE_TITLE:
            return {
                ...state,
                note: {
                    ...state.note,
                    title: action.payload,
                    lastEditedAt: Moment().toISOString(),
                },
            };
        case EDIT_NOTE_CONTENT:
            const { contents } = state.note;
            const item = contents[action.index];
            item.content = action.payload;
            contents.splice(action.index, 1, item);

            return {
                ...state,
                note: {
                    ...state.note,
                    contents,
                    lastEditedAt: Moment().toISOString(),
                },
            };
        default:
            return state;
    }
}

const initialState = {
    id: Date.now(),
    title: "",
    type: null,
    contents: [
        {
            checked: false,
            content: "",
        },
    ],
    lastEditedAt: Moment().toISOString(),
    pinned: false,
};
