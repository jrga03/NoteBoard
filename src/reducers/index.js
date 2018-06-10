import { combineReducers } from "redux";
import CurrentUser from "./reducer_current_user";

const rootReducer = combineReducers({
    currentUser: CurrentUser,
});

export default rootReducer;
