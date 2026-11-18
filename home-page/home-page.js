/* ============================================================
   Modern Home Hero — Lightweight Enhancements
   Requires: jQuery
   Scope: .modern-home-page-hero-section
   ============================================================ */

(function ($) {
  "use strict";

  // Without jQuery, skip the enhancements but still reveal the copy —
  // the CSS keeps it hidden until it gets .is-in. Returning (instead of
  // throwing) also lets the other sections in this file still run.
  if (!$) {
    var showHero = function () {
      document.querySelectorAll(
        ".modern-home-page-hero-section .main-heading h1," +
        ".modern-home-page-hero-section .main-heading p," +
        ".modern-home-page-hero-section .main-heading .buttons"
      ).forEach(function (el) { el.classList.add("is-in"); });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showHero);
    } else {
      showHero();
    }
    return;
  }

  function initModernHero($section) {
    if (!$section.length || $section.data("mhpInit")) return;
    $section.data("mhpInit", true);

    var $heading = $section.find(".main-heading").first();
    var $h1 = $heading.find("h1").first();
    var $paragraph = $heading.find("p").first();
    var $buttons = $heading.find(".buttons").first();
    if (!$heading.length) return;

    /* 1. Eyebrow badge */
    if (!$heading.find(".mhp-eyebrow").length) {
      $heading.prepend(
        '<span class="mhp-eyebrow">' +
        '<span class="mhp-dot"></span>' +
        '<span>Unified Cyber Defense Platform</span>' +
        '</span>'
      );
    }

    /* 2. Gradient highlight on the last clause of the H1 */
    if ($h1.length && !$h1.find(".mhp-highlight").length) {
      var raw = $.trim($h1.text());
      var newHtml;
      var parts = raw.split(/\.\s*/).filter(Boolean);
      if (parts.length > 1) {
        var last = parts.pop();
        var leading = parts.join(". ") + ". ";
        newHtml =
          $("<div/>").text(leading).html() +
          '<span class="mhp-highlight">' +
          $("<div/>").text(last).html() +
          "</span>";
      } else {
        var words = raw.split(/\s+/);
        var tailCount = Math.min(2, words.length);
        var tail = words.splice(words.length - tailCount, tailCount).join(" ");
        newHtml =
          $("<div/>").text(words.join(" ") + " ").html() +
          '<span class="mhp-highlight">' +
          $("<div/>").text(tail).html() +
          "</span>";
      }
      $h1.html(newHtml);
    }

    /* 3. Feature badges row (icon circle + label, separated by vertical dividers) */
    if (!$heading.find(".mhp-stats").length && $buttons.length) {
      var EYE_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>' +
        '<circle cx="12" cy="12" r="3"/>' +
        '</svg>';
      var BOLT_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/>' +
        '</svg>';
      var SHIELD_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
        '<path d="M9 12l2 2 4-4"/>' +
        '</svg>';

      var features = [
        { icon: EYE_SVG, label: "Unified Visibility." },
        { icon: BOLT_SVG, label: "Intelligent Response." },
        { icon: SHIELD_SVG, label: "Operational Resilience." }
      ];
      var $stats = $('<div class="mhp-stats"></div>');
      $.each(features, function (_, f) {
        $stats.append(
          '<div class="mhp-feature">' +
          '<span class="mhp-feature-icon">' + f.icon + '</span>' +
          '<span class="mhp-feature-label">' + f.label + '</span>' +
          '</div>'
        );
      });
      $buttons.after($stats);
    }

    /* 4. Entrance reveal */
    var targets = [
      $heading.find(".mhp-eyebrow")[0],
      $h1[0],
      $paragraph[0],
      $buttons[0],
      $heading.find(".mhp-stats")[0]
    ].filter(Boolean);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0 }
      );
      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  $(function () {
    $(".modern-home-page-hero-section").each(function () {
      initModernHero($(this));
    });
  });
})(window.jQuery || window.$);
/* =====================================================================
   CybrHawk — "Five solutions" cards section
   ---------------------------------------------------------------------
   No HTML needed: add an empty Elementor container with the CSS class
   `five-solution-cards`, then paste this script and
   five-solution-cards.css. The script builds the whole section inside
   that container.

   One card per solution. Clicking a card opens a video pop-up.
   Everything an editor needs to change lives in the CONTENT block —
   copy, capabilities, poster images and video URLs.

   Add or remove solutions by editing CARDS; the grid and the pop-up
   follow automatically.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches (the CSS is scoped to the same
   class, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".five-solution-cards";

  /* ---- Content (edit freely) -----------------------------------------

     Per card:
       icon       one of: shield | globe | crosshair | dashboard |
                          headset | bank | factory | hardhat |
                          derrick | briefcase | network
                                                   (badge + artwork)
       title      solution name
       tagline    the coloured line under the title
       text       supporting copy
       capabilities the "Capabilities:" line — leave "" to hide it
       duration   badge on the thumbnail, e.g. "02:14"  ("" hides it)
       video      MP4/WebM file URL, OR a YouTube / Vimeo link — the
                  pop-up picks the right player automatically.
                  Leave "" until the video is ready — the card then
                  shows a "Video coming soon" tag instead of a play
                  button.
       poster     optional thumbnail image URL. When empty, the built-in
                  illustration for `icon` is used instead.
     -------------------------------------------------------------------- */

  // Heading above the cards — off, matching the live section. Set to
  // true to show EYEBROW / TITLE / SUB.
  var SHOW_HEADER = false;

  var EYEBROW = "AI-powered cyber defense & enterprise intelligence";

  var TITLE = "Five solutions. A stronger, smarter tomorrow.";

  var SUB = "Click on any solution to watch a short video.";

  var CARDS = [
    {
      icon: "shield",
      title: "UCD",
      tagline: "Unified Cyber Defense",
      text: "One platform. Unified defense. Autonomous.",
      capabilities:
        "AI SOC, SIEM/XDR, ITDR, OT Security, CDR, Exposure Management, " +
        "AI Agents, Broad Integrations.",
      duration: "",
      video: "https://youtu.be/tpAExtA1LRg",
      poster: ""
    },
    {
      icon: "globe",
      title: "HawkINT",
      tagline: "Threat Intelligence",
      text: "Know the threat before it reaches you.",
      capabilities:
        "Cyber Threat Intelligence, Dark Web Monitoring, Digital Risk, " +
        "Credential Exposure, Brand Monitoring, Threat Actor Intelligence, " +
        "Takedowns, Executive/VIP Monitoring.",
      duration: "",
      video: "https://youtu.be/77X7eEamevE",
      poster: ""
    },
    {
      icon: "crosshair",
      title: "HawkStrike",
      tagline: "Offensive Security",
      text: "Think like an attacker. Strike before they do.",
      capabilities:
        "Autonomous Penetration Testing, Vulnerability Validation, " +
        "Attack Surface Testing, Continuous Testing, Red Team Engagements, " +
        "Web/Application Testing, Exposure Validation, " +
        "Actionable Remediation Guidance.",
      duration: "",
      video: "https://youtu.be/awwv0sFRnDY",
      poster: ""
    },
    {
      icon: "dashboard",
      title: "HawkOps",
      tagline: "Enterprise Operations Intelligence",
      text: "Turn enterprise operations into actionable intelligence.",
      capabilities:
        "Enterprise Intelligence, AI Agents, Data & System Integration, " +
        "Operational Visibility, Workflow Intelligence, " +
        "Decision Intelligence, Automation, Executive Insights.",
      duration: "",
      video: "https://youtu.be/lWIrKmcFmuk",
      poster: ""
    },
    {
      icon: "headset",
      title: "Cybersecurity Services",
      tagline: "Expertise. Readiness. Resilience.",
      text: "Expertise when and where your organization needs it.",
      capabilities:
        "24/7 Managed SOC, Incident Response & Digital Forensics, " +
        "Cyber Command Center, Risk Assessments, Penetration Testing, " +
        "Security Assessments, Compliance Readiness, Professional Services.",
      duration: "",
      video: "https://youtu.be/01bvMgk2oGo",
      poster: ""
    }
  ];

  // Button below the grid — currently off. Uncomment the line below
  // (and delete `var CTA = null;`) to bring it back, then set `href`.
  // var CTA = { label: "See Full Use Case Details", href: "#" };
  var CTA = null;

  // Fade/rise the cards in as the section scrolls into view.
  var ANIMATE = true;
  /* -------------------------------------------------------------------- */

  /* ---- Badge icons (24x24, stroke follows the accent) ------------------ */
  var ICONS = {
    shield:
      '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.9 7.2 9.4 4.2-1.5 7.2-5 7.2-9.4V6z"/>' +
      '<path d="m8.9 12 2.2 2.2 4-4.2"/>',
    globe:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<path d="M3.4 12h17.2"/>' +
      '<path d="M12 3.4c2.3 2.3 3.5 5.2 3.5 8.6s-1.2 6.3-3.5 8.6c-2.3-2.3-3.5-5.2-3.5-8.6s1.2-6.3 3.5-8.6z"/>',
    crosshair:
      '<circle cx="12" cy="12" r="7.4"/>' +
      '<circle cx="12" cy="12" r="2.4"/>' +
      '<path d="M12 2.6v4.2M12 17.2v4.2M2.6 12h4.2M17.2 12h4.2"/>',
    dashboard:
      '<rect x="3" y="4.2" width="18" height="12.4" rx="2.2"/>' +
      '<path d="M12 16.6v3.6M8.4 20.2h7.2"/>' +
      '<path d="m6.8 12.6 3.1-3.1 2.6 2.4 4.7-4.7"/>',
    headset:
      '<path d="M4.6 13.4V12a7.4 7.4 0 0 1 14.8 0v1.4"/>' +
      '<rect x="3.4" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<rect x="16.8" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<path d="M18.7 19.2v.2a2.4 2.4 0 0 1-2.4 2.4h-3.1"/>',
    bank:
      '<path d="M3 9.5 12 4l9 5.5"/>' +
      '<path d="M5.4 10.4V17M9.8 10.4V17M14.2 10.4V17M18.6 10.4V17"/>' +
      '<path d="M3.4 20h17.2"/>',
    factory:
      '<path d="M2.8 20.2h18.4"/>' +
      '<path d="M4 20V9.6l5.2 3.4V9.6l5.2 3.4V5.4h3.2L19 20"/>' +
      '<path d="M7.4 16.6h1.4M12.6 16.6H14"/>',
    hardhat:
      '<path d="M3.4 15.6a8.6 8.6 0 0 1 17.2 0"/>' +
      '<path d="M9.2 15.2V7.6A1.6 1.6 0 0 1 10.8 6h2.4a1.6 1.6 0 0 1 1.6 1.6v7.6"/>' +
      '<path d="M2.6 15.6h18.8a1 1 0 0 1 1 1v1.2a1 1 0 0 1-1 1H2.6a1 1 0 0 1-1-1v-1.2a1 1 0 0 1 1-1z"/>',
    derrick:
      '<path d="M7.6 19.4 11 4.6h2l3.4 14.8"/>' +
      '<path d="M9.1 13h5.8M9.8 9.4h4.4"/>' +
      '<path d="M4.6 19.4h14.8"/>',
    briefcase:
      '<rect x="3" y="7.4" width="18" height="12.2" rx="2.4"/>' +
      '<path d="M8.8 7.4V6a1.8 1.8 0 0 1 1.8-1.8h2.8A1.8 1.8 0 0 1 15.2 6v1.4"/>' +
      '<path d="M3 12.4h18"/>',
    network:
      '<rect x="8.8" y="3" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="2.4" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="15.2" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<path d="M12 8v3.6"/>' +
      '<path d="M5.6 16v-2.6a1.8 1.8 0 0 1 1.8-1.8h9.2a1.8 1.8 0 0 1 1.8 1.8V16"/>'
  };

  function badge(kind) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' +
      (ICONS[kind] || ICONS.network) +
      "</svg>"
    );
  }

  /* ---- Thumbnail artwork ----------------------------------------------
     Drawn on a shared 320x180 grid. Gradients live in one hidden <svg>
     (see DEFS) so every thumbnail can reference them by id.
     -------------------------------------------------------------------- */

  var DEFS =
    '<svg class="wei-uc__defs" aria-hidden="true" focusable="false">' +
    "<defs>" +
    '<linearGradient id="wei-uc-soft" x1="0" y1="0" x2=".35" y2="1">' +
    '<stop offset="0%" stop-color="#cfd9ff"/>' +
    '<stop offset="100%" stop-color="#93a8ff"/>' +
    "</linearGradient>" +
    '<linearGradient id="wei-uc-deep" x1="0" y1="0" x2=".35" y2="1">' +
    '<stop offset="0%" stop-color="#a8bcff"/>' +
    '<stop offset="100%" stop-color="#6178f2"/>' +
    "</linearGradient>" +
    '<linearGradient id="wei-uc-pale" x1="0" y1="0" x2=".2" y2="1">' +
    '<stop offset="0%" stop-color="#ffffff"/>' +
    '<stop offset="100%" stop-color="#dee7ff"/>' +
    "</linearGradient>" +
    "</defs>" +
    "</svg>";

  // Evenly spaced columns for the bank facade.
  function columns() {
    var out = "";
    for (var i = 0; i < 5; i++) {
      out +=
        '<rect x="' + (99 + i * 26) + '" y="80" width="18" height="56" ' +
        'rx="6" fill="url(#wei-uc-soft)"/>';
    }
    return out;
  }

  var ART = {
    shield:
      '<path d="M160 22 104 44v40c0 36 24 62 56 74 32-12 56-38 56-74V44Z" ' +
      'fill="url(#wei-uc-deep)"/>' +
      '<path d="M160 40 122 55v29c0 25 16 44 38 53Z" fill="#ffffff" opacity=".22"/>' +
      '<path d="m136 92 16 16 32-34" fill="none" stroke="url(#wei-uc-pale)" ' +
      'stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',

    globe:
      // orbit ring with two "signal" dots on it, globe on top
      '<ellipse cx="160" cy="90" rx="96" ry="26" fill="none" ' +
      'stroke="url(#wei-uc-soft)" stroke-width="7" transform="rotate(-14 160 90)"/>' +
      '<circle cx="160" cy="90" r="62" fill="url(#wei-uc-deep)"/>' +
      '<path d="M98 90h124M110 58h100M110 122h100" fill="none" stroke="#ffffff" ' +
      'stroke-width="6" opacity=".45"/>' +
      '<ellipse cx="160" cy="90" rx="26" ry="62" fill="none" stroke="#ffffff" ' +
      'stroke-width="6" opacity=".45"/>' +
      '<circle cx="237" cy="57" r="9" fill="url(#wei-uc-pale)"/>' +
      '<circle cx="83" cy="123" r="9" fill="url(#wei-uc-pale)"/>',

    crosshair:
      '<circle cx="160" cy="90" r="60" fill="url(#wei-uc-soft)"/>' +
      '<circle cx="160" cy="90" r="40" fill="url(#wei-uc-pale)"/>' +
      '<circle cx="160" cy="90" r="20" fill="url(#wei-uc-deep)"/>' +
      '<path d="M160 16v40M160 124v40M86 90h40M194 90h40" fill="none" ' +
      'stroke="url(#wei-uc-deep)" stroke-width="9" stroke-linecap="round"/>',

    dashboard:
      '<rect x="76" y="26" width="168" height="108" rx="14" fill="url(#wei-uc-deep)"/>' +
      '<rect x="88" y="38" width="144" height="84" rx="8" fill="#ffffff" opacity=".22"/>' +
      '<rect x="100" y="92" width="16" height="20" rx="4" fill="url(#wei-uc-pale)"/>' +
      '<rect x="124" y="78" width="16" height="34" rx="4" fill="url(#wei-uc-pale)"/>' +
      '<rect x="148" y="86" width="16" height="26" rx="4" fill="url(#wei-uc-pale)"/>' +
      '<rect x="172" y="66" width="16" height="46" rx="4" fill="url(#wei-uc-pale)"/>' +
      '<rect x="196" y="56" width="16" height="56" rx="4" fill="url(#wei-uc-pale)"/>' +
      '<path d="M108 80 132 66l24 8 24-20 24-10" fill="none" stroke="#ffffff" ' +
      'stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="148" y="134" width="24" height="16" fill="url(#wei-uc-soft)"/>' +
      '<rect x="116" y="148" width="88" height="12" rx="6" fill="url(#wei-uc-soft)"/>',

    headset:
      '<path d="M98 102V86a62 62 0 0 1 124 0v16" fill="none" ' +
      'stroke="url(#wei-uc-soft)" stroke-width="13" stroke-linecap="round"/>' +
      '<rect x="82" y="86" width="38" height="58" rx="15" fill="url(#wei-uc-deep)"/>' +
      '<rect x="200" y="86" width="38" height="58" rx="15" fill="url(#wei-uc-deep)"/>' +
      // mic boom leaves the left cup, clear of the corner tag
      '<path d="M101 144v4a16 16 0 0 0 16 16h25" fill="none" ' +
      'stroke="url(#wei-uc-soft)" stroke-width="9" stroke-linecap="round"/>' +
      '<rect x="142" y="157" width="28" height="14" rx="7" fill="url(#wei-uc-pale)"/>',

    bank:
      '<path d="M160 24 240 64H80z" fill="url(#wei-uc-deep)"/>' +
      '<rect x="82" y="64" width="156" height="12" rx="6" fill="url(#wei-uc-pale)"/>' +
      columns() +
      '<rect x="74" y="138" width="172" height="16" rx="8" fill="url(#wei-uc-deep)"/>',

    factory:
      // chimney + smoke sit behind the stepped roofline
      '<circle cx="214" cy="30" r="11" fill="url(#wei-uc-pale)" opacity=".8"/>' +
      '<circle cx="233" cy="18" r="7" fill="url(#wei-uc-pale)" opacity=".6"/>' +
      '<rect x="196" y="40" width="24" height="76" rx="8" fill="url(#wei-uc-soft)"/>' +
      '<path d="M84 156V102l38 22v-22l38 22v-22l38 22v32Z" fill="url(#wei-uc-deep)"/>' +
      '<rect x="96" y="130" width="16" height="14" rx="4" fill="#ffffff" opacity=".45"/>' +
      '<rect x="134" y="130" width="16" height="14" rx="4" fill="#ffffff" opacity=".45"/>' +
      '<rect x="172" y="130" width="16" height="14" rx="4" fill="#ffffff" opacity=".45"/>' +
      '<rect x="70" y="154" width="180" height="12" rx="6" fill="url(#wei-uc-pale)"/>',

    hardhat:
      '<path d="M90 128a70 70 0 0 1 140 0Z" fill="url(#wei-uc-deep)"/>' +
      '<path d="M136 128V72a14 14 0 0 1 14-14h20a14 14 0 0 1 14 14v56Z" ' +
      'fill="#ffffff" opacity=".38"/>' +
      '<rect x="72" y="124" width="176" height="22" rx="11" fill="url(#wei-uc-soft)"/>',

    derrick:
      '<path d="M112 150 146 40h28l34 110" fill="none" stroke="url(#wei-uc-deep)" ' +
      'stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M128 112h64M136 84h48M144 60h32" fill="none" ' +
      'stroke="url(#wei-uc-soft)" stroke-width="11" stroke-linecap="round"/>' +
      '<rect x="98" y="146" width="124" height="16" rx="8" fill="url(#wei-uc-deep)"/>',

    briefcase:
      '<path d="M128 56V44a15 15 0 0 1 15-15h34a15 15 0 0 1 15 15v12" ' +
      'fill="none" stroke="url(#wei-uc-soft)" stroke-width="13" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="86" y="56" width="148" height="98" rx="18" fill="url(#wei-uc-deep)"/>' +
      '<rect x="86" y="92" width="148" height="16" fill="#ffffff" opacity=".34"/>' +
      '<rect x="144" y="88" width="32" height="24" rx="7" fill="url(#wei-uc-pale)"/>',

    network:
      '<path d="M160 70v26M160 96l-52 28M160 96l52 28" fill="none" ' +
      'stroke="url(#wei-uc-soft)" stroke-width="9" stroke-linecap="round"/>' +
      '<rect x="124" y="28" width="72" height="42" rx="13" fill="url(#wei-uc-deep)"/>' +
      '<rect x="72" y="116" width="68" height="40" rx="13" fill="url(#wei-uc-soft)"/>' +
      '<rect x="180" y="116" width="68" height="40" rx="13" fill="url(#wei-uc-soft)"/>' +
      '<rect x="142" y="42" width="36" height="6" rx="3" fill="#ffffff" opacity=".6"/>'
  };

  function art(kind) {
    return (
      '<svg class="wei-uc__art" viewBox="0 0 320 180" ' +
      'preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      (ART[kind] || ART.network) +
      "</svg>"
    );
  }

  var PLAY =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M9.2 7.4v9.2l7.4-4.6z" fill="currentColor"/>' +
    "</svg>";

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' +
    '<path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5"/>' +
    "</svg>";

  var CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.9" stroke-linecap="round" aria-hidden="true">' +
    '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>' +
    "</svg>";

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  // Turn a plain "\n" in the copy into a real line break.
  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  function youTubeId(url) {
    var m = String(url).match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
    );
    return m ? m[1] : "";
  }

  function vimeoId(url) {
    var m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : "";
  }

  /* ---- Player ---------------------------------------------------------- */
  function playerHTML(card) {
    var src = card.video || "";
    var yt = youTubeId(src);
    var vm = vimeoId(src);

    if (yt) {
      return (
        '<iframe class="wei-uc__frame" ' +
        'src="https://www.youtube-nocookie.com/embed/' + esc(yt) +
        '?autoplay=1&rel=0&modestbranding=1" ' +
        'title="' + esc(card.title) + '" ' +
        'allow="accelerometer; autoplay; encrypted-media; picture-in-picture" ' +
        "allowfullscreen></iframe>"
      );
    }

    if (vm) {
      return (
        '<iframe class="wei-uc__frame" ' +
        'src="https://player.vimeo.com/video/' + esc(vm) + '?autoplay=1" ' +
        'title="' + esc(card.title) + '" ' +
        'allow="autoplay; fullscreen; picture-in-picture" ' +
        "allowfullscreen></iframe>"
      );
    }

    if (src) {
      return (
        '<video class="wei-uc__video" controls autoplay playsinline ' +
        'preload="metadata"' +
        (card.poster ? ' poster="' + esc(card.poster) + '"' : "") + ">" +
        '<source src="' + esc(src) + '">' +
        "Your browser does not support embedded video." +
        "</video>"
      );
    }

    // No URL yet — say so plainly rather than showing an empty black box.
    // Visitors see this, so it reads as a notice, not an editor hint.
    return (
      '<div class="wei-uc__empty">' +
      "<span>Video coming soon</span>" +
      "<small>The " + esc(card.title) + " video isn't available yet. " +
      "Please check back soon.</small>" +
      "</div>"
    );
  }

  /* ---- Modal ----------------------------------------------------------- */

  /* A `transform` on any Elementor ancestor would break `position: fixed`,
     so the modal lives on <body>. The wrapper keeps the SECTION class so
     the scoped CSS (and its custom properties) still applies. */
  function portal() {
    var p = document.createElement("div");
    p.className = SECTION.replace(/^\./, "") + " wei-uc__portal";
    document.body.appendChild(p);
    return p;
  }

  function createModal() {
    var el = document.createElement("div");
    el.className = "wei-uc__modal";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "wei-uc-modal-title");
    el.hidden = true;
    el.innerHTML =
      '<div class="wei-uc__backdrop" data-uc-close></div>' +
      '<div class="wei-uc__dialog" role="document">' +
      '<div class="wei-uc__dialog-head">' +
      '<span class="wei-uc__badge wei-uc__badge--lg" data-uc-icon></span>' +
      '<div class="wei-uc__dialog-copy">' +
      '<h3 class="wei-uc__dialog-title" id="wei-uc-modal-title"></h3>' +
      '<p class="wei-uc__dialog-text"></p>' +
      "</div>" +
      '<button type="button" class="wei-uc__close" data-uc-close ' +
      'aria-label="Close video">' + CLOSE + "</button>" +
      "</div>" +
      '<div class="wei-uc__player"></div>' +
      "</div>";

    portal().appendChild(el);
    return el;
  }

  function modalController() {
    var el = createModal();
    var dialog = el.querySelector(".wei-uc__dialog");
    var player = el.querySelector(".wei-uc__player");
    var lastFocus = null;
    var closeTimer = 0;

    function open(card) {
      window.clearTimeout(closeTimer);
      lastFocus = document.activeElement;

      el.querySelector("[data-uc-icon]").innerHTML = badge(card.icon);
      el.querySelector(".wei-uc__dialog-title").textContent = card.title;
      el.querySelector(".wei-uc__dialog-text").textContent = card.tagline;
      player.innerHTML = playerHTML(card);

      el.hidden = false;
      // Next frame, so the transition has a starting state to animate from.
      requestAnimationFrame(function () {
        el.classList.add("is-open");
      });

      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (gap > 0) document.body.style.paddingRight = gap + "px";

      el.querySelector(".wei-uc__close").focus();
      document.addEventListener("keydown", onKey, true);
    }

    function close() {
      if (el.hidden) return;

      el.classList.remove("is-open");
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Drop the player node so the video actually stops.
      closeTimer = window.setTimeout(function () {
        el.hidden = true;
        player.innerHTML = "";
      }, 220);

      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    function onKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep tabbing inside the dialog while it is open.
      var items = dialog.querySelectorAll(
        "button, [href], video, iframe, input, select, textarea, " +
        '[tabindex]:not([tabindex="-1"])'
      );
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    el.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-uc-close]")) close();
    });

    return { open: open, close: close };
  }

  /* ---- Thumbnail --------------------------------------------------------
     A `poster` image always wins. Otherwise the card shows a real frame
     from the video itself: a muted <video> preloading metadata, with a
     media fragment seeking past the opening titles. The built-in artwork
     is only used when there is no self-hosted file to take a frame from
     — including when there is no video at all yet.
     -------------------------------------------------------------------- */
  var THUMB_SEEK = 3;            // seconds into the file the still comes from

  function posterImg(url) {
    return (
      '<img class="wei-uc__poster" src="' + esc(url) + '" alt="" ' +
      'loading="lazy" decoding="async">'
    );
  }

  function thumbHTML(c) {
    if (c.poster) return posterImg(c.poster);

    var src = c.video || "";
    var yt = youTubeId(src);

    /* YouTube serves a still for every video. `mqdefault` is true 16:9 and
       always exists — hqdefault letterboxes into 4:3, and maxresdefault
       404s on videos never uploaded in HD. */
    if (yt) {
      return posterImg("https://i.ytimg.com/vi/" + yt + "/mqdefault.jpg");
    }

    // Media fragments only work on a file we serve ourselves. Vimeo needs
    // an API call for its still, so those fall back to the artwork.
    if (src && !vimeoId(src)) {
      return (
        '<video class="wei-uc__still" src="' + esc(src) + "#t=" + THUMB_SEEK +
        '" preload="metadata" muted playsinline tabindex="-1" ' +
        'aria-hidden="true"></video>'
      );
    }

    return art(c.icon);
  }

  /* ---- Build ----------------------------------------------------------- */
  function cardHTML(c, i) {
    var thumb = thumbHTML(c);

    // No video yet: drop the play button and duration, say so instead.
    var overlay = c.video
      ? '<span class="wei-uc__play">' + PLAY + "</span>" +
      (c.duration
        ? '<span class="wei-uc__time">' + esc(c.duration) + "</span>"
        : "")
      : '<span class="wei-uc__time">Video coming soon</span>';

    var label = c.video
      ? "Play the " + c.title + " video"
      : c.title + ": video coming soon";

    return (
      '<button type="button" class="wei-uc__card" data-uc-index="' + i + '" ' +
      'style="--uc-i:' + i + '" ' +
      'aria-label="' + esc(label) + '">' +
      '<span class="wei-uc__head">' +
      '<span class="wei-uc__badge">' + badge(c.icon) + "</span>" +
      '<span class="wei-uc__copy">' +
      '<span class="wei-uc__card-title">' + esc(c.title) + "</span>" +
      '<span class="wei-uc__card-tagline">' + esc(c.tagline) + "</span>" +
      "</span>" +
      "</span>" +
      '<span class="wei-uc__card-text">' + esc(c.text) + "</span>" +
      (c.capabilities
        ? '<span class="wei-uc__frameworks">' +
        '<span class="wei-uc__frameworks-label">Capabilities:</span> ' +
        esc(c.capabilities) +
        "</span>"
        : "") +
      '<span class="wei-uc__thumb">' + thumb + overlay + "</span>" +
      "</button>"
    );
  }

  function buildSection() {
    var host =
      document.querySelector(SECTION + " .e-con-inner") ||
      document.querySelector(SECTION);

    if (!host) return false;                       // container not ready
    if (host.querySelector(".wei-uc")) return true; // already built

    var cardsHTML = CARDS.map(cardHTML).join("");

    var ctaHTML = CTA && CTA.label
      ? '<div class="wei-uc__cta-row" style="--uc-i:' + CARDS.length + '">' +
      '<a class="wei-uc__cta" href="' + esc(CTA.href || "#") + '">' +
      esc(CTA.label) + ARROW +
      "</a>" +
      "</div>"
      : "";

    host.insertAdjacentHTML(
      "beforeend",
      '<div class="wei-uc' + (ANIMATE ? " is-animated" : "") + '">' +
      DEFS +
      (SHOW_HEADER
        ? '<header class="wei-uc__head-block">' +
        '<span class="wei-uc__bar"></span>' +
        '<p class="wei-uc__eyebrow">' + esc(EYEBROW) + "</p>" +
        '<h2 class="wei-uc__title">' + esc(TITLE) + "</h2>" +
        '<p class="wei-uc__sub">' + nl2br(SUB) + "</p>" +
        "</header>"
        : "") +
      '<div class="wei-uc__grid">' + cardsHTML + "</div>" +
      ctaHTML +
      "</div>"
    );

    var root = host.querySelector(".wei-uc");
    var grid = root.querySelector(".wei-uc__grid");
    var modal = modalController();

    grid.addEventListener("click", function (e) {
      var card = e.target.closest && e.target.closest(".wei-uc__card");
      if (!card) return;
      modal.open(CARDS[Number(card.getAttribute("data-uc-index"))]);
    });

    // A hover or focus usually comes just before a click, so open the
    // connection to the video host then — the player starts sooner.
    function warmUp() {
      grid.removeEventListener("pointerover", warmUp);
      grid.removeEventListener("focusin", warmUp);
      preconnect(CARDS);
    }
    grid.addEventListener("pointerover", warmUp);
    grid.addEventListener("focusin", warmUp);

    if (ANIMATE) reveal(root);
    return true;
  }

  function preconnect(cards) {
    var origins = {};
    cards.forEach(function (c) {
      if (youTubeId(c.video)) origins["https://www.youtube-nocookie.com"] = 1;
      else if (vimeoId(c.video)) origins["https://player.vimeo.com"] = 1;
    });
    Object.keys(origins).forEach(function (href) {
      var link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      document.head.appendChild(link);
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

/* ============================================================
   Badges Showcase — Interactive Enhancements
   Requires: jQuery
   Scope: .modern-badges (apply this class on the outer wrapper)
   ============================================================ */

(function ($) {
  "use strict";

  // Without jQuery, skip the enhancements but still reveal the cards —
  // the CSS keeps them hidden until they get .is-revealed.
  if (!$) {
    var showBadges = function () {
      document.querySelectorAll(".modern-badges .elementor-widget-image")
        .forEach(function (el) { el.classList.add("is-revealed"); });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBadges);
    } else {
      showBadges();
    }
    return;
  }

  function initModernBadges($section) {
    if (!$section.length || $section.data("modernBadgesInit")) return;
    $section.data("modernBadgesInit", true);

    // Grid: try the original Elementor id first, then a generic .bd-grid fallback
    var $grid = $section.find(".elementor-element-a9defb2").first();
    if (!$grid.length) $grid = $section.find(".bd-grid").first();
    if (!$grid.length) $grid = $section.find(".e-grid").first();
    if (!$grid.length) return;

    var $cards = $grid.children(".elementor-widget-image");
    if (!$cards.length) return;

    /* ---------- 1. Inject heading above the grid ---------- */
    if (!$section.find(".bd-heading").length) {
      var $heading = $(
        '<div class="bd-heading">' +
        '<span class="bd-eyebrow">Recognitions & Certifications</span>' +
        '<h2 class="bd-title">Trusted by Industry Standards</h2>' +
        '<p class="bd-subtitle">Independently verified credentials that reflect our commitment to security, quality, and excellence.</p>' +
        '</div>'
      );
      var $innerHost = $section.find(".e-con-inner").first();
      if ($innerHost.length) $innerHost.prepend($heading);
      else $section.prepend($heading);
    }

    /* ---------- 2. Inject floating background orbs ---------- */
    if (!$section.find(".bd-orb").length) {
      var orbConfigs = [
        { top: "10%", left: "5%", size: 220, color: "rgba(99,102,241,0.55)", delay: "0s" },
        { top: "60%", left: "80%", size: 260, color: "rgba(56,189,248,0.55)", delay: "-6s" },
        { top: "80%", left: "20%", size: 180, color: "rgba(168,85,247,0.45)", delay: "-12s" }
      ];
      $.each(orbConfigs, function (i, c) {
        $section.prepend(
          $('<div class="bd-orb"></div>').css({
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            background: c.color,
            "animation-delay": c.delay
          })
        );
      });
    }

    /* ---------- 3. Enhance each card ---------- */
    $cards.each(function () {
      var $card = $(this);
      if (!$card.find(".bd-spotlight").length) {
        $card.append('<div class="bd-spotlight"></div>');
      }
      if (!$card.find(".bd-particles").length) {
        $card.append('<div class="bd-particles"></div>');
      }
    });

    /* ---------- 4. Scroll-triggered reveal (IntersectionObserver) ---------- */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              $(entry.target).addClass("is-revealed");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      $cards.each(function () { io.observe(this); });

      var hIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              $(entry.target).addClass("is-visible");
              hIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      var headingEl = $section.find(".bd-heading")[0];
      if (headingEl) hIo.observe(headingEl);

      // Freeze the looping animations while the section is off screen.
      new IntersectionObserver(
        function (entries) {
          var entry = entries[entries.length - 1];
          $section.toggleClass("bd-paused", !entry.isIntersecting);
        },
        { rootMargin: "100px 0px" }
      ).observe($section[0]);
    } else {
      $cards.addClass("is-revealed");
      $section.find(".bd-heading").addClass("is-visible");
    }

    /* ---------- 5. 3D tilt + cursor spotlight on hover ---------- */
    var prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      // mousemove fires far more often than the screen paints, so
      // remember the latest pointer and do the work once per frame.
      $cards.each(function () {
        var card = this;
        var clientX = 0;
        var clientY = 0;
        var frame = 0;

        function update() {
          frame = 0;
          var rect = card.getBoundingClientRect();
          var x = clientX - rect.left;
          var y = clientY - rect.top;
          var midX = rect.width / 2;
          var midY = rect.height / 2;
          var rotX = ((midY - y) / midY) * 8;
          var rotY = ((x - midX) / midX) * 8;

          card.style.transform =
            "translateY(-12px) scale(1.04) perspective(1000px) rotateX(" +
            rotX + "deg) rotateY(" + rotY + "deg)";

          var px = (x / rect.width) * 100;
          var py = (y / rect.height) * 100;
          card.style.setProperty("--bd-x", px + "%");
          card.style.setProperty("--bd-y", py + "%");
        }

        $(card).on("mousemove.modernBadges", function (e) {
          clientX = e.clientX;
          clientY = e.clientY;
          if (!frame) frame = window.requestAnimationFrame(update);
        });

        $(card).on("mouseleave.modernBadges", function () {
          if (frame) window.cancelAnimationFrame(frame);
          frame = 0;
          card.style.transform = "";
        });
      });
    }

    /* ---------- 6. Click → particle burst ---------- */
    $cards.on("click.modernBadges", function (e) {
      var $card = $(this);
      var $container = $card.find(".bd-particles");
      var rect = this.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;

      for (var i = 0; i < 14; i++) {
        var angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        var distance = 60 + Math.random() * 60;
        var dx = Math.cos(angle) * distance;
        var dy = Math.sin(angle) * distance;
        var $p = $('<span class="bd-particle"></span>').css({
          left: cx + "px",
          top: cy + "px",
          background:
            i % 2 === 0 ? "rgba(165,180,252,0.95)" : "rgba(125,211,252,0.95)"
        });
        $container.append($p);

        $p.animate(
          { opacity: 1 },
          { duration: 50, queue: false }
        ).animate(
          {
            left: cx + dx + "px",
            top: cy + dy + "px",
            opacity: 0
          },
          {
            duration: 700 + Math.random() * 300,
            easing: "swing",
            queue: false,
            complete: function () { $(this).remove(); }
          }
        );
      }

      $card.css("transition", "transform 0.15s ease");
      var current = $card.css("transform");
      $card.css("transform", current + " scale(0.97)");
      setTimeout(function () {
        $card.css("transition", "");
        $card.css("transform", "");
      }, 180);
    });

    /* The orbs used to get a scroll-parallax transform here, but their
       CSS float animation owns `transform` and always overrode it, so
       the handler only forced a layout on every scroll frame with no
       visible effect. Removed for performance. */
  }

  $(function () {
    $(".modern-badges").each(function () {
      initModernBadges($(this));
    });
  });
})(window.jQuery || window.$);

