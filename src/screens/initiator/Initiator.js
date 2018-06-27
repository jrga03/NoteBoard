import React, { Component } from "react";
import {
    View,
    // StatusBar,
    StyleSheet,
    // AsyncStorage,
    ActivityIndicator,
} from "react-native";
// import firebase from "react-native-firebase";
import { FirebaseService } from "../../services";

// import { GoogleService } from "../../services";

export default class Initiator extends Component {
    componentDidMount() {
        // try {
        //     // const user = await firebase.auth().onAuthStateChanged();

        //     console.log("didmount");

        //     // if (googleUser === null) {
        //     //     this.props.navigation.navigate("SignIn");
        //     // } else {
        //     //     console.log("Google userAsync", googleUser);
        //     //     this.props.navigation.navigate("Home");
        //     // }
        // } catch (error) {
        //     console.log("ERROR: ", error);
        // }
        // console.log("equal to", firebase.database().ref('user_emails').equalTo('jasonacido@gmail.com'));
        FirebaseService.isUserLoggedIn((user) => {
            console.log("INITIATOR USER", user);
            this.props.navigation.navigate(user ? "Home" : "SignIn");
        });
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
