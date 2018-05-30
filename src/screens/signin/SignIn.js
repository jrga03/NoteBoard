import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    TextInput,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import {} from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };

        this.inputs = {};
    }

    render() {
        const {
            container,
            formContainer,
            formTextField,
            formLabel,
            newUserContainer,
            submitButton,
            submitButtonText,
            formText,
            formTextButton,
            formTextForgot,
            formTextSignUp,
            formTextForgotContainer,
        } = styles;
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "none"
                }
                extraHeight={10}
                contentContainerStyle={container}>
                <View style={formContainer}>
                    <Text style={formLabel}>Email</Text>
                    <TextInput
                        style={formTextField}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={true}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {}}
                        ref={(ref) => (this.inputs["email"] = ref)}
                        value={this.state.email}
                        keyboardType="email-address"
                        underlineColorAndroid="transparent"
                        onChangeText={(email) => this.setState({ email })}
                    />

                    <Text style={formLabel}>Password</Text>
                    <TextInput
                        style={formTextField}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={true}
                        blurOnSubmit={true}
                        onSubmitEditing={() => {}}
                        ref={(ref) => (this.inputs["password"] = ref)}
                        value={this.state.password}
                        keyboardType="default"
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(password) => this.setState({ password })}
                    />
                </View>

                <View style={formTextForgotContainer}>
                    <TouchableOpacity>
                        <Text
                            style={[formText, formTextButton, formTextForgot]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity>
                    <View style={submitButton}>
                        <Text style={submitButtonText}>Login</Text>
                    </View>
                </TouchableOpacity>

                <View style={newUserContainer}>
                    <Text style={[formText]}>New User? </Text>
                    <TouchableOpacity>
                        <Text
                            style={[formText, formTextButton, formTextSignUp]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "red",
        padding: 17,
    },
    formContainer: {
        // flexDirection: 'column',
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'stretch',
        backgroundColor: "green",
    },
    formLabel: {
        fontSize: 12,
    },
    formTextField: {
        // flexDirection: 'row',
        // flex: 0.7,
        // width: 200,
        height: 30,
        fontSize: 14,
        padding: 0,
        backgroundColor: "white",
        marginTop: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: "black",
    },
    submitButton: {
        backgroundColor: "yellow",
        // flex: 1,
        width: "100%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: {},
    formText: {},
    formTextButton: {},
    formTextForgotContainer: {
        // flex: 1,
        alignItems: 'flex-end'
    },
    formTextForgot: {
        // flex: 1,
        // justifyContent: "flex-end",
        // alignItems: "flex-end",
    },
    formTextSignUp: {},
    newUserContainer: {
        flexDirection: "row",
        justifyContent: 'center',
    },
});
