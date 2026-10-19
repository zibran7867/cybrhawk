# Build the CybrHawk UCD page: `udc/udc.js`, `udc/udc.css`, `udc/udc.html`

## 1. The job

Build the **Unified Cyber Defense (UCD)** solution page for cybrhawk.com. It covers sections 1–12 of the approved copy, which is in **Appendix A** verbatim and already shaped for the CONTENT block.

**Out of scope: section 13 (the final call to action).** The site already has a closing CTA component, and it sits directly after the last section built here. Its copy is in Appendix B so the editor can paste it into that component. Don't build it.

The three output files already exist and are empty:

| File | What goes in it |
|---|---|
| `udc/udc.js` | Builds all 12 sections, each into its own Elementor container |
| `udc/udc.css` | Every style for the page, scoped to those containers |
| `udc/udc.html` | A local preview harness (it is not deployed) plus the Elementor setup notes (§8) |

Don't edit anything outside `udc/`.

---

## 2. How this site builds sections. Read these files before writing anything

The site runs on WordPress and Elementor. **The Elementor container markup is fixed, so we ship only JS and CSS.** The script finds an empty container by its CSS class, injects the section's markup, and the CSS styles that markup.

| Read | For |
|---|---|
| `enterprise-operations-intelligence/how-it-works/how-it-works.{js,css}` | **The reference builder.** It shows the CONTENT block, the `esc`/`nl2br`/`markup`/`pad` helpers, the header pattern, the pipeline whose connectors are drawn in CSS (vertical on mobile), and the reveal on scroll. |
| `enterprise-operations-intelligence/proof-points/proof-points.{js,css}` | A split layout, the 2×2 card grid, an image with an empty-frame fallback, and the card shadow tokens |
| `enterprise-operations-intelligence/landscape/landscape.{js,css}` | Four cards around a central hub with a dotted orbit ring. **Reuse this for section 11.** |
| `enterprise-operations-intelligence/walkthrough-cta/walkthrough-cta.{js,css}` | The primary and ghost buttons with an SVG arrow. **Reuse these for the hero buttons.** |
| `home-page/five-solution-cards/five-solution-cards.{js,css}` | The solution badge icons (`shield`, `globe`, `crosshair`, `dashboard`, `headset`), card and badge styling, and focus handling |
| `enterprise-operations-intelligence/use-cases/use-cases.js` | More icons in the house style (`bank`, `factory`, `derrick`, `network`, …) |
| `HawkINT/section-2/second-section.{js,css}` | The newest solution page: the site blue `#0c68ff`, the eyebrow with a gradient lead-in line, the decoration layer marked `aria-hidden` (orb, dot fields, rings, `overflow: clip`), and band gradients that meet "without a seam" |
| `HawkINT/section-3/section-3.css` | Notes on Elementor specificity, the `.e-con-inner` padding reset, and how the contrast was checked |

`enterprise-operations-intelligence/seconn-section/` is the one exception: static HTML and ES6 JS. **Don't copy its style.**

### House conventions. Follow them exactly

