import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { SWATCH, LAYOUT_MARGIN } from "../../constants";

import NoteMemo from "./NoteMemo";

export default class Notes extends Component {
    handleMemoPress = () => this.props.navigation.navigate("NoteItem");

    renderNoteItem = ({ item }) => {
        return <NoteMemo memo={item} onPress={this.handleMemoPress} />;
    };

    render() {
        const { container, listContainer } = styles;
        return (
            <View style={container}>
                <FlatList
                    style={listContainer}
                    data={fakeData.sort(
                        (a, b) => a.lastEditedAt - b.lastEditedAt
                    )}
                    renderItem={this.renderNoteItem}
                    keyExtractor={(item, index) => item + index}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        margin: LAYOUT_MARGIN,
    },
    listContainer: {},
});

const fakeData = [
    {
        title: "HELLO",
        type: "memo",
        contents: [
            {
                checked: true,
                content: "AZXCBSA",
            },
            {
                checked: false,
                content: "XXXXX",
            },
        ],
        lastEditedAt: new Date(2018, 5, 9),
    },
    {
        title: "CHECKLIST",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "ASDF",
            },
            {
                checked: false,
                content: "GGGGGG",
            },
        ],
        lastEditedAt: new Date(2018, 4, 10),
    },
];
