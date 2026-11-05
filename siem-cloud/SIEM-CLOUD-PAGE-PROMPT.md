# Build the CybrHawk SIEM Cloud page: `siem-cloud/siem-cloud.{js,css,html}`

## 1. The job

Build the **SIEM Cloud (Cloud Detection & Response)** page for `https://cybrhawk.com/siem-cloud/`. It covers sections 01–09 of the approved copy. That copy is in **Appendix A**, word for word, already shaped for the CONTENT block.

**Out of scope: section 10 (final call to action).** The site already has a closing CTA component, and it sits directly after the last section built here. Its copy is in **Appendix B** so the editor can paste it into that component. Don't build it, and don't leave a placeholder for it in the JS or CSS. Section 09 (FAQ) ends the page you build. It must end on white with its normal bottom padding, so the CTA component joins without a seam.

| File | Status | What goes in it |
|---|---|---|
| `siem-cloud/siem-cloud.js` | exists, empty | Builds all 9 sections, each into its own Elementor container |
| `siem-cloud/siem-cloud.css` | exists, empty | Every style for the page, scoped to those containers |
| `siem-cloud/siem-cloud.html` | **create** | Local preview harness (not deployed) plus the Elementor setup notes (§9) |

Don't edit anything outside `siem-cloud/`.

---

## 2. Read these before writing anything

The site runs on WordPress and Elementor. **The Elementor container markup is fixed, so we ship only JS and CSS.** The script finds an empty container by its CSS class, injects the section's markup, and the CSS styles that markup.

| Read | For |
|---|---|
| `incident-response/incident-response.js` + `.css` | **The reference build. Copy its architecture exactly:** `SECTIONS` map, CONTENT block, `ICONS` + `icon()`, `esc` / `nl2br` / `markup` / `pad`, `head()`, `button()`, `mount()`, `media()` with `iconFallback()`, per-builder try/catch in `buildAll()`, `reveal()`, `init()` with the 10 s MutationObserver, the hero loop with off-screen / hidden-tab pause. Its `ICONS` map already has: `shield globe crosshair bank factory network pylon bolt medical coins graduation endpoint cloud identity file-check timer cloud-shield radar eye pulse check phone database-leak gavel door-return siren fingerprint restore clipboard lock-skull mail-alert user-eye bug cart clock layers headset shield-refresh handshake users-table`. `udc/udc.js` adds `dashboard alerts plug link bot lock award decide plus`. Reuse those glyphs before drawing new ones. |
| `incident-response/IR-PAGE-PROMPT.md` §3, §7, §8 and `udc/UCD-PAGE-PROMPT.md` §2 | House conventions, accessibility and robustness rules. **They all apply here unchanged.** §3 below is a reminder, not a replacement. |
| `udc/udc.js` + `.css`, FAQ builder | The accordion pattern for section 09: delegated toggles, `hidden` answers, keyframe fade |
| `enterprise-operations-intelligence/how-it-works/how-it-works.{js,css}` | Pipeline connectors drawn in CSS, vertical on mobile. **Section 03 builds on this.** |
| `enterprise-operations-intelligence/walkthrough-cta/walkthrough-cta.{js,css}` | Primary and ghost buttons with the SVG arrow |
| `HawkINT/hawk-int.css` | **Dark surfaces:** the console frame (`.hk-about__console`), the decoration layer (`aria-hidden`, `overflow: clip`), and the header-overlay note (`--hk-hr-bar`). Sections 01, 03 and 06 are dark and borrow this idiom. |

`enterprise-operations-intelligence/seconn-section/` is the exception: static HTML and ES6. **Don't copy its style.**

---

## 3. House conventions (summary; the files above are the authority)

- **JS:** one IIFE, `"use strict"`, **ES5 only**: `var`, `function` and string concatenation. No arrow functions, template literals, `let`/`const`, classes or modules. Open the file with a comment block, then the `SECTIONS` map, then a **"Content (edit freely)"** block holding every visible string, URL and toggle. Every CONTENT string goes through `esc()` (or `markup()`/`nl2br()`) before it reaches HTML. Builders are idempotent. A missing container or a throwing builder skips only that section.
- **CSS:** scope every rule under a section container class. No bare element selectors, no global rules. Declare tokens once on `.sc-section`. Use `box-sizing: border-box` and `font-family: inherit`. Gutter is 24px, 22px at ≤980px and 18px at ≤520px. Reset `.e-con-inner` padding and max-width inside SC containers, the way incident-response.css does. No `!important` without a comment saying why.
- **Figtree loads only up to weight 700.** Never use 800 or 900, because they fall back to Helvetica.
- **Icons:** inline SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and joins, `aria-hidden="true"`.
- Comments explain *why*. Match the comment density of incident-response.js.

---

## 4. Design direction: "three signals, one story"

Generic cloud-security pages all look the same: a blue gradient, a glowing globe, floating cloud icons, purple accents, and a grid of identical white cards. Avoid that "AI slop" look. This page has a sharper idea, and it comes straight from the copy:

> *"Instead of treating a misconfiguration, a risky permission, and a suspicious API call as three separate alerts, it connects them into a single, prioritized story of risk."*

So the page is about **convergence**. Three signal lanes (**Posture**, **Identity**, **Threat**) start out separate and scattered, and the page pulls them together into one blue line: the correlated story, which ends in a guardrail response. The visual language is a **cloud control plane**: console frames, hairline grids, mono labels and precise lines. It should look like a well-designed engineering tool, not a marketing brochure.

| Stage | Sections | What the reader sees |
|---|---|---|
| Fragmented | 01 Hero (start of loop), 02 Challenge | Three lanes in three colours, consoles that don't line up |
| Converging | 03 Platform, 04 Capabilities | The lanes braid into one line; the capabilities sit in one ordered matrix |
| Unified | 05 Coverage, 06 Use cases, 07 Impact | One estate, one view, mostly brand blue |
| Trusted | 08 Why CybrHawk, 09 FAQ | Calm, light, settled |

### 4.1 Colour: one dominant colour, three sharp accents

