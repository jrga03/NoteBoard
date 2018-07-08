import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { SWATCH } from "../../constants";

export default class NoteMemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            type: null,
            contents: null,
            lastEditedAt: null,
            pinned: null,
        };
    }
    renderNoteContent = ({ item }) => {
        const { checklistItemContainer, checkboxIconContainer, noteContentText } = styles;
        const { type } = this.props.memo;

        if (type === "checklist") {
            if (!item.checked) {
                return (
                    <View style={checklistItemContainer}>
                        <View style={checkboxIconContainer}>
                            <Icon
                                type="material-icons"
                                name={"check-box-outline-blank"}
                                color={SWATCH.BLACK}
                                size={16}
                            />
                        </View>
                        <Text style={noteContentText}>{item.content}</Text>
                    </View>
                );
            }
        } else {
            return <Text style={noteContentText}>{item.content}</Text>;
        }
    };

    render() {
        const { container, titleText, checkedItemText } = styles;
        const { memo } = this.props;
        const { title, contents, lastEditedAt, type } = memo;

        const checkedItemsCount = contents.reduce((acc, item) => (item.checked ? acc + 1 : acc), 0);

        return (
            <View style={container}>
                <Text style={titleText}>{title}</Text>
                <FlatList
                    data={contents}
                    renderItem={this.renderNoteContent}
                    keyExtractor={(item, index) => item + index}
                />
                {type === "checklist" && (
                    <Text style={checkedItemText}>
                        {`+${checkedItemsCount} checked ${checkedItemsCount > 1 ? "items" : "item"}`}
                    </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        backgroundColor: SWATCH.WHITE,
        width: "100%",
        padding: 7,
    },
    titleText: {
        fontWeight: "bold",
        fontFamily: Platform.OS === "ios" ? "HelveticaNeue-Bold" : "Roboto",
        color: SWATCH.BLACK,
        paddingTop: Platform.OS === "ios" ? 4 : 2,
        paddingBottom: Platform.OS === "ios" ? 11 : 9,
    },
    checklistItemContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    noteContentText: {
        color: SWATCH.BLACK,
        textAlignVertical: "center",
        fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
    },
    checkedItemText: {
        fontSize: 14,
        fontFamily: Platform.OS === "ios" ? "Courier New" : "serif",
        color: SWATCH.GRAY,
        paddingLeft: 5,
        paddingTop: Platform.OS === "ios" ? 11 : 9,
        paddingBottom: Platform.OS === "ios" ? 4 : 2,
    },
    checkboxIconContainer: {
        paddingRight: 10,
    },
});
