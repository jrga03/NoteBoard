import React, { Component } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { connect } from "react-redux";

import ContactItem from "./ContactItem";
import { FirebaseService } from "../../services/FirebaseService";
import {
    updateContactList,
    updatePendingContactList,
    fetchContactList,
    fetchPendingContactList,
    selectContact,
} from "../../actions";
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
        this.props.fetchContactList();

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
        this.props.fetchPendingContactList();

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

    handleSelectContact = (contact, type) => {
        // console.log(contact, type);
        this.props.selectContact(contact, type);
        this.props.navigation.navigate("ContactProfile");
    };

    render() {
        const { container, listContainer, emptyListContainer, sectionTitleText, sectionSeparator } = styles;
        return (
            <SectionList
                style={container}
                contentContainerStyle={listContainer}
                renderItem={({ item, section: { title } }) => (
                    <ContactItem
                        item={item}
                        type={title === "" ? "Contact" : "Request"}
                        onSelectContact={this.handleSelectContact}
                    />
                )}
                renderSectionHeader={({ section: { title, data } }) =>
                    title === "Requests" && data.length > 0 ? <Text style={sectionTitleText}>{title}</Text> : null
                }
                sections={[
                    { title: "Requests", data: this.props.pendingContacts },
                    { title: "", data: this.props.contacts },
                ]}
                keyExtractor={(item) => `${item.id}`}
                refreshing={this.props.isLoading}
                onRefresh={this.handleRefresh}
                SectionSeparatorComponent={({ trailingSection, leadingItem }) =>
                    trailingSection && leadingItem ? <View style={sectionSeparator} /> : null
                }
                ItemSeparatorComponent={({ leadingItem }) =>
                    leadingItem ? <View backgroundColor={SWATCH.LIGHT_GRAY} height={0.5} /> : null
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
    isLoading: state.loading,
    // selectedContact: state.selectedContact,
});

mapDispatchToProps = (dispatch) => ({
    fetchContactList: () => dispatch(fetchContactList()),
    fetchPendingContactList: () => dispatch(fetchPendingContactList()),
    updateContactList: (contacts) => dispatch(updateContactList(contacts)),
    updatePendingContactList: (contacts) => dispatch(updatePendingContactList(contacts)),
    selectContact: (contact, type) => dispatch(selectContact(contact, type)),
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
        height: 2,
        backgroundColor: SWATCH.LIGHT_GRAY,
    },
});
