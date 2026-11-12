# ADR 0005: Every figure is computed in the browser from one loaded list of transactions

**Status:** Proposed, 12 Nov 2026; revised after review. **Deciders:** product owner (Checkpoint 3).

## Context

The design's rule is "one number, everywhere": charts, insights, the month in review and Ask answers must agree in every display currency. Demo mode must show the whole app with no account. Editing a transaction must show everywhere without a reload.

## Decision

After sign-in the app loads the user's transactions and the rate table once, keeps them in memory, and a single pure module (`core`) computes every figure from them. The database stores and protects rows; it does not compute.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Compute in the browser (chosen) | One implementation, tested once, used by every screen and by demo mode; edits show instantly; works offline once loaded | The first load grows with history; a ceiling of roughly 20,000 rows per user on a mid-range phone |
| Compute in the database (SQL views and functions) | Scales to any history | Every figure exists twice (SQL for real data, TypeScript for demo), and the two drift; each chart costs a round trip |

## Consequences

- Loading is paged (the database returns at most 1,000 rows a request), cached on the device, and later starts fetch only rows changed or deleted since the last load. Automatic refetch on window focus is off. Without this, 100 users reloading full histories would exhaust the 5 GB monthly egress before any phone struggled.
- The cache is cleared on sign-out and on account deletion.
- `core` never reads the clock; today's date is passed in, so every figure can be tested at a fixed date.
- The two store adapters are held to one shared contract test, so the demo store enforces the same rules (unique fingerprint, kinds) as the database.
- Demo mode and real mode differ only in where the list comes from.
- Ghost's "matches a hand calculation" tests run as fast unit tests against `core`.
- If a user outgrows the ceiling, `core` keeps its interface and the store loads by date range, with sums pushed into database functions. That is a contained change, but it is the reason this record exists.
