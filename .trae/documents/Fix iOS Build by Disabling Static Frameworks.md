## Explanation
`@react-native-firebase` packages are **cross-platform**. When you install them, React Native's "autolinking" feature automatically adds the necessary native code (Pods) to your iOS project during `pod install`.

Even if you primarily want FCM for Android, the library includes iOS support (for APNs/FCM on iOS), so the iOS build system pulls in the underlying Firebase iOS SDKs, which depend on `GoogleUtilities`.

## The Issue
Your iOS project is configured to build dependencies as **static frameworks** (likely due to a setting in `app.json` or a leftover configuration).
- **The Conflict**: `GoogleUtilities` (an Objective-C library used by Firebase) doesn't support Swift static frameworks by default.
- **The Result**: `pod install` fails because it can't link `FirebaseCoreInternal` (Swift) with `GoogleUtilities`.

## Solution
We need to disable the "static frameworks" configuration for iOS. This is the standard setup for React Native Firebase and resolves the module map error.

1.  **Update `app.json`**: Remove `"useFrameworks": "static"` from the `ios` build properties.
2.  **Clean & Reinstall**: Regenerate the iOS project files to ensure the setting is applied.

I will proceed with applying this fix.