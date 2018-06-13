import { put, takeLatest, call, all, fork } from "redux-saga/effects";
import { GET_GOOGLE, GET_GOOGLE_SUCCESS, GET_GOOGLE_FAIL } from "../constants";
import { GoogleService } from "../services";
import { GoogleSignin } from "react-native-google-signin";
// import * as actions from '../actions';
// import Api from '../lib/api';

function* helloSaga() {
    console.log("Hello Sagas!");
}

function logInGoogle() {
    GoogleService.initialize();
    return GoogleSignin.signIn();
}

function* getGoogleUser() {
    try {
        const user = yield call(logInGoogle);
        // yield console.log("user", user);
        yield put({ type: GET_GOOGLE_SUCCESS, user });
    } catch (error) {
        // yield console.log("ERROR: ", error);
        yield put({ type: GET_GOOGLE_FAIL, error });
    }
    // yield put({ type: GET_GOOGLE_SUCCESS, })
}

function* watchGetGoogleUser() {
    yield takeLatest(GET_GOOGLE, getGoogleUser);
}

// function *workerSetStatus() {
// //   const { status } = yield call(Api);
// //   yield put({ type: 'GET_GOOGLE_SUCCESS', status });
// }

// function *watchSetStatus() {
//   yield takeLatest('GET_GOOGLE', workerSetStatus);
// }

export default function* rootSaga() {
    yield all([helloSaga(), watchGetGoogleUser()]);
}
