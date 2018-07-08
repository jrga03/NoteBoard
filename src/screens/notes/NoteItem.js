import React, { Component } from "react";
import { View, TextInput, StyleSheet, FlatList } from "react-native";

import { Icon } from "react-native-elements";
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

        const {
            title,
            type,
            contents,
            lastEditedAt,
            pinned,
        } = this.props.navigation.state.params.memo;

        this.setState({
            title,
            type,
            contents,
            lastEditedAt,
            pinned,
        });
    }

    renderNoteContent = ({ item }) => {
        if (this.state.type === "memo") {
            return (
                <TextInput
                    value={item.content}
                    underlineColorAndroid="transparent"
                />
            );
        } else if (this.state.type === "checklist") {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Icon
                        type="material-icons"
                        name={
                            item.checked
                                ? "check-box"
                                : "check-box-outline-blank"
                        }
                        color={item.checked ? SWATCH.GRAY : SWATCH.BLACK}
                    />
                    <TextInput
                        style={
                            item.checked
                                ? { textDecorationLine: "line-through" }
                                : null
                        }
                        value={item.content}
                        underlineColorAndroid="transparent"
                    />
                </View>
            );
        }
    };

    render() {
        const { container, noteTitleText } = styles;
        const { title, type, lastEditedAt, contents, pinned } = this.state;

        return (
            <View style={container}>
                <TextInput
                    style={[noteTitleText, {backgroundColor:"red"}]}
                    value={title}
                    placeholder="Title"
                    underlineColorAndroid="transparent"
                />
                <FlatList
                    style={{}}
                    data={contents}
                    renderItem={this.renderNoteContent}
                    keyExtractor={(item, index) => `${index}`}
                />
                <View />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        padding: LAYOUT_MARGIN,
    },
    noteTitleText: {
        fontWeight: "bold",
        fontSize: 16,
        padding: 0,
        margin: 0,
    },
    noteContentText: {},
});
