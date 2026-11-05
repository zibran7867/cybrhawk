# Build the CybrHawk SIEM NDR page: `siem-ndr/siem-ndr.{js,css,html}`

## 1. The job

Build the **SIEM NDR (Network Detection & Response)** page for `https://cybrhawk.com/siem-ndr/`. It covers sections 01–11 of the approved copy. That copy is in **Appendix A**, word for word, already shaped for the CONTENT block.

**Out of scope for now: section 12 (FAQ) and section 13 (final call to action).** Don't build them and don't leave placeholders for them in the JS or CSS. Their copy is parked in **Appendix B** so it isn't lost. Section 11 (Why CybrHawk) ends the page you build. It must end on a light ground with its normal bottom padding, so whatever comes next (the site's CTA component, or a FAQ added later) joins without a seam.

| File | Status | What goes in it |
|---|---|---|
| `siem-ndr/siem-ndr.js` | exists, empty | Builds all 11 sections, each into its own Elementor container |
| `siem-ndr/siem-ndr.css` | exists, empty | Every style for the page, scoped to those containers |
| `siem-ndr/siem-ndr.html` | **create** | Local preview harness (not deployed) plus the Elementor setup notes (§9) |

Don't edit anything outside `siem-ndr/`.

---

## 2. Reuse first: don't invent new section designs

**Every section on this page reuses a design that already ships on the HawkINT, Incident Response or SIEM Cloud page.** Port the markup shape, the CSS technique and the motion, then re-skin it with this page's tokens and copy. Only draw something new where §6 says so, and even then build it from an existing technique.

### 2.1 Read these before writing anything

The site runs on WordPress and Elementor. **The Elementor container markup is fixed, so we ship only JS and CSS.** The script finds an empty container by its CSS class, injects the section's markup, and the CSS styles that markup.

| Read | For |
|---|---|
| `siem-cloud/siem-cloud.js` + `.css` | **The reference build. Copy its architecture exactly:** file header comment, `SECTIONS` map, `DARK` map, the "Content (edit freely)" block, `ICONS` + `icon()`, `esc` / `nl2br` / `markup` / `pad`, `head()`, `button()`, `mount()`, `media()` with `iconFallback()`, `whileVisible()`, per-builder try/catch in `buildAll()`, `reveal()`, `init()` with the 10 s MutationObserver, the `HERO_AMBIENT` scan line + mouse drift, and the delegated spotlight handler in Use cases. It is the newest and most polished of the three files. |
| `siem-cloud/SIEM-CLOUD-PAGE-PROMPT.md` §3, §7, §8 | House conventions, accessibility and robustness rules. **They all apply here unchanged**, with `sc-` read as `nd-`. §3 below is a reminder, not a replacement. |
| `incident-response/incident-response.js` + `.css` | Section designs ported in §6: the **risk register** (03 · Why it matters) and the **platform stage** with connectors and travelling signals (07 · Platform) |
| `HawkINT/hawk-int.js` + `.css` | Section designs ported in §6: the **vertical process spine** (`.hawk-how`), the **capability datasheet** (`.hawk-caps`), the **console feature panel** (`.hawk-features`), the **patch-bay** (`.hawk-integrations`) and the **sector selector** tablist (`.hawk-industries`). **Borrow the designs, not the file structure:** HawkINT is one IIFE per section; this page is one IIFE with builders, like siem-cloud.js. |
| `udc/udc.js` | Extra glyphs (`lock`, `plug`, `alerts`, `hourglass`) |

`enterprise-operations-intelligence/seconn-section/` is the exception: static HTML and ES6. **Don't copy its style.**

### 2.2 Section → source map

| # | NDR section | Reuse this design | Source | What changes |
|---|---|---|---|---|
| 01 | Hero | Light copy split + edge-to-edge dark panel, image with coded-console fallback, ambient scan line + mouse drift | SIEM Cloud 01 · `buildHero` | Console becomes the **trace console** (§6.1) |
| 02 | The challenge | Split layout (copy left, visual right) | SIEM Cloud 02 · `buildChallenge` | Right column is IR's **risk register** card instead of the scattered consoles, plus a one-line "in between" strip (§6.2) |
| 03 | Measurable outcomes | Pinned header + graphic left, numbered outcome rows right | SIEM Cloud 07 · `buildImpact` | Four rows; the graphic is a **days → minutes** bar pair (§6.3) |
| 04 | Detection engine | Vertical numbered spine | HawkINT · `.hawk-how` | **Signature section.** Five layers filter traffic down to one incident (§6.4) |
| 05 | What NDR analyzes | Hairline capability datasheet, ghosted index numerals | HawkINT · `.hawk-caps` | Six cells, 3×2 (§6.5) |
| 06 | Response & orchestration | Platform stage: connectors in a stretched 0–100 viewBox, travelling signals | IR 07 · `buildPlatform` | **Mirrored:** one core on the left fans out to four numbered targets (§6.6) |
| 07 | Use cases | Detection cards: icon tile, mono tag, top line, pointer spotlight, legend beside H2 | SIEM Cloud 06 · `buildUsecases` | Light ground; tags are traffic **direction** with an arrow glyph (§6.7) |
| 08 | Deployment options | Framed console panel with feature rows | HawkINT · `.hawk-features` | Light frame, four rows, inline rollout chips on row 3 (§6.8) |
| 09 | Integrations | Patch-bay: signal bus + port cards with jacks | HawkINT · `.hawk-integrations` | Four ports, vendor names as text chips (§6.9) |
| 10 | Reporting & KPIs | Sector selector: tablist rail + detail panel, accordion on mobile | HawkINT · `.hawk-industries` | Panel shows a CSS-only report wireframe (§6.10) |
| 11 | Why CybrHawk | Bento with dark anchor card + labelled merge diagram | SIEM Cloud 08 · `buildWhy` | Four lines (network, endpoint, cloud, identity) merge into "SIEM XDR" (§6.11) |

Each section's layout differs from the one above it. If a port would put two similar shapes next to each other, change the port, not the order.

---

## 3. House conventions (summary; the files above are the authority)

