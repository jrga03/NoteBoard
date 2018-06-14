import { GoogleSignin } from "react-native-google-signin";

class _GoogleService {
    async initialize() {
        try {
            await GoogleSignin.hasPlayServices({ autoResolve: true });
            await GoogleSignin.configure({
                // scopes: [],
                iosClientId:
                    "604168385941-564sugmijrebh8dg3vpt5i2tr5df4bee.apps.googleusercontent.com",
                webClientId:
                    "604168385941-5unq3p22khg777375e1flqmnj2f40ns4.apps.googleusercontent.com",
                offlineAccess: false,
            });
        } catch (err) {
            console.log("Google signin error", err.code, err.message);
        }
    }

    async isUserLoggedIn() {
        return await GoogleSignin.currentUserAsync();
    }

    async signIn(callback) {
        console.log("Google!")
        this.initialize();
        try {
            const user = await GoogleSignin.signIn();
            // const userWithTag = {
            //     ...user,
            //     loggedInUsing: "Google",
            // };
            console.log("Google Signed In", user);
            callback(null, user);
        } catch (error) {
            console.log("GOOGLE SIGN IN ERROR", error);
            callback(error, null);
        }
    }

    async signOut(callback) {
        try {
            await this.initialize();
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            callback(null, true);
        } catch (error) {
            // console.log("GOOGLE SIGN OUT ERROR:", error);
            callback(error, null);
        }
    }
}

const GoogleService = new _GoogleService();

export { GoogleService };
