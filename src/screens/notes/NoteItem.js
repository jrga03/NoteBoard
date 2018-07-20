import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import Moment from "moment";
import { connect } from "react-redux";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import { editNoteTitle, editNoteContent, editNoteItem } from "../../actions";

let addMenuItems, moreMenuItems;

class NoteItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wasChanged: false,
            note: null,
            footerMenu: [],
        };
    }
    componentDidMount() {
        // console.log("NoteItem mounted", this.props);

        const { note } = this.props.selectedNote;
        const { pinned } = note;

        this.props.navigation.setParams({ isPinned: pinned });
        this.setState({ note });

        addMenuItems = [
            {
                text,
                icon: {
                    name,
                    type,
                },
                onPress,
            },
        ];
    }

    componentDidUpdate() {
        // console.log("update selected note", this.props.selectedNote.note);
    }

    componentWillUnmount() {
        if (this.state.wasChanged) {
            const { note, index } = this.props.selectedNote;

            const checkboxChanged = note.contents.some(
                (content, i) => content.checked === this.state.note.contents[i].checked
            );

            if (
                !!index ||
                !!note.title ||
                note.contents.reduce((acc, item) => (acc = !!item.content), false) ||
                checkboxChanged
            ) {
                // console.log("update triggered");
                this.props.updateNoteList(index, note);
            }
        }
    }

    handleChangeText = (data) => {
        this.setState({ wasChanged: true });
        // console.log("handleChangeText", type, index, text);
        if (data.type === "title") {
            // console.log(this.props.selectedNote[type]);
            this.props.editTitle(data.text);
        } else {
            this.props.editContent(data.index, {
                ...this.props.selectedNote.note.contents[data.index],
                content: data.text,
            });
            // console.log(this.props.selectedNote.contents[index]);
        }
    };

    handlePressCheckbox = (index) => {
        this.setState({ wasChanged: true });

        this.props.editContent(index, {
            ...this.props.selectedNote.note.contents[index],
            checked: !this.props.selectedNote.note.contents[index].checked,
        });
    };

    renderNoteContent = ({ item, index }) => {
        const { noteContentText, noteContentCheckBox, noteContentCheckedText, checklistRowContainer } = styles;
        const { type } = this.props.selectedNote.note;

        onChangeText = (text) => this.handleChangeText({ type: "content", index, text });

        if (type === "memo") {
            return (
                <TextInput
                    style={noteContentText}
                    value={item.content}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    onChangeText={onChangeText}
                    autoCorrect={false}
                    autoFocus={this.props.selectedNote.index === null ? true : false}
                />
            );
        } else if (type === "checklist") {
            onPressCheckbox = () => this.handlePressCheckbox(index);

            return (
                <View style={checklistRowContainer}>
                    <TouchableOpacity onPress={onPressCheckbox}>
                        <View style={noteContentCheckBox}>
                            <Icon
                                type="material-icons"
                                name={item.checked ? "check-box" : "check-box-outline-blank"}
                                color={item.checked ? SWATCH.GRAY : SWATCH.BLACK}
                            />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        style={[noteContentText, item.checked ? noteContentCheckedText : null]}
                        value={item.content}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        onChangeText={onChangeText}
                        autoCorrect={false}
                        autoFocus={this.props.selectedNote.index === null ? true : false}
                    />
                </View>
            );
        }
    };

    renderFooterItem = ({ item }) => {};

    render() {
        const {
            container,
            noteTitleText,
            mainContainer,
            footerItemText,
            footerContainer,
            staticFooterText,
            footerRowContainer,
            footerItemContainer,
            staticFooterContainer,
            footerItemTextContainer,
            staticFooterMainContentContainer,
        } = styles;
        const { title, lastEditedAt, contents } = this.props.selectedNote.note;

        lastEditedAtFormatted = () => {
            const lastEdit = Moment(lastEditedAt);

            return lastEdit.isSame(Moment(), "day")
                ? lastEdit.format("HH:mm")
                : lastEdit.isSame(Moment(), "year")
                    ? lastEdit.format("MMM D")
                    : lastEdit.format("MMM D, YYYY");
        };

        onChangeText = (text) => this.handleChangeText({ type: "title", text });

        return (
            <View style={mainContainer}>
                <View style={container}>
                    <TextInput
                        style={noteTitleText}
                        value={title}
                        // controlled={true}
                        placeholder="Title"
                        underlineColorAndroid="transparent"
                        onChangeText={onChangeText}
                    />
                    <FlatList
                        // contentContainerStyle={{marginVertical: 3}}
                        data={contents}
                        extraData={this.props}
                        renderItem={this.renderNoteContent}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <View style={footerContainer}>
                    {/* <FlatList
                        data={this.state.footerMenu}
                        extraData={this.state}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => null}>
                                <View style={footerRowContainer}>
                                    <View style={footerItemContainer}>
                                        <Icon type="material-icons" name="delete" size={22} color={SWATCH.GRAY} />
                                    </View>
                                    <View style={[footerItemContainer, footerItemTextContainer]}>
                                        <Text style={footerItemText}>Delete</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => `${index}`}
                    /> */}
                    {/* <View>
                        <TouchableOpacity>
                            <View style={footerRowContainer}>
                                <View style={footerItemContainer}>
                                    <Icon type="material-icons" name="delete" size={22} color={SWATCH.GRAY} />
                                </View>
                                <View style={[footerItemContainer, footerItemTextContainer]}>
                                    <Text style={footerItemText}>Delete</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                    <View style={[footerRowContainer, staticFooterContainer]}>
                        <TouchableOpacity style={footerItemContainer} onPress={() => null}>
                            <Icon type="material-icons" name="add-box" size={22} color={SWATCH.GRAY} />
                        </TouchableOpacity>
                        <View style={[footerItemContainer, staticFooterMainContentContainer]}>
                            <Text style={staticFooterText}>Edited {lastEditedAtFormatted()}</Text>
                        </View>
                        <TouchableOpacity style={footerItemContainer} onPress={() => null}>
                            <Icon type="material-icons" name="more" size={22} color={SWATCH.GRAY} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedNote: state.selectedNote,
    noteList: state.noteList,
});
const mapDispatchToProps = (dispatch) => ({
    editTitle: (text) => dispatch(editNoteTitle(text)),
    editContent: (index, content) => dispatch(editNoteContent(index, content)),
    updateNoteList: (index, item) => dispatch(editNoteItem(index, item)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteItem);

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
        backgroundColor: SWATCH.WHITE,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowColor: SWATCH.BLACK,
        shadowOpacity: 0.05,
        elevation: 4,
    },
    footerRowContainer: {
        flexDirection: "row",
        flexBasis: 40,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    staticFooterContainer: {
        borderTopColor: SWATCH.GRAY,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    footerItemContainer: {
        paddingHorizontal: 10,
    },
    footerItemTextContainer: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        alignSelf: "stretch",
    },
    footerItemText: {
        color: SWATCH.GRAY,
    },
    staticFooterMainContentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    staticFooterText: {
        color: SWATCH.GRAY,
        fontSize: 11,
    },
});
