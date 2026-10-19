/* =====================================================================
   HawkINT — "How HawkINT Works" section
   ---------------------------------------------------------------------
   Everything visual is in section-4.css, and the section looks the same
   whether or not this runs. The script only makes the markup changes
   CSS cannot:

     - hides the three check icons from screen readers; the list already
       says what they mean, and an icon-font glyph is otherwise read out
       as an odd character or skipped unpredictably
     - optionally gives the shield image alt text. It ships with alt="",
       which correctly marks it as decorative, so this is off by default

   The label, heading, paragraph, list and image are otherwise untouched.

   If the live container uses a different class, change SECTION — it is
   the only selector this file depends on.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".hawk-int-4";

  /* ---- Content (edit freely) ------------------------------------------ */
  // Alt text for the shield image. Leave "" to keep it decorative.
  var IMAGE_ALT = "";
  /* -------------------------------------------------------------------- */

  function build() {
    var section = document.querySelector(SECTION);
    if (!section) return false;                       // container not ready

    var checks = section.querySelectorAll(".about-list .check");
    if (!checks.length) return false;                 // children not parsed yet
    if (section.classList.contains("hi-works")) return true; // already built

    section.classList.add("hi-works");

    Array.prototype.forEach.call(checks, function (check) {
      check.setAttribute("aria-hidden", "true");
    });

    var img = section.querySelector(".about6 .image img");
    if (img && IMAGE_ALT && !img.getAttribute("alt")) {
      img.setAttribute("alt", IMAGE_ALT);
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
