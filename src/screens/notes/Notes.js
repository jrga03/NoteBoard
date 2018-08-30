import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    ScrollView,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import NoteMemo from "./NoteMemo";
import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import { openNote, createNote, updateNoteList } from "../../actions";
import { FirebaseService } from "../../services";

let leftColumnHeight = 0;
let rightColumnHeight = 0;

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: [],
            dataPinned: [],
            leftList: [],
            leftPinned: [],
            rightList: [],
            rightPinned: [],
            multiSelectMode: false,
            selected: [],
            windowWidth: Dimensions.get("window").width,
        };
    }

    componentDidMount() {
        // console.log("home props", this.props);
        // this.fetchNotes();
        FirebaseService.addNotesListener(this.fetchNotes);
        Dimensions.addEventListener("change", this.handleOrientationChange);
    }

    componentWillUnmount() {
        FirebaseService.removeNotesListener(this.fetchNotes);
        Dimensions.removeEventListener("change", this.handleOrientationChange);
    }

    componentDidUpdate() {
        // const test = this.props.navigation.getParam("noteLayout", null);
        // console.log("getparam", test);
        console.log("home props update", this.props, this.state);
    }

    handleOrientationChange = ({ window }) => this.setState({ windowWidth: window.width });

    fetchNotes = (data) => {
        this.setState({ isLoading: true });

        const notes = [];
        let index = 0;
        data.forEach((note) => {
            let noteObj = {
                ...note.val(),
                overallIndex: index,
            };
            notes.push(noteObj);

            index++;
        });

        let list = [];
        let listPinned = [];
        let leftList = [];
        let rightList = [];
        let leftPinned = [];
        let rightPinned = [];
        notes.forEach((item) => {
            item.pinned ? listPinned.push(item) : list.push(item);
            item.pinned
                ? leftPinned.length > rightPinned.length
                    ? rightPinned.push(item)
                    : leftPinned.push(item)
                : leftList.length > rightList.length
                    ? rightList.push(item)
                    : leftList.push(item);
        });

        this.setState({
            data: list,
            dataPinned: listPinned,
            leftList,
            leftPinned,
            rightList,
            rightPinned,
            isLoading: false,
        });
        this.props.updateNoteList(
            Object.values(data.toJSON())
                .sort((a, b) => {
                    if (a.lastEditedAtMsec < b.lastEditedAtMsec) return -1;
                    if (a.lastEditedAtMsec > b.lastEditedAtMsec) return 1;
                    return 0;
                })
                .map((note, index) => ({ ...note, overallIndex: index }))
        );
    };

    handleRefresh = () => {
        FirebaseService.fetchNotes(this.fetchNotes);
    };

    // fetchNotes = () => {
    //     return FirebaseService.fetchNotes((err, data) => {
    //         if (err) {
    //             console.log("error fetchNotes", err);
    //         } else {
    //             const list = [];
    //             const listPinned = [];
    //             const leftList = [];
    //             const rightList = [];
    //             const leftPinned = [];
    //             const rightPinned = [];
    //             data.map((item, index) => {
    //                 item.pinned ? listPinned.push(item) : list.push(item);
    //                 item.pinned
    //                     ? leftPinned.length > rightPinned.length
    //                         ? rightPinned.push(item)
    //                         : leftPinned.push(item)
    //                     : leftList.length > rightList.length
    //                         ? rightList.push(item)
    //                         : leftList.push(item);
    //             });

    //             this.setState({
    //                 data: list,
    //                 dataPinned: listPinned,
    //                 leftList,
    //                 leftPinned,
    //                 rightList,
    //                 rightPinned,
    //                 isLoading: false,
    //             });
    //             this.props.updateNoteList(data);
    //         }
    //     });
    // };

    handleMemoPress = (index, memo) => {
        this.props.openNote(index, memo);
        this.props.navigation.navigate("NoteItem");
    };

    handleCreateNote = (type) => {
        this.props.createNote(type);
        this.props.navigation.navigate("NoteItem");
    };

    // handleNoteChanges = () => {};

    handleOnLayoutEvent = ({ height }, index) => {
        // const layout = this.props.navigation.getParam("noteLayout", "tile");
        // console.log("onLayoutEvent", index);
        // if (layout === "tile") {
        //     const leftList = [];
        //     const rightList = [];
        //     if (leftColumnHeight > rightColumnHeight) {
        //         rightList.push(this.state.data[index]);
        //         rightColumnHeight += height;
        //     } else {
        //         leftList.push(this.state.data[index]);
        //         leftColumnHeight += height;
        //     }
        //     index === this.state.data.length -1 ? this.setState({ leftList, rightList }, () => console.log("end")) : console.log("not end");
        // }
    };

    renderNoteItem = ({ item, index }) => {
        const layout = this.props.navigation.getParam("noteLayout", "tile");

        const onPress = () => this.handleMemoPress(item.overallIndex, item);

        return (
            <TouchableOpacity onPress={onPress}>
                <NoteMemo
                    index={index}
                    memo={item}
                    layout={layout}
                    onLayoutEvent={this.handleOnLayoutEvent}
                    // handleNoteChanges={this.handleNoteChanges}
                    windowWidth={this.state.windowWidth}
                />
            </TouchableOpacity>
        );
    };

    renderTileLayout = () => {
        const {
            container,
            rowContainer,
            // listContainer,
            scrollContainer,
            rowItemContainer,
            rowItemContainerLeft,
            rowItemContainerRight,
        } = styles;

        const { leftList, rightList, isLoading } = this.state;
        return (
            <ScrollView style={container} contentContainerStyle={scrollContainer}>
                {isLoading && <ActivityIndicator size="large" animating={isLoading} />}
                <View style={rowContainer}>
                    {/* <View style={[rowItemContainer, rowItemContainerLeft]}> */}
                    <FlatList
                        contentContainerStyle={[rowItemContainer, rowItemContainerLeft]}
                        data={leftList}
                        extraData={this.state}
                        renderItem={this.renderNoteItem}
                        keyExtractor={(item) => `${item.id}`}
                    />
                    {/* </View>
                    <View style={[rowItemContainer, rowItemContainerRight]}> */}
                    <FlatList
                        contentContainerStyle={[rowItemContainer, rowItemContainerRight]}
                        data={rightList}
                        extraData={this.state}
                        renderItem={this.renderNoteItem}
                        keyExtractor={(item) => `${item.id}`}
                    />
                    {/* </View> */}
                </View>
            </ScrollView>
        );
    };

    renderListLayout = () => {
        const {
            container,
            scrollContainer,
            listContainer,
            emptyListContainer,
            addNoteText,
            sectionTitleText,
            sectionFooter,
        } = styles;

        const { data, dataPinned, isLoading } = this.state;
        return (
            // <View style={[container, scrollContainer]}>
            <SectionList
                style={container}
                contentContainerStyle={[scrollContainer, listContainer]}
                renderItem={this.renderNoteItem}
                extraData={this.state}
                renderSectionHeader={({ section: { title } }) =>
                    dataPinned.length > 0 && <Text style={sectionTitleText}>{title}</Text>
                }
                sections={[{ title: "Pinned", data: dataPinned }, { title: "Others", data }]}
                renderSectionFooter={() => dataPinned.length > 0 && <View style={sectionFooter} />}
                keyExtractor={(item) => `${item.id}`}
                refreshing={isLoading}
                onRefresh={this.handleRefresh}
                ListEmptyComponent={
                    !isLoading && (
                        <View style={emptyListContainer}>
                            <Text>You have no notes to show</Text>
                            <Text />
                            <TouchableOpacity onPress={() => this.handleCreateNote("memo")}>
                                <Text style={addNoteText}>Add Note</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                // stickySectionHeadersEnabled={false}
            />
            // {/* <FlatList
            //     contentContainerStyle={listContainer}
            //     data={data}
            //     extraData={this.state}
            //     renderItem={this.renderNoteItem}
            //     keyExtractor={(item) => `${item.id}`}
            //     refreshing={isLoading}
            //     onRefresh={this.fetchNotes}
            //     ListEmptyComponent={
            //         !isLoading && (
            //             <View style={emptyListContainer}>
            //                 <Text>You have no notes to show</Text>
            //                 <Text />
            //                 <TouchableOpacity onPress={this.handleCreateNote}>
            //                     <Text style={addNoteText}>Add Note</Text>
            //                 </TouchableOpacity>
            //             </View>
            //         )
            //     }
            // /> */}
            // </View>
        );
    };

    render() {
        const { footerText, container, footerContainer, footerItemContainer, footerTakeNoteContainer } = styles;

        const layout = this.props.navigation.getParam("noteLayout", "tile");

        return (
            <View style={container}>
                {layout === "tile" ? this.renderTileLayout() : this.renderListLayout()}

                <View style={footerContainer}>
                    <TouchableOpacity
                        style={[footerItemContainer, footerTakeNoteContainer]}
                        onPress={() => this.handleCreateNote("memo")}>
                        <Text style={footerText}>Take a note...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={footerItemContainer} onPress={() => this.handleCreateNote("checklist")}>
                        <Icon type="material-icons" name="format-list-bulleted" size={22} color={SWATCH.GRAY} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.noteList,
});
const mapDispatchToProps = (dispatch) => ({
    openNote: (index, note) => dispatch(openNote(index, note)),
    createNote: (type) => dispatch(createNote(type)),
    updateNoteList: (notes) => dispatch(updateNoteList(notes)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SWATCH.SOLITUDE,
    },
    scrollContainer: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        // margin: LAYOUT_MARGIN,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    sectionTitleText: {
        fontWeight: "bold",
        paddingVertical: 8,
        backgroundColor: SWATCH.SOLITUDE,
    },
    sectionFooter: {
        height: 20,
    },
    addNoteText: {
        color: SWATCH.BLUE,
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: LAYOUT_MARGIN,
    },
    rowItemContainer: {
        flex: 1,
    },
    rowItemContainerLeft: {
        marginLeft: LAYOUT_MARGIN,
        marginRight: LAYOUT_MARGIN / 2,
    },
    rowItemContainerRight: {
        marginRight: LAYOUT_MARGIN,
        marginLeft: LAYOUT_MARGIN / 2,
    },
    listContainer: {
        // flex: 1,
        marginHorizontal: LAYOUT_MARGIN,
        marginTop: LAYOUT_MARGIN,
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
    footerTakeNoteContainer: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    footerText: {
        color: SWATCH.GRAY,
    },
});
