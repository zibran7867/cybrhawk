/* =====================================================================
   WEI / HawkOps — "The landscape, honestly" section
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects the
   section markup into the container matched by SECTION below and pairs
   with landscape.css.

   Four platform categories arranged around a central hub, joined to it
   by curved connectors. The connectors are one fixed-size SVG sitting
   in the middle grid column, so they line up without any measuring.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".landscape";

  /* ---- Content (edit freely) -----------------------------------------

     Per card:
       icon    one of: database | gear | people | bolt
       title   category name
       vendor  the parenthetical line under the title
       text    the honest assessment

     Cards fill clockwise from the top left: 1 top-left, 2 top-right,
     3 bottom-left, 4 bottom-right.
     -------------------------------------------------------------------- */
  var EYEBROW = "The landscape, honestly";

  // "\n" becomes a line break, so the title can be split as designed.
  var TITLE =
    "Serious platforms.\nNone built around what this market needs.";

  var SUB =
    "These platforms do important things but they weren't designed for " +
    "regulatory intelligence, obligation tracking, and long-term ownership " +
    "the way HawkOps was.";

  var HUB = { icon: "layers", caption: "Built for a\ndifferent reality" };

  var CARDS = [
    {
      icon: "database",
      title: "Ontology & data platforms",
      vendor: "(Palantir AIP + Foundry)",
      text:
        "The closest architectural neighbour but negotiated enterprise " +
        "subscriptions, no out-of-the-box regulatory content, and no " +
        "ownership of the technology at termination."
    },
    {
      icon: "gear",
      title: "Workflow & ERP platforms",
      vendor: "(ServiceNow, SAP Joule, IBM watsonx)",
      text:
        "Obligation registers still populated by people through forms; AI " +
        "assists rather than derives. All subscriptions stop paying, and " +
        "it's gone."
    },
    {
      icon: "people",
      title: "Copilots & agent builders",
      vendor: "(Microsoft Copilot Studio + Fabric)",
      text:
        "Build-it-yourself. Obligation tracking is something you'd " +
        "assemble, not something that ships. Cloud-only."
    },
    {
      icon: "bolt",
      title: "Agentic automation",
      vendor: "(UiPath Platform + Maestro)",
      text:
        "Superb execution but execution isn't custody. No operational " +
        "brain, no forecasting."
    }
  ];

  // Fade/rise the cards in as the section scrolls into view.
  var ANIMATE = true;
  /* -------------------------------------------------------------------- */

  /* ---- Icons ----------------------------------------------------------- */
  var STROKE_ICONS = {
    database:
      '<ellipse cx="12" cy="5.9" rx="7.5" ry="3"/>' +
      '<path d="M4.5 5.9v12.2c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V5.9"/>' +
      '<path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>',
    gear:
      '<circle cx="12" cy="12" r="3.1"/>' +
      '<path d="M12 3v2.3M12 18.7V21M21 12h-2.3M5.3 12H3' +
      'M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"/>',
    people:
      '<circle cx="9.4" cy="8.2" r="3.3"/>' +
      '<path d="M3.6 19.4c.5-3.2 2.8-5 5.8-5s5.3 1.8 5.8 5"/>' +
      '<path d="M16.4 6.4a3 3 0 0 1 0 5.7"/>' +
      '<path d="M17.8 15c2 .6 3.2 2.1 3.6 4.4"/>',
    bolt:
      '<path d="M13.4 2.8 4.9 13.5h6.1L10.6 21.2l8.5-10.7h-6.1z"/>'
  };

  // The hub glyph is solid, not stroked, so it holds its weight at 34px.
  var LAYERS =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' +
      '<path d="M12 2.6 22 7.4 12 12.2 2 7.4z"/>' +
      '<path d="M22 12 12 16.8 2 12l2.7-1.3L12 14.2l7.3-3.5z"/>' +
      '<path d="M22 16.4 12 21.2 2 16.4l2.7-1.3L12 18.6l7.3-3.5z"/>' +
    "</svg>";

  function icon(kind) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true">' +
        (STROKE_ICONS[kind] || STROKE_ICONS.gear) +
      "</svg>"
    );
  }

  /* ---- Connectors ------------------------------------------------------
     Fixed 380x420 box that occupies the middle column. Its left and
     right edges sit on the inner edge of the cards, so the dots land on
     the cards and the curves sweep into the ring at 45 degrees.
     -------------------------------------------------------------------- */
  var LINKS =
    '<svg class="wei-ls__links" viewBox="0 0 380 420" aria-hidden="true" ' +
      'focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<path d="M6 92C48 92 74 96 92 122"/>' +
        '<path d="M374 92C332 92 306 96 288 122"/>' +
        '<path d="M6 328C48 328 74 324 92 298"/>' +
        '<path d="M374 328C332 328 306 324 288 298"/>' +
      "</g>" +
      '<g fill="currentColor">' +
        '<circle cx="6" cy="92" r="4.5"/>' +
        '<circle cx="374" cy="92" r="4.5"/>' +
        '<circle cx="6" cy="328" r="4.5"/>' +
        '<circle cx="374" cy="328" r="4.5"/>' +
      "</g>" +
    "</svg>";

  // Dotted orbit around the hub.
  var RING =
    '<svg class="wei-ls__ring" viewBox="0 0 300 300" aria-hidden="true" ' +
      'focusable="false">' +
      '<circle cx="150" cy="150" r="146" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5 9"/>' +
    "</svg>";

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  /* ---- Build ----------------------------------------------------------- */
  function cardHTML(c, i) {
    return (
      '<article class="wei-ls__card" style="--ls-i:' + i + '">' +
        '<span class="wei-ls__badge">' + icon(c.icon) + "</span>" +
        '<div class="wei-ls__body">' +
          '<h3 class="wei-ls__card-title">' + esc(c.title) + "</h3>" +
          '<p class="wei-ls__vendor">' + esc(c.vendor) + "</p>" +
          '<p class="wei-ls__text">' + esc(c.text) + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  function buildSection() {
    var host =
      document.querySelector(SECTION + " .e-con-inner") ||
      document.querySelector(SECTION);

    if (!host) return false;                       // container not ready
    if (host.querySelector(".wei-ls")) return true; // already built

    host.insertAdjacentHTML(
      "beforeend",
      '<div class="wei-ls' + (ANIMATE ? " is-animated" : "") + '">' +
        '<header class="wei-ls__head">' +
          '<span class="wei-ls__bar"></span>' +
          '<p class="wei-ls__eyebrow">' + esc(EYEBROW) + "</p>" +
          '<h2 class="wei-ls__title">' + nl2br(TITLE) + "</h2>" +
          '<p class="wei-ls__sub">' + esc(SUB) + "</p>" +
        "</header>" +
        '<div class="wei-ls__stage">' +
          CARDS.map(cardHTML).join("") +
          '<div class="wei-ls__hub">' +
            LINKS +
            '<div class="wei-ls__orb">' +
              RING +
              '<div class="wei-ls__core">' +
                '<span class="wei-ls__core-icon">' + LAYERS + "</span>" +
                '<p class="wei-ls__caption">' + nl2br(HUB.caption) + "</p>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );

    if (ANIMATE) reveal(host.querySelector(".wei-ls"));
    return true;
  }

  function reveal(root) {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
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
      { threshold: 0.12 }
    );
    io.observe(root);
  }

  function init() {
    if (buildSection()) return;
    var obs = new MutationObserver(function () {
      if (buildSection()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { obs.disconnect(); }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
