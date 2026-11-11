# Design: Finance Tracker

Jinni, 11 Nov 2026. For Checkpoint 2. The design of record is `design/prototype/index.html` (open it in a browser; one file, no network). Tokens are in `design/tokens.css`, screenshots in `design/screenshots/`.

## Decisions needed from the product owner

1. **The overview opens with a sentence and the money-flow diagram, not a row of number tiles.** "So far in October, S$7,427 came in and S$5,535 went out. S$1,892 is still yours." Approve, or ask for a conventional tile row.
2. **Visual direction: passbook green paper, lagoon teal, one gold accent.** Approve the palette and the system-font-only type, or name a direction you prefer.
3. **Delete account asks the user to type DELETE.** Slower, but it is the one action that cannot be undone. Keep, or use a plain confirm button?
4. **Invite wording.** Settings shows "37 of 100 places used" for the whole app plus "3 joined with your link". Is the app-wide count what you meant by "x of 100 used"?
5. **Ask your money shows "17 of 20 free questions left today".** The number 20 is a placeholder until Youkai knows the real allowance. Show a count at all, or only speak up when it runs out?
6. **Month in review is a full screen in the menu.** Should it also appear by itself on the 1st of each month?
7. **Removing a duplicate.** The insight offers "Same purchase, remove one" with an undo. Should the app instead merge the two records and keep both sources?

Open for Youkai (tech design): the Gmail explainer promises "it searches for receipts and reads only the matches" and "nothing is saved until you accept"; both must be true of the build. The statement screen says the file "is never stored" and does not claim it stays on the device, pending the in-browser parsing question in the PRD.

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

## Screens and the requirement each covers

| Screen (route in the prototype) | PRD # |
| --- | --- |
| Landing, demo banner on every app screen (`#/landing`) | 1 |
| Invite accepted, Google sign-in, currency and language, Gmail explainer, first scan, "all 100 places taken" (`#/invite` … `#/scan`, `#/full`) | 2, 8 |
| Settings: Gmail connect/disconnect, invite link, language, currency, theme, hide amounts, export, delete account | 2, 3, 5, 6, 16 |
| Transactions: search, filters, add/edit sheet, original currency, category rule | 4, 9 |
| Currency, language, theme and privacy switches in the top bar of every screen | 3, 5, 6 |
| Import, Statements: drop several files, bank recognised, password prompt, preview, duplicates skipped | 7 |
| Import, Gmail finds: accept all, accept, edit, reject | 8 |
| Recurring: next 30 days, price rise and new markers | 10 |
| Overview: sentence, money flow, pace against last month, calendar, by category, income against expenses, per month, top merchants, coming up | 11 |
| Insights: large charge, price rise, possible duplicate, month-end forecast | 12 |
| Dashboards: named tabs, add, resize, reorder, chart settings (measure, grouping, period, type) | 13 |
| Ask your money: question, answer with chart and working, pin to dashboard, allowance used up | 14 |
| Month in review: seven swipeable cards | 15 |
| Empty states for a new account on every screen ("Prototype screens" menu, top right) | all |

## Key interaction decisions

- **One month stepper scopes the whole overview.** No per-chart filters; every chart has a Table button for the same data.
- **Review, not auto-save.** Gmail finds and statement rows are listed first; nothing reaches Transactions until accepted. Low-confidence finds are flagged "Check the amount".
- **Category correction teaches a rule in place.** Changing a category in the edit sheet says "Grab will be filed under Transport from now on" and offers to change earlier ones.
- **Dashboard editing works three ways.** Drag by the handle, arrow buttons (keyboard and touch), and a corner handle or a width button to resize. A line chart always groups by month, and the sheet says why.
- **Every Ask answer lists what it was worked out from** and links to those transactions. When the allowance runs out the box is replaced by a plain note, with links to build a chart or search instead.
- **Kept is always rounded income minus rounded spending,** so the three headline figures add up on screen in every currency.
- **Privacy switch** blurs every amount and replaces chart labels with dots.
- Copy uses the same verb through a flow (Import → "43 transactions imported"), sentence case, no exclamation marks. Traditional Chinese is written for Taiwan usage, not machine-literal.

## Accessibility

- **Contrast (computed from the tokens):** body text 14.4:1, secondary 7.0:1, muted 5.6:1 on the page (light); 16.2, 10.3, 6.9 (dark). Links and buttons at least 6.4:1. Input and outline-button borders 3:1. Yellow and pink chart marks are under 3:1 on the light surface, so they always carry a text label and a table view.
- **Keyboard:** skip link, visible 3 px focus ring on every control, sheets trap focus and close on Escape, story cards move with arrow keys, dashboard reorder and resize have button equivalents. Chart values are reachable through the table view and calendar days are buttons.
- **Touch:** controls are at least 44 px high on phones. Two exceptions: the privacy switch is 32 px tall with a 44 px hit area, and the calendar day cells are about 40 px at 375 px.
- **Motion:** only in response to an action; reduced-motion is respected.
- Not yet tested with a screen reader or at 200% zoom; Ghost should include both in the test plan.

## Known gaps in the prototype

Sample data is fixed at 24 Oct 2026. Importing statements shows the result but does not add rows. Ask answers only the four example questions. The Google screens are stand-ins. EUR appears only as a display currency.
