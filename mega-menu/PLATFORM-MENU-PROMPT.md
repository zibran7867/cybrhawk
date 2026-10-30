# Restructure the "Platform" mega-menu panel: `mega-menu/mega-menu.js`, `mega-menu/mega-menu.css`

## 1. The job

The **Platform** panel in the main navigation lists nine products flat across three columns. Turn it into a product tree that is three levels deep and opens on hover:

- **Level 1:** four products, in a fixed order.
- **Level 2:** the six capabilities under Hawk UCD.
- **Level 3:** each capability's own pages.

Every item that has children shows a **hamburger icon (☰)**, and hovering the item opens its children. Every label stays a normal link that goes to its page, and that includes Hawk UCD and all six capabilities.

**Keep the theme.** Add no new colours, fonts, sizes, radii, shadows or motion. The panel background, its full-bleed positioning, the top navigation bar and every other panel must look exactly as they do now.

Edit only `mega-menu/mega-menu.js` and `mega-menu/mega-menu.css`, and add `mega-menu/preview.html` (§8). Don't touch `mega-menu/mega-menu-backup/`.

---

## 2. How the menu works today. Read this before writing anything

- The site runs on WordPress with the **Max Mega Menu** plugin. The plugin prints the markup inside `#mega-menu-wrap-main-menu`, and we ship only JS and CSS on top of it. **The WordPress menu is the source of truth for labels, URLs and nesting.**
- `mega-menu.js` is an ES5 IIFE that uses jQuery. `boot()` waits for jQuery and the menu, then `init()` runs a series of numbered steps once, guarded by `data("megaInit")`.
- **Step 1b** rebuilds every panel into columns. `PANEL_LAYOUTS` maps link labels to columns. Labels are normalised with `norm()` and matched by prefix in `positionIn()`. Its first entry is the current Platform layout.
- **Step 2** writes each row's count of `.mega-menu-column`s into `--mega-cols`, and **hides any row where it counts zero**. **Step 2b** injects spacer captions.
- **Step 5** positions every panel full-bleed. Leave it alone.
- `mega-menu.css` beats the plugin's CSS with `#mega-menu-wrap-main-menu …` selectors and `!important`, which is normal in this file. **The light overrides at the end of the file are the live theme.** The block marked "Duplicate block below — kept untouched per request" stays untouched.

---

## 3. Target structure

```
The Platform                                          (top-nav item, unchanged)
├── Hawk UCD  ☰                                       → UCD page
│   ├── SIEM XDR  ☰                                   → its page
│   │   └── …its pages, from WordPress
│   ├── SIEM NDR  ☰
│   ├── SIEM Cloud  ☰
│   ├── Incident Response  ☰
│   ├── ITDR (Identity Threat Detection & Response)  ☰
│   └── OT Security Monitoring  ☰
├── HawkINT                                           → https://cybrhawk.com/ai-powered-threat-intelligence-platform/
├── HawkStrike                                        → HawkStrike page (URL to come)
└── HawkOps                                           → https://cybrhawk.com/enterprise-operations-intelligence/
```

Rules:

- **The level 1 order is fixed:** Hawk UCD, then HawkINT, then HawkStrike, then HawkOps. **The level 2 order under Hawk UCD is also fixed**, as shown above. Enforce both orders in JS by label, so they still hold if someone drags items around in wp-admin. This works the same way as `PANEL_LAYOUTS`. Any item not in the list goes at the end, in WordPress order.
- **Level 3 comes from WordPress unchanged.** Don't hard-code it.
- **A hamburger appears only on an item that has children** in the rendered menu, never on a leaf. If HawkINT, HawkStrike or HawkOps get children later, they get a hamburger and the same behaviour with no code change.
- Use the labels exactly as written above: "SIEM", and "ITDR (Identity Threat Detection & Response)".

---

## 4. WordPress menu setup (done by hand in wp-admin)

