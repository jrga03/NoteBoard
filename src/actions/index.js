export function currentUser(user) {
    return {
        type: "CURRENT_USER",
        payload: user,
    };
}
