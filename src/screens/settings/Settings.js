import React, { Component } from "react";
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
// import { NavigationActions, StackActions } from "react-navigation";

// const resetAction = StackActions.reset({
//     index: 0,
// });

export default class Settings extends Component {
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity>
                <Text>{item}</Text>
            </TouchableOpacity>
        );
    };

    renderSectionHeader = ({ section }) => {
        return <Text style={{ fontWeight: "bold" }}>{section.title}</Text>;
    };

    renderSectionFooter = () => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SignIn")}>
                <Text>Logout</Text>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <SectionList
                sections={sections}
                renderItem={this.renderItem}
                renderSectionHeader={this.renderSectionHeader}
                renderSectionFooter={this.renderSectionFooter}
                keyExtractor={(item, index) => item + index}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});

const sections = [
    {
        title: "My Account",
        data: ["test1", "test2"],
    },
];
