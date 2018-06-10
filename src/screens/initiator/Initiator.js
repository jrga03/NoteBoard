import React, { Component } from "react";
import {
    View,
    StatusBar,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
} from "react-native";
import { GoogleService } from "../../services";

export default class Initiator extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            await GoogleService.initializeSignin();

            const googleUser = await GoogleService.isUserLoggedIn();

            if (googleUser === null) {
                const user = await AsyncStorage.getItem("CURRENT_USER");
                this.props.navigation.navigate(user ? "Home" : "SignIn");
            } else {
                const user = {
                    ...googleUser,
                    loggedInUsing: "Google",
                };
                console.log("Google userAsync", user);
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
