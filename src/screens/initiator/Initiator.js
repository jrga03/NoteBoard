import React, { Component } from "react";
import {
    View,
    // StatusBar,
    StyleSheet,
    // AsyncStorage,
    ActivityIndicator,
} from "react-native";
import { GoogleService } from "../../services";

export default class Initiator extends Component {
    async componentDidMount() {
        try {
            await GoogleService.initialize();

            const googleUser = await GoogleService.isUserLoggedIn();

            if (googleUser === null) {
                this.props.navigation.navigate("SignIn");
            } else {
                console.log("Google userAsync", googleUser);
                this.props.navigation.navigate("Home");
            }
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
