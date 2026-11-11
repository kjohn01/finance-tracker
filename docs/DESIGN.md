# Design: Finance Tracker

Jinni, 11 Nov 2026. Revised after the Checkpoint 2 design review. The design of record is `design/prototype/index.html` (open it in a browser; one file, no network). Tokens are in `design/tokens.css`, screenshots in `design/screenshots/`.

## Decisions made at the design review (11 Nov 2026)

| # | Decision |
| --- | --- |
| 1 | The overview opens with the sentence and the money-flow diagram. Approved. |
| 2 | Passbook-green palette and system fonts. Approved. |
| 3 | Deleting the account requires typing DELETE. Approved. |
| 4 | The app never shows how many places are taken. Settings has only the personal invite link and a copy button. The 100-user cap appears only as the refusal message at sign-up. |
| 5 | Ask your money shows no remaining-question counter. It speaks up only when the allowance is used up. |
| 6 | Month in review opens by itself on the 1st of each month, can be dismissed, and stays in the menu. |
| 7 | A possible duplicate is resolved by removing one record, with undo. |

Changes requested at the review and now in the prototype: dashboards merged into the overview, a phone-first restructure, categories as a donut, EUR and CNY exercised, screenshots cut to 15.

Nothing is waiting on the product owner. Open for Youkai (tech design): the Gmail explainer promises "it searches for receipts and reads only the matches" and "nothing is saved until you accept"; both must be true of the build. The statement screen says the file "is never stored" and does not claim it stays on the device, pending the in-browser parsing question in the PRD.

## Principles

- **The month is one picture.** Every screen answers "where did the money go" before it offers controls.
- **Show the working.** Insights, forecasts and Ask answers state the transactions and rule behind the figure.
- **One number, everywhere.** Every chart, insight, story card and answer is computed from the same sample transactions, so totals agree across screens and currencies.
- **Trust before permission.** Anything touching Gmail or files says what is read, what is kept and how to stop, before the user is asked.
- **Phone first.** Each screen is designed at 375 px, then widened.

## Design plan and the check against generic defaults

Subject: one person in Singapore reading their own receipts and bank statements. The material world is passbooks, statement paper and banknotes, so the palette starts there.

| Name | Light | Role |
| --- | --- | --- |
| Passbook | `#e9f0eb` | Page background, the pale green of passbook and cheque paper |
| Slip | `#fbfcfa` | Panels and sheets |
| Ink | `#17201d` | Text; a green-black tied to the brand hue |
| Lagoon | `#0b5d53` | Buttons, links, the logo |
| Pandan | `#009180` | Income and "kept" in charts, selection, meters |
| Kaya gold | `#f2c14e` | Only for "now": the demo tag and one story card |

Type: the system UI sans only (no web fonts, by the brief), one family, weights 400/550/680, sizes 11 to 60 px. Figures carry the personality: tabular in columns, heavy and tight in headlines. Layout: a left-aligned sentence, then the flow diagram across the full width on the bare page, then quiet panels in a 12-column grid; a bottom tab bar on phones.

What changed after checking the first plan against the common generated-design defaults:

| First plan | Why it failed the check | Now |
| --- | --- | --- |
| Warm cream page with a coral accent | The most common generated look | Passbook green paper; orange is used only as the expenses colour in charts |
| Dark hero card with a big number, three stats and a gradient glow | The default dashboard hero | A plain sentence with the three figures in bold, then the flow diagram |
| Tracked-out capital labels above headings | Decoration, not information | Sentence-case labels, only where they say something new |
| Identical rounded cards with one shadow | Card kit | Flow diagram sits on the page with rules above and below; panels are flat with a hairline; shadow only on things that float |
| One highlighted word in the landing headline; tilted screenshot | Stock landing page | Plain headline; the hero is the live flow diagram from the demo data |
| Numbered "1, 2, 3" start cards | The three ways in are alternatives, not steps | Icons, no numbers |

The one bold element is the money-flow diagram. Everything else stays quiet.

## Tokens (summary)

