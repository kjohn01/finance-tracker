# ADR 0002: The Gmail scan runs in the browser with a short-lived token

**Status:** Proposed, 12 Nov 2026; revised after review. **Deciders:** product owner (Checkpoint 3).

## Context

The approved copy promises that the app "searches for receipts and reads only the matches" and that nothing is saved to the user's transactions until they accept. Gmail access is read-only. The Google project is published live but not verified, which Google's documentation says means a warning screen and a cap of 100 new users. The PRD asked whether Gmail access would need weekly re-approval, and required a real test.

What Google's documentation says:

- Refresh tokens expire after 7 days only for projects in "Testing" status (and only when scopes go beyond name, email and profile).
- Sign-in with name, email and profile shows no warning and does not count toward the cap. The cap counts users who pass the unverified-app screen, 100 in total, for ever.
- The browser token model issues an access token that lasts about an hour, with no refresh token. A new one needs a user action, and only a pop-up window is supported.
- Gmail allows 6,000 quota units a minute per user; fetching a full message costs 60, so about 100 messages a minute.

## Decision

Sign-in asks only for name and email. Gmail is connected separately, in the browser, with Google Identity Services' token model and the `gmail.readonly` scope. The token is held in memory, used to call the Gmail API directly from the browser, and discarded. Our servers never see a Google token.

Email text stays in the browser, with one exception the product owner decides (D4): when our rules cannot read a matched receipt, the text of that one email, at most 4,000 characters, is sent through our Worker to the AI to extract four fields. The Worker does not store or log it.

How the scan behaves:

- It runs at app level, so it continues while the user moves between screens. Finds can be reviewed as they arrive.
- It reads the newest three months first, then continues into older months by itself, back to 12 months, for as long as the app is open.
- Progress and finds waiting for review are kept on the device, so closing the app loses nothing. They are cleared on sign-out or disconnect. Reopening the app offers to continue; that takes one tap, because Google requires a user action for a new token.
- The account records how far back the scan has reached and up to what time every find has been decided. A later scan searches from that time, drops message ids already accepted or rejected, and fetches the rest. A find the user never reviewed is therefore offered again, on any device.
- Disconnecting asks Google for a token (one tap) and revokes the grant. If the user closes Google's window, the app marks Gmail disconnected, never requests a token again, and shows how to remove access in the Google account.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Browser scan, short-lived token (chosen) | No Google token stored anywhere; a breach of our database exposes no inbox; the 7-day question no longer matters | Scans only while the app is open; the user presses Scan and may see Google's small window; a first scan is paced at about 100 emails a minute; depends on a pop-up, which is unproven in an app installed on a phone |
| Server scan with a stored refresh token | Background and scheduled scans; faster perceived first scan | We would hold long-lived keys to up to 100 inboxes; all email text would pass through our server; depends on refresh tokens behaving as documented |

## Consequences

- The first-scan screen can no longer promise "about two minutes" for a year. What is true: first finds within a minute, three months in about 3 to 4 minutes, a busy year in 10 to 15. Jinni rewrites the copy.
- No automatic scanning in release 1. If release 2 wants it, this decision is revisited together with Google verification.
- The token could read the whole mailbox for an hour. "Reads only the matches" is what our code does, and a strict content security policy with no third-party scripts except Google's is the barrier. Ghost fails any test that logs a policy violation.
- **Outstanding, accepted by the product owner as A1:** no real test has been run. The first Gmail pull request begins with a test on a real iPhone and a real Android phone, from the installed app: does Google's window open, and is the warning shown again on a later token request and after 7 days. Nothing else on Gmail is built until it passes. Fallbacks: run the scan in the phone's browser, or use the redirect form of the same browser flow.
- Development and testing use a second Google project in "Testing" status, so they never use up the live project's 100 places.

## Sources

- https://developers.google.com/identity/protocols/oauth2#expiration
- https://support.google.com/cloud/answer/15549945 (publishing status, test users, user cap)
- https://support.google.com/cloud/answer/7454865 (unverified apps, 100 new users)
- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/workspace/gmail/api/reference/quota
