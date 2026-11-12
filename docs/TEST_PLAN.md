# Test plan: Finance Tracker

Ghost, 12 Nov 2026. Covers release 1 (the 16 must-haves in [`PRD.md`](PRD.md)) as built by [`TECH_DESIGN.md`](TECH_DESIGN.md). Words follow [`GLOSSARY.md`](../GLOSSARY.md). Items marked **(open)** depend on a finding in Ghost's review on pull request 3 and are settled before the first test that needs them.

## 1. Levels, tools and when they run

| Level | Tool | What it is for | Runs |
| --- | --- | --- | --- |
| Static | TypeScript strict, ESLint (module boundary rules), translation-key check, secret scan, bundle-size check | Stop whole classes of defect before a test runs | Every pull request |
| Unit | Vitest | `core` (money, conversion, recurring, insights, queries, review, CSV), bank rules, receipt rules. Every "matches a hand calculation" figure is proved here, with property tests for conversion and rounding | Every pull request |
| Contract | Vitest | One shared suite run against both `DataStore` adapters (demo, Supabase), and against each fake and its real counterpart's recorded replies, so the fakes cannot drift | Every pull request |
| Database | pgTAP on local Supabase | Row-level security with two users on every table, `redeem_invite` (including 20 parallel sign-ups for the last place), `delete_my_account`, `consume_ai_allowance`, constraints | Every pull request |
| Acceptance | Playwright (Chromium, 375 px and 1280 px), axe-core | The 16 PRD criteria, through the real interface, on a test build with fakes and local Supabase | Every pull request |
| Visual | Playwright screenshots, method of `design/screenshots/capture.js` | Layout drift against an approved baseline | Every pull request (15 screens); full matrix nightly |
| Live checks | Playwright, scripts | Smoke test of the deployed app; live exchange-rate sources; the 20 Ask questions and the hard receipts against the real model; Lighthouse on the live URL; WebKit and Firefox runs | After each deploy (smoke); nightly (the rest; live AI weekly and on any prompt or model change, because it spends the shared allowance) |
| Manual | Checklist in the final report | What a machine cannot prove: real Google sign-in and warning screen, install on a real iPhone and Android phone, screen reader, 200% zoom, the product owner's real statements | Each milestone and at release |

Target shape: many unit tests, about 40 acceptance tests, a short manual list. A pull request's whole pipeline must finish in under 10 minutes; anything slower moves to nightly.

**Fakes and hooks the build must provide** (requested in the review): clock set through Playwright's clock (the app reads time only through one `today()` in `core`); `GmailClient` fixtures adapter; `AskClient` and receipt adapter replaying recorded model replies; a fixed rate table; seeded users through local Supabase test sign-in (never enabled in production); adapters chosen at build time, not by a switch a visitor can flip.

## 2. Requirement to acceptance test

Ghost writes each test before Youkai builds the feature; it lands marked "expected to fail" with the requirement number, and the pull request that completes the requirement removes the mark. Youkai does not edit files under `e2e/` or `fixtures/`. Files are `e2e/acceptance/NN-name.spec.ts`.

