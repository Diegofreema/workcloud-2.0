## Goal
Unblock `git push` by removing a leaked Google Cloud service account JSON from the repository history, prevent future leaks, and advise secret rotation.

## Approach
1. Identify & protect
- Confirm offending path: `test-notification-d20d7-firebase-adminsdk-1iwx3-6ff106692a.json` from commit `56e4438d...`.
- Create a safety backup branch before history rewrite.

2. Purge secret from history (non-interactive)
- Use `git filter-branch` to remove the file from all commits without interactive rebase.
- This rewrites commit SHAs; will require a force push.

3. Prevent future leaks
- Add `.gitignore` rule to ignore service-account JSON files (patterned to Firebase Admin keys).
- Optionally move credentials to environment or secrets manager.

4. Rotate/revoke the exposed key
- In Google Cloud, delete the exposed service account key and issue a new one if needed.

5. Push safely
- Force-push with `--force-with-lease` to update remote.
- If push protection flags more secrets, repeat based on its report.

## Commands (to run automatically)
- Create backup and purge history:
  - `git checkout -b backup/secret-removal`
  - `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch test-notification-d20d7-firebase-adminsdk-1iwx3-6ff106692a.json" --prune-empty --tag-name-filter cat -- --all`
- Add ignore entry:
  - Append `test-notification-d20d7-firebase-adminsdk-*.json` to `.gitignore` (or `*-firebase-adminsdk-*.json` if generic).
  - `git add .gitignore && git commit -m "chore(security): ignore service account JSON keys"`
- Push rewritten history:
  - `git push origin main --force-with-lease`

## Notes
- History rewrite affects collaborators; they must rebase onto new `main`.
- Avoid bypassing push protection; it’s safer to fully remove the secret.

If approved, I will run the commands, update `.gitignore`, and verify the push succeeds.