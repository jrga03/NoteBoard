import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from "react-native";

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

        const { title, type, contents, lastEditedAt, pinned } = this.props.navigation.state.params.memo;

        this.setState({
            title,
            type,
            contents,
            lastEditedAt,
            pinned,
        });
    }

    renderNoteContent = ({ item }) => {
        const { noteContentText } = styles;

        if (this.state.type === "memo") {
            return <TextInput style={noteContentText} value={item.content} underlineColorAndroid="transparent" />;
        } else if (this.state.type === "checklist") {
            return (
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Icon
                            type="material-icons"
                            name={item.checked ? "check-box" : "check-box-outline-blank"}
                            color={item.checked ? SWATCH.GRAY : SWATCH.BLACK}
                        />
                    </View>
                    <TextInput
                        style={item.checked ? { textDecorationLine: "line-through" } : null}
                        value={item.content}
                        underlineColorAndroid="transparent"
                        multiline={true}
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
        const { title, type, lastEditedAt, contents, pinned } = this.state;

        return (
            <View style={mainContainer}>
                <View style={container}>
                    <TextInput
                        style={[noteTitleText, { backgroundColor: "red" }]}
                        value={title}
                        placeholder="Title"
                        underlineColorAndroid="transparent"
                    />
                    <FlatList
                        // contentContainerStyle={container}
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
                        <Text style={footerText}>Edited</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={footerItemContainer}>
                        <Icon type="material-icons" name="more" size={22} color={SWATCH.GRAY} />
                    </TouchableOpacity>
                </View>{" "}
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
        padding: LAYOUT_MARGIN,
    },
    noteTitleText: {
        fontWeight: "bold",
        fontSize: 16,
        padding: 0,
        margin: 0,
    },
    noteContentText: {},
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
        color: SWATCH.GRAY
    },
});
