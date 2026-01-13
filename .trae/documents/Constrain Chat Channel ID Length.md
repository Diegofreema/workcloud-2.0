## Goal
Ensure `channelId` in hooks/use-message.ts never exceeds 64 characters.

## Changes
- Compute base string from the sorted IDs: `[user.id, userToChat].sort().join('-')`.
- Derive max base length as `64 - 1 - type.length`.
- Slice base to that length and append `-type`.

## Verification
- For `type='processor'`, base slices to at most 54 so final length ≤64.
- For shorter types, base allows more characters while keeping ≤64.

Proceeding to implement the change.