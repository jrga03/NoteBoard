import React, { Component } from "react";
import {
    View,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
} from "react-native";
import ImageProgress from "react-native-image-progress";
import * as Progress from "react-native-progress";
import { FirebaseService } from "../../services/FirebaseService";

// let { width: windowWidth } = Dimensions.get("window");
const imageBorder = 4;

export default class ImageShelf extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imagesArray: [],
            windowWidth: Dimensions.get("window").width,
            imageChunksArray: [],
        };

        this.unsubscribe = null;
    }

    componentDidMount() {
        Dimensions.addEventListener("change", this.handleOrientationChange);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("this.state", this.state);
        // console.log("this.props", this.props);
        if (
            prevProps.tempImages.length !== this.props.tempImages.length ||
            prevProps.images.length !== this.props.images.length
        ) {
            this.mergePropsImageAndUpdate();
        }
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.handleOrientationChange);
        if (this.unsubscribe !== null) {
            this.unsubscribe();
        }
    }

    handleOrientationChange = ({ window }) => this.setState({ windowWidth: window.width });

    imageUpload = (imageData) => {
        const imagesArray = this.state.imagesArray;
        let imageIndex = imagesArray.findIndex((image) => image.id === imageData.id);
        imageIndex = imageIndex === -1 ? imagesArray.length : imageIndex;

        FirebaseService.uploadFileListener(
            imageData.uri,
            "note_image",
            { noteId: this.props.noteId },
            (snapshot) => {
                imagesArray.splice(imageIndex, 1, {
                    ...imageData,
                    progress: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) / 100,
                });

                this.setState({ imagesArray });
            },
            (error) => {
                if (this.unsubscribe !== null) {
                    console.log("error", error);
                    this.unsubscribe();
                }
            },
            (uploadedImage) => {
                if (this.props.saveUploadedImage) {
                    this.props.saveUploadedImage({ ...imageData, uri: uploadedImage.downloadURL });
                }

                if (this.unsubscribe !== null) {
                    this.unsubscribe();
                }
            }
        );
    };

    mergePropsImageAndUpdate = () => {
        const { images, tempImages } = this.props;
        if (tempImages.length > 0) {
            tempImages.map((tempImage) => this.imageUpload(tempImage));
        }

        const imagesArray = [...images.map((item) => ({ ...item, progress: 1 })), ...tempImages].sort((a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });

        const imagesFlatArray = [...imagesArray];
        const imageChunksArray = [];
        do {
            imageChunksArray.push(imagesFlatArray.splice(0, 3));
        } while (imagesFlatArray.length > 0);

        this.setState({ imagesArray, imageChunksArray });
    };

    renderImageRow = ({ item }) => {
        item.reverse();
        const { windowWidth } = this.state;

        if (item.length === 1) {
            const rowHeight = windowWidth / (item[0].width / item[0].height); // windowWidth / aspectRatio

            return (
                <View style={styles.imageRowContainer}>
                    {item[0].progress !== 1 ? (
                        <View>
                            <Image
                                source={{ uri: item[0].uri }}
                                style={{ height: rowHeight, width: windowWidth }}
                                resizeMode="cover"
                            />
                            <Progress.Circle
                                style={styles.progress}
                                progress={item[0].progress}
                                indeterminate={false}
                            />
                        </View>
                    ) : (
                        <ImageProgress
                            source={{ uri: item[0].uri }}
                            style={{ height: rowHeight, width: windowWidth }}
                            indicator={Progress.Circle}
                            resizeMode="cover"
                        />
                    )}
                </View>
            );
        } else {
            const smallestImageHeight = item.reduce(
                (min, image) => (min < image.height ? min : image.height, item[0].height)
            );
            const totalWidth = item.reduce((total, image) => total + image.width, 0);
            const rowHeight = windowWidth / (totalWidth / smallestImageHeight);
            const windowWidthWithBorder = windowWidth - (item.length - 1) * imageBorder;

            if (item.length === 2) {
                const itemWidth0 = Math.round((item[0].width / totalWidth) * 100) / 100;
                const itemWidth1 = parseFloat(parseFloat(1 - itemWidth0).toFixed(2));
                return (
                    <View style={styles.imageRowContainer}>
                        {item[0].progress !== 1 ? (
                            <View>
                                <Image
                                    source={{ uri: item[0].uri }}
                                    style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth0) }}
                                    resizeMode="cover"
                                />
                                <Progress.Circle
                                    style={styles.progress}
                                    progress={item[0].progress}
                                    indeterminate={false}
                                    size={30}
                                    thickness={2}
                                />
                            </View>
                        ) : (
                            <ImageProgress
                                source={{ uri: item[0].uri }}
                                style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth0) }}
                                indicator={Progress.Circle}
                                resizeMode="cover"
                            />
                        )}

                        {item[1].progress !== 1 ? (
                            <View>
                                <Image
                                    source={{ uri: item[1].uri }}
                                    style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth1) }}
                                    resizeMode="cover"
                                />
                                <Progress.Circle
                                    style={styles.progress}
                                    progress={item[1].progress}
                                    indeterminate={false}
                                    size={30}
                                    thickness={2}
                                />
                            </View>
                        ) : (
                            <ImageProgress
                                source={{ uri: item[1].uri }}
                                style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth1) }}
                                indicator={Progress.Circle}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                );
            } else {
                const itemWidth0 = Math.round((item[0].width / totalWidth) * 100) / 100;
                const itemWidth1 = Math.round((item[1].width / totalWidth) * 100) / 100;
                const itemWidth2 = parseFloat(parseFloat(1 - itemWidth0 - itemWidth1).toFixed(2));
                // console.log("widths", itemWidth0, itemWidth1, itemWidth2);
                return (
                    <View style={styles.imageRowContainer}>
                        {item[0].progress !== 1 ? (
                            <View>
                                <Image
                                    source={{ uri: item[0].uri }}
                                    style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth0) }}
                                    resizeMode="cover"
                                />
                                <Progress.Circle
                                    style={styles.progress}
                                    progress={item[0].progress}
                                    indeterminate={false}
                                    size={20}
                                    thickness={2}
                                />
                            </View>
                        ) : (
                            <ImageProgress
                                source={{ uri: item[0].uri }}
                                style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth0) }}
                                indicator={Progress.Circle}
                                resizeMode="cover"
                            />
                        )}
                        {item[1].progress !== 1 ? (
                            <View>
                                <Image
                                    source={{ uri: item[1].uri }}
                                    style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth1) }}
                                    resizeMode="cover"
                                />
                                <Progress.Circle
                                    style={styles.progress}
                                    progress={item[1].progress}
                                    indeterminate={false}
                                    size={20}
                                    thickness={2}
                                />
                            </View>
                        ) : (
                            <ImageProgress
                                source={{ uri: item[1].uri }}
                                style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth1) }}
                                indicator={Progress.Circle}
                                resizeMode="cover"
                            />
                        )}
                        {item[2].progress !== 1 ? (
                            <View>
                                <Image
                                    source={{ uri: item[2].uri }}
                                    style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth2) }}
                                    resizeMode="cover"
                                />
                                <Progress.Circle
                                    style={styles.progress}
                                    progress={item[2].progress}
                                    indeterminate={false}
                                    size={20}
                                    thickness={2}
                                />
                            </View>
                        ) : (
                            <ImageProgress
                                source={{ uri: item[2].uri }}
                                style={{ height: rowHeight, width: Math.round(windowWidthWithBorder * itemWidth2) }}
                                indicator={Progress.Circle}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                );
            }
        }
    };

    render() {
        return (
            <FlatList
                inverted={true}
                data={this.state.imageChunksArray}
                extraData={this.state}
                renderItem={this.renderImageRow}
                keyExtractor={(item, i) => `Row_${i}`}
            />
        );
    }
}

const styles = StyleSheet.create({
    imageRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: imageBorder,
    },
    progress: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
});
