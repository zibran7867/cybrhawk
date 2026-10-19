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
    var modal = modalController();

    root.querySelector(".wei-uc__grid").addEventListener("click", function (e) {
      var card = e.target.closest && e.target.closest(".wei-uc__card");
      if (!card) return;
      modal.open(CARDS[Number(card.getAttribute("data-uc-index"))]);
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
