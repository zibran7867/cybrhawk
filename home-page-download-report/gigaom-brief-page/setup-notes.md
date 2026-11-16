# GigaOm Brief page — setup and rollback notes

Site: cybrhawk.com · New URL: **/gigaom-brief/**

## What changes

Clicking **Download GigaOm Brief** in the homepage corner popup no longer opens a modal. It takes the visitor to a new page, **/gigaom-brief/**, built the same way as the FortiBleed page at /download-report/: copy on the left, form card on the right.

The form is the same one the modal used:

- First name and last name (letters only, 2–50 characters)
- Email: any address is accepted, including Gmail, Yahoo and Outlook. Only throwaway inboxes like mailinator or yopmail are rejected. The field is still named `business_email` to match CF7 form 18769.
- Company name
- Phone (digits only, 7–15)
- Terms checkbox

On submit it sends the lead to CF7 form **18769** ("GigaOm Brief Download"), which emails the team, starts downloading `CybrHawk-Perspective-Brief.pdf`, and shows "Your download is starting" with a manual link.

## Files

| File | Goes into |
|------|-----------|
| `gigaom-brief-page.html` | Elementor **HTML widget** on the new page |
| `gigaom-brief-page.css` | Custom CSS & JS → new **CSS** snippet "GigaOm Brief Page" |
| `gigaom-brief-page.js`  | Custom CSS & JS → new **JS** snippet "GigaOm Brief Page" |

Also changed in this repo:

- `home-page-popup/home-page-popup.js`: `BRIEF.href` now points to `https://cybrhawk.com/gigaom-brief/` (was the PDF). Paste it into "CybrHawk Homepage Popup" JS (17420).
- `home-page/home-page-snippet.php`: the modal snippets 18770 and 18771 move to a new `'none'` target, so they load nowhere. There is also a commented-out rule for the new page.

## Setup steps (in this order)

1. **Create the page.** Pages → Add New → title "GigaOm Brief", slug `gigaom-brief`. Open it in Elementor and copy the layout of /download-report/ (same template, header and footer).
2. **Add the section.** Add a Container. Under Advanced → CSS Classes, enter `gigaom-brief-page`. Inside it, add an **HTML** widget and paste in all of `gigaom-brief-page.html`. Use the HTML widget, not Text Editor, because Text Editor adds `<p>`/`<br>` tags. Publish. If the container class is missing, the JS adds `gigaom-brief-page` to the container around the form. Set it anyway, so the background is there before the JS runs.
3. **Add the CSS snippet.** Custom CSS & JS → Add CSS Code, title "GigaOm Brief Page", paste `gigaom-brief-page.css`. Linking = Internal, Where = Frontend, Position = Header. Publish and note its ID.
4. **Add the JS snippet.** Custom CSS & JS → Add JS Code, title "GigaOm Brief Page", paste `gigaom-brief-page.js`. Linking = Internal, Where = Frontend, Position = Footer. Publish and note its ID.
5. **Update the loader.** In `home-page-snippet.php`, uncomment the `/gigaom-brief/` rule and fill in the two IDs. Paste the whole file into Code Snippets. This also stops the old modal (18770 / 18771) from loading.
6. **Update the popup.** Paste the new `home-page-popup.js` into "CybrHawk Homepage Popup" JS (17420).
7. **Retire the modal.** Deactivate "GigaOm Brief Modal" CSS (18770) and JS (18771) in Custom CSS & JS. Step 5 already keeps them off every page, so this is just housekeeping.
8. **Purge the cache.** LiteSpeed Cache → Purge All.

Steps 5 and 7 matter. While the old modal JS (18771) is still loading, it catches the popup button click and opens the modal instead of following the link.

## Test

- Homepage → wait for the corner popup → **Download GigaOm Brief** goes to /gigaom-brief/ in the same tab, with no modal.
- Submit the form empty. Every field shows an error.
- Submit with a Gmail address. It is accepted.
- Submit with a `@mailinator.com` address. It shows "Please use a permanent email address".
- A valid submit starts the PDF download, shows the success card, and the team gets the "New GigaOm brief download — CybrHawk" email.
- Check at phone width. The form stacks under the copy and the button is full width.

## Copy to check

The left column was written without reading the PDF, which is copy-protected. The four "What's inside" bullets are general. Check them against the brief and edit them in the HTML widget if anything doesn't match. "10 pages" is taken from the PDF's page count.

## Analytics

- On submit, the page fires `cybrhawk_gigaom_brief_submit`, the same event name the modal used, plus `form_location: "gigaom_brief_page"`.
- The popup's `cybrhawk_popup_click` event (with `popup_cta: "gigaom_brief"`) still fires, and `popup_href` is now the page URL.
- `cybrhawk_gigaom_modal_open` no longer fires.

## Rollback

1. Restore the old `BRIEF.href` (the PDF URL) in popup JS 17420.
2. To bring the modal back, move 18770 and 18771 from `'none'` back to `'front'` in the loader and reactivate them.
3. Purge LiteSpeed.

The /gigaom-brief/ page can stay published. Nothing links to it once the popup is reverted.
