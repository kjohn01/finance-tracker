# ADR 0004: The AI turns a question into a query; the app computes the answer

**Status:** Proposed, 12 Nov 2026; revised after review. **Deciders:** product owner (Checkpoint 3).

## Context

Ask your money must answer 18 of 20 test questions with the exact figure a hand calculation gives, on a free allowance, from a provider that does not train on what it is sent. Language models are unreliable at arithmetic, and a transaction history is the most sensitive thing we hold. The allowance is shared by all users, so it must not be spendable by someone who is not a user.

## Decision

- Provider: **Cloudflare Workers AI** on the free plan, called from our Worker through its built-in binding.
- Model: one config value. Leading candidate `@cf/meta/llama-3.3-70b-instruct-fp8-fast`; cheaper candidate `@cf/meta/llama-3.1-8b-instruct`. Both are on the provider's list of models that accept a JSON Schema. The choice is confirmed by running Ghost's 20 questions in English and Chinese.
- The Worker sends the model the question, today's date, the display currency and the category names, and asks for a reply that fits a fixed JSON Schema: measure, filters (category, merchant text, currency, dates), grouping and chart type.
- The provider does not guarantee that a reply fits the schema, so the app validates every reply and treats a bad one as "cannot answer that". A valid reply runs through the same `core` query function the dashboards use. The model never receives transactions and never produces a number.
- **Guarding the allowance.** Both endpoints require a signed-in user with a profile. A question is at most 300 characters, a receipt 4,000, a reply 300 tokens. Before each call one database function checks and counts, in a single step, the user's row for the UTC day (10 questions, 20 receipts) and a shared row for the day (stops at 9,000 Neurons, of which receipts may use 3,000). The function applies the same checks when called directly, so it cannot be used to exhaust the counters.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Structured query, app computes (chosen) | Figures are exact and match the dashboards; history stays private; small prompts; an answer can be pinned because it already is a chart definition | Only questions the query shape can express are answerable |
| Send transactions to the model | Any question | Wrong sums; history leaves the device; one question could use the day's allowance |
| A model running in the browser | Nothing leaves the device | Hundreds of megabytes to download; too slow on a mid-range phone |

## Consequences

- Free allowance: 10,000 Neurons a day, reset at 00:00 UTC (8:00 am in Singapore); beyond it calls fail with an error and nothing is charged. At the published rates a call on the leading model costs about 50 Neurons (about 900 tokens in, 120 out), so roughly 150 to 200 calls a day for everyone. To be measured once the account exists.
- The list of schema-capable models is short and some newer models need a paid billing method, so the choice is narrow. If the leading model is withdrawn, the cheaper candidate is the fallback.
- Pull requests never call the real model: tests replay recorded replies. A weekly run uses the live model.
- Preview deployments do not expose `/api`.
- Request bodies are never logged.
- No second free provider that meets the no-training rule has been verified.

## Sources

- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/data-usage/
- https://developers.cloudflare.com/workers-ai/features/json-mode/
- https://developers.cloudflare.com/workers-ai/platform/limits/