Colour for light and dark, chart palette (8 fixed hues plus neutral, validated for colour-blind separation on both surfaces with the dataviz skill's validator; teal income, orange expenses, one hue per category everywhere), a one-hue ramp for the calendar, type scale, 4 px spacing scale, radius 6/10/14/20/28, three shadows. `design/prototype/sync-tokens.sh` copies `tokens.css` into the prototype so they cannot drift.

## The overview is the dashboard

There is no separate Dashboards destination. The overview is a list of charts the user owns:

- **Default layout:** money flow, spending pace, worth a look, spending by category (donut), spending by day (calendar), income against expenses, spending per month, top merchants, coming up.
- **Edit** (button beside the month stepper) lets the user add, remove, resize and reorder charts. Charts they add are configured by measure, grouping, period and type. Removed ready-made charts can be added back from the Add chart sheet. **Reset to default** restores the layout above.
- **Tabs** hold extra dashboards: "Overview, Travel, New". The sentence belongs to the Overview tab; the month stepper scopes every tab.
- Chart periods are relative to the month shown. A chart pinned from Ask keeps the months it was asked about, and lands on the tab the user is on.

## Phone layout (375 px)

- **The first two screens carry the story:** sentence, then the flow diagram. Below it a row of chips (Pace, Insights, Categories, Calendar, Income, Months, Merchants, Coming up) shows one chart at a time. The overview is about 1,500 to 1,800 px tall, down from about 9,000.
- **Edit mode on a phone is a list,** one row per chart with move up, move down, settings and remove buttons. No dragging is needed.
- **Sheets rise from the bottom** with the primary action pinned to the bottom edge; the amount field opens the numeric keypad.
- **Filters scroll sideways** in one row instead of wrapping.
- Every control is at least 44 px in both directions, including the privacy switch, calendar days and the month stepper.

## Screens and the requirement each covers

| Screen (route in the prototype) | PRD # |
| --- | --- |
| Landing, demo banner on every app screen (`#/landing`) | 1 |
| Invite accepted, Google sign-in, currency and language, Gmail explainer, first scan, "all 100 places are taken" (`#/invite` … `#/scan`, `#/full`) | 2, 8 |
| Settings: Gmail connect/disconnect, invite link, language, currency, theme, hide amounts, export, delete account | 2, 3, 5, 6, 16 |
| Transactions: search, filters, add/edit sheet, original currency, category rule | 4, 9 |
| Currency, language, theme and privacy switches in the top bar of every screen | 3, 5, 6 |
| Import, Statements: drop several files, bank recognised, password prompt, preview, duplicates skipped | 7 |
| Import, Gmail finds: accept all, accept, edit, reject | 8 |
| Recurring: next 30 days, price rise and new markers | 10 |
| Overview, default layout: sentence, money flow, pace, category donut, calendar, income against expenses, per month, top merchants, coming up | 11 |
| Insights: large charge, price rise, possible duplicate, month-end forecast | 12 |
| Overview, Edit and tabs: named dashboards, add, remove, resize, reorder, chart settings (measure, grouping, period, type), reset | 13 |
| Ask your money: question, answer with chart and working, pin to the current tab, allowance used up | 14 |
| Month in review: seven swipeable cards, in the menu and by itself on the 1st | 15 |
| Empty states for a new account on every screen ("Prototype screens" menu, top right) | all |

## Key interaction decisions

- **One month stepper scopes the whole overview.** No per-chart filters; the flow, donut and column charts have a Table button for the same data.
- **Categories are a donut** with the month's total in the centre. The legend lists category, amount, share and change against last month, so colour is never the only cue. Hovering or tapping a slice or row picks it out, shows its amount in the centre and offers its transactions.
- **Review, not auto-save.** Gmail finds and statement rows are listed first; nothing reaches Transactions until accepted. Low-confidence finds are flagged "Check the amount".
- **Category correction teaches a rule in place.** Changing a category in the edit sheet says "Grab will be filed under Transport from now on" and offers to change earlier ones.
- **Editing works without dragging.** On desktop: drag a chart, or use the arrow buttons; drag the corner handle, or use the width button. On a phone: move up and move down buttons. Removing a chart offers undo. A line chart always groups by month, and the sheet says why.
- **Every Ask answer lists what it was worked out from** and links to those transactions. When the allowance runs out the box is replaced by a plain note, with links to build a chart or search instead.
- **Kept is always rounded income minus rounded spending,** so the three headline figures add up on screen in every currency.
- **Privacy switch** blurs every amount and replaces chart labels with dots.
- Copy uses the same verb through a flow (Import → "43 transactions imported"), sentence case, no exclamation marks. Traditional Chinese is written for Taiwan usage, not machine-literal.

## Accessibility

- **Contrast (computed from the tokens):** body text 14.4:1, secondary 7.0:1, muted 5.6:1 on the page (light); 16.2, 10.3, 6.9 (dark). Links and buttons at least 6.4:1. Input and outline-button borders 3:1. Yellow and pink chart marks are under 3:1 on the light surface, so they always carry a text label and a table view.
- **Keyboard:** skip link, visible 3 px focus ring on every control, sheets trap focus and close on Escape, story cards move with arrow keys, dashboard reorder and resize have button equivalents. Chart values are reachable through the table view and calendar days are buttons.
- **Touch:** every button, link, select and input measured at 375 px is at least 44 by 44 px (checked by script on 13 screens).
- **Motion:** only in response to an action; reduced-motion is respected.
- Not yet tested with a screen reader or at 200% zoom; Ghost should include both in the test plan.

## Known gaps in the prototype

Sample data is fixed at 24 Oct 2026. Importing statements shows the result but does not add rows. Ask answers only the four example questions. The Google screens are stand-ins. No sample transaction is in EUR; EUR and CNY were checked as display currencies. The review-on-the-1st state is reached from the "Prototype screens" menu because the sample date is the 24th.
