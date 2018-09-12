// import { Platform } from "react-native";
import firebase from "react-native-firebase";

const FirebaseService = {
    currentUser() {
        return firebase.auth().currentUser;
    },

    isUserLoggedIn(callback) {
        firebase.auth().onAuthStateChanged((data) => {
            const user = data ? data.toJSON() : null;
            console.log("authstatechange", user);
            return callback(null, user);
        });
    },

    async checkIfEmailExists(data, callback) {
        try {
            // const methods = await firebase.auth().fetchSignInMethodsForEmail(data);

            return callback(null, await firebase.auth().fetchSignInMethodsForEmail(data));
        } catch (error) {
            return callback(error, null);
        }
    },

    async logInUsingEmail({ email, password }, callback) {
        try {
            const { user } = await firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password);
            const userObj = user.toJSON();

            const userToDB = {
                displayName: userObj.displayName,
                displayNameLowerCase: userObj.displayName.toLowerCase(),
                email: userObj.email,
                emailLowerCase: userObj.email.toLowerCase(),
                photoURL: !!userObj.photoURL ? userObj.photoURL : "",
                providerId: userObj.providerData[0].providerId,
                id: userObj.uid,
            };

            await firebase
                .database()
                .ref(`/users/${userObj.uid}`)
                .update(userToDB, () => callback(null, userObj));

            // return callback(null, result.user.toJSON());
        } catch (error) {
            // console.log("loginUsingEmail error", error)
            return callback(error, null);
        }
        // firebase
        //     .auth()
        //     .signInAndRetrieveDataWithEmailAndPassword(
        //         data.email,
        //         data.password
        //     )
        //     .then((data) => {
        //         // console.log("email login", data.user.toJSON());
        //         callback(null, data.user.toJSON());
        //     })
        //     .catch((error) => callback(error, null));
    },

    async forgotPassword(email, callback) {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            // console.log("send pw reset", res);

            return callback(null, true);
        } catch (error) {
            // console.log("error pw reset", error);
            return callback(error, null);
        }
    },

    async registerUser({ email, password, displayName }, callback) {
        try {
            // const result = await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password);

            const { user } = await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password);

            await user.updateProfile({ displayName });

            const credential = firebase.auth.EmailAuthProvider.credential(email, password);
            const { user: reAuth } = await user.reauthenticateAndRetrieveDataWithCredential(credential);

            await reAuth.sendEmailVerification();
            const reAuthUser = reAuth.toJSON();

            const userToDB = {
                displayName: reAuthUser.displayName,
                displayNameLowerCase: reAuthUser.displayName.toLowerCase(),
                email: reAuthUser.email,
                emailLowerCase: reAuthUser.email.toLowerCase(),
                photoURL: !!reAuthUser.photoURL ? reAuthUser.photoURL : "",
                providerId: reAuthUser.providerData[0].providerId,
                id: reAuthUser.uid,
            };

            await firebase
                .database()
                .ref(`/users/${reAuthUser.uid}`)
                .update(userToDB, () => callback(null, reAuthUser));

            // return callback(null, reAuthUser.toJSON());
        } catch (error) {
            return callback(error, null);
        }
    },

    async logInUsingSocial(type, data, callback) {
        let credential;
        switch (type) {
            case "Google":
                credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                break;
            case "Facebook":
                credential = firebase.auth.FacebookAuthProvider.credential(data);
                break;
            default:
                let error = "Please provide type of Social Auth.";
                return callback(error, null);
        }

        try {
            const { user } = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
            const userObj = user.toJSON();

            if (userObj.metadata.creationTime === userObj.metadata.lastSignInTime) {
                await user.sendEmailVerification();
            }

            const userToDB = {
                displayName: userObj.displayName,
                displayNameLowerCase: userObj.displayName.toLowerCase(),
                email: userObj.email,
                emailLowerCase: userObj.email.toLowerCase(),
                photoURL: !!userObj.photoURL ? userObj.photoURL : "",
                providerId: userObj.providerData[0].providerId,
                id: userObj.uid,
            };

            await firebase
                .database()
                .ref(`/users/${userObj.uid}`)
                .update(userToDB, () => callback(null, userObj));

            // return callback(null, user.toJSON());
        } catch (error) {
            return callback(error, null);
        }
    },

    async signOut(callback) {
        try {
            await firebase.auth().signOut();
            return callback(null, true);
        } catch (error) {
            return callback(error, null);
        }
    },

    // async fetchNotes(callback) {
    //     try {
    //         await firebase
    //             .database()
    //             .ref(`/users_notes/${firebase.auth().currentUser.uid}/notes`)
    //             .orderByChild("lastEditedAtMsec")
    //             .on("value", (data) => {
    //                 const notes = [];
    //                 let index = 0;
    //                 data.forEach((note) => {
    //                     const noteObj = note.val();
    //                     noteObj.overallIndex = index;
    //                     notes.push(noteObj);
    //                     index++;
    //                 });
    //                 callback(null, notes);
    //             });
    //     } catch (error) {
    //         return callback(error, null);
    //     }
    // },

    fetchNotes(callback) {
        firebase
            .database()
            .ref(`/users_notes/${firebase.auth().currentUser.uid}`)
            .orderByChild("lastEditedAtMsec")
            .once("value", callback);
    },

    addNotesListener(callback) {
        firebase
            .database()
            .ref(`/users_notes/${firebase.auth().currentUser.uid}`)
            .orderByChild("lastEditedAtMsec")
            .on("value", callback);
    },

    removeNotesListener(callback) {
        firebase
            .database()
            .ref(`/users_notes/${firebase.auth().currentUser.uid}`)
            .orderByChild("lastEditedAtMsec")
            .off("value", callback);
    },

    addCollaborationNotesListener(callback) {
        firebase
            .database()
            .ref(`/collaboration_notes/${firebase.auth().currentUser.uid}`)
            .on("value", callback);
    },

    removeCollaborationNotesListener(callback) {
        firebase
            .database()
            .ref(`/collaboration_notes/${firebase.auth().currentUser.uid}`)
            .off("value", callback);
    },

    async editNote(note, callback) {
        try {
            await firebase
                .database()
                .ref(`/users_notes/${firebase.auth().currentUser.uid}/note${note.id}`)
                .update(note, () => callback(null, true));
        } catch (error) {
            return callback(error, null);
        }
    },

    async deleteNote(id, callback) {
        try {
            await firebase
                .database()
                .ref(`/users_notes/${firebase.auth().currentUser.uid}/note${id}`)
                .remove(() => callback(null, true));
        } catch (error) {
            return callback(error, null);
        }
    },

    fetchContacts(callback) {
        firebase
            .database()
            .ref(`/contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .once("value", callback);
    },

    addContactsListener(callback) {
        firebase
            .database()
            .ref(`/contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .on("value", callback);
    },

    removeContactsListener(callback) {
        firebase
            .database()
            .ref(`/contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .off("value", callback);
    },

    fetchPendingContacts(callback) {
        firebase
            .database()
            .ref(`/pending_contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .once("value", callback);
    },

    addPendingContactListener(callback) {
        firebase
            .database()
            .ref(`/pending_contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .on("value", callback);
    },

    removePendingContactListener(callback) {
        firebase
            .database()
            .ref(`/pending_contacts/${firebase.auth().currentUser.uid}`)
            .orderByValue()
            .equalTo(true)
            .off("value", callback);
    },

    fetchContactInfo(contact_id) {
        return firebase
            .database()
            .ref(`/users/${contact_id}`)
            .once("value");
    },

    async searchContact(searchString) {
        const nameSearch = await firebase
            .database()
            .ref(`/users`)
            .orderByChild("displayNameLowerCase")
            .startAt(searchString)
            .endAt(searchString + "\uf8ff")
            .once("value");
        const emailSearch = await firebase
            .database()
            .ref(`/users`)
            .orderByChild("emailLowerCase")
            .startAt(searchString)
            .endAt(searchString + "\uf8ff")
            .once("value");

        const nameSearchResult = nameSearch.exists() ? nameSearch.toJSON() : {};
        const emailSearchResult = emailSearch.exists() ? emailSearch.toJSON() : {};

        return { ...nameSearchResult, ...emailSearchResult };
    },

    async fetchContactRequests() {
        try {
            const contactRequests = await firebase
                .database()
                .ref("/pending_contacts")
                .orderByChild(firebase.auth().currentUser.uid)
                .equalTo(true)
                .once("value");

            return contactRequests.exists() ? Object.keys(contactRequests.toJSON()) : [];
        } catch (error) {
            console.log("error fetch contact request", error);
        }
    },

    async acceptContactRequest(contact_id) {
        // console.log("ACCEPT");
        try {
            await firebase
                .database()
                .ref(`/pending_contacts/${firebase.auth().currentUser.uid}/${contact_id}`)
                .set(false);
            await firebase
                .database()
                .ref(`/contacts/${firebase.auth().currentUser.uid}/${contact_id}`)
                .set(true);
            await firebase
                .database()
                .ref(`/contacts/${contact_id}/${firebase.auth().currentUser.uid}`)
                .set(true);
        } catch (error) {
            console.log("error accept request", error);
        }
    },

    async rejectContactRequest(contact_id) {
        // console.log("REJECT");
        try {
            await firebase
                .database()
                .ref(`/pending_contacts/${firebase.auth().currentUser.uid}/${contact_id}`)
                .set(false);
        } catch (error) {
            console.log("error reject request", error);
        }
    },

    async addContactRequest(contact_id, callback) {
        // console.log("ADD");
        try {
            await firebase
                .database()
                .ref(`/pending_contacts/${contact_id}/${firebase.auth().currentUser.uid}`)
                .set(true, callback(null, true));
        } catch (error) {
            callback(error, null);
        }
    },

    async cancelContactRequest(contact_id, callback) {
        // console.log("CANCEL");
        try {
            await firebase
                .database()
                .ref(`/pending_contacts/${contact_id}/${firebase.auth().currentUser.uid}`)
                .set(false, callback(null, true));
        } catch (error) {
            callback(error, null);
        }
    },

    async deleteContact(contact_id) {
        // console.log("CANCEL");
        try {
            await firebase
                .database()
                .ref(`/contacts/${firebase.auth().currentUser.uid}/${contact_id}`)
                .set(false);
            await firebase
                .database()
                .ref(`/contacts/${contact_id}/${firebase.auth().currentUser.uid}`)
                .set(false);
        } catch (error) {
            console.log("error deleting contact", error);
        }
    },

    async uploadFile(uri, type, callback) {
        let ref;
        switch (type) {
            case "map_snapshot":
                ref = `/map_snapshots/${uri.split("/").pop()}`;
                break;
            case "profile_photo":
                ref = `/profile_photos/${uri.split("/").pop()}`;
                break;
            default:
                ref = `/${uri.split("/").pop()}`;
        }
        await firebase
            .storage()
            .ref(ref)
            .putFile(uri, { contentType: "image/png" })
            .then((uploadedFile) => {
                if (uploadedFile.state == "success") {
                    callback(null, uploadedFile.downloadURL);
                } else {
                    throw "Upload failed";
                }
            })
            .catch((error) => callback(error, null));
        // console.log("uploaded", test);
    },

    uploadFileListener(uri, type, otherData, ...callbacks) {
        let ref;
        switch (type) {
            case "note_image":
                ref = `/note_images/u${firebase.auth().currentUser.uid}/n${otherData.noteId}/${uri.split("/").pop()}`;
                break;
            default:
                ref = `/${uri.split("/").pop()}`;
        }
        return firebase
            .storage()
            .ref(ref)
            .putFile(uri)
            .on("state_changed", ...callbacks);
    },

    async fetchCollaboratorPhotos(collaboratorsIds) {
        const collaboratorsPhotos = [];
        for (let id of collaboratorsIds) {
            let photo = await firebase
                .database()
                .ref(`/users/${id}/photoURL`)
                .once("value");
            collaboratorsPhotos.push(photo.val());
        }
        return collaboratorsPhotos;
    },
};

// const FirebaseService = new _FirebaseService();

export { FirebaseService };
