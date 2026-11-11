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
