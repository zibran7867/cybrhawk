# Build the CybrHawk SIEM XDR page: `siem-xdr/siem-xdr.{js,css,html}`

## 1. The job

Build the **SIEM XDR (Fusion Analytic Threat Platform)** page for `https://cybrhawk.com/siem-xdr/`. It covers sections 01–09 of the approved copy. That copy is in **Appendix A**, word for word, already shaped for the CONTENT block.

**Out of scope for now: section 10 (FAQ) and section 11 (final call to action).** Don't build them and don't leave placeholders for them in the JS or CSS. Their copy is parked in **Appendix B** so it isn't lost. Section 09 (Why CybrHawk) ends the page you build. It must end on a light ground with its normal bottom padding, so whatever comes next (the site's CTA component, or a FAQ added later) joins without a seam.

| File | Status | What goes in it |
|---|---|---|
| `siem-xdr/siem-xdr.js` | exists, empty | Builds all 9 sections, each into its own Elementor container |
| `siem-xdr/siem-xdr.css` | exists, empty | Every style for the page, scoped to those containers |
| `siem-xdr/siem-xdr.html` | **create** | Local preview harness (not deployed) plus the Elementor setup notes (§9) |

Don't edit anything outside `siem-xdr/`.

---

## 2. Reuse first: don't invent new section designs

**Every section on this page reuses a design that already ships on the HawkINT, Incident Response or SIEM Cloud page.** Port the markup shape, the CSS technique and the motion, then re-skin it with this page's tokens and copy. Only draw something new where §6 says so, and even then build it from an existing technique.

### 2.1 Read these before writing anything

The site runs on WordPress and Elementor. **The Elementor container markup is fixed, so we ship only JS and CSS.** The script finds an empty container by its CSS class, injects the section's markup, and the CSS styles that markup.

| Read | For |
|---|---|
| `siem-ndr/siem-ndr.js` + `.css` | **The reference build. Copy its architecture exactly:** file header comment, `SECTIONS` map, `DARK` map, the "Content (edit freely)" block, `ICONS` + `icon()`, `esc` / `nl2br` / `markup` / `pad`, `head()`, `button()`, `mount()`, `media()` with `iconFallback()`, `whileVisible()`, per-builder try/catch in `buildAll()`, `reveal()`, `init()` with the 10 s MutationObserver, `HERO_AMBIENT`. It is the newest file and already ports two of the HawkINT designs used here into the builder architecture: `buildAnalyzes` (`.hawk-caps` datasheet) and `buildReporting` (`.hawk-industries` selector). **Start sections 04 and 06 from those builders**, not from scratch. |
| `siem-cloud/siem-cloud.js` + `.css` | Section designs ported in §6: hero (`buildHero`), scattered consoles (`buildChallenge`), converging pipeline (`buildPlatform`), service manifest (`buildCoverage`) |
| `siem-cloud/SIEM-CLOUD-PAGE-PROMPT.md` §3, §7, §8 and `siem-ndr/SIEM-NDR-PAGE-PROMPT.md` §3, §7, §8 | House conventions, accessibility and robustness rules. **They all apply here unchanged**, with `sc-` / `nd-` read as `xd-`. §3 below is a reminder, not a replacement. |
| `HawkINT/hawk-int.js` + `.css` | Section designs ported in §6: the **AI core diagram** (`.hawk-ai`), the **console outputs readout** (`.hawk-about`, the `hk-about__out*` rows), and the **reasons ledger** with sticky header (`.hawk-why`). **Borrow the designs, not the file structure:** HawkINT is one IIFE per section; this page is one IIFE with builders, like siem-ndr.js. |
| `incident-response/incident-response.js` + `.css` | The node-ring and connector technique of the response process (`buildProcess`), used for section 03's step nodes; the `users-table`, `mail-alert` and `crosshair` glyphs |

`enterprise-operations-intelligence/seconn-section/` is the exception: static HTML and ES6. **Don't copy its style.**

### 2.2 Section → source map

| # | XDR section | Reuse this design | Source | What changes |
|---|---|---|---|---|
| 01 | Hero | Light copy split + edge-to-edge dark panel, image with coded-console fallback, ambient scan line + mouse drift | SIEM Cloud 01 / SIEM NDR 01 · `buildHero` | Console becomes the **storyline console** (§6.1) |
| 02 | The challenge | Split layout, "four separate consoles" scattered windows | SIEM Cloud 02 · `buildChallenge` | Adds a mismatched **tool tab bar** above the windows (§6.2) |
| 03 | Platform overview | Horizontal pipeline with lanes merging into one line, vertical on mobile | SIEM Cloud 03 · `buildPlatform` (+ IR 05 node rings) | **Signature section.** Six source threads merge into one storyline, which gets scored and then resolved (§6.3) |
| 04 | Key capabilities | Hairline capability datasheet, ghosted index numerals | HawkINT `.hawk-caps` via SIEM NDR · `buildAnalyzes` | Nine cells, 3×3; the "Tour All Features" target (§6.4) |
| 05 | Detection deep dive | Core diagram: intro + living core node left, connected pills right | HawkINT · `.hawk-ai` | Six detection layers feed one XDR core (§6.5) |
| 06 | Use cases | Sector selector: tablist rail + detail panel, accordion on mobile | HawkINT `.hawk-industries` via SIEM NDR · `buildReporting` | Each panel shows a **storyline strip** built from that use case's own words (§6.6) |
| 07 | Business impact | Console **outputs readout**: mono index + one-word value tag per row | HawkINT · `.hawk-about` outputs | Six outcome rows in a dark console panel on a light ground (§6.7) |
| 08 | Integrations | Service manifest: grouped rows with text chips | SIEM Cloud 05 · `buildCoverage` | Dark ground, seven groups, CybrHawk products are the only blue chips (§6.8) |
| 09 | Why CybrHawk | Reasons ledger with sticky left header panel | HawkINT · `.hawk-why` | The sticky panel carries the **family hub** diagram: XDR at the centre of the other CybrHawk products (§6.9) |

Each section's layout differs from the one above it. If a port would put two similar shapes next to each other, change the port, not the order.

---

## 3. House conventions (summary; the files above are the authority)

- **JS:** one IIFE, `"use strict"`, **ES5 only**: `var`, `function` and string concatenation. No arrow functions, template literals, `let`/`const`, classes or modules. Open the file with a comment block, then `SECTIONS`, then `DARK`, then a **"Content (edit freely)"** block holding every visible string, URL and toggle. Every CONTENT string goes through `esc()` (or `markup()`/`nl2br()`) before it reaches HTML. Builders are idempotent. A missing container or a throwing builder skips only that section.
- **CSS:** scope every rule under a section container class. No bare element selectors, no global rules. Declare tokens once on `.xd-section`. Use `box-sizing: border-box` and `font-family: inherit`. Gutter is 24px, 22px at ≤980px and 18px at ≤520px. Reset `.e-con-inner` padding and max-width inside XD containers, as siem-ndr.css does. No `!important` without a comment saying why.
- **Figtree loads only up to weight 700.** Never use 800 or 900, because they fall back to Helvetica.
- **Icons:** inline SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and joins, `aria-hidden="true"`. Copy existing glyphs by name from the source files before drawing new ones (§6 names the source for each).
- Comments explain *why*. Match the comment density of siem-ndr.js.

