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

import { SWATCH } from "../../constants";
import { GoogleService, FacebookService } from "../../services";
import { getGoogleUser } from "../../actions";

class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };

        this.inputs = {};
    }

    componentDidMount() {
        GoogleService.initialize();
        console.log("this.props", this.props);
    }

    handleGoogleSignIn = () => {
        // GoogleService.signIn();
        this.props.getGoogleUser();
        setTimeout(() => {
            console.log(this.props);
        }, 1000)
    };

    handleFacebookSignIn = () => {
        FacebookService.signIn();
    };

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
            formTextForgotContainer,
            socialButton,
            spacerThin,
            spacerThick,
            submitButtonContainer,
            containedButton,
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
                    <Text style={formHeader}>Welcome!</Text>
                    <View style={spacerThin} />
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={SWATCH.GRAY}
                        style={formTextField}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={true}
                        blurOnSubmit={false}
                        onSubmitEditing={() =>
                            this.props.navigation.navigate("Password")
                        }
                        value={this.state.email}
                        keyboardType="email-address"
                        underlineColorAndroid="transparent"
                        returnKeyType="next"
                        onChangeText={(email) => this.setState({ email })}
                    />
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
                            iconSize={16}
                            iconColor={SWATCH.WHITE}
                            // underlayColor="yellow"
                        />
                    </View>
                    {/* <View style={spacerThick} /> */}
                    {/* <View style={spacerThin} /> */}

                    <View style={[containedButton, submitButtonContainer]}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate("Password")
                            }>
                            <View style={submitButton}>
                                <Text style={submitButtonText}>NEXT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={spacerThin} />
                </View>

                {/* <View style={spacerThick} /> */}
                <View style={spacerThin} />

                <View style={newUserContainer}>
                    {/* <Text style={[formText]}>New User? </Text> */}
                    <TouchableOpacity>
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
    getGoogleUser: () => dispatch({ type: "GET_GOOGLE" }),
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
    spacerThick: {
        padding: 20,
    },
});
