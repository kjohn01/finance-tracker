# Workflow notes

A running log of what worked, what did not, and what to change. After release this becomes the basis for a reusable "tech project" skill. Kept by Phaethon; any agent may add a dated line.

## 11 Nov 2026: Product phase

- **Look for existing tools before starting each phase, not during it.** The PRD was half written before the product, design and engineering plugins were found. Next time: search skills and plugins as the first step of every phase.
- **Create the repository before the first document.** The PRD was written in a shared doc first, then copied into the repo by hand. Next time: write each phase document as a file in the repo and publish a review copy from it, so there is one source.
- **Ask the scoping questions before drafting.** Three rounds of PRD rewrites came from answers that could have been asked up front: how data gets in, target market and currency, sign-in method, who else will use it, and how ambitious the release should be.
- **State the ambition level explicitly.** "Make it a showpiece" changed the scope from 12 to 16 must-haves. Ask early whether the goal is smallest useful product or a demo of what is possible.
- **Check platform limits before promising a feature.** Google's rules for Gmail access (100-user cap, warning screen) and the lack of a Google exchange-rate service only surfaced after the feature was requested. Research third-party limits as part of the PRD.
- **Real test data is a dependency.** Bank statement parsing cannot be verified without real samples. Ask for sample data at the PRD stage and track it as an open item.
- **Name the team at kickoff.** Names were added after the PRD; putting the roster in `CLAUDE.md` from the start lets every agent pick it up automatically.

## 11 Nov 2026: Design phase (Jinni)

- **Send the designer every skill and base branch up front.** The frontend-design guidance and the change of base branch arrived mid-build and cost a palette and layout rewrite. Next time: list required skills and the PR base in the first brief.
- **Run the "generic defaults" check on a written plan before any CSS.** The first palette (cream and coral) was caught only after tokens existed. A ten-line plan reviewed first is cheaper.
- **Compute sample data, never hand-type chart numbers.** One generated transaction list feeding every chart made "totals add up across screens" true by construction, and exposed a rounding mismatch (in minus out against kept) that hand-typed figures would have hidden.
- **Script the screenshots and an interaction smoke test from the start.** The smoke test caught a lost-click bug (a re-render on blur swallowed the Save click) that no screenshot could show. Ghost can reuse `design/screenshots/capture.js` as a visual baseline.
- **Commit work in progress early.** An interruption mid-build lost nothing only because parts were on disk; commit after the first assembled file.
- **Ask for the navigation model before drawing screens.** "Dashboards" was designed as its own destination and then merged into the overview at review. One question up front ("is the overview the user's own dashboard?") would have saved the rework.
- **Review every phone screenshot, not a sample.** The first pass looked at about a third of them and missed a 9,000 px overview. Side-by-side light and dark montages made reviewing all 28 screens practical.
- **Do not commit a full screenshot matrix.** 80 PNGs added 27 MB. Commit about a dozen and keep a script that regenerates the rest on demand.
- **Measure touch targets by script at the phone width.** "44 px" was claimed with exceptions; a script listing every control under 44 px turned it into a fact.

## 12 Nov 2026: Tech design phase (Youkai)

- **Check a dependency's licence at its source repository, not its package page.** The PRD recorded Monopoly as MIT from a stale PyPI page; the repository had been AGPL for over two years. Next time: read the licence file and the last release date before a library is named in a PRD.
- **Commit and push a skeleton before researching.** A usage limit stopped the first session with nothing on disk. Next time: branch, skeleton, push, then research in small committed steps, with sources written down as they are found.
- **Fetch documentation as text and search it.** Saving each official page and searching for the exact limit was faster and more reliable than reading whole pages, and left a quotable source for every claim.
- **Ask for third-party accounts one phase early.** Three things could not be proven without the product owner's Google and Cloudflare accounts (the 7-day test, AI cost per question, model accuracy). Creating the free accounts during the design phase would let the tech design verify instead of assume.
- **A spike on generated data proves the tool, not the input.** The PDF spike showed the library handles passwords and positions; it says nothing about real bank layouts. Label spikes with what they did not prove.
- **Decide how reviews are recorded when every agent shares one GitHub account.** GitHub cannot require an approval from the author's own account, so "Ghost approves" needs an agreed form (a review comment plus required checks) before the first feature pull request.
- **Clarify "no AI model names" for design documents.** The brief forbade model names in files but also asked for a chosen model; the tech design leaves the model id to configuration. State up front whether the rule covers the product's own AI.

## 12 Nov 2026: Tech design review and test plan (Ghost)

- **Bring QA in before the data model is drafted, not after.** Four of the six blocking findings (transfers and refunds, the duplicate fingerprint, Gmail against statement duplicates, invite rules) are rules the hand calculations depend on. A half-page "rules that decide totals" list agreed between Fairy, Youkai and Ghost before the tech design would have caught them earlier.
- **Every PRD acceptance criterion needs a stated way to measure it.** Six criteria could not be automated as written ("under 2 minutes", "24 hours old", "each of the six banks", "18 of 20" on a shared AI allowance, "scores 90"). Next time QA reads the PRD before Checkpoint 1 and marks each criterion as automatic, proxy or manual.
- **Put unmet PRD obligations in the decision table.** The required real test of weekly Gmail re-approval was reported only under "assumed" in the last section. Anything the PRD demanded and the phase could not deliver belongs in "what the product owner must decide".
- **Spot-check cited limits by fetching the page, and look for what the document did not cite.** All quoted limits held; the gaps were the uncited ones (database egress, the default 1,000-row response limit, the new Gmail daily threshold).
- **Keep development and production third-party projects separate from day one** when a provider has a lifetime cap (Google's 100 users): test sign-ins otherwise spend it.
