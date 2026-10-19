/* =====================================================================
   WEI / HawkOps — "How it works" + "The whole path"
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects the
   section markup into the container matched by SECTION below and pairs
   with how-it-works.css.

   Two blocks on one tinted split: the three layers of intelligence,
   then the pipeline from source systems to decisions. Both sets of
   connectors are drawn in CSS off the item width, so adding or removing
   a step needs no other change than the breakpoint list.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".how-it-works";

  /* ---- Content (edit freely) -----------------------------------------

     LAYERS are numbered 01, 02, … from the array order.
     STAGES icons are one of: document | database | share | chart

     In either title, "\n" becomes a line break and [[double brackets]]
     set that run in the accent colour.
     -------------------------------------------------------------------- */
  var EYEBROW = "How it works";

  var TITLE = "One brain. [[Three layers of intelligence.]]";

  var SUB =
    "HawkOps reads the documents and records your organization already " +
    "produces, distills them into a single indexed operational brain, and " +
    "puts three layers of intelligence on top:";

  var LAYERS = [
    {
      title: "Modules",
      text: "Eight live views, one per area, all reading the same brain."
    },
    {
      title: "Agents",
      text:
        "Scheduled, supervised automations that watch obligations and " +
        "anomalies daily."
    },
    {
      title: "Council",
      text:
        "Five configurable analyst agents that forecast and simulate " +
        "scenarios."
    }
  ];

  var LAYERS_NOTE =
    "Each deployment is built for the organization it serves and runs " +
    "where its data has to stay.";

  /* ---- The whole path -------------------------------------------------- */
  var PATH_EYEBROW = "The whole path";

  var PATH_TITLE = "From your systems to decisions [[the whole path.]]";

  var SOURCES_LABEL = "Sources:";

  var SOURCES = [
    "SharePoint/Drive",
    "File shares",
    "Email",
    "ERP/CRM",
    "Payroll/HRIS",
    "Access control",
    "MES",
    "Official public sources"
  ];

  var STAGES = [
    {
      icon: "document",
      title: "Ingestion\n(The Archivist)",
      text: "One connector per system, reading each document once.",
      more:
        "Parallel sub-agent crews read once, extract fields, keep a pointer " +
        "to the page. Historical estate is read at build; new and changed " +
        "documents are picked up continuously after."
    },
    {
      icon: "database",
      title: "The Brain",
      text: "An indexed knowledge map of your whole estate.",
      more:
        "What exists, what it obliges, who owns it, when it expires, where " +
        "the original lives. Every field keeps a pointer back to source. " +
        "Self-diagnostics score integrity, freshness, orphans, duplicates " +
        "and coverage."
    },
    {
      icon: "share",
      title: "Modules / Agents /\nCouncil",
      text:
        "Eight live views · scheduled and supervised agents · a five-seat " +
        "forecasting council."
    },
    {
      icon: "chart",
      title: "Out",
      text:
        "Alerts to owners · reports with folio · sourced answers · " +
        "forecasts with range."
    }
  ];

  // Wording for the toggle on the stages that carry `more`.
  var MORE_LABEL = "Read more";
  var LESS_LABEL = "Show less";

  // Fade/rise the content in as the section scrolls into view.
  var ANIMATE = true;
  /* -------------------------------------------------------------------- */

  /* ---- Icons ----------------------------------------------------------- */
  var ICONS = {
    document:
      '<path d="M14 2.9H7.4a2 2 0 0 0-2 2v14.2a2 2 0 0 0 2 2h9.2a2 2 0 0 0 ' +
        '2-2V7.9z"/>' +
      '<polyline points="13.9 2.9 13.9 8 19 8"/>',
    database:
      '<ellipse cx="12" cy="5.9" rx="7.5" ry="3"/>' +
      '<path d="M4.5 5.9v12.2c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V5.9"/>' +
      '<path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>',
    share:
      '<circle cx="17.6" cy="5.8" r="2.8"/>' +
      '<circle cx="6.4" cy="12" r="2.8"/>' +
      '<circle cx="17.6" cy="18.2" r="2.8"/>' +
      '<path d="m8.9 10.7 6.2-3.4M8.9 13.3l6.2 3.4"/>',
    chart:
      '<path d="M4.6 19.6V13M12 19.6V6.6M19.4 19.6v-8.4"/>'
  };

  function icon(kind) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true">' +
        (ICONS[kind] || ICONS.document) +
      "</svg>"
    );
  }

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  // Escape first, then promote [[…]] to an accent span.
  function markup(s) {
    return nl2br(s).replace(/\[\[(.+?)\]\]/g, function (_, run) {
      return '<span class="wei-hw__accent">' + run + "</span>";
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* ---- Build ----------------------------------------------------------- */
  function layerHTML(l, i) {
    return (
      '<li class="wei-hw__layer" style="--hw-i:' + i + '">' +
        '<span class="wei-hw__num">' + pad(i + 1) + "</span>" +
        '<h3 class="wei-hw__layer-title">' + esc(l.title) + "</h3>" +
        '<p class="wei-hw__layer-text">' + esc(l.text) + "</p>" +
      "</li>"
    );
  }

  /* `text` always shows. A stage only gets a toggle if it carries `more`,
     so the two short stages stay plain — no empty button under them.

     The two halves are one paragraph: `more` is an inline continuation of
     `text`, not a block beneath it, so opening it reads as the sentence
     simply carrying on. */
  function stageHTML(s, i) {
    var id = "wei-hw-more-" + i;

    return (
      '<li class="wei-hw__stage" style="--hw-j:' + i + '">' +
        '<div class="wei-hw__card">' +
          '<span class="wei-hw__icon">' + icon(s.icon) + "</span>" +
          '<h3 class="wei-hw__stage-title">' + nl2br(s.title) + "</h3>" +
        "</div>" +
        '<p class="wei-hw__stage-text">' +
          esc(s.text) +
          (s.more
            ? '<span class="wei-hw__more" id="' + id + '"> ' +
                esc(s.more) +
              "</span>"
            : "") +
        "</p>" +
        (s.more
          ? '<button type="button" class="wei-hw__toggle" ' +
              'aria-expanded="false" aria-controls="' + id + '">' +
              esc(MORE_LABEL) +
            "</button>"
          : "") +
      "</li>"
    );
  }

  function buildSection() {
    var host =
      document.querySelector(SECTION + " .e-con-inner") ||
      document.querySelector(SECTION);

    if (!host) return false;                       // container not ready
    if (host.querySelector(".wei-hw")) return true; // already built

    var sources = SOURCES.map(function (s) {
      return '<span class="wei-hw__source">' + esc(s) + "</span>";
    }).join("");

    host.insertAdjacentHTML(
      "beforeend",
      '<div class="wei-hw' + (ANIMATE ? " is-animated" : "") + '">' +

        // ---- Block 1: the three layers ------------------------------
        '<div class="wei-hw__block wei-hw__block--layers">' +
          '<div class="wei-hw__measure">' +
            '<header class="wei-hw__head">' +
              '<p class="wei-hw__eyebrow">' + esc(EYEBROW) + "</p>" +
              '<h2 class="wei-hw__title">' + markup(TITLE) + "</h2>" +
              '<p class="wei-hw__sub">' + esc(SUB) + "</p>" +
            "</header>" +
            '<ol class="wei-hw__layers">' +
              LAYERS.map(layerHTML).join("") +
            "</ol>" +
            (LAYERS_NOTE
              ? '<p class="wei-hw__note">' + esc(LAYERS_NOTE) + "</p>"
              : "") +
          "</div>" +
        "</div>" +

        // ---- Block 2: the pipeline ----------------------------------
        '<div class="wei-hw__block wei-hw__block--path">' +
          '<div class="wei-hw__measure">' +
            '<header class="wei-hw__head">' +
              '<p class="wei-hw__eyebrow">' + esc(PATH_EYEBROW) + "</p>" +
              '<h2 class="wei-hw__title">' + markup(PATH_TITLE) + "</h2>" +
              '<p class="wei-hw__sources">' +
                '<span class="wei-hw__sources-label">' +
                  esc(SOURCES_LABEL) +
                "</span>" + sources +
              "</p>" +
            "</header>" +
            '<ol class="wei-hw__stages">' +
              STAGES.map(stageHTML).join("") +
            "</ol>" +
          "</div>" +
        "</div>" +
      "</div>"
    );

    var root = host.querySelector(".wei-hw");
    bindToggles(root);

    if (ANIMATE) reveal(root);
    return true;
  }

  /* ---- Read more / show less --------------------------------------------
     Delegated from the list, so it keeps working if STAGES changes.
     -------------------------------------------------------------------- */
  function bindToggles(root) {
    var list = root.querySelector(".wei-hw__stages");
    if (!list) return;

    list.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".wei-hw__toggle");
      if (!btn) return;

      var more = document.getElementById(btn.getAttribute("aria-controls"));
      if (!more) return;

      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");

      more.classList.toggle("is-open", !open);
      btn.textContent = open ? MORE_LABEL : LESS_LABEL;
    });
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
      { threshold: 0.08 }
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
