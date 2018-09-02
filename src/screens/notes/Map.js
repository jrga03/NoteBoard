import React, { Component } from "react";
import { View, Text, Alert, Dimensions, StyleSheet, TouchableOpacity, ToastAndroid, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RNGooglePlaces from "react-native-google-places";
import { Icon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import { SWATCH, LAYOUT_MARGIN } from "../../constants";

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 14.756578;
const LONGITUDE = 121.044975;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let markerCount = 0;

export default class NoteMap extends Component {
    static navigationOptions = ({ navigation }) => {
        return !!navigation.getParam("selectedMarker", "")
            ? {
                  title: navigation.getParam("selectedMarker", ""),
                  headerLeft: (
                      <TouchableOpacity onPress={() => navigation.state.params.deselectMarker()}>
                          <Icon type="material-icons" name="clear" color={SWATCH.BLACK} size={27} />
                      </TouchableOpacity>
                  ),
                  headerStyle: {
                      backgroundColor: SWATCH.GRAY,
                      height: 50,
                      paddingHorizontal: 10,
                  },
                  headerTitleStyle: {
                      color: SWATCH.BLACK,
                      fontSize: 18,
                      textAlign: "left",
                      width: "100%",
                  },
              }
            : {
                  title: navigation.getParam("selectedMarker", ""),
                  headerStyle: {
                      backgroundColor: SWATCH.GRAY,
                      height: 50,
                      paddingHorizontal: 10,
                  },
                  headerTintColor: SWATCH.BLACK,
              };
    };

    constructor(props) {
        super(props);

        this.state = {
            // region: new AnimatedRegion({
            //     latitude: LATITUDE,
            //     longitude: LONGITUDE,
            //     latitudeDelta: LATITUDE_DELTA,
            //     longitudeDelta: LONGITUDE_DELTA,
            // }),
            markers: [],
            markerIDs: [],
            selectedMarker: null,
        };

        this.saveTimer = null;
    }

    componentDidMount() {
        // this.loadMarkers();
        const markers = this.props.navigation.getParam("markers", []);
        let markerIDs = [];
        if (!!markers) {
            markerIDs = markers.map((marker) => marker.id);
            markerCount = markers.length;
        }
        
        this.props.navigation.setParams({
            deselectMarker: this.deselectMarker.bind(this),
            saveTaggedLocations: this.saveTaggedLocations.bind(this),
        });

        this.setState(
            {
                markers,
                markerIDs,
            },
            () => {
                if (this.state.markers.length > 0) setTimeout(this.focusAllMarkers, 50);
            }
        );

        // navigator.geolocation.getCurrentPosition(
        //     ({ coords: { latitude, longitude } }) =>
        //         this.setState(
        //             {
        //                 initialRegion: {
        //                     latitude,
        //                     longitude,
        //                     latitudeDelta: LATITUDE_DELTA,
        //                     longitudeDelta: LONGITUDE_DELTA,
        //                 },
        //                 markers,
        //                 markerIDs,
        //             },
        //             () => {
        //                 if (this.state.markers.length > 0) setTimeout(this.focusAllMarkers, 1000);
        //             }
        //         ),
        //     (error) => console.log("error getting current location", error),
        //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        // );
    }

    componentDidUpdate() {
        // console.log("map update", this.state);
    }

    componentWillUnmount() {
        if (this.saveTimer !== null) {
            clearTimeout(this.saveTimer);
        }
    }

    loadMarkers = () => {
        const markers = this.props.navigation.getParam("markers", []);
        let markerIDs = [];
        if (!!markers) {
            markerIDs = markers.map((marker) => marker.id);
        }

        this.setState({
            markers,
            markerIDs,
        });
    };

    deselectMarker = () =>
        this.setState({ selectedMarker: null }, () => {
            this.state.markerIDs.forEach((marker) => this[marker].hideCallout());
            this.props.navigation.setParams({ selectedMarker: "" });
        });

    saveTaggedLocations = () => {
        let message = "";

        if (this.state.markers.length > 0) {
            this.focusAllMarkers();
            message = "Saving";

            // this.toast.show(message, DURATION.LENGTH_SHORT);
            Platform.OS === "ios"
                ? this.toast.show(message, DURATION.LENGTH_SHORT)
                : ToastAndroid.show(message, ToastAndroid.SHORT);

            this.saveTimer = setTimeout(() => {
                const snapshot = this.map.takeSnapshot({
                    // width: 300, // optional, when omitted the view-width is used
                    height: 100, // optional, when omitted the view-height is used
                    format: "png", // image formats: 'png', 'jpg' (default: 'png')
                    quality: 0.5, // image quality: 0..1 (only relevant for jpg, default: 1)
                    result: "file", // result types: 'file', 'base64' (default: 'file')
                });
                snapshot.then((uri) => {
                    const saveLocation = this.props.navigation.getParam("saveLocationDetails", null);
                    if (saveLocation) {
                        this.props.navigation.state.params.saveLocationDetails(this.state.markers, uri);
                        this.saveTimer = null;
                        this.props.navigation.goBack();
                    }
                });
            }, 1000);
        } else {
            const saveLocation = this.props.navigation.getParam("saveLocationDetails", null);
            if (saveLocation) {
                this.props.navigation.state.params.saveLocationDetails(this.state.markers);
                this.props.navigation.goBack();
            }
        }
    };

    removeMarker = () => {
        Alert.alert("", "Remove location?", [
            { text: "Cancel", onPress: () => {} },
            {
                text: "Yes",
                onPress: () => {
                    const { selectedMarker } = this.state;
                    this.deselectMarker();

                    const markerIDs = this.state.markerIDs.filter((id) => id !== selectedMarker);
                    const markers = this.state.markers.filter((marker) => marker.id !== selectedMarker);

                    this.setState({ markers, markerIDs });
                },
            },
        ]);
    };

    openSearchModal = () => {
        this.state.markerIDs.forEach((marker) => this[marker].hideCallout());

        RNGooglePlaces.openPlacePickerModal({})
            .then(({ latitude, longitude, address }) => {
                let noSamePlace = true;

                this.state.markers.forEach((marker) => {
                    if (marker.latlng.latitude === latitude && marker.latlng.longitude === longitude) {
                        noSamePlace = false;
                    }
                });

                if (noSamePlace) {
                    this.setState(
                        {
                            markers: [
                                ...this.state.markers,
                                {
                                    latlng: {
                                        latitude,
                                        longitude,
                                    },
                                    description: address,
                                    id: `Marker_${markerCount}`,
                                },
                            ],
                            markerIDs: [...this.state.markerIDs, `Marker_${markerCount}`],
                        },
                        () => {
                            markerCount++;
                            this.map.animateToRegion(
                                {
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01 * ASPECT_RATIO,
                                },
                                500
                            );
                        }
                    );
                } else {
                }
            })
            .catch((error) => console.log(error));
    };

    focusAllMarkers = () => {
        this.state.markerIDs.forEach((marker) => this[marker].hideCallout());

        if (this.state.markers.length == 1) {
            this.map.animateToRegion(
                {
                    ...this.state.markers[0].latlng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01 * ASPECT_RATIO,
                },
                500
            );
        } else {
            this.map.fitToSuppliedMarkers(this.state.markerIDs, true);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref={(ref) => (this.map = ref)}
                    style={styles.map}
                    // initialRegion={this.state.initialRegion}
                    provider={PROVIDER_GOOGLE}
                    showsTraffic={false}
                    // showsUserLocation={true}
                    // followsUserLocation={true}
                    // toolbarEnabled={true}
                    // onRegionChangeComplete={this.onRegionChangeComplete}
                    onPress={this.deselectMarker}>
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            key={marker.id}
                            ref={(ref) => (this[marker.id] = ref)}
                            identifier={marker.id}
                            coordinate={marker.latlng}
                            title={`Location ${index + 1}`}
                            description={!!marker.description ? marker.description : undefined}
                            onPress={() =>
                                this.setState({ selectedMarker: marker.id }, () => {
                                    this.props.navigation.setParams({ selectedMarker: `Location ${index + 1}` });
                                    this.map.animateToRegion(
                                        {
                                            ...marker.latlng,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01 * ASPECT_RATIO,
                                        },
                                        500
                                    );
                                })
                            }
                            stopPropagation={true}
                        />
                    ))}
                </MapView>
                <View style={styles.overlayContainer}>
                    {!this.state.selectedMarker ? (
                        <View>
                            <TouchableOpacity style={styles.overlayButton} onPress={this.openSearchModal}>
                                <Text style={styles.overlayText}>
                                    {this.state.markers.length > 0 ? "Add another location" : "Search for a place"}
                                </Text>
                            </TouchableOpacity>

                            {this.state.markers.length > 0 ? (
                                <TouchableOpacity style={styles.overlayButton} onPress={this.focusAllMarkers}>
                                    <Text style={styles.overlayText}>
                                        {this.state.markers.length == 1
                                            ? "Show tagged location"
                                            : "Show all tagged locations"}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.overlayButton} onPress={this.removeMarker}>
                            <Text style={styles.overlayText}>Remove location</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Toast
                    ref={(ref) => (this.toast = ref)}
                    // style={styles.toastContainer}
                    // opacity={0.8}
                    // textStyle={styles.toastText}
                />
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
        // height: "15%",
        paddingVertical: 25,
    },
    overlayButton: {
        opacity: 0.7,
        backgroundColor: SWATCH.WHITE,
        height: 40,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    overlayCloseButton: {
        position: "absolute",
        top: LAYOUT_MARGIN,
        left: LAYOUT_MARGIN,
        backgroundColor: "red",
    },
    overlayText: {
        color: SWATCH.BLACK,
    },
    toastContainer: {
        backgroundColor: SWATCH.BLACK,
    },
    toastText: {
        color: SWATCH.WHITE,
    },
});
