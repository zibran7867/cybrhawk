# Build the CybrHawk Incident Response page: `incident-response/incident-response.{js,css,html}`

## 1. The job

Build the **Incident Response (CybrHawk IR One)** page for `https://cybrhawk.com/incident-response/`. It covers sections 01–10 of the approved copy. That copy is in **Appendix A**, word for word, already shaped for the CONTENT block.

**Out of scope: section 11 (FAQ) and section 12 (final call to action).** Don't build them, and don't leave placeholders for them in the JS or CSS. Section 10 ends the page you build. It must end on white with its normal bottom padding, so whatever the editor puts next joins without a seam.

| File | Status | What goes in it |
|---|---|---|
| `incident-response/incident-response.js` | exists, empty | Builds all 10 sections, each into its own Elementor container |
| `incident-response/incident-response.css` | exists, empty | Every style for the page, scoped to those containers |
| `incident-response/incident-response.html` | **create** | Local preview harness (not deployed) plus the Elementor setup notes (§9) |

Don't edit anything outside `incident-response/`.

---

## 2. Read these before writing anything

The site runs on WordPress and Elementor. **The Elementor container markup is fixed, so we ship only JS and CSS.** The script finds an empty container by its CSS class, injects the section's markup, and the CSS styles that markup.

| Read | For |
|---|---|
| `udc/udc.js` + `udc/udc.css` | **The reference build. Copy its architecture exactly:** `SECTIONS` map, CONTENT block, `ICONS` + `icon()`, `esc` / `nl2br` / `markup` / `pad`, `head()`, `button()`, `mount()`, `media()` with `iconFallback()`, per-builder try/catch in `buildAll()`, `reveal()`, `init()` with the 10 s MutationObserver, `heroMotion()` (pause off screen and on hidden tab). Its `ICONS` map already has: `shield globe crosshair dashboard headset bank factory derrick network pylon droplet bolt truck medical city coins graduation endpoint cloud identity award file-check lock hourglass alerts timer layers cloud-shield bot plug radar link decide eye pulse shield-refresh clock check plus`. Reuse those glyphs. |
| `udc/UCD-PAGE-PROMPT.md` §2 "House conventions" | The JS and CSS rules. **They all apply here unchanged.** The summary in §3 below is a reminder, not a replacement. |
| `enterprise-operations-intelligence/how-it-works/how-it-works.{js,css}` | Pipeline connectors drawn in CSS, which turn vertical on mobile. **Section 05 builds on this.** |
| `enterprise-operations-intelligence/walkthrough-cta/walkthrough-cta.{js,css}` | Primary and ghost buttons with the SVG arrow |
| `HawkINT/hawk-int.css` | **Dark surfaces.** The console frame (`.hk-about__console`), the live dot (`--hk-live`), the severity tokens (`--hk-sev-high/med/low`), the mono stack (`--hk-mono`), the decoration layer (`aria-hidden`, `overflow: clip`), and the header-overlay note (`--hk-hr-bar`). Sections 01, 02, 05 and 07 are dark and borrow this idiom. |

`enterprise-operations-intelligence/seconn-section/` is the exception: static HTML and ES6. **Don't copy its style.**

---

## 3. House conventions (summary; `udc/UCD-PAGE-PROMPT.md` §2 is the authority)

- **JS:** one IIFE, `"use strict"`, **ES5 only**: `var`, `function` and string concatenation. No arrow functions, template literals, `let`/`const`, classes or modules. Open the file with a comment block, then the `SECTIONS` map, then a **"Content (edit freely)"** block holding every visible string, URL and toggle. Every CONTENT string goes through `esc()` (or `markup()`/`nl2br()`) before it reaches HTML. Builders are idempotent. A missing container or a throwing builder skips only that section.
- **CSS:** scope every rule under a section container class, with no bare element selectors and no global rules (the one documented exception is in §6.1). Declare tokens once on `.ir-section`. Use `box-sizing: border-box` and `font-family: inherit`. Gutter is 24px, 22px at ≤980px and 18px at ≤520px. Reset `.e-con-inner` padding and max-width inside IR containers, the way udc.css does. Don't use `!important` without a comment saying why.
- **Figtree loads only up to weight 700.** Never use 800 or 900, because they fall back to Helvetica.
- **Icons:** inline SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and joins, `aria-hidden="true"`.
- Comments explain *why*. Match the comment density of udc.js.

---

## 4. Design direction: "the page is an incident, resolved"

Most IR pages look like every other security page: navy, blue gradient, a padlock, a grid of identical cards. This one should feel like **an incident command room** that calms down as you scroll. The page tells the incident lifecycle top to bottom, and the **colour temperature carries the story**:

| Stage | Sections | Tone | Meaning |
|---|---|---|---|
| Alarm | 01 Banner, 02 Hero (line 1), 03 Why it matters | `alert` (red) | Something is happening |
| Response | 04 Services, 05 Process, 06 Incidents | `amber` → `blue` | Responders engaged, threat being contained |
| Control | 07 Platform, 08 Industries, 10 Why CybrHawk | `blue` | Visibility and control |
| Readiness | 09 Readiness & Retainer | `green` | Prepared before the next one |

Every section root sets one `--ir-tone` custom property. The section's eyebrow dot, small markers and focus details read from it, so the shift happens without extra markup.

**Red means "active incident" and nothing else.** Use it only for the banner, the first hero line, the emergency CTA, the risk markers in 03 and step 1 of 05. Never use it for decoration, hover states or generic emphasis. The site blue `#0c68ff` stays the main brand accent everywhere else.

### 4.1 Typography

