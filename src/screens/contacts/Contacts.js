import React, { Component } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { connect } from "react-redux";

import ContactItem from "./ContactItem";
import { FirebaseService } from "../../services/FirebaseService";
import { updateContactList, updatePendingContactList } from "../../actions";
import { LAYOUT_MARGIN, SWATCH } from "../../constants";

class Contacts extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {

    //     };
    // }

    componentDidMount() {
        // this.fetchAllContacts();

        FirebaseService.addContactsListener(this.fetchContacts);
        FirebaseService.addPendingContactListener(this.fetchPendingContacts);
    }

    componentWillUnmount() {
        FirebaseService.removeContactsListener(this.fetchContacts);
        FirebaseService.removePendingContactListener(this.fetchPendingContacts);
    }

    componentDidUpdate() {
        // console.log(this.props);
    }

    fetchContacts = async (contacts) => {
        if (contacts.exists()) {
            contactList = [];
            const contactsArray = Object.keys(contacts.toJSON());

            for (const id of contactsArray) {
                const data = await FirebaseService.fetchContactInfo(id);
                contactList.push(data.toJSON());
            }

            this.props.updateContactList(contactList);
            // console.log("contactList", contactList);
        } else {
            this.props.updateContactList([]);
        }
    };

    fetchPendingContacts = async (pendingContacts) => {
        if (pendingContacts.exists()) {
            pendingContactList = [];
            const pendingContactsArray = Object.keys(pendingContacts.toJSON());

            for (const id of pendingContactsArray) {
                const data = await FirebaseService.fetchContactInfo(id);
                pendingContactList.push(data.toJSON());
            }

            this.props.updatePendingContactList(pendingContactList);
            // console.log("contactList", contactList);
        } else {
            this.props.updatePendingContactList([]);
        }
    };

    handleRefresh() {
        FirebaseService.fetchContacts(this.fetchContacts);
        FirebaseService.fetchPendingContacts(this.fetchPendingContacts);
    }

    render() {
        const { container, listContainer, emptyListContainer, sectionTitleText, sectionSeparator } = styles;
        return (
            <SectionList
                style={container}
                contentContainerStyle={listContainer}
                renderItem={({ item }) => <ContactItem />}
                renderSectionHeader={({ section: { title, data } }) =>
                    title === "Requests" && data.length > 0 ? <Text style={sectionTitleText}>{title}</Text> : null
                }
                sections={[
                    { title: "Requests", data: this.props.pendingContacts },
                    { title: "", data: this.props.contacts },
                ]}
                keyExtractor={(item) => `${item.id}`}
                // refreshing={isLoading}
                // onRefresh={this.handleRefresh}
                SectionSeparatorComponent={({ trailingSection, leadingItem }) =>
                    trailingSection && leadingItem ? <View style={sectionSeparator} /> : null
                }
                renderSectionFooter={({ section: { title, data } }) =>
                    // !isLoading &&
                    title === "" && data.length === 0 ? (
                        <View style={emptyListContainer}>
                            <Text />
                            <Text>You have no contacts</Text>
                        </View>
                    ) : null
                }
            />
            // <View style={styles.container}>
            //     <SectionList />
            //     <ContactItem />
            //     {/* <Text>{this.props.navigation.state.routeName} Screen</Text> */}
            // </View>
        );
    }
}

mapStateToProps = (state) => ({
    contacts: state.contactList,
    pendingContacts: state.pendingContactList,
});

mapDispatchToProps = (dispatch) => ({
    updateContactList: (contacts) => dispatch(updateContactList(contacts)),
    updatePendingContactList: (contacts) => dispatch(updatePendingContactList(contacts)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        justifyContent: "center",
        paddingVertical: LAYOUT_MARGIN,
        // alignItems: "center",
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
    },
    sectionTitleText: {
        fontWeight: "bold",
        paddingVertical: 8,
        paddingHorizontal: LAYOUT_MARGIN,
    },
    sectionSeparator: {
        marginVertical: 15,
        height: 1,
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
});
