import Moment from "moment";
import {
    OPEN_NOTE,
    EDIT_NOTE_TITLE,
    EDIT_NOTE_CONTENT,
    CREATE_NEW_NOTE,
    CLEAR_SELECTED_NOTE,
    TOGGLE_PIN,
} from "../actions/constants";

export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_NEW_NOTE:
            return {
                ...initialState,
                index: null,
                note: {
                    ...initialState.note,
                    id: `${Date.now()}`,
                    title: "",
                    type: action.payload,
                    contents: [
                        {
                            content: "",
                            checked: false,
                        },
                    ],
                    lastEditedAt: Moment().toISOString(),
                    lastEditedAtMsec: -Date.now(),
                    pinned: false,
                },
            };
        case OPEN_NOTE:
            return {
                note: action.payload,
                index: action.index,
            };
        case CLEAR_SELECTED_NOTE:
            return {};
        case EDIT_NOTE_TITLE:
            return {
                ...state,
                note: {
                    ...state.note,
                    title: action.payload,
                    lastEditedAt: Moment().toISOString(),
                    lastEditedAtMsec: -Date.now(),
                },
            };
        case EDIT_NOTE_CONTENT:
            const { contents } = state.note;
            const item = contents[action.index];
            item.content = action.payload.content;
            item.checked = action.payload.checked;
            contents.splice(action.index, 1, item);

            return {
                ...state,
                note: {
                    ...state.note,
                    contents,
                    lastEditedAt: Moment().toISOString(),
                    lastEditedAtMsec: -Date.now(),
                },
            };
        case TOGGLE_PIN:
            return {
                ...state,
                note: {
                    ...state.note,
                    pinned: !state.note.pinned,
                },
            };
        default:
            return state;
    }
}

const initialState = {
    index: null,
    note: {
        id: null,
        title: null,
        type: null,
        contents: [
            {
                checked: false,
                content: null,
            },
        ],
        lastEditedAt: null,
        lastEditedAtMsec: null,
        pinned: false,
    },
};