- **Figtree** (the site font, 400–700) for everything a reader reads. Don't load another web font: the live site already loads Figtree, and an extra font is another network request on a page people open mid-crisis.
- The page's character comes from a second voice: a **monospace "incident record" voice** using the `--hk-mono` system stack (`ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`). It needs no download. Use it **only** for eyebrows, step and service numbers ("01"), status chips and the hero visual's labels. Never use it for body copy or headings.
- Scale contrast is what makes the page look designed:
  - **H1:** `clamp(40px, 5.4vw, 76px)`, weight 700, line-height 1.02, letter-spacing −0.03em
  - **H2:** `clamp(30px, 4vw, 50px)`, weight 700, line-height 1.1, letter-spacing −0.02em, `text-wrap: balance`
  - **Eyebrow (mono):** 12.5px, weight 600, uppercase, letter-spacing 0.14em, preceded by an 8×8px square in `--ir-tone` (a status light, not a gradient line, so this page doesn't repeat HawkINT)
  - **Body:** `clamp(16px, 1.3vw, 18px)`, line-height 1.65, `text-wrap: pretty`

### 4.2 Backgrounds

Each section gets a ground with depth, not a flat fill. No two neighbouring sections share a background.

| # | Section | Ground |
|---|---|---|
| 01 | Banner | `--ir-night` `#080b1a` with a 1px bottom hairline in `rgba(255,107,107,.35)` |
| 02 | Hero | Dark: `#080b1a` → `#0d1330`, a faint 48px line grid masked to fade out toward the edges, a red glow off the top left (`rgba(217,45,45,.18)`) and a blue glow off the bottom right (`rgba(12,104,255,.22)`). The glows are alarm becoming control. |
| 03 | Why it matters | White |
| 04 | Services | Tint `#f8f9fd` plus a faint top radial |
| 05 | Process | Dark `#0d1330` with a fine diagonal hatch at 3% opacity |
| 06 | Incidents | White |
| 07 | Platform | Dark `#080b1a` plus a single blue glow behind the visual |
| 08 | Industries | White |
| 09 | Readiness | Calm gradient `#f3f8ff` → `#eef7f2`, a blue-to-green wash |
| 10 | Why CybrHawk | **White.** It is the last section built here. |

All decoration sits in an `aria-hidden` layer with `pointer-events: none`. Any section whose decoration bleeds past its edges gets `overflow: clip`.

### 4.3 Motion: one orchestrated moment, then quiet

- **Page load (hero only):** a staggered reveal using `animation-delay`. Eyebrow at 0 ms, H1 line 1 at 80 ms, H1 line 2 at 180 ms, subheadline at 280 ms, buttons at 360 ms, trust strip at 440 ms, visual at 300 ms. The visual's loop starts after its reveal ends. Each item fades up 16px over 0.7s on `cubic-bezier(.22,1,.36,1)`.
- **Section 05:** when it scrolls into view, the timeline line *draws* (`scaleX` 0 → 1 over about 1.6s, or `scaleY` on mobile). Each step's node lights up as the line reaches it, with step delays of `i × 0.22s`. It runs once.
- **Everything else:** the standard udc reveal (`opacity 0 → 1`, `translateY(20px) → none`, staggered by an inline `--i`).
- **Micro-interactions:** buttons lift 2px. Linked cards lift 4px. The banner's live dot pulses. Nothing else moves on its own.
- **Animate only `transform` and `opacity`.** Don't use scroll listeners. Under `prefers-reduced-motion: reduce`, show everything at once, play no loops and apply no hover translate.

### 4.4 Avoid

- Padlocks, hooded hackers, globes with glowing lines, binary rain, and purple gradients
- Twelve identical white cards in a row. **Each section's layout must differ from the section above it.**
- Fake telemetry with invented hostnames, IPs or numbers. The hero visual uses only words from the copy (§6.2).
- Invented statistics, response-time promises ("15-minute response"), customer logos, certifications, testimonials or "recommended" badges

---

## 5. Design tokens: declare them once, on `.ir-section`

These are starting values. **Verify every text pair**: 4.5:1 for text, 3:1 for UI parts and graphics. Note each measured ratio in a comment, as udc.css does.

```css
/* Brand */
--ir-accent:        #0c68ff;   /* site blue: fills, buttons, large display */
--ir-accent-hover:  #0a58d6;
--ir-accent-ink:    #0a58d6;   /* blue AS TEXT on light grounds */
--ir-accent-soft:   #eaf2ff;
--ir-accent-on-dark:#6ea8ff;   /* blue AS TEXT on dark grounds */

/* Incident tones: each one has a fill, a light-ground ink and a dark-ground ink */
--ir-alert:         #d92d2d;   /* emergency button fill; white text on it ≈5:1 */
--ir-alert-ink:     #c42525;   /* on white */
--ir-alert-on-dark: #ff7a7a;
--ir-amber:         #b96c00;   /* on white ≈5.4:1 */
--ir-amber-on-dark: #f5b041;
--ir-green:         #087a4a;   /* NOT #0b8f57: that is ≈4.1:1 on white and fails small text */
--ir-green-on-dark: #34d399;

/* Neutrals */
--ir-heading:       #0d1330;
--ir-text:          #5b6478;
--ir-night:         #080b1a;
--ir-night-2:       #0d1330;
--ir-on-dark:       #ffffff;
--ir-on-dark-body:  #c3cadb;
--ir-on-dark-muted: #9aa3bd;   /* nothing dimmer than this for real copy on dark */
--ir-bg:            #ffffff;
--ir-bg-tint:       #f8f9fd;
--ir-border:        #e6eaf2;
--ir-border-dark:   rgba(255,255,255,.10);
--ir-rule:          #edf0f6;

/* Shape and space */
--ir-shadow:        0 1px 2px rgba(13,19,48,.04), 0 8px 24px rgba(13,19,48,.05);
--ir-shadow-hover:  0 2px 4px rgba(13,19,48,.05), 0 16px 38px rgba(13,19,48,.10);
--ir-radius:        16px;
--ir-radius-sm:     10px;
--ir-measure:       1320px;
--ir-gutter:        24px;      /* 22px ≤980px, 18px ≤520px */
--ir-pad-y:         clamp(56px, 7vw, 96px);
--ir-gap:           clamp(16px, 1.6vw, 24px);
--ir-mono:          ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;

/* Per-section, set on each root */
--ir-tone:          var(--ir-accent);
```

Dark sections (01, 02, 05, 07) get a `.ir-section--dark` modifier that swaps headings to `--ir-on-dark`, body to `--ir-on-dark-body`, borders to `--ir-border-dark` and accent text to the `*-on-dark` inks. Cards on dark are `rgba(255,255,255,.04)` with a `--ir-border-dark` border and no drop shadow.

---

## 6. Architecture and section specs

Each section has its **own empty Elementor container**: Full Width, padding 0, no background, with its class in CSS Classes. On build, the JS also adds `ir-section` (and `ir-section--dark` where relevant), so editors only ever type one class.

| # | Section | Container class | Root block | Tone |
|---|---|---|---|---|
| 01 | Emergency banner | `ir-banner` | `.ir-bn` | alert |
| 02 | Hero | `ir-hero` | `.ir-hr` | alert → blue |
| 03 | Why it matters | `ir-why` | `.ir-wy` | alert |
| 04 | Services | `ir-services` | `.ir-sv` | blue |
| 05 | Response process | `ir-process` | `.ir-pr` | gradient (per step) |
| 06 | Incidents we handle | `ir-incidents` | `.ir-ic` | amber |
| 07 | Platform | `ir-platform` | `.ir-pf` | blue |
| 08 | Industries | `ir-industries` | `.ir-in` | blue |
| 09 | Readiness & retainer | `ir-readiness` | `.ir-rd` | green |
| 10 | Why CybrHawk | `ir-trust` | `.ir-tr` | blue |

Element classes take the form `ir-xx__name` and modifiers `ir-xx__name--mod`. Every `id` is prefixed `ir-`. Section 09's root carries **`id="ir-readiness"`**, which the hero's secondary CTA and service 06 link to.

Every CTA and `tel:` link carries `data-ir-cta="<placement>"` (`banner`, `hero-primary`, `hero-secondary`, `callbar`, `service-6`) so marketing can track clicks in GTM without code changes.

**Copy rules.** All copy comes from Appendix A. "Eyebrow" is the section label; "title" is the H2. **Don't invent copy.** The only allowed edits are listed in §10.

### 6.1 · 01 Emergency banner (`.ir-banner` → `.ir-bn`)

- A slim full-width bar on `--ir-night`. Vertical padding is 10–12px. Use `<aside aria-label="Emergency contact">`.
- **Left:** a pulsing 8px live dot in `--ir-alert-on-dark` (a `transform: scale` and `opacity` ring, `aria-hidden`), then the banner text at 14.5–15px, weight 500, in `--ir-on-dark`.
- **Right:** the button "Get Emergency Help: 954-324-4750" as a `tel:` link. It has a solid `--ir-alert` fill, white text, weight 700, an 8px radius, 8×16px padding and a phone icon. Hover darkens the fill and doesn't move. Show the number in the mono stack so the digits line up.
- **≤760px:** the text and button stack and centre. The button goes full width with at least a 44px tap target.
- **Sticky on mobile (the copy doc asks for this).** At ≤767px, once the in-flow banner *and* the hero CTAs have both left the viewport (one IntersectionObserver), slide in a **fixed bottom call bar**: `--ir-night`, the live dot, a short label using the banner button text, and the whole bar as one `tel:` link. It respects `env(safe-area-inset-bottom)` and hides again when either comes back into view.
  - The call bar is the one node built outside a container. The script appends it to `<body>` once and marks it `data-ir-cta="callbar"`.
  - So it never covers the footer's last line, the script adds the class `ir-has-callbar` to `<body>` while the bar exists. A single rule, `body.ir-has-callbar { padding-bottom: … }` inside a ≤767px media query, is **the page's one deliberate global rule**. Add a comment explaining why.
  - While hidden, it gets `visibility: hidden` and `inert`, so it can't be tabbed to.
  - Toggle: `CONTENT.banner.mobileCallBar` (default `true`).
- Editor note for §9: if the business wants the banner **above** the site header, it has to go in the Elementor header template. This container sits at the top of the page content.

### 6.2 · 02 Hero (`.ir-hero` → `.ir-hr`)

- This is the only `<h1>` on the page. If the template prints the WordPress page title as a second H1, hide it in Elementor's page settings (put this in the §9 notes).
- **Desktop (≥1025px):** two columns, copy about 1.05fr (600px cap) and visual about 0.95fr.
- **Copy column, in order:**
  1. Mono **eyebrow** with the alert-tone status square
  2. **H1** in two spans inside one `<h1>`, separated by a real space so screen readers read it as one sentence. Line 1, "Respond Fast.", is in `--ir-alert-on-dark`. Line 2, "Recover Smarter.", is in `--ir-on-dark`, with a thin blue underline that draws in after the load stagger. Each span is `display: block`.
  3. **Subheadline** at 18–20px in `--ir-on-dark-body`, max 34em
  4. **Button row:**
     - Primary "Get Help Now": a `tel:` link with solid `--ir-alert` and a phone icon
     - Secondary "Build Your IR Readiness Plan": a ghost button with a white 1px border, linking to `#ir-readiness`. Use smooth scroll unless the user prefers reduced motion.
     - Both use the walkthrough-cta button shape (10px radius, 14×26px padding, 2px lift on hover).
  5. **Trust strip:** a `<ul>` of four items below a `--ir-border-dark` hairline, each with a 16px check icon in `--ir-accent-on-dark` and the label at 14.5px, weight 600. Desktop is a single row that wraps. At ≤520px it becomes a 2×2 grid.
- **Visual column: the "incident record" panel.** It is coded, not an image, and the whole visual is `aria-hidden="true"`.
  - A console card (the HawkINT `.hk-about__console` idiom) about 460px wide. Its chrome bar holds three dots, the mono label "CybrHawk IR One" and a **status chip** on the right.
  - The **body** is the six process step names from section 05, as rows. Each row has a 10px state node, the step name in Figtree at 14px, and a mono index `01`–`06` on the right. Row states:
    - `is-done`: a check in the node, with the name in `--ir-on-dark-body`
    - `is-current`: a pulsing node in the current tone, with the name in white at weight 600
    - `is-pending`: a hollow node, with the name in `--ir-on-dark-muted`
  - At the bottom is a 3px **progress rail** filled with the gradient alert → amber → blue → green, driven by `scaleX`.
  - **The loop** is driven by the JS stepping a `data-step` attribute (0–5); the CSS handles every visual change:
    - Each step lasts about 1.8s. After step 6 it holds 2.4s, then everything fades and restarts.
    - The status chip reads `states.active` on step 1, `states.contained` on steps 2–4 and `states.recovered` on steps 5–6, in the alert, amber and green tones respectively.
    - The tone of the current node follows the same mapping.
  - **Pause** the loop when the panel is off screen (IntersectionObserver) or the tab is hidden; reuse udc's `heroMotion()` pattern. Under reduced motion, render it **static** in the final state: every row done, chip "Recovered", rail full.
  - Behind the panel sits a faint offset second panel (8px down and right, 40% opacity), so the visual has depth without another illustration.
  - All labels are HTML at ≥12px, never SVG text. The panel stays inside the column at every width from 320px up.
  - Optional: if `CONTENT.hero.visual.image` is set, show that image instead, and fall back to the panel if it fails to load (udc `media()` / `iconFallback()`).
- **Padding:** top `clamp(48px, 6vw, 96px)`, bottom `clamp(56px, 7vw, 104px)`. If the theme header overlays this template, add top padding so it clears the eyebrow (see `--hk-hr-bar` in hawk-int.css).
- **≤1024px:** the columns stack, copy first, with the panel centred below at most 480px. **≤620px:** the buttons stack and go full width.

### 6.3 · 03 Why it matters (`.ir-why` → `.ir-wy`)

- **Desktop:** an asymmetric split at about 1fr / 1fr with a wide gap.
  - **Left:** header aligned to the start, with the eyebrow "Why It Matters" and the H2 "Cyber Incidents Are Time-Sensitive. [[Your Response Should Be Too.]]". Below it, two paragraphs: the first at 17–18px in `--ir-heading`, the second at body size in `--ir-text`.
  - **Right:** the **risk register**. A small `<h3>` reads "What we help you avoid" (mono, uppercase, `--ir-alert-ink`). Below it is a `<ul>` of four rows. Each row has:
    - a 3px `--ir-alert` bar on the left edge
    - an icon in an alert-tinted badge (`rgba(217,45,45,.08)` fill, `--ir-alert-ink` stroke)
    - `<strong>` "Extended downtime" in `--ir-heading` with the description under it
    - rows separated by `--ir-rule`
  - The rows sit inside one white card with `--ir-shadow`: a single register, not four cards.
- Icons: `timer` for Extended downtime, a new `database-leak` for Data loss and exposure, `file-check` with an alert stroke (or a new `gavel`) for Regulatory penalties, and a new `door-return` or `shield-refresh` for Repeat attacks.
- **≤1024px:** one column, header first, then paragraphs, then the register.

### 6.4 · 04 Services (`.ir-services` → `.ir-sv`)

- Header centred: no eyebrow (§10 explains why), the H2 "[[End-to-End]] Incident Response Services" and the intro as the sub-line.
- **Bento layout, not a uniform grid.** The copy has a hierarchy (one emergency service, four response services, one "not under attack?" service), so the layout shows it.
  - **≥1100px:** a 3-column grid with `grid-template-areas`:
    ```
    "s1 s2 s3"
    "s1 s4 s5"
    "s6 s6 s6"
    ```
  - **s1, Emergency Incident Response,** spans two rows. It is a **dark card** (`--ir-night-2`) with white text, an alert-tone mono number "01", a larger icon (a new `siren`), and an alert hairline across the top. It is the anchor of the section.
  - **s2–s5** are white cards with a 16px radius, `--ir-shadow`, a mono number chip ("02") in accent-soft and accent-ink, a 48px icon badge, the `<h3>` title and the text. They are static cards with no hover lift.
  - **s6, IR Planning & Readiness,** is a full-width band in a green-tinted wash (`rgba(8,122,74,.06)`) with a dashed `--ir-green` 1px border. It is a horizontal layout: icon, title and text, then a text link on the right with an arrow.
    - The link uses `CONTENT.services.items[5].link` and points to `#ir-readiness`. Its label "Build Your IR Readiness Plan" reuses the hero's secondary CTA text, so no new copy is invented.
    - The card itself isn't a link; only the text link is.
- **700–1099px:** two columns, with s1 spanning both columns at the top and s6 spanning both at the bottom. **<700px:** one column in DOM order 01–06.
- Icons: a new `siren` for 01, a new `fingerprint` for 02, `crosshair` for 03, a new `restore` (circular arrow with a check) for 04, `file-check` for 05, and a new `clipboard` for 06.
- Cards are `<article id="ir-svc-{slug}">` inside a `<ul>`/`<li>` structure, so other pages can deep-link to them.

### 6.5 · 05 Our response process (`.ir-process` → `.ir-pr`) is the signature section

- Dark ground. Header centred: eyebrow "Our Response Process", the H2 "A Proven, Structured [[Response Methodology]]", and the NIST sentence as the sub-line.
- **Six steps as an `<ol>`**, using the how-it-works connector technique, with **colour temperature per step**:

  | Step | Tone | Node colour |
  |---|---|---|
  | 1 Engage & Triage | alert | `--ir-alert-on-dark` |
  | 2 Contain | amber | `--ir-amber-on-dark` |
  | 3 Investigate | amber | `--ir-amber-on-dark` |
  | 4 Eradicate | blue | `--ir-accent-on-dark` |
  | 5 Recover | green | `--ir-green-on-dark` |
  | 6 Report & Improve | green | `--ir-green-on-dark` |

- **≥1100px: horizontal timeline.**
  - One continuous 2px rail runs behind all six nodes. Draw it as a single pseudo-element on the `<ol>` with a `linear-gradient` through the four tones in the table's order, so the colour shift is literal.
  - Each step is a column: a 44px circular node (a 2px ring in its tone, the mono number inside, and a soft glow in its tone at 25%), then the `<h3>` step name in white at 18px, then the text in `--ir-on-dark-body` at 15px.
  - **Reveal:** the rail draws left to right (`transform: scaleX`, `transform-origin: left`, 1.6s), and each node fills in as the rail reaches it (`--i × 0.22s`).
- **<1100px: vertical timeline.** The rail runs down the left behind the nodes, and each step is a row with the node on the left and the name and text on the right. The gradient runs top to bottom, and the reveal draws with `scaleY`.
- Under reduced motion, everything is drawn and lit from the start.
- Don't put the steps in cards. On this section the rail *is* the structure, and cards would make it look like section 04 again.

### 6.6 · 06 Incidents we handle (`.ir-incidents` → `.ir-ic`)

- Header aligned to the start (not centred, for variety after two centred headers): eyebrow "Incidents We Handle" and the H2 "Expertise Across [[Every Type]] of Cyber Incident".
- **"Case file index" layout.** Seven incident types as a `<ul>` laid out in **two columns** at ≥900px (CSS columns or a 2-column grid; reading order must stay top-to-bottom, left column first). Each item is a row, not a card:
  - a 40px icon badge in amber-tinted fill (`rgba(185,108,0,.08)`) with an `--ir-amber` stroke
  - the `<h3>` title at 18px, weight 700, in `--ir-heading`
  - the description at 15.5px in `--ir-text`
  - a hairline `--ir-rule` under each row, and on hover a 2px amber bar sliding in from the left edge (`scaleY`). This is a static list, so there is **no lift and no pointer cursor**. The bar is decoration only; skip it if it reads as clickable in testing.
- **Cloud & SaaS Compromise** names five platforms. Show them as plain text exactly as written. Don't add vendor logos.
- One column at <900px.
- Icons: a new `lock-skull` (or a lock with a broken shackle) for Ransomware & Extortion, a new `mail-alert` for Business Email Compromise, the new `database-leak` for Data Breach & Exfiltration, a new `user-eye` for Insider Threats, `cloud-shield` for Cloud & SaaS Compromise, a new `bug` for Malware & APTs, and `factory` for OT & Critical Infrastructure.

### 6.7 · 07 Powered by the CybrHawk platform (`.ir-platform` → `.ir-pf`)

- Dark ground.
- **Desktop:** split, with copy on the **right** and the visual on the **left** (the mirror of the hero).
  - **Copy:** eyebrow, the H2 "Expert Responders, [[Backed by Advanced Technology]]", the paragraph, then the four features as a 2×2 `<ul>`. Each feature has an icon in `--ir-accent-on-dark`, a `<strong>` title in white and the text in `--ir-on-dark-body`.
  - **Visual: the "rapid deployment" diagram**, `aria-hidden`:
    - Four source chips stacked on the left: Endpoint, Network, Cloud, Identity (the four surfaces named in the Rapid Visibility copy; see `visual.sources`). Each is a dark pill with an icon.
    - On the right of the four chips sits one core node: a 120px rounded square with a `shield` icon and the mono label "CybrHawk IR One".
    - Four horizontal connectors run from the chips into the core in one SVG with `viewBox="0 0 100 100"` and `vector-effect: non-scaling-stroke`, in blue at about 35% alpha. A small dot travels along each connector toward the core, with durations staggered between 2.4s and 3.2s.
    - Under the core is one chip, "HawkINT", linked to the core by a short dotted line, because the copy says HawkINT enriches investigations.
    - Pause the dots off screen and on a hidden tab. Under reduced motion, render it static.
- **≤1024px:** copy first, then the visual at most 480px wide. **≤560px:** the chips become a 2×2 grid above the core and the connectors are dropped.
- Icons: `eye` for Rapid Visibility, `globe` for Threat Intelligence, `bolt` for Automated Containment, `pulse` for Continuous Monitoring. Chip icons: `endpoint`, `network`, `cloud`, `identity`.
- **Copy flag:** the paragraph says "SIEM XDR". The UCD page writes "SIEM / XDR". **Don't change it.** Leave a `// TODO:` in CONTENT asking whether it should match.

### 6.8 · 08 Industries we serve (`.ir-industries` → `.ir-in`)

- Header centred: eyebrow, the H2 "Tailored Response for [[Your Industry]]" and the intro as the sub-line.
- **Six cards in a `<ul>`.** Three columns at ≥960px, two at ≥600px and one below that.
- Each card is white with a 16px radius and a 1px border. **No drop shadow here**, so it reads differently from section 04. Each card has:
  - a 3px top edge in `--ir-accent` that runs only 48px wide, as a tab marker
  - an icon
  - the `<h3>` name
  - the text
- These cards are not links: no hover lift.
- Icons: `coins` for Financial Services, `medical` for Healthcare & Life Sciences, `bank` for Government & Public Sector, a new `cart` for Retail & eCommerce, `pylon` for Energy & Critical Infrastructure, `graduation` for Education & Research.

### 6.9 · 09 Readiness & retainer (`.ir-readiness` → `.ir-rd`, `id="ir-readiness"`)

- The calm blue-to-green gradient ground. This is the "before" story, so the section should exhale after the dark and amber stretch.
- **Desktop:** split at about 0.9fr / 1.1fr.
  - **Left, sticky** (`position: sticky; top: 96px` at ≥1025px only): eyebrow in the green tone, the H2 "Be Ready [[Before]] an Incident Happens" with the accent in `--ir-green`, and the paragraph.
  - **Right:** the four offerings as an `<ol>` of white cards, stacked with `--ir-gap` between them. Each card has:
    - a large mono number ("01") at 28px in `--ir-green` at 0.9 opacity
    - the `<h3>` title
    - the text
    - a 1px border that turns green on `:focus-within` only
  - **Don't style offering 01 (the retainer) as "recommended" or "featured".** The copy doesn't say so.
- `scroll-margin-top: 96px` on the root, so the hero's anchor link doesn't land under a sticky header.
- **≤1024px:** one column and no sticky.
- Icons, shown small beside the title: a new `handshake` for the Incident Response Retainer, `clipboard` for IR Plan Development & Review, a new `users-table` (people around a table) for Tabletop Exercises, `radar` for Compromise Assessment.

### 6.10 · 10 Why CybrHawk (`.ir-trust` → `.ir-tr`)

- White ground. This is the last section built here, so it ends with normal bottom padding.
- Header aligned to the start: eyebrow "Why CybrHawk" and the H2 "Why Organizations Trust CybrHawk [[in a Crisis]]".
- **Five commitments as an `<ol>`, in an editorial layout instead of cards:**
  - **≥1100px:** five columns in one row. Each column has a 2px top rule (the first column's rule is in `--ir-alert`, the rest in `--ir-heading` at 12%, a quiet nod to the page's start), then a mono number "01", the `<h3>` title at 19px weight 700, and the text at 15.5px.
  - **600–1099px:** a 2-column grid, with the fifth item spanning both columns. **<600px:** one column.
- Icons: none. The numbers and rules carry it, and leaving icons out keeps this section clearly different from 08.

---

## 7. Accessibility (required)

- **Headings:** exactly one `h1` (hero). Sections 03–10 each get an `h2`, and cards, items and steps get `h3`. **The banner has no heading**: it is an `<aside>` with an `aria-label`. Never skip a level. The small "What we help you avoid" label in 03 is an `h3` that heads the list. The hero visual's labels are inside `aria-hidden`, so they don't count.
- **Lists:** every list is a `<ul>`/`<ol>`: trust strip, risks, services, steps, incidents, features, industries, offerings, commitments.
- **Phone links:** the visible text includes the number, or the link has an `aria-label` such as "Call CybrHawk incident response, 954-324-4750". `href` is `tel:+19543244750`.
- **Contrast:** 4.5:1 for text and 3:1 for UI parts and graphics, on both light and dark grounds. Use the `*-ink` and `*-on-dark` tokens for small coloured text. Red/green state is never the only signal: the hero rows also differ by icon (check, pulse, hollow) and weight.
- **Keyboard:** every interactive element has `:focus-visible { outline: 3px solid rgba(12,104,255,.45); outline-offset: 3px; }`. On dark grounds use `rgba(110,168,255,.7)`. The call bar is skipped while hidden.
- **Reduced motion:** no load stagger, no loops, no rail draw, no hover translate, and no smooth scroll.
- **Links:** descriptive text, and no `href="#"` or `href=""`. A CTA with an empty `href` isn't rendered.

## 8. Robustness and performance

- No libraries, no jQuery, no CDNs and no icon fonts. No network requests beyond optional image URLs in CONTENT.
- No scroll listeners. Use IntersectionObserver for reveals, the call bar and pausing animations. The hero and platform loops use one shared visibility helper.
- No fixed heights on anything that holds text.
- **No horizontal scroll at any width down to 320px.**
- Running the script twice must not duplicate anything, including the call bar and the `ir-has-callbar` class.
- If one container is missing or one builder throws, every other section still builds, and the call bar still works if the banner or hero container is missing (it then watches whichever exists, or shows from the start on mobile if neither does).

## 9. `incident-response.html`: local preview harness

A full document, not deployed:
- `<!doctype html>`, `lang="en"`, the charset and viewport metas, and Figtree 400–700 from Google Fonts (the live site loads its own)
- `<link rel="stylesheet" href="incident-response.css">`
- a tiny inline `<style>` for the preview only: `body { margin: 0; font-family: "Figtree", sans-serif; }`
- a fake 72px site header bar at the top, so sticky and anchor offsets can be checked
- ten mock containers in page order, `<div class="e-con e-con-full ir-banner"></div>` and so on. Give two of them an inner `<div class="e-con-inner"></div>` so both host paths get exercised.
- a 400px grey block after section 10 labelled "Rest of page (FAQ / CTA not built here)", so the mobile call bar can be scrolled past
- `<script src="incident-response.js"></script>`

At the top, an HTML comment with the **Elementor setup steps**:
1. Create the 10 containers in the order of the §6 table: Full Width, padding 0, no background, class in CSS Classes.
2. Load `incident-response.css` and `.js` the same way the other pages' files are loaded.
3. Hide the page title if the template prints a second H1.
4. Paste Appendix B into the SEO plugin (Rank Math or Yoast).
5. If the emergency banner should sit above the site header, move it into the header template instead.
6. Before launch, swap in the dedicated 24/7 IR hotline if there is one (see the TODOs).

## 10. Don'ts

- **Don't change the copy.** These are the only allowed edits, and Appendix A has already made them:
  - splitting "Title: text" and "Title — text" into `title` and `text` fields
  - dropping the "Service 1 ·", "Industry 1 ·" and "Offering 1 ·" prefixes in favour of generated numbers
  - turning the field label "What we help you avoid" into a small visible heading (editable, and blank hides it)
  - wrapping existing words in `[[…]]` for the accent
  - dropping the section-04 eyebrow because "Incident Response Services" would repeat the H2
  - dropping "(top of page)" from the banner's section label, which is never displayed
  - reusing "Build Your IR Readiness Plan" as the link text on service 06

  The copy uses **US spelling** ("Organizations", "prioritized"). Keep it as written, unlike the UCD page.
- Don't build the FAQ or the final CTA.
- Don't invent statistics, response-time promises, customer names, logos, certifications, testimonials or "recommended" tags.
- Don't use font weights above 700, an extra web font, `!important` without a comment, global selectors (beyond the one call-bar rule), or any change outside `incident-response/`.
- Don't put an unescaped CONTENT string into `innerHTML` or `insertAdjacentHTML`.
- Don't use red for anything except active-incident meaning.

## 11. Acceptance checklist

Open `incident-response/incident-response.html` and confirm each point:

- [ ] Every section renders at **1440, 1280, 1024, 820, 768, 390 and 360px**, and at each width `document.documentElement.scrollWidth === window.innerWidth`.
- [ ] The page reads red → amber → blue → green from top to bottom, and the 05 rail shows the same shift in one line.
- [ ] Each section's layout differs from the one above it: bar, split + panel, split + register, bento, timeline, two-column index, mirrored split + diagram, tab-marked cards, sticky split + stacked list, editorial columns.
- [ ] The hero load stagger plays once. The incident panel loops, pauses when scrolled off screen or the tab is hidden, and is static in the "Recovered" state under reduced motion.
- [ ] At 390px, the call bar appears only after the banner and hero CTAs scroll away, never covers the last line of the page, and dials `tel:+19543244750`.
- [ ] "Build Your IR Readiness Plan" (hero) and the service 06 link both land on section 09 with its heading visible below the fake header.
- [ ] With **reduced motion** on, everything is visible immediately and nothing moves.
- [ ] Using only the **keyboard**, you can reach the banner button, both hero CTAs and the service 06 link, and focus is visible on light and dark grounds.
- [ ] Deleting any one mock container still builds the other nine with no console errors. Re-running the script adds no duplicates.
- [ ] The heading outline is one H1, eight H2s (03–10), and H3s inside them.
- [ ] Every string matches Appendix A **character for character**, curly apostrophes included.
- [ ] Contrast spot checks pass: the alert ink on white, the amber badge strokes, the green numbers in 09, and the muted text on dark.

Leave a `// TODO:` in CONTENT for every open item marked in Appendix A.

---

## Appendix A: copy, verbatim, shaped for CONTENT

```js
var CONTENT = {

  banner: {
    label: "Emergency contact",   // aria-label only, not shown
    text: "Experiencing an active cyber incident? Our response team is available 24/7.",
    // TODO: copy doc recommends a dedicated 24/7 IR hotline here instead of the sales line, if one exists.
    cta: { label: "Get Emergency Help: 954-324-4750", href: "tel:+19543244750" },
    mobileCallBar: true
  },

  hero: {
    eyebrow: "Incident Response · CybrHawk IR One",
    // Two spans inside one <h1>: line 1 in the alert tone, line 2 in white.
    title: ["Respond Fast.", "Recover Smarter."],
    sub: "Every minute counts during a cyberattack. CybrHawk’s expert incident responders help you contain the threat, understand exactly what happened, and restore operations securely, with minimal disruption to your business.",
    // TODO: confirm the target for "Get Help Now" (phone, or an emergency intake form).
    cta: { label: "Get Help Now", href: "tel:+19543244750" },
    ctaSecondary: { label: "Build Your IR Readiness Plan", href: "#ir-readiness" },
    trust: [
      "24/7/365 emergency response",
      "Remote and on-site support",
      "Forensically sound investigations",
      "Compliance-ready reporting"
    ],
    // The incident panel. Step names repeat section 05; the state words are UI labels.
    visual: {
      label: "CybrHawk IR One",
      states: { active: "Active", contained: "Contained", recovered: "Recovered" },
      image: "",
      imageAlt: ""
    }
  },

  why: {
    eyebrow: "Why It Matters",
    title: "Cyber Incidents Are Time-Sensitive. [[Your Response Should Be Too.]]",
    body: [
      "Ransomware, business email compromise, insider threats, and data breaches can halt operations, expose sensitive data, and trigger regulatory obligations within hours. The difference between a contained event and a business crisis often comes down to how quickly and decisively you respond.",
      "CybrHawk gives you immediate access to experienced responders, proven processes, and advanced detection technology, so you are never facing an attack alone."
    ],
    risksTitle: "What we help you avoid",   // "" hides the label
    risks: [
      { icon: "timer",         title: "Extended downtime",      text: "Prolonged outages that disrupt customers, revenue, and operations." },
      { icon: "database-leak", title: "Data loss and exposure", text: "Theft or leakage of sensitive, regulated, or proprietary data." },
      { icon: "gavel",         title: "Regulatory penalties",   text: "Missed notification deadlines and incomplete breach documentation." },
      { icon: "door-return",   title: "Repeat attacks",         text: "Attackers returning through backdoors that were never fully removed." }
    ]
  },

  services: {
    eyebrow: "",   // the section label "Incident Response Services" would repeat the H2
    title: "[[End-to-End]] Incident Response Services",
    intro: "From the first alert to full recovery and beyond, CybrHawk supports you through every stage of a cyber incident.",
    // Numbered 01–06 from array order. Item 1 is the dark anchor card; item 6 is the full-width band.
    items: [
      { slug: "emergency", icon: "siren", title: "Emergency Incident Response",
        text: "Our 24/7 on-call team engages quickly to triage active threats, contain the attack, and limit damage, remotely or on-site." },
      { slug: "forensics", icon: "fingerprint", title: "Digital Forensics & Investigation",
        text: "We determine how the breach occurred, what systems and data were affected, how long attackers were present, and how to prevent recurrence, while preserving evidence to forensic standards." },
      { slug: "containment", icon: "crosshair", title: "Threat Containment & Eradication",
        text: "We isolate compromised systems, remove malware, backdoors, and unauthorized access, and harden your environment to stop attackers from returning." },
      { slug: "recovery", icon: "restore", title: "Recovery & System Restoration",
        text: "We help you restore systems and data securely and in the right order, reducing downtime and business impact while validating that the environment is clean." },
      { slug: "reporting", icon: "file-check", title: "Incident Reporting & Documentation",
        text: "You receive clear, compliance-ready reports covering the incident timeline, attack vector, affected assets, root cause, and prioritized recommendations for executives, regulators, insurers, and legal counsel." },
      { slug: "readiness", icon: "clipboard", title: "IR Planning & Readiness",
        text: "Not under attack? We help you build or improve your incident response plan, develop playbooks, and run tabletop exercises so your team is ready when it matters.",
        // Reuses the hero's secondary CTA text. href "" hides the link.
        link: { label: "Build Your IR Readiness Plan", href: "#ir-readiness" } }
    ]
  },

  process: {
    eyebrow: "Our Response Process",
    title: "A Proven, Structured [[Response Methodology]]",
    sub: "Our approach follows the NIST SP 800-61 incident handling lifecycle, adapted to your environment and business priorities.",
    // tone drives the node colour and the rail gradient stop.
    steps: [
      { tone: "alert", title: "Engage & Triage",  text: "We take your call, assess scope and severity, and mobilize the right responders immediately." },
      { tone: "amber", title: "Contain",          text: "We stop the spread by isolating affected hosts, accounts, and network segments." },
      { tone: "amber", title: "Investigate",      text: "Forensic analysis reveals the attack vector, attacker activity, and full scope of impact." },
      { tone: "blue",  title: "Eradicate",        text: "We remove every trace of the threat, including persistence mechanisms and compromised credentials." },
      { tone: "green", title: "Recover",          text: "Systems are restored, validated, and monitored closely to confirm the attacker is gone." },
      { tone: "green", title: "Report & Improve", text: "We deliver findings, root cause, and recommendations to strengthen your defenses against future attacks." }
    ]
  },

  incidents: {
    eyebrow: "Incidents We Handle",
    title: "Expertise Across [[Every Type]] of Cyber Incident",
    items: [
      { icon: "lock-skull",    title: "Ransomware & Extortion",                text: "Containment, scoping, recovery support, and guidance through extortion scenarios." },
      { icon: "mail-alert",    title: "Business Email Compromise",             text: "Mailbox investigation, fraud tracing, and account remediation." },
      { icon: "database-leak", title: "Data Breach & Exfiltration",            text: "Determining what data was accessed or stolen and supporting notification decisions." },
      { icon: "user-eye",      title: "Insider Threats",                       text: "Discreet investigation of malicious or negligent insider activity." },
      { icon: "cloud-shield",  title: "Cloud & SaaS Compromise",               text: "Response across AWS, Azure, Google Cloud, Microsoft 365, and Google Workspace." },
      { icon: "bug",           title: "Malware & Advanced Persistent Threats", text: "Hunting and removing sophisticated, long-dwelling adversaries." },
      { icon: "factory",       title: "OT & Critical Infrastructure Incidents", text: "Safety-aware response for industrial and operational technology environments." }
    ]
  },

  platform: {
    eyebrow: "Powered by the CybrHawk Platform",
    title: "Expert Responders, [[Backed by Advanced Technology]]",
    // TODO: copy says "SIEM XDR"; the UCD page writes "SIEM / XDR". Confirm before launch. Don't change it here.
    body: "CybrHawk IR One combines human expertise with the full CybrHawk Unified Cyber Defense platform. Our responders can rapidly deploy SIEM XDR, NDR, and Cloud detection to gain visibility across your environment, hunt for attacker activity, and monitor for re-entry after recovery.",
    features: [
      { icon: "eye",   title: "Rapid Visibility",       text: "Fast deployment of telemetry across endpoint, network, cloud, and identity." },
      { icon: "globe", title: "Threat Intelligence",    text: "HawkINT enriches investigations with adversary context and indicators." },
      { icon: "bolt",  title: "Automated Containment",  text: "Playbooks isolate hosts and disable accounts in seconds." },
      { icon: "pulse", title: "Continuous Monitoring",  text: "Optional 24/7 SOC monitoring after the incident to prevent recurrence." }
    ],
    // Diagram labels, taken from the Rapid Visibility and Threat Intelligence copy.
    visual: {
      core: "CybrHawk IR One",
      sources: [
        { icon: "endpoint", label: "Endpoint" },
        { icon: "network",  label: "Network" },
        { icon: "cloud",    label: "Cloud" },
        { icon: "identity", label: "Identity" }
      ],
      intel: "HawkINT"
    }
  },

  industries: {
    eyebrow: "Industries We Serve",
    title: "Tailored Response for [[Your Industry]]",
    intro: "Every industry faces unique threats, regulations, and operational pressures. Our response is tailored to your security, compliance, and business needs.",
    items: [
      { icon: "coins",      title: "Financial Services",              text: "Protect customer assets and meet strict regulatory expectations for incident handling and reporting." },
      { icon: "medical",    title: "Healthcare & Life Sciences",      text: "Safeguard patient data and clinical operations, with support for HIPAA breach requirements." },
      { icon: "bank",       title: "Government & Public Sector",      text: "Defend critical services and sensitive citizen data against nation-state and criminal threats." },
      { icon: "cart",       title: "Retail & eCommerce",              text: "Secure payment data and customer trust, with PCI DSS-aware investigation and response." },
      { icon: "pylon",      title: "Energy & Critical Infrastructure", text: "Respond safely across IT and OT environments, prioritizing safety and continuity of operations." },
      { icon: "graduation", title: "Education & Research",            text: "Protect students, faculty, intellectual property, and research data across open, distributed networks." }
    ]
  },

  readiness: {
    eyebrow: "Readiness & Retainer",
    title: "Be Ready [[Before]] an Incident Happens",
    body: "The best time to prepare for an incident is before it occurs. CybrHawk’s readiness services and incident response retainers give you a trusted partner, a tested plan, and guaranteed access to responders when you need them most.",
    items: [
      { icon: "handshake",   title: "Incident Response Retainer",   text: "Pre-negotiated terms and priority access to CybrHawk responders, so you skip onboarding delays during a crisis." },
      { icon: "clipboard",   title: "IR Plan Development & Review", text: "Create or modernize your incident response plan, roles, communication paths, and escalation procedures." },
      { icon: "users-table", title: "Tabletop Exercises",           text: "Executive and technical simulations that test decision-making against realistic scenarios such as ransomware and data breaches." },
      { icon: "radar",       title: "Compromise Assessment",        text: "A proactive hunt to determine whether attackers are already present in your environment." }
    ]
  },

  trust: {
    eyebrow: "Why CybrHawk",
    title: "Why Organizations Trust CybrHawk [[in a Crisis]]",
    items: [
      { title: "Always Available",       text: "24/7/365 response from experienced incident handlers." },
      { title: "Speed With Precision",   text: "Rapid engagement combined with a disciplined, evidence-based methodology." },
      { title: "Technology Advantage",   text: "Native access to the CybrHawk platform for faster visibility and containment." },
      { title: "Clear Communication",    text: "Regular updates for technical teams, executives, legal counsel, and insurers." },
      { title: "Beyond Recovery",        text: "Actionable recommendations and optional managed SOC services to keep you protected." }
    ]
  }
};
```

## Appendix B: SEO fields (for the SEO plugin, not code)

| Field | Value |
|---|---|
| Meta title (≤60) | Incident Response Services \| 24/7 Cyber IR \| CybrHawk |
| Meta description (≤160) | Under attack? CybrHawk IR One delivers 24/7 incident response, digital forensics, containment, and recovery to stop breaches and restore operations fast. |
| URL slug | `/incident-response/` |
| Primary keyword | incident response services |
| Secondary keywords | cyber incident response, digital forensics, ransomware response, breach response, incident response retainer, tabletop exercise, IR planning |
| Open Graph title | CybrHawk Incident Response: Respond Fast. Recover Smarter. |