The code can't do this part. List these steps in the PR description.

In **Appearance → Menus → main menu**, under **The Platform**:

1. Add a custom link **Hawk UCD** that points to the UCD page, as the first child of The Platform.
2. Move SIEM XDR, SIEM NDR, SIEM Cloud, Incident Response, Identity Threat Detection and OT Security Monitoring under Hawk UCD, in that order. Rename Identity Threat Detection to "ITDR (Identity Threat Detection & Response)".
3. Put each capability's own pages under that capability.
4. Leave HawkINT, HawkStrike and HawkOps as direct children of The Platform, in that order.

Then inspect the live DOM. Every level must render as nested `li.mega-menu-item > ul.mega-sub-menu`. **If Max Mega Menu doesn't render the deepest level (The Platform → Hawk UCD → SIEM XDR → page), stop and report it.** Don't fake it with hard-coded links.

---

## 5. Behaviour

### Desktop (wider than 768px, on a device that can hover)

The panel shows **cascading columns**. Column 1 lists level 1. Column 2 shows the children of the active level 1 item, and column 3 shows the children of the active level 2 item.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Hawk UCD        ☰ │ SIEM XDR             ☰ │ <SIEM XDR page 1>           │
│ HawkINT           │ SIEM NDR             ☰ │ <SIEM XDR page 2>           │
│ HawkStrike        │ SIEM Cloud           ☰ │ <SIEM XDR page 3>           │
│ HawkOps           │ Incident Response    ☰ │                             │
│                   │ ITDR (…)             ☰ │                             │
│                   │ OT Security Monitor. ☰ │                             │
└──────────────────────────────────────────────────────────────────────────┘
   column 1            column 2                  column 3