- **JS:** one IIFE, `"use strict"`, **ES5 only**: `var`, `function` and string concatenation. No arrow functions, template literals, `let`/`const`, classes or modules. Open the file with a comment block, then `SECTIONS`, then `DARK`, then a **"Content (edit freely)"** block holding every visible string, URL and toggle. Every CONTENT string goes through `esc()` (or `markup()`/`nl2br()`) before it reaches HTML. Builders are idempotent. A missing container or a throwing builder skips only that section.
- **CSS:** scope every rule under a section container class. No bare element selectors, no global rules. Declare tokens once on `.nd-section`. Use `box-sizing: border-box` and `font-family: inherit`. Gutter is 24px, 22px at ≤980px and 18px at ≤520px. Reset `.e-con-inner` padding and max-width inside ND containers, as siem-cloud.css does. No `!important` without a comment saying why.
- **Figtree loads only up to weight 700.** Never use 800 or 900, because they fall back to Helvetica.
- **Icons:** inline SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and joins, `aria-hidden="true"`. Copy existing glyphs by name from the source files before drawing new ones.
- Comments explain *why*. Match the comment density of siem-cloud.js.

---

## 4. Design direction: "the wire doesn't lie"

The copy's thesis is one sentence: *"Network traffic is the one data source attackers cannot delete, disable, or evade. Every connection leaves a trace."* So the page's visual language is the **trace**: a thin horizontal wire carrying short packet ticks, read like a protocol analyzer or an oscilloscope. Most ticks are quiet blue-grey. A few turn coral: those are detections. Further down the page the wire splits into response paths that end in blue checks.

Generic NDR pages all look the same: a glowing node constellation, a spinning globe with arcs, binary rain, a padlock. Avoid that "AI slop" look. This page should feel like a precise engineering instrument: hairlines, mono labels, ticks and gates.

| Stage | Sections | What the reader sees |
|---|---|---|
| Hidden | 01 Hero, 02 Challenge | A busy wire; threats hide in the space between perimeter and endpoint |
| Exposed | 03 Outcomes, 04 Engine, 05 Analyzes | Five filters strip the noise until one coral incident is left |
| Contained | 06 Response, 07 Use cases | The incident fans out to controls; paths end in blue checks |
| Operated | 08–11 | Calm, light, settled: deploy, connect, report, trust |

### 4.1 Colour: one dominant blue, one sharp signal

- **Site blue `#0c68ff` is dominant.** It stands for the network itself, containment and every CTA.
- **Signal coral is the single accent, with strict meaning: "a detection in the traffic".** Use it only where a threat is being shown: the hero trace, the "in between" tick in 02, the final node of the 04 spine, the core's incoming pulse in 06, and the eyebrow mark's last tick. **Never** use it for buttons, hovers, tags, icons or generic emphasis.
- Quiet traffic is a desaturated blue-grey (`--nd-wire`). Containment is blue with a check glyph, never green, so this page doesn't read as the IR page.
- Colour is never the only signal: every coral element sits next to a written label or lives inside an `aria-hidden` layer.
- No purple, and no blue-to-purple gradients anywhere.

### 4.2 Typography

- **Figtree** (400–700) for everything a reader reads. Don't load another web font.
- The second voice is the **monospace "analyzer" voice**: `ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`. Use it **only** for eyebrows, indexes ("01", "Layer 01"), console and port labels, direction tags, vendor chips and the wireframe labels in 10. Never for body copy or headings.
- Scale contrast, the same as SIEM Cloud so the product pages feel like one family:
  - **H1:** `clamp(40px, 5.2vw, 74px)`, weight 700, line-height 1.02, letter-spacing −0.03em
  - **H2:** `clamp(30px, 4vw, 50px)`, weight 700, line-height 1.1, letter-spacing −0.02em, `text-wrap: balance`
  - **Eyebrow (mono):** 12.5px, weight 600, uppercase, letter-spacing 0.14em, preceded by the page's signature mark: **a packet trace**, four 5px dashes on a 1px wire, the first three in `--nd-wire`, the last in `--nd-signal`. CSS-only (a `repeating-linear-gradient` plus one pseudo-element). It must not look like SIEM Cloud's three-into-one bars, IR's status square or HawkINT's gradient line.
  - **Body:** `clamp(16px, 1.3vw, 18px)`, line-height 1.65, `text-wrap: pretty`
  - `font-variant-numeric: tabular-nums` on every mono index.

### 4.3 Backgrounds: atmosphere, not flat fills

No two neighbouring sections share a ground.

| # | Section | Ground |
|---|---|---|
| 01 | Hero | Copy side white; panel side dark `#070b18` → `#0d1330` with faint horizontal **wire lines** (1px, 5% white, 36px pitch), each carrying a dashed tick pattern at 4% |
| 02 | Challenge | Tint `#f6f8fc`, with one 1px dashed wire running edge to edge behind the register card |
| 03 | Outcomes | White |
| 04 | Detection engine | Dark `#070b18`, a soft blue glow behind the top of the spine and a small coral glow (≤12%) at its end |
| 05 | Analyzes | White |
| 06 | Response | Dark `#0d1330` with the wire lines at 4% |
| 07 | Use cases | Tint `#f6f8fc` plus a soft top radial in blue at 6% |
| 08 | Deployment | White |
| 09 | Integrations | Dark `#070b18`, the signal bus glow along the top |
| 10 | Reporting | White, a very faint 1px hairline grid (3% ink) behind the detail panel only |
| 11 | Why CybrHawk | Calm gradient `#f3f7ff` → `#ffffff`, ending on white |

All decoration sits in an `aria-hidden` layer with `pointer-events: none`. Any section whose decoration bleeds past its edges gets `overflow: clip`.

### 4.4 Motion: one orchestrated moment, one signature, then quiet

- **Page load (hero only):** the SIEM Cloud stagger. Eyebrow 0 ms, H1 lines 80 / 160 ms, subheadline 240 ms, buttons 320 ms, trust strip 400 ms, panel 300 ms. Fade up 16px over 0.7 s on `cubic-bezier(.22,1,.36,1)`. Keep `HERO_AMBIENT` (scan line + mouse drift) as SIEM Cloud ships it.
- **Hero trace loop:** see §6.1.
- **Section 04 (signature):** on scroll-in the spine draws down (`scaleY`), each layer node lights at `i × 0.25s`, and packet ticks travel down the spine, thinning after each layer, until a single coral tick reaches the end node. The draw runs once; the ticks loop gently and pause off screen.
- **Section 06:** the IR stage motion: blue signals travel from the core to each target, pausing off screen.
- **Section 09:** each port's jack lights in turn on reveal, then holds.
- **Everything else:** the standard reveal (`opacity 0 → 1`, `translateY(20px) → none`, staggered by an inline `--i`).
- **Micro-interactions:** buttons lift 2px; the 07 spotlight; datasheet cells in 05 tint on hover with no lift. Nothing else moves on its own.
- **Animate only `transform` and `opacity`.** No scroll listeners. Under `prefers-reduced-motion: reduce`, show every final state at once: no loops, no draws, no travelling ticks, no spotlight, no hover translate, no smooth scroll.

