import { combineReducers } from "redux";
import User from "./user_reducer";
import SelectedNote from "./selected_note_reducer";
import NoteList from "./note_list_reducer";

const rootReducer = combineReducers({
    user: User,
    selectedNote: SelectedNote,
    noteList: NoteList,
});

export default rootReducer;
