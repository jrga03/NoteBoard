import firebase from "react-native-firebase";

class _FirebaseService {
    isUserLoggedIn(callback) {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("serive", user);
            return callback(user);
        });
    }

    logInUsingEmail(data, callback) {
        firebase
            .auth()
            .signInWithEmailAndPassword(data.email, data.password)
            .then(() => callback(null, true))
            .catch((error) => callback(error, null));
    }
}

const FirebaseService = new _FirebaseService();

export { FirebaseService };