### 4.5 Avoid

- Node-and-line "network constellations", glowing globes with arcs, binary or matrix rain, padlocks, hooded hackers, purple gradients
- Vendor logos or brand colours for Palo Alto Networks, Fortinet, Cisco, AWS and so on. **Vendor names are text only.**
- **Fake telemetry:** no IP addresses, ports, hostnames, packet counts, timestamps, ASNs or throughput numbers. Every label in a decorative visual is a word already in the copy (see the CONTENT comments).
- Invented statistics, "x% faster" claims, customer logos, certifications, testimonials or "recommended" badges
- Two neighbouring sections with the same shape or the same ground

---

## 5. Design tokens: declare them once, on `.nd-section`

Starting values. **Verify every text pair** (4.5:1 for text, 3:1 for UI parts and graphics) and note each measured ratio in a comment, as siem-cloud.css does.

```css
/* Brand: the network, containment and every CTA */
--nd-accent:          #0c68ff;
--nd-accent-hover:    #0a58d6;
--nd-accent-ink:      #0a58d6;   /* blue AS TEXT on light grounds */
--nd-accent-soft:     #eaf2ff;
--nd-accent-on-dark:  #6ea8ff;   /* blue AS TEXT on dark grounds */

/* Signal: a detection in the traffic, and nothing else */
--nd-signal:          #e5482f;   /* fills and ticks */
--nd-signal-ink:      #c1351d;   /* coral AS TEXT on white: verify ≥4.5:1 */
--nd-signal-on-dark:  #ff8a70;

/* Quiet traffic */
--nd-wire:            #8a96b3;   /* ticks on light; decoration only */
--nd-wire-on-dark:    rgba(160,176,214,.45);

/* Neutrals (same values as SIEM Cloud) */
--nd-heading:         #0d1330;
--nd-text:            #5b6478;
--nd-night:           #070b18;
--nd-night-2:         #0d1330;
--nd-on-dark:         #ffffff;
--nd-on-dark-body:    #c3cadb;
--nd-on-dark-muted:   #9aa3bd;   /* nothing dimmer than this for real copy on dark */
--nd-bg:              #ffffff;
--nd-bg-tint:         #f6f8fc;
--nd-border:          #e6eaf2;
--nd-border-dark:     rgba(255,255,255,.10);
--nd-rule:            #edf0f6;

/* Shape and space */
--nd-shadow:          0 1px 2px rgba(13,19,48,.04), 0 8px 24px rgba(13,19,48,.05);
--nd-shadow-hover:    0 2px 4px rgba(13,19,48,.05), 0 16px 38px rgba(13,19,48,.10);
--nd-radius:          16px;
--nd-radius-sm:       10px;
--nd-measure:         1320px;
--nd-gutter:          24px;      /* 22px ≤980px, 18px ≤520px */
--nd-pad-y:           clamp(56px, 7vw, 96px);
--nd-gap:             clamp(16px, 1.6vw, 24px);
--nd-mono:            ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;
```

Dark sections (04, 06, 09) get `.nd-section--dark`, which swaps headings to `--nd-on-dark`, body to `--nd-on-dark-body`, borders to `--nd-border-dark` and coloured text to the `*-on-dark` inks. Cards on dark are `rgba(255,255,255,.04)` with a `--nd-border-dark` border and no drop shadow.

---

## 6. Architecture and section specs

Each section has its **own empty Elementor container**: Full Width, padding 0, no background, with its class in CSS Classes. On build, the JS also adds `nd-section` (and `nd-section--dark` where relevant), so editors only ever type one class.

| # | Section | Container class | Root block | Ground |
|---|---|---|---|---|
| 01 | Hero | `nd-hero` | `.nd-hr` | white + dark panel |
| 02 | The challenge | `nd-challenge` | `.nd-ch` | tint |
| 03 | Measurable outcomes | `nd-outcomes` | `.nd-oc` | white |
| 04 | Detection engine | `nd-engine` | `.nd-en` | dark |
| 05 | What NDR analyzes | `nd-analyzes` | `.nd-an` | white |
| 06 | Response & orchestration | `nd-response` | `.nd-rs` | dark |
| 07 | Use cases | `nd-usecases` | `.nd-uc` | tint |
| 08 | Deployment options | `nd-deploy` | `.nd-dp` | white |
| 09 | Integrations | `nd-integrations` | `.nd-ig` | dark |
| 10 | Reporting & KPIs | `nd-reporting` | `.nd-rp` | white |
| 11 | Why CybrHawk | `nd-why` | `.nd-wy` | calm gradient |

Element classes take the form `nd-xx__name`, modifiers `nd-xx__name--mod`. Every `id` is prefixed `nd-`. Section 04's root carries **`id="nd-engine"`**, the target of the hero's "Tour All Features" button (`scroll-margin-top: 96px`, `tabindex="-1"`). Every CTA carries `data-nd-cta="<placement>"` (`hero-primary`, `hero-secondary`).

**Copy rules.** All copy comes from Appendix A. "Eyebrow" is the section label and "title" is the H2. **Don't invent copy.** The only allowed edits are listed in §10.

### 6.1 · 01 Hero (`.nd-hero` → `.nd-hr`) · port SIEM Cloud 01

