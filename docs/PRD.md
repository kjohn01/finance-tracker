# PRD: Finance Tracker

Approved by the product owner on 11 Nov 2026 (Checkpoint 1). Changes after this date need the product owner's sign-off.

**Finance Tracker** builds your spending picture automatically from Gmail receipts and Singapore bank statements, explains it with dashboards and plain-language insights, and answers questions about your money when you ask.

## Product

**Problem.** Knowing where your money goes means typing in every transaction or paying for an app that connects to your bank. Most people give up on the first and cannot use the second outside the US. The receipts and statements that already hold the answer sit unread in Gmail and in bank downloads.

**Target user.** One person tracking their own money across several cards and currencies, starting with the product owner: SGD as the main currency, with spending in USD, EUR, JPY, TWD and CNY.

**Goals**

- At least 80% of transactions arrive by scan or upload, not by typing
- A new user sees a populated dashboard within 5 minutes of signing in
- Every total is correct in the chosen display currency
- The user can answer their own money questions by building a dashboard, without asking for a new feature

**Non-goals for release 1**

- No bank or card connections: the services that provide them are paid and cover Singapore and Taiwan poorly
- No public launch: Gmail access stays invite-only until Google's paid review is worth doing
- No budgets, goals or net worth: they build on the transaction data and come after it is reliable
- No shared accounts: sharing multiplies permission and privacy work
- No native mobile app: the web app must work well on a phone instead

**User stories**

- As a new user, I want to sign in with Google and understand exactly what Gmail access is for before I grant it, so that I trust the app with my inbox.
- As a user with receipts in Gmail, I want the app to find my purchases and subscriptions, so that I do not type them in.
- As a user with a card statement, I want to upload it and have duplicates ignored, so that my history is complete without double counting.
- As a user who spends in several currencies, I want every total in one currency I choose, so that I can compare months.
- As a user with my own questions, I want to build a dashboard from charts I pick, so that I see the view that matters to me.
- As a user who changes my mind, I want to disconnect Gmail or delete my account and all data, so that I stay in control.

## Requirements

Release 1 has 16 must-haves in five milestones, each ending with something the product owner can try. Six of them (marked *signature*) are what make the product stand out. QA automates the acceptance test for each before the developer builds it.

