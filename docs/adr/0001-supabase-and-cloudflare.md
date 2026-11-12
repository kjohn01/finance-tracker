# ADR 0001: Supabase for data and sign-in, one Cloudflare Worker for everything else

**Status:** Proposed, 12 Nov 2026; revised after review. **Deciders:** product owner (Checkpoint 3).

## Context

Running cost must be zero. The app needs Google sign-in, a database where one account can never read another's data, a daily job, a small API for AI calls, and static hosting. Several developers must be able to work without sharing server code.

## Decision

- **Supabase** (free plan) for Postgres and Google sign-in. Isolation is enforced by row-level security in the database.
- **One Cloudflare Worker** (free plan) serves the static site, the `/api` routes and the daily Cron Trigger.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Supabase and Cloudflare (chosen) | Isolation enforced by the database; sign-in is configuration, not code; site, API and job in one deploy; the AI is a built-in binding | Two accounts; Supabase pauses projects with low activity in 7 days; no backups on the free plan |
| Cloudflare only (D1 database, own sessions) | One account; never pauses | We would write sign-in and every access check by hand; one mistake leaks data between users |
| Firebase | One account, mature sign-in | Document database suits sums and filters poorly; server functions need a billing account |
| Supabase only (Edge Functions, GitHub Pages) | One fewer deploy target | AI would need a long-lived Cloudflare token stored in Supabase; scheduled jobs are more awkward |

## Consequences

- The browser talks to the database directly, so every table needs a security rule and a test for it. This is checked in CI with two users.
- The free plan has no backups and allows two projects. The second project is used as staging: migrations run there first, and a copy of the live database is saved to its private storage before every migration and weekly. Copies are never uploaded as workflow artifacts, which are public on this repository.
- Free egress is 5 GB a month, so the app pages, caches and fetches only changes (ADR 0005).
- Sign-in settings are kept in the repository. Email, password and anonymous sign-in stay off in the live project, checked after every deploy.
- A free Worker has 10 ms of CPU and 50 outgoing requests per run, so loading rate history is a one-off script, not the scheduled job.
- The daily rates job doubles as activity that should keep the project from pausing. If it is paused anyway, restoring is one click in the dashboard.
- Moving off Supabase means replacing sign-in and the store adapter; the schema is plain Postgres. Moving off Cloudflare means re-hosting static files and three small handlers.
- Never enable Workers Paid: on the free plan, exceeding a limit returns an error and nothing is charged.

## Sources

- https://supabase.com/pricing (500 MB database, 5 GB egress, 50,000 monthly users, 2 projects, paused after 1 week of inactivity)
- https://supabase.com/docs/guides/deployment/going-into-prod ("may pause applications on the Free Plan that exhibit low activity in a 7-day period")
- https://supabase.com/docs/guides/platform/backups (daily backups start at the Pro plan)
- https://developers.cloudflare.com/workers/platform/limits/ (100,000 requests a day, 10 ms CPU, 5 Cron Triggers)
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ (static asset requests free and unlimited)
- https://docs.github.com/en/billing/concepts/product-billing/github-actions (standard runners free for public repositories)