- Port `buildHero` as is: light copy column lined up with the page edge, a dark panel on the right running to the screen edge and the hero's full height, the banner image shown whole when `CONTENT.hero.visual.image` is set, the coded console as fallback, `HERO_AMBIENT` scan line and mouse drift. Below 1025px the panel drops under the copy, edge to edge.
- The only `<h1>` on the page: two spans in one `<h1>`, separated by a real space, each `display: block`: "When Prevention Fails," / "the Network Tells the Truth." Line 2 is in `--nd-accent-ink`.
- Subheadline at 18–20px in `--nd-text`, max 36em. Primary "Request a Demo" and ghost "Tour All Features" (`#nd-engine`; not rendered if section 04's container is missing). Trust strip as a `<ul>` of four with a 16px check icon, wrapping row on desktop, 2×2 at ≤520px.
- **Fallback visual: the "trace console"** (replaces the convergence console, same frame, same `data-step` mechanism, `aria-hidden`):
  - Chrome bar: three dots, mono label "CybrHawk SIEM NDR", status chip on the right.
  - Two **wire rows**, each with a mono label: "East-West" and "North-South". Each row is a 1px wire with short ticks in `--nd-wire-on-dark` drifting left to right (one CSS `transform` loop per row, a repeating gradient strip twice the row width).
  - Three **detection markers** that pin onto the wires as the loop steps: "Lateral movement" on East-West, then "Command-and-control" and "Data exfiltration" on North-South. Each is a coral tick plus a small label pill (coral-on-dark text on a 12% coral fill).
  - A **containment row** at the foot: a blue check node and the text "Automated containment in minutes".
  - **Loop** (JS steps `data-step` 0–3, CSS owns every change): 0 · quiet traffic, chip "Observing"; 1 · lateral movement marker, chip "Detected" in coral; 2 · the two North-South markers; 3 · the ticks freeze, the markers turn to blue outlined pills, the containment row lights, chip "Contained" in blue. Hold ~2.4 s, fade, restart; steps 0–2 about 1.8 s each.
  - Pause off screen or on a hidden tab (`whileVisible`). Under reduced motion, render the final state: markers shown, ticks still, chip "Contained".
  - All labels are HTML at ≥12px, never SVG text. Stays inside its column from 320px up.

### 6.2 · 02 The challenge (`.nd-challenge` → `.nd-ch`) · SIEM Cloud 02 layout + IR 03 register

- **Desktop:** split about 1fr / 1fr. **Left:** eyebrow, H2, paragraph 1 at 17–18px in `--nd-heading`. Paragraph 2 ("Network traffic is the one data source…") is the page's thesis, so set it as a **pull line**: 3px `--nd-accent` left rule, 19–20px weight 600 in `--nd-heading`. It stays a `<p>`, not a `<blockquote>`.
- **Right:** IR's **risk register**: one white card (radius 16px, `--nd-shadow`) of four rows split by `--nd-rule`, each row a 40px icon badge, a bold title and the text. Drop IR's small h3 header (there is no copy for it); the rows are `<li>` with `<h3>` titles.
- On top of the card, inside it, an `aria-hidden` **"in between" strip**: a 1px wire from a mono label "Perimeter" on the left to "Endpoint" on the right, quiet ticks along it and one coral tick in the middle under the mono label "In between". All three words come from paragraph 1.
- **≤1024px:** one column: header, paragraphs, card.
- Icons: `network` (East-west blind spots), `chip` (Unmanaged assets), `lock` (Encrypted threats), `timer` (Slow containment).

### 6.3 · 03 Measurable outcomes (`.nd-outcomes` → `.nd-oc`) · port SIEM Cloud 07

- Port `buildImpact`: on desktop the header and a small graphic stay pinned on the left while the outcome rows scroll past on the right, each with a numbered tile. Four rows instead of six.
- **Replace the scatter graphic** (section 04 owns the "many into one" idea) with a **days → minutes** pair for outcome 1, `aria-hidden`: two horizontal bars on one baseline, a long faded `--nd-wire` bar labelled "Days" and a short solid `--nd-accent` bar ending in a check node labelled "Minutes". Both words come from outcome 1. No numbers, no axis.
- Under 1025px the pin is released and the graphic sits under the header, max 420px wide.

### 6.4 · 04 Detection engine (`.nd-engine` → `.nd-en`, `id="nd-engine"`) · HawkINT `.hawk-how` spine, the signature section

- Dark ground. **≥1100px:** two columns at about 0.85fr / 1.15fr. Left, sticky: eyebrow, H2, the paragraph. Right: the five layers as an `<ol>` on HawkINT's vertical spine.
- Each step: a 48px node (2px ring, mono "01"–"05" inside), a mono "Layer 01" label, the `<h3>` title in white at 18–20px, the text in `--nd-on-dark-body` at 15.5px.
- **The spine is the filter.** It starts at a mono cap label "Traffic" above node 1 and ends below node 5 in a coral node labelled "Single incident" (both words from the paragraph; the labels are in the `aria-hidden` rail). Packet ticks travel down the spine: dense above layer 1, fewer after each node, and one coral tick reaches the end node. Draw the ticks as small absolutely positioned spans animated with `transform`, five density groups, no canvas.
- Nodes 1–5 are blue rings and light at `i × 0.25s` as the spine draws. The end node is the only coral object in the section.
- **<1100px:** one column, header on top (not sticky), same spine.
- Don't put the layers in cards. The spine is the structure.

### 6.5 · 05 What NDR analyzes (`.nd-analyzes` → `.nd-an`) · port HawkINT `.hawk-caps`

- Header aligned to the start: eyebrow and H2.
- Port the **datasheet**: one white panel (16px radius, `--nd-shadow`, `overflow: hidden`) split into cells by 1px `--nd-border` hairlines, each cell led by a large **ghosted index numeral** ("01"–"06", 4% ink, top right), an icon + `<h3>` title on one row, then the body. Drop HawkINT's mono micro-label (no copy for it).
- **≥1025px:** 3×2. **640–1024px:** 2 columns. **<640px:** 1 column.
- Hover: the cell tints to `--nd-accent-soft` at 50%. No lift, no pointer.
- Cells are `<article id="nd-src-{slug}">` inside `<li>`, for deep links.
- Icons: `pulse` (Flow & Packet Metadata), `chip` (IoT, OT & Shadow IT), `globe` (DNS & Web Traffic), `cloud` (Cloud Traffic), `lock` (Encrypted Traffic), and a new `axes` (a horizontal and a vertical double-headed arrow crossing) for East-West & North-South.

### 6.6 · 06 Response & orchestration (`.nd-response` → `.nd-rs`) · port IR 07 platform stage, mirrored

- Dark ground. Header centred: eyebrow, H2, the paragraph as the sub-line (max 46em).
- Port `platformStage`, **mirrored**: the **core** on the left, a ringed node with the mono label "CybrHawk SIEM NDR", a small coral pulse arriving at it from the left edge (the detection), and under it a mono pill "Approvals · Guardrails" (both words from the paragraph). Four **targets** on the right as an `<ol>` in equal grid rows, so IR's `(i + .5) / n` connector math works unchanged. Each target: mono number "01"–"04", `<h3>` title, text in `--nd-on-dark-body`.
- Connectors use IR's technique exactly: a 0–100 viewBox stretched over the gap with `preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke`; travelling **blue** signals as zero-length round-capped strokes moving core → target. Each target's number gets a small blue check when its signal first arrives.
- **<1025px:** the core sits on top, the targets stack below on a single vertical blue line with a branch to each (IR's stacked layout).
- Icons on targets: none. The numbers and the wires carry it.

### 6.7 · 07 Use cases (`.nd-usecases` → `.nd-uc`) · port SIEM Cloud 06

- Port `buildUsecases`: icon tile, mono tag top right (after the title in the DOM), title, text, a 2px top line, the delegated pointer spotlight, and the legend beside the H2.
- **Light ground:** white cards, 1px `--nd-border`, `--nd-shadow`, spotlight in blue at about 8%.
- **The tag is the traffic direction**, from CONTENT `dir`: "East-West" or "North-South", each with a small arrow glyph (↔ drawn horizontal, ↕ vertical) so shape, not colour, tells them apart. Both tags and top lines are blue; coral never appears here. The legend lists the two directions once.
- Six cards: three columns at ≥1025px, two at ≥640px, one below. Not links: no lift.
- Icons: a new `beacon` (a dot with two arcs) for C2 & Beaconing, `database-leak` (Data Exfiltration), a new `lateral` (two nodes with a sideways arrow) for Lateral Movement, `factory` (IoT & OT Security), `cloud` (Cloud Egress Control), `shield` (Zero Trust Validation).

### 6.8 · 08 Deployment options (`.nd-deploy` → `.nd-dp`) · port HawkINT `.hawk-features`

- Header aligned to the start: eyebrow, H2.
- Port the **console panel**, re-skinned light: one framed panel (white body, 16px radius, `--nd-shadow`), a `--nd-night-2` chrome bar with three dots and the mono label "Deploy" (from the H2). Inside, the four options as `<ol>` **rows** split by hairlines: mono index, 40px icon badge, `<h3>` title and text on one line at ≥900px, stacked below.
- Row 3 (Lightweight Rollout) adds an `aria-hidden` **rollout strip** under its text: three mono chips joined by short wires, "Flow telemetry" → "Packet metadata" → "Selective PCAP", filling from left to right on reveal. All three come from the row's own text.
- Icons: `network` (Virtual & Physical Sensors), `cloud` (Cloud Sensors), `layers` (Lightweight Rollout), `fingerprint` (Privacy-Preserving Analytics).

### 6.9 · 09 Integrations (`.nd-integrations` → `.nd-ig`) · port HawkINT `.hawk-integrations`

- Dark ground. Header centred: eyebrow, H2.
- Port the **patch-bay**: a thin signal bus along the top labelled "CybrHawk SIEM NDR", dropping a lead into each of four **port cards**. Each card: a mono port label ("Port 01"–"Port 04"), a jack that lights blue when wired, the `<h3>` group name, then the vendors as a `<ul>` of mono **text chips**, then the CONTENT `tail` as a short muted line ("and more", "flow logs and traffic mirroring"). "CybrHawk SIEM XDR" is the one chip in blue, because it is ours.
- **≥1025px:** four columns. **640–1024px:** 2×2. **<640px:** one column, bus becomes a vertical line on the left.
- No logos, no vendor colours.

### 6.10 · 10 Reporting & KPIs (`.nd-reporting` → `.nd-rp`) · port HawkINT `.hawk-industries`

- Header aligned to the start: eyebrow, H2.
- Port the **sector selector**: a vertical rail of the four reports on the left is a real `tablist` (roles, `aria-selected`, `aria-controls`, roving `tabindex`, Arrow / Home / End keys); it drives one large detail panel (`tabpanel`) on the right with an icon, the `<h3>` title and the text. Report 1 is selected on load. **Below 860px** it collapses to HawkINT's accordion: each rail item becomes a header with its panel beneath.
- Under the text, each panel shows an `aria-hidden` **report wireframe** drawn in CSS only, bars and blocks in `--nd-border` and `--nd-accent-soft`, **no numbers**, labelled only with phrases from that report's text:
  - Executive Dashboards: a 2×2 tile grid labelled "Top talkers", "Risky destinations", "Blocked versus allowed traffic", "Critical incidents"
  - Incident Workbench: a horizontal timeline of blocks plus a mini "ATT&CK mapping" chip row
  - Compliance Scorecards: three labelled progress rows "Segmentation drift", "Log coverage", "Retention evidence"
  - Operational KPIs: four small ring gauges, arcs only, labelled "MTTD", "Exfiltration detection time", "Segment coverage", "False-positive rate"
- Panel swap is a 200ms opacity fade; instant under reduced motion.
- Icons: `dashboard`, `clipboard`, `file-check`, `timer`.

### 6.11 · 11 Why CybrHawk (`.nd-why` → `.nd-wy`) · port SIEM Cloud 08

- Calm gradient ground. Header centred, no eyebrow (§10).
- Port the **bento** exactly: `1.2fr 1fr 1fr`, areas `"a b c" "a d e"` at ≥1100px; two columns with `a` spanning at 700–1099px; one column below.
- **a · Native SIEM Integration** is the dark anchor. Its `aria-hidden` diagram (SIEM Cloud's `whyDiagram`, 300×150 viewBox, HTML labels by percentage) carries **four** lines labelled "Network", "Endpoint", "Cloud", "Identity" (words from the card's text) merging into one blue line that ends in a node marked "SIEM XDR". The Network line is solid blue (it is this product); the other three are `--nd-wire-on-dark`. Static.
- **b–e:** white cards, 40px icon badge, `<h3>`, text. Icons: `layers` (IT, Cloud, and OT in One View), `headset` (Expert-Backed Operations), `plug` (Vendor-Agnostic by Design), `link` (Part of Unified Cyber Defense).
- The section **ends on white with its normal bottom padding**.

---

## 7. Accessibility (required)

Everything in SIEM Cloud prompt §7 applies. Additionally:

- **Headings:** one `h1` (hero); sections 02–11 each get one `h2` (ten in all); items get `h3`. Labels inside the hero console, the 02 strip, the 04 spine, the 06 stage, the 08 rollout strip, the 09 bus, the 10 wireframes and the 11 diagram are `aria-hidden` and don't count.
- **Lists:** trust strip, pain points, outcomes, layers, sources, targets, use cases, options, ports and their chips, why items are all `<ul>`/`<ol>`.
- **Section 10 tabs:** fully keyboard operable; focus stays on the tab, not the panel; the accordion headers are native `<button aria-expanded>`.
- **Coral** is decoration or sits next to text that names it. Check `--nd-signal-ink` on white and `--nd-signal-on-dark` on `#070b18`.
- `:focus-visible { outline: 3px solid rgba(12,104,255,.45); outline-offset: 3px; }`, and `rgba(110,168,255,.7)` on dark.

## 8. Robustness and performance

Everything in SIEM Cloud prompt §8 applies: no libraries, no CDNs, no scroll listeners, no fixed heights on text, **no horizontal scroll down to 320px**, idempotent re-runs, one missing container or throwing builder skips only its section. Every loop (hero trace, 04 ticks, 06 signals) pauses off screen and on a hidden tab through `whileVisible`. If `nd-engine` is missing, "Tour All Features" isn't rendered.

## 9. `siem-ndr.html`: local preview harness

Copy `siem-cloud/siem-cloud.html` and adapt it: Figtree 400–700 from Google Fonts, `siem-ndr.css`, the fake 72px header, **eleven** mock containers in §6 order (two with an inner `.e-con-inner`), a grey placeholder after Why CybrHawk labelled "Existing CTA component goes here (FAQ to be added later)", then `siem-ndr.js`. The top comment lists the Elementor steps: create the 11 containers; load the CSS and JS like the other pages; hide a duplicate page-title H1; place the CTA component after section 11 and paste Appendix B's CTA copy into it; paste Appendix C into the SEO plugin.

## 10. Don'ts

- **Don't change the copy.** The only allowed edits, already made in Appendix A:
  - splitting "Title: text" and "Title — text" into `title` and `text`
  - dropping the "Outcome 1 ·", "Layer 1 ·", "Use Case 1 ·", "Option 1 ·", "Report 1 ·" prefixes in favour of generated numbers (04 keeps "Layer" as a generated mono label)
  - splitting the integration vendor lists into chips, dropping the joining "and", and keeping the rest as `tail`
  - wrapping existing words in `[[…]]` for the accent
  - dropping the eyebrow on 11, which would repeat the H2
  - decorative labels (console, strip, spine, stage, bus, wireframes, diagram), all taken from words already in the copy (see the CONTENT comments)
  The copy uses **US spelling** and a curly apostrophe in "Can’t". Keep both.
- Don't build the FAQ or the final CTA.
- Don't invent statistics, telemetry, customer names, logos, certifications or testimonials.
- Don't use coral for anything except a detection; don't use green.
- Don't use font weights above 700, an extra web font, `!important` without a comment, global selectors, or any change outside `siem-ndr/`.
- Don't put an unescaped CONTENT string into `innerHTML` or `insertAdjacentHTML`.

## 11. Acceptance checklist

Open `siem-ndr/siem-ndr.html` and confirm:

- [ ] Every section renders at **1440, 1280, 1024, 820, 768, 390 and 360px** with `document.documentElement.scrollWidth === window.innerWidth`.
- [ ] Each section visibly matches its source design in §2.2, re-skinned, and no two neighbours share a shape or a ground.
- [ ] The trace story reads top to bottom: quiet wire and coral detections in the hero, the coral "in between" tick in 02, five layers ending in one coral incident in 04, blue containment paths in 06, then calm.
- [ ] Coral appears only in the places §4.1 lists.
- [ ] The hero stagger plays once; the trace loops, pauses off screen, and is static at "Contained" under reduced motion.
- [ ] "Tour All Features" lands on section 04 with its heading visible below the fake header.
- [ ] Section 10 works with the keyboard alone (arrows, Home, End) and as an accordion below 860px.
- [ ] Reduced motion: everything visible at once, nothing moves.
- [ ] Deleting any one mock container still builds the other ten with no console errors; re-running the script adds no duplicates.
- [ ] Heading outline: one H1, ten H2s, H3s inside them.
- [ ] Every string matches Appendix A **character for character**.
- [ ] No vendor logos, no purple, no globe, no constellation, no fake IPs or numbers.

Leave a `// TODO:` in CONTENT for every open item marked in Appendix A.

---

## Appendix A: copy, verbatim, shaped for CONTENT

```js
var CONTENT = {

  hero: {
    eyebrow: "SIEM NDR · Network Detection & Response",
    // Two spans inside one <h1>; line 2 in the accent.
    title: ["When Prevention Fails,", "the Network Tells the Truth."],
    sub: "CybrHawk SIEM NDR continuously analyzes network traffic across your data center, campus, branch, cloud, and OT environments. It uses behavioral analytics, machine learning, and deep packet inspection to expose lateral movement, command-and-control, and data exfiltration that slip past endpoint and perimeter defenses.",
    cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
    // TODO: confirm "Tour All Features" should land on the Detection Engine (section 04).
    ctaSecondary: { label: "Tour All Features", href: "#nd-engine" },
    trust: [
      "Agentless, full-network visibility",
      "Encrypted-traffic analytics, no decryption",
      "MITRE ATT&CK-mapped detections",
      "Automated containment in minutes"
    ],
    // The trace console. Wire labels from section 05 item 6, detections from
    // the subheadline, the containment line from trust item 4. State words
    // are UI labels.
    visual: {
      label: "CybrHawk SIEM NDR",
      wires: ["East-West", "North-South"],
      detections: [
        { wire: 0, text: "Lateral movement" },
        { wire: 1, text: "Command-and-control" },
        { wire: 1, text: "Data exfiltration" }
      ],
      contained: "Automated containment in minutes",
      states: { observing: "Observing", detected: "Detected", contained: "Contained" },
      image: "",     // TODO: banner image URL (the console shows until one is set)
      imageAlt: ""
    }
  },

  challenge: {
    eyebrow: "The Challenge",
    title: "Attackers Live on Your Network. [[Most Tools Can’t See Them There.]]",
    body: [
      "Firewalls guard the perimeter and EDR guards the endpoint, but modern attacks happen in between. Once inside, adversaries use valid credentials and built-in tools to move laterally, establish hidden command-and-control channels, and quietly stage data for exfiltration. Unmanaged devices, IoT, OT, and encrypted traffic create blind spots where these attacks go unnoticed for weeks.",
      // Rendered as the pull line.
      "Network traffic is the one data source attackers cannot delete, disable, or evade. Every connection leaves a trace. CybrHawk SIEM NDR turns those traces into high-fidelity detections and fast, coordinated response."
    ],
    // "In between" strip labels (aria-hidden), from paragraph 1.
    strip: { from: "Perimeter", mid: "In between", to: "Endpoint" },
    items: [
      { icon: "network", title: "East-west blind spots", text: "Perimeter tools miss traffic moving between internal systems." },
      { icon: "chip",    title: "Unmanaged assets",      text: "IoT, OT, and shadow IT devices cannot run endpoint agents." },
      { icon: "lock",    title: "Encrypted threats",     text: "Most traffic is now encrypted, hiding malware callbacks and exfiltration." },
      { icon: "timer",   title: "Slow containment",      text: "Manual coordination across firewall, NAC, and identity teams lets attacks spread." }
    ]
  },

  outcomes: {
    eyebrow: "Measurable Outcomes",
    title: "What [[CybrHawk NDR]] Delivers",
    // Days → minutes graphic (aria-hidden), from outcome 1.
    visual: { from: "Days", to: "Minutes" },
    items: [
      { title: "Faster MTTD and MTTR",       text: "Detect and contain lateral movement, C2, and egress anomalies in minutes instead of days." },
      { title: "Higher Detection Fidelity",  text: "Multi-layered analytics and threat-intel fusion produce fewer, more accurate alerts with full network context." },
      { title: "Stronger Zero Trust Posture", text: "Continuously validate segmentation, enforce policy, and prove that your Zero Trust architecture works as designed." },
      { title: "Complete Asset Visibility",  text: "Discover and classify every device that talks on your network, including IoT, OT, and unmanaged endpoints." }
    ]
  },

  engine: {
    eyebrow: "Detection Engine",
    title: "A [[Multi-Layered]] Detection Engine",
    sub: "CybrHawk SIEM NDR combines five complementary detection layers, so known threats, unknown behaviors, and multi-stage attacks are all caught and correlated into a single incident.",
    // Spine labels (aria-hidden): "Layer" prefix generated; cap and end words from the paragraph.
    layerLabel: "Layer",
    spine: { start: "Traffic", end: "Single incident" },
    items: [
      { title: "Signature & Rules (IDS/IPS)",   text: "High-performance signature and rule matching detects known exploits, malware, and protocol abuse at line rate." },
      { title: "Behavior & UEBA",               text: "Per-device and per-segment baselines flag unusual peers, ports, volumes, protocols, and time-of-day activity." },
      { title: "Anomaly & Sequence Models",     text: "Machine-learning models recognize beaconing, multi-stage kill chains, data staging, and exfiltration patterns." },
      { title: "Threat Intelligence Fusion",    text: "HawkINT and curated feeds enrich every connection with reputation data and dynamic risk scoring." },
      { title: "Attack Mapping",                text: "Findings are mapped to MITRE ATT&CK tactics and techniques for fast triage, coverage analysis, and executive reporting." }
    ]
  },

  analyzes: {
    eyebrow: "What CybrHawk NDR Analyzes",
    title: "Deep Visibility Across [[Every Network, Every Protocol]]",
    items: [
      { slug: "flow",      icon: "pulse", title: "Flow & Packet Metadata",
        text: "NetFlow, IPFIX, and sFlow telemetry, SPAN/mirror ports and TAPs, plus on-demand selective PCAP for forensic evidence." },
      { slug: "iot-ot",    icon: "chip",  title: "IoT, OT & Shadow IT",
        text: "Passive fingerprinting identifies device type, vendor, and behavior, and flags rogue or unauthorized assets." },
      { slug: "dns-web",   icon: "globe", title: "DNS & Web Traffic",
        text: "Detection of newly registered domains, DGA activity, suspicious TLDs, malware callbacks, and TLS SNI anomalies." },
      { slug: "cloud",     icon: "cloud", title: "Cloud Traffic",
        text: "AWS VPC Flow Logs, Azure NSG Flow Logs, GCP VPC Flow Logs, and cloud traffic mirroring." },
      { slug: "encrypted", icon: "lock",  title: "Encrypted Traffic",
        text: "JA3/JA4-style TLS fingerprinting, certificate anomalies, and handshake behavior analysis, without decrypting payloads." },
      { slug: "directions", icon: "axes", title: "East-West & North-South",
        text: "Internal lateral traffic and internet-bound egress analyzed together for complete attack context." }
    ]
  },

  response: {
    eyebrow: "Response & Orchestration",
    title: "From Detection to [[Containment in Minutes]]",
    sub: "Detection alone does not stop an attack. CybrHawk SIEM NDR orchestrates response across your network, identity, and endpoint controls, with approvals and guardrails that keep your team in control.",
    // Stage labels (aria-hidden), from the paragraph.
    core: "CybrHawk SIEM NDR",
    gate: "Approvals · Guardrails",
    items: [
      { title: "Firewalls, SD-WAN & SASE", text: "Push blocks, update ACLs, and quarantine malicious paths at the edge and across branches." },
      { title: "NAC & SDN",                text: "Move compromised devices to restricted VLANs and enforce microsegmentation automatically." },
      { title: "Identity, EDR & Email",    text: "Disable compromised credentials, isolate hosts, and quarantine malicious messages." },
      { title: "ITSM & SOAR",              text: "Open tickets, trigger playbooks, and notify on-call responders with built-in approval workflows." }
    ]
  },

  usecases: {
    eyebrow: "Use Cases",
    title: "Purpose-Built for [[Real-World Network Threats]]",
    // Direction tags: words from section 05 item 6. The assignment is an
    // interpretation. TODO: confirm each card's direction with product.
    directions: { ew: "East-West", ns: "North-South" },
    items: [
      { dir: "ns", icon: "beacon",        title: "Command-and-Control & Beaconing",
        text: "Identify periodic callbacks, rare SNI and certificate usage, and connections to risky or newly registered destinations." },
      { dir: "ns", icon: "database-leak", title: "Data Exfiltration",
        text: "Detect unusual egress volumes, covert channels such as DNS tunneling, and geolocation outliers before sensitive data leaves." },
      { dir: "ew", icon: "lateral",       title: "Lateral Movement",
        text: "Expose SMB, RDP, and WinRM misuse, credential spraying, and pivot hotspots as attackers move through your environment." },
      { dir: "ew", icon: "factory",       title: "IoT & OT Security",
        text: "Discover unmanaged devices, enforce segmentation, and flag unsafe industrial and legacy protocols." },
      { dir: "ns", icon: "cloud",         title: "Cloud Egress Control",
        text: "Monitor inter-VPC and VNet flows, unexpected internet exposure, and access-key misuse in cloud workloads." },
      { dir: "ew", icon: "shield",        title: "Zero Trust Validation",
        text: "Continuously verify that segmentation policies are enforced and detect drift the moment it happens." }
    ]
  },

  deploy: {
    eyebrow: "Deployment Options",
    title: "Deploy Your Way, [[Start Fast, Scale Easily]]",
    panelLabel: "Deploy",   // chrome bar label, from the H2
    items: [
      { icon: "network",     title: "Virtual & Physical Sensors",
        text: "Deploy via SPAN, mirror ports, or TAPs across data centers, campuses, and branch offices." },
      { icon: "cloud",       title: "Cloud Sensors",
        text: "Native traffic mirroring and flow-log ingestion for AWS, Azure, and Google Cloud." },
      { icon: "layers",      title: "Lightweight Rollout",
        text: "Start with flow telemetry for instant visibility, then add packet metadata and selective PCAP as you mature.",
        // Rollout strip (aria-hidden), from this item's text.
        steps: ["Flow telemetry", "Packet metadata", "Selective PCAP"] },
      { icon: "fingerprint", title: "Privacy-Preserving Analytics",
        text: "Analyze encrypted traffic without decrypting payloads, supporting privacy and regulatory obligations." }
    ]
  },

  integrations: {
    eyebrow: "Integrations",
    title: "Integrates With Your [[Network and Security Ecosystem]]",
    bus: "CybrHawk SIEM NDR",
    portLabel: "Port",
    // chips: split from the copy's list, joining "and" dropped. tail: the rest, verbatim.
    // own: the chip that is a CybrHawk product (shown in blue).
    items: [
      { title: "Firewalls & Gateways", chips: ["Palo Alto Networks", "Fortinet", "Check Point", "Cisco"], tail: "and more" },
      { title: "NAC, SDN & Switching", chips: ["Cisco ISE", "Aruba ClearPass", "VMware NSX"], tail: "and more" },
      { title: "Cloud",                chips: ["AWS", "Microsoft Azure", "Google Cloud"], tail: "flow logs and traffic mirroring" },
      { title: "EDR, SIEM & ITSM",     chips: ["CybrHawk SIEM XDR", "ServiceNow", "Jira"], tail: "and leading EDR platforms", own: "CybrHawk SIEM XDR" }
    ]
  },

  reporting: {
    eyebrow: "Reporting & KPIs",
    title: "Reporting That Speaks to [[Analysts and Executives]]",
    // wire: the CSS wireframe type; labels come from each item's own text (aria-hidden).
    items: [
      { icon: "dashboard",  title: "Executive Dashboards", wire: "tiles",
        text: "Top talkers, risky destinations, blocked versus allowed traffic, and critical incidents at a glance.",
        labels: ["Top talkers", "Risky destinations", "Blocked versus allowed traffic", "Critical incidents"] },
      { icon: "clipboard",  title: "Incident Workbench",   wire: "timeline",
        text: "Unified timelines, peer graphs, evidence attachments, and ATT&CK mapping in a single investigation view.",
        labels: ["ATT&CK mapping"] },
      { icon: "file-check", title: "Compliance Scorecards", wire: "progress",
        text: "Track segmentation drift, log coverage, and retention evidence for audits.",
        labels: ["Segmentation drift", "Log coverage", "Retention evidence"] },
      { icon: "timer",      title: "Operational KPIs",     wire: "gauges",
        text: "Measure MTTD for lateral movement and C2, exfiltration detection time, segment coverage, and false-positive rate.",
        labels: ["MTTD", "Exfiltration detection time", "Segment coverage", "False-positive rate"] }
    ]
  },

  why: {
    eyebrow: "",   // "Why CybrHawk" would repeat the H2
    title: "Why CybrHawk for [[Network Detection & Response]]",
    // Item 1 is the dark anchor; its diagram labels come from its own text.
    diagram: { lanes: ["Network", "Endpoint", "Cloud", "Identity"], end: "SIEM XDR" },
    items: [
      { icon: "",        title: "Native SIEM Integration",
        text: "Network detections flow directly into CybrHawk SIEM XDR for cross-domain correlation with endpoint, cloud, and identity data." },
      { icon: "layers",  title: "IT, Cloud, and OT in One View",
        text: "A single platform covers enterprise, cloud, and industrial networks." },
      { icon: "headset", title: "Expert-Backed Operations",
        text: "Optional 24/7 monitoring and threat hunting from the CybrHawk SOC." },
      { icon: "plug",    title: "Vendor-Agnostic by Design",
        text: "Works with the firewalls, switches, and security tools you already own." },
      { icon: "link",    title: "Part of Unified Cyber Defense",
        text: "Connects natively with ITDR, OT Security Monitoring, HawkINT, and IR One." }
    ]
  }
};
```

## Appendix B: parked copy (not built now)

**Section 12 · FAQ** (for a later pass; build it after section 11 with the UDC FAQ accordion pattern):

| Question | Answer |
|---|---|
| What is Network Detection and Response (NDR)? | NDR continuously monitors network traffic to detect suspicious behavior, such as lateral movement, command-and-control, and data exfiltration, and enables rapid response. Because it analyzes the network itself, it sees threats that endpoint and perimeter tools miss. |
| How is NDR different from EDR and a firewall? | Firewalls control traffic at boundaries, and EDR monitors individual endpoints. NDR watches traffic between all devices, including unmanaged IoT and OT assets that cannot run agents, providing the visibility layer that connects the two. |
| Can CybrHawk NDR analyze encrypted traffic? | Yes. It uses TLS fingerprinting, certificate analysis, and handshake behavior to detect threats in encrypted traffic without decrypting payloads. |
| Does it require agents? | No. CybrHawk NDR is agentless. It uses network sensors, SPAN or TAP feeds, flow telemetry, and cloud flow logs. |
| Does it support cloud environments? | Yes. It ingests AWS, Azure, and GCP flow logs and supports cloud traffic mirroring for full visibility into cloud workloads. |
| How quickly can we deploy? | Most organizations start with flow telemetry for immediate visibility, then add sensors and packet metadata in phases. Your CybrHawk team will scope a rollout plan for your environment. |

**Section 13 · Final CTA** (for the site's existing CTA component):

| Field | Value |
|---|---|
| CTA heading | Close the Gaps Attackers Hide In. |
| CTA body | See how CybrHawk SIEM NDR exposes hidden threats across your network and contains them in minutes. Book a personalized demo with our network security experts. |
| Primary button | Request a Demo → `https://cybrhawk.com/request-for-demo/` |
| Secondary button | Download the Unified Defense Guide → TODO: guide URL |
| Supporting line | Prefer to talk now? Call 954-324-4750 or email sales@cybrhawk.com. (`tel:+19543244750`, `mailto:sales@cybrhawk.com`) |

## Appendix C: SEO fields (for the SEO plugin, not code)

| Field | Value |
|---|---|
| Meta title (≤60) | SIEM NDR \| Network Detection & Response \| CybrHawk |
| Meta description (≤160) | Detect lateral movement, C2, and data exfiltration with CybrHawk SIEM NDR. AI-driven network detection and response for on-prem, cloud, IoT, and OT traffic. |
| URL slug | `/siem-ndr/` |
| Primary keyword | network detection and response |
| Secondary keywords | NDR SIEM, network traffic analysis, lateral movement detection, encrypted traffic analysis, C2 detection, data exfiltration detection, Zero Trust validation |
| Open Graph title | CybrHawk SIEM NDR: When Prevention Fails, the Network Tells the Truth |
