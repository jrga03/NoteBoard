import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { SWATCH } from "../../constants";

export default class NoteMemo extends Component {
    renderItem = ({ item }) => {
        const { checklistItemContainer, checkboxIconContainer } = styles;
        const { type } = this.props.memo;

        if (type === "checklist") {
            return (
                <View style={checklistItemContainer}>
                    <View style={checkboxIconContainer}>
                        <Icon
                            type="material-icons"
                            name={
                                item.checked
                                    ? "check-box"
                                    : "check-box-outline-blank"
                            }
                            color={SWATCH.BLACK}
                            size={16}
                        />
                    </View>
                    <Text>{item.content}</Text>
                </View>
            );
        } else {
            return <Text>{item.content}</Text>;
        }
    };

    render() {
        const { container, titleText } = styles;
        const { memo } = this.props;
        const { title, contents, lastEditedAt } = memo;

        // console.log(memo);

        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={container}>
                    <Text style={titleText}>{title}</Text>
                    <FlatList
                        data={contents}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item + index}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        backgroundColor: SWATCH.WHITE,
        width: "100%",
        padding: 5,
    },
    titleText: {
        fontWeight: "bold",
    },
    checklistItemContainer: {
        flexDirection: "row",
    },
    checkboxIconContainer: {
        paddingRight: 10,
    },
});
