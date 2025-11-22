## Goal
Add a new “Manage Subscription” entry in `components/Ui/OtherLinks.tsx` and create the `/manage-sudription` screen to display the user’s subscription via `api.users.getSubscriptions`, with actions to manage/cancel or start a subscription when none exists.

## Changes
1. Navigation Entry
- Insert a new `Item` in `components/Ui/OtherLinks.tsx` titled `Manage Subscription` with link `'/manage-sudription'`.

2. New Screen
- Create `app/(app)/(other-screens)/manage-sudription.tsx`.
- Use `useQuery(api.users.getSubscriptions)` to load subscription state.
- UI states:
  - Loading: show `LoadingComponent`.
  - No subscription: show a message and a button that navigates to `'/subcription'`.
  - Active subscription: show product name, status, interval, and action buttons.

3. Actions
- Manage/Change: call `api.polar.generateCustomerPortalUrl` and open the returned URL with `expo-web-browser`.
- Cancel: call `api.polar.cancelCurrentSubscription` and show a toast; requery or optimistic update.

4. Styling & Components
- Follow existing component patterns: `Container`, `HeaderNav`, `VStack`, `MyText`, `Button`, `CustomPressable`, and theme colors from `constants/Colors`.
- Keep styles consistent with `subcription` screen cards.

## Verification
- Navigate from Settings → `OtherLinks` → `Manage Subscription`.
- Confirm:
  - With active subscription: details render; Manage opens portal; Cancel updates state.
  - Without subscription: “no subscription” message shows and button goes to `'/subcription'`.

If approved, I will implement the link and the new screen accordingly.