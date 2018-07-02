import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    TextInput,
    StyleSheet,
    // AsyncStorage,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
// import {} from "react-navigation";
import { SocialIcon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import validator from "validator";

import { SWATCH } from "../../constants";
import { getGoogleUser, getFacebookUser, loginFlowStart } from "../../actions";
import {
    GoogleService,
    FacebookService,
    FirebaseService,
} from "../../services";
// import { loginGoogleUser } from "../../actions";

class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isLoading: false,
            error: false,
            errorText: null,
        };

        // this.inputs = {};
    }

    componentDidMount() {
        GoogleService.initialize();
        this.props.startLoginFlow();
        console.log("signIn this.props", this.props);
    }

    handleGoogleSignIn = () => {
        // console.log("press Google");

        // GoogleService.signIn();
        this.props.loginGoogleUser();
        // setTimeout(() => {
        //     console.log(this.props);
        // }, 1000);
    };

    handleFacebookSignIn = () => {
        // FacebookService.signIn();
        this.props.loginFacebookUser();
        // setTimeout(() => {
        //     console.log(this.props);
        // }, 1000);
    };

    handleSignUp = () => {
        /**
         * SIGNUP
         */
        this.props.navigation.navigate("SignUp");
    };

    handleSubmit = () => {
        if (this.validateInput()) {
            this.setState({ isLoading: true });

            FirebaseService.checkIfEmailExists(this.state.email, (err, res) => {
                if (res) {
                    this.props.navigation.navigate("Password", {
                        email: this.state.email,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorText: "Couldn't find your email",
                    });
                }
                this.setState({ isLoading: false });
            });
        }
    };

    validateInput() {
        const isEmail = validator.isEmail(this.state.email);
        const errorText = isEmail ? null : "Enter a valid email";
        this.setState({
            error: !isEmail,
            errorText,
        });
        return isEmail;
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
            newUserContainer,
            socialButtonsContainer,
            // formTextForgotContainer,
            socialButton,
            spacerThin,
            // spacerThick,
            submitButtonContainer,
            containedButton,
            errorTextStyle,
            errorContainer,
        } = styles;

        const { email, isLoading, error, errorText } = this.state;
        const { isFetching } = this.props.user;

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
                    <Text style={formHeader}>Welcome!</Text>
                    <View style={spacerThin} />
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={SWATCH.GRAY}
                        style={[
                            formTextField,
                            error ? { borderBottomColor: SWATCH.RED } : null,
                        ]}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isLoading || !isFetching}
                        blurOnSubmit={false}
                        onSubmitEditing={this.handleSubmit}
                        value={email}
                        keyboardType="email-address"
                        underlineColorAndroid="transparent"
                        returnKeyType="next"
                        onChangeText={(email) =>
                            this.setState({ email, error: false })
                        }
                    />
                    <View style={errorContainer}>
                        {error && (
                            <Text style={errorTextStyle}>{errorText}</Text>
                        )}
                    </View>
                    {/* <View style={spacerThin} /> */}

                    {/* <Text style={formHeader}>Password</Text>
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
                    /> */}

                    <View style={socialButtonsContainer}>
                        <SocialIcon
                            // light
                            style={[containedButton, socialButton]}
                            type="facebook"
                            raised={true}
                            onPress={this.handleFacebookSignIn}
                            disabled={isLoading || isFetching}
                            iconSize={16}
                            iconColor={SWATCH.WHITE}
                            // underlayColor="yellow"
                        />
                        <SocialIcon
                            // light
                            style={[containedButton, socialButton]}
                            type="google-plus-official"
                            raised={true}
                            onPress={this.handleGoogleSignIn}
                            disabled={isLoading || isFetching}
                            iconSize={16}
                            iconColor={SWATCH.WHITE}
                            // underlayColor="yellow"
                        />
                    </View>
                    {/* <View style={spacerThick} /> */}
                    {/* <View style={spacerThin} /> */}

                    <View style={[containedButton, submitButtonContainer]}>
                        <TouchableOpacity
                            onPress={this.handleSubmit}
                            disabled={isLoading || isFetching}>
                            <View style={submitButton}>
                                {isLoading || isFetching ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={SWATCH.WHITE}
                                    />
                                ) : (
                                    <Text style={submitButtonText}>NEXT</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={spacerThin} />
                </View>

                {/* <View style={spacerThick} /> */}
                <View style={spacerThin} />

                <View style={newUserContainer}>
                    {/* <Text style={[formText]}>New User? </Text> */}
                    <TouchableOpacity
                        onPress={this.handleSignUp}
                        disabled={isLoading || isFetching}>
                        <Text style={formTextButton}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
    startLoginFlow: () => dispatch(loginFlowStart()),
    loginGoogleUser: () => dispatch(getGoogleUser()),
    loginFacebookUser: () => dispatch(getFacebookUser()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInScreen);

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
    },
    newUserContainer: {
        // flexDirection: "row",
        alignItems: "center",
    },
    socialButtonsContainer: {
        flexBasis: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    socialButton: {
        marginHorizontal: 15,
        // marginLeft: 20,
        backgroundColor: SWATCH.BLACK,
        width: 30,
        height: 30,
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
