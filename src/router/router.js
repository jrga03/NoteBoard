import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import {
    createStackNavigator,
    createDrawerNavigator,
    createMaterialBottomNavigator,
    createMaterialTopTabNavigator,
    createSwitchNavigator,
    // DrawerActions,
    // createTabNavigator,
} from "react-navigation";
import { Icon } from "react-native-elements";

import { SWATCH } from "../constants";

import Initiator from "../screens/initiator/Initiator";
import SignInScreen from "../screens/signin/SignIn";
import NotesScreen from "../screens/notes/Notes";
import SignInPassword from "../screens/signin/SignInPassword";
import NotificationScreen from "../screens/notifications/Notifications";
import SettingsScreen from "../screens/settings/Settings";
import NoteItemScreen from "../screens/notes/NoteItem";
import SignUpScreen from "../screens/signup/SignUp";
import ContactsScreen from "../screens/contacts/Contacts";

const commonNavigationOptions = (navigation, screenProps, ...props) => ({
    headerLeft: (
        <TouchableOpacity
            onPress={() => navigation.toggleDrawer({ key: "Main" })}>
            <Icon
                type="material-icons"
                name="menu"
                color={SWATCH.BLACK}
                size={27}
            />
        </TouchableOpacity>
    ),
    headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Icon
                type="material-icons"
                name="notifications"
                color={SWATCH.BLACK}
                size={27}
            />
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
        // alignSelf: "flex-start",
        width: "100%",
    },
});
const noteItemNavigationOptions = (navigation, screenProps, ...props) => ({
    // headerLeft: (
    //     <TouchableOpacity onPress={() => navigation.goBack()}>
    //         <Icon
    //             type="ionicicons"
    //             name="ios-arrow-back"
    //             color={SWATCH.BLACK}
    //             size={27}
    //         />
    //     </TouchableOpacity>
    // ),
    headerRight: (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={() => navigation.navigate("Notifications")}>
                <Icon
                    type="material-community"
                    name="pin"
                    color={SWATCH.BLACK}
                    size={27}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={() => navigation.navigate("Notifications")}>
                <Icon
                    type="material-icons"
                    name="event-note"
                    color={SWATCH.BLACK}
                    size={27}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={() => navigation.navigate("Notifications")}>
                <Icon
                    type="material-icons"
                    name="archive"
                    color={SWATCH.BLACK}
                    size={27}
                />
            </TouchableOpacity>
        </View>
    ),
    headerStyle: {
        backgroundColor: SWATCH.GRAY,
        height: 50,
        paddingHorizontal: 10,
    },
    headerBackTitle: null,
    headerTintColor: SWATCH.BLACK,
    headerTitleStyle: {
        color: SWATCH.BLACK,
        fontSize: 18,
        textAlign: "left",
        // alignSelf: "flex-start",
        width: "100%",
    },
});

const NotesStack = createStackNavigator(
    {
        Notes: {
            screen: NotesScreen,
            navigationOptions: ({ navigation, screenProps }) => ({
                title: "Notes".toUpperCase(),
                ...commonNavigationOptions(navigation, screenProps),
            }),
        },
        NoteItem: {
            screen: NoteItemScreen,
            navigationOptions: ({ navigation, screenProps }) => ({
                ...noteItemNavigationOptions(navigation, screenProps),
                gesturesEnabled: false,
            }),
            drawerLockMode: "locked-closed",
        },
    },
    {
        initialRouteName: "Notes",
        // navigationOptions: ({ navigation, screenProps }) => ({
        //     title: "Notes".toUpperCase(),
        //     ...commonNavigationOptions(navigation, screenProps),
        // }),

        // getCustomActionCreators: (route, stateKey) => {
        //     console.log("NotesStack", route, stateKey);
        //     return {
        //         toggleNoteDrawer: () =>
        //             DrawerActions.toggleDrawer({ key: stateKey }),
        //     };
        // },
    }
);

const ContactsTab = createMaterialTopTabNavigator({
    Contacts: ContactsScreen,
    Add: ContactsScreen,
});

const ContactsStack = createStackNavigator(
    {
        ContactsTab,
    },
    {
        initialRouteName: "ContactsTab",
        navigationOptions: ({ navigation, screenProps }) => ({
            title: "Contacts".toUpperCase(),
            ...commonNavigationOptions(navigation, screenProps),
        }),
    }
);

const SettingsStack = createStackNavigator(
    {
        Settings: SettingsScreen,
    },
    {
        initialRouteName: "Settings",
        navigationOptions: ({ navigation, screenProps }) => ({
            title: "Settings".toUpperCase(),
            ...commonNavigationOptions(navigation, screenProps),
        }),
    }
);

const MainDrawer = createDrawerNavigator(
    {
        NotesStack: {
            screen: NotesStack,
            navigationOptions: {
                title: "Notes",
            },
        },
        ContactsStack: {
            screen: ContactsStack,
            navigationOptions: {
                title: "Contacts",
            },
        },
        SettingsStack: {
            screen: SettingsStack,
            navigationOptions: {
                title: "Settings",
            },
        },
    },
    {
        initialRouteName: "NotesStack",
        // headerMode: "none",
        backBehavior: "initialRoute",
        // getCustomActionCreators: (route, stateKey) => {
        //     console.log("MainDrawer", route, stateKey);
        //     return {
        //         toggleNoteDrawer: () =>
        //             DrawerActions.toggleDrawer({ key: stateKey }),
        //     };
        // },
    }
);

const MainStack = createStackNavigator(
    {
        Main: {
            screen: MainDrawer,
            navigationOptions: {
                header: null,
            },
        },
        Notifications: {
            screen: NotificationScreen,
            navigationOptions: {
                title: "Notifications".toUpperCase(),
            },
        },
    },
    {
        // headerMode: "none",
        initialRouteName: "Main",
        navigationOptions: {
            headerStyle: {
                backgroundColor: SWATCH.GRAY,
                height: 50,
            },
            headerTitleStyle: {
                color: SWATCH.BLACK,
                fontSize: 18,
            },
        },
    }
);

const SignInStack = createStackNavigator(
    {
        SignInPage: SignInScreen,
        Password: SignInPassword,
        SignUp: SignUpScreen,
    },
    {
        initialRouteName: "SignInPage",
        headerMode: "none",
    }
);

const Root = createSwitchNavigator(
    {
        Initiator: Initiator,
        SignIn: SignInStack,
        Home: MainStack,
    },
    {
        initialRouteName: "Initiator",
    }
);

export default Root;
