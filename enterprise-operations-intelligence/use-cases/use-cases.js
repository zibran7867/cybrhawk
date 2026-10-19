/* =====================================================================
   WEI / ThreatDefence — "Use cases by segment" section
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects the
   section markup into the container matched by SECTION below and pairs
   with use-cases.css.

   One card per segment. Clicking a card opens a video pop-up.
   Everything an editor needs to change lives in the CONTENT block —
   copy, frameworks, poster images and video URLs.

   Add or remove segments by editing CARDS; the grid and the pop-up
   follow automatically.

   If the live container uses a different class, change SECTION — it is
   the only selector this file touches.
   ===================================================================== */
(function () {
  "use strict";

  var SECTION = ".use-cases";

  /* ---- Content (edit freely) -----------------------------------------

     Per card:
       icon       one of: bank | factory | hardhat | derrick |
                          briefcase | network      (badge + artwork)
       title      segment name
       tagline    the line after the em dash
       text       supporting copy
       frameworks the "Frameworks:" line — leave "" to hide it
       duration   badge on the thumbnail, e.g. "02:14"  ("" hides it)
       video      MP4/WebM file URL, OR a YouTube / Vimeo link — the
                  pop-up picks the right player automatically.
                  Leave "" until the video is ready.
       poster     optional thumbnail image URL. When empty, the built-in
                  illustration for `icon` is used instead.
     -------------------------------------------------------------------- */
  var EYEBROW = "Use cases by segment";

  var TITLE = "The vocabulary changes. The problem does not.";

  var SUB =
    "Each deployment is built for the organization it serves its " +
    "authorities, its vocabulary, its sites.\n" +
    "Click on any segment to watch a short video.";

  var CARDS = [
    {
      icon: "bank",
      title: "Banks & Financial Services",
      tagline: "Exam-ready, every day of the year",
      text:
        "One register for control attestations, vendor risk, licensing and " +
        "training watched daily, evidence attached to the requirement it " +
        "satisfies.",
      frameworks: "SOX, GLBA, FFIEC, PCI DSS, BSA/AML.",
      duration: "05:02",
      video: "https://youtu.be/AAmz8IUj_0k?si=8FJdgtSAUzg9maR3",
      poster: ""
    },
    {
      icon: "factory",
      title: "Manufacturing & Industrial",
      tagline: "The plant floor and the permit wall, one brain",
      text:
        "OEE and scrap data next to permits, certifications and work orders " +
        "one connected object, not four systems.",
      frameworks: "OSHA, EPA, ISO 9001/14001/45001.",
      duration: "05:03",
      video: "https://youtu.be/rI4nlHMnPjM?si=bNDSfXf_495Kvq25",
      poster: ""
    },
    {
      icon: "hardhat",
      title: "Construction & Engineering",
      tagline: "Every project is its own jurisdiction",
      text:
        "Permit status, subcontractor evidence, equipment inspections and " +
        "badged workforce, per project, all traceable to source.",
      frameworks: "OSHA, state/municipal permitting, EPA, DOT.",
      duration: "04:51",
      video: "https://youtu.be/TmSQxdLBN1Y?si=WibdxER0tIM9kWHp",
      poster: ""
    },
    {
      icon: "derrick",
      title: "Oil & Gas",
      tagline: "Dispersed assets, undivided attention",
      text:
        "Every asset, inspection interval, contractor certification and " +
        "audit finding in one register, watched daily.",
      frameworks: "PHMSA, OSHA PSM, EPA, API-based regimes.",
      duration: "04:55",
      video: "https://youtu.be/ueiwXGEYxRk?si=AICr1vcgJk80zjuv",
      poster: ""
    },
    {
      icon: "briefcase",
      title: "Consulting & Professional Services",
      tagline: "The firm's memory, finally owned by the firm",
      text:
        "Engagement obligations, credentials, and access tracked so " +
        "institutional memory doesn't walk out the door.",
      frameworks: "SOC 2/ISO 27001 flow-downs, CPE, multi-state registration.",
      duration: "04:44",
      video: "https://youtu.be/HWRqxtr5ppI?si=bur6vx-EmkWawJhG",
      poster: ""
    },
    {
      icon: "network",
      title: "High-End Enterprises",
      tagline: "Thousands of obligations, one register",
      text:
        "Federated, not centralised each business unit keeps its view, " +
        "all reading one brain, role-based access scaling to thousands of " +
        "users.",
      frameworks: "",
      duration: "04:40",
      video: "https://youtu.be/m87fQtFio2w?si=VKtLAOtsJOwlTSIJ",
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
    return (
      '<div class="wei-uc__empty">' +
        "<span>Video coming soon</span>" +
        "<small>Add a URL to this card's <code>video</code> field in " +
        "use-cases.js</small>" +
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
     is only used when there is no self-hosted file to take a frame from.
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

    return (
      '<button type="button" class="wei-uc__card" data-uc-index="' + i + '" ' +
        'style="--uc-i:' + i + '" ' +
        'aria-label="Play the ' + esc(c.title) + ' video">' +
        '<span class="wei-uc__head">' +
          '<span class="wei-uc__badge">' + badge(c.icon) + "</span>" +
          '<span class="wei-uc__copy">' +
            '<span class="wei-uc__card-title">' + esc(c.title) + "</span>" +
            '<span class="wei-uc__card-tagline">' + esc(c.tagline) + "</span>" +
          "</span>" +
        "</span>" +
        '<span class="wei-uc__card-text">' + esc(c.text) + "</span>" +
        (c.frameworks
          ? '<span class="wei-uc__frameworks">' +
              '<span class="wei-uc__frameworks-label">Frameworks:</span> ' +
              esc(c.frameworks) +
            "</span>"
          : "") +
        '<span class="wei-uc__thumb">' +
          thumb +
          '<span class="wei-uc__play">' + PLAY + "</span>" +
          (c.duration
            ? '<span class="wei-uc__time">' + esc(c.duration) + "</span>"
            : "") +
        "</span>" +
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
        '<header class="wei-uc__head-block">' +
          '<span class="wei-uc__bar"></span>' +
          '<p class="wei-uc__eyebrow">' + esc(EYEBROW) + "</p>" +
          '<h2 class="wei-uc__title">' + esc(TITLE) + "</h2>" +
          '<p class="wei-uc__sub">' + nl2br(SUB) + "</p>" +
        "</header>" +
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
