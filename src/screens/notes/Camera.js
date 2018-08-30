import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from "react-native";
import { RNCamera } from "react-native-camera";

import { SWATCH } from "../../constants";
import { Icon } from "react-native-elements";

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: "lightgreen",
            justifyContent: "center",
            alignItems: "center",
        }}>
        <Text>Waiting</Text>
    </View>
);

export default class Camera extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cameraType: RNCamera.Constants.Type.back,
            flashMode: RNCamera.Constants.FlashMode.off,
            capturedPhoto: null,
        };
    }

    toggleCameraType = () =>
        this.setState({
            cameraType:
                this.state.cameraType === RNCamera.Constants.Type.back
                    ? RNCamera.Constants.Type.front
                    : RNCamera.Constants.Type.back,
        });

    toggleCameraFlash = () =>
        this.setState({
            flashMode:
                this.state.flashMode === RNCamera.Constants.FlashMode.on
                    ? RNCamera.Constants.FlashMode.off
                    : RNCamera.Constants.FlashMode.on,
        });

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, fixOrientation: true, forceUpOrientation: true };
            const data = await this.camera.takePictureAsync(options);
            this.setState({ capturedPhoto: data });
        }
    };

    deletePicture = () => this.setState({ capturedPhoto: null });

    savePicture = () => {
        const savePicture = this.props.navigation.getParam("saveImage", null);
        if (savePicture !== null) {
            savePicture(this.state.capturedPhoto);
            this.props.navigation.goBack();
        }
    };

    render() {
        if (this.state.capturedPhoto !== null) {
            return (
                <View style={styles.container}>
                    <Image
                        source={{ uri: this.state.capturedPhoto.uri }}
                        style={styles.photoPreview}
                        resizeMode="cover"
                    />
                    <View style={styles.controlContainer}>
                        <TouchableOpacity onPress={this.deletePicture}>
                            <Icon type="material-icon" name="clear" color={SWATCH.WHITE} size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.savePicture}>
                            <Icon type="material-icon" name="check" color={SWATCH.WHITE} size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <RNCamera
                        ref={(ref) => (this.camera = ref)}
                        type={this.state.cameraType}
                        style={styles.cameraPreview}
                        mirrorImage={this.state.cameraType === RNCamera.Constants.Type.front}
                        permissionDialogTitle={"Permission to use camera"}
                        permissionDialogMessage={"We need your permission to use your phone camera"}>
                        {/* {({ camera, status }) => {
                            console.log("camera", camera, "status", status);
                            if (status !== "READY") return <PendingView />;
                            return (
                                <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
                                    <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.captureButton}>
                                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }} */}
                    </RNCamera>
                    {Platform.OS === "ios" ? (
                        <TouchableOpacity
                            style={styles.backButtonContainer}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.backButtonText}>BACK</Text>
                        </TouchableOpacity>
                    ) : null}
                    <View style={styles.controlContainer}>
                        <TouchableOpacity onPress={this.toggleCameraFlash} style={styles.buttonStyle}>
                            <Icon
                                type="material-icons"
                                name={
                                    this.state.flashMode === RNCamera.Constants.FlashMode.on ? "flash-on" : "flash-off"
                                }
                                color={SWATCH.WHITE}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.takePicture.bind(this)}
                            style={[styles.buttonStyle, styles.captureButtonContainer]}>
                            <View style={styles.captureButton} />
                            {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleCameraType} style={styles.buttonStyle}>
                            <Icon type="material-icons" name="switch-camera" color={SWATCH.WHITE} size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SWATCH.BLACK,
    },
    cameraPreview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    photoPreview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    controlContainer: {
        flex: 0,
        flexBasis: 134,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    buttonStyle: {
        flex: 0,
        padding: 7,
        alignSelf: "center",
    },
    captureButtonContainer: {
        backgroundColor: "#fff",
        borderRadius: 37,
    },
    captureButton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
    backButtonContainer: {
        backgroundColor: SWATCH.WHITE,
        position: "absolute",
        top: 10,
        left: 10,
        opacity: 0.7,
        borderRadius: 10,
    },
    backButtonText: {
        marginVertical: 10,
        marginHorizontal: 15,
    },
});
