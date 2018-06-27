import {
    AccessToken,
    LoginManager,
    // GraphRequest,
    // GraphRequestManager,
} from "react-native-fbsdk";
import { FirebaseService } from "./FirebaseService";

class _FacebookService {
    async getAccessToken() {
        return await AccessToken.getCurrentAccessToken();
    }

    async refreshAccessToken() {
        const refreshToken = AccessToken.refreshCurrentAccessTokenAsync();
        return await refreshToken;
    }

    async signIn(callback) {
        try {
            const requestPermissions = [
                "public_profile",
                "email",
                "user_friends",
            ];
            const result = await LoginManager.logInWithReadPermissions(
                requestPermissions
            );

            if (result.isCancelled) {
                return callback(result, null);
            } else {
                // console.log('Login success with permissions: ', result.grantedPermissions);

                // request access token for graph request
                let getToken = await AccessToken.getCurrentAccessToken();

                if (!getToken) {
                    throw "Something went wrong obtaining the users access token";
                }

                const accessToken = getToken.accessToken;

                await FirebaseService.logInUsingSocial("Facebook", accessToken, (err, res) => {
                    if (!err && res) {
                        return callback(null, res);
                    } else {
                        return callback(err, null);
                    }
                });




                // // this function returns the retrieved user profile
                // const responseInfoCallback = (error, result) => {
                //     if (error) {
                //         // console.log('response error', error);
                //         return callback(error, null);
                //     } else {
                //         // console.log('response result', result);

                //         const user = {
                //             ...result,
                //             id: result.id || "",
                //             email: result.email || "",
                //             full_name: result.name || "",
                //             ...getToken,
                //         };

                //         // console.log("Facebook signed in: ", user);
                //         return callback(null, user);
                //     }
                // };

                // // retrieve user profile
                // const infoRequest = new GraphRequest(
                //     "/me",
                //     {
                //         accessToken: accessToken,
                //         parameters: {
                //             fields: {
                //                 string:
                //                     "id,email,name,first_name,last_name,gender",
                //             },
                //         },
                //     },
                //     responseInfoCallback
                // );

                // // Start the graph request.
                // new GraphRequestManager().addRequest(infoRequest).start();
            }
        } catch (error) {
            // console.log('Login fail with error: ', error);
            return callback(error, null);
        }
    }

    // signOut() {
    //     // console.log("FB out");
    //     LoginManager.logOut();
    // }
}

const FacebookService = new _FacebookService();

export { FacebookService };
