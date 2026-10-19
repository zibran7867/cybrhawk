/* =====================================================================
   HawkINT — "HawkINT in Numbers" section
   ---------------------------------------------------------------------
   The Elementor markup is fixed, so this script makes the few changes
   CSS cannot, and pairs with section-3.css:

     - splits each metric into its figure and its label
       ("12,000+" / "bots") so the figure can lead; the wording is
       untouched and still reads as one phrase
     - unwraps the metric from its link when the link has no URL
       (href="" only reloads the page); a real URL is kept
     - exposes the eight cards as a list, and hides the 01–08 step
       numbers from screen readers, since the list already counts them

   If the script does not run, the section keeps its layout, cards and
   background from the CSS, with each metric on a single line.

   If the live container uses a different class, change SECTION — it is
   the only selector this file depends on.
   ===================================================================== */
(function () {
  "use strict";

  // The container's class reads "hark-int-3" today; both are accepted.
  var SECTION = ".hawk-int-3, .hark-int-3";

  // Leading figure, with an optional K/M/B/T and "+": 12,000+  20M+  100B+
  var FIGURE = /^(\d[\d.,]*\s?[KMBT]?\+?)\s+(.+)$/i;

  function isEmptyLink(link) {
    var href = (link.getAttribute("href") || "").trim();
    return href === "" || href === "#";
  }

  function splitMetric(title) {
    var link = title.querySelector("a");
    var text = title.textContent.replace(/\s+/g, " ").trim();
    var match = text.match(FIGURE);
    if (!match) return;                               // not a figure, leave as written

    var host = title;
    if (link && !isEmptyLink(link)) {
      host = link;                                    // keep a real link around the text
    } else if (link) {
      title.removeChild(link);
    }
    host.textContent = "";

    var value = document.createElement("span");
    value.className = "hi-stats__value";
    value.textContent = match[1];

    var label = document.createElement("span");
    label.className = "hi-stats__label";
    label.textContent = match[2];

    // The space keeps "12,000+ bots" as one phrase for screen readers.
    host.appendChild(value);
    host.appendChild(document.createTextNode(" "));
    host.appendChild(label);
  }

  function build() {
    var section = document.querySelector(SECTION);
    if (!section) return false;                       // container not ready
    if (section.classList.contains("hi-stats")) return true; // already built

    var cards = section.querySelectorAll(".work4-box");
    if (!cards.length) return false;                  // children not parsed yet

    section.classList.add("hi-stats");

    var grid = section.querySelector(".e-grid");
    if (grid) {
      grid.setAttribute("role", "list");
      Array.prototype.forEach.call(grid.children, function (item) {
        item.setAttribute("role", "listitem");
      });
    }

    Array.prototype.forEach.call(cards, function (card) {
      var step = card.querySelector("span.after");
      if (step) {
        step.textContent = step.textContent.trim();   // " 02" → "02"
        if (grid) step.setAttribute("aria-hidden", "true");
      }

      var title = card.querySelector("h4");
      if (title) splitMetric(title);
    });

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

  // Run on the finished DOM so all eight cards are there.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
