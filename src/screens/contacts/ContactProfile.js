import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import { connect } from "react-redux";
import { Icon, Avatar, Button } from "react-native-elements";

import { LAYOUT_MARGIN, SWATCH } from "../../constants";
import { FirebaseService } from "../../services";

class ContactProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addOrCancelPressed: false,
            type: null,
        };
    }
    componentDidMount() {
        this.setState({
            type: this.props.selectedContact.type,
        });
        // console.log(this.props);
    }

    componentWillUnmount() {
        if (
            this.state.addOrCancelPressed &&
            !!this.props.navigation.state.params &&
            !!this.props.navigation.state.params.onAddOrCancelPress
        ) {
            this.props.navigation.state.params.onAddOrCancelPress();
        }
    }

    handleDeleteContact = () => {
        Alert.alert(
            "Delete contact?",
            `Are you sure you want to delete ${this.props.selectedContact.displayName} as a contact?`,
            [
                { text: "Cancel", onPress: () => null },
                {
                    text: "Yes",
                    onPress: () => {
                        FirebaseService.deleteContact(this.props.selectedContact.id);
                        this.setState({ type: "Add" });
                    },
                },
            ]
        );
    };

    handleAddPress = () => {
        FirebaseService.addContactRequest(this.props.selectedContact.id, (err, res) => {
            if (!err && res) {
                this.setState({ addOrCancelPressed: true, type: "Cancel" });
            }
        });
    };

    handleCancelPress = () => {
        FirebaseService.cancelContactRequest(this.props.selectedContact.id, (err, res) => {
            if (!err && res) {
                this.setState({ addOrCancelPressed: true, type: "Add" });
            }
        });
    };

    render() {
        const {
            container,
            avatarContainer,
            displayNameText,
            rowContainer,
            emailText,
            cardContainer,
            pseudoCardContainer,
            extraButtonsContainer,
            extraButtonText,
        } = styles;

        const { photoURL, displayName, email, id } = this.props.selectedContact;
        const { type } = this.state;

        return (
            <ScrollView /*style={container}*/ contentContainerStyle={container}>
                <View style={[cardContainer, Platform.OS === "ios" ? pseudoCardContainer : null]}>
                    {photoURL === "" ? (
                        <Avatar xlarge rounded icon={{ name: "person" }} containerStyle={avatarContainer} />
                    ) : (
                        <Avatar xlarge rounded source={{ uri: photoURL }} containerStyle={avatarContainer} />
                    )}
                    <Text style={displayNameText}>{displayName}</Text>
                    <View style={rowContainer}>
                        <Icon type="material-icons" name="mail-outline" />
                        <Text style={emailText}>{email}</Text>
                    </View>
                    <View style={extraButtonsContainer}>
                        {type === "Request" ? (
                            <View style={rowContainer}>
                                <Button
                                    rounded
                                    title="Ignore Request"
                                    textStyle={extraButtonText}
                                    icon={{ type: "font-awesome" ,name: "ban" }}
                                    onPress={() => {
                                        FirebaseService.rejectContactRequest(id);
                                        this.setState({ type: "Add" });
                                    }}
                                />
                                <Button
                                    rounded
                                    backgroundColor={SWATCH.GREEN}
                                    title="Accept Request"
                                    textStyle={extraButtonText}
                                    icon={{ name: "people" }}
                                    onPress={() => {
                                        FirebaseService.acceptContactRequest(id);
                                        this.setState({ type: "Contact" });
                                    }}
                                />
                            </View>
                        ) : type === "Add" ? (
                            <Button
                                rounded
                                title="Add Contact"
                                textStyle={extraButtonText}
                                icon={{ name: "person-add" }}
                                onPress={this.handleAddPress}
                            />
                        ) : type === "Cancel" ? (
                            <Button
                                rounded
                                title="Cancel Contact Request"
                                textStyle={extraButtonText}
                                icon={{ type: "octicons", name: "remove-circle-outline" }}
                                onPress={this.handleCancelPress}
                            />
                        ) : type === "Contact" ? (
                            <Button
                                rounded
                                backgroundColor={SWATCH.RED}
                                title="Delete Contact"
                                textStyle={extraButtonText}
                                icon={{ type: "ionicons", name: "remove-circle-outline" }}
                                onPress={this.handleDeleteContact}
                            />
                        ) : null}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedContact: state.selectedContact,
});

export default connect(
    mapStateToProps,
    null
)(ContactProfile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: LAYOUT_MARGIN,
        paddingTop: LAYOUT_MARGIN,
    },
    cardContainer: {
        padding: 15,
        alignSelf: "stretch",
        elevation: 2,
        backgroundColor: SWATCH.WHITE,
        alignItems: "center",
        marginBottom: LAYOUT_MARGIN,
    },
    pseudoCardContainer: {
        borderWidth: 0.5,
        borderRadius: 1,
        borderColor: "#ddd",
        borderBottomWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
    },
    avatarContainer: {
        // marginTop: 15,
    },
    displayNameText: {
        paddingVertical: 15,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical: "center",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    emailText: {
        paddingHorizontal: 5,
    },
    extraButtonsContainer: {
        paddingTop: 25,
    },
    extraButtonText: {
        fontSize: 14,
    },
});
