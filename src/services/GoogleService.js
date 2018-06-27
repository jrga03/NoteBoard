import { GoogleSignin } from "react-native-google-signin";
import { FirebaseService } from "./FirebaseService";

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
        // await this.initialize();
        try {
            const user = await GoogleSignin.signIn();

            await FirebaseService.logInUsingSocial(
                "Google",
                user,
                (err, res) => {
                    console.log("google", err, res)
                    if (!err && res) {
                        console.log(res);
                        callback(null, res);
                    } else {
                        console.log(err);
                        callback(err, null);
                    }
                }
            );
        } catch (error) {
            console.log("GOOGLE SIGN IN ERROR", error);
            callback(error, null);
        }
    }

    // async signOut(/*callback*/) {
    //     try {
    //         // await this.initialize();
    //         await GoogleSignin.configure({
    //             // scopes: [],
    //             iosClientId:
    //                 "604168385941-564sugmijrebh8dg3vpt5i2tr5df4bee.apps.googleusercontent.com",
    //             webClientId:
    //                 "604168385941-5unq3p22khg777375e1flqmnj2f40ns4.apps.googleusercontent.com",
    //             offlineAccess: false,
    //         });
    //         const user = await this.isUserLoggedIn();
    //         if (user !== null) {
    //             await GoogleSignin.revokeAccess();
    //         }
    //         await GoogleSignin.signOut();
    //         // callback(null, true);
    //     } catch (error) {
    //         console.log("GOOGLE SIGN OUT ERROR:", error);
    //         // callback(error, null);
    //     }
    // }
}

const GoogleService = new _GoogleService();

export { GoogleService };
