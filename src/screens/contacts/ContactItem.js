import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SWATCH } from "../../constants";

const ContactItem = (props) => {
    const { container, imageContainer, imageContent, fullNameText, fullNameContainer } = styles;
    return (
        <TouchableOpacity>
            <View style={container}>
                <View style={imageContainer}>
                    <Image
                        style={imageContent}
                        // resizeMode="center"
                        source={{
                            uri:
                                "https://firebasestorage.googleapis.com/v0/b/note-board-1527334009294.appspot.com/o/Screen%20Shot%202018-05-31%20at%201.10.39%20PM.png?alt=media&token=f24b8a65-20c8-4947-ba2f-bd58c2b57907",
                        }}
                    />
                </View>
                <View style={fullNameContainer}>
                <Text style={fullNameText}>Jason Ray Acido</Text>
                    </View>
            </View>
        </TouchableOpacity>
    );
};

export default ContactItem;

const styles = StyleSheet.create({
    container: {
        flexBasis: 80,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "darkgray",
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
        color: SWATCH.BLACK
    },
});
