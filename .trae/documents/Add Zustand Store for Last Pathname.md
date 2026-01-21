## Goal
Create a lightweight Zustand store to keep track of the last pathname and expose simple setters/getters, with optional persistence.

## Implementation
- File: `store/pathname-store.ts` (TypeScript, colocated under `store/`)
- State shape:
  - `lastPathname: string | null`
  - `setLastPathname(path: string): void`
  - `reset(): void`
- Persistence (optional but useful):
  - Use `zustand/middleware` `persist` with `@react-native-async-storage/async-storage` so the value survives app restarts.
  - Storage key: `last-pathname`.

## Example Usage
- Record on navigation:
  - In any screen or a layout component:
    - `const pathname = usePathname()` from `expo-router`.
    - `useEffect(() => setLastPathname(pathname), [pathname])`.
- Consume anywhere:
  - `const lastPathname = usePathnameStore((s) => s.lastPathname)`.

## Notes
- No UI changes, purely state management.
- Safe for both light and dark modes; does not impact theme.

If approved, I will add `store/pathname-store.ts` and include the persisted implementation with AsyncStorage.