**JavaScript**
- Wrap everything in one IIFE with `"use strict"`, written in **ES5**: `var`, `function` and string concatenation. Don't use arrow functions, template literals, `const`/`let`, classes or modules.
- Open the file with a comment block. It says what the file does, which container classes it needs, and that the selectors at the top are the only thing to change if a live class differs.
- Put a **"Content (edit freely)"** block at the top. It holds every visible string, URL and on/off toggle, and the builders hard-code nothing a reader sees. In titles, `"\n"` becomes `<br>` and `[[…]]` becomes an accent `<span>` (see `markup()` in how-it-works.js).
- Pass every string from CONTENT through `esc()` (or `markup()`/`nl2br()`, which escape first) before it reaches HTML.
- Use the container's `.e-con-inner` as the host if it has one, and the container itself otherwise. Inject with `insertAdjacentHTML("beforeend", …)`.
- Builders are **idempotent**. A builder returns `true` if its root already exists, and `false` while the container isn't in the DOM yet.
- `init()` tries to build. If that fails, a `MutationObserver` on `document.documentElement` retries and is disconnected after 10 s. Run `init()` on `DOMContentLoaded`, or straight away if the document is already parsed.
- When `ANIMATE` is on, the root gets `is-animated`. `reveal()` adds `is-visible` once through an `IntersectionObserver` (threshold about 0.1), and adds it immediately when the user prefers reduced motion or the browser has no IO.
- **Icons** are inline SVG with a `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and joins, and `aria-hidden="true"`. Reuse a glyph from the files above where one fits, and draw new ones in the same style.
- Comments explain *why*: the constraint, trade-off or browser quirk behind the code. Match the comment density of how-it-works.js.

**CSS**
- Open with a comment block. Scope **every rule under a section container class**. No bare element selectors and no global rules.
- Declare tokens as custom properties under a "Tweak to rebrand" comment (§4).
- The shell is `width: 100%`, `max-width: calc(var(--ucd-measure) + 2 * var(--ucd-gutter))`, `margin: 0 auto`, padding `var(--ucd-pad-y) var(--ucd-gutter)`, and `box-sizing: border-box` on the root and all its descendants. Use `font-family: inherit`.
- The gutter is **24px**, then **22px at ≤980px**, then **18px at ≤520px**.
- **The site loads Figtree only up to weight 700.** Never use 800 or 900, because they fall back to Helvetica.
- The section header has an optional 64×4px accent bar, then the eyebrow (12.5–14px, weight 700, letter-spacing about 4px, uppercase, accent ink). The H2 is `clamp(30px, 4vw, 48px)` at weight 700, with line-height 1.12–1.16, letter-spacing −1.2px and `text-wrap: balance`. The sub-line is `clamp(16px, 1.35vw, 18px)` with line-height 1.62 and `text-wrap: pretty`.
- Cards are white with a 1px border, a 16px radius and the layered soft shadow (`--pp-shadow` in proof-points.css). **Only cards that are links or buttons lift on hover:** `translateY(-4px)`, a stronger shadow and a border tinted with the accent. Static cards don't move, so they never look clickable.
- Focus styles are `:focus-visible { outline: 3px solid rgba(12,104,255,.4); outline-offset: 3px; }`.
- The scroll reveal starts at `opacity: 0; transform: translateY(20px)` and ends at `opacity: 1; transform: none`, with `transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1)`. Stagger it with an inline `--i` index. A `prefers-reduced-motion` block turns off every transform and transition.
- Elementor's page CSS writes selectors up to (0,4,0). Our injected markup carries its own classes, so conflicts should be rare. Where you do have to style Elementor's own wrappers, add a class so the rule wins, as HawkINT does. The site's Additional CSS gives every `.e-con-inner` 0.5% side padding and no `max-width`, so reset both inside UCD containers. **Don't use `!important`** unless a rule has been shown to lose; if you must, add a comment that says why.

---

## 3. Architecture for this page

Each section has its **own empty Elementor container**: Content Width set to Full Width, padding 0, no background. The container's class goes in the CSS Classes field. When the JS builds into a container it also adds `ucd-section` to it, and the shared tokens and primitives are scoped under `.ucd-section`, so editors only ever type one class.

| # | Section | Container class | Root block | Background |
|---|---|---|---|---|
| 1 | Hero | `ucd-hero` | `.ucd-hr` | Gradient band `#fbfcff` → `#f2f6ff` → `#ffffff` with a decoration layer |
| 2 | Trust bar | `ucd-trust` | `.ucd-tb` | White, with a hairline top and bottom |
| 3 | The enterprise problem | `ucd-problem` | `.ucd-pb` | Tint |
| 4 | What's inside UCD (8 capabilities) | `ucd-capabilities` | `.ucd-cp` | White |
| 5 | How UCD works | `ucd-how` | `.ucd-hw` | Tint |
| 6 | What you get | `ucd-outcomes` | `.ucd-oc` | White |
| 7 | Choose your SOC model | `ucd-soc-models` | `.ucd-sm` | Tint |
| 8 | Mapped to NIST CSF 2.0 | `ucd-nist` | `.ucd-ns` | White |
| 9 | Built for the regulatory clock | `ucd-regulatory` | `.ucd-rg` | Tint |
| 10 | Industries we serve | `ucd-industries` | `.ucd-in` | White |
| 11 | Part of CybrHawk's five solutions | `ucd-solutions` | `.ucd-sl` | Tint |
| 12 | FAQ | `ucd-faq` | `.ucd-fq` | **White** (the existing CTA follows, and its ground is white) |
| 13 | *Final CTA* | *existing component* | — | *not built here* |

No two neighbouring sections share a background. Element classes take the form `ucd-xx__name`, and modifiers take the form `ucd-xx__name--mod`. Every `id` is prefixed `ucd-`.

**Outline of `udc.js`:**

```js
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = { hero: ".ucd-hero", trust: ".ucd-trust", /* … */ faq: ".ucd-faq" };

  /* ---- Content (edit freely) ---- */
  var CONTENT = { /* Appendix A */ };
  var ANIMATE = true;
  /* -------------------------------- */

  var ICONS = { /* … */ };  function icon(name) { /* … */ }
  function esc(s) {}  function nl2br(s) {}  function markup(s) {}  function pad(n) {}
  function head(o) {}   // bar + eyebrow + H2 + sub; drops the eyebrow/sub when ""; align "center" | "start"

  function buildHero(host, c) {}  /* … one builder per section … */  function buildFaq(host, c) {}

  var BUILDERS = [["hero", buildHero], ["trust", buildTrust], /* … */ ["faq", buildFaq]];

  function buildAll() {}  // true once every section with a selector is built
  function reveal(root) {}
  function init() {}      // buildAll(), else observe until done or 10 s
})();
```

- A missing container skips **only that section**. Wrap each builder call so that an error in one section is logged with `console.error` and the others still build.
- Bind interactions (the FAQ toggles) **by delegation from the section root**.
- Lay out `udc.css` in this order: the header comment, then the shared tokens on `.ucd-section`, then the shared primitives (shell, header, card, chip, button, reveal), then one block per section in page order, each under a banner comment with its own responsive and reduced-motion rules.

---

## 4. Design tokens. Declare them once, on `.ucd-section`

UCD is "Solution 01", so it uses the same **site blue as the HawkINT solution page** rather than the indigo used on the HawkOps page.

```css
--ucd-accent:        #0c68ff;   /* site blue (HawkINT, and the Additional CSS step numbers) */
--ucd-accent-hover:  #0a58d6;
--ucd-accent-ink:    #0a58d6;   /* small accent text on tints: #0c68ff is only ~4.4:1 on #f2f6ff */
--ucd-accent-soft:   #eaf2ff;   /* badge and chip fills */
--ucd-heading:       #0d1330;   /* near-black navy */
--ucd-text:          #5b6478;   /* body grey: ~5.9:1 on white, ~5.6:1 on the tint */
--ucd-bg:            #ffffff;
--ucd-bg-tint:       #f8f9fd;   /* plus a faint top radial: rgba(12,104,255,.045) */
--ucd-card-bg:       #ffffff;
--ucd-border:        #e6eaf2;
--ucd-rule:          #edf0f6;
--ucd-shadow:        0 1px 2px rgba(13,19,48,.04), 0 8px 24px rgba(13,19,48,.05);
--ucd-shadow-hover:  0 2px 4px rgba(13,19,48,.05), 0 16px 38px rgba(13,19,48,.10);
--ucd-radius:        16px;
--ucd-measure:       1320px;
--ucd-gutter:        24px;      /* 22px ≤980px, 18px ≤520px */
--ucd-pad-y:         clamp(56px, 7vw, 92px);
--ucd-gap:           clamp(16px, 1.6vw, 24px);
```

