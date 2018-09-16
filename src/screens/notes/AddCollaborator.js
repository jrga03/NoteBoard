import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import ContactItem from "../contacts/ContactItem";
import { SWATCH } from "../../constants";
import { searchContact, selectContact } from "../../actions";
// import { FirebaseService } from "../../services";

class AddCollaborator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: "",
            // isLoading: this.props.loading,
        };
    }

    componentDidMount() {
        // FirebaseService.addContactsListener(this.handleRefresh);
        // FirebaseService.addPendingContactListener(this.handleRefresh);
    }

    componentWillUnmount() {
        // FirebaseService.removeContactsListener(this.handleRefresh);
        // FirebaseService.removePendingContactListener(this.handleRefresh);
    }

    componentDidUpdate() {
        // console.log(this.props);
    }

    handleSearchTextChange = (searchString) => {
        this.setState({ searchString }, () => {
            this.props.searchContact(this.state.searchString);
        });
    };

    handleSelectContact = (contact, type) => {
        // console.log(contact, type);
        // this.props.selectContact(contact, type);
        // this.props.navigation.navigate("ContactProfile", { onAddOrCancelPress: this.handleRefresh.bind(this) });
    };

    handleRefresh = () => this.props.searchCollaborator(this.state.searchString);

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
                        blurOnSubmit={false}
                        onSubmitEditing={this.state.searchString === "" ? null : this.handleRefresh}
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
                    renderItem={({ item }) => (
                        <ContactItem
                            item={item}
                            type={item.requested ? "Cancel" : "Add"}
                            extraButtonPress={this.handleRefresh}
                            onSelectContact={this.handleSelectContact}
                        />
                    )}
                    data={this.props.searchResult}
                    keyExtractor={(item) => `${item.id}`}
                    refreshing={this.props.loading}
                    onRefresh={this.handleRefresh}
                    ItemSeparatorComponent={({ leadingItem }) =>
                        leadingItem ? <View backgroundColor={SWATCH.LIGHT_GRAY} height={0.5} /> : null
                    }
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading,
    // searchResult: state.searchContactList,
});

const mapDispatchToProps = (dispatch) => ({
    searchCollaborator: (searchString) => dispatch(searchContact(searchString)),
    selectCollaborator: (contact, type) => dispatch(selectContact(contact, type)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddCollaborator);

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
