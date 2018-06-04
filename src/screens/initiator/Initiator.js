import React, { Component } from "react";
import {
    View,
    StatusBar,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { GoogleSignin } from "react-native-google-signin";

export default class Initiator extends Component {
    constructor(props) {
        super(props);
        // this._bootstrap();
    }

    // _bootstrap = async () => {
    //     try {
    //     } catch (err) {
    //         console.log("Google signin error", err.code, err.message);
    //     }
    // };
    
    async componentDidMount() {
        try {
            await GoogleSignin.hasPlayServices({ autoResolve: true });
            await GoogleSignin.configure({
                iosClientId:
                    "604168385941-oor808u3jmq0l9sme0jaqum2r0cgcpq2.apps.googleusercontent.com",
                webClientId:
                    "604168385941-5unq3p22khg777375e1flqmnj2f40ns4.apps.googleusercontent.com",
                offlineAccess: false,
            });

            const googleUser = await GoogleSignin.currentUserAsync();
            
            if (googleUser === null) {
                const user = await AsyncStorage.getItem("CURRENT_USER");
                this.props.navigation.navigate(user ? "Home" : "SignIn");
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
                <StatusBar />
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
