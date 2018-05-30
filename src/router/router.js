import React from "react";
import {
    createStackNavigator,
    createDrawerNavigator,
    createMaterialBottomNavigator,
    createSwitchNavigator,
} from "react-navigation";

import Initiator from "../initiator/Initiator";
import SignInScreen from "../screens/signin/SignIn";
import HomeScreen from "../screens/home/Home";

const HomeDrawer = createDrawerNavigator(
    {
        Home: HomeScreen,
    },
    {
        initialRouteName: "Home",
    }
);

const SignInStack = createStackNavigator(
    {
        SignIn: SignInScreen,
    },
    {
        initialRouteName: "SignIn",
    }
);

const Root = createSwitchNavigator(
    {
        Initiator: Initiator,
        SignIn: SignInStack,
        Home: HomeDrawer,
    },
    {
        initialRouteName: "Initiator",
    }
);

export default Root;
