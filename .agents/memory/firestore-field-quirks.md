---
name: Firestore time/date field quirks (SDM app)
description: Non-obvious runtime vs. declared-type mismatches for Firestore time/date fields in the sdm/ church app.
---

# Firestore time/date field quirks (sdm/)

## createdAt / updatedAt are Timestamps at runtime
Models (announcement, event, bulletin, playlist, daily_content) type `createdAt`/
`updatedAt` as `z.any()` / `unknown`. At runtime, reads return Firebase
`Timestamp` objects (writes use `serverTimestamp()`), NOT strings or Dates.

**Why:** Formatting these directly (e.g. passing to `new Date(value)` or the shared
`formatDate`) silently produces "Invalid Date" because a Timestamp is none of
string|number|Date.

**How to apply:** Before formatting any model `createdAt`/`updatedAt`, normalize
with a guard that handles `Timestamp` (`.toDate()` / `.seconds`) plus string/number/
Date. See `sdm/features/home/lib/home-format.ts` → `toDateSafe`.

## QTEntry type omits the `date` field used by its own queries
`sdm/types/qt.ts` `QTEntry` has `createdAt: string` / `updatedAt: string` but NO
`date` field. Yet `qtService` queries `orderBy("date")` / `where("date","==")`, so
Firestore docs DO carry a `date` (YYYY-MM-DD) field that the type hides.

**Why:** Streak/calendar logic needs the day key; relying on `createdAt` is fragile
because writes set it via `serverTimestamp()` (a Timestamp, not the ISO string the
type claims).

**How to apply:** Read the day via a narrow cast `(entry as unknown as { date?: unknown }).date`,
falling back to `createdAt`, then normalize. See `useActivityStreak.ts`.
