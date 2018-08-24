import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 0.5 };
            const data = await this.camera.takePictureAsync(options);
            console.log(data.uri);
        }
    };

    render() {
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
                <TouchableOpacity
                    style={{ backgroundColor: SWATCH.WHITE, position: "absolute", top: 10, left: 10 }}
                    onPress={() => this.props.navigation.goBack()}>
                    {/* <Icon /> */}
                    <Text>BACK</Text>
                </TouchableOpacity>
                <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
                    <TouchableOpacity onPress={this.toggleCameraType} style={styles.captureButton}>
                        <Text style={{ fontSize: 14 }}> ROTATE </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.captureButton}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.toggleCameraFlash} style={styles.captureButton}>
                        <Text style={{ fontSize: 14 }}> FLASH </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
    captureButton: {
        flex: 0,
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: "center",
        margin: 20,
    },
});
