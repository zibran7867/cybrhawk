/* =====================================================================
   HawkINT / CybrHawk - page script (single bundle)
   =====================================================================
   "HawkINT Operations Console" - a dark threat-intelligence operator
   surface. The Elementor containers are fixed, so each section below
   injects its own markup into the container matched by its SECTION
   selector and pairs with hawk-int.css.

   The file is a set of independent IIFEs - one per section - sharing a
   few helpers (esc, markup, reveal, waitForSection, countUp, icon).

   Element prefix is `hk-<section>__…`; the fixed Elementor container
   classes are `.hawk-<section>`. Each SECTION const is the only page
   selector its block touches; change it if the live container class
   differs. To split this into per-section files later, lift each IIFE
   plus the shared helpers it calls.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     Shared helpers  (design-agnostic - kept across the rebuild)
     =================================================================== */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  // Escape first, then promote [[…]] runs to an accent span. Used by the
  // hero title so a bracketed phrase can be coloured without hand-written
  // HTML in CONTENT; the text is still escaped, so it stays injection-safe.
  function markup(s) {
    return esc(s).replace(/\[\[(.+?)\]\]/g, function (_, run) {
      return '<span class="hk-hero__accent">' + run + "</span>";
    });
  }

  function hostFor(section) {
    return (
      document.querySelector(section + " .e-con-inner") ||
      document.querySelector(section)
    );
  }

  // Run build() now; if the container isn't in the DOM yet, watch for it.
  function waitForSection(build) {
    if (build()) return;
    var obs = new MutationObserver(function () {
      if (build()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      obs.disconnect();
    }, 10000);
  }

  // Fade/rise a built root in when it scrolls into view.
  function reveal(root) {
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      root.classList.add("is-visible");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          root.classList.add("is-visible");
          io.disconnect();
        });
      },
      { threshold: 0.18 }
    );
    io.observe(root);
  }

  function prefersReduced() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // Fire cb once, the first time el scrolls into view (or immediately if
  // IntersectionObserver is unavailable).
  function onReveal(el, cb, threshold) {
    if (!("IntersectionObserver" in window)) {
      cb();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cb();
          io.disconnect();
        });
      },
      { threshold: threshold || 0.35 }
    );
    io.observe(el);
  }

  /* ---- Count-up ---------------------------------------------------------
     Splits a figure like "12,000", "20M" or "100B" into a numeric target
     and a suffix, then tweens the number up. Thousands separators and the
     M/B/K suffix are preserved so the final frame matches the source. */
  function parseFigure(str) {
    var m = String(str).match(/^([\d.,]+)\s*([A-Za-z]*)$/);
    if (!m) return null;
    var num = parseFloat(m[1].replace(/,/g, ""));
    if (isNaN(num)) return null;
    var grouped = m[1].indexOf(",") !== -1;
    return { target: num, scale: m[2], grouped: grouped };
  }

  function formatFigure(val, fig) {
    var rounded =
      fig.target % 1 === 0 ? Math.round(val) : Math.round(val * 10) / 10;
    var out = fig.grouped
      ? rounded.toLocaleString("en-US")
      : String(rounded);
    return out + fig.scale;
  }

  function countUp(node, raw) {
    var fig = parseFigure(raw);
    if (!fig || prefersReduced()) {
      node.textContent = raw;
      return;
    }
    var DURATION = 1600;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      // easeOutExpo for a quick, settling climb.
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      node.textContent = formatFigure(fig.target * eased, fig);
      if (p < 1) requestAnimationFrame(frame);
      else node.textContent = raw; // exact source on the final frame
    }
    requestAnimationFrame(frame);
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* -------------------------------------------------------------------
     Shared icon set (keyed by name; referenced across sections).
     All 24x24, stroke-width 1.9, currentColor, aria-hidden (unless
     intentionally filled). Extend here in the same stroke style.
     ------------------------------------------------------------------- */
  var ICONS = {
    /* About */
    hawk:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2.4 3.4 6v5.2c0 4.9 3.4 8.9 8.6 10.4 5.2-1.5 8.6-5.5 ' +
      '8.6-10.4V6L12 2.4zm0 2.2 6.4 2.7v4.3c0 3.8-2.6 6.9-6.4 8.2-3.8-1.3' +
      '-6.4-4.4-6.4-8.2V7.3L12 4.6z"/>' +
      '<path d="M12 7.2 8.4 12h2.4v4.4L15.6 11h-2.4V7.2z"/>' +
      "</svg>",
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 3 7.6 7 8.8 4-1.2 ' +
      '7-4.5 7-8.8V6l-7-3z"/><path d="m9 12 2 2 4-4.5"/></svg>',

    /* Numbers */
    bot:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="4.5" y="8" width="15" height="11" ' +
      'rx="3"/><path d="M12 8V4.8"/><circle cx="12" cy="3.4" r="1.3"/>' +
      '<circle cx="9" cy="13.2" r="1.2" fill="currentColor"/>' +
      '<circle cx="15" cy="13.2" r="1.2" fill="currentColor"/>' +
      '<path d="M2.6 12.5v2M21.4 12.5v2"/></svg>',
    sources:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M4 7c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8' +
      '-3-8 1.3-8 3z"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/>' +
      '<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
    pulse:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M2.5 12h4l2.5-6 4 13 2.5-7h6"/></svg>',
    wire:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M3 5h18M3 12h12M3 19h8"/>' +
      '<circle cx="19" cy="15.5" r="3.2"/><path d="m21.4 17.9 2 2"/></svg>',
    actor:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c0' +
      '-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>',
    report:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 ' +
      '2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 ' +
      '17h4"/></svg>',
    card:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" ' +
      'rx="2.5"/><path d="M3 9.5h18M6.5 14.5h4"/></svg>',
    key:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="8" cy="8" r="4.2"/><path d="m11 11 ' +
      '9 9M17 17l2-2M15 15l2-2"/></svg>',

    /* How it works / layers */
    surface:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18' +
      'M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.6-3.8-9S' +
      '9.5 5.4 12 3z"/></svg>',
    deep:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M12 3v4M12 3 8.5 6M12 3l3.5 3"/>' +
      '<path d="M4 9c2.5 1.6 5.2 2.4 8 2.4S17.5 10.6 20 9"/>' +
      '<path d="M4 14c2.5 1.6 5.2 2.4 8 2.4S17.5 15.6 20 14"/>' +
      '<path d="M4 9v9M20 9v9M4 18c2.5 1.6 5.2 2.4 8 2.4s5.5-.8 8-2.4"/>' +
      "</svg>",
    dark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 ' +
      '20 14.5z"/></svg>',

    /* Industries */
    bank:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M3 9.5 12 4l9 5.5"/><path d="M4.5 9.5v8' +
      'M9 9.5v8M15 9.5v8M19.5 9.5v8"/><path d="M3 20.5h18"/></svg>',
    health:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M12 20.5C7 17 3.5 13.8 3.5 9.8 3.5 7 5.6' +
      ' 5 8 5c1.6 0 3.1.9 4 2.3C12.9 5.9 14.4 5 16 5c2.4 0 4.5 2 4.5 4.8 0 ' +
      '4-3.5 7.2-8.5 10.7z"/><path d="M8 11h2l1 2 1.5-3 1 1h2.5"/></svg>',
    gov:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M3 20.5h18M4.5 20.5V10M19.5 20.5V10' +
      'M9 20.5V10M15 20.5V10"/><path d="M3 10 12 4l9 6z"/></svg>',
    cart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M3 4h2l2.2 11.3a1.6 1.6 0 0 0 1.6 1.3h8' +
      'a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/><circle cx="9.5" cy="20" r="1.3"/>' +
      '<circle cx="17.5" cy="20" r="1.3"/></svg>',
    energy:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M13.2 2 4.5 13.4h5.6L9 22l9-12h-5.6z"/></svg>',
    chip:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="7" y="7" width="10" height="10" ' +
      'rx="2"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3' +
      'M2.5 14h3M18.5 10h3M18.5 14h3"/></svg>',

    /* Features */
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="11" cy="11" r="6.4"/><path d="m16 16 ' +
      '4.5 4.5"/></svg>',
    profiles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c0' +
      '-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17.5" cy="9.5" r="2.4"/>' +
      '<path d="M15.5 19c0-2.6 1.4-4.5 3.5-5"/></svg>',
    mask:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M3.5 6c3 .8 5.6.8 8.5 0 2.9.8 5.5.8 ' +
      '8.5 0v6c0 4-3.8 7-8.5 8-4.7-1-8.5-4-8.5-8V6z"/><path d="M8.5 11.5c.9' +
      ' .9 2 .9 2.9 0M12.6 11.5c.9.9 2 .9 2.9 0"/></svg>',
    "link-alert":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M9.5 13.5 14 9M10 7.5 11.6 6a3.8 3.8 0 ' +
      '0 1 5.4 5.4L15.4 13"/><path d="M13.5 16 12 17.5a3.8 3.8 0 0 1-5.4' +
      '-5.4L8 10.6"/><path d="M19 15v3M19 20.5v.1"/></svg>',
    bell:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4' +
      'c.5-1 2-2.5 2-6.5z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    ransom:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" ' +
      'rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/><path d="M12 14v2.5"/>' +
      "</svg>",
    vip:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M12 3.5 14 8l4.8.5-3.6 3.2 1.1 4.8L12 ' +
      '13.9 7.7 16.5l1.1-4.8L5.2 8.5 10 8z"/></svg>',

    /* Enrichment */
    ocr:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" ' +
      'rx="2.5"/><path d="M3.5 15 8 11l3 2.5L15 9l5.5 5"/>' +
      '<circle cx="9" cy="9" r="1.4"/></svg>',
    media:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" ' +
      'rx="2.5"/><path d="M10 9.5v5l4-2.5z"/></svg>',
    rank:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M22 4v16"/>' +
      "</svg>",
    classify:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M4 7h16M4 12h10M4 17h7"/>' +
      '<circle cx="18.5" cy="15.5" r="2.6"/><path d="m20.4 17.4 1.6 1.6"/>' +
      "</svg>",

    /* Takedown */
    page:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 ' +
      '2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 12 6 6M15 ' +
      '12l-6 6"/></svg>',
    app:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" ' +
      'rx="2.5"/><path d="M10.5 18.5h3"/><path d="m8.5 6.5 7 7M15.5 6.5l-7 ' +
      '7"/></svg>',
    malware:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><rect x="7" y="9" width="10" height="8" ' +
      'rx="3"/><path d="M4 11.5h3M17 11.5h3M4.5 7l2.5 2M19.5 7 17 9M9 9V6' +
      'M15 9V6"/><path d="M10 13h.01M14 13h.01"/></svg>',

    /* Generic glyphs */
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    evidence:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M9 3h6l1 3H8z"/><path d="M8 6v13a2 2 0 ' +
      '0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11h4"/></svg>',
    context:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5' +
      'M12 8h.01"/></svg>',
    recommend:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 ' +
      '0 1 4 10.5c-.7.7-1 1.4-1 2.5H9c0-1.1-.3-1.8-1-2.5A6 6 0 0 1 12 3z"/>' +
      "</svg>"
  };

  function icon(name) {
    return ICONS[name] || ICONS.shield;
  }

  /* -------------------------------------------------------------------
     A console "module header": a monospace MOD tag with a blue tick,
     the H2, and an optional lead. Shared markup so every section opens
     like a panel (brief §6.1). `tag` is the opening HTML tag for the
     heading ("h2" everywhere but the hero).
     ------------------------------------------------------------------- */
  function moduleHead(prefix, mod, title, lead, headingTag) {
    var h = headingTag || "h2";
    return (
      '<header class="' + prefix + '__head">' +
        '<p class="' + prefix + '__mod">' +
          '<span class="' + prefix + '__tick" aria-hidden="true"></span>' +
          '<span>' + esc(mod) + "</span>" +
        "</p>" +
        "<" + h + ' class="' + prefix + '__title">' + esc(title) + "</" + h + ">" +
        (lead ? '<p class="' + prefix + '__lead">' + esc(lead) + "</p>" : "") +
      "</header>"
    );
  }

  /* ===================================================================
     0. Hero  -  container .hawk-hero  -  prefix hk-hero
     The page's only <h1>. Copy on the left; a coded "surface / deep /
     dark web" monitoring console on the right (no image required).
     =================================================================== */
  (function () {
    var SECTION = ".hawk-hero";

    /* ---- Content (edit freely) ---- */
    var MOD = "THREAT INTELLIGENCE";
    // TODO: confirm the eyebrow label with marketing.
    var EYEBROW = "HawkINT · AI-Powered Threat Intelligence by CybrHawk";

    // The bracketed phrase renders in the accent. Wording is fixed.
    var TITLE =
      "Intelligence that sees threats coming and [[stops them before they land]]";

    var LEAD =
      "HawkINT combines applied AI with CybrHawk's analyst expertise to watch " +
      "the surface, deep and dark web for you. Spot leaked credentials, " +
      "phishing, brand abuse, ransomware chatter and executive exposure early " +
      "then act with evidence, context and takedowns.";

    var BODY =
      "Protecting your operations, data, reputation, supply chain and " +
      "leadership - 24/7.";

    var CTA  = { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" };
    // TODO: confirm the secondary button target.
    var CTA2 = { label: "Get a Free Exposure Check", href: "https://cybrhawk.com/contact/" };

    // Each is a fact stated elsewhere on the page - no new claims. The
    // mono label is the telemetry readout; the plain text is the proof.
    var PROOF = [
      { label: "COVERAGE", text: "Surface, deep & dark web" },
      { label: "BOTS",     text: "12,000+ specialized bots" },
      { label: "SOURCES",  text: "380+ data sources" },
      { label: "ACTION",   text: "Detect, enrich & take down" }
    ];

    // Coded console labels. image "" keeps the built-in illustration;
    // set a URL to show that image instead, falling back to the drawing.
    var VISUAL = {
      core: "HawkINT",
      caption: "Monitoring, 24/7",
      layers: [
        { icon: "surface", label: "Surface web", code: "L01" },
        { icon: "deep",    label: "Deep web",    code: "L02" },
        { icon: "dark",    label: "Dark web",    code: "L03" }
      ],
      image: "",
      imageAlt: ""
    };

    var ANIMATE = true;
    // Signals/scan/pulse in the console; paused off screen and in a
    // background tab, never run under reduced motion.
    var HERO_MOTION = true;
    /* -------------------------------- */

    // Signal geometry in the SVG's 0–100 space. The three bands run down
    // the left: BAND_Y are their vertical centres and BANDS_X their right
    // edge; CORE is the badge they converge on. Kept in sync with the
    // bands column width in hawk-int.css.
    var BANDS_X = 57;
    var BAND_Y = [21, 50, 79];
    var CORE = { x: 80, y: 50 };

    function round(n) {
      return Math.round(n * 100) / 100;
    }

    // No href, no button: an empty or "#" link would only reload the page.
    function button(b, ghost) {
      if (!b || !b.label || !b.href) return "";
      return (
        '<a class="hk-hero__btn' + (ghost ? " hk-hero__btn--ghost" : "") +
          '" href="' + esc(b.href) + '">' +
          "<span>" + esc(b.label) + "</span>" + icon("arrow") +
        "</a>"
      );
    }

    // The coded console: three web-layer bands feeding one core. The
    // connectors and the travelling dots share a single 0–100 viewBox;
    // the bands and core are HTML on top, so their labels never shrink
    // with the drawing. The whole stage is aria-hidden - the copy carries
    // the meaning.
    function heroStage(v) {
      var layers = v.layers || [];
      var lines = "";
      var signals = "";
      var bands = "";

      layers.forEach(function (l, i) {
        var y = BAND_Y[i] != null ? BAND_Y[i] : 50;
        var dur = 2.8 + i * 0.4;        // 2.8 / 3.2 / 3.6s - none in step

        // A gently sagging quadratic curve from the band into the core, so
        // no connector reads as a stark straight line (the middle one
        // included). Control point: the segment midpoint, bowed down.
        var cx = round((BANDS_X + CORE.x) / 2);
        var cy = round((y + CORE.y) / 2 + 7);
        var d =
          "M" + BANDS_X + "," + y + " Q" + cx + "," + cy + " " +
          CORE.x + "," + CORE.y;

        lines += '<path class="hk-hero__line" d="' + d + '"/>';

        // The dot rides the same curve via offset-path (cx/cy are 0 so the
        // offset positions it). Where offset-path is unsupported the dot
        // stays hidden - the curves still carry the connection.
        signals +=
          '<circle class="hk-hero__signal" cx="0" cy="0" r="1.1" ' +
            "style=\"offset-path:path('" + d + "');--d:" + round(dur) +
            "s;--delay:-" + round(i * 0.7) + 's"/>';

        bands +=
          '<div class="hk-hero__band hk-hero__band--' + i + '">' +
            '<span class="hk-hero__band-icon">' + icon(l.icon) + "</span>" +
            '<span class="hk-hero__band-copy">' +
              '<span class="hk-hero__band-code">' + esc(l.code || "") + "</span>" +
              '<span class="hk-hero__band-label">' + esc(l.label) + "</span>" +
            "</span>" +
            '<span class="hk-hero__band-dots">' +
              '<span class="hk-hero__band-dot"></span>' +
              '<span class="hk-hero__band-dot"></span>' +
            "</span>" +
          "</div>";
      });

      return (
        '<div class="hk-hero__stage" aria-hidden="true">' +
          '<div class="hk-hero__chrome">' +
            '<span class="hk-hero__chrome-dots"><i></i><i></i><i></i></span>' +
            '<span class="hk-hero__chrome-title">THREAT MAP · LIVE</span>' +
            '<span class="hk-hero__chrome-live"><span></span>Live</span>' +
          "</div>" +
          '<div class="hk-hero__screen">' +
            '<svg class="hk-hero__links" viewBox="0 0 100 100" ' +
              'preserveAspectRatio="none" focusable="false" ' +
              'aria-hidden="true">' +
              "<g>" + lines + "</g>" +
              "<g>" + signals + "</g>" +
            "</svg>" +
            '<div class="hk-hero__bands">' + bands + "</div>" +
            '<span class="hk-hero__scan"></span>' +
            '<div class="hk-hero__core">' +
              '<span class="hk-hero__core-pulse"></span>' +
              '<span class="hk-hero__core-icon">' + icon("hawk") + "</span>" +
              '<span class="hk-hero__core-name">' + esc(v.core) + "</span>" +
              (v.caption
                ? '<span class="hk-hero__core-caption">' + esc(v.caption) + "</span>"
                : "") +
            "</div>" +
            '<span class="hk-hero__bracket hk-hero__bracket--tl"></span>' +
            '<span class="hk-hero__bracket hk-hero__bracket--tr"></span>' +
            '<span class="hk-hero__bracket hk-hero__bracket--bl"></span>' +
            '<span class="hk-hero__bracket hk-hero__bracket--br"></span>' +
          "</div>" +
        "</div>"
      );
    }

    // Run the console's motion only while it is on screen and the tab is
    // in front. Reduced motion is handled in CSS (which also catches the
    // preference flipping after load), so this only toggles pausing.
    function heroMotion(stage) {
      if (!HERO_MOTION || !stage) return;
      var onScreen = true;
      function sync() {
        stage.classList.toggle("is-paused", !onScreen || document.hidden);
      }
      stage.classList.add("is-moving");
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[entries.length - 1].isIntersecting;
          sync();
        }).observe(stage);
      }
      document.addEventListener("visibilitychange", sync);
      sync();
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-hero")) return true;

      var proof = PROOF.map(function (p, i) {
        return (
          '<li class="hk-hero__proof-item" style="--i:' + (i + 7) + '">' +
            '<span class="hk-hero__check">' + icon("check") + "</span>" +
            '<span class="hk-hero__proof-copy">' +
              '<span class="hk-hero__proof-label">' + esc(p.label) + "</span>" +
              '<span class="hk-hero__proof-text">' + esc(p.text) + "</span>" +
            "</span>" +
          "</li>"
        );
      }).join("");

      // An editor-supplied image replaces the console; it is real content
      // then, so it keeps its alt and drops the aria-hidden.
      var visual = VISUAL.image
        ? '<figure class="hk-hero__media">' +
            '<img class="hk-hero__img" src="' + esc(VISUAL.image) + '" alt="' +
              esc(VISUAL.imageAlt || "") + '" decoding="async">' +
          "</figure>"
        : heroStage(VISUAL);

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-hero' + (ANIMATE ? " is-animated" : "") + '">' +
          '<div class="hk-hero__grid-bg" aria-hidden="true"></div>' +
          '<div class="hk-hero__decor" aria-hidden="true">' +
            '<span class="hk-hero__orb"></span>' +
          "</div>" +
          '<div class="hk-hero__copy">' +
            '<p class="hk-hero__mod" style="--i:0">' +
              '<span class="hk-hero__tick" aria-hidden="true"></span>' +
              "<span>" + esc(MOD) + "</span>" +
            "</p>" +
            '<p class="hk-hero__eyebrow" style="--i:1">' + esc(EYEBROW) + "</p>" +
            '<h1 class="hk-hero__title" style="--i:2">' + markup(TITLE) + "</h1>" +
            '<p class="hk-hero__lead" style="--i:3">' + esc(LEAD) + "</p>" +
            '<p class="hk-hero__body" style="--i:4">' + esc(BODY) + "</p>" +
            '<div class="hk-hero__buttons" style="--i:5">' +
              button(CTA, false) + button(CTA2, true) +
            "</div>" +
            '<ul class="hk-hero__proof">' + proof + "</ul>" +
          "</div>" +
          '<div class="hk-hero__visual" style="--i:4">' + visual + "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-hero");
      if (ANIMATE) reveal(root);

      // A supplied image that fails to load falls back to the coded
      // console, as the About / Enrichment images do.
      var img = root.querySelector(".hk-hero__img");
      if (img) {
        img.addEventListener("error", function () {
          var fig = root.querySelector(".hk-hero__media");
          if (!fig) return;
          fig.insertAdjacentHTML("afterend", heroStage(VISUAL));
          fig.parentNode.removeChild(fig);
          heroMotion(root.querySelector(".hk-hero__stage"));
        });
      } else {
        heroMotion(root.querySelector(".hk-hero__stage"));
      }
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     1. About HawkINT  -  container .hawk-about  -  prefix hk-about
     =================================================================== */
  (function () {
    var SECTION = ".hawk-about";

    /* ---- Content (edit freely) ---- */
    var MOD = "OVERVIEW";
    var EYEBROW = "Overview";
    var TITLE =
      "One platform for every external threat you can't see from inside the " +
      "perimeter";
    // RAW by design - this BODY paragraph contains an intentional, author-
    // controlled <strong> (same documented esc() exception as the wires
    // section above). Keep any new wording here plain text - no user input
    // reaches it.
    var BODY = [
  "Most attacks start long before they hit your network: a password sold on a forum, a lookalike domain registered overnight, a fake executive profile, a ransomware group naming your supplier. HawkINT continuously collects and analyzes these signals, so your team learns about them first.",
  "Built as a SaaS OSINT and CTI platform, HawkINT turns millions of raw posts, files and conversations into prioritized alerts called <strong>wires</strong> each with evidence, context and a recommended action."
];
    // "What You Get" rendered as a console OUTPUTS readout: each benefit is
    // an output line with a mono index + a one-word value tag (the kind of
    // value), so the block reads like the section's intel panels rather than
    // a plain bullet list. Wording of label/text is fixed (brief §2).
    var BENEFITS_TITLE = "What You Get";
    var BENEFITS = [
      {
        tag: "SIGNAL",
        label: "Earlier Warning",
        text: "Detect leaks, fraud and attack planning before they become incidents."
      },
      {
        tag: "PRECISION",
        label: "Fewer False Positives",
        text: "AI ranks every event by severity and relevance to your assets."
      },
      {
        tag: "EVIDENCE",
        label: "Evidence You Can Act On",
        text: "See exactly where, when and in which file your data appeared."
      },
      {
        tag: "ACTION",
        label: "Action, Not Just Alerts",
        text: "Analyst-led takedowns of phishing sites, fake profiles and rogue apps."
      },
      {
        tag: "COMPLIANCE",
        label: "Audit-Ready Reporting",
        text: "Intelligence mapped to regulatory and board-level requirements."
      }
    ];

    // Supply a real image here; leave "" to show the branded fallback.
    var IMAGE = {
      src:
        "https://cybrhawk.com/wp-content/uploads/2025/12/" +
        "WhatsApp-Image-2025-12-01-at-15.44.09_86646dce-768x290.jpg",
      alt: "The HawkINT platform dashboard"
    };

    // Chrome shown around the image to make it read as a platform view.
    var CONSOLE_TITLE = "HawkINT · Platform";
    var CONSOLE_CAPTION = "Surface · Deep · Dark web - monitored in real time";

    var ANIMATE = true;
    /* -------------------------------- */

    function screenHTML() {
      if (IMAGE.src) {
        return (
          '<img class="hk-about__img" src="' + esc(IMAGE.src) + '" alt="' +
          esc(IMAGE.alt) + '" loading="lazy" decoding="async">'
        );
      }
      return (
        '<div class="hk-about__fallback" aria-hidden="true">' +
        '<span class="hk-about__mono">' + icon("hawk") + "</span>" +
        '<span class="hk-about__wordmark">Hawk<span>INT</span></span>' +
        "</div>"
      );
    }

    // The required image, framed as a HawkINT intel console (brief §6.4).
    function consoleHTML() {
      return (
        '<figure class="hk-about__console">' +
          '<div class="hk-about__bar">' +
            '<span class="hk-about__dots" aria-hidden="true">' +
              "<i></i><i></i><i></i></span>" +
            '<span class="hk-about__bar-title">' + esc(CONSOLE_TITLE) + "</span>" +
            '<span class="hk-about__live"><span class="hk-about__live-dot">' +
              "</span>Live</span>" +
          "</div>" +
          '<div class="hk-about__screen">' +
            screenHTML() +
            '<span class="hk-about__bracket hk-about__bracket--tl"></span>' +
            '<span class="hk-about__bracket hk-about__bracket--tr"></span>' +
            '<span class="hk-about__bracket hk-about__bracket--bl"></span>' +
            '<span class="hk-about__bracket hk-about__bracket--br"></span>' +
          "</div>" +
          '<figcaption class="hk-about__caption">' + icon("shield") +
            "<span>" + esc(CONSOLE_CAPTION) + "</span></figcaption>" +
        "</figure>"
      );
    }

    // The "What You Get" OUTPUTS panel: a full-width band under the grid with
    // a console readout header (mono title, live dot, output counter) over a
    // row of output cards. Each card carries a zero-padded index, a check node,
    // a mono value tag, the bold label and the body, with a hover glow that
    // lights it (same idiom as the How-it-works strata). All text via esc();
    // the glyph reuses the shared icon set. The reveal/motion is CSS-only and
    // already respects prefers-reduced-motion.
    function benefitsHTML() {
      var count = ("0" + BENEFITS.length).slice(-2);
      var rows = BENEFITS.map(function (b, i) {
        var idx = ("0" + (i + 1)).slice(-2);
        return (
          '<li class="hk-about__out" style="--i:' + i + '">' +
            '<span class="hk-about__out-glow" aria-hidden="true"></span>' +
            '<span class="hk-about__out-rail" aria-hidden="true">' +
              '<span class="hk-about__out-node">' + icon("check") + "</span>" +
            "</span>" +
            '<span class="hk-about__out-idx" aria-hidden="true">' + idx + "</span>" +
            '<span class="hk-about__out-copy">' +
              '<span class="hk-about__out-head">' +
                '<strong class="hk-about__out-label">' + esc(b.label) + "</strong>" +
                '<span class="hk-about__out-tag">' + esc(b.tag) + "</span>" +
              "</span>" +
              '<span class="hk-about__out-text">' + esc(b.text) + "</span>" +
            "</span>" +
          "</li>"
        );
      }).join("");
      return (
        '<div class="hk-about__outputs">' +
          '<div class="hk-about__outputs-bar">' +
            '<span class="hk-about__outputs-dot" aria-hidden="true"></span>' +
            '<span class="hk-about__outputs-title">' + esc(BENEFITS_TITLE) + "</span>" +
            '<span class="hk-about__outputs-count">OUTPUTS · ' + esc(count) + "</span>" +
          "</div>" +
          '<ul class="hk-about__out-list">' + rows + "</ul>" +
        "</div>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-about")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-about' + (ANIMATE ? " is-animated" : "") + '">' +
          '<div class="hk-about__grid">' +
            '<div class="hk-about__copy">' +
              '<p class="hk-about__mod">' +
                '<span class="hk-about__tick" aria-hidden="true"></span>' +
                "<span>" + esc(MOD) + "</span>" +
              "</p>" +
              '<p class="hk-about__eyebrow">' + esc(EYEBROW) + "</p>" +
              '<h2 class="hk-about__title">' + esc(TITLE) + "</h2>" +
              BODY.map(function (p) {
                // RAW by design - see the BODY comment above.
                return '<p class="hk-about__body">' + p + "</p>";
              }).join("") +
            "</div>" +
            '<div class="hk-about__media">' + consoleHTML() + "</div>" +
          "</div>" +
          // Full-width outputs band under the two-column grid.
          benefitsHTML() +
        "</div>"
      );
      var root = host.querySelector(".hk-about");
      if (ANIMATE) reveal(root);

      // If the supplied image fails, swap the screen for the branded
      // hawk + HawkINT fallback, inside the same console frame.
      var img = root.querySelector(".hk-about__img");
      if (img) {
        img.addEventListener("error", function () {
          var screen = root.querySelector(".hk-about__screen");
          if (!screen) return;
          img.outerHTML =
            '<div class="hk-about__fallback" aria-hidden="true">' +
            '<span class="hk-about__mono">' + icon("hawk") + "</span>" +
            '<span class="hk-about__wordmark">Hawk<span>INT</span></span>' +
            "</div>";
        });
      }
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     1.5 Product Modules  -  container .hawk-modules  -  prefix hk-modules
     Three module cards (CTI, Leak Intelligence, Compliance Guard) in one
     row; each is a full-height column so the CTAs align at the bottom.
     Sits between Overview (MOD 01) and In Numbers (MOD 02) in reading
     order; labelled MOD 01.5 to place it without renumbering the others.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-modules";

    /* ---- Content (edit freely) ---- */
    var MOD = "MODULES";
    var TITLE = "Three Modules. One Intelligence Engine.";
    var SUB =
      "Start with the protection you need today and add more as your " +
      "program grows. Every module shares the same data lake, AI models " +
      "and analyst team.";

    // Each module: small tag label, icon (shared ICONS), H3 title, a
    // description and a bullet list.
    var MODULES = [
      {
        tag: "Cyber Threat Intelligence Platform",
        icon: "search",
        title: "HawkINT CTI",
        desc:
          "Full-spectrum visibility across the surface, deep and dark web. " +
          "HawkINT CTI uncovers leaked credentials, exposed payment cards, " +
          "phishing campaigns and brand impersonation across underground " +
          "forums, ransomware leak sites, Telegram channels and criminal " +
          "marketplaces. React fast - or stay ahead of attacks, fraud and " +
          "hacktivism.",
        bullets: [
          "Credential and payment card leak detection",
          "Phishing and brand impersonation alerts",
          "Deep and dark web surveillance, including closed groups",
          "Ransomware group and leak-site tracking",
          "Proactive threat reports and actor profiles"
        ]
      },
      {
        tag: "Intelligent Leak Monitoring",
        icon: "evidence",
        title: "HawkINT Leak Intelligence",
        desc:
          "Know exactly what leaked, and where. Leak Intelligence gives you " +
          "early, evidence-grade visibility into exposed sensitive data - " +
          "pinpointing where, and in which file, your compromised " +
          "information was found, with secure access to the evidence. Your " +
          "team gets structured, reliable data to make fast, defensible " +
          "decisions.",
        bullets: [
          "Executive and VIP data exposure monitoring",
          "Source code, document and intellectual property leak detection",
          "Infostealer log and combolist analysis",
          "Corporate reputation monitoring",
          "Real-time exposure alerts with file-level evidence"
        ]
      },
      {
        tag: "Compliance Platform",
        icon: "shield",
        title: "HawkINT Compliance Guard",
        desc:
          "Regulators now expect cyber intelligence, not just controls. " +
          "Compliance Guard gives financial institutions, healthcare " +
          "providers and critical infrastructure operators documented " +
          "monitoring of the open web, deep web, dark web and private " +
          "groups - with reporting built for auditors.",
        bullets: [
          "Deep and dark web mention monitoring for your entities",
          "Compromised credential and third-party exposure tracking",
          "Audit-ready evidence logs and periodic attestation reports",
          "Supports frameworks such as DORA, NIS2, PCI DSS 4.0, HIPAA, " +
            "SEC cyber disclosure rules and RBI/SEBI cyber resilience " +
            "guidelines"
        ]
      }
    ];
    var ANIMATE = true;
    /* -------------------------------- */

    function bulletHTML(t) {
      return (
        '<li class="hk-modules__li">' +
          '<span class="hk-modules__li-ico" aria-hidden="true">' +
            icon("check") +
          "</span>" +
          "<span>" + esc(t) + "</span>" +
        "</li>"
      );
    }

    function cardHTML(m, i) {
      return (
        '<li class="hk-modules__card" style="--i:' + i + '">' +
          '<span class="hk-modules__tag">' + esc(m.tag) + "</span>" +
          '<span class="hk-modules__badge" aria-hidden="true">' +
            icon(m.icon) +
          "</span>" +
          '<h3 class="hk-modules__card-title">' + esc(m.title) + "</h3>" +
          '<p class="hk-modules__desc">' + esc(m.desc) + "</p>" +
          '<ul class="hk-modules__list">' +
            m.bullets.map(bulletHTML).join("") +
          "</ul>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-modules")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-modules' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-modules", MOD, TITLE, SUB) +
          '<ul class="hk-modules__grid">' +
            MODULES.map(cardHTML).join("") +
          "</ul>" +
        "</div>"
      );

      var root = host.querySelector(".hk-modules");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     2. HawkINT in Numbers  -  container .hawk-numbers  -  prefix hk-numbers
     A premium orbital infographic: a glowing 3-D shield rising off a
     layered circuit platform, inside faint elliptical orbit rings with a
     travelling signal arc. Eight figures ring the orbit, each wired to an
     inner-ring node; a dotted "signal wave" fills the lower corners. The
     centred header carries the single <h2>; the figures count up on
     reveal. Below 1024px the orbit is dropped for a centred shield above
     a clean metric grid.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-numbers";

    /* ---- Content (edit freely) ---- */
    var MOD = "IN NUMBERS";
    var TITLE = "Visibility at [[Internet Scale]]";   // bracketed phrase → accent
    var SUB = "Our collection engine never sleeps, so your team doesn't have to.";

    // Each figure: icon (shared ICONS), value + unit, caption, its place on
    // the stage, and which side it sits on.
    //   x    = the icon's SHIELD-FACING edge, 0–100 of the stage width
    //   y    = the metric's top, 0–100 of the stage height
    //   side = "left"  → mirror the row: figure reads out to the LEFT, icon
    //                    on the inner side (x is the icon's RIGHT edge)
    //          "right"/"bottom" → icon-left (x is the icon's LEFT edge)
    //   long = narrower figure · pulse = the node breathes
    // The ring node + connector are COMPUTED from x/y (see geom), so to move
    // a figure you only edit x/y - the wiring follows. The mobile grid
    // ignores x/y/side. Left and right are kept symmetric about x = 50.
    var STATS = [
      { icon: "bot",     value: "12,000",  unit: "+", text: "Collection bots",         side: "left",   x: 31.5, y: 25, pulse: true  },
      { icon: "sources", value: "380",     unit: "+", text: "Data sources",            side: "left",   x: 28,   y: 43, pulse: false },
      { icon: "pulse",   value: "20M",     unit: "+", text: "New Events Processed Daily",        side: "left",   x: 26,   y: 60, pulse: false },
      { icon: "wire",    value: "410,000", unit: "+", text: "Intelligence Wires Issued", long: true, side: "right", x: 68.5, y: 25, pulse: true },
      { icon: "actor",   value: "80M",     unit: "+", text: "Threat Actors Tracked Daily",     side: "right",  x: 72,   y: 43, pulse: true  },
      { icon: "report",  value: "8,000",   unit: "+", text: "Threat Reports Published",          side: "right",  x: 74,   y: 60, pulse: false },
      { icon: "card",    value: "64M",     unit: "+", text: "Recovered payment cards", side: "right",  x: 65.5,   y: 76, pulse: false },
      { icon: "key",     value: "100B",    unit: "+", text: "Recovered credentials",   side: "bottom", x: 36,   y: 85, pulse: true  }
    ];
    var ANIMATE = true;
    /* -------------------------------- */

    // ---- Orbit geometry (computed from each figure's x/y) ----
    var CX = 50, CY = 47;      // stage centre (matches the orbit rings)
    var IRX = 18, IRY = 21;    // inner-ring radii - where the nodes sit
    var ICON_HW = 2.9;         // icon half-width, % of stage width
    var ICON_VC = 6;           // icon centre below the metric top, % of height

    function round(n) { return Math.round(n * 100) / 100; }

    // For a figure, return its ring node {nx,ny} and the connector path that
    // bows from that node to the icon's shield-facing edge. Left figures put
    // the icon on the inner (right) side, so their edge sits at x - half.
    function geom(s) {
      var icx = s.side === "left" ? s.x - ICON_HW : s.x + ICON_HW;
      var icy = s.y + ICON_VC;                                 // icon centre
      var dx = icx - CX, dy = icy - CY;
      var t = 1 / Math.sqrt((dx * dx) / (IRX * IRX) + (dy * dy) / (IRY * IRY));
      var nx = round(CX + dx * t), ny = round(CY + dy * t);    // node on inner ring
      // Aim at the icon CENTRE, not its edge: the opaque badge sits above the
      // wires (z-index) and hides the overshoot, so the line always meets the
      // circle cleanly no matter how tall the figure's caption makes the row.
      var ax = round(icx), ay = round(icy);
      var c1x = round(nx + (ax - nx) * 0.35 + (CX - nx) * 0.06);
      var c1y = round(ny + (ay - ny) * 0.35 + (CY - ny) * 0.06);
      var c2x = round(nx + (ax - nx) * 0.72);
      var c2y = round(ny + (ay - ny) * 0.72);
      return {
        nx: nx, ny: ny,
        wire: "M" + nx + " " + ny + " C" + c1x + " " + c1y + " " +
          c2x + " " + c2y + " " + ax + " " + ay
      };
    }

    // [[run]] → accent span; the text is escaped first, so still safe.
    function titleHTML() {
      return esc(TITLE).replace(/\[\[(.+?)\]\]/g,
        '<span class="hk-numbers__accent">$1</span>');
    }

    // A faint dotted "signal wave": five rows of a sine dot-field fading up
    // and outward. Generated (not hand-placed) so it stays compact; the
    // right copy is the same field mirrored in CSS. Decorative only.
    function waveDots() {
      var out = "", row, col, x, y, op;
      for (row = 0; row < 5; row++) {
        for (col = 0; col < 26; col++) {
          x = col * 14;
          y = (96 - row * 11) + 9 * Math.sin((2 * Math.PI * x) / 182);
          op = 0.5 - row * 0.07 - col * 0.012;
          if (op < 0.06) op = 0.06;
          out += '<circle cx="' + x + '" cy="' + (Math.round(y * 10) / 10) +
            '" r="1.4" fill="currentColor" opacity="' +
            (Math.round(op * 100) / 100) + '"/>';
        }
      }
      return out;
    }

    function waveHTML(side) {
      return '<svg class="hk-numbers__wave hk-numbers__wave--' + side +
        '" viewBox="0 0 364 120" fill="none" aria-hidden="true">' +
        waveDots() + "</svg>";
    }

    // Faint orbit rings + a short bright arc that travels the middle ring.
    function orbitsHTML() {
      return (
        '<svg class="hk-numbers__orbits" viewBox="0 0 100 100" ' +
          'preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
          '<ellipse class="hk-numbers__ring hk-numbers__ring--1" cx="50" cy="47" rx="33" ry="36"/>' +
          '<ellipse class="hk-numbers__ring hk-numbers__ring--2" cx="50" cy="47" rx="25" ry="28"/>' +
          '<ellipse class="hk-numbers__ring hk-numbers__ring--3" cx="50" cy="47" rx="18" ry="21"/>' +
          '<ellipse class="hk-numbers__ring-glow" cx="50" cy="47" rx="25" ry="28" pathLength="100"/>' +
        "</svg>"
      );
    }

    // Curved connectors from each inner-ring node out toward its figure.
    function connectorsHTML() {
      var paths = "";
      STATS.forEach(function (s) { paths += '<path d="' + geom(s).wire + '"/>'; });
      return (
        '<svg class="hk-numbers__connectors" viewBox="0 0 100 100" ' +
          'preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
          paths +
        "</svg>"
      );
    }

    // The small node where each connector meets the inner ring.
    function nodesHTML() {
      var dots = "";
      STATS.forEach(function (s) {
        var g = geom(s);
        dots += '<span class="hk-numbers__node' +
          (s.pulse ? " hk-numbers__node--pulse" : "") +
          '" style="--nx:' + g.nx + "%;--ny:" + g.ny + '%"></span>';
      });
      return '<div class="hk-numbers__nodes" aria-hidden="true">' + dots + "</div>";
    }

    // The centrepiece: a glowing shield rising off a layered circuit
    // platform. Purely decorative (aria-hidden) - the figures carry the
    // meaning. Drawn in CSS/SVG; no image required. The float lives on the
    // inner stage so the core's own centring transform is never disturbed.
    function coreHTML() {
      return (
        '<div class="hk-numbers__core" style="--i:3" aria-hidden="true">' +
          '<div class="hk-numbers__core-stage">' +
            '<div class="hk-numbers__core-glow"></div>' +
            '<div class="hk-numbers__platform">' +
              '<div class="hk-numbers__slab hk-numbers__slab--3"></div>' +
              '<div class="hk-numbers__slab hk-numbers__slab--2"></div>' +
              '<div class="hk-numbers__slab">' +
                '<svg class="hk-numbers__circuit" viewBox="0 0 232 150" fill="none" stroke="currentColor" aria-hidden="true">' +
                  '<path d="M24 44 H86 V74"/>' +
                  '<path d="M208 56 H150 V92"/>' +
                  '<path d="M40 104 H96"/>' +
                  '<path d="M196 108 H132 V80"/>' +
                  '<circle cx="86" cy="74" r="2.4"/>' +
                  '<circle cx="150" cy="92" r="2.4"/>' +
                  '<circle cx="96" cy="104" r="2.4"/>' +
                  '<circle cx="132" cy="80" r="2.4"/>' +
                  '<circle cx="24" cy="44" r="2"/>' +
                  '<circle cx="208" cy="56" r="2"/>' +
                "</svg>" +
              "</div>" +
            "</div>" +
            '<svg class="hk-numbers__shield" viewBox="0 0 200 232" aria-hidden="true">' +
              "<defs>" +
                '<linearGradient id="hk-numbers-shield-grad" x1="0" y1="0" x2="1" y2="1">' +
                  '<stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>' +
                  '<stop offset="0.55" stop-color="#eef4ff" stop-opacity="0.78"/>' +
                  '<stop offset="1" stop-color="#d7e6ff" stop-opacity="0.62"/>' +
                "</linearGradient>" +
              "</defs>" +
              '<path class="hk-numbers__shield-face" d="M100 12 C128 30 158 40 182 44 C186 44.7 188 47 188 51 C188 86 183 120 168 150 C154 178 130 202 100 220 C70 202 46 178 32 150 C17 120 12 86 12 51 C12 47 14 44.7 18 44 C42 40 72 30 100 12 Z"/>' +
              '<path class="hk-numbers__shield-inner" d="M100 12 C128 30 158 40 182 44 C186 44.7 188 47 188 51 C188 86 183 120 168 150 C154 178 130 202 100 220 C70 202 46 178 32 150 C17 120 12 86 12 51 C12 47 14 44.7 18 44 C42 40 72 30 100 12 Z" transform="translate(100 114) scale(0.86) translate(-100 -114)"/>' +
              '<ellipse class="hk-numbers__shield-sheen" cx="74" cy="72" rx="18" ry="38" transform="rotate(-20 74 72)"/>' +
              '<path class="hk-numbers__shield-wing" d="M100 94 C90 98 80 96 67 106 C80 105 90 110 100 119 C110 110 120 105 133 106 C120 96 110 98 100 94 Z M100 116 L95.5 131 L100 126.5 L104.5 131 Z"/>' +
            "</svg>" +
          "</div>" +
        "</div>"
      );
    }

    // A figure: round icon badge + big count-up value (with accent unit)
    // and a caption. data-count holds the real figure so the tween knows
    // its target and lands on the exact source string.
    function statHTML(s, i) {
      return (
        '<li class="hk-numbers__metric' +
          (s.side === "left" ? " hk-numbers__metric--left" : "") +
          (s.long ? " hk-numbers__metric--long" : "") +
          '" style="--x:' + s.x + "%;--y:" + s.y + "%;--i:" + (i + 4) + '">' +
          '<span class="hk-numbers__badge" aria-hidden="true">' + icon(s.icon) + "</span>" +
          '<span class="hk-numbers__fig">' +
            '<span class="hk-numbers__value">' +
              '<span class="hk-numbers__num" data-count="' + esc(s.value) + '">0</span>' +
              (s.unit ? '<span class="hk-numbers__unit">' + esc(s.unit) + "</span>" : "") +
            "</span>" +
            '<span class="hk-numbers__text">' + esc(s.text) + "</span>" +
          "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-numbers")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-numbers' + (ANIMATE ? " is-animated" : "") + '">' +
          '<header class="hk-numbers__head">' +
            '<p class="hk-numbers__eyebrow" style="--i:0">' +
              '<span class="hk-numbers__eyebrow-line" aria-hidden="true"></span>' +
              "<span>" + esc(MOD) + "</span>" +
              '<span class="hk-numbers__eyebrow-line" aria-hidden="true"></span>' +
            "</p>" +
            '<h2 class="hk-numbers__title" style="--i:1">' + titleHTML() + "</h2>" +
            '<p class="hk-numbers__sub" style="--i:2">' + esc(SUB) + "</p>" +
          "</header>" +
          '<div class="hk-numbers__viz">' +
            '<div class="hk-numbers__decor" aria-hidden="true">' +
              '<div class="hk-numbers__glow"></div>' +
              waveHTML("left") + waveHTML("right") +
            "</div>" +
            orbitsHTML() +
            connectorsHTML() +
            nodesHTML() +
            coreHTML() +
            '<ul class="hk-numbers__metrics">' + STATS.map(statHTML).join("") + "</ul>" +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-numbers");
      if (ANIMATE) reveal(root);

      // Count the figures up the first time the stage scrolls into view.
      var nums = root.querySelectorAll(".hk-numbers__num");
      onReveal(root, function () {
        nums.forEach(function (n, i) {
          setTimeout(function () {
            countUp(n, n.getAttribute("data-count"));
          }, 160 + i * 80);
        });
      });
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     3. How HawkINT Works  -  container .hawk-how  -  prefix hk-how
     A vertical process pipeline: five numbered steps on a single spine,
     reading top-to-bottom as one signal from raw data to resolved threat
     (Collect -> Enrich -> Analyze -> Alert -> Act).
     =================================================================== */
  (function () {
    var SECTION = ".hawk-how";

    var MOD = "HOW IT WORKS";
    var TITLE = "From Raw Signal to Resolved Threat in Five Steps";
    // No lead in the PDF for this section - omit it (empty SUB).
    var SUB = "";

    // Each step is a node on the spine. Icons are drawn from the shared
    // ICONS set and kept visually distinct across the five stages.
    var STEPS = [
      {
        num: "01",
        icon: "bot",
        title: "Collect",
        text:
          "Thousands of specialized bots scan millions of posts, files, " +
          "pages, images and conversations across the surface, deep and " +
          "dark web, around the clock."
      },
      {
        num: "02",
        icon: "ocr",
        title: "Enrich",
        text:
          "OCR pulls text from images, audio and video are transcribed " +
          "automatically, and entities such as emails, domains, IPs and " +
          "card numbers are recognized and classified."
      },
      {
        num: "03",
        icon: "rank",
        title: "Analyze",
        text:
          "Machine learning ranks every event by severity and relevance " +
          "to your assets, while LLM-powered models profile the actors " +
          "behind it."
      },
      {
        num: "04",
        icon: "bell",
        title: "Alert",
        text:
          "Confirmed threats become wires: targeted alerts with evidence, " +
          "context and recommended next steps, delivered to the platform, " +
          "email, your SIEM or ticketing tools."
      },
      {
        num: "05",
        icon: "shield",
        title: "Act",
        text:
          "CybrHawk analysts validate, hunt deeper, engage threat actors " +
          "where appropriate and execute takedowns - closing the loop."
      }
    ];
    var ANIMATE = true;

    // One step row: a numbered node sitting on the spine, with a content
    // card to its right carrying the title and body.
    function stepHTML(s, i) {
      return (
        '<li class="hk-how__step" style="--i:' + i + '">' +
          '<span class="hk-how__node">' +
            '<span class="hk-how__node-ico">' + icon(s.icon) + "</span>" +
          "</span>" +
          '<div class="hk-how__step-card">' +
            '<span class="hk-how__num" aria-hidden="true">' + esc(s.num) + "</span>" +
            '<h3 class="hk-how__step-title">' + esc(s.title) + "</h3>" +
            '<p class="hk-how__step-text">' + esc(s.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-how")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-how' + (ANIMATE ? " is-animated" : "") + '">' +
          '<div class="hk-how__measure">' +
            moduleHead("hk-how", MOD, TITLE, SUB) +
            '<ol class="hk-how__steps">' +
              STEPS.map(stepHTML).join("") +
            "</ol>" +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-how");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     4. Industries We Protect  -  container .hawk-industries  -  prefix hk-ind
     An interactive SECTOR SELECTOR (not a card grid): a vertical rail of
     seven sectors on the left drives a single large detail panel on the
     right (icon, sector, threat copy and a row of threat chips). One
     sector is active at a time; the rail is a real tablist (roles,
     arrow-key roving focus). Below 860px it collapses to an accordion -
     each rail item becomes a header with its panel directly beneath. This
     shape deliberately breaks from the Capabilities/Features grids so no
     two neighbouring sections read alike. (PDF §11 - seven sectors.)
     =================================================================== */
  (function () {
    var SECTION = ".hawk-industries";

    var MOD = "INDUSTRIES";
    var TITLE = "Intelligence tuned to your sector's threats";
    var SUB = "Select an industry to see how HawkINT is applied.";

    // Each sector: rail icon + label, a mono "focus" tag for the panel
    // eyebrow, and the body copy.
    var SECTORS = [
      {
        icon: "bank",
        label: "Banking & Financial Services",
        tag: "FINANCIAL CRIME",
        text:
          "Stop card fraud, account takeover and phishing; track groups " +
          "targeting banks and meet regulatory intelligence requirements."
      },
      {
        icon: "health",
        label: "Healthcare & Life Sciences",
        tag: "PATIENT DATA",
        text:
          "Protect patient data, support HIPAA obligations and detect " +
          "records for sale on dark web markets."
      },
      {
        icon: "gov",
        label: "Government & Public Sector",
        tag: "NATIONAL RISK",
        text:
          "Monitor hacktivists, geopolitical threats, disinformation and " +
          "risks to citizen services."
      },
      {
        icon: "cart",
        label: "Retail & E-Commerce",
        tag: "CUSTOMER FRAUD",
        text:
          "Catch fake stores, credential stuffing, loyalty fraud and " +
          "customer-targeted scams."
      },
      {
        icon: "energy",
        label: "Energy, Utilities & Manufacturing",
        tag: "CRITICAL INFRA",
        text:
          "Track nation-state actors, ransomware groups and OT/ICS-focused " +
          "threats to critical infrastructure."
      },
      {
        icon: "chip",
        label: "Technology & SaaS",
        tag: "IP & SOURCE",
        text:
          "Detect source code leaks, exposed API keys, IP theft and brand " +
          "impersonation."
      },
      {
        icon: "profiles",
        label: "Telecom",
        tag: "SUBSCRIBER RISK",
        text:
          "Spot SIM-swap services, subscriber data leaks and insider " +
          "recruitment on underground forums."
      }
    ];
    var ANIMATE = true;

    // A rail button = one tab. The first is selected on build.
    function tabHTML(s, i) {
      return (
        '<button class="hk-ind__tab" type="button" role="tab" ' +
          'id="hk-ind-tab-' + i + '" aria-controls="hk-ind-panel-' + i + '" ' +
          'aria-selected="' + (i === 0 ? "true" : "false") + '" ' +
          'tabindex="' + (i === 0 ? "0" : "-1") + '" data-i="' + i + '" ' +
          'style="--i:' + i + '">' +
          '<span class="hk-ind__tab-ico" aria-hidden="true">' + icon(s.icon) + "</span>" +
          '<span class="hk-ind__tab-label">' + esc(s.label) + "</span>" +
          '<span class="hk-ind__tab-caret" aria-hidden="true">' + icon("arrow") + "</span>" +
        "</button>"
      );
    }

    // The detail panel for one sector. All seven are rendered; CSS shows
    // only the one whose [hidden] is false. On mobile each sits under its
    // own tab (accordion) - the markup already supports both via ordering.
    function panelHTML(s, i) {
      return (
        '<div class="hk-ind__panel" role="tabpanel" id="hk-ind-panel-' + i + '" ' +
          'aria-labelledby="hk-ind-tab-' + i + '"' + (i === 0 ? "" : " hidden") + ">" +
          '<div class="hk-ind__panel-head">' +
            '<span class="hk-ind__panel-badge" aria-hidden="true">' + icon(s.icon) + "</span>" +
            '<span class="hk-ind__panel-eyebrow">' + esc(s.tag) + "</span>" +
          "</div>" +
          '<h3 class="hk-ind__panel-title">' + esc(s.label) + "</h3>" +
          '<p class="hk-ind__panel-text">' + esc(s.text) + "</p>" +
        "</div>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-ind")) return true;

      // Tabs and panels are emitted as interleaved [tab][panel] pairs so the
      // source order is correct for the mobile accordion. On desktop, CSS
      // grid places every tab into the left rail column and every panel into
      // the right stage column (via grid-column), so the two-pane selector
      // still renders - no duplicated markup, one accessible tablist.
      var pairs = SECTORS.map(function (s, i) {
        return tabHTML(s, i) + panelHTML(s, i);
      }).join("");

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-ind' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-ind", MOD, TITLE, SUB) +
          '<div class="hk-ind__selector" role="tablist" ' +
            'aria-label="Industries" aria-orientation="vertical">' +
            pairs +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-ind");
      if (ANIMATE) reveal(root);

      var tabs = Array.prototype.slice.call(root.querySelectorAll(".hk-ind__tab"));
      var panels = Array.prototype.slice.call(root.querySelectorAll(".hk-ind__panel"));

      function select(i, focus) {
        tabs.forEach(function (t, j) {
          var on = j === i;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.setAttribute("tabindex", on ? "0" : "-1");
          if (on && focus) t.focus();
        });
        panels.forEach(function (p, j) {
          if (j === i) p.removeAttribute("hidden");
          else p.setAttribute("hidden", "");
        });
      }

      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { select(i, false); });
        t.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
          else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = tabs.length - 1;
          if (next === null) return;
          e.preventDefault();
          select(next, true);
        });
      });
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     4.5 Core Capabilities  -  container .hawk-caps  -  prefix hk-caps
     "Built for the Modern Threat Landscape" (PDF §5). Rendered as a
     technical DATASHEET / capability matrix - deliberately flatter and more
     "engineered" than the Industries selector and the Features console: a
     tight grid of cells separated by hairline rules (no floating rounded
     cards), each cell led by a large ghosted index numeral (01..09), a mono
     micro-label, an inline icon + title on one row and the body below. Nine
     capabilities (PDF §5). Each icon name resolves through shared ICONS.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-caps";

    var MOD = "CAPABILITIES";
    var TITLE = "Built for the Modern Threat Landscape";
    var SUB =
      "Every capability is designed to keep you one step ahead of attackers.";

    // Nine capabilities (icon, kind, title, text) - wording fixed (PDF §5).
    // `kind` is a short mono micro-label shown above the title.
    var CAPS = [
      {
        icon: "mask",
        kind: "BRAND",
        title: "Brand Protection",
        text:
          "Find and shut down impersonation, lookalike domains, phishing " +
          "kits and fraudulent use of your brand across web, social and " +
          "app stores."
      },
      {
        icon: "dark",
        kind: "SURVEILLANCE",
        title: "Deep & Dark Web Monitoring",
        text:
          "Continuous surveillance of underground forums, marketplaces, " +
          "paste sites, Telegram and closed groups for threats naming your " +
          "organization."
      },
      {
        icon: "evidence",
        kind: "DATA LOSS",
        title: "Data Leakage Detection",
        text:
          "Catch exposed credentials, sensitive documents, source code and " +
          "proprietary data before threat actors can exploit them."
      },
      {
        icon: "vip",
        kind: "VIP",
        title: "VIP & Executive Protection",
        text:
          "Dedicated monitoring of leaders and key staff for personal data " +
          "exposure, doxxing, deepfakes and targeted social engineering."
      },
      {
        icon: "sources",
        kind: "EASM",
        title: "External Attack Surface Management",
        text:
          "Discover, map and monitor every internet-facing asset - domains, " +
          "subdomains, certificates, cloud services and exposed ports - and " +
          "flag the vulnerabilities attackers see first."
      },
      {
        icon: "search",
        kind: "HUNTING",
        title: "Threat Hunting",
        text:
          "Proactive, analyst-led searches for advanced threats that slip " +
          "past traditional controls, guided by live adversary intelligence."
      },
      {
        icon: "ransom",
        kind: "RANSOMWARE",
        title: "Ransomware Intelligence",
        text:
          "Track ransomware groups, affiliates, leak sites and disclosures - " +
          "including attacks on your suppliers and partners."
      },
      {
        icon: "card",
        kind: "FRAUD",
        title: "Fraud & Payment Card Intelligence",
        text:
          "Detect compromised cards, BIN abuse, fraud tutorials and scam " +
          "campaigns targeting your customers."
      },
      {
        icon: "context",
        kind: "SUPPLY CHAIN",
        title: "Third-Party & Supply Chain Risk",
        text:
          "Watch vendors and partners for breaches, leaks and dark web " +
          "chatter that could become your problem."
      }
    ];
    var ANIMATE = true;

    // A datasheet cell: large ghosted index, mono kind label, icon + title
    // on one line, body below. The index is decorative (aria-hidden).
    function cellHTML(c, i) {
      var idx = ("0" + (i + 1)).slice(-2);
      return (
        '<li class="hk-caps__cell" style="--i:' + i + '">' +
          '<span class="hk-caps__index" aria-hidden="true">' + idx + "</span>" +
          '<span class="hk-caps__kind">' + esc(c.kind) + "</span>" +
          '<span class="hk-caps__cellhead">' +
            '<span class="hk-caps__ico" aria-hidden="true">' + icon(c.icon) + "</span>" +
            '<h3 class="hk-caps__cell-title">' + esc(c.title) + "</h3>" +
          "</span>" +
          '<p class="hk-caps__cell-text">' + esc(c.text) + "</p>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-caps")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-caps' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-caps", MOD, TITLE, SUB) +
          '<ul class="hk-caps__sheet">' + CAPS.map(cellHTML).join("") + "</ul>" +
        "</div>"
      );

      var root = host.querySelector(".hk-caps");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     5. Targeted Alerts & Incident Wires  -  container .hawk-wires
        prefix hk-wires  -  the page's signature "live wires console".
     -------------------------------------------------------------------
     TEMPORARILY DISABLED: the whole IIFE below is commented out so the
     section does not render. Remove the surrounding block comment to
     re-enable (the CSS for .hawk-wires is likewise commented out).
     =================================================================== */
  /* COMMENTED-OUT-WIRES-START
  (function () {
    var SECTION = ".hawk-wires";

    var MOD = "ALERTS & WIRES";
    var TITLE = "Targeted alerts & incident wires";
    // Paragraph 1 contains an intentional, author-controlled <strong>; it
    // is injected RAW (the one documented exception to esc() in this file).
    // Keep any new wording here plain text - no user input reaches it.
    var BODY = [
      "When HawkINT confirms a threat - phishing pages, leaked credentials, " +
        "brand abuse, ransomware chatter or illegal data marketplaces - it " +
        "creates <strong>wires</strong>: targeted alerts with evidence, " +
        "context and a recommended next step, delivered to the platform, " +
        "email, your SIEM or ticketing tools.",
      "Set recurring searches and smart watchlists for your domains, brands, " +
        "VIPs, BINs, IP ranges and technologies - and get notified the " +
        "moment they surface."
    ];

    // The expanded "lead" wire pinned at the top of the console (editable).
    var WIRE = {
      severity: "High",
      ref: "WIRE-4821",
      title: "Leaked credentials - acme-corp.com",
      rows: [
        {
          icon: "evidence",
          label: "Evidence",
          val: "1,240 employee credentials posted to a dark web forum."
        },
        {
          icon: "context",
          label: "Context", 
          val: "Matches a recent breach of a third-party HR vendor."
        },
        {
          icon: "recommend",
          label: "Recommendation",
          val: "Force password resets and enable MFA on affected accounts."
        }
      ]
    };

    // Compact wires that stream into the feed on a timer. sev drives the
    // chip colour (high | med | low) - these are status, not brand.
    var FEED = [
      { sev: "high", tag: "Phishing", text: "Spoofed login page cloning your SSO portal." },
      { sev: "med", tag: "Brand abuse", text: "Lookalike domain registered: acme-support[.]co." },
      { sev: "high", tag: "Data leak", text: "48k customer records listed on a breach market." },
      { sev: "low", tag: "VIP mention", text: "CEO named in a hacktivist planning channel." },
      { sev: "med", tag: "Malware", text: "Fake mobile app impersonating your brand." },
      { sev: "high", tag: "Ransomware", text: "Your sector added to a leak-site countdown." }
    ];
    var ANIMATE = true;

    function detailRowHTML(r) {
      return (
        '<li class="hk-wires__row">' +
          '<span class="hk-wires__label">' + icon(r.icon) + esc(r.label) + "</span>" +
          '<span class="hk-wires__val">' + esc(r.val) + "</span>" +
        "</li>"
      );
    }

    function feedItemHTML(w) {
      return (
        '<li class="hk-wires__feed-item hk-wires__feed-item--' + esc(w.sev) + '">' +
          '<span class="hk-wires__feed-dot"></span>' +
          '<span class="hk-wires__feed-tag">' + esc(w.tag) + "</span>" +
          '<span class="hk-wires__feed-text">' + esc(w.text) + "</span>" +
        "</li>"
      );
    }

    // Stream wires in, newest on top, cycling forever. Capped length so
    // the DOM doesn't grow unbounded.
    function startFeed(listEl) {
      if (prefersReduced()) {
        // Static snapshot of the first four instead of streaming.
        listEl.innerHTML = FEED.slice(0, 4).map(feedItemHTML).join("");
        return;
      }
      var i = 0;
      var MAX = 4;
      function push() {
        var w = FEED[i % FEED.length];
        i++;
        listEl.insertAdjacentHTML("afterbegin", feedItemHTML(w));
        var first = listEl.firstElementChild;
        requestAnimationFrame(function () {
          first.classList.add("is-in");
        });
        while (listEl.children.length > MAX) {
          listEl.removeChild(listEl.lastElementChild);
        }
      }
      push();
      setInterval(push, 2600);
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-wires")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-wires' + (ANIMATE ? " is-animated" : "") + '">' +
          '<div class="hk-wires__grid">' +
            '<div class="hk-wires__copy">' +
              '<p class="hk-wires__mod">' +
                '<span class="hk-wires__tick" aria-hidden="true"></span>' +
                "<span>" + esc(MOD) + "</span>" +
              "</p>" +
              '<h2 class="hk-wires__title">' + esc(TITLE) + "</h2>" +
              BODY.map(function (p) {
                // RAW by design - see the BODY comment above.
                return '<p class="hk-wires__body">' + p + "</p>";
              }).join("") +
            "</div>" +
            '<div class="hk-wires__console">' +
              '<div class="hk-wires__console-bar">' +
                '<span class="hk-wires__console-dots" aria-hidden="true">' +
                  "<i></i><i></i><i></i></span>" +
                '<span class="hk-wires__console-title">Incident Wires</span>' +
                '<span class="hk-wires__live"><span class="hk-wires__live-dot">' +
                  "</span>Live</span>" +
              "</div>" +
              '<div class="hk-wires__screen">' +
                '<div class="hk-wires__card">' +
                  '<div class="hk-wires__card-top">' +
                    '<span class="hk-wires__sev">' + esc(WIRE.severity) + "</span>" +
                    '<span class="hk-wires__ref">' + esc(WIRE.ref) + "</span>" +
                  "</div>" +
                  '<h3 class="hk-wires__card-title">' + esc(WIRE.title) + "</h3>" +
                  '<ul class="hk-wires__rows">' +
                    WIRE.rows.map(detailRowHTML).join("") +
                  "</ul>" +
                "</div>" +
                '<p class="hk-wires__feed-label">Incoming wires' +
                  '<span class="hk-wires__scanline"></span></p>' +
                '<ul class="hk-wires__feed" aria-label="Live incident wires"></ul>' +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-wires");
      if (ANIMATE) reveal(root);

      // Only start streaming once the console is actually on screen.
      var listEl = root.querySelector(".hk-wires__feed");
      onReveal(root, function () { startFeed(listEl); }, 0.25);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();
  COMMENTED-OUT-WIRES-END */

  /* ===================================================================
     6. Advanced Processing & Enrichment  -  container .hawk-enrich
        prefix hk-enrich  -  framed image tiles, icon fallback.
     -------------------------------------------------------------------
     TEMPORARILY DISABLED: the whole IIFE below is commented out so the
     section does not render. Remove the surrounding block comment to
     re-enable (the CSS for .hawk-enrich is likewise commented out). The
     one inner block-comment's delimiters were broken (/ * … * /) only so
     this single wrapper can enclose it; restore them when re-enabling.
     =================================================================== */
  /* COMMENTED-OUT-ENRICH-START
  (function () {
    var SECTION = ".hawk-enrich";

    var MOD = "ENRICHMENT";
    var TITLE = "Advanced processing & enrichment";
    // Each tile pairs an image with a one-line enrichment step (PDF §6 Enrich).
    / * Each tile shows an image. Drop the image URL into `img` (and a short
       `alt`); while `img` is "" the icon named in `icon` is drawn instead,
       so the section still renders before the artwork is ready. * /
    var ITEMS = [
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "AI-Powered-Security-Report-Scanning.webp",
        alt: "AI-powered scanning of a security report",
        icon: "ocr",
        text: "OCR pulls text from images."
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Minimalist-Audio-Transcription-Dashboard.webp",
        alt: "Audio transcription dashboard",
        icon: "media",
        text: "Audio and video are transcribed automatically."
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Modern-Security-Events-Dashboard.webp",
        alt: "Security events ranked by severity",
        icon: "rank",
        text: "Machine learning ranks events by severity and relevance."
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Cybersecurity-Data-Triage-Dashboard.webp",
        alt: "Data triage dashboard classifying formats",
        icon: "classify",
        text:
          "Entities - emails, domains, IPs and card numbers - are " +
          "recognized and classified."
      }
    ];
    var ANIMATE = true;

    function mediaHTML(it) {
      if (it.img) {
        return (
          '<span class="hk-enrich__media">' +
            '<img class="hk-enrich__img" src="' + esc(it.img) + '" alt="' +
              esc(it.alt || "") + '" loading="lazy" decoding="async">' +
          "</span>"
        );
      }
      // Fallback to the icon badge until an image URL is supplied.
      return '<span class="hk-enrich__badge">' + icon(it.icon) + "</span>";
    }

    function itemHTML(it, i) {
      return (
        '<li class="hk-enrich__item" style="--i:' + i + '">' +
          mediaHTML(it) +
          '<p class="hk-enrich__text">' + esc(it.text) + "</p>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-enrich")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-enrich' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-enrich", MOD, TITLE) +
          '<ul class="hk-enrich__grid">' + ITEMS.map(itemHTML).join("") + "</ul>" +
        "</div>"
      );

      var root = host.querySelector(".hk-enrich");
      if (ANIMATE) reveal(root);

      // A tile image that fails swaps to its icon badge, matching the
      // empty-URL path, so no tile is ever blank.
      root.querySelectorAll(".hk-enrich__img").forEach(function (img, i) {
        img.addEventListener("error", function () {
          var m = img.closest(".hk-enrich__media");
          if (!m) return;
          m.outerHTML = '<span class="hk-enrich__badge">' + icon(ITEMS[i].icon) + "</span>";
        });
      });
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();
  COMMENTED-OUT-ENRICH-END */

  /* ===================================================================
     7. Platform Features  -  container .hawk-features  -  prefix hk-features
     Rendered as a single framed CONSOLE PANEL (chrome bar + "feature list")
     whose ten features are horizontal ROWS - a numbered index, an icon, the
     title and its description on one line, split by hairline rules. It reads
     like looking inside the product's settings/inspector, deliberately
     different from the Industries selector and the Capabilities datasheet.
     Ten features (PDF §7). Each icon resolves through the shared ICONS set.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-features";

    var MOD = "FEATURES";
    var TITLE = "Everything your analysts need in one console";
    var SUB = "";
    var CARDS = [
      {
        icon: "search",
        title: "Intelligence Search Engine",
        text:
          "Query billions of records in seconds with Lucene or Regex, " +
          "filtered by date, source, file type, actor or keyword."
      },
      {
        icon: "bell",
        title: "Smart Alerts & Watchlists",
        text:
          "Set recurring searches for your domains, brands, VIPs, BINs, IP " +
          "ranges and technologies - and get notified the moment they surface."
      },
      {
        icon: "bot",
        title: "No-Code Custom Bots",
        text:
          "Design and deploy your own collection bots from the interface to " +
          "watch the sources that matter to you."
      },
      {
        icon: "evidence",
        title: "Leak Evidence Viewer",
        text:
          "Open the exact file, post or log where your data appeared, with " +
          "secure, sandboxed access."
      },
      {
        icon: "link-alert",
        title: "Malicious URL & Phishing Monitoring",
        text:
          "AI scanning spots phishing pages, malware hosts and fraudulent " +
          "landing pages, and alerts your team instantly."
      },
      {
        icon: "mask",
        title: "Fake Profile Detection",
        text:
          "Identify impersonation accounts across social networks and " +
          "digital platforms, ready for takedown."
      },
      {
        icon: "actor",
        title: "Threat Actor Profiles",
        text:
          "See aliases, tactics, targets and history for the groups and " +
          "individuals behind each threat."
      },
      {
        icon: "profiles",
        title: "Teams, Roles & Access Profiles",
        text:
          "Create project-based workspaces and role-based access to match " +
          "your internal workflows."
      },
      {
        icon: "report",
        title: "Executive Dashboards & Reports",
        text:
          "Share exposure trends, risk scores and takedown results with " +
          "leadership and auditors."
      },
      {
        icon: "wire",
        title: "API & Integrations",
        text:
          "Stream wires and IOCs into your SIEM, SOAR, TIP and ticketing " +
          "tools via REST API and STIX/TAXII."
      }
    ];
    var ANIMATE = true;

    // One feature row: mono index, icon, title + description. The title and
    // text sit in a two-column inner grid so descriptions align down the list.
    function rowHTML(c, i) {
      var idx = ("0" + (i + 1)).slice(-2);
      return (
        '<li class="hk-features__row" style="--i:' + i + '">' +
          '<span class="hk-features__idx" aria-hidden="true">' + idx + "</span>" +
          '<span class="hk-features__ico" aria-hidden="true">' + icon(c.icon) + "</span>" +
          '<span class="hk-features__row-copy">' +
            '<span class="hk-features__row-title">' + esc(c.title) + "</span>" +
            '<span class="hk-features__row-text">' + esc(c.text) + "</span>" +
          "</span>" +
          '<span class="hk-features__row-caret" aria-hidden="true">' + icon("arrow") + "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-features")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-features' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-features", MOD, TITLE, SUB) +
          '<div class="hk-features__console">' +
            '<div class="hk-features__bar">' +
              '<span class="hk-features__dots" aria-hidden="true">' +
                "<i></i><i></i><i></i></span>" +
              '<span class="hk-features__bar-title">HawkINT · Console</span>' +
              '<span class="hk-features__count">' + CARDS.length + " MODULES</span>" +
            "</div>" +
            '<ul class="hk-features__list">' + CARDS.map(rowHTML).join("") + "</ul>" +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-features");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     8. AI at the Core  -  container .hawk-ai  -  prefix hk-ai
     A "core diagram" split: the left column carries the intro and a living
     AI CORE node (a pulsing hawk badge inside orbit rings), the right
     column lists the nine applied-AI capabilities as compact connected
     pills feeding that core. This diagram shape is deliberately unlike the
     Industries selector, the Capabilities datasheet and the Features
     console, so no two neighbouring sections read alike. (PDF §8.)
     =================================================================== */
  (function () {
    var SECTION = ".hawk-ai";

    var MOD = "AI AT THE CORE";
    var TITLE = "Human Expertise, Amplified by Applied AI";
    var SUB =
      "HawkINT's AI turns overwhelming volumes of raw data into a short list " +
      "of threats that matter. Our analysts train, tune and validate every " +
      "model, so automation never replaces judgment.";

    // Nine AI capabilities, in PDF order. Each icon name is already in the
    // shared ICONS set (visually distinct) — reused, not redrawn.
    var CAPS = [
      { icon: "rank",      title: "ML Event Ranking",                  text: "Prioritizes every event by severity and relevance." },
      { icon: "actor",     title: "LLM-Powered Actor Profiling",       text: "Summarizes who is behind a threat and what they want." },
      { icon: "report",    title: "AI Threat Summaries",               text: "Plain-language briefs on each wire for faster triage." },
      { icon: "classify",  title: "Automated Phishing Classification", text: "Separates live phishing from benign lookalikes." },
      { icon: "search",    title: "Image Similarity & Logo Detection", text: "Finds brand abuse even when no text matches." },
      { icon: "profiles",  title: "Facial Recognition",                text: "Spots executive impersonation and deepfake misuse." },
      { icon: "mask",      title: "Behavioral Fake-Profile Detection", text: "Flags inauthentic accounts by how they act." },
      { icon: "pulse",     title: "Anomaly Detection",                 text: "Surfaces unusual activity in the environments we monitor." },
      { icon: "recommend", title: "Personalized Recommendations",      text: "Suggests next actions based on your team's behavior." }
    ];
    var ANIMATE = true;

    // The living AI core: a pulsing hawk badge inside two orbit rings, with
    // a mono caption. Purely decorative (aria-hidden) — the pills carry the
    // meaning. Motion is CSS-only and respects prefers-reduced-motion.
    function coreHTML() {
      return (
        '<div class="hk-ai__core" aria-hidden="true">' +
          '<span class="hk-ai__core-ring hk-ai__core-ring--1"></span>' +
          '<span class="hk-ai__core-ring hk-ai__core-ring--2"></span>' +
          '<span class="hk-ai__core-pulse"></span>' +
          '<span class="hk-ai__core-badge">' + icon("hawk") + "</span>" +
          '<span class="hk-ai__core-label">HawkINT AI</span>' +
        "</div>"
      );
    }

    // One capability pill: accent icon, title, one-line description.
    function pillHTML(c, i) {
      return (
        '<li class="hk-ai__pill" style="--i:' + i + '">' +
          '<span class="hk-ai__pill-ico" aria-hidden="true">' + icon(c.icon) + "</span>" +
          '<span class="hk-ai__pill-copy">' +
            '<span class="hk-ai__pill-title">' + esc(c.title) + "</span>" +
            '<span class="hk-ai__pill-text">' + esc(c.text) + "</span>" +
          "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-ai")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-ai' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-ai", MOD, TITLE, SUB) +
          '<div class="hk-ai__diagram">' +
            '<div class="hk-ai__aside">' +
              coreHTML() +
              '<p class="hk-ai__note">' +
                "Every model is analyst-trained and validated — automation " +
                "narrows the field, people make the call." +
              "</p>" +
            "</div>" +
            '<ul class="hk-ai__pills">' + CAPS.map(pillHTML).join("") + "</ul>" +
          "</div>" +
        "</div>"
      );
      if (ANIMATE) reveal(host.querySelector(".hk-ai"));
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     9. Takedown Services  -  container .hawk-takedown  -  prefix hk-takedown
     Framed image tiles with a "neutralized" tick, icon fallback.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-takedown";

    var MOD = "TAKEDOWN";
    var TITLE = "Intelligence backed by a team that acts";
    var SUB =
      "HawkINT doesn't stop at the alert - CybrHawk's experts help you " +
      "investigate, respond and remove threats.";
    /* Each tile shows an image. Drop the image URL into `img` (and a short
       `alt`); while `img` is "" the icon named in `icon` is drawn instead,
       so the section still renders before the artwork is ready. */
    var TARGETS = [
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Phishing-Site-Removal-Illustration.webp",
        alt: "Phishing site being removed",
        icon: "page",
        label: "Phishing sites & lookalike domains"
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Removing-Fake-Social-Profiles.webp",
        alt: "Fake social profiles being removed",
        icon: "mask",
        label: "Fake profiles & impersonation accounts"
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Malicious-App-Removed-Successfully.webp",
        alt: "Malicious mobile app removed",
        icon: "app",
        label: "Fraudulent & cloned mobile apps"
      },
      {
        img:
          "https://cybrhawk.com/wp-content/uploads/2026/10/" +
          "Malicious-Domain-Blocked-Network-Secured.webp",
        alt: "Malicious domain blocked, network secured",
        icon: "malware",
        label: "Malicious ads, scam pages & URLs"
      }
    ];
    var ANIMATE = true;

    function tileMediaHTML(t) {
      if (t.img) {
        return (
          '<span class="hk-takedown__media">' +
            '<img class="hk-takedown__img" src="' + esc(t.img) + '" alt="' +
              esc(t.alt || "") + '" loading="lazy" decoding="async">' +
          "</span>"
        );
      }
      // Fallback to the icon badge until an image URL is supplied.
      return '<span class="hk-takedown__badge">' + icon(t.icon) + "</span>";
    }

    function tileHTML(t, i) {
      return (
        '<li class="hk-takedown__tile" style="--i:' + i + '">' +
          tileMediaHTML(t) +
          '<span class="hk-takedown__label">' +
            '<span class="hk-takedown__status" aria-hidden="true">' +
              icon("check") + "Neutralized</span>" +
            esc(t.label) +
          "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-takedown")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-takedown' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-takedown", MOD, TITLE, SUB) +
          '<ul class="hk-takedown__grid">' + TARGETS.map(tileHTML).join("") + "</ul>" +
        "</div>"
      );

      var root = host.querySelector(".hk-takedown");
      if (ANIMATE) reveal(root);

      root.querySelectorAll(".hk-takedown__img").forEach(function (img, i) {
        img.addEventListener("error", function () {
          var m = img.closest(".hk-takedown__media");
          if (!m) return;
          m.outerHTML = '<span class="hk-takedown__badge">' + icon(TARGETS[i].icon) + "</span>";
        });
      });
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     10. Professional Services  -  container .hawk-services  -  prefix hk-svc
     The "response desk": a sticky console aside on the left states who is
     on call, and a numbered service ledger on the right lists what the
     CybrHawk team does by hand. Reads as a roster, not another card grid,
     so it sits apart from the product sections above.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-services";

    var MOD = "PROFESSIONAL SERVICES";
    var TITLE = "A team on call when the platform finds something";
    var SUB =
      "The platform surfaces the threat - CybrHawk's analysts, responders " +
      "and forensics specialists take it from there.";

    // The aside's "on call" strip - a quiet operational signal, not a stat.
    var DESK = {
      status: "Analysts on call",
      note:
        "Every engagement is run by named specialists and scoped to your " +
        "environment - no handoff to a queue."
    };

    // The ledger. `tag` is the mono index drawn down the spine; order here
    // is the order on the page. Icons resolve through the shared ICONS set.
    var SERVICES = [
      {
        tag: "S-01",
        icon: "search",
        title: "Active Threat Hunting",
        text:
          "Analysts search your environment for hidden threats using live " +
          "adversary intelligence."
      },
      {
        tag: "S-02",
        icon: "actor",
        title: "Threat Actor Engagement",
        text:
          "Controlled, discreet engagement with actors to validate leaks " +
          "and verify their claims."
      },
      {
        tag: "S-03",
        icon: "bell",
        title: "Incident Response",
        text:
          "Rapid 24/7 response to contain breaches and restore operations."
      },
      {
        tag: "S-04",
        icon: "evidence",
        title: "Digital Forensics",
        text:
          "Court-ready evidence collection, analysis and chain of custody."
      },
      {
        tag: "S-05",
        icon: "shield",
        title: "Compromise Assessment",
        text:
          "A proactive review that finds signs of past or ongoing intrusion."
      },
      {
        tag: "S-06",
        icon: "key",
        title: "Internal Investigations",
        text:
          "Confidential inquiries into insider threats and policy violations."
      },
      {
        tag: "S-07",
        icon: "report",
        title: "Custom Intelligence Reports",
        text:
          "Tailored briefings on your sector, region or the adversaries " +
          "that matter to you."
      }
    ];
    var ANIMATE = true;

    function deskHTML() {
      return (
        '<aside class="hk-svc__desk">' +
          '<div class="hk-svc__desk-chrome" aria-hidden="true">' +
            '<span class="hk-svc__desk-dots"><i></i><i></i><i></i></span>' +
            '<span class="hk-svc__desk-chrome-label">response-desk</span>' +
          "</div>" +
          '<div class="hk-svc__desk-body">' +
            '<p class="hk-svc__desk-status">' +
              '<span class="hk-svc__desk-dot" aria-hidden="true"></span>' +
              esc(DESK.status) +
            "</p>" +
            '<p class="hk-svc__desk-note">' + esc(DESK.note) + "</p>" +
          "</div>" +
        "</aside>"
      );
    }

    // One ledger row: mono index on the spine, icon badge, title + body.
    function rowHTML(s, i) {
      return (
        '<li class="hk-svc__row" style="--i:' + i + '">' +
          '<span class="hk-svc__index" aria-hidden="true">' + esc(s.tag) + "</span>" +
          '<span class="hk-svc__ico">' + icon(s.icon) + "</span>" +
          '<span class="hk-svc__text">' +
            '<span class="hk-svc__row-title">' + esc(s.title) + "</span>" +
            '<span class="hk-svc__row-desc">' + esc(s.text) + "</span>" +
          "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-svc")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-svc' + (ANIMATE ? " is-animated" : "") + '">' +
          '<div class="hk-svc__layout">' +
            '<div class="hk-svc__aside">' +
              moduleHead("hk-svc", MOD, TITLE, SUB) +
              deskHTML() +
            "</div>" +
            '<ol class="hk-svc__ledger">' +
              SERVICES.map(rowHTML).join("") +
            "</ol>" +
          "</div>" +
        "</div>"
      );

      var root = host.querySelector(".hk-svc");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();

  /* ===================================================================
     11. Integrations  -  container .hawk-integrations  -  prefix hk-int
     A patch-bay / wiring board. A thin signal bus at the top carries
     HawkINT's output ("outside-in") into the CybrHawk platform
     ("inside-out"); below it, each integration is a connector "port"
     card with a mono port label and a jack that lights when wired. The
     wiring shape is unlike the AI core+pills above, so neighbours never
     read alike.
     =================================================================== */
  (function () {
    var SECTION = ".hawk-integrations";

    var MOD = "INTEGRATIONS WITH THE CYBRHAWK PLATFORM";
    var TITLE = "External Intelligence, Wired Into Your Defenses";
    var SUB =
      "HawkINT works on its own or as the external intelligence layer of the " +
      "CybrHawk unified defense platform. Wires and indicators flow straight " +
      "into detection and response, so outside-in threats trigger " +
      "inside-out action.";

    // The signal bus caption - the two ends of the flow line.
    var BUS = { from: "HawkINT", flow: "outside-in → inside-out", to: "CybrHawk platform" };

    // Six connector ports (PDF §7). `port` is the mono jack label; icons
    // resolve through the shared ICONS set and are kept visually distinct.
    var PORTS = [
      {
        icon: "shield",
        port: "SIEM-XDR / NDR / CLOUD",
        title: "SIEM XDR / NDR / Cloud",
        text: "Enrich detections with live IOCs and actor context."
      },
      {
        icon: "bot",
        port: "AUTONOMOUS-SOC",
        title: "Autonomous SOC & Hyper Automation",
        text:
          "Auto-trigger playbooks - resetting leaked credentials or " +
          "blocking phishing domains."
      },
      {
        icon: "key",
        port: "ITDR",
        title: "Identity Threat Detection & Response",
        text:
          "Correlate leaked credentials with active identities and " +
          "privileged accounts."
      },
      {
        icon: "energy",
        port: "HAWKSTRIKE",
        title: "HawkStrike",
        text:
          "Validate whether exposed assets and vulnerabilities are " +
          "actually exploitable."
      },
      {
        icon: "evidence",
        port: "IR-ONE",
        title: "IR One",
        text:
          "Hand off confirmed threats to incident response with full " +
          "evidence attached."
      },
      {
        icon: "chip",
        port: "THIRD-PARTY",
        title: "Third-Party Tools",
        text:
          "REST API, STIX/TAXII, webhooks, email and ticketing connectors."
      }
    ];
    var ANIMATE = true;

    // The signal bus: source chip, an animated flow line, platform chip.
    // Decorative (aria-hidden) - the heading and ports carry the meaning.
    function busHTML() {
      return (
        '<div class="hk-int__bus" aria-hidden="true">' +
          '<span class="hk-int__bus-end hk-int__bus-end--src">' +
            '<span class="hk-int__bus-dot"></span>' + esc(BUS.from) +
          "</span>" +
          '<span class="hk-int__bus-line">' +
            '<span class="hk-int__bus-flow">' + esc(BUS.flow) + "</span>" +
          "</span>" +
          '<span class="hk-int__bus-end hk-int__bus-end--dst">' +
            esc(BUS.to) + '<span class="hk-int__bus-dot"></span>' +
          "</span>" +
        "</div>"
      );
    }

    // One connector port card: jack label + icon, product title, flow note.
    function portHTML(p, i) {
      return (
        '<li class="hk-int__port" style="--i:' + i + '">' +
          '<span class="hk-int__port-head">' +
            '<span class="hk-int__jack" aria-hidden="true"></span>' +
            '<span class="hk-int__port-tag">' + esc(p.port) + "</span>" +
          "</span>" +
          '<span class="hk-int__port-main">' +
            '<span class="hk-int__port-ico" aria-hidden="true">' + icon(p.icon) + "</span>" +
            '<span class="hk-int__port-copy">' +
              '<span class="hk-int__port-title">' + esc(p.title) + "</span>" +
              '<span class="hk-int__port-text">' + esc(p.text) + "</span>" +
            "</span>" +
          "</span>" +
        "</li>"
      );
    }

    function build() {
      var host = hostFor(SECTION);
      if (!host) return false;
      if (host.querySelector(".hk-int")) return true;

      host.insertAdjacentHTML(
        "beforeend",
        '<div class="hk-int' + (ANIMATE ? " is-animated" : "") + '">' +
          moduleHead("hk-int", MOD, TITLE, SUB) +
          busHTML() +
          '<ul class="hk-int__ports">' +
            PORTS.map(portHTML).join("") +
          "</ul>" +
        "</div>"
      );

      var root = host.querySelector(".hk-int");
      if (ANIMATE) reveal(root);
      return true;
    }

    onReady(function () { waitForSection(build); });
  })();
})();