---

## 4. Design direction: "every signal, one storyline"

The copy's thesis is in capability 3: *"Link related events across users, hosts, and time into a single incident with a clear attack storyline, instead of hundreds of disconnected alerts."* The pain it answers is in the challenge: *"Analysts rebuild attack timelines by hand across multiple consoles."*

So the page's visual language is the **storyline**: a timeline read left to right, where scattered events from different domains (endpoint, server, cloud, network, application, identity) get **stitched together by one blue thread** into a single incident, which is then **scored** and **resolved**. Think of an investigation timeline or a forensic case board drawn with engineering precision: vertical time gridlines, mono timestamps-without-numbers, small event chips, one thread. XDR is also the **hub of the CybrHawk family**: the SIEM Cloud and SIEM NDR pages end with lines merging into "SIEM XDR"; this page is where those lines arrive.

Generic XDR pages all look the same: a glowing shield, a hexagon mesh, a radar sweep, a neon "AI brain", purple gradients. Avoid that "AI slop" look.

| Stage | Sections | What the reader sees |
|---|---|---|
| Scattered | 01 Hero (start of loop), 02 Challenge | Events and consoles that don't line up |
| Stitched | 03 Platform, 04 Capabilities, 05 Detection | Six threads merge into one storyline; layers feed one core |
| Resolved | 06 Use cases, 07 Impact | Each threat as a short storyline that ends in a blue check; outcomes as a readout |
| Connected | 08 Integrations, 09 Why | The stack and the product family plug into one hub; calm, settled |

### 4.1 Colour: one dominant blue, one sharp accent with one meaning

- **Site blue `#0c68ff` is dominant.** It is the storyline thread, the response, the CybrHawk products and every CTA.
- **Risk amber is the single accent, with strict meaning: "this threat has been scored and prioritized."** Use it **only** for: the "Highest risk" badge on the hero incident card, the step-3 node ("Detect & Prioritize") in section 03, and the core's "Scored by risk" output in section 05. **Never** for buttons, hovers, tags, icons, chips or generic emphasis.
- Domain events (endpoint, identity, network and so on) are **neutral blue-grey** (`--xd-event`), never a rainbow of per-domain colours. The thread that joins them is what turns them blue.
- Resolution is blue with a check glyph, never green, so this page doesn't read as the IR page.
- Colour is never the only signal: every amber element sits next to a written label or lives inside an `aria-hidden` layer.
- No purple, and no blue-to-purple gradients anywhere.

### 4.2 Typography

- **Figtree** (400–700) for everything a reader reads. Don't load another web font: the live site already loads Figtree. The "distinctive type" job goes to the second voice and to the scale contrast below.
- The second voice is the **monospace "case log" voice**: `ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`. Use it **only** for eyebrows, indexes ("01"), console labels, domain chips, value tags in 07, vendor chips in 08 and the hub labels in 09. Never for body copy or headings.
- Scale contrast, the same as SIEM Cloud and SIEM NDR so the product pages feel like one family:
  - **H1:** `clamp(40px, 5.2vw, 74px)`, weight 700, line-height 1.02, letter-spacing −0.03em
  - **H2:** `clamp(30px, 4vw, 50px)`, weight 700, line-height 1.1, letter-spacing −0.02em, `text-wrap: balance`
  - **Eyebrow (mono):** 12.5px, weight 600, uppercase, letter-spacing 0.14em, preceded by the page's signature mark: **a stitch**, three 5px event dots on a 1px thread, the first two hollow rings in `--xd-event`, the last a filled `--xd-accent` dot (•—•—●, "events joined into one"). CSS-only (radial gradients plus one pseudo-element). It must not look like SIEM Cloud's three-into-one bars, NDR's packet trace, IR's status square or HawkINT's gradient line.
  - **Body:** `clamp(16px, 1.3vw, 18px)`, line-height 1.65, `text-wrap: pretty`
  - `font-variant-numeric: tabular-nums` on every mono index.

### 4.3 Backgrounds: atmosphere, not flat fills

No two neighbouring sections share a ground.

| # | Section | Ground |
|---|---|---|
| 01 | Hero | Copy side white; panel side dark `#070b18` → `#0d1330` with faint **vertical time gridlines** (1px, 5% white, 48px pitch), every fourth line slightly brighter (8%), like a timeline ruler |
| 02 | Challenge | Tint `#f6f8fc`, a very faint 1px hairline grid (3% ink) in the right half only, behind the scattered windows |
| 03 | Platform overview | Dark `#0d1330` with the time gridlines at 4%, and one soft blue glow where the threads merge |
| 04 | Capabilities | White |
| 05 | Detection | Dark `#070b18`, a soft blue glow (`rgba(12,104,255,.20)`) behind the core |
| 06 | Use cases | White, a very faint 1px hairline grid (3% ink) behind the detail panel only |
| 07 | Business impact | Tint `#f6f8fc` plus a soft top radial in blue at 6%; the console panel inside is dark |
| 08 | Integrations | Dark `#070b18` with the time gridlines at 4% |
| 09 | Why CybrHawk | Calm gradient `#f3f7ff` → `#ffffff`, ending on white |

All decoration sits in an `aria-hidden` layer with `pointer-events: none`. Any section whose decoration bleeds past its edges gets `overflow: clip`.

### 4.4 Motion: one orchestrated moment, one signature, then quiet

- **Page load (hero only):** the SIEM Cloud stagger. Eyebrow 0 ms, H1 lines 80 / 160 / 240 ms, subheadline 320 ms, buttons 400 ms, trust strip 480 ms, panel 300 ms. Fade up 16px over 0.7 s on `cubic-bezier(.22,1,.36,1)`. Keep `HERO_AMBIENT` (scan line + mouse drift) as SIEM NDR ships it.
- **Hero storyline loop:** see §6.1.
- **Section 02:** SIEM Cloud's settle: the windows ease into their slightly-off positions, staggered, and stay misaligned. The tool tabs settle with them.
- **Section 03 (signature):** on scroll-in, six thin threads draw in from the left (`scaleX`, staggered 40 ms apart), merge at node 2, and one blue line continues. Node 3 lights **amber** with one soft pulse; node 4 lights blue with a check. Each node lights as the line reaches it (`i × 0.25s`). Runs once. Vertical (`scaleY`) below 1100px.
- **Section 05:** HawkINT `.hawk-ai` motion: leads from each pill draw into the core on reveal, then the core's ring pulse loops gently and pauses off screen (`whileVisible`).
- **Section 06:** panel swap is a 200 ms opacity fade; the newly shown panel's storyline strip fills left to right once (chips fade in at `i × 90ms`, the thread draws behind them).
- **Everything else:** the standard reveal (`opacity 0 → 1`, `translateY(20px) → none`, staggered by an inline `--i`).
- **Micro-interactions:** buttons lift 2px; datasheet cells in 04 tint on hover with no lift. Nothing else moves on its own.
- **Animate only `transform` and `opacity`.** No scroll listeners. Under `prefers-reduced-motion: reduce`, show every final state at once: no loops, no draws, no settle, no strip fill, no hover translate, no smooth scroll, and the section 02 windows **aligned**.

