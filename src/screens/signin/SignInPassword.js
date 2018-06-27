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
// import { NavigationActions, StackActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { SocialIcon } from "react-native-elements";
import validator from "validator";
import { connect } from "react-redux";

import { SWATCH } from "../../constants";
import { FirebaseService } from "../../services";
import { getEmailUser } from "../../actions";

// const resetToHome = StackActions.reset({
//     index: 0,
//     actions: [NavigationActions.navigate("Home")],
// });

class SignInPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            isLoading: false,
            error: false,
            errorText: null,
        };
    }

    handleForgotPassword = () => {
        /**
         * FORGOT PASSWORD
         */
    };

    handleSubmit = () => {
        if (this.validateInput()) {
            // this.setState({ isLoading: true });
            console.log("submit")
            const userCredentials = {
                email: this.props.navigation.state.params.email,
                password: this.state.password,
            };

            this.props.logInEmailUser(userCredentials);

            // FirebaseService.logInUsingEmail(
            //     userCredentials,
            //     (error, response) => {
            //         if (!error && response) {
            //             this.props.navigation.navigate("Home");
            //         } else {
            //             console.log(error);
            //             this.setState({
            //                 error: true,
            //                 errorText:
            //                     "Wrong password. Try again or click Forgot Password to reset it.",
            //             });
            //         }
            //         this.setState({ isLoading: false });
            //     }
            // );
        }
    };

    validateInput() {
        const isEmpty = validator.isEmpty(this.state.password);
        const errorText = isEmpty ? "Enter a password" : null;
        this.setState({
            error: isEmpty,
            errorText,
        });
        return !isEmpty;
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
            // socialButtonsContainer,
            formTextForgotContainer,
            // socialButton,
            spacerThin,
            // spacerThick,
            submitButtonContainer,
            containedButton,
            backButtonContainer,
            errorTextStyle,
            errorContainer,
        } = styles;

        const { password, isLoading, error, errorText } = this.state;

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
                        {this.props.navigation.state.params.email}
                    </Text>
                    <View style={spacerThin} />
                    <TextInput
                        autoFocus={true}
                        placeholder="Enter your password"
                        placeholderTextColor="gray"
                        style={[
                            formTextField,
                            error ? { borderBottomColor: SWATCH.RED } : null,
                        ]}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isLoading}
                        blurOnSubmit={true}
                        onSubmitEditing={this.handleSubmit}
                        value={password}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        returnKeyType="done"
                        onChangeText={(password) =>
                            this.setState({ password, error: false })
                        }
                    />
                    <View style={errorContainer}>
                        {error && (
                            <Text style={errorTextStyle}>{errorText}</Text>
                        )}
                    </View>

                    <View style={formTextForgotContainer}>
                        <TouchableOpacity
                            onPress={this.handleForgotPassword}
                            disabled={isLoading}>
                            <Text style={formTextButton}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[containedButton, submitButtonContainer]}>
                        <TouchableOpacity
                            onPress={this.handleSubmit}
                            disabled={isLoading}>
                            <View style={submitButton}>
                                {isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={SWATCH.WHITE}
                                    />
                                ) : (
                                    <Text style={submitButtonText}>
                                        SIGN IN
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={spacerThin} />
                </View>

                <View style={spacerThin} />

                <View style={backButtonContainer}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        disabled={isLoading}>
                        <Text style={formTextButton}>Back</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logInEmailUser: (credentials) => dispatch(getEmailUser(credentials)),
});

export default connect(
    null,
    mapDispatchToProps
)(SignInPassword);

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
    // socialButtonsContainer: {
    //     flexDirection: "row",
    //     justifyContent: "center",
    // },
    // socialButton: {
    //     marginHorizontal: 15,
    //     backgroundColor: SWATCH.BLACK,
    //     width: 30,
    //     height: 30,
    // },
    backButtonContainer: {
        alignItems: "center",
    },
    spacerThin: {
        padding: 10,
    },
    // spacerThick: {
    //     padding: 20,
    // },
    errorContainer: {
        height: 14,
        width: "80%",
        paddingHorizontal: 10,
    },
    errorTextStyle: {
        position: "absolute",
        color: SWATCH.RED,
        // justifyContent: "flex-start",
    },
});
