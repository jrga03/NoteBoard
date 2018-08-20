import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Icon } from "react-native-elements";
import Moment from "moment";
import { connect } from "react-redux";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import {
    // editNoteTitle,
    // editNoteContent,
    editNoteItem,
    deleteNote,
    togglePin,
    updateSelectedNote,
    clearSelectedNote,
} from "../../actions";

const selection = { start: null, end: null };
let contentId;

class NoteItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wasChanged: false,
            note: {
                contents: null,
                id: null,
                lastEditedAt: null,
                pinned: false,
                title: null,
                type: null,
            },
            index: null,
            footerMenuSelected: null,
            footerMenu: [],
            forDeletion: false,
        };

        this.inputs = {};
    }

    componentDidMount() {
        // console.log("NoteItem mounted", this.props);
        contentId = 0;

        const { note, index } = this.props.selectedNote;

        const { pinned, contents } = note;
        this.props.navigation.setParams({
            isPinned: pinned,
            togglePin: this.togglePinNote.bind(this),
        });

        const contentsWithId = contents.map((c) => {
            c.cId = contentId;
            contentId++;
            return c;
        });

        this.setState({
            note: {
                ...note,
                contents: contentsWithId,
            },
            index,
        });
    }

    componentDidUpdate() {
        // console.log("update selected note", this.state);
    }

    componentWillUnmount() {
        if (!this.state.forDeletion && this.state.wasChanged) {
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
        } else {
            this.props.clearSelectedNote();
        }
    }

    updateNote = () => {
        // console.log("update", this.state, "\n\n");
        const contentsWithoutIndex = this.state.note.contents.map(({ checked, content }) => ({ checked, content }));

        const noteWithoutContentIndex = {
            ...this.state.note,
            contents: contentsWithoutIndex,
        };
        // console.log("noteWithoutContentIndex", noteWithoutContentIndex);
        this.props.updateSelectedNote(noteWithoutContentIndex);
    };

    togglePinNote() {
        this.props.navigation.setParams({ isPinned: !this.state.note.pinned });
        this.props.togglePinNote();
        this.setState({
            wasChanged: true,
            note: {
                ...this.state.note,
                pinned: !this.state.note.pinned,
            },
        });
    }

    handleChangeText = (data) => {
        if (data.type === "title") {
            // this.props.editTitle(data.text);
            this.setState(
                {
                    wasChanged: true,
                    note: {
                        ...this.state.note,
                        title: data.text,
                        // lastEditedAt: Moment().toISOString(),
                    },
                },
                this.updateNote
            );
        } else {
            // this.props.editContent(data.index, {
            //     ...this.props.selectedNote.note.contents[data.index],
            //     content: data.text,
            // });

            const { contents } = this.state.note;
            const item = contents[data.index];
            if (item !== undefined) {
                item.content = data.text;
                contents.splice(data.index, 1, item);
                this.setState(
                    {
                        wasChanged: true,
                        note: {
                            ...this.state.note,
                            contents,
                            // lastEditedAt: Moment().toISOString(),
                        },
                    },
                    this.updateNote
                );
            }
        }
    };

    handlePressCheckbox = (index) => {
        // this.props.editContent(index, {
        //     ...this.props.selectedNote.note.contents[index],
        //     checked: !this.props.selectedNote.note.contents[index].checked,
        // });

        const { contents } = this.state.note;
        const item = contents[index];
        item.checked = this.state.note.contents[index].checked;
        contents.splice(index, 1, item);
        this.setState(
            {
                wasChanged: true,
                note: {
                    ...this.state.note,
                    contents,
                    // lastEditedAt: Moment().toISOString(),
                },
            },
            this.updateNote
        );
    };

    handleAddLine = () => {
        this.setState(
            {
                wasChanged: true,
                note: {
                    ...this.state.note,
                    contents: [
                        ...this.state.note.contents,
                        {
                            content: "",
                            checked: false,
                            cId: contentId,
                        },
                    ],
                },
            },
            this.updateNote
        );
        this.inputs[`content_${contentId}`].focus();
        contentId++;
    };

    handleAddOrDeleteLine = (key, { index, cId, start, end }) => {
        // console.log("handleAddOrDeleteLine", key, index, cId, start, end);
        const contents = Array.from(this.state.note.contents);
        // const test = contents;
        // console.log("handleAddOrDeleteLine before", test);

        switch (key) {
            case "Enter":
                let newContent;
                if ((start === 0 && end === 0) || contents[index].content === "") {
                    newContent = "";
                } else {
                    newContent = contents[index].content.substring(start);
                    contents[index].content = contents[index].content.substring(0, start);
                }
                contents.splice(index + 1, 0, {
                    content: newContent,
                    checked: false,
                    cId: contentId,
                });

                this.setState(
                    {
                        wasChanged: true,
                        note: {
                            ...this.state.note,
                            contents,
                        },
                    },
                    () => {
                        this.updateNote();
                        // this.inputs[`content_${cId}`].blur();

                        const nextItemId = contents[index + 1].cId;
                        // console.log("nextItemId", nextItemId);
                        // this.inputs[`content_${nextItemId}`].focus();
                        // this.inputs[`content_${nextItemId}`].setNativeProps({
                        //     start: 0,
                        //     end: 0,
                        // });
                    }
                );
                break;
            case "Backspace":
                if (((start === 0 && end === 0) || contents[index].content === "") && index > 0) {
                    const prevItemId = contents[index - 1].cId;

                    contents[index - 1].content += contents[index].content;
                    if (!!contents[index + 1]) {
                        contents[index].content = contents[index + 1].content;
                        contents.splice(index, 1);
                    } else {
                        contents.pop();
                    }
                    // !!contents[index + 1]
                    //     ? (contents[index].content = contents[index + 1].content)
                    //     : (contents[index].content = "");
                    // contents.splice(index, 1);
                    // this.inputs[`content_${cId}`].blur();
                    this.setState(
                        {
                            wasChanged: true,
                            note: {
                                ...this.state.note,
                                contents,
                            },
                        },
                        () => {
                            this.updateNote();
                            this.inputs[`content_${prevItemId}`].focus();
                            this.inputs[`content_${prevItemId}`].setNativeProps({
                                start: contents[index - 1].content.length,
                                end: contents[index - 1].content.length,
                            });
                        }
                    );
                }
                break;
        }
    };

    handleFooterMenuItemPress = (type, payload) => {
        switch (type) {
            case "delete":
                if (this.state.index !== null) {
                    this.setState({ forDeletion: true }, () => {
                        this.props.deleteNote(payload);
                        this.props.navigation.goBack();
                    });
                } else {
                    this.props.navigation.goBack();
                }
                break;
            case "photo":
                break;
            case "gallery":
                break;
            case "location":
                this.setState(
                    {
                        footerMenu: [],
                        footerMenuSelected: null,
                    },
                    () => this.props.navigation.navigate("NoteMap")
                );
                break;
            case "checkbox":
                break;
            case "collaborator":
                break;
        }
    };

    renderNoteContentMemo = ({ item, index }) => {
        const { noteContentText } = styles;

        onChangeText = (text) => this.handleChangeText({ type: "content", index, text });
        onAddOrDeleteLine = ({ nativeEvent: { key } }) => {
            // console.log("test", key, item.cId, selection);
            key === "Enter" || key === "Backspace"
                ? this.handleAddOrDeleteLine(key, {
                      index,
                      cId: item.cId,
                      start: selection.start,
                      end: selection.end,
                  })
                : null;
        };
        onSelectionChange = ({
            nativeEvent: {
                selection: { start, end },
            },
        }) => ([selection.start, selection.end] = [start, end]);

        return (
            <TextInput
                style={noteContentText}
                value={item.content}
                underlineColorAndroid="transparent"
                multiline={true}
                returnKeyType={Platform.OS === "ios" ? "default" : "next"}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoFocus={this.state.index === null ? true : false}
                onFocus={() =>
                    this.setState({
                        footerMenu: [],
                        footerMenuSelected: null,
                    })
                }
                onKeyPress={onAddOrDeleteLine}
                onSelectionChange={onSelectionChange}
                ref={(ref) => (this.inputs[`content_${item.cId}`] = ref)}
            />
        );
    };

    renderNoteContentChecklist = ({ item, index }) => {
        const { noteContentText, noteContentCheckBox, noteContentCheckedText, checklistRowContainer } = styles;

        onChangeText = (text) => this.handleChangeText({ type: "content", index, text });
        onPressCheckbox = () => this.handlePressCheckbox(index);
        onAddOrDeleteLine = ({ nativeEvent: { key } }) => {
            // console.log("onAddOrDeleteLine", key, index);
            key === "Enter" || key === "Backspace"
                ? this.handleAddOrDeleteLine(key, {
                      index,
                      cId: item.cId,
                      start: selection.start,
                      end: selection.end,
                  })
                : null;
        };
        onSelectionChange = ({
            nativeEvent: {
                selection: { start, end },
            },
        }) => ([selection.start, selection.end] = [start, end]);

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
                    returnKeyType={Platform.OS === "ios" ? "default" : "next"}
                    onChangeText={selection.start === 0 && selection.end === 0 ? null : onChangeText}
                    // onChange={(e) => e.nativeEvent.text.indexOf("\n") > -1 ? e.preventDefault : null}
                    blurOnSubmit={true}
                    // onBlur={() => console.log("this", this)}
                    autoCorrect={false}
                    autoFocus={this.state.index === null ? true : false}
                    onFocus={() =>
                        this.setState({
                            footerMenu: [],
                            footerMenuSelected: null,
                        })
                    }
                    onKeyPress={onAddOrDeleteLine}
                    onSelectionChange={onSelectionChange}
                    ref={(ref) => (this.inputs[`content_${item.cId}`] = ref)}
                />
            </View>
        );
    };

    render() {
        const {
            container,
            noteTitleText,
            mainContainer,
            footerItemText,
            noteContentText,
            footerContainer,
            staticFooterText,
            footerMenuActive,
            contentContainer,
            listItemContainer,
            footerRowContainer,
            footerItemContainer,
            noteContentCheckBox,
            checklistRowContainer,
            staticFooterContainer,
            footerItemTextContainer,
            checklistFooterContainer,
            staticFooterMainContentContainer,
        } = styles;
        const { footerMenu, footerMenuSelected, note } = this.state;
        const { id, title, lastEditedAt, contents, type } = note;
        const { memoAdd, checklistAdd, more } = noteItemMenuItems;

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
                <ScrollView style={mainContainer} contentContainerStyle={container}>
                    <TextInput
                        style={noteTitleText}
                        value={title}
                        placeholder="Title"
                        underlineColorAndroid="transparent"
                        onChangeText={onChangeText}
                    />
                    <FlatList
                        contentContainerStyle={contentContainer}
                        data={contents}
                        extraData={this.state}
                        renderItem={type === "memo" ? this.renderNoteContentMemo : this.renderNoteContentChecklist}
                        keyExtractor={(item, index) => `${index}`}
                        ListFooterComponent={
                            type === "memo" ? null : (
                                <TouchableOpacity onPress={this.handleAddLine}>
                                    <View style={[checklistRowContainer, checklistFooterContainer]}>
                                        <View style={noteContentCheckBox}>
                                            <Icon type="material-icons" name="add" color={SWATCH.GRAY} />
                                        </View>
                                        <Text style={[noteContentText, footerItemText]}>List Item</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    />
                </ScrollView>
                <View style={footerContainer}>
                    <View>
                        {!!footerMenuSelected &&
                            footerMenu.map((item) => (
                                <TouchableOpacity
                                    key={item.onPress}
                                    onPress={() => this.handleFooterMenuItemPress(item.onPress, id)}>
                                    <View style={[footerRowContainer, listItemContainer]}>
                                        <View style={footerItemContainer}>
                                            <Icon
                                                type={item.icon.type}
                                                name={item.icon.name}
                                                size={22}
                                                color={SWATCH.GRAY}
                                            />
                                        </View>
                                        <View style={[footerItemContainer, footerItemTextContainer]}>
                                            <Text style={footerItemText}>{item.text}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                    </View>
                    <View style={[footerRowContainer, staticFooterContainer]}>
                        <TouchableOpacity
                            style={[footerItemContainer, footerMenuSelected === "ADD" ? footerMenuActive : null]}
                            onPress={() => {
                                if (footerMenuSelected === "ADD") {
                                    this.setState({
                                        footerMenu: [],
                                        footerMenuSelected: null,
                                    });
                                } else {
                                    this.setState({
                                        footerMenu: type === "memo" ? memoAdd : checklistAdd,
                                        footerMenuSelected: "ADD",
                                    });
                                }
                            }}>
                            <Icon type="material-icons" name="add-box" size={22} color={SWATCH.GRAY} />
                        </TouchableOpacity>
                        <View style={[footerItemContainer, staticFooterMainContentContainer]}>
                            <Text style={staticFooterText}>Edited {lastEditedAtFormatted()}</Text>
                        </View>
                        <TouchableOpacity
                            style={[footerItemContainer, footerMenuSelected === "MORE" ? footerMenuActive : null]}
                            onPress={() => {
                                if (footerMenuSelected === "MORE") {
                                    this.setState({
                                        footerMenu: [],
                                        footerMenuSelected: null,
                                    });
                                } else {
                                    this.setState({
                                        footerMenu: more,
                                        footerMenuSelected: "MORE",
                                    });
                                }
                            }}>
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
    // editTitle: (text) => dispatch(editNoteTitle(text)),
    // editContent: (index, content) => dispatch(editNoteContent(index, content)),
    updateNoteList: (index, item) => dispatch(editNoteItem(index, item)),
    deleteNote: (id) => dispatch(deleteNote(id)),
    togglePinNote: () => dispatch(togglePin()),
    updateSelectedNote: (note) => dispatch(updateSelectedNote(note)),
    clearSelectedNote: () => dispatch(clearSelectedNote()),
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
        // flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: LAYOUT_MARGIN * 2,
    },
    contentContainer: {
        paddingHorizontal: LAYOUT_MARGIN * 2,
    },
    noteTitleText: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 0,
        margin: 0,
        paddingBottom: 15,
        paddingHorizontal: LAYOUT_MARGIN * 2,
    },
    checklistRowContainer: {
        flexDirection: "row",
        marginBottom: 3,
        justifyContent: "center",
    },
    checklistFooterContainer: {
        alignItems: "center",
    },
    noteContentText: {
        flex: 1,
        padding: 0,
        margin: 0,
        paddingHorizontal: 5,
        // justifyContent: "center",
        // alignItems: "center",
        // alignSelf: "stretch",
        // backgroundColor: "green",
    },
    noteContentCheckBox: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingRight: 10,
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
        alignItems: "center",
        justifyContent: "flex-start",
    },
    listItemContainer: {
        height: 40,
    },
    staticFooterContainer: {
        flexBasis: 40,
        borderTopColor: SWATCH.GRAY,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    footerItemContainer: {
        justifyContent: "center",
        height: "100%",
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
    footerMenuActive: {
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
});

const noteItemMenuItems = {
    memoAdd: [
        {
            text: "Take Photo",
            icon: {
                type: "material-icons",
                name: "photo-camera",
            },
            onPress: "photo",
        },
        {
            text: "Choose Image",
            icon: {
                type: "material-icons",
                name: "insert-photo",
            },
            onPress: "gallery",
        },
        {
            text: "Tag Location",
            icon: {
                type: "material-icons",
                name: "pin-drop",
            },
            onPress: "location",
        },
        {
            text: "Checkboxes",
            icon: {
                type: "material-icons",
                name: "check",
            },
            onPress: "checkbox",
        },
    ],
    checklistAdd: [
        {
            text: "Take Photo",
            icon: {
                type: "material-icons",
                name: "photo-camera",
            },
            onPress: "photo",
        },
        {
            text: "Choose Image",
            icon: {
                type: "material-icons",
                name: "insert-photo",
            },
            onPress: "gallery",
        },
        {
            text: "Tag Location",
            icon: {
                type: "material-icons",
                name: "pin-drop",
            },
            onPress: "location",
        },
    ],
    more: [
        {
            text: "Delete",
            icon: {
                type: "material-icons",
                name: "delete",
            },
            onPress: "delete",
        },
        {
            text: "Collaborator",
            icon: {
                type: "material-icons",
                name: "person-add",
            },
            onPress: "collaborator",
        },
    ],
};
