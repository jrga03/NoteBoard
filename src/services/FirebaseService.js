// import { Platform } from "react-native";
import firebase from "react-native-firebase";

const FirebaseService = {
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
                email: userObj.email,
                photoURL: !!userObj.photoURL ? userObj.photoURL : "",
                providerId: userObj.providerData[0].providerId,
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
                email: reAuthUser.email,
                photoURL: !!reAuthUser.photoURL ? reAuthUser.photoURL : "",
                providerId: reAuthUser.providerData[0].providerId,
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
                email: userObj.email,
                photoURL: !!userObj.photoURL ? userObj.photoURL : "",
                providerId: userObj.providerData[0].providerId,
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

    async fetchNotes(callback) {
        try {
            await firebase
                .database()
                .ref(`/users_notes/${firebase.auth().currentUser.uid}/notes`)
                .orderByChild("lastEditedAtMsec")
                .on("value", (data) => {
                    const notes = [];
                    let index = 0;
                    data.forEach((note) => {
                        const noteObj = note.val();
                        noteObj.overallIndex = index;
                        notes.push(noteObj);
                        index++;
                    });
                    callback(null, notes);
                });
        } catch (error) {
            return callback(error, null);
        }
    },

    async editNote(note, callback) {
        try {
            await firebase
                .database()
                .ref(`/users_notes/${firebase.auth().currentUser.uid}/notes/note${note.id}`)
                .update(note, () => callback(null, true));
        } catch (error) {
            return callback(error, null);
        }
    },

    async deleteNote(id, callback) {
        try {
            await firebase
                .database()
                .ref(`/users_notes/${firebase.auth().currentUser.uid}/notes/note${id}`)
                .remove(() => callback(null, true));
        } catch (error) {
            return callback(error, null);
        }
    },
};

// const FirebaseService = new _FirebaseService();

export { FirebaseService };
