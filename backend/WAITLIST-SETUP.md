# Waitlist + contact form backend - decision and enable path

Written 2026-08-22 by the yamine-site seat. This branch (`forms-backend`) is
COMPLETE and ready to flip; nothing on it is served until it merges to main.

## The recommendation: Google Apps Script in the company's own Workspace

yamine.app's mail already runs on Google Workspace (MX smtp.google.com;
mohamed@yamine.app is the mailbox and developers@ provably delivers to it).
A tiny Apps Script web app deployed FROM that account gives the site a real
HTTPS endpoint with:

- **no new vendor**: the only processor is Google, which already holds the
  domain's mail - the privacy policy's "providers that run our email and
  website infrastructure" line covers it as written;
- **no DNS change, no payment, no new account**;
- **first-party data**: waitlist emails land in a Google Sheet in the
  company's own Drive; contact messages additionally arrive in the mailbox
  as email with reply-to set;
- both the waitlist AND the contact form served by one endpoint.

Rejected alternatives: form-backend SaaS (Formspree etc.) adds a third-party
processor holding the very data a privacy-led brand collects, plus a
signup; Cloudflare Worker+KV is clean engineering but adds an account and a
vendor for no gain at this volume; an estate-hosted endpoint couples a
consumer product to the internal server and the public 443 funnel is broken.

## What the owner has to do (about 10 minutes, once)

1. Signed in as mohamed@yamine.app, open script.new
2. Paste `backend/apps-script.gs` over the default file, save
3. Deploy > New deployment > type "Web app" > execute as **Me**,
   who has access **Anyone** > Deploy > authorise > copy the `/exec` URL
4. Hand the URL back (via Lelouch); the seat then puts it in
   `assets/forms.js` ENDPOINT, merges this branch to main, and verifies
   the live forms end to end

First submission auto-creates the sheet "Yamine site forms" (tabs:
waitlist, messages) in My Drive. Waitlist is deduped by email. A honeypot
field absorbs naive bots; worst case is junk rows in a sheet.

## Fail-safe behaviour

`assets/forms.js` keeps every form `hidden` while ENDPOINT is empty and the
mailto fallbacks stay visible - merging this branch early changes nothing
user-visible. The forms only appear once a working endpoint is wired.

## Mail alias (related decision)

hello@yamine.app: Google Workspace supports free aliases (Admin console >
Users > mohamed > Alternate email addresses). No DNS change. Optional
send-as in Gmail settings so replies can come FROM hello@. The site
currently publishes developers@/support@/privacy@, which deliver.
