import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
    createStackNavigator,
    createDrawerNavigator,
    createMaterialBottomNavigator,
    createSwitchNavigator,
    DrawerActions,
} from "react-navigation";
import { Icon } from "react-native-elements";

import Initiator from "../screens/initiator/Initiator";
import SignInScreen from "../screens/signin/SignIn";
import NotesScreen from "../screens/notes/Notes";
import SignInPassword from "../screens/signin/SignInPassword";
import NotificationScreen from "../screens/notifications/Notifications";
import SettingsScreen from "../screens/settings/Settings";

import { SWATCH } from "../constants";

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
        // textAlign: "center",
        // alignSelf: "center",
        // width: "100%",
    },
});

const NotesStack = createStackNavigator(
    {
        Notes: NotesScreen,
    },
    {
        initialRouteName: "Notes",
        navigationOptions: ({ navigation, screenProps }) => ({
            title: "Notes".toUpperCase(),
            ...commonNavigationOptions(navigation, screenProps),
        }),
        // getCustomActionCreators: (route, stateKey) => {
        //     console.log("NotesStack", route, stateKey);
        //     return {
        //         toggleNoteDrawer: () =>
        //             DrawerActions.toggleDrawer({ key: stateKey }),
        //     };
        // },
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
        SettingsStack: {
            screen: SettingsStack,
            navigationOptions: {
                title: "Settings",
            },
        },
    },

    {
        initialRouteName: "NotesStack",
        headerMode: "none",
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
