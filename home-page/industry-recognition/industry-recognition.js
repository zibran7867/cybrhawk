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
    if (!box) return false;                             // container not ready
    if (box.getAttribute("data-ir-ready")) return true; // already built
    box.setAttribute("data-ir-ready", "1");

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
    box.insertAdjacentHTML(
      "afterbegin",
      '<div class="ir-fx" aria-hidden="true"><span class="ir-fx__scan"></span></div>'
    );

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

    motion(box, host.querySelector(".ir"), 2600 + nRec * 120 + nSeal * 150);
    return true;
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