```

- **Hovering opens.** Hovering anywhere on a row that has children, on the label or on the hamburger, makes that row active and shows its children in the next column. Any open sibling closes. The row stays highlighted while its children are open, so the visitor can see the path they're on. The whole row is the trigger because a 16px icon is too small to aim at. The hamburger is the visual cue that children exist.
- **Clicking navigates.** Clicking a label always follows its link. Clicking a hamburger toggles that item's children and never navigates.
- **Hover intent.** Switching the active row to a sibling waits about 120ms, and the switch is cancelled if the pointer reaches the open child column first. Without this, a diagonal move from Hawk UCD down to OT Security Monitoring passes over HawkINT and flips the menu.
- **Default state.** When the panel opens, Hawk UCD is active and its six children are showing, so the panel never opens on empty space. Nothing deeper is open. When the panel closes, reset to this state.
- **No layout shift.** Columns have fixed widths, about 260px each (column 1 can be narrower), and sit left-aligned in the panel. Opening column 3 never moves columns 1 or 2. After the build, set the height of the panel's content once, to fit the tallest list in the tree, so that opening a list never changes the panel's height.
- **Reveal.** A column that opens fades in with a 4px slide over 0.2s, eased. The file's existing `prefers-reduced-motion` rule already shortens this. Keep that.

### Touch devices (no hover)

Tapping the hamburger toggles the children, and tapping the label navigates. Gate the hover handlers with `matchMedia("(hover: hover) and (pointer: fine)")`. Don't sniff the user agent.

### Mobile (768px and narrower, in the plugin's mobile menu)

The columns become a nested accordion. Children open beneath their parent, indented 12px per level. The hamburger toggles and the label navigates. Opening a list closes any open sibling. Every touch target is at least 44×44px.

Max Mega Menu's mobile mode can swallow the first tap on a parent link that has children. Check whether it does. If it does, fix it with the plugin's mobile setting rather than working around it in JS, and name the setting in the PR.

### Keyboard and screen readers

- The hamburger is a real `<button type="button">` placed right after the label link. It has `aria-expanded`, an `aria-controls` that points at the child list's `id`, and an `aria-label` such as "Show SIEM XDR pages" or "Hide SIEM XDR pages".
- **Keep the WordPress nesting in the DOM.** The child `ul` stays inside its parent `li`, and CSS places it in its column. Tab order then follows the tree: a label, its button, its open children, then the next sibling. Don't move child lists into separate column elements.
- Give closed lists the `hidden` attribute rather than just making them transparent, so nobody can tab into them.
- Enter or Space on a button toggles it. Escape closes the deepest open list and returns focus to that list's button. Focus entering a row (`focusin`) opens it the same way hover does.
- On `:focus-visible`, use the site's focus ring: `outline: 3px solid rgba(12,104,255,.4); outline-offset: 3px`.

---

## 6. Visual spec: reuse the current light theme

Every value below already exists in the light overrides at the end of `mega-menu.css`. Use them and add no new ones.

| Element | Style |
|---|---|
| Panel | Unchanged: `#f1f5f9` with the two radial gradients, full-bleed, current padding |
| Level 1 rows (Hawk UCD, HawkINT, …) | The current section-heading style: 14px, weight 700, `#0f172a`, padding 8px 10px, 8px radius |
| Level 2 and 3 rows | The current link style: 13.5px, weight 500, `#475569`, padding 7px 10px, 8px radius |
| Hover **and active** row | The current hover style: background `rgba(2,132,199,0.08)`, text `#0369a1` on level 1 and `#0f172a` on levels 2 and 3. An active row looks the same as a hovered one, so the open path stays lit. |
| Column dividers | 1px, `rgba(15,23,42,0.10)` |
| Hamburger | An inline SVG of three horizontal lines, 16×16 inside a 28×28 button (44×44 on touch), with `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and `aria-hidden="true"`. Opacity is 0.65 at rest and 1 on hover or when active, matching the existing `.mega-indicator`. It sits at the right end of the row and the label takes the remaining width. The button has no background or border of its own. |
| Transitions | 0.2s ease, the same as the existing rows |

- Remove the existing `translateX(3px)` hover nudge from rows inside the tree. A row that stays active shouldn't stay shifted.
- Keep font weights at 700 or below. The site loads Figtree only up to 700.

---

## 7. Implementation notes

### JS (`mega-menu.js`)

Match the file's style: ES5 with `var`, jQuery as `$`, numbered step comments that explain *why*, and `norm()` for labels.

- Find the Platform panel by its top-nav label (`norm()` equal to `"the platform"` or `"platform"`), not by its position.
- **Remove the old Platform entry from `PANEL_LAYOUTS`.** If it stays, its keys `hawkint`, `hawkstrike` and `hawkops` still score at least 2 hits in `layoutFor()` against the new level 1, and step 1b forces the old three-column grid onto the tree. Skip the Platform panel in step 1b and build it in a new step 1c.
- Put both orders in one config block near the top of `init()`, with prefix matching like `positionIn()`:
  `PLATFORM_ORDER = ["hawk ucd", "hawkint", "hawkstrike", "hawkops"]`
  `UCD_ORDER = ["siem xdr", "siem ndr", "siem cloud", "incident response", "itdr", "identity threat detection", "ot security monitoring"]`
  `"identity threat detection"` is a fallback key so the old WordPress label still sorts correctly.
- Reorder by detaching and re-appending the `li`s inside their own parent `ul`. Don't rebuild the markup.
- Keep the panel inside the existing `.mega-menu-row > .mega-sub-menu > .mega-menu-column` structure, and add a scoping class to the panel, such as `mega-platform-tree`. Step 2 hides any row where it counts zero columns, so either keep a `.mega-menu-column` in the rebuilt row or skip the Platform panel in steps 2 and 2b.
- Delegate the hover, focus, click and keydown handlers from the panel, namespace them `.megaPlatform`, and bind them once. Track state with classes (`is-active` on the `li`, `hidden` on the `ul`), not inline styles.
- Reset to the default state when the panel closes, which is when the top-level `li` loses `mega-toggle-on` or receives `mouseleave`.
- Pass labels through the existing `escapeAttr()` when you build `aria-label`s.
- Bump the console marker to `"[mega-menu] script v3 loaded"` so the live build is easy to confirm.

### CSS (`mega-menu.css`)

- Append one new block at the **end** of the file, with a comment header. Scope every selector under `#mega-menu-wrap-main-menu .mega-platform-tree`. Don't edit any earlier block.
- Earlier rules force `.mega-menu-column > .mega-sub-menu` to `display: block !important`, and a long, high-specificity selector adds `padding-left: 20px` to nested links. The new rules need enough specificity, plus `!important` wherever the old rule has it, to win. Hide closed lists with `[hidden] { display: none !important; }`.
- Lay out the columns like this. Each tree `ul` gets a fixed width. The level 1 `ul` is `position: relative`. Every `li` stays `position: static`. Each child `ul` is `position: absolute; top: 0; left: 100%`, so it lines up with the top of the column before it rather than with its parent row.
- At 768px and narrower, return to static flow for the accordion, indented 12px per level.

