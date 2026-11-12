# Data model and rules

Appendix to [`TECH_DESIGN.md`](../TECH_DESIGN.md). Youkai, 12 Nov 2026, revised after the reviews by Ghost and Jinni. Ghost writes tests from this file; a change here needs a pull request.

## 1. Tables

Every user table has `user_id` and the same rule: **a signed-in user who has a profile can read and write only rows where `user_id` is their own id.** "Signed in" alone is never enough. References to the user cascade on delete, with one exception noted below.

| Table | Key columns | Access |
| --- | --- | --- |
| `profiles` | `user_id`, `display_currency`, `language`, `theme`, `hide_amounts`, `invited_by`, `gmail_connected`, `scan_reviewed_to`, `scan_back_to`, `last_review_seen` | Read own row. Update only the setting columns (currency, language, theme, hide amounts, review seen, scan fields). `invited_by` is **set to null** when the inviter is deleted, never cascaded. Created only by `redeem_invite`. |
| `invites` | `code`, `owner_id` (null for the founder invite), `created_at`, `revoked_at`, `single_use` | No direct access. Read and changed only through the invite functions (section 3). |
| `signup_counter` | one row: `total` | No direct access. |
| `accounts` | `id`, `user_id`, `bank`, `kind` (card, deposit), `label` (for example "DBS card ending 4444"), `account_key` (hash of the full number) | Own rows. A card or bank account that statements came from. The full number is never stored. |
| `transactions` | `id`, `user_id`, `occurred_on` (a calendar date), `kind` (expense, income, refund, transfer), `amount_minor`, `currency` (original), `billed_minor`, `billed_currency` (what the bank charged, when known), `merchant`, `description`, `category`, `source` (manual, statement, csv, gmail), `account_id`, `import_id`, `fingerprint`, `updated_at` | Own rows. Insert and update directly; **delete only through `delete_transactions`**. Unique on (`user_id`, `fingerprint`). |
| `seen_fingerprints` | `user_id`, `fingerprint`, `reason` (rejected, deleted, merged), `transaction_id` | Own rows, read only. Written by the import and delete functions. Stops a rejected find, a deleted row or the second half of a merged pair from coming back. |
| `transaction_deletions` | `user_id`, `transaction_id`, `deleted_at` | Own rows, read only. Lets another device learn that a row was deleted. Pruned after 90 days. |
| `imports` | `id`, `user_id`, `kind`, `account_id`, `period`, `file_hash`, `row_count`, `total_minor` | Own rows, read only. Written by `import_rows`. Never the file. |
| `category_rules` | `user_id`, `merchant_key`, `category`, `kind` | Own rows. |
| `dashboards` | `id`, `user_id`, `name`, `position`, `charts` (JSON, schema-checked, version-stamped) | Own rows. One saved layout drives both the desktop grid and the phone chips. |
| `insight_dismissals` | `user_id`, `insight_key` | Own rows. |
| `ai_usage` | `user_id`, `day` (UTC), `ask_calls`, `receipt_calls` | Read own. Written only by `consume_ai_allowance`. |
| `ai_usage_global` | `day` (UTC), `neurons` | No direct access. |
| `exchange_rates` | `rate_date`, `currency`, `per_sgd` (decimal), `source`, `fetched_at` | Read by users with a profile. Written only by the daily job. |

Recurring charges, insights and the month in review are computed, not stored. The category list is fixed in code and translated.

**Limits against abuse or a runaway bug.** Text columns have length limits (merchant 120, description 500, dashboard name 60). `dashboards.charts` is at most 32 KB and a user has at most 20 dashboards. A user has at most 50,000 transactions. Every function that runs with elevated rights has a fixed search path and cannot be executed by signed-out visitors, except `invite_status`.

## 2. Transaction kinds

| Kind | Meaning | In measures |
| --- | --- | --- |
| expense | Money out to someone else | Adds to spending |
| income | Money in from someone else | Adds to income |
| refund | Money back from a merchant for an earlier expense | **Reduces spending in its category, in the month the refund arrives.** Never income. (Product owner decision D8.) |
| transfer | Money moved between the user's own card and bank accounts, including paying a card bill | Excluded from every measure, chart, insight and story |

`amount_minor` is always positive; the kind gives the sign.

Bank rules set the kind when a statement is read:

- **Card statement.** A credit whose description matches the bank's payment wording ("PAYMENT - THANK YOU", GIRO or FAST payment received) is a transfer. Any other credit is a refund.
- **Deposit statement.** A debit that pays a card issuer's bill, or moves money to an account number already in the user's `accounts`, is a transfer. A matching credit from an own account is a transfer.
- A row the rules are unsure about is marked in the preview and the user picks the kind. Correcting a kind teaches a rule for that merchant, as categories do.
- Typed entries and Gmail finds default to expense; the edit sheet offers all four kinds.

## 3. Invites and places

