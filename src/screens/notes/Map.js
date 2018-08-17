import React, { Component } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from "react-native-maps";

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
            prevPos: null,
            curPos: { latitude: LATITUDE, longitude: LONGITUDE },
            curAng: 45,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
    }

    componentDidUpdate() {
        // console.log(this.state);
    }

    changePosition = (latOffset, lonOffset) => {
        const latitude = this.state.curPos.latitude + latOffset;
        const longitude = this.state.curPos.longitude + lonOffset;
        this.setState({ prevPos: this.state.curPos, curPos: { latitude, longitude } });
        this.updateMap();
    };

    getRotation = (prevPos, curPos) => {
        if (!prevPos) return 0;
        const xDiff = curPos.latitude - prevPos.latitude;
        const yDiff = curPos.longitude - prevPos.longitude;
        return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
    };

    updateMap = () => {
        const { curPos, prevPos, curAng } = this.state;
        const curRot = this.getRotation(prevPos, curPos);
        console.log(this.map);
        // this.map.animateToNavigation(curPos, curRot, curAng);
    };

    onRegionChange = (region) => {
        this.setState({ region });
        this.changePosition(
            region.latitude - this.state.curPos.latitude,
            region.longitude - this.state.curPos.longitude
        );
    };

    onRegionChangeComplete = (region) => {
        this.setState({ region });
        this.changePosition(
            region.latitude - this.state.curPos.latitude,
            region.longitude - this.state.curPos.longitude
        );
    };

    render() {
        return (
            <MapView.Animated
                ref={(ref) => (this.map = ref)}
                style={styles.container}
                initialRegion={{
                    ...this.state.curPos,
                    latitudeDelta: this.state.latitudeDelta,
                    longitudeDelta: this.state.longitudeDelta,
                }}
                provider={PROVIDER_GOOGLE}
                showsTraffic={false}
                showsUserLocation={true}
                followsUserLocation={true}
                // toolbarEnabled={true}
                onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.onRegionChangeComplete}>
                <Marker coordinate={this.state.curPos} anchor={{ x: 0.5, y: 0.5 }} />
            </MapView.Animated>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
});
