import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    Keyboard,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon } from "react-native-elements";
import validator from "validator";
import { connect } from "react-redux";

import { SWATCH } from "../../constants";
// import { FirebaseService } from "../../services";
import { registerEmailUser } from "../../actions";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: {
                value: "",
                error: false,
                errorText: null,
            },
            email: {
                value: "",
                error: false,
                errorText: null,
            },
            password: {
                value: "",
                error: false,
                errorText: null,
            },
            // isFetching: false,
            showPassword: false,
        };

        this.inputs = {};
    }

    focusToNext(reference) {
        this.inputs[reference].focus();
    }

    handleSubmit = () => {
        if (this.validateInput()) {
            Keyboard.dismiss;
            const userCredentials = {
                displayName: this.state.displayName.value.trim(),
                email: this.state.email.value.trim(),
                password: this.state.password.value,
            };

            this.props.registerUser(userCredentials);
        }
    };

    validateInput() {
        const { displayName, email, password } = this.state;

        const isNameEmpty = validator.isEmpty(displayName.value.trim());
        const isNameAlphaNum = validator.isAlphanumeric(displayName.value.trim().replace(/\s+/g, ""));
        const nameValid = !isNameEmpty && isNameAlphaNum;
        const nameErrorText = isNameEmpty ? "Enter a name" : isNameAlphaNum ? null : "Use alphanumeric characters";

        const isEmailEmpty = validator.isEmpty(email.value.trim());
        const isEmail = validator.isEmail(email.value.trim());
        const emailValid = !isEmailEmpty && isEmail;
        const emailErrorText = emailValid ? null : "Enter an email address";

        const isPasswordEmpty = validator.isEmpty(password.value);
        const isPasswordSecure = password.value.length >= 8;
        const passwordValid = !isPasswordEmpty && isPasswordSecure;
        const passwordErrorText = isPasswordEmpty
            ? "Enter a password"
            : isPasswordSecure
                ? null
                : "Use 8 or more characters";

        this.setState({
            displayName: {
                ...displayName,
                error: !nameValid,
                errorText: nameErrorText,
            },
            email: {
                ...email,
                error: !emailValid,
                errorText: emailErrorText,
            },
            password: {
                ...password,
                error: !passwordValid,
                errorText: passwordErrorText,
            },
        });
        return nameValid && emailValid && passwordValid;
    }

    renderVisibilityIcon() {
        return (
            <View style={styles.visibilityIcon}>
                <TouchableOpacity
                    onPressIn={() => this.setState({ showPassword: true })}
                    onPressOut={() => this.setState({ showPassword: false })}
                    disabled={this.props.user.isFetching}>
                    <Icon type="material-icon" name="visibility" color={SWATCH.BLACK} />
                </TouchableOpacity>
            </View>
        );
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
            passwordInputContainer,
            // socialButton,
            spacerThin,
            // spacerThick,
            submitButtonContainer,
            containedButton,
            backButtonContainer,
            errorTextStyle,
            errorContainer,
        } = styles;

        const { displayName, email, password, showPassword } = this.state;
        const { isFetching } = this.props.user;

        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
                extraHeight={10}
                contentContainerStyle={container}>
                <View style={formContainer}>
                    <View style={spacerThin} />
                    <Text style={formHeader}>Create your account</Text>
                    <View style={spacerThin} />
                    <TextInput
                        autoFocus={true}
                        placeholder="Display Name"
                        placeholderTextColor="gray"
                        style={[formTextField, displayName.error ? { borderBottomColor: SWATCH.RED } : null]}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isFetching}
                        blurOnSubmit={false}
                        onSubmitEditing={() => this.focusToNext("email")}
                        value={displayName.value}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        returnKeyType="next"
                        onChangeText={(value) =>
                            this.setState({
                                displayName: {
                                    value,
                                    error: false,
                                    errorText: "",
                                },
                            })
                        }
                        ref={(ref) => (this.inputs["displayName"] = ref)}
                    />
                    <View style={errorContainer}>
                        {displayName.error && <Text style={errorTextStyle}>{displayName.errorText}</Text>}
                    </View>

                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="gray"
                        style={[formTextField, email.error ? { borderBottomColor: SWATCH.RED } : null]}
                        numberOfLines={1}
                        maxLength={64}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isFetching}
                        blurOnSubmit={false}
                        onSubmitEditing={() => this.focusToNext("password")}
                        value={email.value}
                        keyboardType="email-address"
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        returnKeyType="next"
                        onChangeText={(value) =>
                            this.setState({
                                email: {
                                    value,
                                    error: false,
                                    errorText: "",
                                },
                            })
                        }
                        ref={(ref) => (this.inputs["email"] = ref)}
                    />
                    <View style={errorContainer}>
                        {email.error && <Text style={errorTextStyle}>{email.errorText}</Text>}
                    </View>

                    <View style={passwordInputContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="gray"
                            style={[formTextField, password.error ? { borderBottomColor: SWATCH.RED } : null]}
                            numberOfLines={1}
                            maxLength={64}
                            autoCorrect={false}
                            autoCapitalize="none"
                            editable={!isFetching}
                            blurOnSubmit={true}
                            onSubmitEditing={this.handleSubmit}
                            value={password.value}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                            onChangeText={(value) =>
                                this.setState({
                                    password: {
                                        value,
                                        error: false,
                                        errorText: "",
                                    },
                                })
                            }
                            ref={(ref) => (this.inputs["password"] = ref)}
                        />
                        {this.renderVisibilityIcon()}
                    </View>
                    <View style={errorContainer}>
                        {password.error && <Text style={errorTextStyle}>{password.errorText}</Text>}
                    </View>

                    <View style={spacerThin} />

                    <View style={[containedButton, submitButtonContainer]}>
                        <TouchableOpacity onPress={this.handleSubmit} disabled={isFetching}>
                            <View style={submitButton}>
                                {isFetching ? (
                                    <ActivityIndicator size="small" color={SWATCH.WHITE} />
                                ) : (
                                    <Text style={submitButtonText}>SIGN UP</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={spacerThin} />
                </View>

                <View style={spacerThin} />

                <View style={backButtonContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} disabled={isFetching}>
                        <Text style={formTextButton}>Back</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = ({ user }) => ({
    user,
});

const mapDispatchToProps = (dispatch) => ({
    registerUser: (credentials) => dispatch(registerEmailUser(credentials)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);

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
    },
    submitButtonText: {
        color: SWATCH.WHITE,
    },
    formTextButton: {
        fontWeight: "bold",
        color: SWATCH.GRAY,
    },
    passwordInputContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
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
    },
    visibilityIcon: {
        justifyContent: "center",
        height: "100%",
        position: "absolute",
        right: 0,
        paddingHorizontal: 5,
    },
});
