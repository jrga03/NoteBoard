import { FirebaseService, GoogleService, FacebookService } from "../services";

const auth = {
    loginEmail(credentials, callback) {
        FirebaseService.logInUsingEmail(credentials, (err, res) => {
            return callback(err, res);
        });
    },
    loginGoogle(callback) {
        GoogleService.signIn((err, res) => {
            return callback(err, res);
        });
    },
    loginFacebook(callback) {
        FacebookService.signIn((err, res) => {
            return callback(err, res);
        });
    },
    logout() {
        FirebaseService.signOut((err, res) => {
            if (err) {
                console.log(err);
            }
        });
    },
    loggedIn(callback) {
        return FirebaseService.isUserLoggedIn((err, user) =>
            callback(err, user)
        );
    },
    register(credentials, callback) {
        FirebaseService.registerUser(credentials, (err, res) => {
            return callback(err, res);
        });
    },
};

export default auth;
