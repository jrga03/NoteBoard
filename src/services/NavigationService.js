import { NavigationActions } from "react-navigation";

let _navigator;

class _NavigationService {
    setTopLevelNavigator(navigatorRef) {
        _navigator = navigatorRef;
    }

    navigate(routeName, params) {
        _navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
    }
}

// add other navigation functions that you need and export them

const NavigationService = new _NavigationService();

export { NavigationService };
