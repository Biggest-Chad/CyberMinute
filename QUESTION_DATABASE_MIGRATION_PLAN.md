# QUESTION_DATABASE_MIGRATION_PLAN.md

**Goal**: Move CyberMinute questions from a hardcoded client-side array into a centralized Supabase database, creating a single source of truth that can power multiple games, quizzes, or applications.

**Status**: Implementation complete in origin (fetchQuestions + fallback live)  
**Date**: June 2026  
**Owner**: Big Chad + Hermes Agent  
**Test Environment**: All migration work will be developed and tested in the `CyberMinute2` repository. The main `CyberMinute` repo will remain untouched until the migration is stable and ready for production.

---

## 1. Current State

- 71 questions stored as a `const questions = [...]` array in `script.js`.
- Each question: `{ question: string, answer: boolean, category: string }`
- 5 categories currently used.
- `getStudyQuestions(category)` already contains this comment:  
  > "Future: When questions live in Supabase, replace the body of this function."
- Supabase project `sbqjdgrchsbvfwgodhmt` is already live (leaderboard + Edge Function infrastructure exists).
- All question content and logic must remain **100% unchanged** during migration.

**Problems with current approach**:
- Every app/quiz must maintain its own copy of the questions.
- Updates require redeploying every frontend.
- No easy way to add metadata without touching code.
- No admin-friendly way to manage questions over time.

---

## 2. Vision & Success Criteria

**Primary Objective**: One master list of questions in Supabase that multiple applications can consume.

**Success Criteria**:
- All current quiz behavior (Timed + Study Mode) works identically after migration.
- Adding/editing/deactivating a question updates all consuming apps automatically.
- Strong fallback so the quiz never breaks due to network issues.
- Clean separation between "question data" and "game logic".
- Foundation ready for future apps.

---

## 3. Recommended Architecture (Locked)

**Database**: Supabase (Postgres)

**Access Layer**: **Direct Supabase REST** using the anon key from the frontend (same pattern currently used for the leaderboard).

**Rationale** (per decision):
- Questions are not confidential.
- Matches existing leaderboard data fetching pattern.
- Simpler and faster to implement for this use case.
- No need for an additional Edge Function at this stage.

---

## 4. Database Schema (Locked)

