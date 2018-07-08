import {
    put,
    take,
    takeLatest,
    call,
    all,
    fork,
    cps,
    race,
} from "redux-saga/effects";
import {
    CURRENT_USER,
    GET_GOOGLE,
    GET_GOOGLE_FAIL,
    GET_GOOGLE_SUCCESS,
    GET_FACEBOOK,
    GET_FACEBOOK_FAIL,
    GET_FACEBOOK_SUCCESS,
    GET_EMAIL,
    GET_EMAIL_FAIL,
    GET_EMAIL_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    LOGIN_REQUEST,
    LOGIN_FAIL,
    REGISTER_USER,
    LOGIN,
} from "../actions/constants";
import {
    GoogleService,
    FacebookService,
    FirebaseService,
    NavigationService,
} from "../services";
import authentication from "../auth";

function navigateTo(route = "Home") {
    NavigationService.navigate(route);
}

/**
 *
 *
 *
 *
 * TEMPLATE FLOWS
 *
 *
 *
 *
 */

/**
 * Effect to handle authorization
 * @param  {string} username               The username of the user
 * @param  {string} password               The password of the user
 * @param  {object} options                Options
 * @param  {boolean} options.isRegistering Is this a register request?
 */
function* authorize() {
    // We send an action that tells Redux we're sending a request
    yield put({ type: "SENDING_REQUEST", sending: true });

    // We then try to register or log in the user, depending on the request
    try {
        // const salt = genSalt(username);
        // const hash = hashSync(password, salt);
        let user = yield cps(authentication.loggedIn);

        if (!user) {
            navigateTo("SignIn");

            const request = yield take([
                GET_EMAIL,
                GET_FACEBOOK,
                GET_GOOGLE,
                // REGISTER_USER,
            ]);

            switch (request.type) {
                case GET_EMAIL:
                    user = yield cps(
                        authentication.loginEmail,
                        request.payload
                    );
                    break;
                case GET_FACEBOOK:
                    user = yield cps(authentication.loginFacebook);
                    break;
                case GET_GOOGLE:
                    user = yield cps(authentication.loginGoogle);
                    break;
                // case REGISTER_USER:
                //     user = yield cps(authentication.register, request.payload);
                //     break;
                default:
                    throw "NO ACTION MATCHED";
            }

            // // For either log in or registering, we call the proper function in the `auth`
            // // module, which is asynchronous. Because we're using generators, we can work
            // // as if it's synchronous because we pause execution until the call is done
            // // with `yield`!
            // if (isRegistering) {
            //     user = yield call(auth.register, username, hash);
            // } else {
            //     user = yield call(auth.login, username, hash);
            // }
        }

        return user;
    } catch (error) {
        // If we get an error we send Redux the appropiate action and return
        yield put({ type: LOGIN_FAIL, error });
        return false;
    } finally {
        // When done, we tell Redux we're not in the middle of a request any more
        yield put({ type: "SENDING_REQUEST", sending: false });
    }
}

/**
 * Effect to handle logging out
 */
function* logout() {
    // We tell Redux we're in the middle of a request
    yield put({ type: "SENDING_REQUEST", sending: true });

    // Similar to above, we try to log out by calling the `logout` function in the
    // `auth` module. If we get an error, we send an appropiate action. If we don't,
    // we return the response.
    try {
        const response = yield call(auth.logout);
        yield put({ type: "SENDING_REQUEST", sending: false });

        return response;
    } catch (error) {
        yield put({ type: "REQUEST_ERROR", error: error.message });
    }
}

/**
 * Log in saga
 */
function* loginFlow() {
    while (true) {
        yield take(LOGIN);

        const winner = yield race({
            auth: call(authorize),
            logout: take(LOGOUT_USER),
        });

        // console.log("winner", winner);

        if (winner.auth) {
            // ...we send Redux appropiate actions
            yield put({ type: LOGIN_SUCCESS, user: winner.auth }); // User is logged in (authorized)
            navigateTo("Home"); // Go to dashboard page
        }

        // const loggedInUser = yield call(authentication.loggedIn());

        // if (loggedInUser !== null) {
        //     yield put({ type: LOGIN_SUCCESS, user: loggedInUser });
        //     navigateTo("Home");
        // } else {
        //     const request = yield take([GET_EMAIL, GET_FACEBOOK, GET_GOOGLE]);

        //     let user;
        //     if (request.type === GET_EMAIL) {
        //         const { payload } = request;
        //         const winner = yield race({
        //             auth: call(logInEmail, payload),
        //             logout: take(LOGOUT_USER),
        //         });
        //         user = yield call(logInEmail, payload);
        //     } else if (request.type === GET_FACEBOOK) {
        //         user = null;
        //     } else if (request.type === GET_GOOGLE) {
        //         user = null;
        //     }
        // }

        // If `authorize` was the winner...
        // if (winner.auth) {
        //     // ...we send Redux appropiate actions
        //     yield put({ type: "SET_AUTH", newAuthState: true }); // User is logged in (authorized)
        //     yield put({
        //         type: "CHANGE_FORM",
        //         newFormState: { username: "", password: "" },
        //     }); // Clear form
        //     forwardTo("/dashboard"); // Go to dashboard page
        // }
    }
}

