# ADR 0004: The AI turns a question into a query; the app computes the answer

**Status:** Proposed, 12 Nov 2026. **Deciders:** product owner (Checkpoint 3).

## Context

Ask your money must answer 18 of 20 test questions with the exact figure a hand calculation gives, on a free allowance, from a provider that does not train on what it is sent. Language models are unreliable at arithmetic, and a transaction history is the most sensitive thing we hold.

## Decision

- Provider: **Cloudflare Workers AI** on the free plan, called from our Worker through its built-in binding.
- The Worker sends the model the question, today's date, the display currency and the category names, and requires a reply that fits a fixed JSON Schema: measure, filters (category, merchant text, currency, dates), grouping and chart type.
- The app validates that reply and runs it through the same `core` query function the dashboards use. The model never receives transactions and never produces a number.
- The Worker counts calls per user per day and stops before the daily allowance is spent.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Structured query, app computes (chosen) | Figures are exact and match the dashboards; history stays private; small prompts, so more questions per day; an answer can be pinned as a chart because it already is a chart definition | Only questions the query shape can express are answerable; others get "try building a chart" |
| Send transactions to the model and let it answer | Any question | Wrong sums; history leaves the device; one question could use the whole day's allowance |
| A model running in the browser | Nothing leaves the device | Download of hundreds of megabytes; too slow on a mid-range phone |

## Consequences

- Free allowance: 10,000 Neurons a day, reset at 00:00 UTC; beyond it calls fail with an error, and nothing is charged on the free plan. At our estimate of about 50 Neurons a call, that is about 200 calls a day shared by all users. The estimate must be measured once the account exists.
- The model id is one configuration value. Model choice is confirmed by running Ghost's 20 questions, in English and Chinese, against two or three candidates that support JSON Schema output.
- The query shape is shared with custom dashboards, so both improve together.
- No second free provider that meets the no-training rule has been verified. When the allowance is spent, Ask shows the approved "used up" state.

## Sources

- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/data-usage/ ("does not use Customer Content processed by Workers AI to train AI models"; inputs and outputs not retained after the request)
- https://developers.cloudflare.com/workers-ai/features/json-mode/
- https://developers.cloudflare.com/workers-ai/platform/limits/
