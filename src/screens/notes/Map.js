import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout, AnimatedRegion, PROVIDER_GOOGLE } from "react-native-maps";
import RNGooglePlaces from "react-native-google-places";
import { SWATCH } from "../../constants";

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 14.756578;
const LONGITUDE = 121.044975;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class NoteMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }),
            // prevPos: null,
            // curPos: { latitude: LATITUDE, longitude: LONGITUDE },
            // curAng: 45,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA,
            markers: [
                // {
                //     latlng: { latitude: LATITUDE, longitude: LONGITUDE },
                //     // title: "initial title",
                //     description: "initial description",
                // },
            ],
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) =>
                this.setState({
                    initialRegion: {
                        latitude,
                        longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                }),
            (error) => console.log("error getting current location", error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    componentDidUpdate() {
        // console.log(this.state);
    }

    // changePosition = (latOffset, lonOffset) => {
    //     const latitude = this.state.curPos.latitude + latOffset;
    //     const longitude = this.state.curPos.longitude + lonOffset;
    //     this.setState({ prevPos: this.state.curPos, curPos: { latitude, longitude } });
    //     this.updateMap();
    // };

    // getRotation = (prevPos, curPos) => {
    //     if (!prevPos) return 0;
    //     const xDiff = curPos.latitude - prevPos.latitude;
    //     const yDiff = curPos.longitude - prevPos.longitude;
    //     return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
    // };

    // updateMap = () => {
    //     const { curPos, prevPos, curAng } = this.state;
    //     const curRot = this.getRotation(prevPos, curPos);
    //     console.log(this.map);
    //     // this.map.animateToNavigation(curPos, curRot, curAng);
    // };

    onRegionChange = (region) => {
        this.setState({ region });
        // console.log(this.map);
        // this.changePosition(
        //     region.latitude - this.state.curPos.latitude,
        //     region.longitude - this.state.curPos.longitude
        // );
    };

    onRegionChangeComplete = (region) => {
        this.setState({ region });
        // this.changePosition(
        //     region.latitude - this.state.curPos.latitude,
        //     region.longitude - this.state.curPos.longitude
        // );
    };

    openSearchModal = () => {
        RNGooglePlaces.openPlacePickerModal({
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            radius: 1,
        })
            .then(({ latitude, longitude, address }) =>
                this.setState({
                    markers: [
                        ...this.state.markers,
                        {
                            latlng: {
                                latitude,
                                longitude,
                            },
                            description: address,
                        },
                    ],
                })
            )
            .catch((error) => console.log(error));
    };

    render() {
        return (
            <View style={styles.container}>
                <MapView.Animated
                    ref={(ref) => (this.map = ref)}
                    style={styles.map}
                    initialRegion={this.state.initialRegion}
                    provider={PROVIDER_GOOGLE}
                    showsTraffic={false}
                    // showsUserLocation={true}
                    // followsUserLocation={true}
                    // toolbarEnabled={true}
                    onRegionChange={this.onRegionChange}
                    // onRegionChangeComplete={this.onRegionChangeComplete}
                >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            key={`marker_${index}`}
                            coordinate={marker.latlng}
                            title={`Location ${index + 1}`}
                            description={!!marker.description ? marker.description : undefined}
                        />
                    ))}
                    {/* <Marker
                        ref={(ref) => (this.marker = ref)}
                        onPress={() => this.marker.showCallout()}
                        coordinate={this.state.curPos}
                        anchor={{ x: 0.5, y: 0.5 }}>
                        <Callout onPress={() => this.marker.hideCallout()}>
                            <Text>HELLO</Text>
                        </Callout>
                    </Marker> */}
                </MapView.Animated>
                <View style={styles.overlayContainer}>
                    <TouchableOpacity style={styles.overlayButton} onPress={this.openSearchModal}>
                        <Text style={styles.overlayText}>Search for a place</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayContainer: {
        backgroundColor: "transparent",
        // flex: 1,
        height: "15%",
    },
    overlayButton: {
        opacity: 0.7,
        backgroundColor: SWATCH.WHITE,
        height: 40,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    overlayText: {
        color: SWATCH.BLACK,
    },
});
