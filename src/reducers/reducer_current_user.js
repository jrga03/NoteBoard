export default function(state = null, action) {
    switch (action.type) {
        case "CURRENT_USER":
            return action.payload;
    }
    return state;
}
