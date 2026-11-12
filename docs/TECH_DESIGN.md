# Tech design: Finance Tracker

Youkai, 12 Nov 2026. WORK IN PROGRESS: research notes, not yet ready for Checkpoint 3.

## Research notes so far (with sources)

Google OAuth
- Refresh tokens expire after 7 days only when publishing status is "Testing" and scopes go beyond name/email/profile. Source: https://developers.google.com/identity/protocols/oauth2#expiration and https://support.google.com/cloud/answer/15549945
- "In production" unverified apps: unverified-app warning for sensitive/restricted scopes, cap of 100 new users who see that screen. Source: https://support.google.com/cloud/answer/7454865
- Browser token model (Google Identity Services): short-lived access token, no refresh token stored anywhere. Source: https://developers.google.com/identity/oauth2/web/guides/use-token-model
- Not done: a real 8-day test (needs the product owner's Google Cloud project).

Free tiers
- Supabase Free: 500 MB database, 50,000 monthly active users, 5 GB egress, 2 projects, paused after 1 week of inactivity. Source: https://supabase.com/pricing
- Cloudflare Workers Free: 100,000 requests/day, 10 ms CPU, 5 cron triggers; static asset requests free and unlimited. Sources: https://developers.cloudflare.com/workers/platform/limits/ and https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- Workers AI: 10,000 Neurons/day free, resets 00:00 UTC; no training on customer content, no retention after the request. Sources: https://developers.cloudflare.com/workers-ai/platform/pricing/ and https://developers.cloudflare.com/workers-ai/platform/data-usage/
- JSON mode with a JSON Schema is supported on a listed set of models. Source: https://developers.cloudflare.com/workers-ai/features/json-mode/

Exchange rates
- Frankfurter v2 (api.frankfurter.dev/v2): no key, no quota, covers TWD with daily history (live call returned SGD to TWD for 2024-03-15 and today). Source: https://frankfurter.dev
- Fallback: fawazahmed0 currency-api on jsDelivr, CC0, dated URLs, covers TWD (live call checked). Source: https://github.com/fawazahmed0/exchange-api

PDF statements
- Monopoly is now AGPL-3.0-only (changed 17 May 2024, commit 78e560e); it is published as `monopoly-core` 0.23.6. The PyPI package `monopoly-sg` stopped at 0.8.4 and still says MIT. It now supports all six banks including UOB. It relies on pdftotext layout mode and Python regular expressions.
- Spike (outside the repo): pdf.js 6.5 in Node opened a generated two-page statement, plain and locked with RC4-128, AES-128 and AES-256; a wrong password is reported distinctly; lines rebuilt from text positions; all 58 rows parsed with one regular expression and the sum matched the printed total.
