/* =====================================================================
   GigaOm Brief — lead-capture modal
   ---------------------------------------------------------------------
   Plugin:   Simple Custom CSS and JS  →  "GigaOm Brief Modal" (JS)
   Pairs with: "GigaOm Brief Modal" (CSS) in the same plugin.
   Backend:  Contact Form 7 form "GigaOm Brief Download" (ID 18769) —
             a duplicate of "Download Report" (ID 17361) so the team's
             notification email says which asset was downloaded.

   What it does
   - Any click on the homepage popup's "Download GigaOm Brief" button
     (data-cybrhawk-cta="gigaom_brief") — or on any other element with
     [data-gigaom-brief] / href="#gigaom-brief" — opens a modal on the
     same page instead of downloading or navigating away.
   - The modal collects the SAME details as the FortiBleed report form
     on /download-report/ (first name, last name, business email,
     company, phone, terms), with the SAME validation rules.
   - On a valid submit it: sends the lead to CF7 (emails the team),
     starts the PDF download, and shows a success state with a manual
     download link — exactly like the FortiBleed flow.

   It does NOT edit the homepage popup snippet. If this snippet is
   deactivated, the popup button falls back to its original behaviour
   (direct PDF download).

   Testing from the console:
     cybrhawkGigaomModal.open()   cybrhawkGigaomModal.close()
   ===================================================================== */
