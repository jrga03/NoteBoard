import { put, take, takeLatest, call, all, fork } from "redux-saga/effects";
import {
    GET_GOOGLE,
    GET_GOOGLE_SUCCESS,
    GET_GOOGLE_FAIL,
    CURRENT_USER,
    GET_FACEBOOK,
    GET_FACEBOOK_SUCCESS,
    GET_FACEBOOK_FAIL,
    LOGOUT_USER,
} from "../constants";
import { GoogleService, FacebookService } from "../services";
import NavigationService from "../utilities/NavigationService";

// function* helloSaga() {
//     console.log("Hello Sagas!");
// }

function navigateToHome() {
    NavigationService.navigate("Home");
}

async function logoutUser() {
    FacebookService.signOut();
    await GoogleService.signOut();
    NavigationService.navigate("SignIn");
}

async function logInGoogle() {
    try {
        await GoogleService.signIn((err, res) => {
            if (err) {
                throw err;
            } else {
                return res;
            }
        });
    } catch (error) {
        throw error;
    }
}

async function logInFacebook() {
    try {
        await FacebookService.signIn((err, res) => {
            if (err) {
                throw err;
            } else {
                return res;
            }
        });
    } catch (error) {
        throw error;
    }
}

function* getGoogleUser() {
    try {
        const user = yield call(logInGoogle);
        yield put({ type: GET_GOOGLE_SUCCESS, user });
    } catch (error) {
        yield put({ type: GET_GOOGLE_FAIL, error });
    }
}

function* getFacebookUser() {
    try {
        const user = yield call(logInFacebook);
        yield put({ type: GET_FACEBOOK_SUCCESS, user });
    } catch (error) {
        yield put({ type: GET_FACEBOOK_FAIL, error });
    }
}

function* watchGetGoogleUser() {
    yield takeLatest(GET_GOOGLE, getGoogleUser);
}

function* watchGetFacebookUser() {
    yield takeLatest(GET_FACEBOOK, getFacebookUser);
}

function* watchLoginSuccess() {
    yield takeLatest(
        [GET_GOOGLE_SUCCESS, GET_FACEBOOK_SUCCESS],
        navigateToHome
    );
}

function* watchLogout() {
    yield takeLatest(LOGOUT_USER, logoutUser);
}

export default function* rootSaga() {
    yield all([
        // helloSaga(),
        watchGetGoogleUser(),
        watchGetFacebookUser(),
        watchLoginSuccess(),
        watchLogout(),
    ]);
}
