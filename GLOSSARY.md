# Glossary

The words this project uses, with one meaning each. Use them exactly in documents, tests, code and screens. No implementation detail belongs here.

**User.** One person with one account, tracking their own money. Never a household or a group.

**Account.** A user's membership of Finance Tracker, created by redeeming an invite. Not a bank account; say **bank account** for that.

**Invite.** A personal link that lets one new person create an account. Every user has one to share. _Avoid_: referral, code.

**Place.** One of the 100 accounts that can ever be created. A place is used when an invite is redeemed and is not returned when an account is deleted.

**Demo mode.** The app running on sample data for a visitor with no account. Nothing done in demo mode is kept.

**Transaction.** One movement of money on one date: an **expense** (money out) or **income** (money in). It has an original amount, an original currency, a merchant, a category and a source. The unit everything else is built from.

**Original amount, original currency.** What was actually charged or received. Never changed by conversion.

**Display currency.** The one currency the user chooses to see every total in. Changing it changes how amounts are shown, never what is stored.

**Rate.** The reference exchange rate for a currency on a date. A transaction is converted with the rate for its own date.

**Merchant.** Who the money went to or came from, in a tidied form, so that "GRAB*RIDE SG" and "Grab" are the same merchant.

**Category.** The kind of spending or income a transaction belongs to. Each transaction has exactly one.

**Category rule.** The user's instruction that a merchant always belongs to a category. Created by correcting a transaction.

**Source.** How a transaction arrived: typed by hand, from a statement, or from a Gmail scan.

**Statement.** A document from a bank listing the transactions of one card or bank account for one period. The user uploads it; it is read and then discarded.

**Statement preview.** The transactions read from a statement, shown before import. Not yet part of the user's data.

**Import.** Accepting a preview so that its transactions join the user's data. Also the record that this happened.

**Duplicate.** A row in a preview that is already in the user's data from an earlier import. Skipped automatically. Different from a **possible duplicate charge**, which is an insight about two real transactions.

**Scan.** One pass over the user's Gmail that searches for receipts, invoices and renewal notices and reads only the messages found.

**Find.** A purchase or charge a scan has read from one email, waiting for the user to accept, edit or reject it. A find is not a transaction until accepted. _Avoid_: match, result.

**Accept, reject.** Accepting turns a find or a preview into transactions. Rejecting discards a find and stops it being offered again.

**Recurring charge.** A series of expenses to the same merchant at a regular interval, such as a subscription or a bill. Detected, not entered.

**Renewal.** The next expected payment of a recurring charge, with a date and an amount.

**Insight.** Something the app points out unasked about the user's transactions. There are four kinds: unusually large charge, price rise, possible duplicate charge, month-end forecast. Each states the transactions and the rule behind it.

**Forecast.** The estimate of what the current month's spending will total when it ends.

**Dashboard tab.** A named page of charts that the user owns. **Overview** is the first tab and always exists.

**Chart.** One view of the transactions on a dashboard tab, defined by a measure, a grouping, a period and a type.

**Measure.** What a chart adds up: spending, income, or net.

**Kept.** Income minus spending for a period. The same as net; "kept" is the word on screen.

**Grouping.** What a chart splits its measure by: category, merchant, month or currency.

**Period.** The span of dates a chart covers, relative to the month being viewed.

**Money flow.** The chart that shows income dividing into each category of spending and what is kept.

**Question.** What the user types into Ask your money.

**Answer.** The figure and chart that respond to a question, with the transactions it was worked out from. An answer can be **pinned**, which adds its chart to the current dashboard tab.

**Allowance.** The number of questions that can be asked in a day at no cost. When it is used up, Ask is unavailable until the next day.

**Month in review.** A short sequence of cards summarising one finished month.

**Hide amounts.** The privacy setting that blurs every amount on screen.

**Export.** A file of all the user's transactions that can be imported again with identical totals.
