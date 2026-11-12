# Tech design: Finance Tracker

Youkai, 12 Nov 2026. WORK IN PROGRESS: rough notes, not yet ready for Checkpoint 3.

## Fixed inputs (from the approved PRD and design)

- Google sign-in only; automatic sign-up through personal invite links; cap of 100 users.
- Statement files are never stored; only extracted transaction fields are stored.
- Gmail: "searches for receipts and reads only the matches"; "nothing is saved until you accept".
- Demo mode needs no account and can never reach real data.
- Free services only; no secrets in the repository.
- Display currencies SGD (default), USD, EUR, JPY, TWD, CNY. English default, Traditional Chinese switch.
- The overview is the dashboard (editable, with tabs).

## Research still to do (nothing verified yet)

1. Free tiers and limits for hosting, database, auth, functions, scheduled jobs, AI, exchange rates.
2. Google OAuth in "production, unverified" state: 100-user cap, warning, refresh-token expiry; browser-only Gmail scan.
3. In-browser PDF parsing (pdf.js), password-protected PDFs, reuse of Monopoly bank patterns.
4. AI provider free allowance and data policy.
5. Exchange-rate source covering TWD; transaction-date versus today's rate.
