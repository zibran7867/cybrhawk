/* =====================================================================
   Homepage popup (walkthrough offer)
   ---------------------------------------------------------------------
   The Elementor container markup is fixed:

     <div class="... popup ...">
        <div class="e-con-inner"></div>
     </div>

   We can only add JS + CSS. This script builds a card inside a
   `.cybrhawk-pop-portal` element appended to <body> (NOT inside the
   Elementor `.popup` container — Elementor puts transforms on its
   containers, which break position:fixed). popup.css pins the portal
   to the bottom-right corner. It only builds on the HOMEPAGE and only
   on pages that contain the `.popup` element.

   Timing: it shows on EVERY page load / refresh. There is no memory and
   no interval — reload the homepage and it appears again shortly after
   the page paints (after DELAY_MS).

   Testing: `cybrhawkPopup.open()` shows it immediately; `cybrhawkPopup.close()`
   hides it.
   ===================================================================== */
(function () {
    "use strict";

    /* ---- Behaviour (edit freely) --------------------------------------- */
    // Small delay before the popup appears (milliseconds) — so it doesn't
    // pop the instant the page paints. It shows on every load / refresh.
    var DELAY_MS = 1200;

    /* ---- Content (edit freely) ----------------------------------------- */
    var EYEBROW = "Book a live walkthrough";

    // Accent word is painted blue: "Watch CybrHawk work [on your alerts]".
    var TITLE = { lead: "Watch CybrHawk work ", accent: "on your alerts" };

    var LEAD =
        "We'll show how CybrHawk investigates, decides and " +
        "documents every alert — walked through on cases from an environment " +
        "like yours. No slide deck, just the product doing the work.";

    // The main button. Clicking it sends the visitor to this page.
    var CTA = { label: "SOC Analyst", href: "https://cybrhawk.com/soc-analyst/" };
    var DOWNLOAD_REPORT = { label: "Download Fortibleed Report", href: "https://cybrhawk.com/download-report/" };

    var DISMISS_LABEL = "Maybe later";

    var LOAD_FONT = true;
    /* -------------------------------------------------------------------- */

    var ARROW =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/>' +
        '<polyline points="12 5 19 12 12 19"/></svg>';

    var CLOSE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/>' +
        '<line x1="6" y1="6" x2="18" y2="18"/></svg>';

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return "&#" + c.charCodeAt(0) + ";";
        });
    }

    function loadFont() {
        if (!LOAD_FONT || document.getElementById("cybrhawk-condensed-font")) return;
        var l = document.createElement("link");
        l.id = "cybrhawk-condensed-font";
        l.rel = "stylesheet";
        l.href =
            "https://fonts.googleapis.com/css2?family=Barlow+Condensed:" +
            "ital,wght@0,600;0,700;0,800;1,700;1,800;1,900" +
            "&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
        document.head.appendChild(l);
    }

    /* ---- Homepage gate -------------------------------------------------- */
    // True only on the site homepage. Strips a trailing slash so "/" becomes
    // "" and treats "" / "/index.php" / "/home" as the homepage.
    function isHomepage() {
        var p = window.location.pathname.replace(/\/+$/, "");
        return p === "" || p === "/index.php" || p === "/index.html" || p === "/home";
    }

    /* ---- State ---------------------------------------------------------- */
    var overlay = null;    // the .cybrhawk-pop-portal element (on <body>)
    var card = null;       // the injected .cybrhawk-pop card
    var opened = false;    // has the popup been opened this session?
    var openTimer = null;

    function buildPopup() {
        if (document.querySelector(".cybrhawk-pop-portal")) return true;  // already built
        // Homepage only — bail on every other page.
        if (!isHomepage()) return false;
        // Only build on pages that actually contain the Elementor .popup element.
        if (!document.querySelector(".popup")) return false;

        // Render into a portal on <body>, not inside .popup — see file header.
        overlay = document.createElement("div");
        overlay.className = "cybrhawk-pop-portal";
        overlay.setAttribute("aria-hidden", "true");   // hidden until opened

        overlay.innerHTML =
            '<div class="cybrhawk-pop" role="dialog" ' +
            'aria-labelledby="cybrhawk-pop-title" aria-describedby="cybrhawk-pop-lead">' +

            '<button type="button" class="cybrhawk-pop__close" aria-label="Close">' +
            CLOSE_ICON +
            "</button>" +

            '<div class="cybrhawk-pop__body">' +
            '<p class="cybrhawk-pop__eyebrow">' +
            '<span class="cybrhawk-pop__eyebrow-line"></span>' + esc(EYEBROW) +
            "</p>" +
            '<h2 class="cybrhawk-pop__title" id="cybrhawk-pop-title">' + esc(TITLE.lead) +
            '<span class="cybrhawk-pop__title-accent">' + esc(TITLE.accent) +
            "</span></h2>" +
            '<p class="cybrhawk-pop__lead" id="cybrhawk-pop-lead">' + esc(LEAD) + "</p>" +

            '<div class="cybrhawk-pop__actions">' +
            '<a class="cybrhawk-pop__cta cybrhawk-pop__cta--primary" href="' +
            esc(CTA.href) + '">' +
            '<span class="cybrhawk-pop__cta-label">' + esc(CTA.label) + "</span>" +
            '<span class="cybrhawk-pop__cta-arrow">' + ARROW + "</span>" +
            "</a>" +
            '<a class="cybrhawk-pop__cta cybrhawk-pop__cta--ghost" href="' +
            esc(DOWNLOAD_REPORT.href) + '">' +
            '<span class="cybrhawk-pop__cta-label">' + esc(DOWNLOAD_REPORT.label) +
            "</span>" +
            "</a>" +
            "</div>" +

            '<div class="cybrhawk-pop__foot">' +
            '<button type="button" class="cybrhawk-pop__dismiss">' +
            esc(DISMISS_LABEL) + "</button>" +
            "</div>" +
            "</div>" +
            "</div>";

        document.body.appendChild(overlay);

        card = overlay.querySelector(".cybrhawk-pop");
        wire();
        return true;
    }

    /* ---- Open / close --------------------------------------------------- */
    /* This is a non-blocking corner popup, not a modal: it doesn't dim or
       lock the page, and it doesn't steal or trap keyboard focus. */
    function open() {
        if (!overlay || opened) return;
        opened = true;
        overlay.classList.add("cybrhawk-pop-open");
        overlay.setAttribute("aria-hidden", "false");
    }

    function close() {
        if (!overlay) return;
        overlay.classList.remove("cybrhawk-pop-open");
        overlay.setAttribute("aria-hidden", "true");
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
    }

    function isOpen() {
        return !!overlay && overlay.classList.contains("cybrhawk-pop-open");
    }

    /* ---- Wire up interactions ------------------------------------------ */
    function wire() {
        var closeBtn = card.querySelector(".cybrhawk-pop__close");
        var dismissBtn = card.querySelector(".cybrhawk-pop__dismiss");

        if (closeBtn) closeBtn.addEventListener("click", close);
        if (dismissBtn) dismissBtn.addEventListener("click", close);

        // Esc closes the popup while it's open.
        document.addEventListener("keydown", function (e) {
            if (isOpen() && e.key === "Escape") { e.preventDefault(); close(); }
        });
    }

    /* ---- Show logic ----------------------------------------------------- */
    function maybeOpen() {
        // No memory, no interval — show once shortly after every page load.
        openTimer = window.setTimeout(open, DELAY_MS);
    }

    function init() {
        loadFont();

        // Expose a tiny console API for testing / manual triggering.
        window.cybrhawkPopup = {
            open: open,
            close: close
        };

        if (buildPopup()) { maybeOpen(); return; }

        var obs = new MutationObserver(function () {
            if (buildPopup()) { obs.disconnect(); maybeOpen(); }
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
