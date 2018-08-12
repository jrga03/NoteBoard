import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
} from "react-native";
import { Icon, Avatar } from "react-native-elements";

import { SWATCH } from "../../constants";
import { FirebaseService } from "../../services/FirebaseService";

const ContactItem = ({ item, type, extraButtonPress, onSelectContact }) => {
    if (!!item) {
        const { id, displayName, photoURL } = item;

        const {
            container,
            iconEmphasis,
            imageContent,
            fullNameText,
            iconContainer,
            imageContainer,
            fullNameContainer,
            extraButtonsContainer,
        } = styles;

        handleAddPress = () => {
            FirebaseService.addContactRequest(id, (err, res) => {
                if (!err && res) {
                    extraButtonPress();
                }
            });
        };

        handleCancelPress = () => {
            FirebaseService.cancelContactRequest(id, (err, res) => {
                if (!err && res) {
                    extraButtonPress();
                }
            });
        };

        selectContact = () => {
            onSelectContact(item);
        };

        return (
            <TouchableOpacity onPress={selectContact}>
                <View style={container}>
                    <View style={imageContainer}>
                        {!!photoURL ? (
                            <Image
                                style={imageContent}
                                // resizeMode="center"
                                source={{ uri: photoURL }}
                            />
                        ) : (
                            <Avatar medium rounded icon={{ name: "person" }} />
                        )}
                    </View>
                    <View style={fullNameContainer}>
                        <Text
                            style={fullNameText}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {displayName}
                        </Text>
                    </View>

                    {type === "Request" ? (
                        <View style={extraButtonsContainer}>
                            <ContactItemButton
                                onPress={() =>
                                    FirebaseService.rejectContactRequest(id)
                                }
                                icon={{
                                    name: "clear",
                                    color: SWATCH.RED,
                                    container: iconContainer,
                                }}
                            />

                            <ContactItemButton
                                onPress={() =>
                                    FirebaseService.acceptContactRequest(id)
                                }
                                icon={{
                                    name: "check",
                                    color: SWATCH.GREEN,
                                    container: [iconContainer, iconEmphasis],
                                }}
                            />
                        </View>
                    ) : type === "Add" ? (
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
                    ) : type === "Cancel" ? (
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
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    }
    return null;
};

const ContactItemButton = (props) => (
    <TouchableWithoutFeedback>
        <TouchableOpacity onPress={props.onPress}>
            <Icon
                name={props.icon.name}
                type="material-icons"
                color={props.icon.color}
                containerStyle={props.icon.container}
            />
        </TouchableOpacity>
    </TouchableWithoutFeedback>
);

export default ContactItem;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        flexBasis: 80,
        flexDirection: "row",
        alignItems: "center",
    },
    imageContainer: {
        padding: 0,
        paddingHorizontal: 15,
    },
    imageContent: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    fullNameContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    fullNameText: {
        fontSize: 18,
        color: SWATCH.BLACK,
    },
    extraButtonsContainer: {
        // flex: 1,
        // flexBasis: 50,
        // width: 50,
        flexDirection: "row",
        paddingRight: 15,
        paddingLeft: 5,
    },
    iconContainer: {
        marginHorizontal: 10,
    },
    iconEmphasis: {
        // backgroundColor: SWATCH.LIGHT_GRAY,
        borderWidth: 0.5,
        borderColor: SWATCH.GRAY,
        borderRadius: 3,
    },
});
