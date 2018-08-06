import React from "react";
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Icon, Avatar } from "react-native-elements";

import { SWATCH } from "../../constants";

const ContactItem = ({ item, type }) => {
    // const { item, type } = props;
    // console.log(props);

    if (!!item) {
        // console.log("item", item, "type", type);
        const { displayName, photoURL } = item;

        const {
            container,
            iconAccept,
            imageContent,
            fullNameText,
            iconContainer,
            imageContainer,
            fullNameContainer,
            extraButtonsContainer,
        } = styles;

        return (
            <TouchableOpacity>
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
                        <Text style={fullNameText} numberOfLines={1} ellipsizeMode="tail">
                            {displayName}
                        </Text>
                    </View>

                    {type === "Request" ? (
                        <View style={extraButtonsContainer}>
                            <TouchableWithoutFeedback>
                                <TouchableOpacity>
                                    <Icon
                                        name="clear"
                                        type="material-icons"
                                        color={SWATCH.BLACK}
                                        containerStyle={iconContainer}
                                    />
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback>
                                <TouchableOpacity>
                                    <Icon
                                        name="check"
                                        type="material-icons"
                                        color={SWATCH.BLACK}
                                        containerStyle={[iconContainer, iconAccept]}
                                    />
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>
                        </View>
                    ) : type === "Add" ? (
                        <View style={extraButtonsContainer}>
                            <TouchableWithoutFeedback>
                                <TouchableOpacity>
                                    <Icon
                                        name="add"
                                        type="material-icons"
                                        color={SWATCH.BLACK}
                                        containerStyle={iconContainer}
                                    />
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    }
    return null;
};

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
        borderWidth: 0.5,
        borderColor: SWATCH.GRAY,
        marginHorizontal: 10,
    },
    iconAccept: {
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
});
