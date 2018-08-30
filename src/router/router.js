import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import {
    createStackNavigator,
    createDrawerNavigator,
    // createMaterialBottomNavigator,
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
import AddContactScreen from "../screens/contacts/AddContact";
import ContactProfile from "../screens/contacts/ContactProfile";
import NoteMap from "../screens/notes/Map";
import Camera from "../screens/notes/Camera";

const generateIcon = (type, name, color = SWATCH.BLACK, size = 27) => {
    return <Icon name={name} type={type} color={color} size={size} />;
};

const commonNavigationOptions = (navigation, screenProps, ...props) => ({
    headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer({ key: "Main" })}>
            {generateIcon("material-icons", "menu")}
        </TouchableOpacity>
    ),
    headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            {generateIcon("material-icons", "notifications")}
        </TouchableOpacity>
    ),
    headerStyle: {
        backgroundColor: SWATCH.GLACIER,
        height: 50,
        paddingHorizontal: 10,
    },
    headerTitleStyle: {
        color: SWATCH.BLACK,
        fontSize: 18,
        textAlign: "left",
        width: "100%",
    },
});

const noteHomeNavigationOptions = (navigation, screenProps, ...props) => {
    let layout = navigation.getParam("noteLayout", "tile");

    toggleLayout = () => {
        const noteLayout = layout === "tile" ? "list" : "tile";
        navigation.setParams({ noteLayout });
    };

    return {
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.toggleDrawer({ key: "Main" })}>
                {generateIcon("material-icons", "menu")}
            </TouchableOpacity>
        ),
        headerRight: (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => null}>
                    {generateIcon("material-icons", "search")}
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={toggleLayout}>
                    {generateIcon("material-icons", layout === "tile" ? "view-quilt" : "view-stream")}
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.navigate("Notifications")}>
                    {generateIcon("material-icons", "notifications")}
                </TouchableOpacity>
            </View>
        ),
        // headerStyle: {
        //     backgroundColor: SWATCH.GLACIER,
        //     height: 50,
        //     paddingHorizontal: 10,
        // },
        headerBackTitle: null,
        headerTintColor: SWATCH.BLACK,
        // headerTitleStyle: {
        //     color: SWATCH.BLACK,
        //     fontSize: 18,
        //     textAlign: "left",
        //     width: "100%",
        // },
    };
};

const noteItemNavigationOptions = (navigation, screenProps, ...props) => {
    const isPinned = navigation.getParam("isPinned", false);
    const pinColor = isPinned ? SWATCH.RED_ORANGE : SWATCH.BLACK;

    handlePinOnPress = () => {
        if (navigation.state.params && navigation.state.params.togglePin) {
            navigation.state.params.togglePin();
        }
    };

    return {
        headerRight: (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={handlePinOnPress}>
                    {generateIcon("material-community", "pin", pinColor)}
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => null}>
                    {generateIcon("material-icons", "event-note")}
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => null}>
                    {generateIcon("material-icons", "archive")}
                </TouchableOpacity>
            </View>
        ),
        headerStyle: {
            backgroundColor: SWATCH.GLACIER,
            height: 50,
            paddingRight: Platform.OS === "ios" ? 10 : 15,
        },
        headerTintColor: SWATCH.BLACK,
    };
};

const NotesStack = createStackNavigator(
    {
        Notes: {
            screen: NotesScreen,
            navigationOptions: ({ navigation, screenProps }) => ({
                title: "Notes".toUpperCase(),
                ...commonNavigationOptions(navigation, screenProps),
                ...noteHomeNavigationOptions(navigation, screenProps),
                headerBackTitle: "NOTES",
            }),
        },
        NoteItem: {
            screen: NoteItemScreen,
            navigationOptions: ({ navigation, screenProps }) => ({
                ...noteItemNavigationOptions(navigation, screenProps),
                gesturesEnabled: false,
                headerBackTitle: "NOTE",
            }),
        },
        NoteMap: {
            screen: NoteMap,
            navigationOptions: ({ navigation }) => {
                return !!navigation.getParam("selectedMarker", "")
                    ? {
                          title: navigation.getParam("selectedMarker", ""),
                          headerLeft: (
                              <TouchableOpacity
                                  onPress={() =>
                                      navigation.state.params && navigation.state.params.deselectMarker
                                          ? navigation.state.params.deselectMarker()
                                          : null
                                  }>
                                  <Icon type="material-icons" name="clear" color={SWATCH.BLACK} size={27} />
                              </TouchableOpacity>
                          ),
                          headerStyle: {
                              backgroundColor: SWATCH.GLACIER,
                              height: 50,
                              paddingRight: Platform.OS === "ios" ? 10 : 20,
                          },
                          headerTitleStyle: {
                              color: SWATCH.BLACK,
                              fontSize: 18,
                              textAlign: "left",
                              width: "100%",
                          },
                      }
                    : {
                          title: navigation.getParam("selectedMarker", ""),
                          headerRight: (
                              <TouchableOpacity
                                  onPress={() =>
                                      navigation.state.params && navigation.state.params.saveTaggedLocations
                                          ? navigation.state.params.saveTaggedLocations()
                                          : null
                                  }>
                                  <Text style={{ color: SWATCH.BLACK }}>SAVE</Text>
                              </TouchableOpacity>
                          ),
                          headerStyle: {
                              backgroundColor: SWATCH.GLACIER,
                              height: 50,
                              paddingRight: Platform.OS === "ios" ? 15 : 20,
                          },
                          headerTintColor: SWATCH.BLACK,
                      };
            },
        },
        Camera: {
            screen: Camera,
            navigationOptions: {
                header: null,
                gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName: "Notes",
        initialRouteParams: {
            noteLayout: "list",
            isPinned: false,
        },
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

const ContactsTab = createMaterialTopTabNavigator(
    {
        Contacts: ContactsScreen,
        Add: AddContactScreen,
    },
    {
        tabBarOptions: {
            indicatorStyle: {
                backgroundColor: SWATCH.RED_ORANGE,
            },
            activeTintColor: SWATCH.RED_ORANGE,
            inactiveTintColor: SWATCH.BLACK,
            style: {
                backgroundColor: SWATCH.MYSTIC
            }
        },
    }
);

const ContactsStack = createStackNavigator(
    {
        ContactsTab: {
            screen: ContactsTab,
            navigationOptions: ({ navigation, screenProps }) => ({
                title: "Contacts".toUpperCase(),
                ...commonNavigationOptions(navigation, screenProps),
            }),
        },
        ContactProfile: {
            screen: ContactProfile,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: SWATCH.GLACIER,
                    height: 50,
                    paddingHorizontal: 10,
                },
                headerTintColor: SWATCH.BLACK,
            },
        },
    },
    {
        initialRouteName: "ContactsTab",
        // headerBackTitleVisible: true,
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
        // initialRouteName: "ContactsStack",
        // headerMode: "none",
        backBehavior: "initialRoute",
        drawerLockMode: "locked-closed",
        // getCustomActionCreators: (route, stateKey) => {
        //     console.log("MainDrawer", route, stateKey);
        // return {
        //     toggleNoteDrawer: () =>
        //         DrawerActions.toggleDrawer({ key: stateKey }),
        // };
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
                backgroundColor: SWATCH.GLACIER,
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
