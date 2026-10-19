/* =====================================================================
   WEI / HawkOps — "See it running" closing call to action
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects the
   section markup into the container matched by SECTION below and pairs
   with walkthrough-cta.css.

   Same tinted band as the AI Governance closing CTA: headline on the
   left, copy and the request button on the right.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".walkthrough-cta";

  /* ---- Content (edit freely) -----------------------------------------

     In TITLE, "\n" becomes a line break and [[double brackets]] set that
     run in the accent colour.
     -------------------------------------------------------------------- */
  var TITLE = "See it running before you [[believe any of this.]]";

  var LEAD =
    "A live environment is available for a technical walkthrough the " +
    "operations panel, one obligation end to end, the agent configuration " +
    "surface, a full council deliberation, and the deployment options.";

  var CLOSER =
    "Everything your organization knows, read into one brain. Agents " +
    "watching it every day. A council forecasting from it running where " +
    "your data has to stay, on a system you own.";

  var CTA = { label: "Request a Live Walkthrough", href: "https://cybrhawk.com/request-for-demo/" };

  // Secondary button beside the CTA — same shape, outlined instead of solid.
  // Set to null to drop it.
  var CTA_SECONDARY = { label: "Download the HawkOps", href: "https://drive.google.com/drive/folders/11YqDjrFycwXk4JYFjqdcyi47Cjsh60Dl?usp=sharing" };

  // Fade/rise the band in as the section scrolls into view.
  var ANIMATE = true;
  /* -------------------------------------------------------------------- */

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' +
      '<path d="M4.5 12h14M13 6.5 18.5 12 13 17.5"/>' +
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

  // Escape first, then promote [[…]] to an accent span.
  function markup(s) {
    return nl2br(s).replace(/\[\[(.+?)\]\]/g, function (_, run) {
      return '<span class="wei-wt__accent">' + run + "</span>";
    });
  }

  /* ---- Build ----------------------------------------------------------- */
  function buildSection() {
    var host =
      document.querySelector(SECTION + " .e-con-inner") ||
      document.querySelector(SECTION);

    if (!host) return false;                       // container not ready
    if (host.querySelector(".wei-wt")) return true; // already built

    host.insertAdjacentHTML(
      "beforeend",
      '<div class="wei-wt' + (ANIMATE ? " is-animated" : "") + '">' +
        '<div class="wei-wt__band">' +
          '<div class="wei-wt__band-inner">' +
            '<h2 class="wei-wt__title">' + markup(TITLE) + "</h2>" +
            '<div class="wei-wt__action">' +
              '<p class="wei-wt__lead">' + esc(LEAD) + "</p>" +
              '<div class="wei-wt__buttons">' +
                (CTA && CTA.label
                  ? '<a class="wei-wt__btn" href="' + esc(CTA.href || "#") +
                      '">' + esc(CTA.label) + ARROW +
                    "</a>"
                  : "") +
                (CTA_SECONDARY && CTA_SECONDARY.label
                  ? '<a class="wei-wt__btn wei-wt__btn--ghost" href="' +
                      esc(CTA_SECONDARY.href || "#") + '">' +
                      esc(CTA_SECONDARY.label) + ARROW +
                    "</a>"
                  : "") +
              "</div>" +
              (CLOSER
                ? '<p class="wei-wt__closer">' + esc(CLOSER) + "</p>"
                : "") +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );

    if (ANIMATE) reveal(host.querySelector(".wei-wt"));
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
