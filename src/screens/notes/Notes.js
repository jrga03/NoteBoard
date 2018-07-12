import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import NoteMemo from "./NoteMemo";

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
        // console.log("home props", this.props);
        const leftList = [];
        const rightList = [];
        const data = fakeData.sort((a, b) => a.lastEditedAt - b.lastEditedAt);
        data.map((item, index) => (index % 2 === 0 ? leftList.push(item) : rightList.push(item)));

        this.setState({
            data,
            leftList,
            rightList,
        });
    }

    componentDidUpdate() {
        // const test = this.props.navigation.getParam("noteLayout", null);
        // console.log("getparam", test);
        // console.log("home props update", this.props);
    }

    handleMemoPress = (memo, index) => this.props.navigation.navigate("NoteItem", { memo, index });

    handleNoteChanges = () => {};

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

        return (
            <TouchableOpacity onPress={() => this.handleMemoPress(item, index)}>
                <NoteMemo
                    index={index}
                    memo={item}
                    layout={layout}
                    onLayoutEvent={this.handleOnLayoutEvent}
                    handleNoteChanges={this.handleNoteChanges}
                />
            </TouchableOpacity>
        );
    };

    renderTileLayout = () => {
        const {
            container,
            rowContainer,
            listContainer,
            rowItemContainer,
            rowItemContainerLeft,
            rowItemContainerRight,
        } = styles;

        const { leftList, rightList } = this.state;
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={container}>
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
        const { container, listContainer } = styles;

        const { data } = this.state;
        return (
            <View style={container}>
                <FlatList
                    style={listContainer}
                    data={data}
                    renderItem={this.renderNoteItem}
                    keyExtractor={(item) => `${item.id}`}
                />
            </View>
        );
    };

    render() {
        const { footerText, mainContainer, footerContainer, footerItemContainer, footerTakeNoteContainer } = styles;

        const layout = this.props.navigation.getParam("noteLayout", "tile");

        return (
            <View style={mainContainer}>
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

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
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

const fakeData = [
    {
        id: 0,
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
        pinned: false,
    },
    {
        id: 1,
        title: "CHECKLIST",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "ASDF",
            },
            {
                checked: false,
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur ullamcorper quam id sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a elit in nulla elementum facilisis. Nunc semper tempus erat et imperdiet. Sed vitae mollis arcu. Cras scelerisque nec erat eget rhoncus. Aenean sit amet mollis nibh, a egestas risus.",
            },
            {
                checked: true,
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur ullamcorper quam id sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a elit in nulla elementum facilisis. Nunc semper tempus erat et imperdiet. Sed vitae mollis arcu. Cras scelerisque nec erat eget rhoncus. Aenean sit amet mollis nibh, a egestas risus.",
            },
            {
                checked: true,
                content: "A",
            },
            {
                checked: false,
                content: "B",
            },
            {
                checked: true,
                content: "C",
            },
            {
                checked: false,
                content: "D",
            },
            {
                checked: true,
                content: "E",
            },
            {
                checked: false,
                content: "F",
            },
        ],
        lastEditedAt: new Date(2018, 4, 10),
        pinned: true,
    },
    {
        id: 2,
        title: "Test for List",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "Hello world",
            },
            {
                checked: false,
                content: "Lorem ipsum",
            },
        ],
        lastEditedAt: new Date(2018, 2, 28),
        pinned: false,
    },
    {
        id: 3,
        title: "Hi hello",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "Woooo",
            },
            {
                checked: false,
                content: "Need to test longer message lorem ipsum",
            },
            {
                checked: true,
                content: "Woooo",
            },
            {
                checked: false,
                content: "Need to test long message",
            },
        ],
        lastEditedAt: new Date(2018, 11, 27),
        pinned: false,
    },
];
