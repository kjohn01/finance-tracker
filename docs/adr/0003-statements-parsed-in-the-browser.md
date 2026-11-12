# ADR 0003: Statements are parsed in the browser with our own bank rules

**Status:** Proposed, 12 Nov 2026; revised after review. **Deciders:** product owner (Checkpoint 3).

## Context

Statement files must never be stored. The PRD asked whether the six banks' PDFs can be read in the browser, and whether to run the Monopoly project as is or reuse its bank layouts.

Findings:

- Monopoly's repository changed from MIT to AGPL-3.0 on 17 May 2024 (commit `78e560e`). It is now published as `monopoly-core` (0.23.6, AGPL-3.0-only). The PyPI package `monopoly-sg` named in the PRD stopped at 0.8.4 and still says MIT.
- It now covers all six banks, including UOB.
- It is Python and depends on native PDF tools (PyMuPDF, pdftotext in layout mode), so it cannot run in a browser without heavy packaging. Its rules are regular expressions over layout-preserved text lines, plus column limits.
- Spike: pdf.js 6.5 opened a generated two-page statement, plain and locked with RC4-128, AES-128 and AES-256, reported a wrong password with a distinct code, and gave text with positions. Grouping text by baseline rebuilt the lines; one pattern parsed all 58 rows and the sum matched the printed total.

## Decision

Parse in the browser with pdf.js inside a Web Worker. Write our own rule file per bank, from the product owner's samples, in TypeScript. Do not copy Monopoly's code or patterns; use it only as a description of the approach and, optionally, as a separate tool to cross-check our output during development.

Every import is checked: the sum of parsed rows must equal the total printed on the statement, or the preview says so.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Browser, own rules (chosen) | Files and passwords never leave the device; the app stays MIT; no server cost | We write and maintain six rule files; needs real samples |
| Browser, port Monopoly's patterns | Faster start; layouts already proven | The app would have to be AGPL |
| Server runs Monopoly | Least code | Files and passwords leave the device; needs a Python host, which the free Worker is not; AGPL duties for a network service |

## Consequences

- Bank rules also set each row's kind: a card payment or a move between the user's own accounts is a transfer, and other credits on a card statement are refunds (`docs/tech/DATA_MODEL.md` section 2).
- pdf.js is configured never to evaluate code from a file.
- Tests use synthetic files in the repository, built from the real layouts; real samples are checked outside the repository and never committed.
- The statement screen can truthfully say the file never leaves the device.
- Image-only (scanned) statements are not supported; the user is pointed to the bank's CSV or manual entry.
- A bank is "supported" only once a real sample passes Ghost's acceptance test.
- If the product owner prefers AGPL, the second option becomes available and this record is replaced.

## Sources

- https://github.com/benjamin-awd/monopoly (licence file, `pyproject.toml`, `src/monopoly/banks/`)
- https://pypi.org/project/monopoly-sg/ and https://pypi.org/project/monopoly-core/
- https://github.com/mozilla/pdf.js (Apache-2.0)