| # | Must-have | Accepted when | Milestone |
| --- | --- | --- | --- |
| 1 | **Demo mode** (*signature*). Anyone can explore the full app with realistic sample data, without signing in. | Every screen and chart works on the sample data; nothing in demo mode can reach a real account | 1 Foundation |
| 2 | **Google sign-in, invite links and onboarding.** Google is the only sign-in. A new account needs an invite link; every user gets a personal link to share, and the app stops at 100 users. A first-time user picks currency (SGD preset) and language (English preset), then sees a plain-language screen explaining read-only Gmail access before Google's own permission prompt. Gmail can be skipped and connected later. | Sign-up without a valid invite is refused; the 101st sign-up is refused with a clear message; a new user reaches the dashboard in under 2 minutes; one account can never read another's data | 1 Foundation |
| 3 | **Account and privacy controls.** Disconnect or reconnect Gmail, delete the account with all its data, and a privacy switch that blurs every amount on screen. | After deletion no data for that user remains; after disconnecting, the app makes no further Gmail reads | 1 Foundation |
| 4 | **Transactions.** A searchable, filterable list of expenses and income. Add, edit and delete by hand. Each keeps its original amount and currency. | An edit shows everywhere without a reload and survives sign-out and sign-in | 1 Foundation |
| 5 | **Currencies.** Display currency switch between SGD, USD, EUR, JPY, TWD and CNY (RMB), with SGD as default, using a free daily-rate source. | Switching recalculates every total and chart; rates are no more than 24 hours old | 1 Foundation |
| 6 | **Languages.** English by default, switchable to Traditional Chinese; the choice is remembered. | No untranslated text appears on any screen in either language | 1 Foundation |
| 7 | **Statement upload, PDF and CSV** (*signature*). Drop in several statements at once. The app recognises the bank, asks for the password if the PDF is locked, and shows a preview before importing. Covers credit card and deposit account statements from DBS/POSB, OCBC, UOB, Citibank, Standard Chartered and HSBC. The file itself is never stored. | For a sample statement from each of the six banks, every transaction is imported and the total matches the statement; uploading the same file twice creates no duplicates | 2 Import |
| 8 | **Gmail scan.** Finds receipts, invoices and renewal notices; extracts merchant, amount, currency and date; lists them for review, with accept-all, edit and reject. Later scans read only new mail. Only the extracted fields are stored, never the emails. | On a fixed set of sample emails, at least 9 in 10 are extracted correctly; nothing is saved before the user accepts it | 2 Import |
| 9 | **Automatic categories.** Each transaction gets a category; correcting one teaches a rule for that merchant. | Recategorising a merchant applies to its future transactions and, on request, its past ones | 2 Import |
| 10 | **Recurring charges.** Detects subscriptions and regular bills and lists renewals due in the next 30 days. | A charge repeating monthly for 3 months is flagged with the right next date | 3 Insight |
| 11 | **Default dashboards** (*signature*). An overview with this month against last month, income against expenses, spending by category and per month, top merchants and upcoming renewals. Two showpiece views: a money-flow diagram from income through to each category, and a calendar that shades each day by how much was spent. | Every figure matches a hand calculation on a fixed test data set | 3 Insight |
| 12 | **Insights feed** (*signature*). The app points things out unasked: an unusually large charge, a subscription whose price went up, a possible duplicate charge, and a forecast of where the month will end. | Each of the four insight types appears for a test data set built to trigger it, and none appears for a data set built not to | 3 Insight |
| 13 | **Custom dashboards.** Create and name dashboards; drag charts to add, resize and reorder them. Each chart picks a measure (spending, income, net), a grouping (category, merchant, month, currency), a period and a type (bar, line, donut, single number, table). | A custom dashboard is still there, unchanged, after signing in on another device | 4 Make it yours |
| 14 | **Ask your money** (*signature*). Type a question in English or Chinese, such as "how much did I spend on dining in Japan in March?", and get the answer with a chart that can be pinned to a dashboard. | For a fixed list of 20 test questions, at least 18 return the figure a hand calculation gives; when the free AI allowance is used up, the user is told and every other feature keeps working | 4 Make it yours |
| 15 | **Month in review** (*signature*). At month end, a short swipeable story: total spent, biggest category, biggest change from last month, new subscriptions, and one thing to watch. | The story's figures match the dashboard for the same month | 5 Delight |
| 16 | **Export.** Download all transactions as CSV. | The export re-imports into an empty account with identical totals | 5 Delight |

**Applies to every requirement:** usable on a 375 px wide phone screen, installable to the home screen, light and dark themes, keyboard accessible, and an empty state that tells a new user what to do first.

**Follow-ups (release 2):** budgets per category, a calendar feed and email reminders for renewals, receipt photos from the phone camera, more banks.

**Later (design for, do not build):** net worth and account balances, savings goals, shared accounts, public launch with Google's review.

## Similar products

The leading trackers (Monarch Money, YNAB, Copilot Money, Rocket Money, Spendee) depend on paid bank connections and a monthly fee. Finance Tracker's angle is free, no bank connection, and multi-currency from the start. Features they share and our decision on each:

| Shared feature | Our decision |
| --- | --- |
| Automatic transaction import | Release 1, through Gmail scan and statement upload instead of bank connections |
| Automatic categories with rules the user can correct | Release 1 |
| Recurring charge and subscription detection | Release 1 |
| Spending reports and trends | Release 1, as default and custom dashboards |
| Budgets per category | Release 2 |
| Net worth, savings goals, shared accounts | Later |
| Investment tracking | Not planned |

Copilot Money sets the design bar for the transaction review screen.

## Team

| Role | Name | Owns | Delivers | Does not do |
| --- | --- | --- | --- | --- |
| Product owner | (the user) | Final say on scope, look and architecture | Approval or change requests at each checkpoint | Day-to-day coordination |
| Orchestrator | Phaethon | Starting agents, passing work between them, reporting to the product owner, improving the workflow | Status updates, checkpoint hand-offs, workflow notes | Writing features or approving its own work |
| Project manager | Fairy | Scope, priorities, the workflow | This PRD; acceptance check of the finished product against it | Design or code decisions |
| Designer | Jinni | Look, interaction and user experience | Style sheet (colour, type, components), screen designs, clickable HTML prototype | Production code |
| Developer | Youkai | Architecture, code, pipelines, deployment | Tech design, CI/CD pipeline, feature pull requests, the live app | Reviewing or merging their own pull requests |
| QA | Ghost | Quality: correctness, efficiency, maintainability | Test plan, automated acceptance tests written before each feature, review of every pull request, final test report | Writing feature code |