/**
 * Log out saga
 * This is basically the same as the `if (winner.logout)` of above, just written
 * as a saga that is always listening to `LOGOUT` actions
 */
function* logoutFlow() {
    while (true) {
        yield take(LOGOUT_USER);
        // yield put({ type: "SET_AUTH", newAuthState: false });

        yield call(authentication.logout);
        navigateTo("SignIn");
    }
}

/**
 * Register saga
 * Very similar to log in saga!
 */
function* registerFlow() {
    while (true) {
        // We always listen to `REGISTER_REQUEST` actions
        const request = yield take(REGISTER_USER);
        // const { username, password } = request.data;
        const user = yield cps(authentication.register, request.payload);

        // We call the `authorize` task with the data, telling it that we are registering a user
        // This returns `true` if the registering was successful, `false` if not
        // const wasSuccessful = yield call(authorize, {
        //     username,
        //     password,
        //     isRegistering: true,
        // });

        // If we could register a user, we send the appropiate actions
        if (user) {
            yield put({ type: LOGIN_SUCCESS, user }); // User is logged in (authorized)
            navigateTo("Home"); // Go to dashboard page
        }
    }
}

function* root() {
    yield fork(loginFlow);
    yield fork(logoutFlow);
    yield fork(registerFlow);
}

/**
 *
 *
 *
 *
 * END OF TEMPLATE FLOWS
 *
 *
 *
 *
 */

/**
 * Email Login
 */
function* logInEmail(credentials) {
    return yield cps(FirebaseService.logInUsingEmail, credentials);
}

function* getEmailUser({ payload }) {
    try {
        const user = yield call(logInEmail, payload);
        // if (user) {
        //     yield put({ type: GET_EMAIL_SUCCESS, user });
        // } else {
        //     throw "NO USER!";
        // }
    } catch (error) {
        yield put({ type: GET_EMAIL_FAIL, error });
    }
}

function* watchGetEmail() {
    yield takeLatest(GET_EMAIL, getEmailUser);
}

/**
 * Google Login
 */
function* logInGoogle() {
    return yield cps(GoogleService.signIn);
}

function* getGoogleUser() {
    try {
        const user = yield call(logInGoogle);
        // console.log("getGoogleUser", user);
        if (user) {
            yield put({ type: GET_GOOGLE_SUCCESS, user });
        } else {
            throw "NO USER!";
        }
    } catch (error) {
        yield put({ type: GET_GOOGLE_FAIL, error });
    }
}

function* watchGetGoogleUser() {
    yield takeLatest(GET_GOOGLE, getGoogleUser);
}

/**
 * Facebook Login
 */
function* logInFacebook() {
    return yield cps(FacebookService.signIn);
}

function* getFacebookUser() {
    try {
        const user = yield call(logInFacebook);
        if (user) {
            yield put({ type: GET_FACEBOOK_SUCCESS, user });
        } else {
            throw "NO USER!";
        }
    } catch (error) {
        yield put({ type: GET_FACEBOOK_FAIL, error });
    }
}

function* watchGetFacebookUser() {
    yield takeLatest(GET_FACEBOOK, getFacebookUser);
}

/**
 * Other login functions
 */
function* watchLoginSuccess() {
    yield takeLatest(
        [GET_GOOGLE_SUCCESS, GET_FACEBOOK_SUCCESS, GET_EMAIL_SUCCESS],
        navigateTo
    );
}

function logoutUser() {
    // try {
    // FacebookService.signOut();
    // await GoogleService.signOut();
    FirebaseService.signOut((err, res) => {
        if (!err && res) {
            NavigationService.navigate("SignIn");
        } else {
            console.log(err);
        }
    });
    // } catch (error) {
    //     console.log(error);
    // }
}

function* watchLogout() {
    yield takeLatest(LOGOUT_USER, logoutUser);
}

export default function* rootSaga() {
    yield fork(loginFlow),
        yield fork(registerFlow),
        yield all([
            watchLogout(),
        ]);
}
