import { combineReducers } from "redux";
import User from "./user_reducer";
import SelectedNote from "./selected_note_reducer";
import NoteList from "./note_list_reducer";
import ContactList from "./contacts_reducer";
import PendingContactList from "./pending_contact_reducer";
import Loading from "./loading_reducer";
import SearchContactList from "./search_contact_reducer";

const rootReducer = combineReducers({
    user: User,
    selectedNote: SelectedNote,
    noteList: NoteList,
    contactList: ContactList,
    pendingContactList: PendingContactList,
    loading: Loading,
    searchContactList: SearchContactList,
});

export default rootReducer;
