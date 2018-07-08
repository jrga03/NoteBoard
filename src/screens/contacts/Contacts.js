import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Contacts extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.navigation.state.routeName} Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
