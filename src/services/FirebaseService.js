// import { Platform } from "react-native";
import firebase from "react-native-firebase";

// const iosConfig = {
//     clientId:
//         "604168385941-564sugmijrebh8dg3vpt5i2tr5df4bee.apps.googleusercontent.com",
//     appId: "1:604168385941:ios:ac070bda8a2575b8",
//     apiKey: "AIzaSyBK8pCjM1ANlH8oBDgFuUXCJDIPXzFCS10",
//     databaseURL: "https://note-board-1527334009294.firebaseio.com/",
//     storageBucket: "note-board-1527334009294.appspot.com",
//     messagingSenderId: "604168385941",
//     projectId: "note-board-1527334009294",
//     persistence: true,
// };

// const androidConfig = {
//     clientId:
//         "604168385941-s3ir3m3puo5um9hpsig7trvfjfbafreq.apps.googleusercontent.com",
//     appId: "1:604168385941:android:ac070bda8a2575b8",
//     apiKey: "AIzaSyCNFx__Cp3WdKYlK--LeH4KdrgqkxBf3j0",
//     databaseURL: "https://note-board-1527334009294.firebaseio.com/",
//     storageBucket: "note-board-1527334009294.appspot.com",
//     messagingSenderId: "604168385941",
//     projectId: "note-board-1527334009294",
//     persistence: true,
// };

class _FirebaseService {
    isUserLoggedIn(callback) {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("serive", user);
            return callback(user);
        });
    }

    checkIfEmailExists(data, callback) {
        /**
         * REFACTOR to ASYNC
         */
        firebase
            .database()
            .ref("user_emails")
            .on("value", (res) =>
                callback(null, res.val().find((email) => email === data))
            );
    }

    logInUsingEmail(data, callback) {
        /**
         * REFACTOR to ASYNC
         */
        firebase
            .auth()
            .signInAndRetrieveDataWithEmailAndPassword(
                data.email,
                data.password
            )
            .then((data) => {
                // console.log("email login", data.user.toJSON());
                callback(null, data.user.toJSON());
            })
            .catch((error) => callback(error, null));
    }

    async logInUsingSocial(type, data, callback) {
        let credential;
        switch (type) {
            case "Google":
                credential = firebase.auth.GoogleAuthProvider.credential(
                    data.idToken,
                    data.accessToken
                );
                break;
            case "Facebook":
                credential = firebase.auth.FacebookAuthProvider.credential(
                    data
                );
                break;
            default:
                let error = "Please provide type of Social Auth.";
                return callback(error, null);
        }

        try {
            const data = await firebase
                .auth()
                .signInAndRetrieveDataWithCredential(credential);
            return callback(null, data.user.toJSON());
        } catch (error) {
            return callback(error, null);
        }
    }

    async signOut(callback) {
        try {
            await firebase.auth().signOut();
            return callback(null, true);
        } catch (error) {
            return callback(error, null);
        }
    }
}

const FirebaseService = new _FirebaseService();

export { FirebaseService };
