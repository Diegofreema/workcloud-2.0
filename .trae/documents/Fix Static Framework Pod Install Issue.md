## Goal
Identify packages using `GoogleUtilities` and resolve the `pod install` failure.

## Analysis
- **Direct Usage**: `GoogleUtilities` is used by `@react-native-firebase/messaging` (found in imports like `GULAppDelegateSwizzler.h`).
- **Dependency Chain**: `FirebaseCoreInternal` (a transitive dependency of `FirebaseCore`, used by all Firebase packages) depends on `GoogleUtilities`.
- **The Conflict**:
    - The project is configured for **static frameworks** (`use_frameworks! :linkage => :static`).
    - `FirebaseCoreInternal` is a Swift pod.
    - `GoogleUtilities` is an Objective-C pod without a module map.
    - Swift static libraries cannot import non-modular Objective-C static libraries.

## Solution
Since `GoogleUtilities` is pulled in by the Firebase stack (specifically for messaging and core functions), and we are using static frameworks (likely for other deps like Stream or Expo Video), we must ensure `GoogleUtilities` exposes a module map.

## Steps
1.  **Clean & Regenerate**: Run `npx expo prebuild --clean` to ensure `app.json` changes (removing `useFrameworks`) take effect. If we *intended* to remove frameworks, this should fix it.
2.  **Verify Podfile**: Check if `use_frameworks!` is present in the generated `ios/Podfile`.
3.  **Install**: Run `pod install` in `ios/`.

I will proceed with the clean prebuild to enforce the configuration change.