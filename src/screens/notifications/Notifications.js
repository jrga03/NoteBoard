import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default class Notification extends Component {
    render() {
        const { container } = styles;
        return (
            <View style={container}>
                <Text>NOTIFICATIONS!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "tomato",
        justifyContent: "center",
        alignItems: "center",
    },
});
