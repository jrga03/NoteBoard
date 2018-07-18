import { NavigationActions } from "react-navigation";

let navigator;

const NavigationService = {
    setTopLevelNavigator(navigatorRef) {
        navigator = navigatorRef;
    },

    navigate(routeName, params) {
        navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
    },
};

// add other navigation functions that you need and export them

// const NavigationService = { setTopLevelNavigator, navigate };

export { NavigationService };
