import React, { Component } from "react";
import { View, StatusBar, Platform, YellowBox } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import firebase from "react-native-firebase";

import Root from "./router/router";
import reducers from "./reducers";
import rootSaga from "./sagas";
import { NavigationService } from "./services";

const iosConfig = {
    clientId:
        "604168385941-564sugmijrebh8dg3vpt5i2tr5df4bee.apps.googleusercontent.com",
    appId: "1:604168385941:ios:ac070bda8a2575b8",
    apiKey: "AIzaSyBK8pCjM1ANlH8oBDgFuUXCJDIPXzFCS10",
    databaseURL: "https://note-board-1527334009294.firebaseio.com/",
    storageBucket: "note-board-1527334009294.appspot.com",
    messagingSenderId: "604168385941",
    projectId: "note-board-1527334009294",
    persistence: true,
};

const androidConfig = {
    clientId:
        "604168385941-s3ir3m3puo5um9hpsig7trvfjfbafreq.apps.googleusercontent.com",
    appId: "1:604168385941:android:ac070bda8a2575b8",
    apiKey: "AIzaSyCNFx__Cp3WdKYlK--LeH4KdrgqkxBf3j0",
    databaseURL: "https://note-board-1527334009294.firebaseio.com/",
    storageBucket: "note-board-1527334009294.appspot.com",
    messagingSenderId: "604168385941",
    projectId: "note-board-1527334009294",
    persistence: true,
};

// const storeWithMiddleware = applyMiddleware()(createStore);

const sagaMiddleware = createSagaMiddleware();
const storeWithMiddleware = createStore(
    reducers,
    compose(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

export default class App extends Component {
    componentDidMount() {
        // firebase.initializeApp(
        //     Platform.OS === "ios" ? iosConfig : androidConfig,
        //     "Note Board"
        // );
    }

    render() {
        return (
            <Provider store={storeWithMiddleware}>
                <View style={{ flex: 1 }}>
                    <Root
                        ref={(navigatorRef) => {
                            NavigationService.setTopLevelNavigator(
                                navigatorRef
                            );
                        }}
                    />
                    <StatusBar barStyle="light-content" />
                </View>
            </Provider>
        );
    }
}

YellowBox.ignoreWarnings([
    "Warning: isMounted(...)",
    "Module RNGoogleSignin requires main queue setup since it overrides `constantsToExport`",
    "Module RCTImageLoader requires main queue setup since it overrides `init`",
    "Class RCTCxxModule was not exported.",
]);