- **Site blue `#0c68ff` is dominant.** It stands for the correlated story, the response and every CTA.
- **The three lane tones are accents with strict meaning.** Amber = posture, teal = identity, red = threat. Use them **only** where a signal type is actually being shown: the hero console, the section-02 console dots, the section-03 lanes, the section-06 card accents and the section-08 anchor card's mini diagram. **Never** use them for decoration, hover states, buttons or generic emphasis.
- Colour is never the only signal. Every lane colour sits next to its written label ("Posture", "Identity", "Threat") or is purely decorative inside an `aria-hidden` layer.
- No purple, and no blue-to-purple gradients anywhere.

### 4.2 Typography

- **Figtree** (the site font, 400–700) for everything a reader reads. Don't load another web font: the live site already loads Figtree, and the "distinctive type" job goes to the second voice and to the scale contrast below.
- The second voice is a **monospace "control plane" voice** using the system stack `ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`. It needs no download. Use it **only** for eyebrows, indexes ("01"), lane labels, service chips in section 05 and the console labels in the hero visual. Never use it for body copy or headings.
- Scale contrast is what makes the page look designed:
  - **H1:** `clamp(40px, 5.2vw, 74px)`, weight 700, line-height 1.02, letter-spacing −0.03em
  - **H2:** `clamp(30px, 4vw, 50px)`, weight 700, line-height 1.1, letter-spacing −0.02em, `text-wrap: balance`
  - **Eyebrow (mono):** 12.5px, weight 600, uppercase, letter-spacing 0.14em, preceded by **three tiny 6px bars in the three lane tones that join into one blue bar**. Draw it as a CSS-only mark (pseudo-elements or a linear-gradient), the page's signature. It mustn't look like IR's status square or HawkINT's gradient line.
  - **Body:** `clamp(16px, 1.3vw, 18px)`, line-height 1.65, `text-wrap: pretty`
  - Use `font-variant-numeric: tabular-nums` on every mono index.

### 4.3 Backgrounds: atmosphere, not flat fills

Each section gets a ground with depth. No two neighbouring sections share a background.

| # | Section | Ground |
|---|---|---|
| 01 | Hero | Dark `#070b18` → `#0d1330`, a fine **dot grid** (1px dots on a 28px pitch, about 8% white) masked to fade toward the edges, plus three faint glows off the top left in the lane tones at about 10%, collapsing into one larger blue glow (`rgba(12,104,255,.22)`) behind the console. The ground is "three becoming one". |
| 02 | Challenge | White, with a very faint 1px hairline grid (about 3% ink) in the right half only, behind the scattered consoles |
| 03 | Platform overview | Dark `#0d1330` with long horizontal "lane" hairlines at 4% opacity running edge to edge |
| 04 | Capabilities | Tint `#f6f8fc` plus a soft top radial in blue at 6% |
| 05 | Coverage | White |
| 06 | Use cases | Dark `#070b18` with a single blue glow at the bottom centre and the dot grid at 5% |
| 07 | Business impact | White |
| 08 | Why CybrHawk | Calm gradient `#f3f7ff` → `#ffffff`, top to bottom |
| 09 | FAQ | **White.** It is the last section built here, and the existing CTA follows. |

All decoration sits in an `aria-hidden` layer with `pointer-events: none`. Any section whose decoration bleeds past its edges gets `overflow: clip`.

### 4.4 Motion: one orchestrated moment, one signature, then quiet

- **Page load (hero only):** a staggered reveal using `animation-delay`. Eyebrow at 0 ms, H1 lines at 80 / 160 / 240 ms, subheadline at 320 ms, buttons at 400 ms, trust strip at 480 ms, console at 300 ms. Each item fades up 16px over 0.7s on `cubic-bezier(.22,1,.36,1)`. The console's loop starts after its reveal ends.
- **Section 02:** when the consoles scroll into view, they settle into their slightly-off positions (small `rotate` + `translate`, staggered). They stay misaligned on purpose. That is the point.
- **Section 03 (signature):** when it scrolls into view, the three lane lines draw in (`scaleX`, staggered 0 / 120 / 240 ms), merge at step 2, and one blue line continues through steps 3 and 4. Each step node lights as the line reaches it (`i × 0.25s`). It runs once. Vertical (`scaleY`) on mobile.
- **Everything else:** the standard reveal (`opacity 0 → 1`, `translateY(20px) → none`, staggered by an inline `--i`).
- **Micro-interactions:** buttons lift 2px. Matrix cells in 04 get a tint on hover, with no lift. Nothing else moves on its own.
- **Animate only `transform` and `opacity`.** No scroll listeners. Under `prefers-reduced-motion: reduce`, show everything in its final state at once: no loops, no draws, no hover translate, no smooth scroll, and the section 02 consoles **aligned** (no rotation).

### 4.5 Avoid

- Glowing globes, floating cloud clip-art, padlocks, hooded hackers, binary rain, purple gradients, and generic "network constellation" backgrounds
- Vendor logos for AWS, Azure, Google Cloud, Microsoft 365, Okta and so on. **Provider names are text only.**
- Nine identical white cards in a row. **Each section's layout must differ from the section above it.**
- Fake telemetry: invented ARNs, account IDs, bucket names, IPs, regions or counts. The hero visual uses only words from the copy (§6.1).
- Invented statistics, "x% faster" claims, customer logos, certifications, testimonials or "recommended" badges

---

## 5. Design tokens: declare them once, on `.sc-section`

These are starting values. **Verify every text pair**: 4.5:1 for text, 3:1 for UI parts and graphics. Note each measured ratio in a comment, as incident-response.css does.

