import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { connect } from "react-redux";

class ContactProfile extends Component {
    componentDidMount() {
        // console.log(this.props);
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                    }}
                    source={{ uri: this.props.selectedContact.photoURL }}
                />
                <Text>{this.props.selectedContact.displayName}</Text>
                <Text>{this.props.selectedContact.email}</Text>
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedContact: state.selectedContact,
});

export default connect(
    mapStateToProps,
    null
)(ContactProfile);
