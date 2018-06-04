import React from "react";
import {
    createStackNavigator,
    createDrawerNavigator,
    createMaterialBottomNavigator,
    createSwitchNavigator,
} from "react-navigation";

import Initiator from "../screens/initiator/Initiator";
import SignInScreen from "../screens/signin/SignIn";
import HomeScreen from "../screens/home/Home";
import SignInPassword from "../screens/signin/SignInPassword";
import NotificationScreen from "../screens/notifications/Notifications";

const HomeDrawer = createDrawerNavigator(
    {
        Notes: HomeScreen,
    },
    {
        initialRouteName: "Notes",
    }
);

const HomeStack = createStackNavigator(
    {
        Main: HomeDrawer,
        Notifications: NotificationScreen,
    },
    {
        initialRouteName: "Main",
    }
);

const SignInStack = createStackNavigator(
    {
        SignIn: SignInScreen,
        Password: SignInPassword,
    },
    {
        initialRouteName: "SignIn",
        headerMode: "none",
    }
);

const Root = createSwitchNavigator(
    {
        Initiator: Initiator,
        SignIn: SignInStack,
        Home: HomeStack,
    },
    {
        initialRouteName: "Initiator",
    }
);

export default Root;
