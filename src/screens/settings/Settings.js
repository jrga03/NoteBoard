import React, { Component } from "react";
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import { GoogleService, FacebookService } from "../../services";

export default class Settings extends Component {

    logout = () => {
        GoogleService.signOut();
        FacebookService.signOut();
        this.props.navigation.navigate("SignIn");
    }

    renderItem = ({ item }) => {
        const { itemContainer, itemContainerText, iconContainer } = styles;

        return (
            <TouchableOpacity>
                <View style={itemContainer}>
                    <View style={iconContainer}>
                        <Icon
                            type="material-icons"
                            name="folder-open"
                            color={SWATCH.GRAY}
                            size={18}
                        />
                    </View>
                    <Text style={itemContainerText}>{item}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // renderSectionHeader = ({ section }) => {
    //     return <Text style={{ fontWeight: "bold" }}>{section.title}</Text>;
    // };

    renderListFooter = () => {
        const { itemContainer } = styles;
        return (
            <TouchableOpacity
                onPress={this.logout}>
                <Text style={itemContainer}>Logout</Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { container, separator, itemContainer, sectionHeader } = styles;

        return (
            <SectionList
                style={container}
                sections={sections}
                renderItem={this.renderItem}
                renderSectionHeader={({ section }) => (
                    <Text style={[itemContainer, sectionHeader]}>
                        {section.title}
                    </Text>
                )}
                renderSectionFooter={() => <View style={separator} />}
                ListFooterComponent={this.renderListFooter}
                keyExtractor={(item, index) => item + index}
                // ItemSeparatorComponent={() => <View style={separator} />}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: LAYOUT_MARGIN,
    },
    separator: {
        height: 1,
        marginVertical: 5,
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: LAYOUT_MARGIN,
        // backgroundColor: SWATCH.LIGHT_GRAY,
    },
    sectionHeader: {
        fontWeight: "bold",
        // backgroundColor: null,
        elevation: 1,
    },
    itemContainerText: {},
    iconContainer: {
        marginRight: 20,
    },
});

const sections = [
    {
        title: "My Account",
        data: ["test1", "test2"],
    },
];
