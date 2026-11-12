(function () {
    "use strict";

    var TERMS = {
        error: "Please accept the Terms & Conditions to continue."
    };

    var LOADING_LABEL = "Downloading…";

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

    var REPORT_URL =
        "https://cybrhawk.com/wp-content/uploads/2026/07/" +
        "FortiBleed-The-Anatomy-of-a-Global-Firewall-Crisis-1.pdf";

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

    var CF7_FORM_ID = "17361";

    var CF7_ENDPOINT =
        location.origin +
        "/wp-json/contact-form-7/v1/contact-forms/" + CF7_FORM_ID + "/feedback";

    var CF7_FIELD_MAP = {
        first_name: "first_name",
        last_name: "last_name",
        business_email: "business_email",
        company: "company",
        phone: "phone"
    };

    var LOAD_FONT = true;

    function loadFont() {
        if (!LOAD_FONT || document.getElementById("report-form-font")) return;
        var l = document.createElement("link");
        l.id = "report-form-font";
        l.rel = "stylesheet";
        l.href =
            "https://fonts.googleapis.com/css2?family=Barlow+Condensed:" +
            "ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&display=swap";
        document.head.appendChild(l);
    }

    function buildSection() {
        var host =
            document.querySelector(".download-form-page .e-con-inner") ||
            document.querySelector(".download-form-page");

        if (!host) return false;

        var existing = host.querySelector(".report-form");
        if (!existing) return false;

        if (!existing.hasAttribute("data-report-form-wired")) {
            existing.setAttribute("data-report-form-wired", "true");
            wireForm(host);
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
        var card = host.querySelector(".report-form__card");
        var form = host.querySelector(".report-form__form");
        if (!card || !form) return;

        var fields = Array.prototype.slice.call(
            form.querySelectorAll(".report-form__field")
        );

        fields.forEach(function (f) {
            var ctrl = f.querySelector(".report-form__control");
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

        var termsWrap = form.querySelector(".report-form__terms");
        var termsInput = form.querySelector(".report-form__terms-input");
        var termsErr = form.querySelector("#report-form-terms-err");

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
                var ctrl = f.querySelector(".report-form__control");
                if (!ctrl || !ctrl.required) return;
                var val = (ctrl.value || "").trim();
                var msg = validateField(ctrl, val);

                var err = f.querySelector(".report-form__error");
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

            var submit = form.querySelector(".report-form__submit");
            var label = submit && submit.querySelector(".report-form__submit-label");

            if (submit) {
                submit.classList.add("is-loading");
                submit.disabled = true;
                submit.setAttribute("aria-busy", "true");
            }
            if (label) label.textContent = LOADING_LABEL;

            var showSuccess = function () {
                card.classList.add("is-done");
                var success = card.querySelector(".report-form__success");
                if (success) {
                    success.hidden = false;
                    success.setAttribute("tabindex", "-1");
                    success.focus();
                }
            };

            submitToCF7(fields);
            startDownload(REPORT_URL);
            showSuccess();
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
                return "Please use your business email address.";
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
        if (!CF7_FORM_ID || CF7_FORM_ID === "REPLACE_WITH_CF7_FORM_ID" ||
            !window.fetch || !window.FormData) {
            return window.Promise ? Promise.resolve(false) : null;
        }

        var data = new FormData();
        fields.forEach(function (f) {
            var ctrl = f.querySelector(".report-form__control");
            if (!ctrl || !ctrl.name) return;
            var cf7Name = CF7_FIELD_MAP[ctrl.name] || ctrl.name;
            data.append(cf7Name, (ctrl.value || "").trim());
        });

        data.append("_wpcf7_unit_tag", "report-form-" + CF7_FORM_ID);

        return fetch(CF7_ENDPOINT, {
            method: "POST",
            body: data,
            credentials: "same-origin"
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json || json.status !== "mail_sent") {
                    console.warn("[report-form] CF7 did not send mail:", json);
                }
                return json && json.status === "mail_sent";
            })
            .catch(function (err) {
                console.warn("[report-form] CF7 request failed:", err);
                return false;
            });
    }

    function startDownload(url) {
        var filename = url.split("/").pop() || "report.pdf";
        clickDownload(url, filename);
        return window.Promise ? Promise.resolve() : null;
    }

    function clickDownload(href, filename) {
        var a = document.createElement("a");
        a.href = href;
        a.download = filename;
        a.rel = "noopener";
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
