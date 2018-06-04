import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default class HomeScreen extends Component {
    render() {
        const { container } = styles;
        return (
            <View style={container}>
                <Text>HELLO WORLD</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
    },
});