```css
/* Brand: the correlated story and every CTA */
--sc-accent:          #0c68ff;   /* fills, buttons, large display */
--sc-accent-hover:    #0a58d6;
--sc-accent-ink:      #0a58d6;   /* blue AS TEXT on light grounds */
--sc-accent-soft:     #eaf2ff;
--sc-accent-on-dark:  #6ea8ff;   /* blue AS TEXT on dark grounds */

/* Signal lanes: each has a light-ground ink and a dark-ground ink */
--sc-posture:         #b96c00;   /* amber, ≈5.4:1 on white */
--sc-posture-on-dark: #f5b041;
--sc-identity:        #0f7f8a;   /* teal, ≈4.7:1 on white: verify */
--sc-identity-on-dark:#5eead4;
--sc-threat:          #c42525;   /* red AS TEXT on white */
--sc-threat-on-dark:  #ff7a7a;

/* Neutrals */
--sc-heading:         #0d1330;
--sc-text:            #5b6478;
--sc-night:           #070b18;
--sc-night-2:         #0d1330;
--sc-on-dark:         #ffffff;
--sc-on-dark-body:    #c3cadb;
--sc-on-dark-muted:   #9aa3bd;   /* nothing dimmer than this for real copy on dark */
--sc-bg:              #ffffff;
--sc-bg-tint:         #f6f8fc;
--sc-border:          #e6eaf2;
--sc-border-dark:     rgba(255,255,255,.10);
--sc-rule:            #edf0f6;

/* Shape and space */
--sc-shadow:          0 1px 2px rgba(13,19,48,.04), 0 8px 24px rgba(13,19,48,.05);
--sc-shadow-hover:    0 2px 4px rgba(13,19,48,.05), 0 16px 38px rgba(13,19,48,.10);
--sc-radius:          16px;
--sc-radius-sm:       10px;
--sc-measure:         1320px;
--sc-gutter:          24px;      /* 22px ≤980px, 18px ≤520px */
--sc-pad-y:           clamp(56px, 7vw, 96px);
--sc-gap:             clamp(16px, 1.6vw, 24px);
--sc-mono:            ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;

/* Per-element lane, set inline where a lane is shown */
--sc-lane:            var(--sc-accent);
```

Dark sections (01, 03, 06) get a `.sc-section--dark` modifier that swaps headings to `--sc-on-dark`, body to `--sc-on-dark-body`, borders to `--sc-border-dark` and accent or lane text to the `*-on-dark` inks. Cards on dark are `rgba(255,255,255,.04)` with a `--sc-border-dark` border and no drop shadow.

---

## 6. Architecture and section specs

Each section has its **own empty Elementor container**: Full Width, padding 0, no background, with its class in CSS Classes. On build, the JS also adds `sc-section` (and `sc-section--dark` where relevant), so editors only ever type one class.

| # | Section | Container class | Root block | Ground |
|---|---|---|---|---|
| 01 | Hero | `sc-hero` | `.sc-hr` | dark |
| 02 | The challenge | `sc-challenge` | `.sc-ch` | white |
| 03 | Platform overview | `sc-platform` | `.sc-pf` | dark |
| 04 | Key capabilities | `sc-capabilities` | `.sc-cp` | tint |
| 05 | Coverage | `sc-coverage` | `.sc-cv` | white |
| 06 | Use cases | `sc-usecases` | `.sc-uc` | dark |
| 07 | Business impact | `sc-impact` | `.sc-im` | white |
| 08 | Why CybrHawk | `sc-why` | `.sc-wy` | calm gradient |
| 09 | FAQ | `sc-faq` | `.sc-fq` | white |

Element classes take the form `sc-xx__name` and modifiers `sc-xx__name--mod`. Every `id` is prefixed `sc-`. Section 04's root carries **`id="sc-capabilities"`**, which the hero's secondary CTA "Tour All Features" links to. Give it `scroll-margin-top: 96px`.

Every CTA carries `data-sc-cta="<placement>"` (`hero-primary`, `hero-secondary`) so marketing can track clicks in GTM without code changes.

**Copy rules.** All copy comes from Appendix A. "Eyebrow" is the section label and "title" is the H2. **Don't invent copy.** The only allowed edits are listed in §10.

### 6.1 · 01 Hero (`.sc-hero` → `.sc-hr`)

- This is the only `<h1>` on the page. If the template prints the WordPress page title as a second H1, hide it (§9 notes).
- **Desktop (≥1025px):** two columns, copy about 1.05fr (600px cap) and visual about 0.95fr.
- **Copy column, in order:**
  1. Mono **eyebrow** with the three-into-one mark
  2. **H1** as three spans inside one `<h1>`, separated by real spaces so screen readers read one sentence: "Secure Every Cloud." / "Detect Every Threat." / "Respond in Real Time." Each span is `display: block`. Lines 1–2 are in `--sc-on-dark`. Line 3 is in `--sc-accent-on-dark`, because it is the story's resolution.
  3. **Subheadline** at 18–20px in `--sc-on-dark-body`, max 36em
  4. **Button row:** primary "Request a Demo" (solid `--sc-accent`, links to the demo page) and secondary "Tour All Features" (ghost, white 1px border, links to `#sc-capabilities` with smooth scroll unless reduced motion). Both use the walkthrough-cta button shape (10px radius, 14×26px padding, 2px lift on hover).
  5. **Trust strip:** a `<ul>` of four items below a `--sc-border-dark` hairline, each with a 16px check icon in `--sc-accent-on-dark` and the label at 14.5px weight 600. A single row that wraps on desktop, and a 2×2 grid at ≤520px.
- **Visual column: the "convergence console".** It is coded, not an image, and the whole visual is `aria-hidden="true"`.
  - A console card (the HawkINT console idiom) about 460px wide. Its **chrome bar** holds three dots, the mono label "CybrHawk SIEM Cloud" and a **status chip** on the right.
  - Under the chrome sits a row of four mono **provider tabs**: "AWS", "Azure", "GCP", "SaaS". These are static labels.
  - **Body: three signal rows**, each with a lane chip (mono, uppercase, lane-tone text on a 10% lane-tone fill) and a signal name in Figtree at 14px:
    - `POSTURE` · "Misconfiguration"
    - `IDENTITY` · "Risky permission"
    - `THREAT` · "Suspicious API call"
  - Under the rows, a **story card** in blue reads "One prioritized story of risk", and below it a **guardrail row** with a check node reads "Guardrail: Revoke tokens · Rotate keys".
  - **The loop** is driven by the JS stepping a `data-step` attribute (0–3); the CSS handles every visual change:
    - **0 · Separate alerts:** the three rows appear one by one, spaced apart, each with its own lane-coloured left bar. Chip reads `states.separate`.
    - **1 · Correlated:** the rows slide together (`translateY`), thin connector lines from each row's bar converge into the story card, and the story card fades in. Chip reads `states.correlated` in blue.
    - **2 · Guardrail applied:** the guardrail row fades in and its node shows a check. Chip reads `states.guarded`.
    - **3 · Hold:** about 2.4s, then everything fades and restarts. Steps 0–2 last about 1.8s each.
  - **Pause** the loop when the console is off screen (IntersectionObserver) or the tab is hidden, using the IR pattern. Under reduced motion, render it **static in the final state**: rows together, story card and guardrail shown, chip "Guardrail applied".
  - Behind the console sits a faint offset second console (8px down and right, 40% opacity), for depth without another illustration.
  - All labels are HTML at ≥12px, never SVG text. The console stays inside its column at every width from 320px up.
  - Optional: if `CONTENT.hero.visual.image` is set, show that image instead, and fall back to the console if it fails to load (`media()` / `iconFallback()`).
