import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { connect } from "react-redux";
import { Icon, Avatar, Button } from "react-native-elements";
import { LAYOUT_MARGIN, SWATCH } from "../../constants";

class ContactProfile extends Component {
    componentDidMount() {
        // console.log(this.props);
    }

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

        return (
            <ScrollView /*style={container}*/ contentContainerStyle={container}>
                <View style={[cardContainer, Platform.OS === "ios" ? pseudoCardContainer : null]}>
                    {this.props.selectedContact.photoURL === "" ? (
                        <Avatar xlarge rounded icon={{ name: "person" }} containerStyle={avatarContainer} />
                    ) : (
                        <Avatar
                            xlarge
                            rounded
                            source={{ uri: this.props.selectedContact.photoURL }}
                            containerStyle={avatarContainer}
                        />
                    )}
                    <Text style={displayNameText}>{this.props.selectedContact.displayName}</Text>
                    <View style={rowContainer}>
                        <Icon type="material-icons" name="mail-outline" />
                        <Text style={emailText}>{this.props.selectedContact.email}</Text>
                    </View>
                    <View style={[rowContainer, extraButtonsContainer]}>
                        {/* {this.props.selectedContact.type === "Request" ? (
                            <Button
                                rounded
                                title="Add Contact"
                                textStyle={extraButtonText}
                                icon={{ type: "material-icons", name: "person-add" }}
                            />
                        ) : this.props.selectedContact.type === "Add" ? (
                            <View style={extraButtonsContainer}>
                                <ContactItemButton
                                    onPress={handleAddPress}
                                    icon={{
                                        name: "add",
                                        color: SWATCH.BLACK,
                                        container: [iconContainer, iconEmphasis],
                                    }}
                                />
                            </View>
                        ) : this.props.selectedContact.type === "Cancel" ? (
                            <View style={extraButtonsContainer}>
                                <ContactItemButton
                                    onPress={handleCancelPress}
                                    icon={{
                                        name: "remove",
                                        color: SWATCH.BLACK,
                                        container: [iconContainer, iconEmphasis],
                                    }}
                                />
                            </View>
                        ) : null} */}
                        <Button
                            rounded
                            title="Add Contact"
                            textStyle={extraButtonText}
                            icon={{ type: "material-icons", name: "person-add" }}
                            // backgroundColor={SWATCH.GREEN}
                        />
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
