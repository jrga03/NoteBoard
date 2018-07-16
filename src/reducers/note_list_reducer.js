import Moment from "moment";
import { NOTE_LIST_REQUEST, EDIT_NOTE_ITEM } from "../actions/constants";

export default function(state = initialState, action) {
    switch (action.type) {
        case NOTE_LIST_REQUEST:
            return state;
        case EDIT_NOTE_ITEM:
            // console.log("oldState", state, action);
            const newState = state;
            newState.splice(action.index, 1);
            // console.log("spliced", newState, newState.length);
            newState.unshift(action.payload);
            // console.log("unshifted", newState, newState.length);
            return newState;
        default:
            console.log("test", state)
            return state;
    }
}

const initialState = [
    {
        id: 0,
        title: "HELLO",
        type: "memo",
        contents: [
            {
                checked: true,
                content: "AZXCBSA",
            },
            {
                checked: false,
                content: "XXXXX",
            },
        ],
        lastEditedAt: Moment(new Date(Date.UTC(2018, 5, 9, 0, 0, 0))).format("x"),
        pinned: false,
    },
    {
        id: 1,
        title: "CHECKLIST",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "ASDF",
            },
            {
                checked: false,
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur ullamcorper quam id sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a elit in nulla elementum facilisis. Nunc semper tempus erat et imperdiet. Sed vitae mollis arcu. Cras scelerisque nec erat eget rhoncus. Aenean sit amet mollis nibh, a egestas risus.",
            },
            {
                checked: true,
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur ullamcorper quam id sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a elit in nulla elementum facilisis. Nunc semper tempus erat et imperdiet. Sed vitae mollis arcu. Cras scelerisque nec erat eget rhoncus. Aenean sit amet mollis nibh, a egestas risus.",
            },
            {
                checked: true,
                content: "A",
            },
            {
                checked: false,
                content: "B",
            },
            {
                checked: true,
                content: "C",
            },
            {
                checked: false,
                content: "D",
            },
            {
                checked: true,
                content: "E",
            },
            {
                checked: false,
                content: "F",
            },
        ],
        lastEditedAt: Moment(new Date(Date.UTC(2018, 4, 10, 0, 0, 0))).format("x"),
        pinned: true,
    },
    {
        id: 2,
        title: "Test for List",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "Hello world",
            },
            {
                checked: false,
                content: "Lorem ipsum",
            },
        ],
        lastEditedAt: Moment(new Date(Date.UTC(2018, 2, 28, 0, 0, 0))).format("x"),
        pinned: false,
    },
    {
        id: 3,
        title: "Hi hello",
        type: "checklist",
        contents: [
            {
                checked: true,
                content: "Woooo",
            },
            {
                checked: false,
                content: "Need to test longer message lorem ipsum",
            },
            {
                checked: true,
                content: "Woooo",
            },
            {
                checked: false,
                content: "Need to test long message",
            },
        ],
        lastEditedAt: Moment(new Date(Date.UTC(2018, 11, 27, 0, 0, 0))).format("x"),
        pinned: false,
    },
];
