/* ============================================================
   Footer Badges — make the inline SVG badges render
   Scope: .footer-badges (Elementor Social Icons widget)

   The badge SVGs only have width/height (400x400, 300x300, 522x478)
   and no viewBox. Elementor shrinks every icon SVG to 1em, so without
   a viewBox the browser crops each badge to its empty top-left corner
   instead of scaling it, leaving a blank tile. Adding the viewBox lets
   the artwork scale down to the icon size.
   ============================================================ */

(function () {
  "use strict";

  function fixBadges() {
    var svgs = document.querySelectorAll(".footer-badges .elementor-social-icon svg");

    Array.prototype.forEach.call(svgs, function (svg) {
      if (svg.hasAttribute("viewBox")) return;

      var w = parseFloat(svg.getAttribute("width"));
      var h = parseFloat(svg.getAttribute("height"));
      if (!w || !h) return;

      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixBadges);
  } else {
    fixBadges();
  }
})();