Agents hand off through files and pull requests in this repository, never through private chat. The developer and QA are always separate agents, so no code is reviewed by its author. The designer and QA each comment on the tech design before it reaches the product owner.

## Workflow

1. **Product.** Fairy writes the PRD. **Checkpoint 1: product owner reviews the PRD** (passed 11 Nov 2026).
2. **Design.** Jinni produces the style sheet, screens and clickable prototype. **Checkpoint 2: product owner reviews the design.**
3. **Tech design.** Youkai writes the tech design; Jinni and Ghost comment. **Checkpoint 3: product owner reviews the tech design.**
4. **Build, repeated per feature.** Ghost writes the acceptance tests, Youkai builds and opens a pull request, CI runs, Ghost reviews (spec first, then code quality), then merge and automatic deploy. Fixes loop back to Youkai.
5. **Release.** Ghost runs the full regression and writes the final report, Fairy checks the result against this PRD, and the product owner tries the live app.

Each checkpoint loops back to its owner until the product owner approves.

**Working rules**

- One short document per phase: this PRD, the design, the tech design. Each is final once approved.
- One pull request per feature, small enough to review in one sitting.
- Phaethon reports to the product owner after each merged feature and whenever something is blocked.

## Constraints

- Running cost is zero: free tiers only, for hosting, database, sign-in, exchange rates and AI.
- Gmail access is read-only, and only extracted transaction fields are stored.
- **Invite links and Google's limits.** The Google sign-in is published live but unreviewed. Anyone with an invite link can sign in, and Google caps the app at 100 users in total. When a user connects Gmail, Google shows a warning that the app is unreviewed, which they click through (accepted by the product owner). Google's guidance says weekly re-approval applies only to test mode, but one developer reports otherwise; Youkai must prove it with a real test at the tech design review. Adding emails by hand is ruled out: sign-up must be automatic through the invite link. If the test fails, the fallback is that users re-approve Gmail weekly.
- **PDF statements.** The open-source project [Monopoly](https://pypi.org/project/monopoly-sg/) (MIT, Python) already reads statements from Citibank, DBS, HSBC, OCBC and Standard Chartered. UOB was not listed in the version checked. Youkai decides at the tech design review whether to run it as is or reuse its bank layouts.
- **AI.** Ask your money, and help with reading receipts, run on a free AI allowance from a provider that does not train on what it is sent. Leading candidate: Cloudflare Workers AI. Free tiers that use submitted data to improve their products are ruled out.
- All code, documents and tests live in this repository; specific services are chosen at the tech design review.

## Release 1 is successful when

- All 16 acceptance tests pass automatically on every pull request
- A new user sees a populated dashboard within 5 minutes of signing in
- At least 80% of the product owner's transactions for one month arrive by scan or upload
- The dashboard loads in under 2 seconds on a mid-range phone
- The accessibility audit scores 90 or higher
- Monthly running cost is 0

## Risks

- Sixteen must-haves is a large first release. The cut order, if needed, is from the end: month in review, then Ask your money, then custom dashboards. Milestones 1 to 3 alone are a complete, useful product.
- Bank statement layouts change without notice. Accuracy for a bank can only be promised once a real sample from it has been tested.
- Receipt emails differ by merchant, so the scan will miss some. The review screen and manual entry cover the gap.
- The free AI allowance is finite. Ask your money must degrade politely, and nothing else may depend on it.
- Google's unreviewed-app warning will put some invited users off connecting Gmail. Statement upload and demo mode work without it.
- Free tiers can pause inactive projects or change limits; the tech design must name a fallback for each service.

## Open questions

- Product owner: sample statements from the banks they hold (promised, pending).
- Youkai: convert each transaction at the rate on its own date, or at today's rate?
- Youkai: can the six banks' PDFs be read in the browser, so statements never leave the user's device?