- **Padding:** top `clamp(48px, 6vw, 96px)`, bottom `clamp(56px, 7vw, 104px)`. If the theme header overlays this template, add top padding so it clears the eyebrow (see `--hk-hr-bar` in hawk-int.css).
- **≤1024px:** columns stack, copy first, with the console centred below at most 480px wide. **≤620px:** the buttons stack and go full width.

### 6.2 · 02 The challenge (`.sc-challenge` → `.sc-ch`)

- **Desktop:** split at about 1fr / 1fr with a wide gap.
  - **Left:** header aligned to the start, with the eyebrow "The Challenge" and the H2 "The Cloud Moves Fast. [[So Do Attackers.]]". Below it, two paragraphs: the first at 17–18px in `--sc-heading`, the second at body size in `--sc-text`.
  - **Right: "four separate consoles".** The four pain points as a `<ul>`, each `<li>` drawn as a small **window card**: a chrome bar with a 7px dot and the pain-point title in mono uppercase, then a body with the description at 15.5px. Lay them out 2×2, but **deliberately out of alignment**: each card has its own small offset (±6–12px) and rotation (−1.2° to +1.2°), set inline with `--dx`, `--dy` and `--rot`. This is the visual for "juggling separate consoles".
  - Chrome dot per card: Misconfigurations = posture amber, Identity sprawl = identity teal, Multi-cloud complexity = neutral `--sc-text`, and **SaaS blind spots = a hollow ring** (no signal: you can't see into it).
- **≤1024px:** one column, header first, then paragraphs, then the cards. **≤600px:** cards in one column with **no rotation or offset**, because misalignment on a narrow screen just looks broken.
- Under reduced motion, cards are aligned and unrotated at every width.
- Icons: none. The chrome bars carry it.

### 6.3 · 03 Platform overview (`.sc-platform` → `.sc-pf`) is the signature section

- Dark ground. Header centred: eyebrow "Platform Overview", the H2 "Posture, Identity, and Threat Detection in [[One Cloud Security Platform]]", and the paragraph as the sub-line (max 46em).
- **Four steps as an `<ol>`**, using the how-it-works connector technique, with **the lanes converging**:
  - **≥1100px: horizontal pipeline.** Four columns. Each has a 48px node (a 2px ring, the mono number inside), then the `<h3>` step name in white at 18px, then the text in `--sc-on-dark-body` at 15px.
  - **The rail is the story.** Between step 1 (Connect) and step 2 (Ingest & Correlate), **three parallel 2px lines** run in the three lane on-dark inks, about 6px apart. At step 2's node they **merge**: draw the merge as one small inline SVG with `vector-effect: non-scaling-stroke`, fading in after the lines arrive. From step 2 onward a **single blue line** (`--sc-accent-on-dark`) runs through steps 3 and 4.
  - Node colours: step 1 neutral white ring; steps 2–4 blue ring, with a soft blue glow at 25% on step 4 (Respond & Remediate) as the end point.
  - Under the three lines, between steps 1 and 2, three tiny mono labels: "Posture", "Identity", "Threat" (in `CONTENT.platform.lanes`) in their on-dark inks at 11.5–12px. They are inside the `aria-hidden` rail, because the H2 already says this in words.
  - **Reveal:** as §4.4.
- **<1100px: vertical pipeline.** The rail runs down the left behind the nodes; each step is a row with the node on the left and the name and text on the right. The three lanes run down from step 1 and merge at step 2, then one line continues. The reveal draws with `scaleY`.
- Don't put the steps in cards. The rail *is* the structure.

### 6.4 · 04 Key capabilities (`.sc-capabilities` → `.sc-cp`, `id="sc-capabilities"`)

- Header aligned to the start (for variety after a centred header): eyebrow "Key Capabilities" and the H2 "Complete [[Cloud Detection & Response]]".
- **"Control matrix" layout, not floating cards.** Nine capabilities as a `<ul>` in a **3×3 grid with no gaps**. Cells share 1px `--sc-border` hairlines (draw them with borders on the cells plus a border on the grid, or `gap: 1px` over a border-coloured grid background), and the matrix sits in one white panel with a 16px radius, `--sc-shadow` and `overflow: hidden`.
- Each cell: a mono index "01"–"09" top left in `--sc-text`, a 40px icon badge (accent-soft fill, accent-ink stroke) top right, then the `<h3>` title at 18px weight 700 in `--sc-heading`, then the text at 15.5px.
- Hover: the cell background tints to `--sc-accent-soft` at 50%, and the index turns `--sc-accent-ink`. **No lift, no pointer cursor.** The cells aren't links.
- **≥1025px:** 3 columns. **600–1024px:** 2 columns, and the ninth cell spans both columns. **<600px:** 1 column.
- Cells are `<article id="sc-cap-{slug}">` inside the `<li>`, so other pages can deep-link to them.
- Icons: a new `drift` (a shape with a dashed offset copy) for Misconfiguration & Drift, `identity` for IAM Threat Detection, `radar` for Real-Time Threat Detection, a new `apps` (a 2×2 app grid) for SaaS Security, `shield-refresh` for Guardrail Response, `network` for Workload & Network Visibility, `link` for Supply-Chain Risk, `dashboard` for Unified Dashboard, `file-check` for Compliance Reporting.

### 6.5 · 05 Coverage (`.sc-coverage` → `.sc-cv`)

- Header centred: eyebrow "Coverage" and the H2 "Broad Coverage Across [[Your Cloud Estate]]".
- **"Service manifest" layout.** Six coverage groups as a `<ul>`, in **two columns of three rows** at ≥960px, one column below that. Each group is a row with:
  - a 3px left rule in `--sc-accent` that runs only 28px tall (a tab marker)
  - the `<h3>` group name at 18px weight 700 ("Amazon Web Services")
  - **either** a wrapping row of mono **service chips** (`--sc-bg-tint` fill, 1px `--sc-border`, 6px radius, 13px, `--sc-heading`) when the CONTENT item has `chips`, **or** the plain sentence at 15.5px when it has `text`
  - rows separated by `--sc-rule`
- The chips are a `<ul>` inside the row, so screen readers announce "list, 7 items".
- **No vendor logos or brand colours.** Provider names are plain text.
- Icons: none. The chips are the texture of this section.

### 6.6 · 06 Use cases (`.sc-usecases` → `.sc-uc`)

- Dark ground. Header aligned to the start: eyebrow "Use Cases" and the H2 "Stop the Cloud Threats [[That Matter Most]]".
- **Six use cases as a `<ul>`.** Three columns at ≥1025px, two at ≥640px, one below that.
- Each card: `rgba(255,255,255,.04)` fill, `--sc-border-dark` border, 16px radius. At the top, a **2px lane line** that runs the full card width in the item's lane on-dark ink (from CONTENT `lane`; decoration only, no visible lane label). Below it, a 40px icon in a ringed node (`--sc-on-dark-body` stroke), the `<h3>` title in white at 18px, and the text in `--sc-on-dark-body` at 15.5px.
- These cards aren't links: no hover lift.
- Icons: a new `bucket` (an open storage bucket) for Exposed Storage, a new `key` for Compromised Credentials, a new `escalate` (stacked chevrons up) for Privilege Escalation, a new `cpu` for Crypto-Mining, `user-eye` for SaaS Account Takeover, `file-check` for Continuous Compliance.

### 6.7 · 07 Business impact (`.sc-impact` → `.sc-im`)

- Header aligned to the start: eyebrow "Business Impact" and the H2 "Cloud Security That [[Accelerates the Business]]".
- **"Outcome ledger" layout, editorial, no cards and no icons.** Six outcomes as an `<ol>`. At ≥900px each row is a two-column grid at about 0.9fr / 1.1fr: the **left** holds a mono index "01" in `--sc-accent-ink` above the `<h3>` title at `clamp(22px, 2.2vw, 28px)` weight 700, and the **right** holds the text at 17px in `--sc-text`, aligned to the title's baseline. Rows are separated by 1px `--sc-rule` lines with generous vertical padding (28–36px).
- On hover nothing moves. Under 900px, title and text stack.

### 6.8 · 08 Why CybrHawk (`.sc-why` → `.sc-wy`)

- Calm gradient ground. Header centred: no eyebrow (§10), the H2 "Why CybrHawk for [[Cloud Security]]".
- **Bento:** five differentiators as a `<ul>`.
  - **≥1100px:** `grid-template-columns: 1.2fr 1fr 1fr` with areas
    ```
    "a b c"
    "a d e"
    ```
  - **a · Detection and Posture Together** is the anchor: a **dark card** (`--sc-night-2`) with white text. Under its text sits a small `aria-hidden` mini-diagram that repeats the page's motif: three short lines in the lane on-dark inks merging into one blue line, ending in a node. It is static, with no animation.
  - **b–e** are white cards with a 16px radius, 1px `--sc-border`, `--sc-shadow`, a 40px icon badge, the `<h3>` title and the text.
  - **700–1099px:** two columns, with `a` spanning both at the top. **<700px:** one column in DOM order.
- Icons: none on `a` (the diagram carries it), `globe` for True Multi-Cloud, `layers` for Unified With Your SOC, `shield` for Safe Automation, `headset` for Expert Support.

### 6.9 · 09 FAQ (`.sc-faq` → `.sc-fq`)

- White ground. Header centred: no eyebrow (§10), the H2 "Frequently Asked Questions". One column, at most 880px wide.
- Six accordion items, using the UDC FAQ pattern exactly: each is an `<h3>` holding a `<button aria-expanded aria-controls>` with the question at 17–18px weight 600 in `--sc-heading`, plus a plus-to-minus icon. Each answer is a `<div role="region" aria-labelledby>` that carries `hidden` while closed. Items are separated by `--sc-rule`. All start closed, and more than one can be open. The reveal is a short keyframe fade, with none under reduced motion. Bind the toggles by delegation from the section root.
- **Optional FAQ schema.** If `CONTENT.faq.schema` is `true`, append one `<script type="application/ld+json">` with a `FAQPage` built from the same CONTENT (plain text, no HTML) inside the section root, once (idempotent). **Default `false`**, because the SEO plugin may already output FAQ schema. Leave a `// TODO:` to confirm with whoever runs Rank Math or Yoast.
- The section **ends on white with its normal bottom padding**, because the existing CTA component comes next.

---

## 7. Accessibility (required)

- **Headings:** exactly one `h1` (hero). Sections 02–09 each get an `h2`, and cards, items, steps and questions get `h3`. Never skip a level. Labels inside the hero console and the section-03 rail are inside `aria-hidden`, so they don't count.
- **Lists:** every list is a `<ul>`/`<ol>`: trust strip, pain points, steps, capabilities, coverage groups and their chips, use cases, outcomes, differentiators.
- **Contrast:** 4.5:1 for text and 3:1 for UI parts and graphics, on light and dark grounds. Use the `*-ink` and `*-on-dark` tokens for small coloured text. Lane colour is never the only signal.
- **Keyboard:** every interactive element has `:focus-visible { outline: 3px solid rgba(12,104,255,.45); outline-offset: 3px; }`. On dark grounds use `rgba(110,168,255,.7)`. The FAQ works with Enter and Space (a native `<button>` handles that).
- **Reduced motion:** no load stagger, no loops, no rail draw, no console scatter, no hover translate, no smooth scroll.
- **Links:** descriptive text, and no `href="#"` or `href=""`. A CTA with an empty `href` isn't rendered.

## 8. Robustness and performance

- No libraries, no jQuery, no CDNs and no icon fonts. No network requests beyond optional image URLs in CONTENT.
- No scroll listeners. Use IntersectionObserver for reveals, the section-03 draw and pausing the hero loop.
- No fixed heights on anything that holds text.
- **No horizontal scroll at any width down to 320px.** The rotated consoles in 02 and the hero console's offset shadow must not cause it (`overflow: clip` on those section roots).
- Running the script twice must not duplicate anything, including the FAQ schema script.
- If one container is missing or one builder throws, every other section still builds. If the capabilities container is missing, the hero's "Tour All Features" button is not rendered (no dead anchor).

## 9. `siem-cloud.html`: local preview harness

A full document, not deployed:
- `<!doctype html>`, `lang="en"`, the charset and viewport metas, and Figtree 400–700 from Google Fonts (the live site loads its own)
- `<link rel="stylesheet" href="siem-cloud.css">`
- a tiny inline `<style>` for the preview only: `body { margin: 0; font-family: "Figtree", sans-serif; }`
- a fake 72px site header bar at the top, so anchor offsets can be checked
- nine mock containers in page order, `<div class="e-con e-con-full sc-hero"></div>` and so on. Give two of them an inner `<div class="e-con-inner"></div>` so both host paths get exercised.
- a grey placeholder block after the FAQ labelled "Existing CTA component goes here"
- `<script src="siem-cloud.js"></script>`

At the top, an HTML comment with the **Elementor setup steps**:
1. Create the 9 containers in the order of the §6 table: Full Width, padding 0, no background, class in CSS Classes.
2. Load `siem-cloud.css` and `.js` the same way the other pages' files are loaded.
3. Hide the page title if the template prints a second H1.
4. Put the existing CTA container after the FAQ, and paste Appendix B into its CONTENT block.
5. Paste Appendix C into the SEO plugin (Rank Math or Yoast).

## 10. Don'ts

- **Don't change the copy.** These are the only allowed edits, and Appendix A has already made them:
  - splitting "Title: text" and "Title — text" into `title` and `text` fields
  - dropping the "Card 1 ·", "Use Case 1 ·", "Outcome 1 ·" and "Q:"/"A:" prefixes in favour of generated numbers or the accordion structure
  - splitting the AWS, Azure, Google Cloud and Identity Providers service lists into chips, dropping the joining "and"
  - wrapping existing words in `[[…]]` for the accent
  - dropping the eyebrows on 08 ("Why CybrHawk") and 09 ("FAQ"), because they would repeat the H2
  - console and rail labels in the hero visual and section 03, all taken from words already in the copy (see the CONTENT comments)

  The copy uses **US spelling** ("prioritized", "personalized"). Keep it as written.
- Don't build the final CTA.
- Don't invent statistics, customer names, logos, certifications, testimonials or "recommended" tags.
- Don't use font weights above 700, an extra web font, `!important` without a comment, global selectors, or any change outside `siem-cloud/`.
- Don't put an unescaped CONTENT string into `innerHTML` or `insertAdjacentHTML`.
- Don't use the lane colours for anything except showing a signal type.

## 11. Acceptance checklist

Open `siem-cloud/siem-cloud.html` and confirm each point:

- [ ] Every section renders at **1440, 1280, 1024, 820, 768, 390 and 360px**, and at each width `document.documentElement.scrollWidth === window.innerWidth`.
- [ ] The convergence story reads top to bottom: three lanes in the hero console, scattered consoles in 02, three lines merging into one in 03, then mostly blue from 04 on.
- [ ] Each section's layout differs from the one above it: split + console, split + scattered windows, converging pipeline, hairline matrix, two-column manifest, dark card grid, editorial ledger, bento with dark anchor, accordion.
- [ ] The hero load stagger plays once. The console loops, pauses off screen or on a hidden tab, and is static in the "Guardrail applied" state under reduced motion.
- [ ] "Tour All Features" lands on section 04 with its heading visible below the fake header.
- [ ] With **reduced motion** on, everything is visible immediately, nothing moves, and the 02 consoles are aligned.
- [ ] Using only the **keyboard**, you can reach both hero CTAs and every FAQ question, and focus is visible on light and dark grounds.
- [ ] Deleting any one mock container still builds the other eight with no console errors. Re-running the script adds no duplicates.
- [ ] The heading outline is one H1, eight H2s (02–09), and H3s inside them.
- [ ] Every string matches Appendix A **character for character**.
- [ ] Contrast spot checks pass: teal identity ink on white, amber on white, lane chips in the hero console, chips in 05, and muted text on dark.
- [ ] No vendor logos, no purple, no globe.

Leave a `// TODO:` in CONTENT for every open item marked in Appendix A.

---

## Appendix A: copy, verbatim, shaped for CONTENT

```js
var CONTENT = {

  hero: {
    eyebrow: "SIEM Cloud · Cloud Detection & Response (CDR)",
    // Three spans inside one <h1>; line 3 in the accent.
    title: ["Secure Every Cloud.", "Detect Every Threat.", "Respond in Real Time."],
    sub: "CybrHawk SIEM Cloud correlates cloud-native logs, posture findings, and identity activity across AWS, Azure, Google Cloud, and SaaS. It finds misconfigurations, IAM abuse, and active attacks, then responds automatically with built-in guardrails, so you can move fast in the cloud without losing control.",
    cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
    ctaSecondary: { label: "Tour All Features", href: "#sc-capabilities" },
    trust: [
      "AWS, Azure, GCP, and SaaS",
      "Agentless, API-based onboarding",
      "Posture plus threat detection",
      "Automated guardrail response"
    ],
    // The convergence console. Signal names come from the section 03 paragraph
    // ("a misconfiguration, a risky permission, and a suspicious API call"),
    // the story line from "a single, prioritized story of risk", the guardrail
    // actions from capability 5. State words are UI labels.
    visual: {
      label: "CybrHawk SIEM Cloud",
      providers: ["AWS", "Azure", "GCP", "SaaS"],
      signals: [
        { lane: "posture",  tag: "Posture",  text: "Misconfiguration" },
        { lane: "identity", tag: "Identity", text: "Risky permission" },
        { lane: "threat",   tag: "Threat",   text: "Suspicious API call" }
      ],
      story: "One prioritized story of risk",
      guardrail: "Guardrail: Revoke tokens · Rotate keys",
      states: { separate: "Separate alerts", correlated: "Correlated", guarded: "Guardrail applied" },
      image: "",
      imageAlt: ""
    }
  },

  challenge: {
    eyebrow: "The Challenge",
    title: "The Cloud Moves Fast. [[So Do Attackers.]]",
    body: [
      "Cloud environments change by the minute. New workloads, identities, API keys, and permissions are created constantly, often by automation and across multiple providers. A single misconfigured storage bucket, an over-privileged role, or a leaked access key can expose sensitive data in seconds.",
      "Traditional security tools were built for static data centers. They struggle with ephemeral workloads, cloud-native logs, and identity-centric attacks. Security teams are left juggling separate consoles for each cloud, posture tools that generate endless findings, and SaaS apps they cannot see into at all."
    ],
    // dot: posture | identity | neutral | hollow. Offsets and rotation are per card (§6.2).
    items: [
      { dot: "posture",  title: "Misconfigurations",       text: "Misconfigured resources remain one of the most common causes of cloud breaches." },
      { dot: "identity", title: "Identity sprawl",         text: "Excessive permissions, unused roles, and long-lived keys create easy paths for attackers." },
      { dot: "neutral",  title: "Multi-cloud complexity",  text: "Each provider has its own logs, services, and security model." },
      { dot: "hollow",   title: "SaaS blind spots",        text: "Critical business data lives in Microsoft 365, Google Workspace, and other SaaS apps outside traditional monitoring." }
    ]
  },

  platform: {
    eyebrow: "Platform Overview",
    title: "Posture, Identity, and Threat Detection in [[One Cloud Security Platform]]",
    sub: "CybrHawk SIEM Cloud brings cloud security posture management, identity threat detection, and real-time threat analytics together. Instead of treating a misconfiguration, a risky permission, and a suspicious API call as three separate alerts, it connects them into a single, prioritized story of risk, and gives you the tools to fix it.",
    // Rail labels (aria-hidden), from the H2.
    lanes: ["Posture", "Identity", "Threat"],
    steps: [
      { title: "Connect",               text: "Onboard AWS, Azure, GCP, and SaaS accounts in minutes through read-only APIs, with no agents required." },
      { title: "Ingest & Correlate",    text: "Collect AWS CloudTrail, Azure Activity Logs, GCP Audit Logs, flow logs, CSPM findings, and identity events into one data layer." },
      { title: "Detect & Prioritize",   text: "Analytics, behavioral models, and threat intelligence surface real threats and rank them by exposure and business impact." },
      { title: "Respond & Remediate",   text: "Trigger guardrail actions, open tickets, and deliver step-by-step remediation guidance to cloud and DevOps teams." }
    ]
  },

  capabilities: {
    eyebrow: "Key Capabilities",
    title: "Complete [[Cloud Detection & Response]]",
    items: [
      { slug: "drift",      icon: "drift",          title: "Misconfiguration & Drift Detection",
        text: "Continuously assess cloud resources against security best practices and your own baselines. Detect drift the moment it happens, with automatic ticketing and clear remediation guidance." },
      { slug: "iam",        icon: "identity",       title: "Cloud Identity & IAM Threat Detection",
        text: "Identify suspicious IAM activity, access-key misuse, privilege escalation, and dormant or over-privileged identities before attackers exploit them." },
      { slug: "threats",    icon: "radar",          title: "Real-Time Cloud Threat Detection",
        text: "Detect crypto-mining, data exfiltration, unusual API calls, impossible travel, and attacker reconnaissance across cloud control planes." },
      { slug: "saas",       icon: "apps",           title: "SaaS Security Visibility",
        text: "Monitor Microsoft 365, Google Workspace, and other productivity and IT apps for risky sharing, account takeover, malicious OAuth apps, and admin abuse." },
      { slug: "guardrails", icon: "shield-refresh", title: "Guardrail Response Actions",
        text: "Quarantine workloads, revoke tokens, rotate keys, and block risky policies automatically or with one-click approval." },
      { slug: "network",    icon: "network",        title: "Workload & Network Visibility",
        text: "Analyze VPC and VNet flow logs to spot unexpected internet exposure, suspicious east-west traffic, and anomalous egress." },
      { slug: "supply",     icon: "link",           title: "Supply-Chain Risk Detection",
        text: "Monitor third-party integrations, CI/CD pipelines, and cross-account access for signs of supply-chain compromise." },
      { slug: "dashboard",  icon: "dashboard",      title: "Unified Multi-Cloud Dashboard",
        text: "See risk, threats, and compliance status across every cloud account and subscription in a single view." },
      { slug: "compliance", icon: "file-check",     title: "Cloud Compliance Reporting",
        text: "Map controls and evidence to CIS Benchmarks, NIST, ISO 27001, PCI DSS, HIPAA, SOC 2, and GDPR requirements." }
    ]
  },

  coverage: {
    eyebrow: "Coverage",
    title: "Broad Coverage Across [[Your Cloud Estate]]",
    // Either chips (split from the copy's list, joining "and" dropped) or text (verbatim sentence).
    items: [
      { title: "Amazon Web Services",
        chips: ["CloudTrail", "GuardDuty", "VPC Flow Logs", "IAM", "S3", "EKS", "Security Hub"] },
      { title: "Microsoft Azure",
        chips: ["Activity Logs", "Entra ID (Azure AD) sign-in and audit logs", "NSG Flow Logs", "Defender for Cloud", "AKS"] },
      { title: "Google Cloud",
        chips: ["Cloud Audit Logs", "VPC Flow Logs", "IAM", "Security Command Center", "GKE"] },
      { title: "SaaS & Productivity",
        text: "Microsoft 365, Google Workspace, and leading collaboration and IT applications" },
      { title: "Containers & Kubernetes",
        text: "Audit logs and runtime signals from managed Kubernetes services" },
      { title: "Identity Providers",
        chips: ["Okta", "Microsoft Entra ID", "federated SSO activity"] }
    ]
  },

  usecases: {
    eyebrow: "Use Cases",
    title: "Stop the Cloud Threats [[That Matter Most]]",
    // lane drives the card's top line only (decoration, no visible label).
    items: [
      { lane: "posture",  icon: "bucket",    title: "Exposed Storage & Data Leaks",
        text: "Find public buckets, open blob containers, and overly permissive sharing, and close them before data is exposed." },
      { lane: "identity", icon: "key",       title: "Compromised Credentials & Keys",
        text: "Detect leaked or misused access keys and tokens, then revoke and rotate them automatically." },
      { lane: "identity", icon: "escalate",  title: "Privilege Escalation",
        text: "Catch attackers creating new admin roles, attaching policies, or assuming roles across accounts." },
      { lane: "threat",   icon: "cpu",       title: "Crypto-Mining & Resource Abuse",
        text: "Spot unexpected compute spikes, unusual regions, and GPU instances launched by attackers." },
      { lane: "threat",   icon: "user-eye",  title: "SaaS Account Takeover",
        text: "Identify suspicious logins, mailbox rule changes, mass downloads, and malicious OAuth consent in Microsoft 365 and Google Workspace." },
      { lane: "posture",  icon: "file-check", title: "Continuous Cloud Compliance",
        text: "Maintain an always-current view of compliance posture and generate audit evidence on demand." }
    ]
  },

  impact: {
    eyebrow: "Business Impact",
    title: "Cloud Security That [[Accelerates the Business]]",
    items: [
      { title: "Reduce Cloud Breach Risk", text: "Find and fix the misconfigurations and identity weaknesses attackers target first." },
      { title: "Respond in Real Time",     text: "Automated guardrails contain cloud threats in seconds, before they escalate." },
      { title: "Cut Alert Noise",          text: "Correlated, risk-ranked findings replace thousands of disconnected posture alerts." },
      { title: "Empower DevOps",           text: "Clear remediation guidance and ticketing integrations help engineering teams fix issues fast, without slowing delivery." },
      { title: "Simplify Audits",          text: "Continuous compliance mapping and evidence collection reduce audit preparation effort." },
      { title: "Consolidate Tools",        text: "One platform replaces separate CSPM, cloud log analytics, and SaaS monitoring tools." }
    ]
  },

  why: {
    eyebrow: "",   // "Why CybrHawk" would repeat the H2
    title: "Why CybrHawk for [[Cloud Security]]",
    // Item 1 is the dark anchor card with the mini convergence diagram.
    items: [
      { icon: "",        title: "Detection and Posture Together", text: "Most tools do one or the other. CybrHawk connects misconfigurations, identities, and live threats in one view." },
      { icon: "globe",   title: "True Multi-Cloud",               text: "Consistent detection, response, and reporting across AWS, Azure, Google Cloud, and SaaS." },
      // TODO: copy says "SIEM XDR"; the UCD page writes "SIEM / XDR". Confirm before launch. Don't change it here.
      { icon: "layers",  title: "Unified With Your SOC",          text: "Cloud detections correlate natively with endpoint, network, and identity data in CybrHawk SIEM XDR." },
      { icon: "shield",  title: "Safe Automation",                text: "Guardrail responses include approvals, scoping, and rollback, so automation never breaks production." },
      { icon: "headset", title: "Expert Support",                 text: "Optional 24/7 cloud threat monitoring and response from the CybrHawk SOC." }
    ]
  },

  faq: {
    eyebrow: "",   // "FAQ" would repeat the H2
    title: "Frequently Asked Questions",
    // TODO: confirm whether the SEO plugin already emits FAQ schema before turning this on.
    schema: false,
    items: [
      { q: "What is Cloud Detection and Response (CDR)?",
        a: "CDR is a security approach that continuously monitors cloud environments for threats, using cloud-native logs, identity activity, and configuration data, and enables rapid, automated response. It is built for the speed and scale of cloud infrastructure." },
      { q: "How is SIEM Cloud different from CSPM?",
        a: "CSPM identifies misconfigurations. CybrHawk SIEM Cloud includes posture assessment but also detects active threats, correlates identity and API activity, and takes response actions, giving you prevention and detection in one platform." },
      { q: "Which cloud platforms are supported?",
        a: "Amazon Web Services, Microsoft Azure, and Google Cloud, plus SaaS applications such as Microsoft 365 and Google Workspace." },
      { q: "Do I need to install agents?",
        a: "No. CybrHawk SIEM Cloud connects through cloud provider APIs and log services using read-only access, so onboarding is fast and does not affect workloads." },
      { q: "Can it take automated action?",
        a: "Yes. Guardrail responses can quarantine workloads, revoke tokens, rotate keys, and block risky policies, either automatically or after approval." },
      { q: "Does it help with compliance?",
        a: "Yes. Controls and evidence are mapped to frameworks including CIS Benchmarks, NIST, ISO 27001, PCI DSS, HIPAA, SOC 2, and GDPR." }
    ]
  }
};
```

## Appendix B: final CTA copy (for the existing CTA component, not built here)

| Field | Value |
|---|---|
| CTA heading | Take Control of Your Cloud Security. |
| CTA body | See how CybrHawk SIEM Cloud finds misconfigurations, stops identity abuse, and contains cloud threats across AWS, Azure, Google Cloud, and SaaS. Book your personalized demo today. |
| Primary button | Request a Demo → `https://cybrhawk.com/request-for-demo/` |
| Secondary button | Talk to a Cloud Security Expert → `https://cybrhawk.com/contact/` |
| Supporting line | Call 954-324-4750 or email sales@cybrhawk.com. (`tel:+19543244750`, `mailto:sales@cybrhawk.com`) |

## Appendix C: SEO fields (for the SEO plugin, not code)

| Field | Value |
|---|---|
| Meta title (≤60) | SIEM Cloud \| Cloud Detection & Response (CDR) \| CybrHawk |
| Meta description (≤160) | Secure AWS, Azure, GCP, and SaaS with CybrHawk SIEM Cloud. Detect misconfigurations, IAM abuse, and cloud threats, and respond automatically with guardrails. |
| URL slug | `/siem-cloud/` |
| Primary keyword | cloud detection and response |
| Secondary keywords | cloud SIEM, CDR, cloud security monitoring, CSPM, multi-cloud security, AWS CloudTrail monitoring, SaaS security, IAM threat detection |
| Open Graph title | CybrHawk SIEM Cloud: Detect and Stop Threats Across Every Cloud |