- **Every user has one invite link. It is reusable**: any number of people can use it until the 100 places are gone. (Decision D10.)
- **It can be regenerated** in Settings. The old link stops working at once; accounts already created through it are untouched.
- The code is 16 random characters from a 32-character alphabet (80 bits), so it cannot be guessed. In addition, a sign-in record gets at most 5 failed redemptions an hour.
- **`invite_status(code)`** can be called before signing in and answers only `ok`, `invalid` or `full`. The app calls it on the invite page **before the Google button is shown**, so a full or invalid invite is refused before anything about the visitor exists.
- **`redeem_invite(code)`** runs after Google sign-in, in one transaction: if the caller already has a profile it returns success and uses no place (two tabs, a retry after a timeout); otherwise it checks the code, locks `signup_counter`, refuses at 100, increments, and creates the profile. **If it refuses, it deletes the caller's sign-in record itself**, so the rare race (the last place went between the check and the sign-in) leaves nothing behind without relying on the app.
- The daily job deletes sign-in records that have had no profile for more than an hour.
- `signup_counter.total` never goes down. Deleting an account does not return a place (decision D3).
- **The first user.** The product owner runs one script once after the first deploy. It creates a single-use founder invite and prints the link. It refuses to run if any profile exists.

## 4. Fingerprint

A fingerprint identifies "this row from this source" so the same row is never added twice. It is computed once, in the browser, when a row is first read, and **never recomputed**: editing the amount, date or description of a transaction leaves it unchanged.

| Source | Fingerprint is a hash of |
| --- | --- |
| Statement (PDF) or bank CSV | user id, account key, date, amount, currency, credit or debit, the raw description with spaces collapsed, and **the row's position among rows identical in all of those** on that date (1, 2, 3…) |
| Gmail find | user id, the Gmail message id, and the item's position in that email |
| Typed by hand | a random value |
| Our own CSV export | the fingerprint column in the file, so a re-import is exact |

- Two real identical rows (two $1.09 bus fares on one day) get positions 1 and 2 and both import. Uploading the file again produces the same two fingerprints and adds nothing.
- The same amount on two cards on one day differs by account key.
- Deleting an imported transaction, including through the "possible duplicate" insight, records its fingerprint in `seen_fingerprints`, so an overlapping upload does not bring it back. Undo removes that record.
- A statement PDF and a CSV of the same account may word descriptions differently and so get different fingerprints. Those pairs are caught by matching (section 5).

**Import is one database call.** `import_rows(import, rows)` writes the `imports` record and the rows together, skipping any fingerprint already in `transactions` or `seen_fingerprints`. Calling it twice has the same result as once. Accept-all on finds uses the same function.

## 5. Matching the same purchase from two sources

Most online purchases arrive twice: a receipt in Gmail and a line on a statement. `core/match` pairs them. It runs **in both directions**: finds against existing transactions in the Gmail review, and preview rows against existing transactions in the statement preview.

A pair is a likely match when all of these hold:

1. They come from different sources or different files, and neither is a transfer.
2. The statement date is from 1 day before to 5 days after the receipt date.
3. **Amounts agree.** Same currency: equal. Different currencies: the receipt amount converted at its date's rate is within 5% of the statement amount (bank fees and rate differences).
4. If more than one candidate passes, the one with the closest merchant name wins; if none is clearly closest, no pair is proposed.

In the preview the pair is shown together with **"Already have this" preselected**, and the user confirms with the import or unticks it (decision D9). On confirm one transaction remains. It keeps the receipt's original amount and currency and the merchant name, takes the statement's amount as `billed_minor`, and the other fingerprint goes to `seen_fingerprints` as merged. The "possible duplicate charge" insight is only for two real charges.

## 6. Money, rounding and dates

- Amounts are whole numbers of the currency's smallest unit. Rates are decimals; conversion uses decimal arithmetic, never floating point.
- **Which amount is summed:** the billed amount when the bank's charge is known, otherwise the original amount. So SGD totals equal what the statements say.
- **Conversion** uses the rate for the transaction's own date, or the nearest earlier date that has one. Every conversion goes through SGD.
- **Rounding:** each transaction is converted and kept unrounded; a figure is rounded once, half away from zero, when shown. Parts of a whole (donut, money flow, stacked columns) are adjusted by largest remainder so they add up to the total shown. Kept is the income shown minus the spending shown.
- **Rates stored:** every currency the source publishes, from 1 Jan 2024, about 5 MB a year. The display currency stays one of six. A transaction in a currency with no rate at all is saved, shown as "not in totals", and the user can enter what the bank charged.
- **"No more than 24 hours old"** means the newest `fetched_at` is within 24 hours. Sources do not publish at weekends; a weekend date uses Friday's rate.
- **Dates.** A transaction's date is the calendar date printed on its source. An email's date is taken in the device's time zone. "Today", "this month", renewals, the forecast and the review on the 1st use the device's local date. `core` never reads the clock: today's date is passed in. Tests fix the zone to Asia/Singapore.
- The AI day is the UTC day, so both the per-user and the shared allowance reset at 00:00 UTC, 8:00 am in Singapore.

## 7. Loading

Transactions are loaded in pages of 1,000 and cached on the device. Later starts fetch only rows whose `updated_at` is newer than the last load, plus `transaction_deletions`. The cache is cleared on sign-out. Automatic refetch on window focus is off; the app refetches after its own writes and on a manual refresh.
