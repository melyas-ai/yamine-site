# Waitlist + contact form backend - current state and upgrade path

Updated 2026-08-22 (forms went live). History: this branch originally staged an
Apps Script route; the owner's consent landed 22 Aug but the per-user Apps
Script API toggle blocked deployment, so the live backend is the Google Forms
route below, built estate-side. `apps-script.gs` in this folder is the READY
upgrade variant if the owner ever flips script.google.com/home/usersettings.

## Live backend (since 2026-08-22 ~16:00 London)

Two publicly-respondable Google Forms owned by mohamed@yamine.app:

- **waitlist** - one field (Email). The site POSTs form-encoded to the form's
  /formResponse URL with the field's entry id.
- **contact** - Name, Email, Message, same pattern.

The post URLs and entry ids live in `assets/forms.js` and are public by
nature (every visitor's browser sees them); no secret exists in this repo.
Responses land in the forms (and their linked sheets, if the owner links
them) inside the company's own Workspace - no new vendor.

Client behaviour (`assets/forms.js`): forms un-hide only when configured;
mailto fallbacks show whenever JS or config is absent; a honeypot field makes
bots "succeed" without any POST; a failed POST restores the button and points
at the mailto address.

Note on responses: Google Forms accepts any POST with valid entry ids -
the browser cannot read the response cross-origin (no-cors), so the UI
treats a completed fetch as success. Delivery was proven end to end at
build time (test POST returned 200 and was read back via the Forms API).

## Test rows to ignore

Rows marked with e2e-test addresses/messages dated 2026-08-22 are wiring
tests from the build, noted in the fleet report.
