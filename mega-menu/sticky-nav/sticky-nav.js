/* ============================================================
   Sticky Navbar on Scroll
   Requires: jQuery
   Adds .is-stuck to .elementor-element-f1a8763 once user scrolls past it.
   ============================================================ */

(function ($) {
    "use strict";

    $(function () {
        var $nav = $(".elementor-element-f1a8763").first();
        if (!$nav.length) return;

        var STICK_AFTER = 80;       // px scrolled before nav becomes fixed
        var stuck = false;
        var ticking = false;
        var $spacer = null;

        // Elementor positions this header absolutely over the hero, so it
        // takes no room in the page and fixing it moves nothing. A spacer
        // there would push the page down by the header's height mid-scroll.
        // Read once, before .is-stuck changes the position.
        var position = $nav.css("position");
        var needsSpacer = position !== "absolute" && position !== "fixed";

        function createSpacer() {
            if ($spacer && $spacer.length) return;
            $spacer = $('<div class="nav-sticky-spacer" aria-hidden="true"></div>');
            $spacer.css({ height: $nav.outerHeight() + "px", display: "none" });
            $nav.after($spacer);
        }

        function setStuck(on) {
            if (on === stuck) return;
            stuck = on;
            if (on) {
                if (needsSpacer) {
                    createSpacer();
                    $spacer.css({ height: $nav.outerHeight() + "px", display: "block" });
                }
                $nav.addClass("is-stuck");
            } else {
                $nav.removeClass("is-stuck");
                if ($spacer) $spacer.css("display", "none");
            }
        }

        function onScroll() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            setStuck(y > STICK_AFTER);
            ticking = false;
        }

        $(window).on("scroll.navSticky", function () {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        });

        // Keep spacer height in sync on resize
        $(window).on("resize.navSticky", function () {
            if (stuck && $spacer) $spacer.css("height", $nav.outerHeight() + "px");
        });

        // Initial check (in case page loads scrolled)
        onScroll();
    });
})(window.jQuery || window.$);
