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
