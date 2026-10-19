/* =====================================================================
   HawkINT — "About HawkINT" section
   ---------------------------------------------------------------------
   The Elementor markup is fixed, so this script adds the two pieces CSS
   cannot, and pairs with second-section.css:

     - the "About HawkINT" eyebrow above the heading
     - an aria-hidden decoration layer (orb, dot fields, ring outlines)
       behind the content

   The heading, paragraph and dashboard image are never touched. If the
   script does not run, the section keeps its layout, type and gradient
   from the CSS and only loses these two additions.

   If the live container uses a different class, change SECTION — it is
   the only selector this file depends on.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".hawk-int-2";

  /* ---- Content (edit freely) ------------------------------------------ */
  // Small label above the heading; the CSS sets it in capitals.
  // Set to "" to drop it.
  var EYEBROW = "About HawkINT";

  // Faint shapes behind the content. false drops them.
  var DECOR = true;
  /* -------------------------------------------------------------------- */

  function build() {
    var section = document.querySelector(SECTION);
    if (!section) return false;                       // container not ready

    var heading = section.querySelector(".elementor-widget-heading");
    if (!heading) return false;                       // children not parsed yet
    if (section.classList.contains("hi-about")) return true; // already built

    section.classList.add("hi-about");

    if (EYEBROW) {
      var eyebrow = document.createElement("p");
      eyebrow.className = "hi-about__eyebrow";
      // It repeats the heading, so screen readers skip it.
      eyebrow.setAttribute("aria-hidden", "true");
      eyebrow.textContent = EYEBROW;
      heading.parentNode.insertBefore(eyebrow, heading);
    }

    if (DECOR) {
      section.insertAdjacentHTML(
        "afterbegin",
        '<div class="hi-about__decor" aria-hidden="true">' +
          '<span class="hi-about__orb"></span>' +
          '<span class="hi-about__dots hi-about__dots--tr"></span>' +
          '<span class="hi-about__dots hi-about__dots--bl"></span>' +
          '<span class="hi-about__ring"></span>' +
          '<span class="hi-about__ring hi-about__ring--outer"></span>' +
        "</div>"
      );
    }

    return true;
  }

  function init() {
    if (build()) return;
    var obs = new MutationObserver(function () {
      if (build()) obs.disconnect();
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
