# ADR 0002: The Gmail scan runs in the browser with a short-lived token

**Status:** Proposed, 12 Nov 2026. **Deciders:** product owner (Checkpoint 3).

## Context

The approved copy promises that the app "searches for receipts and reads only the matches" and that "nothing is saved until you accept". Gmail access is read-only. The Google project is published in production but not verified, which Google's documentation says means a warning screen and a cap of 100 new users. The PRD also asked whether Gmail access would need weekly re-approval.

What Google's documentation says:

- Refresh tokens expire after 7 days only for projects whose publishing status is "Testing" (and only when scopes go beyond name, email and profile). Production status is not subject to this.
- Sign-in with name, email and profile shows no warning and does not count toward the cap. The cap counts users who pass the unverified-app screen, 100 in total.
- The browser token model issues an access token that lasts about an hour, with no refresh token; a new one needs a user action.

## Decision

Sign-in asks only for name and email. Gmail is connected separately, in the browser, with Google Identity Services' token model and the `gmail.readonly` scope. The access token is held in memory, used to call the Gmail API directly from the browser, and discarded. Our servers never see a Google token or an email.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Browser scan, short-lived token (chosen) | No Google token stored anywhere; a breach of our database exposes no inbox; both copy promises hold by construction; the 7-day question no longer matters | Scans only while the app is open; the user clicks Scan each time and may see Google's small account window; a first scan is paced by Gmail's per-user limit |
| Server scan with a stored refresh token | Background and scheduled scans | We would hold long-lived keys to up to 100 inboxes; email text would pass through our server; depends on refresh tokens behaving as documented |

## Consequences

- No background scanning in release 1. If release 2 wants it, this decision is revisited, together with Google verification.
- "Later scans read only new mail" is done by storing the time of the last scan and adding it to the search query.
- Disconnecting revokes the grant with Google; there is nothing on our side to delete.
- The token is exposed to any script on the page, so the app ships a strict content security policy and no third-party scripts except Google's.
- Not yet tested for real: whether the warning screen reappears after 7 days. To be checked on day 8 once the Google project exists.

## Sources

- https://developers.google.com/identity/protocols/oauth2#expiration
- https://support.google.com/cloud/answer/15549945 (publishing status, test users, user cap)
- https://support.google.com/cloud/answer/7454865 (unverified apps, 100 new users)
- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/workspace/gmail/api/reference/quota (6,000 units a minute per user; a full message costs 60)
