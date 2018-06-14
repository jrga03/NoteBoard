import { put, take, takeLatest, call, all, fork } from "redux-saga/effects";
import {
    GET_GOOGLE,
    GET_GOOGLE_SUCCESS,
    GET_GOOGLE_FAIL,
    CURRENT_USER,
    GET_FACEBOOK,
    GET_FACEBOOK_SUCCESS,
    GET_FACEBOOK_FAIL,
} from "../constants";
import { GoogleService, FacebookService } from "../services";
import NavigationService from "../utilities/NavigationService";

function* helloSaga() {
    console.log("Hello Sagas!");
}

function navigateToHome() {
    NavigationService.navigate("Home");
}

async function logInGoogle() {
    try {
        await GoogleService.signIn((err, res) => {
            if (err) {
                throw err;
            } else {
                console.log(res);
                return res;
            }
        });
    } catch (error) {
        // console.log(error);
        throw error;
    }
}

function logInFacebook() {
    FacebookService.signIn((err, res) => {
        if (err) {
            throw err;
        } else {
            return res;
        }
    });
}

function* getGoogleUser() {
    try {
        const user = yield call(logInGoogle);
        yield console.log("user", user);
        yield put({ type: GET_GOOGLE_SUCCESS, user });
    } catch (error) {
        // yield console.log("ERROR: ", error);
        yield put({ type: GET_GOOGLE_FAIL, error });
    }
    // yield put({ type: GET_GOOGLE_SUCCESS, })
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
    yield takeLatest([GET_GOOGLE_SUCCESS, GET_FACEBOOK_SUCCESS], navigateToHome);
}

export default function* rootSaga() {
    yield all([
        helloSaga(),
        watchGetGoogleUser(),
        watchGetFacebookUser(),
        watchLoginSuccess(),
    ]);
}
