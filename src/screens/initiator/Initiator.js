import React, { Component } from "react";
import {
    View,
    // StatusBar,
    StyleSheet,
    // AsyncStorage,
    ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
// import firebase from "react-native-firebase";
// import { FirebaseService } from "../../services";
import { loginFlowStart } from "../../actions";

// import { GoogleService } from "../../services";

class Initiator extends Component {
    componentDidMount() {
        // console.log("Initiator props", this.props);
        setTimeout(() => this.props.startLoginFlow(), 50);
        // FirebaseService.isUserLoggedIn((user) => {
        //     console.log("INITIATOR USER", user);
        //     // this.props.navigation.navigate(user ? "Home" : "SignIn");
        // });
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        startLoginFlow: () => dispatch(loginFlowStart()),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Initiator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