| # | Test | Level | Fixtures and fakes |
| --- | --- | --- | --- |
| 1 | `01-demo-mode`: every route renders with data and no console error; zero network requests to Supabase, Google or `/api`, also when a real session is in storage | Acceptance | Demo store, fixed clock, network recorder |
| 2 | `02-signup-invite-cap`: no invite and bad invite refused; place 100 accepted, 101st refused with the approved message; onboarding reaches the overview in at most 6 actions; user B reads and writes none of user A's rows | Database + acceptance | Local Supabase, counter seeded at 99, two test users |
| 3 | `03-account-privacy`: after delete, zero rows in every table that has a `user_id` (list read from the schema, so new tables are covered) and no sign-in record; a still-valid session can write nothing; after disconnect, zero Gmail requests; hide amounts leaves no digit readable in text, charts or accessible names | Database + acceptance | Seeded user with rows in every table, Gmail fake with request log |
| 4 | `04-transactions`: add, edit, delete; the edit changes the list, overview sentence and donut without reload; survives sign-out and sign-in; search and filters | Acceptance | Local Supabase, data set A |
| 5 | `05-currencies`: for each of the six display currencies every figure on the overview equals the expected file; rates fetched within 24 hours of the fixed clock **(open: criterion wording)** | Unit + acceptance | Data set A, fixed rate table, fake rate source for the job |
| 6 | `06-languages`: key parity check; every route in both languages contains no key-shaped or English-only text; choice persists | Static + acceptance | Demo store, allow-list of proper nouns |
| 7 | `07-statements`: per bank and statement type, every row imported and the sum equals the printed total; locked file asks for the password; same file twice, and an overlapping file, add nothing; no request body ever contains file bytes | Unit + acceptance | Synthetic statements (section 3), network recorder |
| 8 | `08-gmail-scan`: at least 27 of 30 sample emails give the right merchant, amount, currency and date; database unchanged until accept; second scan asks only for newer mail; closing before review loses nothing **(open)** | Unit + acceptance | Sample email set, Gmail fake, recorded receipt replies |
| 9 | `09-categories`: correcting one transaction files the merchant's next import under the new category; past ones change only on request | Acceptance | Data set A, a second statement |
| 10 | `10-recurring`: monthly charge over 3 months flagged with the right next date, including month-end and 29 to 31 day cases; two charges only, or irregular gaps, not flagged | Unit + acceptance | Data set R, fixed clock |
| 11 | `11-overview-figures`: every figure in every default chart equals `expected-figures.json` | Unit + acceptance | Data set A, fixed clock and rates |
| 12 | `12-insights`: each of the four insights appears for its trigger set and none for the quiet set; values just under each threshold stay quiet | Unit + acceptance | Data sets I1 to I4 and Q |
| 13 | `13-custom-dashboards`: create, add, resize, reorder; a second browser context (another device) shows the same layout | Acceptance | Local Supabase |
| 14 | `14-ask`: at least 18 of 20 questions give the hand-calculated figure from recorded model replies; used-up state shown and every other screen still works; a signed-in account without a profile is refused | Unit + acceptance; live weekly | 20 questions, recorded replies, fake allowance |
| 15 | `15-month-in-review`: each card's figure equals the overview for that month; opens by itself on the 1st, once | Acceptance | Data set A, clock at the 1st |
| 16 | `16-export-roundtrip`: export, import into an empty account, identical totals in all six currencies and identical row count; cells starting with `=`, `+`, `-`, `@` are made safe | Acceptance | Data set A with hostile merchant names |

**Criteria that cannot be automated as written** and how each is treated: "under 2 minutes" and "within 5 minutes" (2) are proved by step count and machine time, then timed by hand at release; "each of the six banks" (7) is automated on synthetic files and checked against real samples off-repository, and a bank with no real sample is reported as unverified; "18 of 20" (14) runs on recorded replies per pull request and against the real model weekly; "rates no more than 24 hours old" (5) is read as "fetched within 24 hours", since no source publishes at weekends; "accessibility scores 90" is a Lighthouse score, with axe as the stricter gate; "80% arrive by scan or upload" and "monthly cost 0" are measured by the product owner at release.

## 3. Test data

All generated by scripts in `fixtures/` from a fixed seed; nothing is typed by hand into two places.

- **Data set A, "hand calculation".** About 220 transactions over 1 Aug to 31 Oct 2026, clock fixed at 24 Oct 2026 12:00 Singapore time. Covers all six currencies, income and expenses, a refund, a card payment between own accounts, two identical charges on one day, transactions on the first and last day of a month and at 00:30 Singapore time, a leap-day variant, and a currency with a missing rate day. `expected-figures.json` is calculated independently in a spreadsheet committed beside it (`data-set-a.xlsx`), never by calling `core`, and reviewed by Fairy. Rates are a fixed table, not live.
- **Rounding rule assumed (open):** each transaction is converted at its own date's rate and kept unrounded; a figure is rounded once, half away from zero, when displayed; parts of a whole are adjusted by largest remainder so they add up to the displayed total.
- **Ask questions.** 20 in `fixtures/ask/questions.json`: 12 English, 8 Traditional Chinese; totals, category, merchant, currency, date ranges ("last month", "in March", "this year"), comparisons, two that the query shape cannot express (the correct answer is the polite refusal). Each has the expected figure from data set A and a recorded model reply.
- **Sample emails.** 30 synthetic messages in Gmail API format, written from the structure of common receipts (ride hailing, food delivery, app stores, streaming renewals, airlines, online shops), in English and Chinese, five currencies, plus 10 that are not receipts (newsletters, shipping notices, a refund, a phishing lookalike) which must produce no find. No real email is committed.
- **Synthetic statements.** For each bank and statement type: the product owner's real file is opened locally, outside the repository; a script dumps the text items with their positions, then replaces every name, address, account and card number, merchant and amount with generated values of the same shape and recomputes the printed totals. The committed fixture is that layout dump plus a PDF regenerated from it, in plain and password-locked forms. The script fails if any string from the original remains, and the secret scan blocks card-number and NRIC patterns. Real files stay in a folder ignored by git; `npm run verify:real` runs the same assertions on them locally and reports only pass or fail and row counts, recorded in the milestone report.

