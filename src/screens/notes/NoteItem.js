import React, { Component } from "react";
import { View, TextInput, StyleSheet, FlatList } from "react-native";

export default class NoteItem extends Component {
    render() {
        const { container } = styles;

        return (
            <View style={container}>
                <TextInput defaultValue={"HELLO"} placeholder={"WAZZAP"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "teal",
    },
});
