# CyberMinute Portal Auth Handoff

CyberMinute shares the CyberPortal Supabase project (`sbqjdgrchsbvfwgodhmt`). When a portal user opens CyberMinute, the portal passes their Supabase session tokens in the URL hash so the game can authenticate without a separate login.

## Handoff URL format

```
https://cyberminute.skywavetechnologies.com/#access_token=<ACCESS_TOKEN>&refresh_token=<REFRESH_TOKEN>&type=portal_handoff
```

| Parameter        | Required | Description |
|------------------|----------|-------------|
| `access_token`   | Yes      | Supabase JWT from the portal user's active session (`session.access_token`) |
| `refresh_token`  | Yes      | Supabase refresh token from the portal session (`session.refresh_token`) |
| `type`           | Yes      | Must be exactly `portal_handoff` so CyberMinute distinguishes portal launches from other Supabase hash redirects |

Optional Supabase hash fields (`expires_in`, `token_type`, etc.) are ignored by CyberMinute but may be present.

## Portal integration (CyberPortal side)

1. Ensure the user is signed in to CyberPortal with a `@skywavetechnologies.com` email.
2. Read tokens from the active Supabase session:
   ```ts
   const { data: { session } } = await supabase.auth.getSession();
   if (!session) return; // not signed in

   const base = 'https://cyberminute.skywavetechnologies.com';
   const hash = new URLSearchParams({
     access_token: session.access_token,
     refresh_token: session.refresh_token,
     type: 'portal_handoff',
   }).toString();

   window.open(`${base}#${hash}`, '_blank', 'noopener,noreferrer');
   ```
3. Open in a new tab (`target="_blank"`). Do **not** append tokens to the query string; use the hash fragment so tokens are not sent to the server or logged in referrer headers.

## CyberMinute behavior on load

1. Parse `window.location.hash` for `type=portal_handoff`.
2. Call `supabase.auth.setSession({ access_token, refresh_token })`.
3. Remove the hash from the address bar via `history.replaceState`.
4. Validate `user.email` ends with `@skywavetechnologies.com`; otherwise sign out and treat the user as anonymous.
5. If a valid session already exists (return visit), skip handoff parsing and reuse the stored session after the same email check.

## Authenticated high scores

When a portal-authenticated user finishes **60-second Challenge mode**:

- If the run beats their previous best, CyberMinute calls `upsert_user_highscore` with `p_game_slug: 'Cyberminute'` and `p_highscore: <score>`.
- `localStorage` key `cyberMinuteHighScore` is still updated as a fallback.
- The manual leaderboard name-entry UI is hidden; anonymous users continue to use the `submit-score` edge function.

## Security notes

- Only `@skywavetechnologies.com` accounts are accepted after handoff.
- Tokens live in the hash fragment briefly; CyberMinute clears the hash immediately after `setSession`.
- The anon key is used client-side with RLS; high-score writes go through the `upsert_user_highscore` RPC bound to `auth.uid()`.