## 4. Non-functional checks

| Check | Gate |
| --- | --- |
| Accessibility | axe: no serious or critical violation on any route, both themes, 375 px (every pull request). Lighthouse accessibility at least 90 on every route (nightly). Keyboard-only run of the five main flows (acceptance). Screen reader and 200% zoom (manual, per milestone) |
| Performance | Overview readable in under 2 seconds with 5,000 transactions, Chromium at 4x CPU slow-down and fast 4G, warm and cold (nightly, trend kept). First-load script at most 200 KB compressed; PDF reader, drag library and Ask loaded only when used (every pull request). `runQuery` on 20,000 rows under 50 ms (unit) |
| 375 px layout | No horizontal overflow and no control under 44 px on any route (every pull request) |
| Languages, currencies, themes | Full matrix nightly: 2 languages x 6 currencies x 2 themes on the overview, 2 x 2 on all other routes. Per pull request: English SGD light everywhere, plus Chinese EUR dark on the overview |
| Visual baseline | The 15 committed prototype screenshots are the reference for look; the app's own baseline is captured with the same script settings once Jinni approves each screen. Difference above 0.5% of pixels fails; a baseline changes only in a pull request Jinni has commented on |
| Security | Content security policy violations fail any acceptance test; production smoke test confirms email and anonymous sign-in are off and `/api` refuses a request without a profile; secret scan on every pull request |
| Free-tier headroom | Nightly report of database size, egress, Worker requests and AI use against the limits; warn at 70% |

## 5. Review procedure for every pull request

1. **Gate.** All checks green and the branch up to date. No change under `e2e/` or `fixtures/` by Youkai; no skipped or weakened test.
2. **Spec compliance first.** The requirement's acceptance test passes unedited. Ghost opens the preview and tries the criterion and its edge cases by hand at 375 px, in Chinese and in dark theme. Screen and wording match the prototype and the glossary. Nothing outside the PRD was added.
3. **Code quality second.** Correctness (money stays whole numbers, dates stay dates, errors handled, imports repeatable). Security (new table has a security rule and a database test; nothing private in logs or the bundle). Efficiency (no repeated loads, no work in render that belongs in `core`, bundle budget). Maintainability (module boundaries respected, one implementation of each figure, names from the glossary, tests for new logic, no dead code).
4. **Verdict.** One comment starting "Review by Ghost (QA)" with APPROVED or CHANGES REQUESTED, the commit reviewed, and findings marked BLOCKING, SHOULD or NOTE. Fixes go back to Youkai; Ghost re-reviews the new commit.

**Merge rule.** All agents share one GitHub account, so GitHub cannot require a second approver. Instead: Youkai never merges; Phaethon merges only when the latest "Review by Ghost (QA)" comment says APPROVED and names the head commit, and all checks are green. A required check, `review-recorded`, fails unless such a comment exists for the head commit, so a later push cancels the approval. For Ghost's own test-only pull requests, Youkai is the reviewer.

## 6. Definition of done

**A feature** is done when: its acceptance test passes unedited in CI; unit and database tests cover the new logic and rules; axe, 375 px, both languages and both themes pass; budgets hold; Ghost's review says APPROVED; it is merged, deployed, and the live smoke test passes; documents and glossary are updated if behaviour changed.

**Release 1** is done when: all 16 acceptance tests pass on `main` with none skipped; the nightly matrix has been green for three nights; the manual checklist is complete on a real iPhone and Android phone; each bank is marked verified against a real sample or reported as unverified; the live Ask run scores at least 18 of 20; Lighthouse accessibility is at least 90 and the 2-second budget holds; no BLOCKING finding is open; Ghost's final report is committed, Fairy has checked it against the PRD, and the product owner has tried the live app.