### 4.5 Avoid

- Glowing shields, hexagon meshes, radar sweeps, neon "AI brains", node constellations, binary rain, padlocks, hooded hackers, purple gradients
- Vendor logos or brand colours for AWS, Microsoft, Okta, ServiceNow, Slack and so on. **Vendor names are text only.**
- **Fake telemetry:** no timestamps, IPs, hostnames, usernames, alert counts, risk scores as numbers, MTTD/MTTR figures or percentages. Every label in a decorative visual is a word already in the copy (see the CONTENT comments).
- Invented statistics, "x% faster" claims, customer logos, certifications, testimonials or "recommended" badges
- Two neighbouring sections with the same shape or the same ground

---

## 5. Design tokens: declare them once, on `.xd-section`

Starting values. **Verify every text pair** (4.5:1 for text, 3:1 for UI parts and graphics) and note each measured ratio in a comment, as siem-ndr.css does.

```css
/* Brand: the storyline thread, response, CybrHawk products and every CTA */
--xd-accent:          #0c68ff;
--xd-accent-hover:    #0a58d6;
--xd-accent-ink:      #0a58d6;   /* blue AS TEXT on light grounds */
--xd-accent-soft:     #eaf2ff;
--xd-accent-on-dark:  #6ea8ff;   /* blue AS TEXT on dark grounds */

/* Risk: "scored and prioritized", and nothing else */
--xd-risk:            #f2a516;   /* fills and rings */
--xd-risk-ink:        #9a5b00;   /* amber AS TEXT on white: verify ≥4.5:1 */
--xd-risk-on-dark:    #ffc24d;

/* Unjoined events */
--xd-event:           #8a96b3;   /* event dots and threads on light; decoration only */
--xd-event-on-dark:   rgba(160,176,214,.45);

/* Neutrals (same values as SIEM Cloud and SIEM NDR) */
--xd-heading:         #0d1330;
--xd-text:            #5b6478;
--xd-night:           #070b18;
--xd-night-2:         #0d1330;
--xd-on-dark:         #ffffff;
--xd-on-dark-body:    #c3cadb;
--xd-on-dark-muted:   #9aa3bd;   /* nothing dimmer than this for real copy on dark */
--xd-bg:              #ffffff;
--xd-bg-tint:         #f6f8fc;
--xd-border:          #e6eaf2;
--xd-border-dark:     rgba(255,255,255,.10);
--xd-rule:            #edf0f6;

/* Shape and space */
--xd-shadow:          0 1px 2px rgba(13,19,48,.04), 0 8px 24px rgba(13,19,48,.05);
--xd-shadow-hover:    0 2px 4px rgba(13,19,48,.05), 0 16px 38px rgba(13,19,48,.10);
--xd-radius:          16px;
--xd-radius-sm:       10px;
--xd-measure:         1320px;
--xd-gutter:          24px;      /* 22px ≤980px, 18px ≤520px */
--xd-pad-y:           clamp(56px, 7vw, 96px);
--xd-gap:             clamp(16px, 1.6vw, 24px);
--xd-mono:            ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;
```

Dark sections (03, 05, 08) get `.xd-section--dark`, which swaps headings to `--xd-on-dark`, body to `--xd-on-dark-body`, borders to `--xd-border-dark` and coloured text to the `*-on-dark` inks. Cards on dark are `rgba(255,255,255,.04)` with a `--xd-border-dark` border and no drop shadow.

---

## 6. Architecture and section specs

Each section has its **own empty Elementor container**: Full Width, padding 0, no background, with its class in CSS Classes. On build, the JS also adds `xd-section` (and `xd-section--dark` where relevant), so editors only ever type one class.

| # | Section | Container class | Root block | Ground |
|---|---|---|---|---|
| 01 | Hero | `xd-hero` | `.xd-hr` | white + dark panel |
| 02 | The challenge | `xd-challenge` | `.xd-ch` | tint |
| 03 | Platform overview | `xd-platform` | `.xd-pf` | dark |
| 04 | Key capabilities | `xd-capabilities` | `.xd-cp` | white |
| 05 | Detection deep dive | `xd-detection` | `.xd-dt` | dark |
| 06 | Use cases | `xd-usecases` | `.xd-uc` | white |
| 07 | Business impact | `xd-impact` | `.xd-im` | tint |
| 08 | Integrations | `xd-integrations` | `.xd-ig` | dark |
| 09 | Why CybrHawk | `xd-why` | `.xd-wy` | calm gradient |

Element classes take the form `xd-xx__name`, modifiers `xd-xx__name--mod`. Every `id` is prefixed `xd-`. Section 04's root carries **`id="xd-capabilities"`**, the target of the hero's "Tour All Features" button (`scroll-margin-top: 96px`, `tabindex="-1"`). Every CTA carries `data-xd-cta="<placement>"` (`hero-primary`, `hero-secondary`).

**Copy rules.** All copy comes from Appendix A. "Eyebrow" is the section label and "title" is the H2. **Don't invent copy.** The only allowed edits are listed in §10.

### 6.1 · 01 Hero (`.xd-hero` → `.xd-hr`) · port SIEM Cloud / NDR 01

