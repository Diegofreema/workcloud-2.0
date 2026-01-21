## Goal
Fix `pod install` failure caused by non-modular `GoogleUtilities` dependency when using static frameworks in iOS.

## Issue
- `app.json` enables static frameworks (`"useFrameworks": "static"`).
- `FirebaseCoreInternal` (Swift) depends on `GoogleUtilities` (ObjC), which lacks module maps.
- CocoaPods fails because Swift static libraries require modular transitive dependencies.

## Solution
Disable static frameworks in `app.json` since they are often unnecessary for React Native unless explicitly required by a specific library (e.g., some Firebase versions, but RNFirebase generally works without them or with dynamic frameworks). If removing it is problematic, we can use `use_modular_headers!` in Podfile, but removing the Expo property is cleaner.

## Steps
1.  **Modify `app.json`**: Remove `"useFrameworks": "static"` from `expo-build-properties` -> `ios`.
2.  **Clean & Reinstall**:
    - Run `npx expo prebuild --clean` to regenerate native files.
    - Run `cd ios && pod install --repo-update` to ensure pods install correctly.
3.  **Verify**: Check if `pod install` succeeds.

## File to Modify
- [app.json](file:///Users/mac/Desktop/personal/workcloud-2.0/app.json)

I will proceed to update `app.json` and then run the clean/install commands.