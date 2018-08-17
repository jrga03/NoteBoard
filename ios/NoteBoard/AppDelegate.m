/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Firebase.h>
@import Firebase;
@import GoogleMaps; //add this line if you want to use Google Maps
@import GooglePlaces;

@implementation AppDelegate

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSPlacesClient provideAPIKey:@"AIzaSyDbNRYm1CGnAkTcn_9gwDM4OHX-UN0DaME"];
  [GMSServices provideAPIKey:@"AIzaSyDbNRYm1CGnAkTcn_9gwDM4OHX-UN0DaME"];

  NSURL *jsCodeLocation;


  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  [FIRApp configure];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"NoteBoard"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

- (BOOL)application:(UIApplication *)application 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  // Add any custom logic here.
  return handled;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {

  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                         openURL:url
                                               sourceApplication:sourceApplication
                                                      annotation:annotation] 
        ||
         [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

// - (BOOL)application:(UIApplication *)application
//             openURL:(NSURL *)url
//   sourceApplication:(NSString *)sourceApplication
//          annotation:(id)annotation {
//   return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation];
// }

@end
