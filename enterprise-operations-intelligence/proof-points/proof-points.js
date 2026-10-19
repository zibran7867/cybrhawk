/* =====================================================================
   "Proof points" section
   ---------------------------------------------------------------------
   The Elementor container markup is fixed:

     <div class="... proof-points e-con-full ..."></div>

   We can only add JS + CSS, so this script injects the section markup
   into `.proof-points` (or its `.e-con-inner` if the container is boxed)
   and pairs with proof-points.css.

   Layout: copy + cards on the LEFT, visual on the RIGHT.
   Flip it by setting MEDIA_SIDE = "left" below — nothing else changes.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Content (edit freely) ----------------------------------------- */
  var EYEBROW = "Proof points";

  var TITLE = { lead: "Nothing asserted ", accent: "without proof." };

  // Drop the render in next to this file (or point at a WP upload URL).
  // If the file is missing the media column falls back to a soft frame
  // instead of showing a broken image.
  var IMAGE = {
    src: "https://cybrhawk.com/wp-content/uploads/2026/09/proof-points-image.webp",
    alt: "Indexed knowledge core feeding sourced answers, audit and controls"
  };

  var MEDIA_SIDE = "right"; // "left" | "right"

  var CARDS = [
    {
      icon: "database",
      title: "Read once, indexed forever",
      text: "A typical query costs ~12,400 tokens against the index instead " +
            "of ~206,000 reading the estate directly."
    },
    {
      icon: "sourced",
      title: "Every answer is sourced",
      text: "Every alert and report line keeps a pointer to the source " +
            "document and page it came from."
    },
    {
      icon: "cubes",
      title: "Model-agnostic by design",
      text: "Local models where data can't leave, frontier models where " +
            "depth pays."
    },
    {
      icon: "shield",
      title: "Full audit trail",
      text: "Every run, change, restart, and answer is logged and traceable."
    }
  ];

  // Fade/rise the cards in as the section scrolls into view.
  var ANIMATE = true;
  /* -------------------------------------------------------------------- */

  var GRAD =
    '<defs>' +
      '<linearGradient id="ppg-%ID%" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="%A%"/>' +
        '<stop offset="100%" stop-color="%B%"/>' +
      '</linearGradient>' +
    '</defs>';

  function grad(id, a, b) {
    return GRAD.replace("%ID%", id).replace("%A%", a).replace("%B%", b);
  }

  var ICONS = {
    // Stacked disks — the index
    database:
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        grad("db", "#4c8dff", "#1d4ed8") +
        '<g fill="url(#ppg-db)">' +
          '<ellipse cx="24" cy="12" rx="15" ry="6"/>' +
          '<path d="M9 12v8c0 3.3 6.7 6 15 6s15-2.7 15-6v-8c0 3.3-6.7 6-15 6S9 15.3 9 12z" opacity=".8"/>' +
          '<path d="M9 24v8c0 3.3 6.7 6 15 6s15-2.7 15-6v-8c0 3.3-6.7 6-15 6S9 27.3 9 24z" opacity=".55"/>' +
        "</g>" +
      "</svg>",

    // Document + magnifier — the citation
    sourced:
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        grad("src", "#7c6cff", "#4338ca") +
        '<path fill="url(#ppg-src)" d="M11 5h17l9 9v29H11z" opacity=".9"/>' +
        '<path fill="#fff" opacity=".45" d="M28 5l9 9h-9z"/>' +
        '<g fill="#fff" opacity=".85">' +
          '<rect x="16" y="17" width="12" height="2.4" rx="1.2"/>' +
          '<rect x="16" y="23" width="9" height="2.4" rx="1.2"/>' +
        "</g>" +
        '<circle cx="30" cy="31" r="7.5" fill="none" stroke="url(#ppg-src)" stroke-width="3"/>' +
        '<path stroke="url(#ppg-src)" stroke-width="3.4" stroke-linecap="round" d="M35.5 36.5L41 42"/>' +
      "</svg>",

    // Cubes — swappable models
    cubes:
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        grad("cb", "#8b5cf6", "#5b21b6") +
        '<g fill="url(#ppg-cb)">' +
          '<path d="M24 4l10 5.8v11.6L24 27l-10-5.6V9.8z"/>' +
          '<path d="M13 22l10 5.8v11.6L13 45 3 39.4V27.8z" opacity=".75"/>' +
          '<path d="M35 22l10 5.8v11.6L35 45l-10-5.6V27.8z" opacity=".55"/>' +
        "</g>" +
      "</svg>",

    // Shield + check — the audit trail
    shield:
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        grad("sh", "#4c8dff", "#1e40af") +
        '<path fill="url(#ppg-sh)" d="M24 3l17 6.5v12.9C41 33.2 33.6 41.4 24 45c-9.6-3.6-17-11.8-17-22.6V9.5z"/>' +
        '<path fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" ' +
          'stroke-linejoin="round" d="M16.5 23.5l5.5 5.5 10-10"/>' +
      "</svg>"
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function buildSection() {
    var host =
      document.querySelector(".proof-points .e-con-inner") ||
      document.querySelector(".proof-points");

    if (!host) return false;                     // container not ready
    if (host.querySelector(".wei-pp")) return true; // already built

    var cardsHTML = CARDS.map(function (c, i) {
      return (
        '<article class="wei-pp__card" style="--pp-i:' + i + '">' +
          '<div class="wei-pp__card-head">' +
            '<span class="wei-pp__num">' + pad(i + 1) + "</span>" +
            '<span class="wei-pp__icon">' + (ICONS[c.icon] || "") + "</span>" +
          "</div>" +
          '<h3 class="wei-pp__card-title">' + esc(c.title) + "</h3>" +
          '<p class="wei-pp__card-text">' + esc(c.text) + "</p>" +
        "</article>"
      );
    }).join("");

    var mediaHTML =
      '<div class="wei-pp__media">' +
        '<figure class="wei-pp__frame">' +
          '<img class="wei-pp__img" src="' + esc(IMAGE.src) + '" ' +
               'alt="' + esc(IMAGE.alt) + '" loading="lazy" decoding="async">' +
        "</figure>" +
      "</div>";

    var contentHTML =
      '<div class="wei-pp__content">' +
        '<p class="wei-pp__eyebrow">' +
          '<span class="wei-pp__eyebrow-line"></span>' + esc(EYEBROW) +
        "</p>" +
        '<h2 class="wei-pp__title">' + esc(TITLE.lead) +
          '<span class="wei-pp__title-accent">' + esc(TITLE.accent) + "</span>" +
        "</h2>" +
        '<div class="wei-pp__grid">' + cardsHTML + "</div>" +
      "</div>";

    host.insertAdjacentHTML(
      "beforeend",
      '<div class="wei-pp wei-pp--media-' + (MEDIA_SIDE === "right" ? "right" : "left") +
        (ANIMATE ? " is-animated" : "") + '">' +
        mediaHTML + contentHTML +
      "</div>"
    );

    var root = host.querySelector(".wei-pp");

    // No render on disk yet? Keep the frame, drop the broken-image icon.
    var img = root.querySelector(".wei-pp__img");
    img.addEventListener("error", function () {
      root.querySelector(".wei-pp__frame").classList.add("is-empty");
      img.remove();
    });

    if (ANIMATE) reveal(root);
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
      { threshold: 0.15 }
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
