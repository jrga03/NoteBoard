import {
    put,
    take,
    takeLatest,
    call,
    all,
    fork,
    cps,
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
    LOGOUT_USER,
} from "../constants";
import {
    GoogleService,
    FacebookService,
    FirebaseService,
    NavigationService,
} from "../services";

// function* helloSaga() {
//     console.log("Hello Sagas!");
// }

function navigateToHome() {
    NavigationService.navigate("Home");
}

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
        navigateToHome
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
    yield all([
        // helloSaga(),
        watchGetEmail(),
        watchGetGoogleUser(),
        watchGetFacebookUser(),
        watchLoginSuccess(),
        watchLogout(),
    ]);
}
