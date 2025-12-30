## Goal
Ensure voice recording durations display correctly as mm:ss by handling both milliseconds and seconds inputs.

## Changes
- Update `features/chat/components/custom-list-item.tsx` voiceRecording branch to normalize the raw duration value:
  - If duration ≥ 1000 treat as milliseconds → seconds = round(duration/1000).
  - Else treat as seconds → seconds = round(duration).
- Format the normalized seconds as `mm:ss`.

## Verification
- With `duration = 31053` → shows `00:31`.
- With `duration = 31.053` → shows `00:31`.

Proceeding to implement this normalization.