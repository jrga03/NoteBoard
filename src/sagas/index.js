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
import { GoogleService, FacebookService, NavigationService } from "../services";

// function* helloSaga() {
//     console.log("Hello Sagas!");
// }

function navigateToHome() {
    NavigationService.navigate("Home");
}

/**
 * Email Login
 */
async function logInEmail() {
    try {
    } catch (error) {
        throw error;
    }
}

function* getEmailUser() {
    try {
        const user = yield call(logInEmail);
        yield put({ type: GET_EMAIL_SUCCESS, user });
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
async function logInGoogle() {
    let user;
    await GoogleService.signIn((err, res) => {
        if (err) {
            throw err;
        } else {
            user = res;
        }
    });
    return user;
}

function* getGoogleUser() {
    try {
        const user = yield call(logInGoogle);
        yield put({ type: GET_GOOGLE_SUCCESS, user });
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
function logInFacebook(callback) {
    FacebookService.signIn((err, res) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, res);
        }
    });
}

function* getFacebookUser() {
    try {
        const user = yield cps(logInFacebook);
        yield put({ type: GET_FACEBOOK_SUCCESS, user });
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

async function logoutUser() {
    FacebookService.signOut();
    await GoogleService.signOut();
    NavigationService.navigate("SignIn");
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