---

## 8. `mega-menu/preview.html`: local preview harness

- Copy the real `#mega-menu-wrap-main-menu` markup from the live page source of cybrhawk.com into a static page. Change only the Platform part, to match §3, and put 2 or 3 placeholder pages under each capability.
- Link the live Max Mega Menu stylesheet; its URL is in the page source, under `maxmegamenu`. Load jQuery 3.7.1 from cdnjs, then `mega-menu.css` and `mega-menu.js`.
- The plugin's own JS isn't on the page, so add a shim of about 10 lines that toggles `mega-toggle-on` on the top-level items on hover. Mark it clearly as preview-only.
- Shuffle the order of the Platform items in the preview markup, so that the ordering code is actually tested.

---

## 9. Don'ts

- Don't change any colour, font, size, radius, shadow or animation outside the Platform tree.
- Don't touch the other panels, the Awards band on Resources, or the step 5 positioning.
- Don't hard-code level 3 items or any URL in JS. They come from WordPress.
- Don't use the plugin's `.mega-indicator` as the hamburger, because the CSS hides it on nested items. Insert your own button.
- Don't give the new button a class with "menu-toggle" in it, because the plugin's own mobile hamburger is `.mega-menu-toggle`. Use a distinct class such as `mega-tree-toggle`.
- Don't use ES6 syntax and don't add libraries.

---

## 10. Acceptance checklist

- [ ] Level 1 reads Hawk UCD, HawkINT, HawkStrike, HawkOps, even after the preview markup is shuffled.
- [ ] Under Hawk UCD: SIEM XDR, SIEM NDR, SIEM Cloud, Incident Response, ITDR (Identity Threat Detection & Response), OT Security Monitoring.
- [ ] Hawk UCD and every capability with children have a hamburger. No leaf has one.
- [ ] The panel opens with Hawk UCD active and its six items showing, and opens in that state again after it closes.
- [ ] Hovering a capability shows its pages in column 3 within about 150ms. A diagonal move from Hawk UCD to OT Security Monitoring doesn't flip the menu to HawkINT.
- [ ] Columns 1 and 2 never move, and the panel height never changes, while hovering.
- [ ] Clicking Hawk UCD or any capability label navigates. Clicking any hamburger doesn't.
- [ ] With the keyboard only, every link can be reached, Enter and Space toggle, Escape closes the list and returns focus, and `aria-expanded` is always correct.
- [ ] Touch (DevTools device mode): tapping a hamburger expands it, and tapping a label navigates.
- [ ] At 768px and narrower: a nested accordion with 44px targets and no horizontal scroll.
- [ ] Every other panel, including Resources with its Awards band, matches before-and-after screenshots.
- [ ] No console errors, and the console shows `[mega-menu] script v3 loaded`.
