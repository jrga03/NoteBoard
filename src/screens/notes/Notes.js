import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SWATCH } from "../../constants";

import NoteItem from './NoteItem';

export default class Notes extends Component {
    
    renderNoteItem = ({}) => {
        <NoteItem />
    }

    render() {
        const { container } = styles;
        return (
            <View style={container}>
                {/* <FlatList 
                    data={}
                    renderItem={this.renderNoteItem}
                    
                     /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: SWATCH.WHITE,
    },
});
