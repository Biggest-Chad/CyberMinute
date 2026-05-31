# CyberMinute Leaderboard - Historical Implementation Record

**Status**: Core implementation complete  
**Completed**: May–June 2026  
**Last Updated**: 2026-05-31  
**Tech Stack**: Supabase (Free) + Static Azure Static Web Apps (HTML/CSS/JS)

---

## Summary of What Was Built

A lightweight public leaderboard for the 60-second Timed quiz mode with the following features:

- Public read access to all scores (no login required)
- Two tabs: **All Time** + **Today** (Bangkok UTC+7 timezone)
- Submit name (≤12 chars, letters + spaces) + score after legitimate quiz completion
- Proof-of-completion via `session_token` (generated on quiz start, validated server-side)
- Replay protection (UNIQUE constraint on `session_token`)
- Rate limiting: 1 submission per minute + max 10 per day per IP (via hashed IP)
- Timestamped scores with clean DD/M/YYYY display
- Post-submission success message that opens the leaderboard
- Admin can directly edit the database via Supabase Dashboard (preferred method)

**Scale target**: < 100 submissions/month — kept deliberately simple.

---

## Architecture (As Built)

- **Frontend**: Static site. Session token + duration tracking in `sessionStorage`. Submission via fetch to Edge Function. Leaderboard fetched via REST + client-side filtering.
- **Backend**: Single Supabase Edge Function (`submit-score`) that performs all validation and inserts using the service role key.
- **Database**: Postgres `scores` table with RLS (public SELECT only).
- **Security model**: Browser can never write directly to the table. All writes go through validated Edge Function.

---

## Current Database Schema

```sql
CREATE TABLE public.scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(name) <= 12),
    score integer NOT NULL CHECK (score >= 0 AND score <= 100),
    duration integer NOT NULL CHECK (duration >= 40 AND duration <= 80),
    completed_at timestamptz NOT NULL DEFAULT now(),
    session_token text NOT NULL UNIQUE,
    ip_hash text
);

CREATE INDEX idx_scores_completed_at ON public.scores(completed_at DESC);
CREATE INDEX idx_scores_ip_hash_completed_at ON public.scores(ip_hash, completed_at DESC);
```

---

## Key Implementation Notes & Deviations from Original Plan

- Added `session_token` + UNIQUE constraint for replay protection (not in initial schema).
- Added `ip_hash` + full rate limiting (1/min + 10/day) — stronger than originally planned.
- "Today" filter implemented client-side using Bangkok time (UTC+7) instead of pure UTC.
- Removed "Time" column from UI; dates shown as DD/M/YYYY.
- Post-submit success UI turned into a clickable button that opens the leaderboard.
- CORS headers added to Edge Function after mobile "Network error" issues.
- Multiple RLS iterations were required; final state uses explicit policies for `anon` and `authenticated` roles + `GRANT SELECT` to anon.
- No admin GUI was built (direct Supabase Dashboard editing is used, as preferred).

---

## Completed Phases

All original phases (Foundation → Edge Function → Frontend Integration → Hardening → Testing) were completed, plus additional hardening for rate limiting and timezone handling.

---

## Future Enhancements (Deferred / Low Priority)

- Daily/weekly leaderboard resets
- More advanced anti-cheat (e.g. question sequence proof)
- Realtime leaderboard updates via Supabase Realtime
- Simple password-protected admin UI (not needed while direct DB edits work well)
- Country / avatar support

These remain low priority given the expected low volume.

---

## References

- Current live site: https://cyberminute.skywavetechnologies.com (or custom domain)
- Supabase project: `sbqjdgrchsbvfwgodhmt`
- Repo: https://github.com/Biggest-Chad/CyberMinute

---

**This document is now maintained as a historical record** rather than an active implementation plan. All major design decisions and deviations from the original vision have been noted above.