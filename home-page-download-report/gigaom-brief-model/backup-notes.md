# GigaOm Brief modal — change log and backup notes

Date: 12 Nov 2026 · Site: cybrhawk.com (live)

## What changed

Clicking **Download GigaOm Brief** in the homepage corner popup now opens a modal on the same page, with no redirect and no instant download. The modal asks for the same details as the FortiBleed form on /download-report/:

- First name and last name (letters only, 2–50 characters)
- Business email (Gmail, Yahoo, Outlook, temp-mail and similar addresses are blocked)
- Company name
- Phone (digits only, 7–15)
- Terms checkbox

When the visitor submits, it does what the FortiBleed form does:

1. Sends the lead to Contact Form 7, which emails the team.
2. Starts downloading `CybrHawk-Perspective-Brief.pdf`.
3. Shows a "Your download is starting" screen with a "Download it manually" link.

## Where the code lives (3 new items, 0 existing items edited)

| # | What | Where in WP admin | ID | Public file |
|---|------|-------------------|----|-------------|
| 1 | **CSS**: "GigaOm Brief Modal" | Custom CSS & JS → All Custom Code | 18770 | /wp-content/uploads/custom-css-js/18770.css |
| 2 | **JS**: "GigaOm Brief Modal" | Custom CSS & JS → All Custom Code | 18771 | /wp-content/uploads/custom-css-js/18771.js |
| 3 | **CF7 form**: "GigaOm Brief Download" | Contact → Contact Forms | 18769 | n/a (REST endpoint only) |

Settings for #1 and #2: Linking = Internal, Where in site = Frontend, Priority = 5. The CSS goes in the header and the JS in the footer.

CF7 form #3 is a duplicate of "Download Report" (17361). It has the same fields and the same two recipients, but the subject is **"New GigaOm brief download — CybrHawk"** and the email heading is **"New GigaOm Brief Download Request"**, so the team can tell the two downloads apart. It doesn't need to be embedded on any page because the modal posts to it through the CF7 REST API.

Local copies (byte-identical to what is live):

- `gigaom-brief-modal.js`
- `gigaom-brief-modal.css`

## Not touched

- "CybrHawk Homepage Popup" JS (17420) and CSS (17421)
- "Download Report Page" JS (17033) and CSS (17032)
- CF7 "Download Report" (17361)

The FortiBleed button still links to /download-report/.

## Rollback

Deactivate items #1 and #2 in Custom CSS & JS. The GigaOm button then goes back to downloading the PDF directly, as it did before, because the popup's own code was never changed.

## Editing later

At the top of the JS (18771), in the `Config` block, you can change:

- `PDF_URL`: point to a new PDF
- `CF7_FORM_ID`
- `COPY`: all the modal text

Any button anywhere on the site can open the same modal. Add `data-gigaom-brief` to it, or use `href="#gigaom-brief"`.

The browser console API is `cybrhawkGigaomModal.open()` / `.close()`.

The dataLayer events are `cybrhawk_gigaom_modal_open` and `cybrhawk_gigaom_brief_submit`. The popup's existing `cybrhawk_popup_click` event still fires.