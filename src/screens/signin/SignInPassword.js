import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SocialIcon } from "react-native-elements";

import { SWATCH } from "../../constants";

const resetToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate("Home")],
});

export default class SignInPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
        };
    }

    render() {
        const {
            container,
            formHeader,
            submitButton,
            formTextField,
            formContainer,
            formTextButton,
            submitButtonText,
            socialButtonsContainer,
            formTextForgotContainer,
            socialButton,
            spacerThin,
            spacerThick,
            submitButtonContainer,
            containedButton,
            backButtonContainer,
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
                    <View style={spacerThin} />
                    <Text style={formHeader}>
                        {`${"< PERSON'S NAME HERE >"}`}
                    </Text>
                    <View style={spacerThin} />
                    <TextInput
                        autoFocus={true}
                        placeholder="Enter your password"
                        placeholderTextColor="gray"
                        style={formTextField}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={true}
                        blurOnSubmit={true}
                        onSubmitEditing={() =>
                            this.props.navigation.navigate("Home")
                        }
                        value={this.state.password}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        returnKeyType="done"
                        onChangeText={(password) => this.setState({ password })}
                    />

                    <View style={formTextForgotContainer}>
                        <TouchableOpacity>
                            <Text style={formTextButton}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[containedButton, submitButtonContainer]}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate("Home")
                            }>
                            <View style={submitButton}>
                                <Text style={submitButtonText}>SIGN IN</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={spacerThin} />
                </View>

                <View style={spacerThin} />

                <View style={backButtonContainer}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={formTextButton}>Back</Text>
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
        padding: 17,
    },
    formContainer: {
        alignItems: "center",
        backgroundColor: SWATCH.WHITE,
    },
    formHeader: {
        fontSize: 16,
        fontWeight: "bold",
    },
    formTextField: {
        width: "80%",
        height: 30,
        fontSize: 14,
        padding: 0,
        backgroundColor: SWATCH.WHITE,
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: SWATCH.BLACK,
        textAlign: "center",
    },
    containedButton: {
        elevation: 2,
    },
    submitButtonContainer: {
        flexGrow: 1,
        alignItems: "stretch",
        justifyContent: "center",
        width: 130,
        flexBasis: 50,
    },
    submitButton: {
        backgroundColor: SWATCH.BLACK,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        zIndex: 100,
    },
    submitButtonText: {
        color: SWATCH.WHITE,
    },
    formTextButton: {
        fontWeight: "bold",
        color: SWATCH.GRAY,
    },
    formTextForgotContainer: {
        flexBasis: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    socialButton: {
        marginHorizontal: 15,
        backgroundColor: SWATCH.BLACK,
        width: 30,
        height: 30,
    },
    backButtonContainer: {
        alignItems: "center",
    },
    spacerThin: {
        padding: 10,
    },
    spacerThick: {
        padding: 20,
    },
});