Don't add a grey lighter than `--ucd-text` for real copy. (`#7b8298`, which the CTA files use, fails AA on white.)

---

## 5. Section specs

All copy comes from Appendix A. **"Eyebrow"** is the section label and **H2** is the headline. Where the copy gives a section only a label (sections 7, 8, 9, 10 and 12), that label becomes the H2 and the eyebrow is empty and not rendered. **Don't invent eyebrows, sub-lines, statistics, claims, logos or testimonials.**

### 1 · Hero (`.ucd-hero` → `.ucd-hr`)
- This is the only `<h1>` on the page. Check that the page template doesn't print the WordPress page title as a second H1. If it does, hide it in Elementor's page settings.
- **Desktop (≥1025px):** two columns. Copy takes about 1.05fr with a 600px cap, and the visual takes about 0.95fr. The copy column holds, in order:
  - the eyebrow, with a 40×2px gradient lead-in line (as in HawkINT's `.hi-about__eyebrow`)
  - the **H1** at `clamp(36px, 4.4vw, 60px)`, weight 700, line-height 1.05 and letter-spacing −0.025em, with `[[Autonomous.]]` in the accent
  - the **lead** at 18–20px in `--ucd-heading`
  - the **body** at 16–17px in `--ucd-text`
  - the **tagline** ("Detect. Defend. Respond. All in one.") at weight 700 in `--ucd-heading`
  - a **button row**: the primary "Request a Demo" and the ghost "Speak to a Security Architect", copied from the walkthrough-cta buttons (10px radius, 14×26px padding, SVG arrow, lift on hover)
  - the **proof strip** below a hairline: four items, each with an accent check icon, as a `<ul>` in a 2×2 grid. They fall to one column at ≤520px.
- **The visual is a coded "unified defense" illustration. It doesn't need an image.**
  - A square stage (`aspect-ratio: 1`, at most 560px) holds a central core: a white circle about 168px across with a border and shadow, a shield icon in an accent-soft rounded square, the word **UCD**, and the caption "Unified Cyber Defense" in small uppercase.
  - A dotted orbit ring goes around the core (the landscape `RING` technique), with an optional fainter outer ring.
  - **Five node chips** sit in a pentagon on the ring: Endpoints, Network, Cloud, Identity and OT. Each is a white pill with an icon and a label.
  - Connectors run from each chip to the core in one SVG with `viewBox="0 0 100 100"` and `vector-effect: non-scaling-stroke`, drawn in the accent at about 30% alpha. A small dot travels along each line *toward* the core, which reads as signals converging. Stagger the durations between 2.8 and 3.6s.
  - The core pulses softly.
  - The labels are HTML, not SVG text, so they stay at 12px or more at a 360px viewport. Every chip stays fully inside the stage at every width from 320px up.
  - The whole visual is `aria-hidden="true"`, because the copy already says the same thing.
  - Animate only `transform` and `opacity`. **Pause** the animation when the visual is off screen (IntersectionObserver) or the tab is hidden, and render it **static** under reduced motion.
  - Optional: if `CONTENT.hero.visual.image` is set, show that image in place of the illustration. If the image fails to load, fall back to the illustration, the way the proof-points `is-empty` fallback works.
- **Background:** the gradient band, plus the decoration layer from HawkINT (an orb off one corner and one or two masked dot fields, with `pointer-events: none` and `overflow: clip` so it never widens the page). The band ends at `#ffffff` so the trust bar joins without a seam.
- Vertical padding is `clamp(48px, 6vw, 96px)` at the top and `clamp(56px, 7vw, 104px)` at the bottom. If the theme header overlays this page template, add top padding so the header clears the eyebrow.
- **≤1024px:** the columns stack, copy first, with the visual centred below at most 520px wide. **≤620px:** the buttons go full width and stack.

### 2 · Trust bar (`.ucd-trust` → `.ucd-tb`)
- A compact strip with vertical padding of `clamp(18px, 2vw, 26px)`. It has no visible heading. Use `<ul aria-label="…">` with the label from CONTENT.
- Each of the five items has a small accent icon and its label at 14–15px, weight 600, in `--ucd-heading`. **Keep the case of the copy; don't uppercase it.**
- **Desktop:** one centred row with generated separators between items, like the `·` sources line in how-it-works.css.
- **≤1080px:** the items become wrapping chips with a 1px border and pill radius, and the separators go. This is the same switch how-it-works.css makes.
- Each item has an optional `image` URL. If it is set, that badge artwork (for example, the SOC 2 and ISO badges already in the footer, exported to uploads) replaces the icon at 28–32px high.

### 3 · The enterprise problem (`.ucd-problem` → `.ucd-pb`)
- **Desktop:** a two-column grid at about 0.95fr / 1.05fr.
  - **Left column:** the header aligned to the start, then the intro paragraph (16–17px, line-height 1.7, max 36em).
  - **Right column:** a `<ul>` of three pain cards stacked vertically. Each card has an icon badge (hourglass, alert stack, timer) and a sentence whose opening phrase is in `<strong>` in `--ucd-heading`, e.g. `<strong>Dwell time grows</strong> when weak signals…`.
- **Below both columns, full width:** the **resolution callout**. It's a white card with a 4px accent bar on the left. Its first sentence ("UCD removes the seams.") is in `<strong>` in `--ucd-heading`, and the rest is in `--ucd-text`, at 17–19px. This is the pivot of the page, so make it read like one.
- **≤1024px:** one column, in the order header, intro, cards, callout.

### 4 · Eight capabilities (`.ucd-capabilities` → `.ucd-cp`)
- This is the core of the page. The header is centred: eyebrow "What's inside UCD", and the H2 "Eight capabilities. [[One defense.]]".
- **Show every capability's full copy. Don't hide any of it behind "Read more."** These are the product's substance and should be readable at a glance.
- **Grid:** two columns at ≥900px and one column below. Use `--ucd-gap`. Every card in a row has the same height.
- **Card** (`<article id="ucd-cap-{slug}">`, so other pages can deep-link):
  - a left rail with the number chip ("01"; accent-soft fill, accent-ink text, weight 700, 13px) above a 52px icon badge
  - a body with the **h3** title, then the optional `full` name (e.g. "Identity Threat Detection & Response") at 14.5px, weight 600, in accent ink, then the paragraph at 15–16px with line-height 1.65 and a cap of about 68ch.
  - At ≤440px the rail sits above the body.
- Icons: AI SOC uses a headset or radar, SIEM/XDR stacked layers, ITDR a user with a shield, OT a factory, CDR a cloud with a shield, Exposure Management a crosshair, AI Agents a bot or spark, and Broad Integrations a plug.

### 5 · How UCD works (`.ucd-how` → `.ucd-hw`)
- Header centred. The H2 is "One continuous loop, from telemetry to [[contained incident.]]".
- Five steps (Sense, Correlate, Decide, Act, Prove) as an `<ol>`. **Copy the how-it-works pipeline:** each icon card holds an icon and the step name, with the text below it. Draw the connectors between cards in CSS: a gradient line across the gap plus a dot on the card edge. They are derived from `--ucd-gap`, so nothing has to be measured.
- **It's a loop, so show the return.** At ≥1024px, a dashed accent line runs *above* the row. It starts at the centre of the "Prove" card and ends at the centre of the "Sense" card, as a rounded bracket (top border plus side borders with a rounded top) with a small arrowhead pointing down into "Sense". Draw it with CSS pseudo-elements on the `<ol>` and mark it `aria-hidden`.
- **≥1024px:** five across. **<1024px:** a vertical timeline. Each step becomes a row with the icon card on the left and the name and text on the right, joined by vertical connectors between the icon cards. The loop line is dropped.

### 6 · What you get (`.ucd-outcomes` → `.ucd-oc`)
- **Desktop:** a split built with `grid-template-areas`.
  - The **left** column holds the header (aligned to the start; the H2 is "See everything. Detect early. Respond fast. [[Stay resilient.]]") with the **pull quote** under it: "Protect critical infrastructure. Preserve operational continuity." Render the quote as a `<blockquote>`-style callout with a 4px accent bar on the left, at 20–24px, weight 700, in `--ucd-heading`.
  - The **right** column is a 2×2 grid of the four outcome cards: an icon (eye, pulse, bolt, shield with a refresh arrow), the h3 title ("See everything."), and the text.
- The DOM order is header, cards, quote. **≤1024px:** the layout stacks in that order, so the quote closes the section. **≤560px:** the cards go to one column.

### 7 · Choose your SOC model (`.ucd-soc-models` → `.ucd-sm`)
- The H2 is "Choose your SOC model", centred, with no eyebrow.
- The five models are cards in a `<ul>`. Each card holds:
  - the **h3** model name
  - a **coverage pill** in the head: a clock icon and "24/7", with accent-soft fill and accent-ink text, plus a visually hidden prefix that says "Coverage:"
  - a `<dl>` whose `<dt>`s are "How it works" and "Best for" (small uppercase labels in `--ucd-heading`) and whose `<dd>`s are the text.
- **Layout:** five across at ≥1200px. Below that, the cards wrap and **the last row is centred**: use flex-wrap with `justify-content: center` and a computed basis. No card is narrower than about 220px. One column at ≤600px.
- Don't highlight one model as "recommended". The copy doesn't say that.

### 8 · Mapped to NIST CSF 2.0 (`.ucd-nist` → `.ucd-ns`)
- The H2 is "Mapped to NIST CSF 2.0", centred.
- Six function tiles, in the CSF order Govern, Identify, Protect, Detect, Respond, Recover. Each tile has a two-letter **code badge** (GV, ID, PR, DE, RS, RC; these are the official CSF 2.0 function identifiers, marked `aria-hidden`), the **h3** function name, and the capabilities as a **chip list** (`<ul>`; pills with a 1px border, 13.5px, in `--ucd-heading`). The chips come from the "·"-separated cell, already split into arrays in Appendix A.
- **Layout:** three columns at ≥900px, two at ≥560px, and one below that.

### 9 · Built for the regulatory clock (`.ucd-regulatory` → `.ucd-rg`)
- The H2 is "Built for the regulatory clock", centred.
- Use a **real `<table>`**, labelled by the H2 through `aria-labelledby`. Its header cells are `<th scope="col">` (Regime / Applies to / Key timelines), and each regime name is a `<th scope="row">`.
- Style:
  - The table is a rounded card with `overflow: hidden`.
  - The header row is navy (`--ucd-heading`) with white text at 13px, weight 700, uppercase, letter-spacing 1.5px.
  - Body rows are white with `--ucd-rule` separators, and the regime column is bold in `--ucd-heading`.
- In the timelines, the durations are wrapped in `[[…]]` in Appendix A and render in accent ink at weight 700. **The wording itself is legal copy. Don't change a word or a punctuation mark.**
- **≤760px:** each row becomes a stacked card. Hide `thead` visually, and give each cell its label through `td::before { content: attr(data-label) }`. Nothing scrolls sideways.
- The note paragraph goes below the table, centred, at most 760px wide and 15–16px. Its last sentence ("Obligations remain yours; UCD helps you meet the clock.") is in `<strong>`. It's a disclaimer, so **don't set it in small print.**

### 10 · Industries we serve (`.ucd-industries` → `.ucd-in`)
- The H2 is "Industries we serve", centred.
- Twelve tiles in a `<ul>`: the 11 industries plus "And more". Each tile has an icon badge centred above the name at 15px, weight 600. The "And more" tile is muted, with a dashed border and no icon (or a "+").
- **Grid:** six columns at ≥1180px, four at ≥900px, three at ≥600px, and two below that.
- These tiles are not links, so they have no hover lift.
- Icons:

  | Industry | Icon |
  |---|---|
  | Manufacturing | factory |
  | Oil & Gas | derrick (in use-cases.js) |
  | Utilities | pylon |
  | Water | droplet |
  | Power Generation | lightning bolt |
  | Transportation | truck or train |
  | Healthcare | medical cross |
  | Smart Cities | buildings |
  | Government | columned building (`bank` glyph) |
  | Financial Services | coins or a card |
  | Education | graduation cap |

### 11 · Part of CybrHawk's five solutions (`.ucd-solutions` → `.ucd-sl`)
- The eyebrow is "Part of CybrHawk's five solutions", and the H2 is "UCD is the core. [[Four more extend it.]]".
- **Reuse the landscape layout**, because the copy literally describes a core with four around it.
  - The **hub** is the UCD core: the shield badge, "01 · UCD", and the caption "Unified Cyber Defense". It has the dotted orbit ring and the curved connectors.
  - The **four cards** sit around it in the order 02 to 05, filling clockwise from the top left. Each card has the solution badge (globe, crosshair, dashboard and headset from five-solution-cards.js), "02 · HawkINT" as the h3, the focus line in `--ucd-text`, and the tagline at weight 600 in accent ink (as `wei-uc__card-tagline` does).
- **A card with an `href` is a whole-card `<a>`** that lifts on hover and has an arrow icon. **A card with an empty `href` renders as a plain `<article>`**, so no dead links ship.
- Below the stage, centred, goes the text link "Explore all five solutions" with an SVG arrow. Render it only if its `href` is set.
- Responsive behaviour is exactly the landscape's. At ≤1120px the hub moves above the cards in two columns and the connectors are dropped. At ≤680px everything is one column.

### 12 · FAQ (`.ucd-faq` → `.ucd-fq`)
- The H2 is "FAQ", centred. The section is one column, at most 880px wide.
- Six accordion items. Each is an `<h3>` holding a `<button aria-expanded aria-controls>` with the question at 17–18px, weight 600, in `--ucd-heading`, plus an icon that changes from plus to minus. Each answer is a `<div role="region" aria-labelledby>` that carries `hidden` while it is closed.
- Items are separated by `--ucd-rule` lines. All of them start closed, and more than one can be open at a time.
- The reveal is a short keyframe fade, because `display` can't be transitioned (how-it-works.css explains this). There is no animation under reduced motion.
- **Strip the "⚑" from the third question.** It's an editorial review flag in the copy doc, not part of the copy. Its CONTENT entry has a `// TODO` that says it's flagged for review.
- The section **ends on white with its normal bottom padding**, because the existing CTA component comes next.

---

## 6. Accessibility (required)

- **Headings:** exactly one `h1`, in the hero. Each section gets an `h2`, and cards and items get `h3`. Never skip a level.
- **Lists:** anything that is a list is a `<ul>` or `<ol>` (proof strip, trust items, pain points, capabilities, steps, outcomes, models, chips, industries, solutions).
- **Decoration and icons:** all decoration and all icons are `aria-hidden="true"`, because the text always carries the meaning.
- **Contrast:**
  - Text must reach 4.5:1 and UI parts 3:1.
  - Small accent text on a tint uses `--ucd-accent-ink`.
  - White on `--ucd-accent` is fine for buttons.
- **Keyboard:** every interactive element can be reached with the keyboard and has a visible `:focus-visible` style. The FAQ also works with Enter and Space (a native `<button>` handles that).
- **Reduced motion:** with `prefers-reduced-motion: reduce` there is no reveal transform, no hero animation and no hover translate.
- **Links:** the link text describes the destination. There are no `href="#"` or `href=""` links.

## 7. Robustness and performance

- Use no libraries, no jQuery, no CDNs and no icon fonts. Font Awesome is on the site, but don't depend on it. The page needs no network requests beyond optional image URLs in CONTENT.
- Don't use scroll listeners. Use an IntersectionObserver for reveal and for pausing the hero.
- Animate only `transform` and `opacity`.
- Don't set fixed heights on anything that holds text. Let content define the height.
- **There is no horizontal scroll at any width down to 320px.** Use `overflow: clip` on any section that has decoration bleeding past its edges.
- Running the script twice must not duplicate anything.
- If one container is missing or one builder throws, every other section still builds.

## 8. `udc.html`: local preview harness

This file is for previewing locally and is not deployed. It is a full document with:
- `<!doctype html>`, `lang="en"`, the charset and viewport metas, and Figtree 400–700 from Google Fonts (the live site loads its own)
- `<link rel="stylesheet" href="udc.css">`
- a tiny inline `<style>` for preview only: `body { margin: 0; font-family: "Figtree", sans-serif; }`. **None of the page's real styles go here.**
- twelve mock containers in page order, one per section, of the form `<div class="e-con e-con-full ucd-hero"></div>`. Give two of them an inner `<div class="e-con-inner"></div>` so both host paths get exercised.
- a grey placeholder block after the FAQ labelled "Existing CTA component goes here"
- `<script src="udc.js"></script>`

At the top of the file, put an HTML comment with the **Elementor setup steps**:
1. Create 12 containers in the order of the table in §3. Set each one to Full Width, padding 0, no background, with its class in CSS Classes.
2. Put the existing CTA container after the FAQ, and paste Appendix B into its CONTENT block.
3. Load `udc.css` and `udc.js` the same way the other sections' files are loaded.

## 9. Don'ts

- **Don't change the copy.** The only edits allowed are these:
  - removing the "⚑" marker
  - capitalising the first letter of each loop-step description, now that each one stands on its own line (Appendix A has done this already)
  - wrapping existing words in `[[…]]` for the accent
  - splitting the "·" lists into arrays.

  The copy uses British spelling ("organisations", "prioritised", "behaviour"). Keep it as written.
- Don't build the final CTA.
- Don't invent statistics, customer names, logos, certifications, testimonials or "recommended" tags.
- Don't use font weights above 700, `!important` without a comment, global selectors, or any change outside `udc/`.
- Don't put an unescaped CONTENT string into `innerHTML` or `insertAdjacentHTML`.

## 10. Acceptance checklist

Open `udc/udc.html` in a browser and confirm each point.

- [ ] Every section renders at **1440, 1280, 1024, 820, 768, 390 and 360px**. At each width, `document.documentElement.scrollWidth === window.innerWidth`.
- [ ] With DevTools set to **reduced motion**, the content is visible immediately and nothing moves.
- [ ] Using only the **keyboard**, you can tab through the hero buttons, the solution links and every FAQ item. Focus is always visible, and the FAQ toggles with Enter and Space and updates `aria-expanded`.
- [ ] Deleting one mock container still builds the other 11, with no console errors.
- [ ] Calling the init twice (by re-running the script) adds no duplicates.
- [ ] The heading outline is one H1, twelve H2s and H3s inside them.
- [ ] Every string on the page matches Appendix A **character for character**, apart from the allowed edits in §9.
- [ ] Solution cards with an empty `href` are not links, and "Explore all five solutions" is hidden while its `href` is empty.
- [ ] The hero animation pauses when scrolled off screen (check with the Performance or Rendering panel).
- [ ] Contrast spot checks pass: the eyebrows on the tint, the chips, and the coverage pills.

Leave a `// TODO:` in CONTENT for every open item listed in Appendix A.

---

## Appendix A: copy, verbatim, shaped for CONTENT

```js
var CONTENT = {

  hero: {
    eyebrow: "Solution 01 · Unified Cyber Defense",
    title: "One platform. Unified defense. [[Autonomous.]]",
    lead: "AI-powered detection and response across your endpoints, network, cloud, identities and industrial systems, with security experts watching 24/7.",
    body: "CybrHawk UCD brings your security operation into one place: an AI SOC, SIEM and XDR, identity and OT protection, cloud detection, exposure management and AI agents, connected to the tools you already run.",
    tagline: "Detect. Defend. Respond. All in one.",
    cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
    // TODO: confirm the target for the architect button.
    ctaSecondary: { label: "Speak to a Security Architect", href: "https://cybrhawk.com/contact/" },
    proof: [
      "24/7 SOC and incident response",
      "AI plus human analysts",
      "IT, cloud, identity and OT in one view",
      "Broad integrations"
    ],
    // Labels come from the lead. image "" keeps the built-in illustration.
    visual: {
      core: "UCD",
      caption: "Unified Cyber Defense",
      nodes: [
        { icon: "endpoint", label: "Endpoints" },
        { icon: "network",  label: "Network" },
        { icon: "cloud",    label: "Cloud" },
        { icon: "identity", label: "Identity" },
        { icon: "ot",       label: "OT" }
      ],
      image: "",
      imageAlt: ""
    }
  },

  trust: {
    label: "Certifications and assurance",   // aria-label only, not shown
    // image: optional badge artwork URL; "" uses the icon.
    items: [
      { icon: "shield-check", label: "SOC 2 Type II", image: "" },
      { icon: "award",        label: "ISO-certified", image: "" },
      { icon: "file-check",   label: "HIPAA-compliant", image: "" },
      { icon: "lock",         label: "ITAR-certified", image: "" },
      { icon: "crosshair",    label: "Independently penetration tested", image: "" }
    ]
  },

  problem: {
    eyebrow: "The enterprise problem",
    title: "Complexity is the attacker's advantage.",
    intro: "Large organisations rarely lack security tools. They lack one trustworthy picture. Endpoint, network, cloud, identity and operational-technology alerts sit in separate consoles, owned by separate teams, escalated on separate clocks. Attackers cross all of those boundaries in one campaign. Defenders often can't.",
    // lead is set in <strong>; lead + " " + text is the original sentence.
    points: [
      { icon: "hourglass", lead: "Dwell time grows", text: "when weak signals in different tools never become one story." },
      { icon: "alerts",    lead: "Analysts drown",   text: "in alerts instead of hunting." },
      { icon: "timer",     lead: "Regulatory clocks run in hours and days.", text: "If you can't scope an incident quickly, you can't report it credibly." }
    ],
    resolution: {
      lead: "UCD removes the seams.",
      text: "Telemetry from every layer is collected, correlated and acted on in one place, by AI and by accountable experts."
    }
  },

  capabilities: {
    eyebrow: "What's inside UCD",
    title: "Eight capabilities. [[One defense.]]",
    // Numbered 01–08 from the array order. full: "" hides the expanded name.
    items: [
      {
        slug: "ai-soc", icon: "soc", title: "AI SOC", full: "",
        text: "An autonomous SOC that pairs AI-driven triage with human analysts, running 24×7×365. Alerts are investigated and prioritised automatically; analysts and threat hunters handle what needs judgement. A customer portal gives you cases, evidence and approvals in one place, and executive dashboards track detection and response times, monitoring coverage and risk by business unit."
      },
      {
        slug: "siem-xdr", icon: "layers", title: "SIEM / XDR", full: "",
        text: "A cloud-native extended detection and response platform that ingests and correlates data from endpoints, servers, firewalls, applications, SaaS platforms and user activity, structured and unstructured. Behaviour-based anomaly detection, machine learning and threat intelligence drive automatic scoring and triage. Rules, dashboards and playbooks are customisable, and reporting supports NIST, HIPAA and GDPR requirements. Network detection and response (NDR) sensors extend visibility to traffic that endpoint tools never see."
      },
      {
        slug: "itdr", icon: "identity", title: "ITDR", full: "Identity Threat Detection & Response",
        text: "Identity is the main attack path. UCD baselines normal behaviour across cloud, hybrid and on-premises environments and flags deviation: credential stuffing and brute force, impossible travel, session hijacking and token replay, privilege escalation, MFA fatigue and bypass. Every identity carries a dynamic risk score, and responses can be automatic: end sessions, suspend accounts, force credential resets or require step-up authentication. Privileged access monitoring adds extra scrutiny to your most powerful accounts."
      },
      {
        slug: "ot-security", icon: "factory", title: "OT Security", full: "",
        text: "A dedicated OT SOC for industrial environments, covering PLCs, SCADA, HMIs, engineering workstations and the networks that connect them. Behavioural analytics with industrial context, continuous asset and traffic visibility, and triage that ranks alerts by operational impact, not just technical severity."
      },
      {
        slug: "cdr", icon: "cloud-shield", title: "CDR", full: "Cloud Detection & Response",
        text: "Continuous monitoring of cloud workloads and cloud-delivered services, correlated with identity, endpoint and network activity. Microsoft 365 and Entra ID monitoring are supported through CybrHawk's endpoint and cloud integrations."
      },
      {
        slug: "exposure-management", icon: "crosshair", title: "Exposure Management", full: "",
        text: "Know what an attacker can reach and fix what matters first. UCD aggregates findings from scanners, penetration tests and threat intelligence, prioritises them by severity, exploitability and asset value, plans remediation step by step, and validates fixes by retesting. Your team can run it, or CybrHawk can work alongside you or remediate directly."
      },
      {
        slug: "ai-agents", icon: "bot", title: "AI Agents", full: "",
        text: "Automation that does the repetitive work. Once a threat is validated, predefined playbooks run automatically: isolate affected assets, block malicious IPs and domains, notify teams through chat or ticketing tools, and open the investigation, with human approval wherever you want it."
      },
      {
        slug: "integrations", icon: "plug", title: "Broad Integrations", full: "",
        text: "UCD is vendor-agnostic. It connects to the security and IT tooling you already have, including SIEM and SOAR systems, rather than demanding a rip-and-replace."
      }
    ]
  },

  how: {
    eyebrow: "How UCD works",
    title: "One continuous loop, from telemetry to [[contained incident.]]",
    // First letters capitalised now that each step stands alone (the only edit).
    steps: [
      { icon: "radar",      title: "Sense",     text: "Collect and normalise telemetry from every layer, plus external threat intelligence." },
      { icon: "link",       title: "Correlate", text: "Link weak signals across layers into scored, high-confidence incidents." },
      { icon: "decide",     title: "Decide",    text: "AI clears the noise; analysts investigate what matters with full context." },
      { icon: "bolt",       title: "Act",       text: "Playbooks contain the threat, with human approval where required." },
      { icon: "file-check", title: "Prove",     text: "Root-cause analysis, timeline and recommendations after every incident, plus dashboards and compliance scorecards." }
    ]
  },

  outcomes: {
    eyebrow: "What you get",
    title: "See everything. Detect early. Respond fast. [[Stay resilient.]]",
    items: [
      { icon: "eye",            title: "See everything.", text: "IT, cloud, identity and industrial systems in one view, with no blind spots between teams." },
      { icon: "pulse",          title: "Detect early.",   text: "Behavioural analytics and correlation surface the weak signals that become breaches." },
      { icon: "bolt",           title: "Respond fast.",   text: "Automated playbooks and 24/7 analysts contain threats while they're still small." },
      { icon: "shield-refresh", title: "Stay resilient.", text: "Root-cause reviews and hardening recommendations keep each incident from repeating." }
    ],
    quote: "Protect critical infrastructure. Preserve operational continuity."
  },

  socModels: {
    eyebrow: "",
    title: "Choose your SOC model",
    labels: { how: "How it works", coverage: "Coverage", bestFor: "Best for" },
    models: [
      { name: "Virtual SOC", how: "Analysts engage when a critical alert or incident occurs", coverage: "On demand", bestFor: "Teams needing expert backup" },
      { name: "Co-managed SOC", how: "Semi-dedicated CybrHawk analysts work alongside your team", coverage: "8×5", bestFor: "Organisations with a daytime security team" },
      { name: "Dedicated SOC", how: "Dedicated staff and technology aligned to your organisation", coverage: "24/7", bestFor: "Enterprises needing a private, always-on capability" },
      { name: "Fusion SOC", how: "Threat intelligence, incident response and OT security operate together", coverage: "24/7", bestFor: "Complex, regulated or industrial environments" },
      { name: "Autonomous SOC & Command Center", how: "AI triage with human analysts, customer portal, executive dashboards", coverage: "24×7×365", bestFor: "Scale without growing headcount" }
    ]
  },

  nist: {
    eyebrow: "",
    title: "Mapped to NIST CSF 2.0",
    functions: [
      { code: "GV", name: "Govern",   capabilities: ["Executive dashboards", "compliance scorecards", "risk by business unit"] },
      { code: "ID", name: "Identify", capabilities: ["Exposure management", "OT asset visibility", "cloud and identity inventory"] },
      { code: "PR", name: "Protect",  capabilities: ["ITDR controls", "privileged access monitoring", "remediation and validation"] },
      { code: "DE", name: "Detect",   capabilities: ["SIEM / XDR", "NDR", "CDR", "ITDR", "OT SOC", "24/7 AI SOC"] },
      { code: "RS", name: "Respond",  capabilities: ["AI Agents playbooks", "analyst-led containment", "incident response"] },
      { code: "RC", name: "Recover",  capabilities: ["Root-cause analysis", "hardening recommendations", "guided recovery"] }
    ]
    // Lower-case chips are as written. You may capitalise the first letter in CSS (::first-letter) for consistency; don't change the source text.
  },

  regulatory: {
    eyebrow: "",
    title: "Built for the regulatory clock",
    columns: ["Regime", "Applies to", "Key timelines"],
    // [[…]] only highlights; the wording is legal copy, so keep it exact.
    rows: [
      { regime: "SEC Form 8-K, Item 1.05", appliesTo: "US public companies",
        timelines: "Within [[four business days]] of determining an incident is material" },
      { regime: "NIS2 (EU)", appliesTo: "Essential and important entities",
        timelines: "Early warning within [[24 hours]]; notification at [[72 hours]]; final report within [[one month]]" },
      { regime: "DORA (EU)", appliesTo: "Financial entities",
        timelines: "Initial notice within [[4 hours]] of classifying a major incident, and no later than [[24 hours]] after awareness; intermediate report within [[72 hours]]; final report within [[one month]]" }
    ],
    note: {
      text: "Fast scoping, forensic evidence and a defensible audit trail give your legal, risk and executive teams the facts they need.",
      strong: "Obligations remain yours; UCD helps you meet the clock."
    }
  },

  industries: {
    eyebrow: "",
    title: "Industries we serve",
    items: [
      { icon: "factory",    label: "Manufacturing" },
      { icon: "derrick",    label: "Oil & Gas" },
      { icon: "pylon",      label: "Utilities" },
      { icon: "droplet",    label: "Water" },
      { icon: "bolt",       label: "Power Generation" },
      { icon: "truck",      label: "Transportation" },
      { icon: "medical",    label: "Healthcare" },
      { icon: "city",       label: "Smart Cities" },
      { icon: "bank",       label: "Government" },
      { icon: "coins",      label: "Financial Services" },
      { icon: "graduation", label: "Education" }
    ],
    more: "And more"
  },

  solutions: {
    eyebrow: "Part of CybrHawk's five solutions",
    title: "UCD is the core. [[Four more extend it.]]",
    hub: { icon: "shield", num: "01", name: "UCD", caption: "Unified Cyber Defense" },
    // href "" renders the card as a non-link.
    items: [
      { icon: "globe", num: "02", name: "HawkINT",
        focus: "Threat intelligence: dark web, credential exposure, brand monitoring, takedowns",
        tagline: "Know the threat before it reaches you.",
        href: "https://cybrhawk.com/ai-powered-threat-intelligence-platform/" },
      { icon: "crosshair", num: "03", name: "HawkStrike",
        focus: "Offensive security: autonomous pen testing, continuous testing, red team",
        tagline: "Think like an attacker. Strike before they do.",
        href: "" },   // TODO: HawkStrike page URL
      { icon: "dashboard", num: "04", name: "HawkOps",
        focus: "Enterprise operations intelligence: AI agents, workflow and decision intelligence",
        tagline: "Turn enterprise operations into actionable intelligence.",
        href: "https://cybrhawk.com/enterprise-operations-intelligence/" },
      { icon: "headset", num: "05", name: "Cybersecurity Services",
        focus: "24/7 managed SOC, incident response and forensics, assessments, compliance readiness",
        tagline: "Expertise when and where your organisation needs it.",
        href: "" }    // TODO: Cybersecurity Services page URL
    ],
    link: { label: "Explore all five solutions", href: "" }   // TODO: URL; hidden while ""
  },

  faq: {
    eyebrow: "",
    title: "FAQ",
    items: [
      { q: "Do we have to replace our existing tools?",
        a: "No. UCD is vendor-agnostic and integrates with existing tooling." },
      { q: "Can you cover OT and industrial systems, not just IT?",
        a: "Yes. A dedicated OT SOC monitors industrial environments with operational-impact triage, alongside IT and cloud." },
      // TODO: flagged (⚑) for review in the copy doc. Confirm before launch.
      { q: "How does AI fit in, and who stays in control?",
        a: "AI handles triage, correlation and playbook execution. Analysts review what matters, and the customer portal gives you approvals and a full record of actions." },
      { q: "Can we keep control of our own SOC?",
        a: "Yes. Choose a co-managed model, or run the platform yourselves and call on CybrHawk for guidance and escalation." },
      { q: "What happens during an active incident?",
        a: "CybrHawk's incident response team engages around the clock, contains the threat, runs forensics with documented evidence handling, eradicates persistence, and delivers a root-cause report." },
      { q: "Where do we start?",
        a: "A posture assessment and a live walkthrough tailored to your environment." }
    ]
  }
};
```

## Appendix B: copy for the existing CTA component (don't build it here)

This maps onto the CONTENT block in `walkthrough-cta.js`:

```js
var TITLE = "See your whole attack surface. [[Defend it as one.]]";
var LEAD = "Book a demo and we'll map your exposure across identity, endpoint, network, cloud and OT, and show how UCD closes the gaps.";
var CLOSER = "";
var CTA = { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" };
var CTA_SECONDARY = { label: "Contact CybrHawk", href: "https://cybrhawk.com/contact/" };
```