/* ============================================================
   Portfolio Section — Enhancements
   Scope: everything is queried under .cyberhawk-portfolio so it
   cannot affect other Elementor sections.
   ============================================================ */

(function () {
  "use strict";

  var ROOT_SEL = ".cyberhawk-portfolio";

  function $all(selector) {
    var roots = document.querySelectorAll(ROOT_SEL);
    var out = [];
    roots.forEach(function (root) {
      root.querySelectorAll(selector).forEach(function (el) { out.push(el); });
    });
    return out;
  }

  function $one(selector) {
    var root = document.querySelector(ROOT_SEL);
    return root ? root.querySelector(selector) : null;
  }

  /* ---------- Inline SVGs ---------- */
  var SHIELD_BADGE_SVG =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"></path>' +
    '<path d="M9 12l2 2 4-4"></path></svg>';

  // Card icons — single-color (currentColor) so CSS color drives them
  var ICON_PROTECT =
    '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none"' +
    ' stroke="currentColor" stroke-width="3" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M32 6l20 8v14c0 12-8.5 22-20 26-11.5-4-20-14-20-26V14l20-8z"/>' +
    '<path d="M22 32l7 7 13-13"/>' +
    '</svg>';

  var ICON_DETECT =
    '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none"' +
    ' stroke="currentColor" stroke-width="3" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="27" cy="27" r="15"/>' +
    '<path d="M38 38l14 14"/>' +
    '<path d="M19 27h3l2-5 4 10 3-5h5"/>' +
    '</svg>';

  var ICON_RESPONSE =
    '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none"' +
    ' stroke="currentColor" stroke-width="3" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M18 42h26a8 8 0 0 0 1-15.9A12 12 0 0 0 22 22 10 10 0 0 0 18 42z"/>' +
    '<path d="M32 30v12"/>' +
    '<path d="M27 35l5-5 5 5"/>' +
    '<path d="M49 14a8 8 0 0 1 0 11"/>' +
    '<path d="M53 10a13 13 0 0 1 0 19"/>' +
    '</svg>';

  var CARD_ICONS = {
    "protect": ICON_PROTECT,
    "detect": ICON_DETECT,
    "response": ICON_RESPONSE
  };

  /* ---------- 1. Badge + accent under the heading ---------- */
  function injectBadgeAndAccent() {
    var heading = $one(".about7.sp .heading7");
    if (!heading) return;
    var title = heading.querySelector(".tg-element-title");
    if (!title) return;

    if (!heading.querySelector(".ph-brand-badge")) {
      var badge = document.createElement("span");
      badge.className = "ph-brand-badge";
      badge.innerHTML =
        '<span class="ph-brand-icon">' + SHIELD_BADGE_SVG + "</span>" +
        '<span class="ph-brand-text">CybrHawk</span>';
      title.parentNode.insertBefore(badge, title);
    }

    if (!heading.querySelector(".ph-title-accent")) {
      var accent = document.createElement("span");
      accent.className = "ph-title-accent";
      accent.setAttribute("aria-hidden", "true");
      title.parentNode.insertBefore(accent, title.nextSibling);
    }
  }

  /* ---------- 2. Swap broken card icons for clean ones ---------- */
  function swapCardIcons() {
    var cards = $all(".child-card");
    cards.forEach(function (card) {
      var titleEl = card.querySelector(".elementor-icon-box-title");
      var iconEl = card.querySelector(".elementor-icon");
      if (!titleEl || !iconEl) return;

      var label = (titleEl.textContent || "").trim().toLowerCase();
      var svg = CARD_ICONS[label];
      if (!svg) return;

      // Replace the legacy SVG with the new one
      iconEl.innerHTML = svg;
      iconEl.setAttribute("data-ph-icon", label);
    });
  }

  /* ---------- 3. Fix duplicated text in the Response card ---------- */
  function fixResponseTypo() {
    var descs = $all(".child-card .elementor-icon-box-description");
    descs.forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      // Collapse an accidentally duplicated leading phrase, e.g.
      // "We equip your organisation We equip your organisation to ..."
      var deduped = t.replace(
        /^We equip your organisation\s+(We equip your organisation\b)/i,
        "$1"
      );
      if (deduped !== t) {
        el.textContent = deduped;
      }
    });
  }

  /* ---------- 4. Scroll-reveal stagger ---------- */
  function revealCardsOnScroll() {
    var cards = $all(".child-card");
    if (!cards.length || !("IntersectionObserver" in window)) return;

    cards.forEach(function (c, i) {
      c.style.opacity = "0";
      c.style.transform = "translateY(20px)";
      c.style.transition =
        "opacity 0.6s ease " + (i * 0.12) + "s," +
        " transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) " + (i * 0.12) + "s," +
        " box-shadow 0.35s ease, border-color 0.35s ease";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach(function (c) { io.observe(c); });
  }

  function init() {
    injectBadgeAndAccent();
    swapCardIcons();
    fixResponseTypo();
    revealCardsOnScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* =====================================================================
   CybrHawk — "Industry Recognition & Market Validation" section
   ---------------------------------------------------------------------
   "The Verification Ledger": analyst reports shown as a chain of
   dossier records, awards as minted seals. Light theme and the site
   font (Figtree), like the other homepage sections.

   No HTML needed. Install:
   1. Homepage → add an empty Elementor container with the CSS class
      `industry-recognition` where the section should go
      (TODO: confirm placement). Leave its background and padding
      unset — industry-recognition.css paints the background.
   2. The code ships inside home-page.js / home-page.css (the "Home
      Page" Custom CSS & JS snippets, already on the homepage only via
      the 'front' rule in home-page-snippet.php). Its source and a
      standalone preview live in home-page/industry-recognition/ — edit
      there, then copy the change into home-page.js / home-page.css.
   3. LiteSpeed → Purge All.

   Pre-rendered markup also works: if the section's HTML is already on
   the page (e.g. pasted into an Elementor HTML widget), the script uses
   it as-is and only adds the motion. In that case the HTML widget is
   the copy visitors see, so edit the text there — CONTENT below is
   then only used when the markup is missing.

   Everything an editor needs to change lives in the CONTENT block.
   The ledger summary (records · organizations · years) is worked out
   from CONTENT, so adding or removing an item needs no CSS change.

   These are claims about real third parties: keep the wording exactly
   as approved. No quotes, rankings, scores or "Leader" labels, and no
   drawn logos — fill `logo` only with official artwork.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches (the CSS is scoped to the same
   class, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".industry-recognition";

  /* ---- Content (edit freely) -----------------------------------------

     Groups: layout "records" = chain of dossier records (right column),
             layout "seals"   = round award medallions (below).

     Per item:
       publisher  organization name — shown as a plain wordmark and
                  counted once in the ledger summary
       year       "2026", or "" when the source gives none
       type       short tag in the record header, e.g. "MarketScape"
       title      the heading of the item
       highlight  words inside `description` to set in bold; on a seal
                  they are also the honour in the centre ("" = none)
       description supporting copy
       cta        link text
       url        link target
       external   true opens in a new tab (only for full http(s) URLs)
       isPdf      true adds the PDF chip and download icon
       logo       optional official logo image URL ("" = wordmark only)
     -------------------------------------------------------------------- */
  var CONTENT = {
    eyebrow: "Independent validation",
    title: "Industry Recognition & Market Validation",
    emphasis: "Validation",            // word set in italic, underlined
    subtitle:
      "Empowering enterprise security with trusted, independent validation.",
    status: "✓ source verified",       // decorative line on each record ("" hides it)

    groups: [
      {
        title: "Analyst Reports & Assessments",
        layout: "records",
        items: [
          {
            publisher: "IDC",
            year: "2026",
            type: "MarketScape",
            title:
              "IDC MarketScape: Worldwide AI-Driven Independent SOC " +
              "Platform Vendor Assessment (2026)",
            highlight: "",
            description:
              "CybrHawk has been publicly announced in the 2026 IDC " +
              "MarketScape assessment for worldwide AI-driven independent " +
              "SOC platforms.",
            cta: "Read Official Report Excerpt",
            url: "https://my.idc.com/getdoc.jsp?containerId=US54127026&pageType=PRINTFRIENDLY",
            external: true,
            isPdf: false,
            logo: ""
          },
          {
            publisher: "GigaOm",
            year: "",
            type: "Analyst Report",
            title: "GigaOm: Five Alerts or a Single Incident?",
            highlight: "",
            description:
              "An in-depth analyst review examining CybrHawk's approach to " +
              "unified security detection, alert correlation, and incident " +
              "investigation methodologies.",
            cta: "Download Official Analyst Report (PDF)",
            url:
              "https://portal.gigaom.com/report/cybrhawk-perspective-brief-five-alerts-or-one-incident" +
              "?token=XdkHjnBTM2ceuzma7bdFIU46HXs1ZH5Vec1WU8C5JOgPy0Jhneb7F8UOFZcSX5Itgl3hjL4mA/ell5D+" +
              "ufXg62O9stf5RDWB0T2vd/JFFyBdNJy4HdYg2LSRmYvHssTV7gw1oK9xJ+6ZvRO/7OrX4+wiK3dHXGB8UtkRY1Jqn" +
              "y2Te4Y1;9ueIfQlB5mXBbvBe",
            external: true,
            isPdf: true,
            logo: ""
          },
          {
            publisher: "GigaOm",
            year: "",
            type: "Article",
            title:
              "GigaOm: Beyond the Alert – Why CxOs Need More Than a SOC " +
              "and a SIEM",
            highlight: "",
            description:
              "Industry analysis exploring how CybrHawk's Unified Cyber " +
              "Defense platform strengthens security operations and " +
              "improves compliance visibility.",
            cta: "Read GigaOm Article",
            url:
              "https://gigaom.com/blog/beyond-the-alert-why-cxos-need-more-than-a-soc-and-siem-" +
              "and-how-cybrhawk-closes-the-compliance-gap/",
            external: true,
            isPdf: false,
            logo: ""
          }
        ]
      },
      {
        title: "Awards & Accolades",
        layout: "seals",
        items: [
          {
            publisher: "CyberSecurity Breakthrough Awards",
            year: "2026",
            type: "Award",
            title: "2026 CyberSecurity Breakthrough Awards",
            highlight: "XDR Platform of the Year",
            description:
              "Named XDR Platform of the Year for excellence in " +
              "cybersecurity technology and platform capabilities.",
            cta: "View Winners",
            url: "https://cybersecuritybreakthrough.com/2026-winners/",
            external: true,
            isPdf: false,
            logo: ""
          },
          {
            publisher: "Cloud Computing Magazine & TMCnet",
            year: "2025",
            type: "Award",
            title: "Cloud Computing Magazine & TMCnet (2025)",
            highlight: "Product of the Year",
            description: "Recognized as Product of the Year.",
            cta: "Read Announcement",
            url:
              "https://cloud-computing.tmcnet.com/breaking-news/articles/" +
              "462108-tmcnet-cloud-computing-magazine-announce-winners-the-2025.htm",
            external: true,
            isPdf: false,
            logo: ""
          }
        ]
      }
    ]
  };
  /* -------------------------------------------------------------------- */

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' +
    '<path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5"/>' +
    "</svg>";

  var DOWNLOAD =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' +
    '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>' +
    "</svg>";

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  // Wrap the first `word` inside `text` in a tag (both escaped).
  function wrap(text, word, tag) {
    var t = esc(text);
    var w = esc(word);
    var at = w ? t.indexOf(w) : -1;
    if (at < 0) return t;
    return t.slice(0, at) + "<" + tag + ">" + w + "</" + tag + ">" +
      t.slice(at + w.length);
  }

  // Decorative "checksum" for the record header (FNV-1a of the title).
  // Not a real hash of anything — it only gives each record a stable ID.
  function checksum(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h = ("0000000" + h.toString(16)).slice(-8);
    return "sha:" + h.slice(0, 4) + "…" + h.slice(-2);
  }

  /* ---- Build ----------------------------------------------------------- */
  function linkHTML(it) {
    var ext = it.external && /^https?:\/\//i.test(it.url);
    return (
      '<a class="ir__cta" href="' + esc(it.url || "#") + '"' +
      (ext ? ' target="_blank" rel="noopener"' : "") + ">" +
      "<span>" + esc(it.cta) + "</span>" +
      // Context for screen-reader link lists ("View Winners" alone is vague).
      '<span class="ir-sr">: ' + esc(it.title) +
      (it.isPdf && !/pdf/i.test(it.cta) ? " (PDF)" : "") + "</span>" +
      (ext ? '<span class="ir-sr"> (opens in a new tab)</span>' : "") +
      (it.isPdf
        ? '<span class="ir__chip" aria-hidden="true">' + DOWNLOAD + "PDF</span>"
        : ARROW) +
      "</a>"
    );
  }

  function statusHTML() {
    if (!CONTENT.status) return "";
    var chars = CONTENT.status.split("").map(function (ch, c) {
      return '<span style="--c:' + c + '">' + esc(ch) + "</span>";
    });
    return '<p class="ir__status" aria-hidden="true">' + chars.join("") + "</p>";
  }

  function logoHTML(it, cls) {
    return it.logo
      ? '<img class="' + cls + '" src="' + esc(it.logo) + '" alt="' +
      esc(it.publisher) + '" loading="lazy" decoding="async">'
      : "";
  }

  function recordHTML(it, n) {
    var meta = ["REC-" + pad(n + 1), it.publisher, it.year, it.type]
      .filter(Boolean).join(" · ");
    return (
      '<li class="ir__item" style="--i:' + n + '">' +
      '<article class="ir__rec">' +
      '<div class="ir__strip" aria-hidden="true">' +
      "<span>" + esc(meta) + "</span>" +
      '<span class="ir__sum">' + checksum(it.title) + "</span>" +
      "</div>" +
      logoHTML(it, "ir__logo") +
      '<h4 class="ir__name">' + esc(it.title) + "</h4>" +
      '<p class="ir__text">' + wrap(it.description, it.highlight, "strong") + "</p>" +
      '<div class="ir__foot">' + linkHTML(it) + statusHTML() + "</div>" +
      "</article>" +
      "</li>"
    );
  }

  // Ring of text around the seal: "NAME · YEAR · " repeated to fill it.
  var RIM_R = 104;
  var RIM_LEN = Math.round(2 * Math.PI * RIM_R) - 4;

  function sealHTML(it, n) {
    var base = [it.publisher, it.year].filter(Boolean).join(" · ")
      .toUpperCase() + " · ";
    var rim = base;
    while (rim.length < 60) rim += base;
    // ~0.8em per uppercase Figtree letter, so the text never overlaps.
    var size = Math.min(11, RIM_LEN / rim.length / 0.8).toFixed(1);
    var id = "ir-rim-" + n;
    var c = "M130 130m-" + RIM_R + " 0a" + RIM_R + " " + RIM_R + " 0 1 1 " +
      2 * RIM_R + " 0a" + RIM_R + " " + RIM_R + " 0 1 1 -" + 2 * RIM_R + " 0";

    return (
      '<li class="ir__seal-item" style="--i:' + n + '">' +
      '<article class="ir__award">' +
      // Decorative: the same words appear as real text below.
      '<div class="ir__seal" aria-hidden="true">' +
      '<svg class="ir__rim" viewBox="0 0 260 260" focusable="false">' +
      '<defs><path id="' + id + '" d="' + c + '"/></defs>' +
      '<circle class="ir__ring" cx="130" cy="130" r="124"/>' +
      '<circle class="ir__ring ir__ring--dash" cx="130" cy="130" r="92"/>' +
      '<text font-size="' + size + '">' +
      '<textPath href="#' + id + '" xlink:href="#' + id + '" ' +
      'textLength="' + RIM_LEN + '" lengthAdjust="spacing">' +
      esc(rim) +
      "</textPath>" +
      "</text>" +
      "</svg>" +
      '<span class="ir__foil"></span>' +
      '<span class="ir__core">' +
      (it.logo
        ? '<img class="ir__core-logo" src="' + esc(it.logo) + '" alt="" loading="lazy" decoding="async">'
        : "") +
      (it.year ? '<span class="ir__core-year">' + esc(it.year) + "</span>" : "") +
      '<span class="ir__core-honour">' + esc(it.highlight || it.type) + "</span>" +
      "</span>" +
      "</div>" +
      '<h4 class="ir__name">' + esc(it.title) + "</h4>" +
      '<p class="ir__text">' + wrap(it.description, it.highlight, "strong") + "</p>" +
      linkHTML(it) +
      "</article>" +
      "</li>"
    );
  }

  function groupTitle(g, k) {
    return (
      '<h3 class="ir__group-title">' +
      '<span class="ir__idx" aria-hidden="true">' +
      String.fromCharCode(65 + k) + " /</span>" +
      esc(g.title) +
      "</h3>"
    );
  }

  // "05 records · 04 organizations · 2025–2026", all counted from CONTENT.
  function ledgerHTML() {
    var items = 0, orgs = {}, nOrgs = 0, years = [];
    CONTENT.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        items++;
        var key = String(it.publisher).toLowerCase();
        if (key && !orgs[key]) { orgs[key] = 1; nOrgs++; }
        if (/^\d{4}$/.test(it.year)) years.push(Number(it.year));
      });
    });
    var lo = Math.min.apply(null, years);
    var hi = Math.max.apply(null, years);
    var span = !years.length ? "" : lo === hi ? String(lo) : lo + "–" + hi;
    var spoken = !years.length ? "" : lo === hi ? ", " + lo : ", " + lo + " to " + hi;

    return (
      '<p class="ir__ledger">' +
      '<span aria-hidden="true">' +
      "<b>" + pad(items) + "</b> records · " +
      "<b>" + pad(nOrgs) + "</b> organizations" +
      (span ? " · <b>" + span + "</b>" : "") +
      "</span>" +
      '<span class="ir-sr">' +
      items + (items === 1 ? " record" : " records") + " from " +
      nOrgs + (nOrgs === 1 ? " organization" : " organizations") + spoken +
      "</span>" +
      "</p>"
    );
  }

  function buildSection() {
    var box = document.querySelector(SECTION);
    if (!box) return false;                 // container not ready
    // A JS flag, not an attribute: copying the markup out of DevTools
    // must never carry an "already started" marker into the page.
    if (box._irStarted) return true;
    box._irStarted = true;
    box.setAttribute("data-ir-ready", "1");

    // Markup may already be on the page (pasted into an HTML widget, which
    // is also better for SEO). Use it as-is; build only when it is missing.
    var root = box.querySelector(".ir") || buildMarkup(box);

    // Markup copied from a rendered page keeps the state classes it had
    // then (is-in, is-done...). Clear them so the motion starts fresh.
    box.classList.remove("is-anim", "is-in", "is-done", "is-live");

    var nRec = root.querySelectorAll(".ir__item").length;
    var nSeal = root.querySelectorAll(".ir__seal-item").length;
    motion(box, root, 2600 + nRec * 120 + nSeal * 150);
    return true;
  }

  function buildMarkup(box) {
    var host = box.querySelector(".e-con-inner") || box;
    var records = "", seals = "", nRec = 0, nSeal = 0;

    CONTENT.groups.forEach(function (g, k) {
      if (g.layout === "seals") {
        seals +=
          '<div class="ir__awards">' + groupTitle(g, k) +
          '<ul class="ir__seals">' +
          g.items.map(function (it) { return sealHTML(it, nSeal++); }).join("") +
          "</ul>" +
          "</div>";
      } else {
        records +=
          '<div class="ir__group">' + groupTitle(g, k) +
          '<ul class="ir__chain">' +
          g.items.map(function (it) { return recordHTML(it, nRec++); }).join("") +
          "</ul>" +
          "</div>";
      }
    });

    // The scan line spans the full-bleed container, not the inner box.
    if (!box.querySelector(".ir-fx")) {
      box.insertAdjacentHTML(
        "afterbegin",
        '<div class="ir-fx" aria-hidden="true"><span class="ir-fx__scan"></span></div>'
      );
    }

    host.insertAdjacentHTML(
      "beforeend",
      '<section class="ir" aria-labelledby="ir-title" style="--n:' + nRec + '">' +
      '<div class="ir__grid">' +
      '<header class="ir__intro">' +
      '<p class="ir__eyebrow"><span aria-hidden="true">// </span>' +
      esc(CONTENT.eyebrow) + "</p>" +
      '<h2 class="ir__title" id="ir-title">' +
      wrap(CONTENT.title, CONTENT.emphasis, "em") + "</h2>" +
      '<p class="ir__sub">' + esc(CONTENT.subtitle) + "</p>" +
      ledgerHTML() +
      "</header>" +
      '<div class="ir__records">' + records + "</div>" +
      "</div>" +
      seals +
      "</section>"
    );

    return host.querySelector(".ir");
  }

  /* ---- Motion ----------------------------------------------------------
     .is-anim  entrance animations are armed (held at their first frame)
     .is-in    the one-time entrance plays
     .is-done  entrance finished — drops will-change
     .is-live  section on screen — seal rotation and scan line run
     -------------------------------------------------------------------- */
  function motion(box, root, total) {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window)) {
      box.classList.add("is-in", "is-done", "is-live");
      return;
    }
    if (!reduced) box.classList.add("is-anim");

    // Watch the heading block, not the whole (tall) section, so 20% is
    // always reachable even on a short landscape phone.
    var once = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        box.classList.add("is-in");
        once.disconnect();
        window.setTimeout(function () { box.classList.add("is-done"); }, total);
      },
      { threshold: 0.2 }
    );
    once.observe(root.querySelector(".ir__intro"));

    new IntersectionObserver(function (entries) {
      box.classList.toggle("is-live", entries[0].isIntersecting);
    }).observe(box);

    if (reduced) return;

    // Foil sheen follows the pointer across a seal.
    root.addEventListener("pointermove", function (e) {
      var seal = e.target.closest && e.target.closest(".ir__seal");
      if (!seal) return;
      var r = seal.getBoundingClientRect();
      seal.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      seal.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
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
