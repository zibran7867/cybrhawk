	/* ============================================================
   Mega Menu — Lightweight Enhancements
   Requires: jQuery
   Scope: #mega-menu-wrap-main-menu
   ============================================================ */

(function () {
  "use strict";

  // Resolved once jQuery is available; init()/isEmpty() close over it.
  var $;

//   var CTA_BY_PANEL = {
//     "solutions": {
//       title: "Not sure which solution fits?",
//       sub:   "Talk to a security advisor and get a tailored XDR walkthrough.",
//       btn:   "Book a demo",
//       href:  "https://cybrhawk.com/request-for-demo/"
//     },
//     "the platform": {
//       title: "See the platform in action",
//       sub:   "Watch a 5-minute product tour of CybrHawk XDR.",
//       btn:   "Watch demo",
//       href:  "https://cybrhawk.com/request-for-demo/"
//     },
//     "services": {
//       title: "Need help operationalizing security?",
//       sub:   "Our experts plug into your team with 24/7 SOC coverage.",
//       btn:   "Contact us",
//       href:  "https://cybrhawk.com/contact/"
//     },
//     "resources": {
//       title: "Stay ahead of the threat curve",
//       sub:   "Read the latest CybrHawk research, blogs, and whitepapers.",
//       btn:   "Browse resources",
//       href:  "https://cybrhawk.com/blogs/"
//     },
//     "company": {
//       title: "Build the future of cybersecurity",
//       sub:   "Learn about our mission, team, and open roles.",
//       btn:   "Get in touch",
//       href:  "https://cybrhawk.com/contact/"
//     }
//   };

//   var ARROW_SVG =
//     '<svg class="mega-cta-arrow" width="14" height="14" viewBox="0 0 24 24"' +
//     ' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"' +
//     ' stroke-linejoin="round" aria-hidden="true">' +
//     '<path d="M5 12h14M13 5l7 7-7 7"></path></svg>';

  function isEmpty($el) {
    if (!$el.length) return true;
    var html = $.trim($el.html() || "");
    if (!html) return true;
    // Strip empty wrapper tags to detect truly empty content
    var stripped = html.replace(/<(div|span|p|br)[^>]*>\s*<\/\1>/gi, "").trim();
    return stripped === "" || stripped === "<br>";
  }

  function init($wrap) {
    if (!$wrap.length || $wrap.data("megaInit")) return;
    $wrap.data("megaInit", true);

    /* Platform panel config (step 1c). Labels are normalised and matched by
       prefix, like positionIn(), so the order holds even if items are dragged
       around in wp-admin; anything unlisted follows in WordPress order.
       PLATFORM_ORDER is the column order; UCD_ORDER the order of UCD's items.
       "identity threat detection" is ITDR's old WordPress label.          */
    var PLATFORM_ORDER = ["unified cyber defense", "hawkint", "hawkstrike", "hawkops"];
    var UCD_ORDER = ["siem xdr", "siem ndr", "siem cloud", "incident response",
                     "itdr", "identity threat detection", "ot security monitoring"];

    /* 0. Re-tag block titles: Max Mega Menu prints them as <h4>, which injects
          nav labels into the page's heading outline. Swap the element for a <p>
          and carry over every attribute + inner HTML, so `.mega-block-title`
          keeps matching and the styling (size, weight, ::before rule) is
          untouched. Runs first, before anything else selects these nodes.     */
    $wrap.find("h1.mega-block-title, h2.mega-block-title, h3.mega-block-title, h4.mega-block-title, h5.mega-block-title, h6.mega-block-title")
      .each(function () {
        var el = this;
        var $p = $("<p></p>").html($(el).html());
        for (var i = 0; i < el.attributes.length; i++) {
          $p.attr(el.attributes[i].name, el.attributes[i].value);
        }
        $(el).replaceWith($p);
      });

    /* 1. Remove empty text widgets (they leave gaps and visual noise) */
    $wrap.find(".mega-menu-item.widget_text").each(function () {
      var $li = $(this);
      var $tw = $li.find(".textwidget").first();
      // Keep if it has a sibling block title with real text
      var $title = $li.find(".mega-block-title").first();
      if (!$title.length && isEmpty($tw)) {
        $li.addClass("mhp-removed").remove();
        return;
      }
      // If the text widget body is empty, drop just the body
      if (isEmpty($tw)) $tw.remove();
      // If after removal there is nothing left, remove the LI
      if (!$.trim($li.text()) && !$li.find("img, svg, a").length) {
        $li.addClass("mhp-removed").remove();
      }
    });

    function norm(s) {
      return $.trim(String(s || "")).toLowerCase().replace(/\s+/g, " ");
    }

    /* 1b. Rebuild each mega panel into a tidy multi-column grid.

          The Max Mega Menu builder scatters items across several rows and
          dumps grouped/newly-added pages into a single full-width column, so
          they stack in one long column. For every panel we collect its
          sections (top-level menu items that carry a link), throw away the
          plugin's empty rows/columns, then re-place them into columns:

            • If the panel matches a named layout in PANEL_LAYOUTS, each
              section is placed in its explicitly-assigned column (keyed on
              link text) for full editorial control.
            • Otherwise the sections are auto-distributed evenly across
              columns (~4 max) so any panel — Solutions, Services, future
              menus — comes out balanced without hard-coding.

          "The Platform" is skipped here and built in 1c: it needs one column
          per product plus ☰ accordions, which a PANEL_LAYOUTS entry can't
          express (an unlisted product would land under UCD, not in a
          column of its own).                                                */
    var PANEL_LAYOUTS = [
      // "Solutions" — explicit 4-column arrangement.
      [
        ["identify protect", "compliance"],
        ["security assessment"],
        ["incident response & management", "incident response and management"],
        ["autonomous soc", "hyper automation"]
      ],
      // "Services" — explicit 2-column arrangement.
      //   Col 1: AI Governance.  Col 2: NOC + its sub-items.
      [
        ["ai governance"],
        ["network operations center", "noc"]
      ],
      // "Resources" — explicit 3-column arrangement.
      //   Same layout as the old auto-distribution, but Blogs and Data Sheets
      //   are swapped: Blogs now sits at the top of column 2 (where Data Sheets
      //   was) and Data Sheets moves to column 3 (where Blogs was).
      [
        ["videos", "press releases"],
        ["blogs", "whitepapers"],
        ["data sheets"]
      ]
    ];

    // Find the column + within-column key index for a label (prefix match so
    // "HawkStrike Automated Pen Testing…" still resolves). The key index lets
    // us order items within a column by the layout array rather than by the
    // order they happen to appear in the source HTML. {col:-1} if no match.
    function positionIn(layout, label) {
      var l = norm(label);
      for (var c = 0; c < layout.length; c++) {
        for (var k = 0; k < layout[c].length; k++) {
          if (l.indexOf(layout[c][k]) === 0) return { col: c, key: k };
        }
      }
      return { col: -1, key: -1 };
    }

    // Column index only (used for match-scoring a layout). -1 if none.
    function columnIn(layout, label) {
      return positionIn(layout, label).col;
    }

    // Pick the named layout whose keys best match this panel's sections, or
    // null if none matches (→ auto-distribute).
    function layoutFor(labels) {
      for (var i = 0; i < PANEL_LAYOUTS.length; i++) {
        var hits = 0;
        for (var j = 0; j < labels.length; j++) {
          if (columnIn(PANEL_LAYOUTS[i], labels[j]) !== -1) hits++;
        }
        if (hits >= 2) return PANEL_LAYOUTS[i];
      }
      return null;
    }

    // Gather a panel's sections (column items that carry a link) in document
    // order, plus the first item holding a block title. Shared by 1b and 1c.
    function collectSections($rows) {
      var sections = [];
      var $blockTitle = null;
      $rows.find("> .mega-sub-menu > .mega-menu-column > .mega-sub-menu > .mega-menu-item").each(function () {
        var $item = $(this);
        var $title = $item.children(".mega-block-title");
        if ($title.length && $.trim($title.text())) {
          if (!$blockTitle) $blockTitle = $item;
          return;
        }
        if ($item.find("> a.mega-menu-link").length) sections.push($item);
      });
      return { sections: sections, $blockTitle: $blockTitle };
    }

    // Replace a panel's rows with one row holding a column per bucket (each
    // a list of section items). The block title, if given, heads column 1.
    // Shared by 1b and 1c.
    function buildColumns($rows, buckets, $blockTitle) {
      var $grid = $("<ul class='mega-sub-menu' role='presentation'></ul>");
      for (var col = 0; col < buckets.length; col++) {
        var $colLi = $("<li class='mega-menu-column mega-menu-columns-3-of-12'></li>");
        var $inner = $("<ul class='mega-sub-menu'></ul>");
        if (col === 0 && $blockTitle) $inner.append($blockTitle);
        for (var j = 0; j < buckets[col].length; j++) $inner.append(buckets[col][j]);
        $colLi.append($inner);
        $grid.append($colLi);
      }
      $rows.first().empty().append($grid);
      $rows.slice(1).remove();
    }

    // The top-level "The Platform" item, found by its label, not its position.
    function isPlatformItem($li) {
      var label = norm($li.children("a.mega-menu-link").first().text());
      return label === "the platform" || label === "platform";
    }

    $wrap.find("> ul > .mega-menu-megamenu").each(function () {
      if (isPlatformItem($(this))) return; // built as a tree in 1c
      var $panel = $(this).children(".mega-sub-menu").first();
      var $rows = $panel.children(".mega-menu-row");
      if (!$rows.length) return;

      var found = collectSections($rows);
      var sections = found.sections;
      var $blockTitle = found.$blockTitle;
      if (!sections.length) return;

      var labels = sections.map(function ($i) {
        return $i.children("a.mega-menu-link").first().text();
      });
      var layout = layoutFor(labels);

      var buckets;
      if (layout) {
        // Explicit placement. Collect each item with its intended key index,
        // then sort each column by that index so the on-screen order matches
        // the layout array — independent of the source HTML order.
        buckets = [];
        for (var b = 0; b < layout.length; b++) buckets.push([]);
        sections.forEach(function ($item, idx) {
          var pos = positionIn(layout, labels[idx]);
          var c = pos.col, k = pos.key;
          if (c === -1) { c = 0; k = Number.MAX_SAFE_INTEGER; } // unmapped → end of first column
          buckets[c].push({ $item: $item, key: k });
        });
        buckets = buckets.map(function (arr) {
          return arr
            .sort(function (a, b) { return a.key - b.key; })
            .map(function (entry) { return entry.$item; });
        });
      } else {
        // Auto-distribute evenly across up to 4 columns.
        var colCount = Math.max(2, Math.min(sections.length, 4));
        var chunk = Math.ceil(sections.length / colCount);
        buckets = [];
        for (var col2 = 0; col2 < colCount; col2++) {
          buckets.push(sections.slice(col2 * chunk, col2 * chunk + chunk));
        }
        // Drop any trailing empty buckets (e.g. 3 sections over 4 cols).
        buckets = buckets.filter(function (arr) { return arr.length; });
      }

      // Replace all rows with a single rebuilt row.
      buildColumns($rows, buckets, $blockTitle);
    });

    /* 1c. "The Platform" is laid out like the other panels: one column per
          product (Unified Cyber Defense (UCD), HawkINT, HawkStrike, HawkOps),
          each a heading with its items listed beneath it. An item that has
          pages of its own (UCD's capabilities) gets a ☰ button that opens
          those pages as an accordion right under it.

          WordPress stays the source of truth for labels, URLs and nesting,
          and the plugin's nested li > ul.mega-sub-menu markup is kept as-is
          so tab order follows the tree. We only give each product its own
          column, re-append items to enforce PLATFORM_ORDER / UCD_ORDER, add
          a ☰ button after every label below a product that has children,
          and toggle `is-active` on items / `hidden` on lists.

          The ☰ opens on click, not hover: an accordion pushes the items
          below it down, so opening on hover would slide the next item out
          from under the pointer and open whatever slid in.

          Handlers are delegated from $wrap rather than the panel: the plugin
          initialises after this script and, with "Unbind JavaScript events"
          on (data-unbind="true"), calls .off() on every ul.mega-sub-menu and
          li.mega-menu-item in the menu, which would drop anything bound to
          the panel itself.                                                    */
    var TREE_HAMBURGER =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="1.7" stroke-linecap="round"' +
      ' aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';

    function treeLabel(li) {
      return $.trim($(li).children("a.mega-menu-link").first().text());
    }

    // DOM items in `keys` order (prefix match via positionIn); unlisted items
    // follow in their original order.
    function orderByKeys(items, keys) {
      return items.map(function (li, i) {
        var k = positionIn([keys], treeLabel(li)).key;
        return { li: li, key: k === -1 ? keys.length : k, i: i };
      }).sort(function (a, b) {
        return (a.key - b.key) || (a.i - b.i);
      }).map(function (entry) { return entry.li; });
    }

    $wrap.find("> ul > .mega-menu-megamenu").each(function () {
      var $top = $(this);
      if (!isPlatformItem($top)) return;
      var $panel = $top.children(".mega-sub-menu").first();
      var $rows = $panel.children(".mega-menu-row");
      if (!$rows.length) return;

      var found = collectSections($rows);
      if (!found.sections.length) return;

      // One column per product, in PLATFORM_ORDER. The block title leaves
      // column 1 and sits above all of them, so every product heading
      // starts on the same line (and 2b adds no spacer captions).
      var $title = found.$blockTitle ? found.$blockTitle.children(".mega-block-title").detach() : $();
      var items = orderByKeys($.map(found.sections, function ($i) { return $i[0]; }), PLATFORM_ORDER);
      buildColumns($rows, items.map(function (li) { return [li]; }), null);
      $rows.first().prepend($title);
      $panel.addClass("mega-platform-tree");

      // UCD's capabilities (UCD is PLATFORM_ORDER[0]), re-appended inside
      // their own list.
      var $ucd = $(items).filter(function () {
        return positionIn([PLATFORM_ORDER], treeLabel(this)).key === 0;
      }).first();
      var $ucdList = $ucd.children("ul.mega-sub-menu").first();
      $ucdList.append(orderByKeys($ucdList.children("li").get(), UCD_ORDER));

      // A ☰ button right after every label whose list has items, so it
      // follows the label in tab order. Products are skipped: they are
      // column headings whose items always show. Leaves get nothing.
      var listCount = 0;
      $(items).find("li").each(function () {
        var $li = $(this);
        var $a = $li.children("a.mega-menu-link").first();
        var $list = $li.children("ul.mega-sub-menu").first();
        if (!$a.length || !$list.children("li").length) return;
        if (!$list.attr("id")) $list.attr("id", "mega-tree-list-" + (++listCount));
        $list.attr("hidden", "");
        $li.addClass("mega-tree-parent");
        $a.after(
          '<button type="button" class="mega-tree-toggle" aria-expanded="false"' +
          ' aria-controls="' + escapeAttr($list.attr("id")) + '"' +
          ' aria-label="' + escapeAttr("Show " + treeLabel(this) + " pages") + '">' +
          TREE_HAMBURGER + '</button>');
      });

      // Slide a list open or shut by setting its height; the transition
      // itself lives in the CSS. It starts from the list's current height,
      // so a click mid-slide reverses smoothly instead of jumping, and the
      // slide ends after the CSS duration (read back, so the reduced-motion
      // rule shortens it too). `hidden` goes back on only once a closing
      // slide has finished.
      function slide(list, open) {
        var $list = $(list);
        clearTimeout($list.data("megaSlide"));
        var from = list.hasAttribute("hidden") ? 0 : list.getBoundingClientRect().height;
        $list.removeAttr("hidden").addClass("is-sliding");
        var to = open ? list.scrollHeight : 0;
        list.style.height = from + "px";
        list.getBoundingClientRect(); // commit the start height before the transition
        list.style.height = to + "px";
        var ms = parseFloat(window.getComputedStyle(list).transitionDuration) * 1000 || 0;
        $list.data("megaSlide", setTimeout(function () {
          $list.removeClass("is-sliding");
          list.style.height = "";
          if (!open) $list.attr("hidden", "");
        }, ms));
      }

      // Open or close one item, sliding its list when `animate` is set.
      // The slide runs before `is-active` changes, so an opening list is
      // laid out at opacity 0 first and the CSS fade-in has a start point.
      function setItem($li, open, animate) {
        var $list = $li.children("ul.mega-sub-menu").first();
        if (animate) {
          slide($list[0], open);
        } else {
          clearTimeout($list.data("megaSlide"));
          $list.removeClass("is-sliding").css("height", "").attr("hidden", open ? null : "");
        }
        $li.toggleClass("is-active", open);
        $li.children(".mega-tree-toggle").attr({
          "aria-expanded": open ? "true" : "false",
          // .attr() stores the raw string, so no escapeAttr() here.
          "aria-label": (open ? "Hide " : "Show ") + treeLabel($li[0]) + " pages"
        });
      }

      // Close an item and everything open beneath it. Only the item itself
      // slides; whatever is open inside it folds away within that slide.
      function closeItem($li, animate) {
        if ($li.hasClass("is-active")) setItem($li, false, animate);
        $li.find(".is-active").each(function () { setItem($(this), false, false); });
      }

      // Accordion: opening an item closes any open sibling, and the two
      // slide at once.
      function toggleItem($li) {
        if ($li.hasClass("is-active")) {
          closeItem($li, true);
          return;
        }
        $li.siblings(".is-active").each(function () { closeItem($(this), true); });
        setItem($li, true, true);
      }

      // Default state: everything folded, so each column shows just its
      // product's items. The panel is already closed, so no slide.
      function resetTree() {
        $panel.find(".mega-tree-parent.is-active").each(function () {
          setItem($(this), false, false);
        });
      }

      // A label with Max Mega Menu's "Disable link" on has no href: it
      // doesn't navigate, so it works like its ☰.
      var NO_LINK_LABEL = ".mega-tree-parent > a.mega-menu-link:not([href])";

      // The ☰ toggles; a label with a link stays a plain link.
      $wrap.on("click.megaPlatform", ".mega-platform-tree .mega-tree-toggle, .mega-platform-tree " + NO_LINK_LABEL, function (e) {
        e.preventDefault();
        toggleItem($(this).parent());
      });

      // Escape closes the open item focus is in (on its label or ☰, or
      // inside its pages) and returns focus to its ☰. Matching the focused
      // element itself (as the plugin's own keydown does) and binding first
      // lets stopImmediatePropagation() keep the plugin from also closing
      // the whole panel. Anywhere else, Escape falls through to the plugin.
      $wrap.on("keydown.megaPlatform", ".mega-platform-tree a, .mega-platform-tree .mega-tree-toggle", function (e) {
        // A label without a link gets no native Enter/Space activation.
        if ((e.key === "Enter" || e.key === " " || e.key === "Spacebar") && $(this).is(NO_LINK_LABEL)) {
          e.preventDefault();
          toggleItem($(this).parent());
          return;
        }
        if (e.key !== "Escape" && e.key !== "Esc") return;
        var $item = $(this).closest(".mega-tree-parent.is-active");
        if (!$item.length) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        closeItem($item, true);
        var button = $item.children(".mega-tree-toggle")[0];
        if (button) button.focus();
      });

      // Back to the default state whenever the panel closes: the plugin
      // drops `mega-toggle-on`, or the pointer leaves the top-level item.
      // The reset waits out the plugin's close effect so the panel doesn't
      // visibly fold while it fades; reopening first resets at once.
      var top = $top[0];
      var closeDelay = parseInt($top.parent().attr("data-effect-speed"), 10) || 0;
      var resetTimer = null;
      function scheduleReset() {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          resetTimer = null;
          // The pointer came back before the plugin closed the panel.
          if ($top.hasClass("mega-toggle-on")) return;
          resetTree();
        }, closeDelay);
      }
      function panelOpened() {
        if (!resetTimer) return;
        clearTimeout(resetTimer);
        resetTimer = null;
        resetTree();
      }

      $wrap.on("mouseleave.megaPlatform", "li.mega-menu-megamenu", function () {
        // Keyboard users may still be inside the panel.
        if (this !== top || $.contains(top, document.activeElement)) return;
        scheduleReset();
      });

      if (window.MutationObserver) {
        var wasOpen = $top.hasClass("mega-toggle-on");
        new MutationObserver(function () {
          var isOpen = $top.hasClass("mega-toggle-on");
          if (isOpen === wasOpen) return;
          wasOpen = isOpen;
          if (isOpen) panelOpened();
          else scheduleReset();
        }).observe(top, { attributes: true, attributeFilter: ["class"] });
      }
    });

    /* 2. Tag each row with its column count for the grid template */
    $wrap.find(".mega-menu-row").each(function () {
      var $row = $(this);
      // Count only columns that actually have visible content — the plugin
      // leaves behind empty placeholder columns that would otherwise inflate
      // the grid and create blank tracks.
      var cols = $row.find("> .mega-sub-menu > .mega-menu-column").filter(function () {
        return $.trim($(this).text()) !== "" || $(this).find("img, svg").length;
      }).length;
      if (cols > 0) {
        $row.find("> .mega-sub-menu").css("--mega-cols", cols);
      } else {
        // Empty row — hide it so it does not take space
        $row.hide();
      }
    });

	/* 2b. Align column tops: if any column in a row has a .mega-block-title,
          inject an invisible spacer caption into the columns that don't,
          so every column's first link starts on the same baseline. */
    $wrap.find(".mega-menu-row > .mega-sub-menu").each(function () {
      var $cols = $(this).children(".mega-menu-column");
      var hasTitle = false;
      $cols.each(function () {
        if ($(this).find("> .mega-sub-menu > .mega-menu-item .mega-block-title").length) {
          hasTitle = true;
          return false;
        }
      });
      if (!hasTitle) return;

      $cols.each(function () {
        var $col = $(this);
        var $inner = $col.children(".mega-sub-menu");
        if (!$inner.length) return;
        if ($col.find(".mega-block-title").length) return;
        if ($col.find("> .mega-sub-menu > .mega-auto-caption").length) return;
        $inner.prepend('<li class="mega-auto-caption" aria-hidden="true"></li>');
      });
    });

    /* 3. Inject "Trusted & Certified" band at the bottom of the RESOURCES
          mega panel only, so the badges only appear when the visitor hovers
          "Resources". Add new badges by appending { alt, src } to TRUST_BADGES. */
    var TRUST_BADGES = [
      {
        alt: "Compliance Certification",
        src: "https://cybrhawk.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-08-24-at-15.11.48_5525ec92.jpg"
      },
      {
        alt: "Compliance Certification",
        src: "https://cybrhawk.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-08-24-at-15.12.18_e7876620.jpg"
      },
      {
        alt: "Cybersecurity Breakthrough Award 2026",
        src: "https://cybrhawk.com/wp-content/uploads/2026/10/Cybersecurity_Breakthrough_Award-Badge_2026.webp"
      },
    ];

    // Build the entity at runtime ("&#" + code + ";") instead of writing
    // & / " literally: pasting this file through an editor that
    // HTML-decodes its input would turn those literals into bare & and "
    // and break the script. Numeric refs are valid in HTML attributes.
    function escapeAttr(s) {
      return String(s).replace(/[&"<>]/g, function (c) {
        return "&#" + c.charCodeAt(0) + ";";
      });
    }

    $wrap.find("> ul > .mega-menu-megamenu").each(function () {
      var $li = $(this);
      // Restrict to the "Resources" panel only.
      var panelLabel = norm($li.children("a.mega-menu-link").first().text());
      if (panelLabel !== "resources") return;
      var $panel = $li.children(".mega-sub-menu").first();
      if (!$panel.length || $panel.find(".mega-trust-band").length) return;

      var html =
        '<li class="mega-trust-band" aria-label="Awards">' +
          '<span class="mega-trust-band-title">Awards</span>' +
          '<div class="mega-trust-badges">';
      var IMG_STYLE = "display:block !important;" +
        "height:44px !important;width:auto !important;" +
        "max-width:130px !important;max-height:44px !important;" +
        "min-width:0 !important;min-height:0 !important;" +
        "object-fit:contain !important;margin:0 !important;padding:0 !important;";
      for (var i = 0; i < TRUST_BADGES.length; i++) {
        var b = TRUST_BADGES[i];
        html +=
          '<span class="mega-trust-badge mega-trust-badge--image">' +
            '<img class="mega-trust-badge-logo" src="' + escapeAttr(b.src) +
            '" alt="' + escapeAttr(b.alt) + '" loading="lazy"' +
            ' style="' + IMG_STYLE + '" />' +
          '</span>';
      }
      html += '</div></li>';

      $panel.append(html);
    });

    /* 5. Full-bleed alignment.
          The mega panel spans the whole viewport, but it is absolutely
          positioned against its (off-centre) menu container, so left:50% +
          translateX(-50%) drifted it sideways and left a gap on one edge on
          any page whose header is not centred. Measure the panel's offset
          parent and feed exact pixel values into CSS custom properties so the
          panel always starts at the viewport's left edge and is exactly the
          viewport wide. clientWidth (not 100vw) avoids counting the scrollbar. */
    function nearestPositioned(el) {
      for (var p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        if (window.getComputedStyle(p).position !== "static") return p;
      }
      return document.documentElement;
    }

    function positionPanels() {
      var vw = document.documentElement.clientWidth;
      $wrap.find("> ul > .mega-menu-megamenu > .mega-sub-menu").each(function () {
        var panel = this;
        var op = nearestPositioned(panel);
        var left = -(op.getBoundingClientRect().left + op.clientLeft);
        panel.style.setProperty("--mega-left", left + "px");
        panel.style.setProperty("--mega-width", vw + "px");
        panel.style.setProperty("--mega-tx", "0px");
      });
    }

    positionPanels();

    // Recompute whenever the layout can shift, and just before a panel opens
    // (a sticky header may have resized/moved by then).
    $(window).on("resize.mega orientationchange.mega load.mega", positionPanels);
    $wrap.find("> ul > .mega-menu-megamenu").on("mouseenter.mega focusin.mega", positionPanels);

    /* 4. (legacy) Inject CTA card at the bottom of each top-level mega panel */
//     $wrap.find("> ul > .mega-menu-megamenu").each(function () {
//       var $li = $(this);
//       var $panel = $li.children(".mega-sub-menu").first();
//       if (!$panel.length || $panel.find(".mega-cta-card").length) return;

//       var label = $.trim($li.children("a.mega-menu-link").first().text())
//         .toLowerCase();
//       var cta = CTA_BY_PANEL[label];
//       if (!cta) return;

//       var $card = $(
//         '<div class="mega-cta-card">' +
//           '<div class="mega-cta-text">' +
//             '<span class="mega-cta-title"></span>' +
//             '<span class="mega-cta-sub"></span>' +
//           '</div>' +
//           '<a class="mega-cta-btn" href="' + cta.href + '">' +
//             '<span></span>' +
//             ARROW_SVG +
//           '</a>' +
//         '</div>'
//       );
//       $card.find(".mega-cta-title").text(cta.title);
//       $card.find(".mega-cta-sub").text(cta.sub);
//       $card.find(".mega-cta-btn > span").text(cta.btn);

//       $panel.append($card);
//     });
  }

  function run() {
    try {
      var $wrap = $("#mega-menu-wrap-main-menu");
      if ($wrap.length) init($wrap);
    } catch (e) {
      // Surface the real error instead of failing silently.
      if (window.console) console.error("[mega-menu] init failed:", e);
    }
  }

  // Keep trying until the menu exists AND init has marked itself done, or we
  // run out of tries. Robust to jQuery / menu HTML arriving at any time.
  function boot() {
    var tries = 0;
    var timer = setInterval(function () {
      var jq = window.jQuery || window.$;
      if (jq) {
        $ = jq;
        run();
      }
      var done = jq && jq("#mega-menu-wrap-main-menu").data("megaInit");
      if (done || ++tries >= 40) clearInterval(timer);
    }, 250);

    // Also hook DOMReady if jQuery is already available.
    var jqNow = window.jQuery || window.$;
    if (jqNow && jqNow.fn && jqNow.fn.ready) {
      $ = jqNow;
      jqNow(function () { run(); });
    }
  }

  // One-line marker so you can confirm in the console which build is live.
  if (window.console) console.log("[mega-menu] script v3 loaded");

  boot();
})();
