import React, { Component } from "react";
import { View, StatusBar, YellowBox } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import Root from "./router/router";
import reducers from "./reducers";
import rootSaga from "./sagas";
import { NavigationService } from "./services";

// const storeWithMiddleware = applyMiddleware()(createStore);

const sagaMiddleware = createSagaMiddleware();
const storeWithMiddleware = createStore(
    reducers,
    compose(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

export default class App extends Component {
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