```sql
CREATE TABLE public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question text NOT NULL,
    answer boolean NOT NULL,
    category text NOT NULL,
    difficulty text DEFAULT 'medium',           -- easy | medium | hard
    study_notes text,                           -- For Study Mode explanations
    is_active boolean DEFAULT true,

    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

**Key points**:
- `difficulty` defaults to `'medium'` for the initial import.
- `study_notes` added to support richer Study Mode content later.
- No `tags[]`, `source`, or other fields at this time (kept minimal per decisions).
- `is_active` for soft disabling questions without deletion.

**Indexes** (recommended):
- `category`
- `is_active` (partial index where true)

---

## 5. High-Level Migration Phases

| Phase | Focus                              | Key Deliverables                                      | Risk   |
|-------|------------------------------------|-------------------------------------------------------|--------|
| 1     | Schema & Seeding                   | Table + all 71 questions imported (with difficulty + study_notes) | Low    |
| 2     | Access Layer                       | Frontend direct REST queries + proper error handling  | Low    |
| 3     | Frontend Integration (Safe Mode)   | `fetchQuestions()` with local fallback           | Medium |
| 4     | Study Mode & Filtering             | Update `getStudyQuestions()` to use DB + difficulty   | Low    |
| 5     | Hardening & Polish                 | Simple caching, graceful degradation, testing         | Low    |
| 6     | Cleanup & Cutover                  | Remove local fallback + documentation                 | Low    |

**Golden Rule**: The local `questions` array **must** remain as a fallback for at least 2–4 weeks after the feature is live in production.

---

## 6. Locked Decisions

| # | Decision                  | Chosen Option                          | Notes |
|---|---------------------------|----------------------------------------|-------|
| 1 | Access Method             | **A** – Direct Supabase REST (anon key) | Same pattern as leaderboard score recovery. Questions are not sensitive. |
| 2 | Schema Richness           | Expanded as specified                  | Fields: `id`, `question`, `answer`, `category`, `difficulty` (default medium), `study_notes`, `is_active` |
| 3 | Question Management       | **A** – Supabase Dashboard + CSV bulk import | No admin UI planned initially. |
| 4 | Caching Strategy          | **A** – Simple in-memory + short localStorage TTL | Keep it lightweight. |
| 5 | Multi-App Readiness       | **A** – Keep schema simple for now     | Schema already covers future needs per Decision 2. |
| 6 | Migration Safety          | **Strongly A** – Keep local fallback 2–4 weeks | Conservative approach required. |

---

## 7. Development Strategy (Updated 2026-06-01)

- All migration work is now being done **directly in the origin repository** (`/root/CyberMinute`).
- The `CyberMinute2` fork is no longer the primary development target.
- The fetchQuestions implementation was first proven in CyberMinute2, then ported to origin following Option A (incremental + strong local fallback).

---

## 8. Non-Goals (for now)

- Building any admin UI for questions
- Adding `tags[]` or advanced filtering fields
- Difficulty-based question selection logic
- Real-time question updates during a game
- Moving any other existing features (leaderboard, etc.)

---

## 9. Risks & Mitigations

- **Network failure during quiz** → Strong local fallback (the current array) remains until Phase 6.
- **Breaking existing behavior** → Strong local fallback always present. Changes were first validated in a fork then ported.
- **Data drift during import** → One-time seed script + verification step (compare counts + spot checks).
- **Over-engineering** → We are staying deliberately simple per the locked decisions.

---

## 10. Status & Next Steps (Updated 2026-06-01)

**Completed:**
- Supabase table created and seeded with 71 questions (3 merged categories).
- RLS + anon SELECT policy applied and verified working.
- `fetchQuestions()` + local fallback implemented in origin.
- `getStudyQuestions()` updated.
- `startGame()` made async with proper awaiting.
- CATEGORIES reduced to 3 to match DB.
- Preload + error handling added.
- Penalty scoring already live in production.

**Current State:** The origin repository now has fully functional DB-backed question loading with the same strong local fallback that was proven in CyberMinute2.

**Next Steps:**
1. Commit and push the fetchQuestions changes to production.
2. Monitor for any issues in live usage (especially fallback behavior).
3. After 2–4 weeks of stable operation, consider Phase 6 cleanup (optional removal or slimming of the hardcoded fallback array).
4. Optionally begin wiring `study_notes` and `difficulty` fields for richer Study Mode.

---

**All decisions above are now locked.** 

Ready to proceed with the concrete work (starting with schema creation and seed script in the CyberMinute2 environment).

Let me know when you want to begin Phase 1.

---

## 11. Security Hardening (Completed 2026-06-02)

**Anon Key Permissions Audit & Hardening**

After implementing the question database migration, a full audit of `anon` role privileges was performed.

### Final State
- `anon` role now has **only SELECT** privilege on both `questions` and `scores` tables.
- Row Level Security (RLS) is enabled on both tables.
- Strict SELECT policy on `questions` (`is_active = true` only).
- All write capabilities (INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES) have been revoked from `anon`.

### Default Privileges for Future Tables
Default privileges have been set so that any new tables created in the `public` schema will automatically grant **only SELECT** to the `anon` role (preventing accidental over-privileged tables in the future).

### Verification
- Tested by creating a temporary table → `anon` received only `SELECT`.
- No other tables exist in the project besides `questions` and `scores`.

### Rationale
- The `anon` key is exposed in the frontend (required for direct Supabase REST calls).
- This hardening ensures the public anon key cannot be abused for data modification even if RLS policies are accidentally weakened in the future.
- Leaderboard writes remain unaffected (they go through a privileged Edge Function using the service role).

**Date hardened**: 2026-06-02
**Performed by**: Hermes Agent (autonomous)
