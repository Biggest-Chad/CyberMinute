# Study Mode Category Selection - Implementation Plan

**Goal**: Add a clean category picker when the user clicks "Casual Study Mode". This lets players focus on specific topics.

**Future Context**: Questions will eventually live in Supabase as a shared question bank across multiple games. This plan prioritizes low-effort changes today while keeping migration easy.

---

## 1. Current State (Post Quick Wins)

- Every question now has a `category` field (5 categories total):
  - "Email Phishing"
  - "Password Security"
  - "Email Scams"
  - "Virus Prevention"
  - "Ransomware"

- In Study mode, a subtle faded category label appears above each question.

---

## 2. Recommended Architecture (Effort-Effective)

### Core Principle
Keep **all filtering logic in one place**.

Create a single helper:

```js
function getStudyQuestions(category = null) {
    if (!category) return [...questions];
    return questions.filter(q => q.category === category);
}
```

This function becomes the **only** place that knows how to select questions for study.  
**Future migration win**: When moving to Supabase, replace the body of this function with an async fetch + filter. Everything else stays the same.

---

## 3. UI Approach: Modal (Recommended)

**Why modal instead of new screen?**
- Lowest effort (reuses existing modal patterns from leaderboard).
- No new screen state management.
- Easy to dismiss.
- Consistent with current "Leaderboard" flow.

**Alternative considered**: Full dedicated `#study-category-screen` (higher effort, more state).

**Decision**: Start with a **modal**. Revisit full screen only if player testing shows it's needed.

---

## 4. Implementation Steps (Prioritized)

### Phase A — Foundation (Low effort, high value)
1. Add `const CATEGORIES = [...]` array near the top of `script.js` (or derive from questions).
2. Create the `getStudyQuestions(category)` helper.
3. Modify `startGame()` signature to accept optional `categoryFilter` (or introduce `startStudyMode(category)` wrapper).

### Phase B — Category Picker Modal
1. Add HTML for the modal (copy structure from `#leaderboard-modal`).
   - Title: "Study Mode"
   - Prominent top button: **"All Categories"** (default)
   - Grid or list of category buttons below (use shortened labels for buttons)
2. Add basic CSS (reuse `.modal`, `.btn` classes + some grid).
3. Wire the existing "Casual Study Mode" button to **open the modal** instead of calling `startGame(true)` directly.
4. On button click in modal:
   - Close modal
   - Call `startStudyMode(selectedCategory)` which does:
     - `currentQuestions = getStudyQuestions(category).sort(() => Math.random() - 0.5)`
     - Set `isStudyMode = true`
     - Proceed with normal game flow

### Phase C — Polish & Edge Cases
- Shortened button labels (e.g. "Phishing", "Passwords", "Email Scams", "Viruses", "Ransomware")
- "All Categories" should be visually prominent (larger, or different color/accent)
- Update the "Study Mode" button on the End Screen (`end-study-button`) to also open the picker (or keep direct for now).
- Remember last selected category? (Nice-to-have, defer)
- Shuffle within category (already done).

---

## 5. Button Label Strategy

| Internal Category     | Recommended Button Text |
|-----------------------|-------------------------|
| (All)                 | All Categories          |
| Email Phishing        | Phishing                |
| Password Security     | Passwords               |
| Email Scams           | Email Scams             |
| Virus Prevention      | Viruses                 |
| Ransomware            | Ransomware              |

Keep the full names in the data layer and in the question category label.

---

## 6. Future-Proofing for Supabase

- All category knowledge lives in:
  - `questions[].category`
  - `getStudyQuestions()`
  - `CATEGORIES` list (for UI)
- When questions move to Supabase:
  - Fetch questions once at load (or on demand).
  - `getStudyQuestions` becomes async and queries the DB (with optional `category` filter).
  - The modal and study flow require almost zero changes.

**Recommendation**: Do **not** hardcode question lists anywhere else after this work.

---

## 7. Effort Estimate

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase A (helper + startGame refactor) | Low | 30-45 min |
| Phase B (modal + wiring) | Medium | 1.5-2.5 hours (most of the work) |
| Phase C (polish) | Low | 30-60 min |
| **Total** | **~3 hours** | Very achievable in one focused session |

---

## 8. Open Questions / Decisions for You

1. Do you want the category picker to also affect the **"Study Mode" button on the End Screen**, or should that one always start "All Categories"?
2. Should we show question counts on the category buttons? (e.g. "Phishing (16)")
3. Any preference on button layout (2-column grid vs vertical stack)?
4. Should selecting a category remember the choice for the next time the user opens Study Mode?

---

**Next Action Recommendation**:
If you want to proceed, say the word and I'll implement **Phase A + Phase B** (the core functionality) in the next pass. The modal + filtering will be working end-to-end.

This keeps the change small, reversible, and ready for the future shared question database.
