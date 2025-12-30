## Goal
Format voice recording durations in `features/chat/components/custom-list-item.tsx` to display as `mm:ss` (e.g., `00:31`) instead of fractional seconds.

## Changes
- Detect voiceRecording attachments and compute duration from `attachments[0].duration`.
- Convert milliseconds to whole seconds using floor, then format as `mm:ss`.
- Replace current text `(durationInSeconds)` with `(mm:ss)`.

## Verification
- Render a preview item with a `voiceRecording` attachment of ~31.053s and confirm it shows `00:31` next to “Voice message”.