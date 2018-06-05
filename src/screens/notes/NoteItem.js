import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default class NoteItem extends Component {
    render() {
        const {container} = styles;
        return (
            <View style={container}>
                <Text>HELLO WORLD</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
