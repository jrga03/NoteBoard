import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, FlatList, Dimensions } from "react-native";
import { SWATCH } from "../../constants";

const imageBorder = 3;
let photo_padding = 0;

export default class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            photoSize: null,
            orientation: null,
            selectedPhotos: [],
            selectedPhotosId: [],
        };

        this.unsubscribe = null;
    }

    componentDidMount() {
        let photoSize, orientation;
        const window = Dimensions.get("window");

        if (window.width > window.height) {
            orientation = "landscape";
            photoSize = window.width / 5 - imageBorder;
        } else {
            orientation = "portrait";
            photoSize = window.width / 3 - imageBorder;
        }

        this.setState({
            photos: this.props.navigation.getParam("photos", []),
            endCursor: this.props.navigation.getParam("endCursor", null),
            photoSize,
            orientation,
            windowWidth: window.width,
        });
        Dimensions.addEventListener("change", this.handleOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.handleOrientationChange);
        if (this.unsubscribe !== null) {
            this.unsubscribe();
        }
    }

    handleOrientationChange = ({ window }) => {
        let photoSize, orientation;
        if (window.width > window.height) {
            orientation = "landscape";
            photoSize = (window.width - imageBorder * 4) / 5;
        } else {
            orientation = "portrait";
            photoSize = (window.width - imageBorder * 2) / 3;
        }
        this.setState({ photoSize, orientation, windowWidth: window.width });
    };

    renderItem = ({ item }) => {
        let photos = Array.from(item.data);
        if (this.state.orientation === "portrait") {
            if (item.data.length % 3 === 2) {
                photos.push({ id: `photo_padding_${photo_padding}` });
                photo_padding++;
            }
        } else {
            if (item.data.length % 5 === 2 || item.data.length % 5 === 3 || item.data.length % 5 === 4) {
                for (let i = 0; i < 5 - (item.data.length % 5); i++) {
                    photos.push({ id: `photo_padding_${photo_padding}` });
                    photo_padding++;
                }
            }
        }
        return (
            <FlatList
                style={{ paddingBottom: 20 }}
                data={photos}
                renderItem={({ item }) => {
                    const selectionIndex = this.state.selectedPhotosId.findIndex((id) => id === item.id);

                    return (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (selectionIndex === -1) {
                                    this.setState({
                                        selectedPhotos: [...this.state.selectedPhotos, item],
                                        selectedPhotosId: [...this.state.selectedPhotosId, item.id],
                                    });
                                } else {
                                    const newSelectedPhotos = Array.from(this.state.selectedPhotos);
                                    const newSelectedPhotosId = Array.from(this.state.selectedPhotosId);

                                    newSelectedPhotos.splice(selectionIndex, 1);
                                    newSelectedPhotosId.splice(selectionIndex, 1);
                                    this.setState({
                                        selectedPhotos: newSelectedPhotos,
                                        selectedPhotosId: newSelectedPhotosId,
                                    });
                                }
                            }}>
                            <View
                                style={{
                                    height: this.state.photoSize,
                                    width: this.state.photoSize,
                                    marginBottom: imageBorder,
                                }}>
                                {item.uri ? (
                                    <View style={{ backgroundColor: SWATCH.MYSTIC }}>
                                        <Image
                                            style={[
                                                { height: this.state.photoSize, width: this.state.photoSize },
                                                selectionIndex === -1 ? null : { transform: [{ scale: 0.75 }] },
                                            ]}
                                            source={{ uri: item.uri }}
                                            resizeMode="cover"
                                        />
                                        <View
                                            style={[
                                                {
                                                    position: "absolute",
                                                    top: 7,
                                                    right: 7,
                                                    height: 18,
                                                    width: 18,
                                                    borderWidth: 2,
                                                    borderColor: SWATCH.WHITE,
                                                    borderRadius: 9,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                },
                                                selectionIndex === -1
                                                    ? null
                                                    : {
                                                          backgroundColor: SWATCH.RED_ORANGE,
                                                          borderColor: SWATCH.MYSTIC,
                                                          top: 4,
                                                          right: 4,
                                                          height: 24,
                                                          width: 24,
                                                          borderRadius: 12,
                                                      },
                                            ]}>
                                            <Text
                                                style={{
                                                    color: selectionIndex === -1 ? SWATCH.WHITE : SWATCH.MYSTIC,
                                                    fontSize: 10,
                                                    fontWeight: "bold",
                                                }}>
                                                {selectionIndex !== -1 && `${selectionIndex + 1}`}
                                            </Text>
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }}
                ListHeaderComponent={<Text style={{ padding: 15 }}>{item.title}</Text>}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={this.state.orientation === "portrait" ? 3 : 5}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />
        );
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: SWATCH.SOLITUDE }}>
                <FlatList
                    renderItem={this.renderItem}
                    data={this.state.photos}
                    extraData={this.state}
                    keyExtractor={(item, index) => `${this.state.orientation}_${index}`}
                />
            </View>
        );
    }
}
