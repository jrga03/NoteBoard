import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import Moment from "moment";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";

export default class NoteItem extends Component {
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
    componentDidMount() {
        // console.log(this);

        const { memo, index } = this.props.navigation.state.params;
        const { title, type, contents, lastEditedAt, pinned } = memo;

        this.props.navigation.setParams({ isPinned: pinned });

        this.setState({
            title,
            type,
            contents,
            lastEditedAt,
            pinned,
            index,
        });
    }

    handleChangeText = (type, index, text) => {
        console.log("handleChangeText", type, index, text);
    };

    renderNoteContent = ({ item, index }) => {
        const { noteContentText, noteContentCheckBox, noteContentCheckedText, checklistRowContainer } = styles;

        onChangeText = (text) => this.handleChangeText("content", index, text);

        if (this.state.type === "memo") {
            return (
                <TextInput
                    style={noteContentText}
                    value={item.content}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    onChangeText={onChangeText}
                    autoCorrect={false}
                />
            );
        } else if (this.state.type === "checklist") {
            return (
                <View style={checklistRowContainer}>
                    <View style={noteContentCheckBox}>
                        <Icon
                            type="material-icons"
                            name={item.checked ? "check-box" : "check-box-outline-blank"}
                            color={item.checked ? SWATCH.GRAY : SWATCH.BLACK}
                        />
                    </View>
                    <TextInput
                        style={[noteContentText, item.checked ? noteContentCheckedText : null]}
                        value={item.content}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        onChangeText={onChangeText}
                        autoCorrect={false}
                    />
                </View>
            );
        }
    };

    render() {
        const {
            mainContainer,
            container,
            footerText,
            noteTitleText,
            footerContainer,
            footerItemContainer,
            footerMainContentContainer,
        } = styles;
        const { title, lastEditedAt, contents, index } = this.state;

        lastEditedAtFormatted = () => {
            const lastEdit = Moment(lastEditedAt);

            return lastEdit.isSame(Moment(), "day")
                ? lastEdit.format("HH:mm")
                : lastEdit.isSame(Moment(), "year")
                    ? lastEdit.format("MMM D")
                    : lastEdit.format("MMM D, YYYY");
        };

        onChangeText = (text) => this.handleChangeText("title", index, text);

        return (
            <View style={mainContainer}>
                <View style={container}>
                    <TextInput
                        style={noteTitleText}
                        value={title}
                        placeholder="Title"
                        underlineColorAndroid="transparent"
                        onChangeText={onChangeText}
                    />
                    <FlatList
                        // contentContainerStyle={{marginVertical: 3}}
                        data={contents}
                        renderItem={this.renderNoteContent}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <View style={footerContainer}>
                    <TouchableOpacity style={footerItemContainer}>
                        <Icon type="material-icons" name="add-box" size={22} color={SWATCH.GRAY} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[footerItemContainer, footerMainContentContainer]}>
                        <Text style={footerText}>Edited {lastEditedAtFormatted()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={footerItemContainer}>
                        <Icon type="material-icons" name="more" size={22} color={SWATCH.GRAY} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        padding: LAYOUT_MARGIN * 2,
    },
    noteTitleText: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 0,
        margin: 0,
        paddingBottom: 15,
    },
    checklistRowContainer: {
        flexDirection: "row",
        marginBottom: 3,
    },
    noteContentText: {
        flex: 1,
        padding: 0,
        margin: 0,
        paddingHorizontal: 5,
        // justifyContent: "flex-start",
        // alignItems: "flex-start",
        // alignSelf: "stretch",
        // backgroundColor: "green",
    },
    noteContentCheckBox: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // backgroundColor: "red",
    },
    noteContentCheckedText: {
        textDecorationLine: "line-through",
        color: SWATCH.GRAY,
    },
    footerContainer: {
        flexDirection: "row",
        flexBasis: 40,
        justifyContent: "flex-start",
        alignItems: "center",
        // paddingHorizontal: 5,
        backgroundColor: SWATCH.WHITE,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        elevation: 4,
    },
    footerItemContainer: {
        paddingHorizontal: 10,
    },
    footerMainContentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    footerText: {
        color: SWATCH.GRAY,
        fontSize: 11,
    },
});