(function () {
    "use strict";

    if (window.cybrhawkGigaomModal) return; // guard against double-loading

    /* ---- Config (edit freely) ------------------------------------------ */
    var PDF_URL =
        "https://cybrhawk.com/wp-content/uploads/2026/11/" +
        "CybrHawk-Perspective-Brief.pdf";

    // Contact Form 7 form that receives the lead and emails the team.
    var CF7_FORM_ID = "18769";

    // Elements that open the modal.
    var TRIGGER_SELECTOR =
        '[data-cybrhawk-cta="gigaom_brief"], [data-gigaom-brief], a[href="#gigaom-brief"]';

    var COPY = {
        eyebrow: "GigaOm Brief",
        titleLead: "Download the ",
        titleAccent: "GigaOm Brief",
        intro: "Share a few details and your copy will start downloading right away.",
        submit: "Download Brief",
        loading: "Downloading…",
        successTitle: "Your download is starting",
        successText: "Thanks — the GigaOm brief should begin downloading automatically.",
        successLink: "Download it manually",
        termsError: "Please accept the Terms & Conditions to continue."
    };

    var TERMS_URL = "https://cybrhawk.com/terms-condition/";
    var PRIVACY_URL = "https://cybrhawk.com/privacy-policy/";

    /* ---- Validation (mirrors the FortiBleed /download-report/ form) ---- */
    var BLOCKED_EMAIL_DOMAINS = [
        "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk",
        "ymail.com", "rocketmail.com", "hotmail.com", "hotmail.co.uk", "outlook.com",
        "live.com", "msn.com", "aol.com", "icloud.com", "me.com", "mac.com",
        "gmx.com", "gmx.net", "mail.com", "zoho.com", "yandex.com", "yandex.ru",
        "protonmail.com", "proton.me", "pm.me", "tutanota.com", "hey.com",
        "yopmail.com", "yopmail.fr", "mailinator.com", "guerrillamail.com",
        "guerrillamail.info", "sharklasers.com", "10minutemail.com", "temp-mail.org",
        "tempmail.com", "getnada.com", "trashmail.com", "dispostable.com",
        "fakeinbox.com", "throwawaymail.com", "maildrop.cc", "mailnesia.com",
        "mohmal.com", "emailondeck.com", "spam4.me", "moakt.com"
    ];
    var VALIDATION = {
        email: 254,
        name: { min: 2, max: 50 },
        company: { min: 2, max: 100 },
        phone: { min: 7, max: 15 }
    };
    var RE = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        name: /^[A-Za-z][A-Za-z .'-]*$/,
        company: /^[A-Za-z0-9][A-Za-z0-9 .,&'()/-]*$/
    };
    var ALLOW = {
        name: /[^A-Za-z .'-]/g,
        company: /[^A-Za-z0-9 .,&'()/-]/g,
        tel: /\D/g
    };
    var FIELDS = [
        { name: "first_name", label: "First Name", type: "text", auto: "given-name" },
        { name: "last_name", label: "Last Name", type: "text", auto: "family-name" },
        { name: "business_email", label: "Business Email", type: "email", auto: "email" },
        { name: "company", label: "Company Name", type: "text", auto: "organization" },
        { name: "phone", label: "Phone Number", type: "tel", auto: "tel" }
    ];
    /* -------------------------------------------------------------------- */

    var ID = "cybrhawk-gm";
    var portal = null;
    var dialog = null;
    var form = null;
    var lastTrigger = null;
    var hidCornerPopup = false;
    var submitted = false;

    var ARROW =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    var CLOSE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var CHECK_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="20 6 9 17 4 12"/></svg>';

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return "&#" + c.charCodeAt(0) + ";";
        });
    }

    function loadFont() {
        if (document.getElementById("cybrhawk-condensed-font") ||
            document.getElementById("report-form-font") ||
            document.getElementById("cybrhawk-gm-font")) return;
        var l = document.createElement("link");
        l.id = "cybrhawk-gm-font";
        l.rel = "stylesheet";
        l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:" +
            "ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&display=swap";
        document.head.appendChild(l);
    }

    /* ---- Build ---------------------------------------------------------- */
    function fieldHtml(f) {
        var id = ID + "-" + f.name;
        var extra = "";
        if (f.type === "email") extra = ' maxlength="254"';
        if (f.type === "tel") extra = ' inputmode="numeric" maxlength="15"';
        return '<div class="cybrhawk-gm__field">' +
            '<input class="cybrhawk-gm__control" id="' + id + '" name="' + f.name + '"' +
            ' type="' + f.type + '" placeholder=" " autocomplete="' + f.auto + '"' + extra +
            ' required aria-required="true" aria-describedby="' + id + '-err">' +
            '<label class="cybrhawk-gm__label" for="' + id + '">' + esc(f.label) +
            ' <span class="cybrhawk-gm__req">*</span></label>' +
            '<span class="cybrhawk-gm__error" id="' + id + '-err" role="alert"></span>' +
            "</div>";
    }

    function build() {
        if (portal) return;
        loadFont();

        portal = document.createElement("div");
        portal.className = "cybrhawk-gm-portal";
        portal.hidden = true;
        portal.innerHTML =
            '<div class="cybrhawk-gm__backdrop" data-gm-close></div>' +
            '<div class="cybrhawk-gm__dialog" role="dialog" aria-modal="true" ' +
            'aria-labelledby="' + ID + '-title" aria-describedby="' + ID + '-intro" data-lenis-prevent>' +
            '<button type="button" class="cybrhawk-gm__close" aria-label="Close" data-gm-close>' +
            CLOSE_ICON + "</button>" +

            '<div class="cybrhawk-gm__body">' +
            '<p class="cybrhawk-gm__eyebrow"><span class="cybrhawk-gm__eyebrow-line"></span>' +
            esc(COPY.eyebrow) + "</p>" +
            '<h2 class="cybrhawk-gm__title" id="' + ID + '-title">' + esc(COPY.titleLead) +
            '<span class="cybrhawk-gm__title-accent">' + esc(COPY.titleAccent) + "</span></h2>" +
            '<p class="cybrhawk-gm__intro" id="' + ID + '-intro">' + esc(COPY.intro) + "</p>" +

            '<form class="cybrhawk-gm__form" novalidate>' +
            '<div class="cybrhawk-gm__grid">' + FIELDS.map(fieldHtml).join("") + "</div>" +
            '<p class="cybrhawk-gm__consent">By clicking submit, I consent to the processing ' +
            "of my contact information by CybrHawk and its partners, including CybrHawk " +
            "contacting me and sharing my contact information with its partners. I acknowledge " +
            "that CybrHawk will use and keep my contact information for as long as necessary " +
            'for these purposes in accordance with its <a href="' + esc(PRIVACY_URL) +
            '" target="_blank" rel="noopener">Privacy Notice</a>.</p>' +
            '<div class="cybrhawk-gm__terms">' +
            '<label class="cybrhawk-gm__terms-label" for="' + ID + '-terms">' +
            '<input class="cybrhawk-gm__terms-input" id="' + ID + '-terms" type="checkbox" ' +
            'name="terms" required aria-describedby="' + ID + '-terms-err">' +
            '<span class="cybrhawk-gm__terms-box" aria-hidden="true"></span>' +
            '<span class="cybrhawk-gm__terms-text">I agree to the <a href="' + esc(TERMS_URL) +
            '" target="_blank" rel="noopener">Terms & Conditions</a>' +
            '<span class="cybrhawk-gm__req">*</span></span></label>' +
            '<span class="cybrhawk-gm__error" id="' + ID + '-terms-err" role="alert"></span>' +
            "</div>" +
            '<div class="cybrhawk-gm__actions">' +
            '<button type="submit" class="cybrhawk-gm__submit">' +
            '<span class="cybrhawk-gm__submit-label">' + esc(COPY.submit) + "</span>" +
            '<span class="cybrhawk-gm__submit-arrow">' + ARROW + "</span>" +
            '<span class="cybrhawk-gm__submit-spinner" aria-hidden="true"></span>' +
            "</button></div>" +
            "</form>" +

            '<div class="cybrhawk-gm__success" hidden>' +
            '<span class="cybrhawk-gm__success-icon">' + CHECK_ICON + "</span>" +
            '<h3 class="cybrhawk-gm__success-title">' + esc(COPY.successTitle) + "</h3>" +
            '<p class="cybrhawk-gm__success-text">' + esc(COPY.successText) + "</p>" +
            '<a class="cybrhawk-gm__success-link" href="' + esc(PDF_URL) +
            '" target="_blank" rel="noopener" download>' + esc(COPY.successLink) + "</a>" +
            "</div>" +
            "</div>" + // body
            "</div>"; // dialog

        document.body.appendChild(portal);
        dialog = portal.querySelector(".cybrhawk-gm__dialog");
        form = portal.querySelector(".cybrhawk-gm__form");
        wire();
    }

    /* ---- Corner popup coordination -------------------------------------- */
    // Hide the homepage corner popup while the modal is open, and bring it
    // back if the visitor closes the modal without downloading.
    function cornerPopup() {
        return document.querySelector(".cybrhawk-pop-portal");
    }
    function hideCorner() {
        var p = cornerPopup();
        if (p && p.classList.contains("cybrhawk-pop-open")) {
            p.classList.remove("cybrhawk-pop-open");
            p.setAttribute("aria-hidden", "true");
            hidCornerPopup = true;
        }
    }
    function restoreCorner() {
        var p = cornerPopup();
        if (p && hidCornerPopup && !submitted) {
            p.classList.add("cybrhawk-pop-open");
            p.setAttribute("aria-hidden", "false");
        }
        hidCornerPopup = false;
    }

    /* ---- Open / close --------------------------------------------------- */
    var savedY = 0;
    function lockScroll() {
        var sbw = window.innerWidth - document.documentElement.clientWidth;
        savedY = window.pageYOffset;
        document.documentElement.classList.add("cybrhawk-gm-lock");
        if (sbw > 0) document.body.style.paddingRight = sbw + "px";
    }
    function unlockScroll() {
        document.documentElement.classList.remove("cybrhawk-gm-lock");
        document.body.style.paddingRight = "";
        if (Math.abs(window.pageYOffset - savedY) > 2) window.scrollTo(0, savedY);
    }

    function isOpen() {
        return !!portal && portal.classList.contains("is-open");
    }

    // Logged-in admins: keep the dialog below the fixed WP admin bar.
    function adminBarOffset() {
        var ab = document.getElementById("wpadminbar");
        if (!ab) return 0;
        if (window.getComputedStyle(ab).display === "none") return 0;
        return Math.max(0, Math.round(ab.getBoundingClientRect().bottom));
    }

    function open(trigger) {
        build();
        if (isOpen()) return;
        lastTrigger = trigger || document.activeElement;
        hideCorner();
        portal.style.top = adminBarOffset() + "px";
        portal.hidden = false;
        lockScroll();
        // next frame so the CSS transition runs
        requestAnimationFrame(function () {
            portal.classList.add("is-open");
        });
        var target = submitted
            ? portal.querySelector(".cybrhawk-gm__success")
            : form.querySelector(".cybrhawk-gm__control");
        setTimeout(function () {
            if (target) target.focus({ preventScroll: true });
        }, 60);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "cybrhawk_gigaom_modal_open" });
    }

    function close() {
        if (!isOpen()) return;
        portal.classList.remove("is-open");
        unlockScroll();
        setTimeout(function () {
            if (!portal.classList.contains("is-open")) portal.hidden = true;
        }, 220);
        restoreCorner();
        // Return focus to the button that opened the modal. Wait for the
        // corner popup's 0.32s visibility transition, or focus() is ignored.
        var back = lastTrigger;
        lastTrigger = null;
        if (back && back.focus) {
            setTimeout(function () {
                if (isOpen() || !document.contains(back) || back.offsetParent === null) return;
                try { back.focus({ preventScroll: true }); } catch (e) { }
            }, 360);
        }
    }

    /* ---- Form behaviour (same rules as FortiBleed) ---------------------- */
    function sanitize(ctrl) {
        var pattern = null;
        if (ctrl.type === "tel") pattern = ALLOW.tel;
        else if (ctrl.name === "first_name" || ctrl.name === "last_name") pattern = ALLOW.name;
        else if (ctrl.name === "company") pattern = ALLOW.company;
        if (!pattern) return;
        var cleaned = ctrl.value.replace(pattern, "");
        if (cleaned === ctrl.value) return;
        var pos = ctrl.selectionStart;
        if (pos !== null && pos !== undefined) {
            var before = ctrl.value.slice(0, pos).replace(pattern, "").length;
            ctrl.value = cleaned;
            try { ctrl.setSelectionRange(before, before); } catch (e) { }
        } else {
            ctrl.value = cleaned;
        }
    }

    function validateField(ctrl, val) {
        if (!val) return "This field is required.";
        if (ctrl.type === "email") {
            if (val.length > VALIDATION.email || !RE.email.test(val)) {
                return "Enter a valid email address.";
            }
            if (BLOCKED_EMAIL_DOMAINS.indexOf(val.split("@").pop().toLowerCase()) !== -1) {
                return "Please use your business email address.";
            }
            return "";
        }
        if (ctrl.type === "tel") {
            var phone = val.replace(/\D/g, "");
            if (!/^\d+$/.test(phone)) return "Enter numbers only.";
            if (phone.length < VALIDATION.phone.min || phone.length > VALIDATION.phone.max) {
                return "Enter a valid phone number.";
            }
            return "";
        }
        if (ctrl.name === "first_name" || ctrl.name === "last_name") {
            if (val.length < VALIDATION.name.min) return "Enter at least 2 characters.";
            if (val.length > VALIDATION.name.max) return "Please keep this under 50 characters.";
            if (!RE.name.test(val)) return "Use letters only (no numbers or symbols).";
            return "";
        }
        if (ctrl.name === "company") {
            if (val.length < VALIDATION.company.min) return "Enter at least 2 characters.";
            if (val.length > VALIDATION.company.max) return "Please keep this under 100 characters.";
            if (!RE.company.test(val)) return "Remove any special characters.";
            return "";
        }
        return "";
    }

    function submitToCF7(fields) {
        if (!CF7_FORM_ID || !window.fetch || !window.FormData) return;
        var data = new FormData();
        fields.forEach(function (f) {
            var ctrl = f.querySelector(".cybrhawk-gm__control");
            if (ctrl && ctrl.name) data.append(ctrl.name, (ctrl.value || "").trim());
        });
        data.append("_wpcf7_unit_tag", "gigaom-brief-" + CF7_FORM_ID);
        fetch(location.origin + "/wp-json/contact-form-7/v1/contact-forms/" +
            CF7_FORM_ID + "/feedback", {
            method: "POST",
            body: data,
            credentials: "same-origin",
            keepalive: true
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json || json.status !== "mail_sent") {
                    console.warn("[gigaom-modal] CF7 did not send mail:", json);
                }
            })
            .catch(function (err) {
                console.warn("[gigaom-modal] CF7 request failed:", err);
            });
    }

    function startDownload() {
        var a = document.createElement("a");
        a.href = PDF_URL;
        a.download = PDF_URL.split("/").pop() || "gigaom-brief.pdf";
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function wire() {
        var fields = Array.prototype.slice.call(form.querySelectorAll(".cybrhawk-gm__field"));

        fields.forEach(function (f) {
            var ctrl = f.querySelector(".cybrhawk-gm__control");
            var sync = function () { f.classList.toggle("is-filled", !!ctrl.value); };
            if (ctrl.type === "tel") {
                ctrl.addEventListener("keypress", function (ev) {
                    if (ev.key && ev.key.length === 1 && /\D/.test(ev.key)) ev.preventDefault();
                });
            }
            ctrl.addEventListener("focus", function () { f.classList.add("is-focused"); });
            ctrl.addEventListener("blur", function () { f.classList.remove("is-focused"); sync(); });
            ctrl.addEventListener("input", function () {
                sanitize(ctrl);
                sync();
                f.classList.remove("is-error");
            });
            ctrl.addEventListener("change", function () { sync(); f.classList.remove("is-error"); });
            sync();
        });

        var termsWrap = form.querySelector(".cybrhawk-gm__terms");
        var termsInput = form.querySelector(".cybrhawk-gm__terms-input");
        var termsErr = form.querySelector("#" + ID + "-terms-err");
        termsInput.addEventListener("change", function () {
            if (termsInput.checked) {
                termsWrap.classList.remove("is-error");
                termsErr.textContent = "";
            }
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var ok = true;
            var firstBad = null;

            fields.forEach(function (f) {
                var ctrl = f.querySelector(".cybrhawk-gm__control");
                var msg = validateField(ctrl, (ctrl.value || "").trim());
                f.querySelector(".cybrhawk-gm__error").textContent = msg;
                f.classList.toggle("is-error", !!msg);
                if (msg) { ok = false; if (!firstBad) firstBad = ctrl; }
            });
            if (!termsInput.checked) {
                ok = false;
                termsWrap.classList.add("is-error");
                termsErr.textContent = COPY.termsError;
                if (!firstBad) firstBad = termsInput;
            }
            if (!ok) { if (firstBad) firstBad.focus(); return; }

            var submit = form.querySelector(".cybrhawk-gm__submit");
            submit.classList.add("is-loading");
            submit.disabled = true;
            submit.setAttribute("aria-busy", "true");
            submit.querySelector(".cybrhawk-gm__submit-label").textContent = COPY.loading;

            submitToCF7(fields);
            startDownload();
            submitted = true;

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: "cybrhawk_gigaom_brief_submit", form_id: CF7_FORM_ID });

            dialog.classList.add("is-done");
            var success = portal.querySelector(".cybrhawk-gm__success");
            success.hidden = false;
            success.setAttribute("tabindex", "-1");
            success.focus({ preventScroll: true });
        });

        // Close: X button and backdrop
        portal.addEventListener("click", function (e) {
            if (e.target.closest("[data-gm-close]")) { e.preventDefault(); close(); }
        });

        // Esc closes; Tab stays inside the dialog
        document.addEventListener("keydown", function (e) {
            if (!isOpen()) return;
            if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
            if (e.key !== "Tab") return;
            var focusables = Array.prototype.filter.call(
                dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
                function (el) { return el.offsetParent !== null || el.type === "checkbox"; }
            );
            if (!focusables.length) return;
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
                e.preventDefault(); first.focus();
            }
        }, true);
    }

    /* ---- Triggers ------------------------------------------------------- */
    // Capture phase so we run before the link's default (download / new tab).
    // The popup's own analytics click listener still fires normally.
    function onTrigger(e) {
        var t = e.target && e.target.closest ? e.target.closest(TRIGGER_SELECTOR) : null;
        if (!t) return;
        if (e.type === "auxclick" && e.button !== 1) return;
        e.preventDefault();
        if (e.type === "click") open(t);
    }
    document.addEventListener("click", onTrigger, true);
    document.addEventListener("auxclick", onTrigger, true); // middle-click

    window.cybrhawkGigaomModal = { open: function () { open(); }, close: close };
})();