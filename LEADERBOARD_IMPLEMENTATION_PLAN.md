# CyberMinute Leaderboard Implementation Plan

**Status**: Active Plan  
**Last Updated**: 2026-05-30  
**Backend**: Supabase (Free Tier)  
**Frontend**: Existing static site (HTML/CSS/JS) on Azure Static Web Apps  
**Expected Volume**: < 100 submissions per month  
**Priority**: Keep it simple, secure enough, and easy to maintain/administer

---

## 1. Goals & Constraints

### Must Have
- Persistent public leaderboard visible to anyone.
- Two views: **All Time Highscores** and **Best Scores Today**.
- Users can submit name (max 12 characters) + score after completing a 60-second Timed quiz.
- Scores must be timestamped (`completed_at`).
- No user authentication.
- Prevent obvious fake submissions (proof token method).
- Admin can directly edit/delete scores easily.

### Nice to Have (Low Priority)
- Simple admin GUI (do **not** prioritize over lightweight solution).
- IP-based anti-spam (optional column).

### Explicit Constraints
- Stay on current free static hosting.
- Minimize complexity and maintenance.
- <100 submissions/month (performance is not a concern).
- Direct database editing by admin is acceptable and preferred over building custom admin tools.

---

## 2. Architecture Overview

**Components**:
- **Frontend** (static): Quiz logic + new Leaderboard UI + submission flow.
- **Supabase**:
  - Postgres database (`scores` table)
  - One Edge Function (`submit-score`) — the **only** way to write scores.
  - Row Level Security (RLS) — public reads only.

**Why this architecture?**
- Gives real proof-of-completion validation via Edge Function (secret never touches browser).
- Supabase dashboard provides excellent admin experience out of the box.
- Extremely low cost and maintenance.
- Easy to reason about.

---

## 3. Database Schema

```sql
CREATE TABLE scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(name) <= 12),
    score integer NOT NULL CHECK (score >= 0),
    duration integer NOT NULL,                    -- seconds taken (validation)
    completed_at timestamptz NOT NULL DEFAULT now(),
    ip_hash text                                  -- optional light anti-spam
);

CREATE INDEX idx_scores_completed_at ON scores(completed_at DESC);
```

**Notes**:
- `duration` is stored for validation and potential future analytics.
- `ip_hash` is optional. We can populate it later if needed.
- Use `timestamptz` for reliable "today" filtering across timezones.

---

## 4. Anti-Cheat / Proof Token Design (Detailed)

### Core Principle
The only way to insert a score is through a Supabase Edge Function that holds a secret.

### Flow

1. **Quiz Start** (Timed mode)
   - Generate `session_token = crypto.randomUUID()`
   - Store in `sessionStorage.setItem('cyberminute_session_token', token)`
   - Record `quizStartTime = Date.now()`

2. **Legitimate Quiz Completion**
   - Only show "Submit Score" UI if the quiz ended naturally (timer reached 0 or all questions answered within time).
   - Calculate `duration = Math.floor((Date.now() - quizStartTime) / 1000)`

3. **Submission**
   - User enters name (client-side validation: 1–12 chars, trim).
   - Frontend calls Edge Function with:
     ```json
     {
       "name": "PlayerName",
       "score": 87,
       "duration": 58,
       "session_token": "uuid-here"
     }
     ```

4. **Edge Function Validation** (`submit-score`)
   - Verify `session_token` is present and not recently used (simple replay protection).
   - Validate `duration` is in a reasonable range (e.g., 45–75 seconds).
   - Validate `score` is within plausible bounds for the quiz.
   - (Optional) Generate `ip_hash` from request headers if desired.
   - If valid → insert row using service role key.
   - Return `{ success: true, id: "..." }` or error.

### Security Benefits
- Secret salt / validation logic lives only in the Edge Function.
- Direct table inserts from browser are blocked via RLS.
- Replay protection via session token tracking (simple in-memory or small table).
- Makes casual abuse (curl submissions, dev tools tampering) significantly harder.

### Threat Model (Acceptable for <100 subs/month)
- We are **not** trying to stop sophisticated determined attackers.
- Goal: Stop random people and casual cheaters from flooding the leaderboard.

---

## 5. Implementation Phases (Follow This Order)

### Phase 1: Supabase Foundation
- Create Supabase project
- Create `scores` table + index
- Configure Row Level Security
- Add public `SELECT` policy
- Document anon key + project URL

