import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import NoteMemo from "./NoteMemo";
import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import { selectNote } from "../../actions";

let leftColumnHeight = 0;
let rightColumnHeight = 0;

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            leftList: [],
            rightList: [],
        };
    }

    componentDidMount() {
        console.log("home props", this.props);
        const leftList = [];
        const rightList = [];
        const { data } = this.props;
        data.sort((a, b) => a.lastEditedAt - b.lastEditedAt);
        data.map((item, index) => (index % 2 === 0 ? leftList.push(item) : rightList.push(item)));

        this.setState({
            // data,
            leftList,
            rightList,
        });
    }

    componentDidUpdate() {
        // const test = this.props.navigation.getParam("noteLayout", null);
        // console.log("getparam", test);
        console.log("home props update", this.props, this.state);
    }

    handleMemoPress = (index, memo) => {
        this.props.selectNote(index, memo);
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

        const onPress = () => this.handleMemoPress(index, item);

        return (
            <TouchableOpacity onPress={onPress}>
                <NoteMemo
                    index={index}
                    memo={item}
                    layout={layout}
                    onLayoutEvent={this.handleOnLayoutEvent}
                    // handleNoteChanges={this.handleNoteChanges}
                />
            </TouchableOpacity>
        );
    };

    renderTileLayout = () => {
        const {
            container,
            rowContainer,
            listContainer,
            scrollContainer,
            rowItemContainer,
            rowItemContainerLeft,
            rowItemContainerRight,
        } = styles;

        const { leftList, rightList } = this.state;
        return (
            <ScrollView style={container} contentContainerStyle={scrollContainer}>
                <View style={rowContainer}>
                    <View style={[rowItemContainer, rowItemContainerLeft]}>
                        <FlatList
                            style={listContainer}
                            data={leftList}
                            extraData={this.state}
                            renderItem={this.renderNoteItem}
                            keyExtractor={(item) => `${item.id}`}
                        />
                    </View>
                    <View style={[rowItemContainer, rowItemContainerRight]}>
                        <FlatList
                            style={listContainer}
                            data={rightList}
                            extraData={this.state}
                            renderItem={this.renderNoteItem}
                            keyExtractor={(item) => `${item.id}`}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    };

    renderListLayout = () => {
        const { container, scrollContainer, listContainer } = styles;

        const { data } = this.props;
        return (
            <View style={[container, scrollContainer]}>
                <FlatList
                    style={listContainer}
                    data={data}
                    extraData={this.state}
                    renderItem={this.renderNoteItem}
                    keyExtractor={(item) => `${item.id}`}
                />
            </View>
        );
    };

    render() {
        const { footerText, container, footerContainer, footerItemContainer, footerTakeNoteContainer } = styles;

        const layout = this.props.navigation.getParam("noteLayout", "tile");

        return (
            <View style={container}>
                {layout === "tile" ? this.renderTileLayout() : this.renderListLayout()}

                <View style={footerContainer}>
                    <TouchableOpacity style={[footerItemContainer, footerTakeNoteContainer]}>
                        <Text style={footerText}>Take a note...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={footerItemContainer}>
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
    selectNote: (index, note) => dispatch(selectNote(index, note)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        margin: LAYOUT_MARGIN,
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
    },
    rowItemContainer: {
        flex: 1,
    },
    rowItemContainerLeft: {
        marginRight: LAYOUT_MARGIN / 2,
    },
    rowItemContainerRight: {
        marginLeft: LAYOUT_MARGIN / 2,
    },
    listContainer: { flex: 1 },
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
