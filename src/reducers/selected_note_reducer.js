import Moment from "moment";
import { SELECT_NOTE, EDIT_NOTE_TITLE, EDIT_NOTE_CONTENT } from "../actions/constants";

export default function(state = {}, action) {
    switch (action.type) {
        case SELECT_NOTE:
            return {
                note: action.payload,
                index: action.index,
            };
        case EDIT_NOTE_TITLE:
            return {
                ...state,
                note: {
                    ...state.note,
                    title: action.payload,
                    lastEditedAt: Moment().format("x"),
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
                    lastEditedAt: Moment().format("x"),
                },
            };
        default:
            return state;
    }
}
