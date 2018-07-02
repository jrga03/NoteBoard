import { FirebaseService, GoogleService, FacebookService } from "../services";

const auth = {
    loginEmail(credentials, callback) {
        FirebaseService.logInUsingEmail(credentials, (err, res) => {
            return callback(err, res);
        });
    },
    loginGoogle() {
        GoogleService.signIn((err, res) => {
            return callback(err, res);
        });
    },
    loginFacebook() {
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
    register(email, password) {},
};

export default auth;