- Port `buildHero` as is: light copy column lined up with the page edge, a dark panel on the right running to the screen edge and the hero's full height, the banner image shown whole when `CONTENT.hero.visual.image` is set, the coded console as fallback, `HERO_AMBIENT` scan line and mouse drift. Below 1025px the panel drops under the copy, edge to edge.
- The only `<h1>` on the page: three spans in one `<h1>`, separated by real spaces, each `display: block`: "One Platform." / "Every Signal." / "Faster Response." Line 3 is in `--xd-accent-ink`, because it is the resolution.
- Subheadline at 18–20px in `--xd-text`, max 36em. Primary "Request a Demo" and ghost "Tour All Features" (`#xd-capabilities`; not rendered if section 04's container is missing). Trust strip as a `<ul>` of four with a 16px check icon, wrapping row on desktop, 2×2 at ≤520px.
- **Fallback visual: the "storyline console"** (same frame and `data-step` mechanism as SIEM Cloud's convergence console, `aria-hidden`):
  - Chrome bar: three dots, mono label "CybrHawk SIEM XDR", status chip on the right.
  - Body: a short **timeline** on the panel's vertical gridlines. Four **event rows**, each a mono domain chip (`--xd-event-on-dark` border, on-dark-body text) and the event name in Figtree 14px, from `CONTENT.hero.visual.events`:
    - `IDENTITY` · "Unusual login"
    - `ENDPOINT` · "Credential dumping"
    - `NETWORK` · "Lateral movement"
    - `SERVER` · "Mass file changes"
  - Each row sits at a different horizontal offset (left → right = earlier → later), so the four events read as scattered points in time.
  - Under them an **incident card** in blue: "A single incident with a clear attack storyline", with a small amber pill on its right: "Highest risk".
  - Under the card a **playbook row**: a blue check node and "Playbook: Isolate hosts · Disable accounts".
  - **Loop** (JS steps `data-step` 0–3, CSS owns every change):
    - **0 · Separate alerts:** the four events pop in one by one at their offsets, each with its own grey dot. Chip reads `states.separate`.
    - **1 · Correlated:** a blue thread draws through the four dots in time order (one SVG path, `vector-effect: non-scaling-stroke`, `stroke-dashoffset` drawn via a `scaleX` mask so only `transform` animates), the dots turn blue, the incident card fades in, then the amber "Highest risk" pill. Chip reads `states.correlated` in blue.
    - **2 · Contained:** the playbook row fades in and its node shows a check. Chip reads `states.contained`.
    - **3 · Hold:** about 2.4 s, then everything fades and restarts. Steps 0–2 last about 1.8 s each.
  - Pause off screen or on a hidden tab (`whileVisible`). Under reduced motion, render the final state: thread drawn, card, pill and playbook shown, chip "Contained".
  - All labels are HTML at ≥12px, never SVG text. Stays inside its column from 320px up.

### 6.2 · 02 The challenge (`.xd-challenge` → `.xd-ch`) · port SIEM Cloud 02

- Port `buildChallenge` as is: split about 1fr / 1fr. **Left:** eyebrow, H2, paragraph 1 at 17–18px in `--xd-heading`, paragraph 2 at body size in `--xd-text`. **Right:** the four pain points as a `<ul>` of small **window cards** (chrome bar with a 7px dot and the title in mono uppercase, then the description at 15.5px), laid out 2×2 and deliberately out of alignment with inline `--dx`, `--dy`, `--rot`.
- **New on top of the port: a tool tab bar**, `aria-hidden`, sitting above the windows: five mono tabs "SIEM", "EDR", "Cloud", "Identity", "Ticketing" (the tools paragraph 1 lists), each a different width and each slightly offset vertically so the bar never lines up. It is the visual for "switching screens".
- Chrome dots are all `--xd-event` except **Alert overload**, whose dot is a cluster of three small dots (too many alerts). No amber here: nothing has been scored yet.
- **≤1024px:** one column: header, paragraphs, tab bar, windows. **≤600px:** windows in one column with **no rotation or offset**, and the tab bar wraps.
- Under reduced motion, windows and tabs are aligned and unrotated at every width.
- Icons: none. The chrome bars carry it.

### 6.3 · 03 Platform overview (`.xd-platform` → `.xd-pf`) · port SIEM Cloud 03, the signature section

- Dark ground. Header centred: eyebrow, H2, the paragraph as the sub-line (max 46em).
- Port `buildPlatform`: the four steps as an `<ol>` on a rail. **≥1100px: horizontal**, four columns, each with a 48px node (2px ring, mono number inside, IR `buildProcess` node style), the `<h3>` in white at 18px, the text in `--xd-on-dark-body` at 15px. **<1100px: vertical**, rail on the left.
- **The rail is the storyline:**
  - Between nodes 1 (Collect) and 2 (Normalize & Enrich): **six thin 1.5px threads** in `--xd-event-on-dark`, about 4px apart, a few of them with small event dots on them. One mono caption above the band, inside the `aria-hidden` rail: "Every log, event, and alert" (from the paragraph).
  - At node 2 they **merge** into one (one small inline SVG with `vector-effect: non-scaling-stroke`, as SIEM Cloud does with three).
  - From node 2 on, a **single blue line** (`--xd-accent-on-dark`), captioned "One data layer" (from the paragraph) between nodes 2 and 3.
  - Node colours: 1 neutral white ring; 2 blue ring; **3 amber ring** (`--xd-risk-on-dark`), the only amber object in the section; 4 blue ring with a check and a soft 25% blue glow as the end point.
- Reveal as §4.4. Don't put the steps in cards. The rail is the structure.

### 6.4 · 04 Key capabilities (`.xd-capabilities` → `.xd-cp`, `id="xd-capabilities"`) · HawkINT `.hawk-caps` via NDR `buildAnalyzes`

- Header aligned to the start: eyebrow, H2, and the intro as the sub-line (max 40em).
- Port the **datasheet** from `buildAnalyzes`: one white panel (16px radius, `--xd-shadow`, `overflow: hidden`) split into cells by 1px `--xd-border` hairlines, each cell led by a large **ghosted index numeral** ("01"–"09", 4% ink, top right), an icon + `<h3>` title on one row, then the body.
- **≥1025px:** 3×3. **640–1024px:** 2 columns, the ninth cell spans both. **<640px:** 1 column.
- Hover: the cell tints to `--xd-accent-soft` at 50%. No lift, no pointer.
- Cells are `<article id="xd-cap-{slug}">` inside `<li>`, for deep links.
- Icons: `sources` (HawkINT) for Universal Data Ingestion, `bot` for AI-Driven Threat Detection, `link` for Intelligent Correlation, `rank` (HawkINT) for Risk Scoring & Automated Triage, `shield-refresh` for Automated Response & Playbooks, `evidence` (HawkINT) for Incident Response & Forensics, `dark` (HawkINT) for Dark Web Monitoring, `file-check` for Compliance & Reporting, `dashboard` for Custom Rules & Dashboards. All blue; no amber on the Risk Scoring cell.

### 6.5 · 05 Detection deep dive (`.xd-detection` → `.xd-dt`) · port HawkINT `.hawk-ai`

- Dark ground. Port the **core diagram split**: **≥1100px** two columns at about 0.9fr / 1.1fr.
  - **Left:** eyebrow, H2, the paragraph, then the **living core** under them: two orbit rings, a ring pulse, a centre badge with the white CybrHawk logo (the same URL HawkINT's `coreHTML()` uses) and the mono label "CybrHawk SIEM XDR". Below the core, one small mono **output pill** in `--xd-risk-on-dark` text on a 12% amber fill: "Scored by risk" (from section 03 step 3). Core and pill are `aria-hidden`.
  - **Right:** the six detection layers as an `<ol>` of HawkINT's **connected pills**: icon, `<h3>` title, one line of text, each pill a `rgba(255,255,255,.04)` card with a `--xd-border-dark` border. A thin lead runs from each pill's left edge toward the core (one SVG in a stretched 0–100 viewBox, `preserveAspectRatio="none"`, `vector-effect: non-scaling-stroke`), so six layers visibly feed one core.
- **<1100px:** one column: header, core (centred, max 260px), then the pills; leads are dropped and a single vertical blue line runs down the left of the pill list instead.
- Icons: `clipboard` (Rule-Based Correlation), `user-eye` (UEBA), `pulse` (Machine-Learning Models), `radar` (Threat Intelligence Fusion), a new `matrix` (a 3×3 grid of small rounded squares, one filled) for MITRE ATT&CK Mapping, `search` (HawkINT) for Threat Hunting.

### 6.6 · 06 Use cases (`.xd-usecases` → `.xd-uc`) · HawkINT `.hawk-industries` via NDR `buildReporting`

- Header aligned to the start: eyebrow, H2.
- Port the **sector selector** from `buildReporting`: a vertical rail of the six use cases on the left is a real `tablist` (roles, `aria-selected`, `aria-controls`, roving `tabindex`, Arrow / Home / End keys); it drives one large detail panel (`tabpanel`) on the right with an icon, the `<h3>` title and the text. Use case 1 is selected on load. **Below 860px** it collapses to the accordion: each rail item becomes a native `<button aria-expanded>` header with its panel beneath.
- **New in each panel: a storyline strip**, `aria-hidden`, under the text. A 1px blue thread with the use case's **trail** as mono chips sitting on it, left to right, ending in an **end node**. Every chip word comes from that use case's own text (CONTENT `trail` and `end`):
  - `end.kind: "act"` → a blue check node with the label (a response)
  - `end.kind: "find"` → a blue ring node with the label (what the signals point to)
  - no `end` → the thread simply ends after the last chip
  - Chips wrap onto a second line on narrow panels; the thread follows as a left rule when wrapped (below 600px the strip becomes vertical).
- No amber in this section.
- Icons: `ransom` (HawkINT) for Ransomware, `identity` for Insider Threat, `mail-alert` (IR) for Phishing & BEC, `lateral` (NDR) for Lateral Movement, `cloud` for Cloud & SaaS, `file-check` for Compliance & Audit.

### 6.7 · 07 Business impact (`.xd-impact` → `.xd-im`) · port HawkINT `.hawk-about` outputs

- Tint ground. **≥1025px:** split about 0.85fr / 1.15fr. **Left:** eyebrow, H2, the intro paragraph (sticky at `top: 96px`).
- **Right: the console outputs readout**, a dark framed panel (`--xd-night-2`, 16px radius, `--xd-shadow-hover`). Chrome bar: three dots and the mono label "Outcomes" (from the H2). Inside, the six outcomes as an `<ol>` of HawkINT `hk-about__out` rows: a mono index "01"–"06", a mono **value tag** chip (from CONTENT `tag`: MTTD, MTTR, NOISE, COST, AUDIT, ANALYSTS), the `<h3>` title in white at 18px, then the text in `--xd-on-dark-body` at 15.5px. Rows split by `--xd-border-dark`; the rail and node glow from HawkINT on focus-within only.
- Rows reveal in a stagger. No numbers anywhere: the tags are labels, not metrics.
- **<1025px:** one column, header not sticky, panel full width.

### 6.8 · 08 Integrations (`.xd-integrations` → `.xd-ig`) · port SIEM Cloud 05 manifest

- Dark ground. Header centred: eyebrow, H2, the paragraph as the sub-line (max 46em).
- Port `buildCoverage`, re-skinned dark: seven groups as a `<ul>`, **two columns at ≥960px** (one below). Each row: a 3px `--xd-accent-on-dark` tab marker 28px tall, the `<h3>` group name in white at 18px, then **either** a wrapping `<ul>` of mono chips (`rgba(255,255,255,.05)` fill, `--xd-border-dark` border, 6px radius, 13px, `--xd-on-dark-body`) when the item has `chips`, **or** the sentence at 15.5px when it has `text`. Rows split by `--xd-border-dark`.
- The seventh group (Threat Intelligence) spans both columns as the closing row.
- **CybrHawk products are the only blue chips** (`ours: true` in CONTENT): "CybrHawk SIEM NDR", "CybrHawk SIEM Cloud", "HawkINT". Blue on-dark text, 12% blue fill, blue border. If the chip has an `href`, render it as a link (descriptive text is the chip itself); otherwise a plain chip.
- Above the groups, an `aria-hidden` **two-way strip**, centred: a mono label "Bring in data" with an arrow into a small "CybrHawk SIEM XDR" node, and an arrow out to "Push response actions back" (both phrases from the paragraph).
- No logos, no vendor colours.

### 6.9 · 09 Why CybrHawk (`.xd-why` → `.xd-wy`) · port HawkINT `.hawk-why`

- Calm gradient ground. No eyebrow (§10).
- Port the **reasons ledger**: **≥1025px** a left header panel, sticky at `top: 96px`, beside the five differentiators as an `<ol>` of numbered rows (mono index, 40px accent icon tile, `<h3>` claim, supporting line). White rows with `--xd-border` hairlines between them, one framed panel (16px radius, `--xd-shadow`). **<1025px:** one column, not sticky.
- **Left panel:** H2, the paragraph, then the **family hub** diagram, `aria-hidden`: "SIEM XDR" as a solid blue centre node, six smaller ringed nodes around it labelled "NDR", "Cloud", "ITDR", "OT Security", "HawkINT", "IR One" (from differentiator 5), each joined to the centre by a short spoke. Static. This closes the family story: the SIEM Cloud and NDR pages end with lines merging into "SIEM XDR"; here every line arrives. HTML labels positioned by percentage over one SVG, as SIEM Cloud's `whyDiagram` does. Max 340px wide; centred under the text below 1025px.
- Icons: `headset` (Fusion SOC Model), `bot` (AI at the Core), `users-table` (IR) for Built for MSSPs and Enterprises, `cloud` (Cloud-Native Scale), `layers` (Part of Unified Cyber Defense).
- The section **ends on white with its normal bottom padding**.

---

## 7. Accessibility (required)

Everything in SIEM Cloud prompt §7 applies. Additionally:

- **Headings:** one `h1` (hero); sections 02–09 each get one `h2` (eight in all); items get `h3`. Labels inside the hero console, the 02 tab bar, the 03 rail, the 05 core, the 06 storyline strips, the 08 two-way strip and the 09 hub are `aria-hidden` and don't count.
- **Lists:** trust strip, pain points, steps, capabilities, detection layers, use cases (as tabs: the tablist itself), outcomes, integration groups and their chips, differentiators are all `<ul>`/`<ol>`.
- **Section 06 tabs:** fully keyboard operable; focus stays on the tab, not the panel; the accordion headers are native `<button aria-expanded>`.
- **Amber** is decoration or sits next to text that names it. Check `--xd-risk-ink` on white and `--xd-risk-on-dark` on `#070b18`.
- `:focus-visible { outline: 3px solid rgba(12,104,255,.45); outline-offset: 3px; }`, and `rgba(110,168,255,.7)` on dark.

## 8. Robustness and performance

Everything in SIEM Cloud prompt §8 applies: no libraries, no CDNs, no scroll listeners, no fixed heights on text, **no horizontal scroll down to 320px** (the rotated windows in 02, the tab bar and the hero console's offset shadow included: `overflow: clip` on those roots), idempotent re-runs, one missing container or throwing builder skips only its section. Every loop (hero storyline, 05 core pulse) pauses off screen and on a hidden tab through `whileVisible`. If `xd-capabilities` is missing, "Tour All Features" isn't rendered.

## 9. `siem-xdr.html`: local preview harness

Copy `siem-ndr/siem-ndr.html` and adapt it: Figtree 400–700 from Google Fonts, `siem-xdr.css`, the fake 72px header, **nine** mock containers in §6 order (two with an inner `.e-con-inner`), a grey placeholder after Why CybrHawk labelled "Existing CTA component goes here (FAQ to be added later)", then `siem-xdr.js`. The top comment lists the Elementor steps: create the 9 containers; load the CSS and JS like the other pages; hide a duplicate page-title H1; place the CTA component after section 09 and paste Appendix B's CTA copy into it; paste Appendix C into the SEO plugin.

## 10. Don'ts

- **Don't change the copy.** The only allowed edits, already made in Appendix A:
  - splitting "Title: text" and "Title — text" into `title` and `text`
  - dropping the "Card 1 ·", "Use Case 1 ·", "Outcome 1 ·", "Differentiator 1 ·" prefixes in favour of generated numbers
  - splitting the integration lists into chips and dropping the joining "and"
  - wrapping existing words in `[[…]]` for the accent
  - dropping the eyebrow on 09, which would repeat the H2
  - decorative labels (console, tab bar, rail captions, core, value tags, storyline strips, two-way strip, hub), all taken from words already in the copy (see the CONTENT comments)

  The copy uses **US spelling** and a curly apostrophe in "analysts’". Keep both.
- Don't build the FAQ or the final CTA.
- Don't invent statistics, telemetry, customer names, logos, certifications or testimonials.
- Don't use amber for anything except "scored and prioritized"; don't use green; don't give domains their own colours.
- Don't use font weights above 700, an extra web font, `!important` without a comment, global selectors, or any change outside `siem-xdr/`.
- Don't put an unescaped CONTENT string into `innerHTML` or `insertAdjacentHTML`.

## 11. Acceptance checklist

Open `siem-xdr/siem-xdr.html` and confirm:

- [ ] Every section renders at **1440, 1280, 1024, 820, 768, 390 and 360px** with `document.documentElement.scrollWidth === window.innerWidth`.
- [ ] Each section visibly matches its source design in §2.2, re-skinned, and no two neighbours share a shape or a ground.
- [ ] The storyline reads top to bottom: scattered events stitched by a blue thread in the hero, misaligned consoles in 02, six threads merging into one in 03, six layers feeding one core in 05, short storylines ending in checks in 06, everything plugging into the hub in 09.
- [ ] Amber appears only in the three places §4.1 lists.
- [ ] The hero stagger plays once; the storyline loops, pauses off screen, and is static at "Contained" under reduced motion.
- [ ] "Tour All Features" lands on section 04 with its heading visible below the fake header.
- [ ] Section 06 works with the keyboard alone (arrows, Home, End) and as an accordion below 860px.
- [ ] Reduced motion: everything visible at once, nothing moves, the 02 windows are aligned.
- [ ] Deleting any one mock container still builds the other eight with no console errors; re-running the script adds no duplicates.
- [ ] Heading outline: one H1, eight H2s, H3s inside them.
- [ ] Every string matches Appendix A **character for character**.
- [ ] No vendor logos, no purple, no shield/hexagon/radar-sweep imagery, no fake numbers.

Leave a `// TODO:` in CONTENT for every open item marked in Appendix A.

---

## Appendix A: copy, verbatim, shaped for CONTENT

```js
var CONTENT = {

  hero: {
    eyebrow: "SIEM XDR · Fusion Analytic Threat Platform",
    // Three spans inside one <h1>; line 3 in the accent.
    title: ["One Platform.", "Every Signal.", "Faster Response."],
    sub: "CybrHawk SIEM XDR unifies security data from endpoints, servers, cloud, network, applications, and identities into a single, AI-driven detection and response platform. It helps your team see attacks earlier, investigate in context, and contain threats before they become business incidents.",
    cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
    ctaSecondary: { label: "Tour All Features", href: "#xd-capabilities" },
    trust: [
      "AI and machine-learning detection",
      "Mapped to MITRE ATT&CK",
      "Cloud-native and multi-tenant",
      "Backed by a 24/7 Fusion SOC"
    ],
    // The storyline console. Domains from the subheadline; events from
    // section 05 ("unusual logins", "lateral movement") and use case 1
    // ("credential dumping", "mass file changes"); the incident line from
    // capability 3; "Highest risk" from capability 4; the playbook from
    // section 03 step 4. State words are UI labels.
    visual: {
      label: "CybrHawk SIEM XDR",
      events: [
        { domain: "Identity", text: "Unusual login" },
        { domain: "Endpoint", text: "Credential dumping" },
        { domain: "Network",  text: "Lateral movement" },
        { domain: "Server",   text: "Mass file changes" }
      ],
      incident: "A single incident with a clear attack storyline",
      risk: "Highest risk",
      playbook: "Playbook: Isolate hosts · Disable accounts",
      states: { separate: "Separate alerts", correlated: "Correlated", contained: "Contained" },
      image: "",     // TODO: optional banner image URL (the console shows until one is set)
      imageAlt: ""
    }
  },

  challenge: {
    eyebrow: "The Challenge",
    title: "Too Many Tools. Too Many Alerts. [[Not Enough Context.]]",
    body: [
      "Most security teams run a stack of disconnected tools: a SIEM for logs, an EDR for endpoints, separate consoles for cloud and identity, and a ticketing system on top. Each produces its own alerts, in its own format, with its own blind spots. Analysts spend their time switching screens and stitching evidence together while real attacks move quietly from one system to the next.",
      "Legacy SIEMs made this worse. They collect everything, charge by the gigabyte, and still leave the hard work of correlation, triage, and response to people. The result is alert fatigue, longer dwell time, and a growing gap between what you can see and what you can act on."
    ],
    // Tool tab bar (aria-hidden), from paragraph 1.
    tools: ["SIEM", "EDR", "Cloud", "Identity", "Ticketing"],
    // dot: cluster | event. Offsets and rotation are per card (§6.2).
    items: [
      { dot: "cluster", title: "Alert overload",        text: "Thousands of low-fidelity alerts bury the few that matter." },
      { dot: "event",   title: "Fragmented visibility", text: "Endpoint, cloud, network, and identity data live in separate silos." },
      { dot: "event",   title: "Slow investigations",   text: "Analysts rebuild attack timelines by hand across multiple consoles." },
      { dot: "event",   title: "Rising costs",          text: "Ingest-based pricing punishes you for collecting the data you need." }
    ]
  },

  platform: {
    eyebrow: "Platform Overview",
    title: "SIEM and XDR, [[Fused Into One Platform]]",
    sub: "CybrHawk SIEM XDR combines the breadth of a modern SIEM with the speed and depth of extended detection and response. Every log, event, and alert is collected, normalized, enriched, and correlated in one data layer, so detections are built on full context rather than isolated signals. When a threat is confirmed, built-in automation and playbooks take action across your existing security stack.",
    // Rail captions (aria-hidden), from the paragraph.
    captions: { threads: "Every log, event, and alert", merged: "One data layer" },
    steps: [
      { title: "Collect",              text: "Ingest structured and unstructured data from endpoints, servers, firewalls, cloud, SaaS, identity providers, and applications through agents, APIs, and syslog." },
      { title: "Normalize & Enrich",   text: "Parse every event into a common schema and enrich it with asset context, user identity, geolocation, and HawkINT threat intelligence." },
      { title: "Detect & Prioritize",  text: "Correlation rules, behavioral analytics, and machine-learning models surface real threats and score them by risk, so analysts start with what matters most." },
      { title: "Respond & Report",     text: "Trigger automated playbooks, isolate hosts, disable accounts, open tickets, and generate audit-ready reports from the same console." }
    ]
  },

  capabilities: {
    eyebrow: "Key Capabilities",
    title: "Everything Your SOC Needs to [[Detect, Investigate, and Respond]]",
    sub: "Purpose-built capabilities that work together, not bolt-ons that compete for your analysts’ attention.",
    items: [
      { slug: "ingestion",   icon: "sources",        title: "Universal Data Ingestion",
        text: "Collect and normalize data from virtually any source, including firewalls, endpoints, servers, cloud platforms, SaaS apps, and custom applications, with out-of-the-box parsers and flexible APIs." },
      { slug: "ai",          icon: "bot",            title: "AI-Driven Threat Detection",
        text: "Behavioral analytics, UEBA, and machine-learning models identify anomalies, insider threats, and novel attacks that static signatures miss." },
      { slug: "correlation", icon: "link",           title: "Intelligent Correlation",
        text: "Link related events across users, hosts, and time into a single incident with a clear attack storyline, instead of hundreds of disconnected alerts." },
      { slug: "triage",      icon: "rank",           title: "Risk Scoring & Automated Triage",
        text: "Every incident is scored by severity, asset criticality, and threat intelligence, so your team works the highest-risk threats first." },
      { slug: "playbooks",   icon: "shield-refresh", title: "Automated Response & Playbooks",
        text: "Prebuilt and custom playbooks contain threats in seconds: isolate endpoints, block IPs, disable accounts, and notify stakeholders, with optional human approval." },
      { slug: "forensics",   icon: "evidence",       title: "Incident Response & Forensics",
        text: "Investigate with unified timelines, entity graphs, and raw-log pivoting, then preserve evidence for containment, recovery, and post-incident review." },
      { slug: "dark-web",    icon: "dark",           title: "Dark Web Monitoring",
        text: "Detect leaked credentials, exposed corporate data, and brand mentions on underground forums and marketplaces before attackers can use them." },
      { slug: "compliance",  icon: "file-check",     title: "Compliance & Reporting",
        text: "Generate customizable reports and dashboards aligned with NIST, HIPAA, GDPR, PCI DSS, and ISO 27001 requirements, with long-term log retention for audits." },
      { slug: "rules",       icon: "dashboard",      title: "Custom Rules & Dashboards",
        text: "Build your own detection rules, queries, and dashboards, or start from a library of prebuilt content mapped to MITRE ATT&CK." }
    ]
  },

  detection: {
    eyebrow: "Detection Deep Dive",
    title: "Layered Detection That [[Catches What Others Miss]]",
    sub: "No single technique catches every attack. CybrHawk SIEM XDR layers multiple detection methods, so a threat that slips past one layer is caught by another.",
    // Core label and output pill (aria-hidden). "Scored by risk" from section 03 step 3.
    core: { label: "CybrHawk SIEM XDR", output: "Scored by risk" },
    items: [
      { icon: "clipboard", title: "Rule-Based Correlation",
        text: "Real-time correlation rules detect known attack patterns, policy violations, and multi-stage kill chains." },
      { icon: "user-eye",  title: "User & Entity Behavior Analytics (UEBA)",
        text: "Dynamic baselines for every user and device flag unusual logins, privilege use, data access, and lateral movement." },
      { icon: "pulse",     title: "Machine-Learning Models",
        text: "Unsupervised and supervised models identify outliers, rare processes, beaconing, and data exfiltration." },
      { icon: "radar",     title: "Threat Intelligence Fusion",
        text: "HawkINT and curated external feeds enrich events with known-bad IPs, domains, hashes, and adversary TTPs." },
      { icon: "matrix",    title: "MITRE ATT&CK Mapping",
        text: "Every detection is mapped to tactics and techniques, so you can measure coverage and close gaps." },
      { icon: "search",    title: "Threat Hunting",
        text: "Search across all historical data with a fast query engine and saved hunts built on the latest adversary behavior." }
    ]
  },

  usecases: {
    eyebrow: "Use Cases",
    title: "Built for the Threats [[You Face Every Day]]",
    // trail + end drive the aria-hidden storyline strip; every word is from
    // that item's own text. end.kind: "act" = check node, "find" = ring node.
    items: [
      { icon: "ransom",     title: "Ransomware Detection & Containment",
        text: "Spot early indicators such as credential dumping, mass file changes, and shadow-copy deletion, then isolate affected hosts automatically before encryption spreads.",
        trail: ["Credential dumping", "Mass file changes", "Shadow-copy deletion"],
        end: { kind: "act", text: "Isolate affected hosts" } },
      { icon: "identity",   title: "Insider Threat & Account Compromise",
        text: "Detect impossible travel, abnormal access, privilege escalation, and unusual data downloads that point to a compromised or malicious insider.",
        trail: ["Impossible travel", "Abnormal access", "Privilege escalation", "Unusual data downloads"],
        end: { kind: "find", text: "Compromised or malicious insider" } },
      { icon: "mail-alert", title: "Phishing & Business Email Compromise",
        text: "Correlate email, identity, and endpoint signals to trace a phishing click through to credential theft and stop follow-on activity.",
        trail: ["Phishing click", "Credential theft"],
        end: { kind: "act", text: "Stop follow-on activity" } },
      { icon: "lateral",    title: "Lateral Movement & Privilege Abuse",
        text: "Identify attackers pivoting between systems using RDP, SMB, PowerShell, or stolen credentials, and cut off the path.",
        trail: ["RDP", "SMB", "PowerShell", "Stolen credentials"],
        end: { kind: "act", text: "Cut off the path" } },
      { icon: "cloud",      title: "Cloud & SaaS Threats",
        text: "Monitor AWS, Azure, GCP, Microsoft 365, and Google Workspace for risky configuration changes, token abuse, and suspicious API activity.",
        trail: ["Risky configuration changes", "Token abuse", "Suspicious API activity"],
        end: null },
      { icon: "file-check", title: "Compliance & Audit Readiness",
        text: "Centralize logs, enforce retention, and produce evidence for auditors on demand, without manual data pulls.",
        trail: ["Centralize logs", "Enforce retention"],
        end: { kind: "act", text: "Evidence for auditors on demand" } }
    ]
  },

  impact: {
    eyebrow: "Business Impact",
    title: "Security Outcomes [[Your Board Can Understand]]",
    sub: "CybrHawk SIEM XDR turns security operations from a cost center into a measurable business capability.",
    // Console chrome label from the H2; value tags are words from each outcome.
    console: "Outcomes",
    items: [
      { tag: "MTTD",     title: "Faster Detection",
        text: "Reduce mean time to detect (MTTD) by correlating every signal in real time instead of waiting for manual review." },
      { tag: "MTTR",     title: "Faster Response",
        text: "Lower mean time to respond (MTTR) with automated triage and playbooks that act in seconds, not hours." },
      { tag: "NOISE",    title: "Fewer False Positives",
        text: "Risk scoring and context-rich correlation cut alert noise, so analysts focus on genuine threats." },
      { tag: "COST",     title: "Lower Total Cost",
        text: "Consolidate point tools into one platform and avoid the runaway ingest costs of legacy SIEMs." },
      { tag: "AUDIT",    title: "Stronger Compliance Posture",
        text: "Continuous monitoring and ready-made reports simplify audits and demonstrate due diligence." },
      { tag: "ANALYSTS", title: "Higher Analyst Productivity",
        text: "One console, one data model, and guided investigations let lean teams do more with less." }
    ]
  },

  integrations: {
    eyebrow: "Integrations",
    title: "Works With the [[Security Stack You Already Own]]",
    sub: "CybrHawk SIEM XDR is vendor-agnostic. Out-of-the-box connectors and open APIs bring in data from your existing tools and push response actions back to them, so you protect your investments instead of replacing them.",
    // Two-way strip labels (aria-hidden), from the paragraph.
    flow: { in: "Bring in data", core: "CybrHawk SIEM XDR", out: "Push response actions back" },
    // Either chips (split from the copy's list, joining "and" dropped) or text (verbatim).
    // ours: true = a CybrHawk product, the only blue chips.
    items: [
      { title: "Endpoint & EDR",
        text: "Leading endpoint protection and EDR platforms" },
      { title: "Network & Firewalls",
        chips: ["Next-generation firewalls", "IDS/IPS", "proxies",
                { label: "CybrHawk SIEM NDR", ours: true, href: "https://cybrhawk.com/siem-ndr/" }] },
      { title: "Cloud Platforms",
        chips: ["AWS", "Microsoft Azure", "Google Cloud",
                { label: "CybrHawk SIEM Cloud", ours: true, href: "https://cybrhawk.com/siem-cloud/" }] },
      { title: "Identity",
        chips: ["Microsoft Entra ID (Azure AD)", "Okta", "Active Directory", "PAM solutions"] },
      { title: "Productivity & SaaS",
        chips: ["Microsoft 365", "Google Workspace", "business-critical SaaS apps"] },
      { title: "ITSM & Collaboration",
        chips: ["ServiceNow", "Jira", "Slack", "Microsoft Teams", "email"] },
      { title: "Threat Intelligence",
        // TODO: confirm the live HawkINT page URL, then set href.
        chips: [{ label: "HawkINT", ours: true, href: "" }, "STIX/TAXII feeds", "commercial intelligence sources"] }
    ]
  },

  why: {
    eyebrow: "",   // "Why CybrHawk" would repeat the H2
    title: "Why Security Leaders Choose [[CybrHawk SIEM XDR]]",
    sub: "A single breach can cause severe, lasting damage to revenue, reputation, and customer trust. CybrHawk is built to stop attacks before they reach that point by pairing advanced technology with expert human defenders.",
    // Family hub (aria-hidden), from differentiator 5.
    hub: { centre: "SIEM XDR", nodes: ["NDR", "Cloud", "ITDR", "OT Security", "HawkINT", "IR One"] },
    items: [
      { icon: "headset",     title: "Fusion SOC Model",
        text: "Detection, response, and proactive threat hunting operate as one team and one workflow, backed by CybrHawk security experts around the clock." },
      { icon: "bot",         title: "AI at the Core",
        text: "Artificial intelligence and machine learning power detection, prioritization, and decision support, not just dashboards." },
      { icon: "users-table", title: "Built for MSSPs and Enterprises",
        text: "Multi-tenant architecture, role-based access, and per-tenant reporting support managed service providers, large enterprises, and hybrid environments." },
      { icon: "cloud",       title: "Cloud-Native Scale",
        text: "Elastic, cloud-ready architecture scales with your data and your business, with flexible SaaS, hybrid, or on-premises deployment." },
      { icon: "layers",      title: "Part of Unified Cyber Defense",
        text: "SIEM XDR connects natively with CybrHawk NDR, Cloud, ITDR, OT Security, HawkINT, and IR One for complete, silo-free coverage." }
    ]
  }
};
```

## Appendix B: parked copy (not built here)

### B.1 FAQ (section 10, to be added later)

| Question | Answer |
|---|---|
| What is SIEM XDR? | SIEM XDR combines Security Information and Event Management (centralized log collection, correlation, and compliance reporting) with Extended Detection and Response (cross-domain threat detection and automated response). The result is one platform that both sees everything and acts on what it finds. |
| How is CybrHawk SIEM XDR different from a traditional SIEM? | Traditional SIEMs focus on collecting and storing logs, leaving analysis and response to analysts. CybrHawk adds AI-driven behavioral detection, automated triage and risk scoring, built-in response playbooks, and native threat intelligence, all in one console. |
| Can it work with our existing security tools? | Yes. CybrHawk SIEM XDR is vendor-agnostic, with prebuilt connectors and open APIs for leading endpoint, network, cloud, identity, and ITSM platforms. |
| What deployment options are available? | CybrHawk SIEM XDR is cloud-native and can be delivered as SaaS, in a hybrid model, or on-premises, depending on your data residency and regulatory requirements. |
| Does it support compliance reporting? | Yes. The platform includes customizable reports and dashboards aligned with NIST, HIPAA, GDPR, PCI DSS, ISO 27001, and other frameworks, plus configurable log retention for audit evidence. |
| Is it suitable for MSSPs? | Yes. Multi-tenant architecture, tenant-level data separation, role-based access control, and white-label-ready reporting make it well suited to managed security service providers. |
| Can CybrHawk manage the platform for us? | Yes. You can run SIEM XDR with your own team, or pair it with CybrHawk’s 24/7 SOC and managed detection and response services for full coverage. |

### B.2 Final CTA (section 11, for the existing CTA component)

| Field | Value |
|---|---|
| CTA heading | See Every Threat. Stop It Faster. |
| CTA body | Book a personalized demo to see how CybrHawk SIEM XDR unifies your security data, cuts alert noise, and automates response across your entire environment. |
| Primary button | Request a Demo → `https://cybrhawk.com/request-for-demo/` |
| Secondary button | Talk to a Security Expert → `https://cybrhawk.com/contact/` |
| Supporting line | Questions about pricing or deployment? Call 954-324-4750 or email sales@cybrhawk.com. (`tel:+19543244750`, `mailto:sales@cybrhawk.com`) |

## Appendix C: SEO fields (for the SEO plugin, not code)

| Field | Value |
|---|---|
| Meta title (≤60) | SIEM XDR Platform \| Unified Detection & Response \| CybrHawk |
| Meta description (≤160) | CybrHawk SIEM XDR unifies log management, AI-driven threat detection, and automated response across endpoint, cloud, network, and identity, in one console. |
| URL slug | `/siem-xdr/` |
| Primary keyword | SIEM XDR platform |
| Secondary keywords | extended detection and response, next-gen SIEM, AI threat detection, unified security operations, automated incident response, MSSP SIEM |
| Open Graph title | CybrHawk SIEM XDR: One Platform. Every Signal. Faster Response. |
