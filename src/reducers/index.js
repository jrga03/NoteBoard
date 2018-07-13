import { combineReducers } from "redux";
import User from "./reducer_user";
import SelectedNote from "./reducer_selected_note";

const rootReducer = combineReducers({
    user: User,
    selectedNote: SelectedNote,
});

export default rootReducer;
