import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import ContactItem from "./ContactItem";
import { SWATCH } from "../../constants";
import { searchContact } from "../../actions";

class AddContact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: "",
            // isLoading: this.props.loading,
        };
    }

    componentDidUpdate() {
        // console.log(this.props);
    }

    handleSearchTextChange = (searchString) => {
        this.setState({ searchString }, () => {
            this.props.searchContact(this.state.searchString);
        });
    };

    handleRefresh = () => this.props.searchContact(this.state.searchString);

    render() {
        const { container, searchContainer, searchField, iconContainer } = styles;
        return (
            <View style={container}>
                <View style={searchContainer}>
                    <TextInput
                        placeholder="Search..."
                        value={this.state.searchString}
                        onChangeText={this.handleSearchTextChange}
                        style={searchField}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        numberOfLines={1}
                        autoCapitalize="words"
                        autoFocus={false}
                        returnKeyType="search"
                    />
                    {this.state.searchString !== "" && (
                        <Icon
                            type="material-icons"
                            name="clear"
                            color={SWATCH.GRAY}
                            containerStyle={iconContainer}
                            onPress={() => this.setState({ searchString: "" })}
                        />
                    )}
                </View>
                <FlatList
                    // style={{backgroundColor:"red"}}
                    renderItem={({ item }) => <ContactItem item={item} type={item.requested ? "Remove" : "Add"} />}
                    data={this.props.searchResult}
                    keyExtractor={(item) => `${item.id}`}
                    refreshing={this.props.loading}
                    onRefresh={this.handleRefresh}
                    ItemSeparatorComponent={({ leadingItem }) =>
                        leadingItem ? <View backgroundColor={SWATCH.LIGHT_GRAY} height={0.5} /> : null
                    }
                />
                {/* <ContactItem /> */}
                {/* <Text>{this.props.navigation.state.routeName} Screen</Text> */}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading,
    searchResult: state.searchContactList,
});

const mapDispatchToProps = (dispatch) => ({
    searchContact: (searchString) => dispatch(searchContact(searchString)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddContact);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: SWATCH.WHITE,
    },
    searchField: {
        flex: 1,
        alignSelf: "stretch",
        // backgroundColor: "red",
        height: 50,
        paddingHorizontal: 10,
    },
    iconContainer: {
        paddingHorizontal: 10,
    },
});
