import {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} from "react-native-fbsdk";

class _FacebookService {
    async signIn(/*callback*/) {
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
                // return callback(result, null);
            } else {
                // console.log('Login success with permissions: ', result.grantedPermissions);

                // request access token for graph request
                let getToken = await AccessToken.getCurrentAccessToken();
                const accessToken = getToken.accessToken;

                // this function returns the retrieved user profile
                const responseInfoCallback = (error, result) => {
                    if (error) {
                        // console.log('response error', error);
                        // return callback(error, null);
                    } else {
                        // console.log('response result', result);

                        const user = {
                            ...result,
                            id: result.id || "",
                            email: result.email || "",
                            full_name: result.name || "",
                            loggedInUsing: "Facebook",
                        };

                        console.log("Facebook Signed In ", user);
                        // return callback(null, user);
                    }
                };

                // retrieve user profile
                const infoRequest = new GraphRequest(
                    "/me",
                    {
                        accessToken: accessToken,
                        parameters: {
                            fields: {
                                string:
                                    "id,email,name,first_name,last_name,gender",
                            },
                        },
                    },
                    responseInfoCallback
                );

                // Start the graph request.
                new GraphRequestManager().addRequest(infoRequest).start();
            }
        } catch (error) {
            // console.log('Login fail with error: ', error);
            // return callback(error, null);
        }
    }
}

const FacebookService = new _FacebookService();

export { FacebookService };
