/* =====================================================================
   GigaOm Brief page — /gigaom-brief/
   ---------------------------------------------------------------------
   Plugin:   Simple Custom CSS and JS  →  "GigaOm Brief Page" (JS)
   Pairs with: "GigaOm Brief Page" (CSS) and the markup in
               gigaom-brief-page.html (Elementor HTML widget inside a
               container with the CSS class "gigaom-brief-page").
   Backend:  Contact Form 7 form "GigaOm Brief Download" (ID 18769).

   Same flow as the FortiBleed form on /download-report/, except ANY
   email is accepted (Gmail, Outlook, etc.). Only throwaway inboxes are
   blocked. On a valid submit it sends the lead to CF7 (emails the team),
   starts the PDF download and shows the success state.

   Replaces the old "GigaOm Brief Modal" (18770 / 18771): the homepage
   popup button now links here instead of opening a modal.
   ===================================================================== */
(function () {
    "use strict";

    var TERMS = {
        error: "Please accept the Terms & Conditions to continue."
    };

    var LOADING_LABEL = "Downloading…";

    // Personal email (Gmail, Yahoo, Outlook…) IS allowed here — unlike the
    // FortiBleed form. Only disposable / throwaway inboxes are rejected.
    var BLOCKED_EMAIL_DOMAINS = [
        "yopmail.com", "yopmail.fr", "mailinator.com", "guerrillamail.com",
        "guerrillamail.info", "sharklasers.com", "10minutemail.com", "temp-mail.org",
        "tempmail.com", "getnada.com", "trashmail.com", "dispostable.com",
        "fakeinbox.com", "throwawaymail.com", "maildrop.cc", "mailnesia.com",
        "mohmal.com", "emailondeck.com", "spam4.me", "moakt.com"
    ];

    var BRIEF_URL =
        "https://cybrhawk.com/wp-content/uploads/2026/11/" +
        "CybrHawk-Perspective-Brief.pdf";

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

    var CF7_FORM_ID = "18769";

    var CF7_ENDPOINT =
        location.origin +
        "/wp-json/contact-form-7/v1/contact-forms/" + CF7_FORM_ID + "/feedback";

    var LOAD_FONT = true;

    function loadFont() {
        if (!LOAD_FONT || document.getElementById("brief-form-font")) return;
        var l = document.createElement("link");
        l.id = "brief-form-font";
        l.rel = "stylesheet";
        l.href =
            "https://fonts.googleapis.com/css2?family=Barlow+Condensed:" +
            "ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&display=swap";
        document.head.appendChild(l);
    }

    function buildSection() {
        var existing = document.querySelector(".brief-form");
        if (!existing) return false;

        // All the CSS is scoped under .gigaom-brief-page. If the Elementor
        // container wasn't given that class (Advanced → CSS Classes), add it
        // to the section around the HTML widget so the page still renders.
        if (!existing.closest(".gigaom-brief-page")) {
            var section =
                existing.closest(".e-con.e-parent") ||
                existing.closest(".e-con") ||
                existing.parentElement;
            if (section) section.classList.add("gigaom-brief-page");
        }

        if (!existing.hasAttribute("data-brief-form-wired")) {
            existing.setAttribute("data-brief-form-wired", "true");
            wireForm(existing);
        }
        return true;
    }

    function sanitize(ctrl) {
        var pattern = null;
        if (ctrl.type === "tel") pattern = ALLOW.tel;
        else if (ctrl.name === "first_name" || ctrl.name === "last_name") pattern = ALLOW.name;
        else if (ctrl.name === "company") pattern = ALLOW.company;
        if (!pattern) return false;

        var cleaned = ctrl.value.replace(pattern, "");
        if (cleaned === ctrl.value) return false;

        var pos = ctrl.selectionStart;
        if (pos != null) {
            var removedBefore =
                ctrl.value.slice(0, pos).replace(pattern, "").length;
            ctrl.value = cleaned;
            try { ctrl.setSelectionRange(removedBefore, removedBefore); } catch (e) { }
        } else {
            ctrl.value = cleaned;
        }
        return true;
    }

    function wireForm(host) {
        var card = host.querySelector(".brief-form__card");
        var form = host.querySelector(".brief-form__form");
        if (!card || !form) return;

        // Keep the manual link in sync with BRIEF_URL (one place to edit).
        var manualLink = card.querySelector(".brief-form__success-link");
        if (manualLink) manualLink.href = BRIEF_URL;

        var fields = Array.prototype.slice.call(
            form.querySelectorAll(".brief-form__field")
        );

        fields.forEach(function (f) {
            var ctrl = f.querySelector(".brief-form__control");
            if (!ctrl) return;
            var isTel = ctrl.type === "tel";
            var sync = function () { f.classList.toggle("is-filled", !!ctrl.value); };

            if (isTel) {
                ctrl.addEventListener("keypress", function (ev) {
                    if (ev.key && ev.key.length === 1 && /\D/.test(ev.key)) {
                        ev.preventDefault();
                    }
                });
            }

            ctrl.addEventListener("focus", function () {
                f.classList.add("is-focused");
            });
            ctrl.addEventListener("blur", function () {
                f.classList.remove("is-focused");
                sync();
            });
            ctrl.addEventListener("input", function () {
                sanitize(ctrl);
                sync();
                f.classList.remove("is-error");
            });
            ctrl.addEventListener("change", function () {
                sync();
                f.classList.remove("is-error");
            });
            sync();
        });

        var termsWrap = form.querySelector(".brief-form__terms");
        var termsInput = form.querySelector(".brief-form__terms-input");
        var termsErr = form.querySelector("#brief-form-terms-err");

        if (termsInput) {
            termsInput.addEventListener("change", function () {
                if (termsInput.checked && termsWrap) {
                    termsWrap.classList.remove("is-error");
                    if (termsErr) termsErr.textContent = "";
                }
            });
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var ok = true;
            var firstBad = null;

            fields.forEach(function (f) {
                var ctrl = f.querySelector(".brief-form__control");
                if (!ctrl || !ctrl.required) return;
                var val = (ctrl.value || "").trim();
                var msg = validateField(ctrl, val);

                var err = f.querySelector(".brief-form__error");
                if (err) err.textContent = msg;
                f.classList.toggle("is-error", !!msg);
                if (msg) {
                    ok = false;
                    if (!firstBad) firstBad = ctrl;
                }
            });

            if (termsInput && !termsInput.checked) {
                ok = false;
                if (termsWrap) termsWrap.classList.add("is-error");
                if (termsErr) termsErr.textContent = TERMS.error;
                if (!firstBad) firstBad = termsInput;
            }

            if (!ok) {
                if (firstBad) firstBad.focus();
                return;
            }

            var submit = form.querySelector(".brief-form__submit");
            var label = submit && submit.querySelector(".brief-form__submit-label");

            if (submit) {
                submit.classList.add("is-loading");
                submit.disabled = true;
                submit.setAttribute("aria-busy", "true");
            }
            if (label) label.textContent = LOADING_LABEL;

            var showSuccess = function () {
                card.classList.add("is-done");
                var success = card.querySelector(".brief-form__success");
                if (success) {
                    success.hidden = false;
                    success.setAttribute("tabindex", "-1");
                    success.focus();
                }
            };

            submitToCF7(fields);
            startDownload(BRIEF_URL);
            showSuccess();

            // Same event name the old modal used, so GTM / GA4 reports carry on.
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "cybrhawk_gigaom_brief_submit",
                form_id: CF7_FORM_ID,
                form_location: "gigaom_brief_page"
            });
        });
    }

    function validateField(ctrl, val) {
        if (!val) return "This field is required.";

        if (ctrl.type === "email") {
            if (val.length > VALIDATION.email || !RE.email.test(val)) {
                return "Enter a valid email address.";
            }
            if (BLOCKED_EMAIL_DOMAINS.indexOf(
                val.split("@").pop().toLowerCase()) !== -1) {
                return "Please use a permanent email address (not a temporary inbox).";
            }
            return "";
        }

        if (ctrl.type === "tel") {
            var phone = val.replace(/\D/g, "");
            if (!/^\d+$/.test(phone)) return "Enter numbers only.";
            if (phone.length < VALIDATION.phone.min ||
                phone.length > VALIDATION.phone.max) {
                return "Enter a valid phone number.";
            }
            return "";
        }

        if (ctrl.name === "first_name" || ctrl.name === "last_name") {
            if (val.length < VALIDATION.name.min) return "Enter at least 2 characters.";
            if (val.length > VALIDATION.name.max) {
                return "Please keep this under 50 characters.";
            }
            if (!RE.name.test(val)) return "Use letters only (no numbers or symbols).";
            return "";
        }

        if (ctrl.name === "company") {
            if (val.length < VALIDATION.company.min) return "Enter at least 2 characters.";
            if (val.length > VALIDATION.company.max) {
                return "Please keep this under 100 characters.";
            }
            if (!RE.company.test(val)) {
                return "Remove any special characters.";
            }
            return "";
        }

        return "";
    }

    function submitToCF7(fields) {
        if (!CF7_FORM_ID || !window.fetch || !window.FormData) {
            return window.Promise ? Promise.resolve(false) : null;
        }

        var data = new FormData();
        fields.forEach(function (f) {
            var ctrl = f.querySelector(".brief-form__control");
            if (!ctrl || !ctrl.name) return;
            data.append(ctrl.name, (ctrl.value || "").trim());
        });

        data.append("_wpcf7_unit_tag", "brief-form-" + CF7_FORM_ID);

        return fetch(CF7_ENDPOINT, {
            method: "POST",
            body: data,
            credentials: "same-origin",
            keepalive: true
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json || json.status !== "mail_sent") {
                    console.warn("[brief-form] CF7 did not send mail:", json);
                }
                return json && json.status === "mail_sent";
            })
            .catch(function (err) {
                console.warn("[brief-form] CF7 request failed:", err);
                return false;
            });
    }

    function startDownload(url) {
        var filename = url.split("/").pop() || "gigaom-brief.pdf";
        clickDownload(url, filename);
        return window.Promise ? Promise.resolve() : null;
    }

    function clickDownload(href, filename) {
        var a = document.createElement("a");
        a.href = href;
        a.download = filename;
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function init() {
        loadFont();
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
