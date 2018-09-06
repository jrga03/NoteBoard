import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";
import { Icon, Avatar } from "react-native-elements";
import ImageProgress from "react-native-image-progress";
import * as Progress from "react-native-progress";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";
import { FirebaseService } from "../../services";

const imageBorder = 4;

export default class NoteMemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collaborators: [],
        };
    }

    componentDidMount() {
        if (this.props.memo.collaborators) {
            this.fetchCollaboratorPhotos(this.props.memo.collaborators);
        }
    }

    fetchCollaboratorPhotos = async (collabArray) => {
        const photosArr = await FirebaseService.fetchCollaboratorPhotos(collabArray);
        this.setState({ collaborators: photosArr });
    };

    trimImageArray = (arr) => {
        const imagesArray = Array.from(arr);

        const imageChunksArray = [];
        do {
            imageChunksArray.push(imagesArray.splice(0, 3));
        } while (imagesArray.length > 0);

        let imagesToRender = [];
        if (imageChunksArray.length > 2) {
            imagesToRender = imageChunksArray.slice(-2);
        } else {
            imagesToRender = [...imageChunksArray];
        }

        return imagesToRender;
    };

    renderImageRow = ({ item }) => {
        // console.log("renderImageRow item", item);
        const { imageRowContainer } = styles;

        item.reverse();
        const memoWidth = this.props.windowWidth - LAYOUT_MARGIN * 2;

        if (item.length === 1) {
            const rowHeight = memoWidth / (item[0].width / item[0].height); // memoWidth / aspectRatio

            return (
                <View style={imageRowContainer}>
                    <ImageProgress
                        source={{ uri: item[0].uri }}
                        style={{ height: rowHeight, width: memoWidth }}
                        indicator={Progress.Circle}
                        resizeMode="cover"
                    />
                </View>
            );
        } else {
            const smallestImageHeight = item.reduce(
                (min, image) => (min < image.height ? min : image.height, item[0].height)
            );
            const totalWidth = item.reduce((total, image) => total + image.width, 0);
            const rowHeight = memoWidth / (totalWidth / smallestImageHeight);
            const memoWidthWithBorder = memoWidth - (item.length - 1) * imageBorder;

            if (item.length === 2) {
                const itemWidth0 = Math.round((item[0].width / totalWidth) * 100) / 100;
                const itemWidth1 = parseFloat(parseFloat(1 - itemWidth0).toFixed(2));
                return (
                    <View style={imageRowContainer}>
                        <ImageProgress
                            source={{ uri: item[0].uri }}
                            style={{ height: rowHeight, width: Math.round(memoWidthWithBorder * itemWidth0) }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                        <ImageProgress
                            source={{ uri: item[1].uri }}
                            style={{ height: rowHeight, width: Math.round(memoWidthWithBorder * itemWidth1) }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                    </View>
                );
            } else {
                const itemWidth0 = Math.round((item[0].width / totalWidth) * 100) / 100;
                const itemWidth1 = Math.round((item[1].width / totalWidth) * 100) / 100;
                const itemWidth2 = parseFloat(parseFloat(1 - itemWidth0 - itemWidth1).toFixed(2));
                // console.log("widths", itemWidth0, itemWidth1, itemWidth2);
                return (
                    <View style={imageRowContainer}>
                        <ImageProgress
                            source={{ uri: item[0].uri }}
                            style={{ height: rowHeight, width: Math.round(memoWidthWithBorder * itemWidth0) }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                        <ImageProgress
                            source={{ uri: item[1].uri }}
                            style={{ height: rowHeight, width: Math.round(memoWidthWithBorder * itemWidth1) }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                        <ImageProgress
                            source={{ uri: item[2].uri }}
                            style={{ height: rowHeight, width: Math.round(memoWidthWithBorder * itemWidth2) }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                    </View>
                );
            }
        }
    };

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
            return (
                <Text style={noteContentText} numberOfLines={7} ellipsizeMode="tail">
                    {item.content}
                </Text>
            );
        }
    };

    render() {
        const {
            titleText,
            container,
            pinContainer,
            noteContentText,
            checkedItemText,
            contentContainer,
            collaboratorAvatar,
            checkboxIconContainer,
            collaboratorContainer,
            checklistItemContainer,
            noteContentTextTileStyle,
            noteContentTextListStyle,
            collaboratorAvatarContainer,
            checkboxIconContainerTileStyle,
            checkboxIconContainerListStyle,
        } = styles;
        const { memo, index, onLayoutEvent, layout } = this.props;
        const { title, contents, type, pinned, images } = memo;

        const checkedItemsCount = contents.reduce((acc, item) => (item.checked ? acc + 1 : acc), 0);

        let contentToRender = [];
        if (type === "checklist" && contents.length - checkedItemsCount > 7) {
            const uncheckedContentArray = contents.filter((content) => !content.checked);
            contentToRender = uncheckedContentArray.slice(0, 6);
        } else if (type === "memo" && contents.length === 1 && contents[0].content === "") {
            contentToRender = [];
        } else {
            contentToRender = [...contents];
        }

        const imagesToRender = images && this.trimImageArray(images);

        return (
            <View
                style={container}
                // onLayout={layout === "tile" ? (e) => onLayoutEvent(e.nativeEvent.layout, index) : null}
            >
                {!!imagesToRender && (
                    <FlatList
                        inverted={true}
                        data={imagesToRender}
                        renderItem={this.renderImageRow}
                        listKey={(item, i) => `Row_${i}`}
                        keyExtractor={(item, i) => `Row_${i}`}
                    />
                )}
                {pinned && (
                    <View style={pinContainer}>
                        <Icon type="material-community" name="pin" size={16} color={SWATCH.RED_ORANGE} />
                    </View>
                )}
                {!!title && <Text style={titleText}>{title}</Text>}
                {contentToRender.length > 0 && (
                    <FlatList
                        style={contentContainer}
                        data={contentToRender}
                        renderItem={this.renderNoteContent}
                        keyExtractor={(item, index) => item + index}
                        ListFooterComponent={() =>
                            type === "checklist" && contents.length > 7 ? (
                                <View style={checklistItemContainer}>
                                    <View
                                        style={[
                                            checkboxIconContainer,
                                            layout === "tile"
                                                ? checkboxIconContainerTileStyle
                                                : checkboxIconContainerListStyle,
                                        ]}>
                                        {/* style={[checkboxIconContainer, checkboxIconContainerTileStyle]}> */}
                                        {/* <Icon
                                        type="material-icons"
                                        name={"check-box-outline-blank"}
                                        color={SWATCH.BLACK}
                                        size={16}
                                    /> */}
                                    </View>
                                    <Text
                                        style={[
                                            noteContentText,
                                            layout === "tile" ? noteContentTextTileStyle : noteContentTextListStyle,
                                        ]}>
                                        ...
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
                )}
                {type === "checklist" &&
                    checkedItemsCount > 0 && (
                        <Text style={checkedItemText}>
                            {`+${checkedItemsCount} checked ${checkedItemsCount > 1 ? "items" : "item"}`}
                        </Text>
                    )}
                {this.state.collaborators.length > 0 && (
                    <View style={collaboratorContainer}>
                        {this.state.collaborators.map(
                            (collaborator, i) =>
                                collaborator ? (
                                    <Avatar
                                        key={`${i}`}
                                        // small
                                        rounded
                                        avatarStyle={collaboratorAvatar}
                                        containerStyle={[collaboratorAvatar, collaboratorAvatarContainer]}
                                        source={{ uri: collaborator }}
                                    />
                                ) : (
                                    <Avatar
                                        key={`${i}`}
                                        // small
                                        rounded
                                        avatarStyle={collaboratorAvatar}
                                        containerStyle={[collaboratorAvatar, collaboratorAvatarContainer]}
                                        icon={{ name: "person" }}
                                    />
                                )
                        )}
                    </View>
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
        // padding: 7,
        elevation: 2,
        shadowRadius: 3,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        justifyContent: "center",
    },
    contentContainer: {
        paddingVertical: 7,
        paddingHorizontal: 7,
    },
    titleText: {
        fontWeight: "bold",
        fontFamily: Platform.OS === "ios" ? "HelveticaNeue-Bold" : "Roboto",
        color: SWATCH.BLACK,
        paddingTop: Platform.OS === "ios" ? 11 : 9,
        paddingBottom: Platform.OS === "ios" ? 7 : 5,
        paddingHorizontal: 7,
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
        paddingLeft: 12,
        paddingRight: 7,
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
    pinContainer: {
        position: "absolute",
        top: 8,
        right: 5,
    },
    imageRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: imageBorder,
    },
    collaboratorContainer: {
        flexDirection: "row",
        // marginTop: 7,
        padding: 7,
    },
    collaboratorAvatar: {
        width: 20,
        height: 20,
        // borderRadius: 10,
    },
    collaboratorAvatarContainer: {
        marginRight: 10,
    },
});
