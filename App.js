/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { View, StatusBar, YellowBox } from "react-native";
import Root from "./src/router/router";

YellowBox.ignoreWarnings([
    "Warning: isMounted(...)",
    "Module RNGoogleSignin requires main queue setup since it overrides `constantsToExport`",
    "Module RCTImageLoader requires main queue setup since it overrides `init`",
    "Class RCTCxxModule was not exported.",
]);

export default class App extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Root />
                <StatusBar barStyle="light-content" />
            </View>
        );
    }
}
