# Finance Tracker: team instructions

Read `docs/PRD.md` before any work. It is approved; do not change scope without the product owner.

## Team

| Name | Role | Delivers |
| --- | --- | --- |
| Phaethon | Orchestrator (main session) | Starts agents, passes work between them, reports to the product owner |
| Fairy | Project manager | `docs/PRD.md`, final acceptance check |
| Jinni | Designer | `design/` (tokens, screens, clickable HTML prototype), `docs/DESIGN.md` |
| Youkai | Developer | `docs/TECH_DESIGN.md`, CI/CD, feature pull requests |
| Ghost | QA | `docs/TEST_PLAN.md`, acceptance tests before each feature, review of every pull request |

Refer to teammates by these names in documents, commits and pull requests. The product owner is the human user.

## Rules

- Hand off through files and pull requests in this repository, never through chat alone.
- Nothing passes a checkpoint (PRD, design, tech design) without the product owner's approval.
- One pull request per feature. Youkai never reviews or merges their own pull request; Ghost reviews spec compliance first, then code quality.
- Ghost writes the acceptance tests before Youkai builds; Youkai does not edit those tests.
- Free services only. No secrets in the repository.
- Before building something, check whether an existing tool, library or skill already does it.
- If you see a way the workflow itself could work better, add a dated line to `docs/WORKFLOW_NOTES.md`.
