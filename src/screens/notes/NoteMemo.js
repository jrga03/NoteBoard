import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { SWATCH, LAYOUT_MARGIN } from "../../constants";

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
        const {
            noteContentText,
            checkboxIconContainer,
            checklistItemContainer,
            noteContentTextListStyle,
            noteContentTextTileStyle,
            checkboxIconContainerListStyle,
            checkboxIconContainerTileStyle,
        } = styles;
        const { memo, layout } = this.props;
        const { type } = memo;

        if (type === "checklist") {
            if (!item.checked) {
                return (
                    <View style={checklistItemContainer}>
                        <View
                            style={[
                                checkboxIconContainer,
                                layout === "tile" ? checkboxIconContainerTileStyle : checkboxIconContainerListStyle,
                            ]}>
                            {/* style={[checkboxIconContainer, checkboxIconContainerTileStyle]}> */}
                            <Icon
                                type="material-icons"
                                name={"check-box-outline-blank"}
                                color={SWATCH.BLACK}
                                size={16}
                            />
                        </View>
                        <Text
                            style={[
                                noteContentText,
                                layout === "tile" ? noteContentTextTileStyle : noteContentTextListStyle,
                            ]}>
                            {item.content}
                        </Text>
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
        const { title, contents, type } = memo;

        const checkedItemsCount = contents.reduce((acc, item) => (item.checked ? acc + 1 : acc), 0);

        return (
            <View style={container} onLayout={(event) => console.log(event.nativeEvent.layout)}>
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
        marginVertical: LAYOUT_MARGIN / 2,
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
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    noteContentText: {
        color: SWATCH.BLACK,
        fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
        textAlignVertical: "top",
    },
    noteContentTextTileStyle: {
        flex: 0.9,
    },
    noteContentTextListStyle: {
        flex: 0.95,
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
        paddingTop: Platform.OS === "android" ? 2 : 0,
        paddingRight: 8,
    },
    checkboxIconContainerTileStyle: {
        flex: 0.1,
    },
    checkboxIconContainerListStyle: {
        flex: 0.05,
    },
});