### Phase 2: Edge Function (submit-score)
- Create Edge Function
- Implement validation logic + proof checks
- Add environment variable for secret
- Deploy and test function in isolation

### Phase 3: Frontend Integration
- Add session token + timing logic in quiz
- Create Leaderboard screen with two tabs
- Add submission UI (only after legitimate Timed completion)
- Add fetch + render functions for leaderboard
- Wire up submission call to Edge Function

### Phase 4: Security Hardening & Polish
- Final RLS review
- Input sanitization
- Error handling + user feedback
- Admin documentation

### Phase 5: Testing & Deployment
- End-to-end legitimate flow
- Negative testing (fake submissions)
- "Today" vs All-time filtering accuracy
- Deploy Edge Function + frontend update

---

## 6. Frontend Considerations

- Use `sessionStorage` for `session_token` (cleared when tab closes — acceptable).
- Never store the secret in the frontend.
- Leaderboard can be fetched on demand (no need for real-time subscriptions at this scale).
- Keep name input strict: `maxlength="12"`, trim on submit, reject empty.
- Show clear feedback after submission (success / error / duplicate name handling).

**Recommended UI Structure**:
- New button on main menu: "View Leaderboard"
- Leaderboard modal or screen with tabs: `All Time` | `Today`
- After Timed quiz ends → "Submit Your Score" section (collapsible or separate)

---

## 7. Row Level Security (RLS) Policies

```sql
-- Allow anyone to read scores (for public leaderboard)
CREATE POLICY "Public can read scores"
ON scores FOR SELECT
USING (true);

-- Block all anonymous inserts (writes must go through Edge Function)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
```

**Important**: The Edge Function will use the **service role key** internally to bypass RLS for inserts.

---

## 8. Admin Workflow

**Primary Method (Recommended)**:
- Supabase Dashboard → Table Editor → `scores` table
- Direct edit, delete, sort, and filter
- No extra code required

**Future Bonus (Low Priority)**:
- Simple password-protected admin page that lists scores with delete buttons (can be added later if desired).

---

## 9. Testing Strategy

### Positive Tests
- Complete 60s quiz legitimately → submit score → appears in leaderboard
- "Today" tab correctly shows only scores from current day
- All-time tab shows historical scores sorted correctly

### Negative / Security Tests
- Attempt direct insert via Supabase client (should fail due to RLS)
- Call Edge Function with invalid/missing `session_token`
- Call Edge Function with unrealistic `duration` (e.g. 10 seconds or 300 seconds)
- Submit with name longer than 12 characters
- Replay same `session_token` quickly

### Edge Cases
- Multiple submissions from same session (decide policy: allow or block?)
- Timezone handling for "Today" filter (use UTC or local? Recommend UTC for consistency)
- Special characters in names (strip or sanitize)

---

## 10. Potential Pitfalls & Guidance

- **RLS mistakes**: Accidentally locking yourself out of reads. Always test public read access first.
- **sessionStorage clearing**: If user refreshes during quiz, token is lost. Consider also storing start time in localStorage with expiry.
- **Edge Function cold starts**: Negligible at this volume.
- **Name uniqueness**: Decide whether to allow duplicate names. Current plan: allow (simple).
- **Score validation bounds**: Define clear min/max possible scores before implementing Edge Function.
- **"Today" filter**: Always calculate "today" in UTC on both client and server for consistency.
- **Supabase keys**: Never commit the service role key. Only the anon key goes to the frontend.

---

## 11. Future Enhancements (Do Not Implement Yet)

- Daily/weekly reset leaderboards
- Country or avatar support
- Rate limiting per IP in Edge Function
- Simple admin page with delete buttons
- Score proof that includes question sequence hash (much stronger but more complex)
- Supabase Realtime for live leaderboard updates

---

## 12. References & Commands

- Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Current CyberMinute repo: https://github.com/Biggest-Chad/CyberMinute

---

## 13. Document Maintenance

This file is the single source of truth for the leaderboard feature.

**Rules for this project**:
- Any major design decision or deviation must be recorded here.
- Before starting new work, re-read the relevant section.
- After completing a phase, update the "Status" and "Last Updated" at the top.
- Keep the plan lightweight but complete.

---

**End of Plan**

When we begin implementation, we will follow the phases in order and update this document as we go.