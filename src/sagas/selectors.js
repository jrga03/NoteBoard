export const getContacts = (state) => state.contactList;

export const getPendingContacts = (state) => state.pendingContactList;

export const getSelectedNote = (state) => state.selectedNote;

export const getNoteList = (state) => state.noteList;

export const getNote = (state, id) => state.noteList[id];
