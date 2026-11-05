/* =====================================================================
   CybrHawk — Incident Response (CybrHawk IR One) page, sections 01–10
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects each
   section's markup into its own empty container and pairs with
   incident-response.css. Sections 11 (FAQ) and 12 (final call to action)
   are not built here; section 10 ends on white so whatever follows joins
   without a seam.

   One container per section, in page order, each set to Full Width with
   padding 0 and no background, its class in the CSS Classes field:

     ir-banner     ir-hero       ir-why        ir-services   ir-process
     ir-incidents  ir-platform   ir-industries ir-readiness  ir-trust

   On build each container also gets `ir-section` (and `ir-section--dark`
   for the four dark grounds), which carries the shared tokens, so
   editors only ever type the one class. A missing container skips only
   its own section, and an error in one builder is logged without
   stopping the others.

   The page tells an incident top to bottom: red (alarm) at the top,
   amber and blue while responders contain it, green once you are ready
   for the next one. Red means "active incident" and nothing else.

   One node is built outside a container: the mobile call bar, appended
   to <body> once (see callBar()).

   If a live class differs, change SECTIONS below — they are the only
   selectors this file touches (incident-response.css is scoped to the
   same classes, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = {
    // Emergency banner, commented out for now. Restore this line to bring
    // it back. The mobile call bar still works without it: it reads
    // CONTENT.banner.cta and watches the hero buttons alone.
    // banner: ".ir-banner",
    hero: ".ir-hero",
    why: ".ir-why",
    services: ".ir-services",
    process: ".ir-process",
    incidents: ".ir-incidents",
    platform: ".ir-platform",
    industries: ".ir-industries",
    readiness: ".ir-readiness",
    trust: ".ir-trust"
  };

  // Sections on a dark ground; their container also gets ir-section--dark.
  var DARK = { banner: true, hero: true, process: true, platform: true };

  /* ---- Content (edit freely) -----------------------------------------

     Every string a reader sees lives here; the builders hard-code none.
     In any title, "\n" becomes a line break and [[double brackets]] set
     that run in the accent colour. An empty eyebrow is not rendered, and
     a link or button with an empty href is not rendered either.

     Icons are named per item; the glyphs are in ICONS further down.
     Every link and phone number carries data-ir-cta="<placement>" for
     click tracking in GTM.
     -------------------------------------------------------------------- */
  var CONTENT = {

    banner: {
      label: "Emergency contact",   // aria-label only, not shown
      text: "Experiencing an active cyber incident? Our response team is available 24/7.",
      // TODO: copy doc recommends a dedicated 24/7 IR hotline here instead of the sales line, if one exists.
      cta: { label: "Get Emergency Help: 954-324-4750", href: "tel:+19543244750" },
      // Fixed call bar at the foot of the screen on phones (≤767px), shown
      // once the banner and the hero buttons have both scrolled away.
      mobileCallBar: true
    },

    hero: {
      eyebrow: "Incident Response · CybrHawk IR One",
      // Two spans inside one <h1>: line 1 in the alert tone, line 2 in white.
      title: ["Respond Fast.", "Recover Smarter."],
      sub: "Every minute counts during a cyberattack. CybrHawk’s expert incident responders help you contain the threat, understand exactly what happened, and restore operations securely, with minimal disruption to your business.",
      // TODO: confirm the target for "Get Help Now" (phone, or an emergency intake form).
      // ariaLabel: read instead of the label, because the visible text has
      // no number in it; it starts with the label so voice control still
      // matches what is on screen.
      cta: { label: "Get Help Now", href: "tel:+19543244750",
             ariaLabel: "Get Help Now: call CybrHawk incident response, 954-324-4750" },
      ctaSecondary: { label: "Build Your IR Readiness Plan", href: "#ir-readiness" },
      trust: [
        "24/7/365 emergency response",
        "Remote and on-site support",
        "Forensically sound investigations",
        "Compliance-ready reporting"
      ],
      // The full-bleed photo behind the hero. Art direction and export
      // sizes are in hero-image-prompts.md.
      //   image        landscape, 2400×1350 WebP; "" shows the dark ground alone
      //   imageMobile  optional portrait crop for phones (1080×1350); "" reuses image
      //   position     the photo's focal point (CSS object-position); keep the
      //                people right of centre so the headline sits on shadow
      //   alt          "" because the photo is atmosphere; the H1 carries the meaning
      media: {
        image: "https://cybrhawk.com/wp-content/uploads/2026/11/fast-response-1.webp",
        imageMobile: "",
        position: "60% 50%",
        alt: ""
      }
    },

    why: {
      eyebrow: "Why It Matters",
      title: "Cyber Incidents Are Time-Sensitive. [[Your Response Should Be Too.]]",
      body: [
        "Ransomware, business email compromise, insider threats, and data breaches can halt operations, expose sensitive data, and trigger regulatory obligations within hours. The difference between a contained event and a business crisis often comes down to how quickly and decisively you respond.",
        "CybrHawk gives you immediate access to experienced responders, proven processes, and advanced detection technology, so you are never facing an attack alone."
      ],
      risksTitle: "What we help you avoid",   // "" hides the label
      risks: [
        { icon: "timer",         title: "Extended downtime",      text: "Prolonged outages that disrupt customers, revenue, and operations." },
        { icon: "database-leak", title: "Data loss and exposure", text: "Theft or leakage of sensitive, regulated, or proprietary data." },
        { icon: "gavel",         title: "Regulatory penalties",   text: "Missed notification deadlines and incomplete breach documentation." },
        { icon: "door-return",   title: "Repeat attacks",         text: "Attackers returning through backdoors that were never fully removed." }
      ]
    },

    services: {
      eyebrow: "",   // the section label "Incident Response Services" would repeat the H2
      title: "[[End-to-End]] Incident Response Services",
      intro: "From the first alert to full recovery and beyond, CybrHawk supports you through every stage of a cyber incident.",
      // Numbered 01–06 from array order. Item 1 is the dark anchor card; item 6 is the full-width band.
      // Each card is <article id="ir-svc-{slug}">, so other pages can deep-link to it.
      items: [
        { slug: "emergency", icon: "siren", title: "Emergency Incident Response",
          text: "Our 24/7 on-call team engages quickly to triage active threats, contain the attack, and limit damage, remotely or on-site.",
          // Background photo for this anchor card only (portrait, 1707×2560).
          // position: CSS object-position, so the lit screens stay in frame
          // when the card turns landscape on tablets. "" image keeps the
          // plain dark card.
          image: "https://cybrhawk.com/wp-content/uploads/2026/11/emergency-incident-response-scaled.webp",
          imagePosition: "50% 62%" },
        { slug: "forensics", icon: "fingerprint", title: "Digital Forensics & Investigation",
          text: "We determine how the breach occurred, what systems and data were affected, how long attackers were present, and how to prevent recurrence, while preserving evidence to forensic standards." },
        { slug: "containment", icon: "crosshair", title: "Threat Containment & Eradication",
          text: "We isolate compromised systems, remove malware, backdoors, and unauthorized access, and harden your environment to stop attackers from returning." },
        { slug: "recovery", icon: "restore", title: "Recovery & System Restoration",
          text: "We help you restore systems and data securely and in the right order, reducing downtime and business impact while validating that the environment is clean." },
        { slug: "reporting", icon: "file-check", title: "Incident Reporting & Documentation",
          text: "You receive clear, compliance-ready reports covering the incident timeline, attack vector, affected assets, root cause, and prioritized recommendations for executives, regulators, insurers, and legal counsel." },
        { slug: "readiness", icon: "clipboard", title: "IR Planning & Readiness",
          text: "Not under attack? We help you build or improve your incident response plan, develop playbooks, and run tabletop exercises so your team is ready when it matters.",
          // Reuses the hero's secondary CTA text. href "" hides the link.
          link: { label: "Build Your IR Readiness Plan", href: "#ir-readiness" } }
      ]
    },

    process: {
      eyebrow: "Our Response Process",
      title: "A Proven, Structured [[Response Methodology]]",
      sub: "Our approach follows the NIST SP 800-61 incident handling lifecycle, adapted to your environment and business priorities.",
      // tone drives the node colour and the rail gradient stop.
      // One of "alert", "amber", "blue", "green".
      steps: [
        { tone: "alert", title: "Engage & Triage",  text: "We take your call, assess scope and severity, and mobilize the right responders immediately." },
        { tone: "amber", title: "Contain",          text: "We stop the spread by isolating affected hosts, accounts, and network segments." },
        { tone: "amber", title: "Investigate",      text: "Forensic analysis reveals the attack vector, attacker activity, and full scope of impact." },
        { tone: "blue",  title: "Eradicate",        text: "We remove every trace of the threat, including persistence mechanisms and compromised credentials." },
        { tone: "green", title: "Recover",          text: "Systems are restored, validated, and monitored closely to confirm the attacker is gone." },
        { tone: "green", title: "Report & Improve", text: "We deliver findings, root cause, and recommendations to strengthen your defenses against future attacks." }
      ]
    },

    incidents: {
      eyebrow: "Incidents We Handle",
      title: "Expertise Across [[Every Type]] of Cyber Incident",
      items: [
        { icon: "lock-skull",    title: "Ransomware & Extortion",                text: "Containment, scoping, recovery support, and guidance through extortion scenarios." },
        { icon: "mail-alert",    title: "Business Email Compromise",             text: "Mailbox investigation, fraud tracing, and account remediation." },
        { icon: "database-leak", title: "Data Breach & Exfiltration",            text: "Determining what data was accessed or stolen and supporting notification decisions." },
        { icon: "user-eye",      title: "Insider Threats",                       text: "Discreet investigation of malicious or negligent insider activity." },
        { icon: "cloud-shield",  title: "Cloud & SaaS Compromise",               text: "Response across AWS, Azure, Google Cloud, Microsoft 365, and Google Workspace." },
        { icon: "bug",           title: "Malware & Advanced Persistent Threats", text: "Hunting and removing sophisticated, long-dwelling adversaries." },
        { icon: "factory",       title: "OT & Critical Infrastructure Incidents", text: "Safety-aware response for industrial and operational technology environments." }
      ]
    },

    platform: {
      eyebrow: "Powered by the CybrHawk Platform",
      title: "Expert Responders, [[Backed by Advanced Technology]]",
      // TODO: copy says "SIEM XDR"; the UCD page writes "SIEM / XDR". Confirm before launch. Don't change it here.
      body: "CybrHawk IR One combines human expertise with the full CybrHawk Unified Cyber Defense platform. Our responders can rapidly deploy SIEM XDR, NDR, and Cloud detection to gain visibility across your environment, hunt for attacker activity, and monitor for re-entry after recovery.",
      features: [
        { icon: "eye",   title: "Rapid Visibility",       text: "Fast deployment of telemetry across endpoint, network, cloud, and identity." },
        { icon: "globe", title: "Threat Intelligence",    text: "HawkINT enriches investigations with adversary context and indicators." },
        { icon: "bolt",  title: "Automated Containment",  text: "Playbooks isolate hosts and disable accounts in seconds." },
        { icon: "pulse", title: "Continuous Monitoring",  text: "Optional 24/7 SOC monitoring after the incident to prevent recurrence." }
      ],
      // Diagram labels, taken from the Rapid Visibility and Threat Intelligence copy.
      visual: {
        core: "CybrHawk IR One",
        sources: [
          { icon: "endpoint", label: "Endpoint" },
          { icon: "network",  label: "Network" },
          { icon: "cloud",    label: "Cloud" },
          { icon: "identity", label: "Identity" }
        ],
        intel: "HawkINT"
      }
    },

    industries: {
      eyebrow: "Industries We Serve",
      title: "Tailored Response for [[Your Industry]]",
      intro: "Every industry faces unique threats, regulations, and operational pressures. Our response is tailored to your security, compliance, and business needs.",
      items: [
        { icon: "coins",      title: "Financial Services",              text: "Protect customer assets and meet strict regulatory expectations for incident handling and reporting." },
        { icon: "medical",    title: "Healthcare & Life Sciences",      text: "Safeguard patient data and clinical operations, with support for HIPAA breach requirements." },
        { icon: "bank",       title: "Government & Public Sector",      text: "Defend critical services and sensitive citizen data against nation-state and criminal threats." },
        { icon: "cart",       title: "Retail & eCommerce",              text: "Secure payment data and customer trust, with PCI DSS-aware investigation and response." },
        { icon: "pylon",      title: "Energy & Critical Infrastructure", text: "Respond safely across IT and OT environments, prioritizing safety and continuity of operations." },
        { icon: "graduation", title: "Education & Research",            text: "Protect students, faculty, intellectual property, and research data across open, distributed networks." }
      ]
    },

    readiness: {
      eyebrow: "Readiness & Retainer",
      title: "Be Ready [[Before]] an Incident Happens",
      body: "The best time to prepare for an incident is before it occurs. CybrHawk’s readiness services and incident response retainers give you a trusted partner, a tested plan, and guaranteed access to responders when you need them most.",
      items: [
        { icon: "handshake",   title: "Incident Response Retainer",   text: "Pre-negotiated terms and priority access to CybrHawk responders, so you skip onboarding delays during a crisis." },
        { icon: "clipboard",   title: "IR Plan Development & Review", text: "Create or modernize your incident response plan, roles, communication paths, and escalation procedures." },
        { icon: "users-table", title: "Tabletop Exercises",           text: "Executive and technical simulations that test decision-making against realistic scenarios such as ransomware and data breaches." },
        { icon: "radar",       title: "Compromise Assessment",        text: "A proactive hunt to determine whether attackers are already present in your environment." }
      ]
    },

    trust: {
      eyebrow: "Why CybrHawk",
      title: "Why Organizations Trust CybrHawk [[in a Crisis]]",
      items: [
        { icon: "clock",          title: "Always Available",       text: "24/7/365 response from experienced incident handlers." },
        { icon: "bolt",           title: "Speed With Precision",   text: "Rapid engagement combined with a disciplined, evidence-based methodology." },
        { icon: "layers",         title: "Technology Advantage",   text: "Native access to the CybrHawk platform for faster visibility and containment." },
        { icon: "headset",        title: "Clear Communication",    text: "Regular updates for technical teams, executives, legal counsel, and insurers." },
        { icon: "shield-refresh", title: "Beyond Recovery",        text: "Actionable recommendations and optional managed SOC services to keep you protected." }
      ]
    }
  };

  // Fade/rise each section's content in as it scrolls into view, and the
  // hero's one-off load stagger.
  var ANIMATE = true;

  // Signals travelling into the platform diagram's core. Same pausing.
  var PLATFORM_MOTION = true;

  // A thin amber bar on hover beside each incident type. The rows are not
  // links, so false drops it if it reads as clickable.
  var INCIDENT_HOVER_BAR = true;
  /* -------------------------------------------------------------------- */

  /* ---- Icons ------------------------------------------------------------
     24×24 strokes that follow currentColor. Glyphs shared with udc.js are
     copied as-is so the same idea reads the same across the site; the
     rest are drawn to the same grid and weight.
     -------------------------------------------------------------------- */
  var ICONS = {
    // From udc.js
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
    bank:
      '<path d="M3 9.5 12 4l9 5.5"/>' +
      '<path d="M5.4 10.4V17M9.8 10.4V17M14.2 10.4V17M18.6 10.4V17"/>' +
      '<path d="M3.4 20h17.2"/>',
    factory:
      '<path d="M2.8 20.2h18.4"/>' +
      '<path d="M4 20V9.6l5.2 3.4V9.6l5.2 3.4V5.4h3.2L19 20"/>' +
      '<path d="M7.4 16.6h1.4M12.6 16.6H14"/>',
    network:
      '<rect x="8.8" y="3" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="2.4" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="15.2" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<path d="M12 8v3.6"/>' +
      '<path d="M5.6 16v-2.6a1.8 1.8 0 0 1 1.8-1.8h9.2a1.8 1.8 0 0 1 1.8 1.8V16"/>',
    pylon:
      '<path d="M7.6 21 12 3l4.4 18"/>' +
      '<path d="M5 7.2h14M6.6 11.2h10.8"/>' +
      '<path d="M9.4 13.6 15.9 19M14.6 13.6 8.1 19"/>',
    bolt:
      '<path d="M13.4 2.8 4.9 13.5h6.1L10.6 21.2l8.5-10.7h-6.1z"/>',
    medical:
      '<path d="M9.4 3.6h5.2v5.8h5.8v5.2h-5.8v5.8H9.4v-5.8H3.6V9.4h5.8z"/>',
    coins:
      '<circle cx="9.4" cy="9.4" r="6"/>' +
      '<path d="M15.35 8.65A6 6 0 1 1 8.65 15.35"/>' +
      '<path d="M9.4 7v4.8"/>',
    graduation:
      '<path d="M2.4 9.2 12 4.6l9.6 4.6-9.6 4.6z"/>' +
      '<path d="M6.4 11.2v4.4c0 1.4 2.5 2.8 5.6 2.8s5.6-1.4 5.6-2.8v-4.4"/>' +
      '<path d="M21.6 9.2v5"/>',
    endpoint:
      '<rect x="4.6" y="5" width="14.8" height="10.4" rx="1.6"/>' +
      '<path d="M2.6 18.8h18.8"/>',
    cloud:
      '<path d="M7.2 18.6h10.1a4.1 4.1 0 0 0 .5-8.2 5.6 5.6 0 0 0-10.9 1.3A3.5 3.5 0 0 0 7.2 18.6z"/>',
    identity:
      '<circle cx="9.4" cy="7.6" r="3.4"/>' +
      '<path d="M3.4 19.6c.4-3.6 2.9-5.8 6-5.8 1.3 0 2.5.3 3.5.9"/>' +
      '<path d="m17.4 12.4 3.6 1.4v2.6c0 2.3-1.5 4.1-3.6 4.9-2.1-.8-3.6-2.6-3.6-4.9v-2.6z"/>',
    "file-check":
      '<path d="M14 2.9H7.4a2 2 0 0 0-2 2v14.2a2 2 0 0 0 2 2h9.2a2 2 0 0 0 ' +
        '2-2V7.9z"/>' +
      '<polyline points="13.9 2.9 13.9 8 19 8"/>' +
      '<path d="m9.2 14.6 2 2 3.8-4"/>',
    timer:
      '<circle cx="12" cy="13.4" r="7.4"/>' +
      '<path d="M12 13.4V9.6M9.6 2.8h4.8M12 2.8V6M18.4 6.6l1.4-1.4"/>',
    "cloud-shield":
      '<path d="M8 17.8H6.8a3.6 3.6 0 0 1-.4-7.2 5.6 5.6 0 0 1 10.9-1.4 4.2 4.2 0 0 1 .6 8.4"/>' +
      '<path d="m12.9 11.8 3.6 1.4v2.8c0 2.4-1.5 4.2-3.6 5-2.1-.8-3.6-2.6-3.6-5v-2.8z"/>',
    radar:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<circle cx="12" cy="12" r="4.4"/>' +
      '<path d="m12 12 6.1-6.1M16.2 14.6h.01"/>',
    eye:
      '<path d="M2.6 12s3.4-6.4 9.4-6.4 9.4 6.4 9.4 6.4-3.4 6.4-9.4 6.4S2.6 12 2.6 12z"/>' +
      '<circle cx="12" cy="12" r="2.8"/>',
    pulse:
      '<path d="M2.8 12.4h4l2.4-5.6 4.2 11 2.6-5.4h5.2"/>',
    check:
      '<path d="m6.6 12.4 3.6 3.6 7.2-7.6"/>',

    // Contact
    phone:
      '<path d="M5.2 3.6h3.2l1.6 4-2 1.3a10.6 10.6 0 0 0 5.1 5.1l1.3-2 4 1.6v3.2a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 3.2 5.8a2 2 0 0 1 2-2.2z"/>',

    // 03 · Why it matters
    "database-leak":
      '<ellipse cx="10.4" cy="5.8" rx="6.6" ry="2.6"/>' +
      '<path d="M3.8 5.8v12c0 1.4 3 2.6 6.6 2.6"/>' +
      '<path d="M17 5.8v4.4"/>' +
      '<path d="M3.8 11.8c0 1.4 3 2.6 6.6 2.6"/>' +
      '<path d="M17.6 13c1.7 2.1 2.8 3.6 2.8 4.9a2.8 2.8 0 0 1-5.6 0c0-1.3 1.1-2.8 2.8-4.9z"/>',
    gavel:
      '<path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8"/>' +
      '<path d="m16 16 5.4-5.4M8 8l5.4-5.4"/>' +
      '<path d="m9 7 8 8M20.6 11.4l-8-8"/>',
    // A door with the way back in: the attacker re-entering.
    "door-return":
      '<path d="M13.4 3.6h4.4a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8h-4.4"/>' +
      '<path d="M3.6 12h11"/>' +
      '<path d="m10.8 8.2 3.8 3.8-3.8 3.8"/>',

    // 04 · Services
    siren:
      '<path d="M6.6 18V13.4a5.4 5.4 0 0 1 10.8 0V18"/>' +
      '<rect x="4.6" y="18" width="14.8" height="2.8" rx="1"/>' +
      '<path d="M12 2.6v2.2M5.2 5.6l1.5 1.5M18.8 5.6l-1.5 1.5M2.6 12.4h2M19.4 12.4h2"/>' +
      '<path d="M9.8 13.4a2.2 2.2 0 0 1 2.2-2.2"/>',
    fingerprint:
      '<path d="M4.6 8.6a8.4 8.4 0 0 1 14.8 0"/>' +
      '<path d="M5.6 17.4c.6-1.6.9-3.4.9-5.4a5.5 5.5 0 0 1 11 0c0 2.6-.3 5-.9 7.2"/>' +
      '<path d="M9.2 20.4c.8-2.6 1.2-5.4 1.2-8.4a1.6 1.6 0 0 1 3.2 0c0 1.8-.1 3.4-.4 5"/>' +
      '<path d="M12.8 20.6c.2-.6.4-1.2.5-1.8"/>',
    // A circular arrow round a check: restored, and verified clean.
    restore:
      '<path d="M4.4 12a7.6 7.6 0 1 0 7.6-7.6 8.2 8.2 0 0 0-5.7 2.3L4.4 8.6"/>' +
      '<path d="M4.4 4.2v4.4h4.4"/>' +
      '<path d="m9 12.2 2.1 2.1 4-4.2"/>',
    clipboard:
      '<rect x="5.2" y="4.6" width="13.6" height="16.4" rx="2.2"/>' +
      '<rect x="8.8" y="2.8" width="6.4" height="3.6" rx="1.2"/>' +
      '<path d="M8.8 11.4h6.4M8.8 15h4.4"/>',

    // 06 · Incidents
    // A lock whose shackle has been broken: held to ransom.
    "lock-skull":
      '<rect x="4.8" y="10.6" width="14.4" height="10" rx="2.2"/>' +
      '<path d="M8.2 10.6V7.8a3.8 3.8 0 0 1 7.3-1.5"/>' +
      '<path d="M15.8 8.8v1.8"/>' +
      '<path d="M12 14.4v2.4"/>',
    "mail-alert":
      '<path d="M13.2 18.4H5a1.8 1.8 0 0 1-1.8-1.8V7a1.8 1.8 0 0 1 1.8-1.8h14A1.8 1.8 0 0 1 20.8 7v4.6"/>' +
      '<path d="m3.6 6.6 8.4 6 8.4-6"/>' +
      '<path d="M18.6 14.6v3M18.6 20.2v.1"/>',
    "user-eye":
      '<circle cx="9" cy="7.6" r="3.4"/>' +
      '<path d="M3 19.6c.4-3.6 2.9-5.8 6-5.8 1 0 1.9.2 2.7.6"/>' +
      '<path d="M13.2 17.6s1.6-3 4.2-3 4.2 3 4.2 3-1.6 3-4.2 3-4.2-3-4.2-3z"/>' +
      '<circle cx="17.4" cy="17.6" r="1"/>',
    bug:
      '<rect x="7.4" y="8" width="9.2" height="12" rx="4.6"/>' +
      '<path d="M9.6 8V6.8a2.4 2.4 0 0 1 4.8 0V8"/>' +
      '<path d="M12 12v8M3.6 13.6h3.8M16.6 13.6h3.8M4.4 8.4l3 1.8M19.6 8.4l-3 1.8M4.4 19.2l3.2-1.8M19.6 19.2l-3.2-1.8"/>',

    // 08 · Industries
    cart:
      '<path d="M2.8 3.8h2.4l2.2 11.2h10.4l2-7.8H6.2"/>' +
      '<circle cx="9.2" cy="19" r="1.5"/>' +
      '<circle cx="16.8" cy="19" r="1.5"/>',

    // 10 · Why CybrHawk (copied from udc.js)
    clock:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<path d="M12 7.4V12l3 1.8"/>',
    layers:
      '<path d="M12 3.2 21 7.8l-9 4.6-9-4.6z"/>' +
      '<path d="m3 12.2 9 4.6 9-4.6"/>' +
      '<path d="m3 16.4 9 4.6 9-4.6"/>',
    headset:
      '<path d="M4.6 13.4V12a7.4 7.4 0 0 1 14.8 0v1.4"/>' +
      '<rect x="3.4" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<rect x="16.8" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<path d="M18.7 19.2v.2a2.4 2.4 0 0 1-2.4 2.4h-3.1"/>',
    "shield-refresh":
      '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.9 7.2 9.4 4.2-1.5 7.2-5 7.2-9.4V6z"/>' +
      '<path d="M16.4 8.6V11H14"/>' +
      '<path d="M15.4 13a3.6 3.6 0 1 1-.85-3.74L16.4 11"/>',

    // 09 · Readiness
    handshake:
      '<path d="m11 17 2 2a1 1 0 1 0 3-3"/>' +
      '<path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/>' +
      '<path d="m21 3 1 11h-2"/>' +
      '<path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/>' +
      '<path d="M3 4h8"/>',
    // Two people across a table: the exercise, not the attack.
    "users-table":
      '<circle cx="7" cy="6.6" r="2.4"/>' +
      '<circle cx="17" cy="6.6" r="2.4"/>' +
      '<path d="M3.4 13.2c.4-2 1.8-3.2 3.6-3.2s3.2 1.2 3.6 3.2M13.4 13.2c.4-2 1.8-3.2 3.6-3.2s3.2 1.2 3.6 3.2"/>' +
      '<path d="M2.6 15.4h18.8M5.4 15.4v5.2M18.6 15.4v5.2"/>'
  };

  function icon(name) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true" focusable="false">' +
        (ICONS[name] || ICONS.shield) +
      "</svg>"
    );
  }

  // Heavier stroke, as on the site's other buttons.
  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      '<path d="M4.5 12h14M13 6.5 18.5 12 13 17.5"/>' +
    "</svg>";

  // Process tones, and the custom property each one reads on a dark ground.
  var TONE_INK = {
    alert: "var(--ir-alert-on-dark)",
    amber: "var(--ir-amber-on-dark)",
    blue: "var(--ir-accent-on-dark)",
    green: "var(--ir-green-on-dark)"
  };

  function tone(t) {
    return TONE_INK[t] ? t : "blue";
  }

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  // Escape first, then promote [[…]] to an accent span.
  function markup(s) {
    return nl2br(s).replace(/\[\[(.+?)\]\]/g, function (_, run) {
      return '<span class="ir-accent">' + run + "</span>";
    });
  }

  // A phone number at the end of a label is set in the mono stack, so its
  // digits line up; the rest of the label stays in Figtree.
  function phoneText(s) {
    return esc(s).replace(/(\+?\d[\d\s().-]{6,}\d)\s*$/, '<span class="ir-num">$1</span>');
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function round(n) {
    return Math.round(n * 100) / 100;
  }

  // Inline index the reveal staggers on.
  function at(i) {
    return ' style="--i:' + i + '"';
  }

  function rootClass(cls) {
    return "ir-shell " + cls + (ANIMATE ? " is-animated" : "");
  }

  function reducedMotion() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Eyebrow (mono, with the section's status square), H2, sub. An empty
     eyebrow or sub is dropped rather than left as an empty paragraph. A
     <div>, not a <header>: outside an <article> or <section> a <header>
     is announced as a banner landmark, and ten of those would bury the
     site's real one. */
  function head(o) {
    return (
      '<div class="ir-head' + (o.align === "start" ? " ir-head--start" : "") +
        ' ir-reveal">' +
        (o.eyebrow ? '<p class="ir-eyebrow">' + esc(o.eyebrow) + "</p>" : "") +
        '<h2 class="ir-head__title" id="' + o.id + '">' + markup(o.title) + "</h2>" +
        (o.sub ? '<p class="ir-head__sub">' + esc(o.sub) + "</p>" : "") +
      "</div>"
    );
  }

  /* kind: "alert" (the emergency fill), "glass" (frosted, over the photo).
     A tel: link leads with the phone glyph; anything else ends on the
     arrow. No href, no button: an empty or "#" link would only reload
     the page. */
  function button(b, kind, placement) {
    if (!b || !b.label || !b.href) return "";
    var tel = /^tel:/i.test(b.href);
    return (
      '<a class="ir-btn ir-btn--' + kind + '" href="' + esc(b.href) + '" ' +
        'data-ir-cta="' + placement + '"' +
        (b.ariaLabel ? ' aria-label="' + esc(b.ariaLabel) + '"' : "") + ">" +
        (tel ? icon("phone") : "") +
        '<span class="ir-btn__label">' + phoneText(b.label) + "</span>" +
        (tel ? "" : ARROW) +
      "</a>"
    );
  }

  function mount(host, html, cls) {
    host.insertAdjacentHTML("beforeend", html);
    var root = host.querySelector("." + cls);
    if (ANIMATE && root.classList.contains("is-animated")) reveal(root);
    return root;
  }

  /* Runs cb(true) while el is on screen and the tab is in front, and
     cb(false) otherwise: an IntersectionObserver plus visibilitychange,
     so an animation nobody can see costs no frames. Shared by the hero
     panel and the platform diagram. */
  function whileVisible(el, cb) {
    var onScreen = true;

    function sync() {
      cb(onScreen && !document.hidden);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      }).observe(el);
    }

    document.addEventListener("visibilitychange", sync);
    sync();
  }

  /* In-page links (#ir-readiness) glide unless the reader prefers reduced
     motion, in which case the browser's own jump runs untouched. Either
     way the target's scroll-margin keeps its heading clear of a sticky
     header, and focus moves to it, so keyboard users continue from there.
     Delegated from the section root. */
  function bindAnchors(root) {
    root.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || !root.contains(a)) return;

      var hash = a.getAttribute("href");
      var target = hash.length > 1 && document.getElementById(hash.slice(1));
      if (!target) return;

      if (!reducedMotion() && "scrollBehavior" in document.documentElement.style) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.history && history.pushState) history.pushState(null, "", hash);
      }

      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      try {
        target.focus({ preventScroll: true });
      } catch (err) {
        target.focus();
      }
    });
  }

  /* ---- 01 · Emergency banner ------------------------------------------
     An <aside> with an aria-label, no heading: it is a contact strip, not
     a section of the page's outline.
     -------------------------------------------------------------------- */
  function buildBanner(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-bn")) return true;

    var cta = c.cta || {};

    mount(
      host,
      '<aside class="ir-shell ir-bn" aria-label="' + esc(c.label || "") + '">' +
        '<p class="ir-bn__text">' +
          '<span class="ir-live" aria-hidden="true"></span>' +
          esc(c.text) +
        "</p>" +
        (cta.label && cta.href
          ? '<a class="ir-bn__cta" href="' + esc(cta.href) + '" data-ir-cta="banner">' +
              icon("phone") +
              '<span class="ir-bn__cta-label">' + phoneText(cta.label) + "</span>" +
            "</a>"
          : "") +
      "</aside>",
      "ir-bn"
    );

    return true;
  }

  /* ---- 02 · Hero ----------------------------------------------------------
     Photo-led and full bleed: a cinematic photo of responders at work
     behind a dark overlay, the headline anchored low on the left where
     the overlay is deepest, one line of copy, the two buttons, and a
     ruled strip of the four trust points along the foot.

     The photo is atmosphere, so it is decorative (alt="", in an
     aria-hidden layer); the H1 carries the meaning. It is the page's
     largest paint, so it loads eagerly at high priority. With no photo
     set, or one that fails to load, the night ground and its glows stand
     in, and the layout is unchanged.
     -------------------------------------------------------------------- */
  function heroMedia(m) {
    if (!m || !m.image) return "";
    return (
      '<picture class="ir-hr__media">' +
        (m.imageMobile
          ? '<source media="(max-width: 767px)" srcset="' + esc(m.imageMobile) + '">'
          : "") +
        '<img class="ir-hr__img" src="' + esc(m.image) + '" alt="' + esc(m.alt || "") + '" ' +
          'width="2400" height="1350" decoding="async" fetchpriority="high"' +
          (m.position ? ' style="object-position:' + esc(m.position) + '"' : "") + ">" +
      "</picture>"
    );
  }

  // Inline delay for the hero's load stagger.
  function after(ms) {
    return ' style="--d:' + ms + 'ms"';
  }

  function buildHero(host, c) {
    if (!host) return false;                         // container not ready
    if (host.querySelector(".ir-hr")) return true;   // already built

    var m = c.media || {};
    var title = c.title || [];
    if (typeof title === "string") title = [title];

    var trust = (c.trust || []).map(function (t) {
      return (
        '<li class="ir-hr__trust-item">' +
          '<span class="ir-hr__check">' + icon("check") + "</span>" +
          esc(t) +
        "</li>"
      );
    }).join("");

    // The two lines are separate spans for colour and stagger, with a real
    // space between them so a screen reader reads one sentence.
    var lines = title.map(function (line, i) {
      return (
        '<span class="ir-hr__line ir-hr__line--' + (i + 1) + ' ir-hr__in"' +
          after(i === 0 ? 120 : 220) + ">" + esc(line) +
        "</span>"
      );
    }).join(" ");

    var actions = button(c.cta, "alert", "hero-primary") +
                  button(c.ctaSecondary, "glass", "hero-secondary");

    var root = mount(
      host,
      '<div class="ir-hr' + (m.image ? " ir-hr--photo" : "") + (ANIMATE ? " is-animated" : "") + '">' +
        '<div class="ir-hr__backdrop" aria-hidden="true">' +
          heroMedia(m) +
          '<span class="ir-hr__shade"></span>' +
        "</div>" +
        '<div class="ir-shell ir-hr__inner">' +
          '<div class="ir-hr__copy">' +
            (c.eyebrow
              ? '<p class="ir-eyebrow ir-hr__eyebrow ir-hr__in"' + after(40) + ">" + esc(c.eyebrow) + "</p>"
              : "") +
            '<h1 class="ir-hr__title">' + lines + "</h1>" +
            (c.sub ? '<p class="ir-hr__sub ir-hr__in"' + after(340) + ">" + esc(c.sub) + "</p>" : "") +
            (actions
              ? '<div class="ir-hr__actions ir-hr__in"' + after(440) + ">" + actions + "</div>"
              : "") +
          "</div>" +
          (trust
            ? '<ul class="ir-hr__trust ir-hr__in"' + after(560) + ">" + trust + "</ul>"
            : "") +
        "</div>" +
      "</div>",
      "ir-hr"
    );

    // A photo that fails to load is removed, so the night ground shows
    // instead of a broken-image icon.
    var img = root.querySelector(".ir-hr__img");
    if (img) {
      img.addEventListener("error", function () {
        var media = root.querySelector(".ir-hr__media");
        if (media) media.parentNode.removeChild(media);
        root.classList.remove("ir-hr--photo");
      });
    }

    bindAnchors(root);
    return true;
  }

  /* ---- 03 · Why it matters -----------------------------------------------
     The risks are one register (a single card of rows), headed by a small
     h3, not four separate cards.
     -------------------------------------------------------------------- */
  function buildWhy(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-wy")) return true;

    var body = (c.body || []).map(function (p, i) {
      return '<p class="ir-wy__p' + (i === 0 ? " ir-wy__p--lead" : "") + '">' + esc(p) + "</p>";
    }).join("");

    var risks = (c.risks || []).map(function (r) {
      return (
        '<li class="ir-wy__risk">' +
          '<span class="ir-wy__badge">' + icon(r.icon) + "</span>" +
          '<div class="ir-wy__risk-body">' +
            '<strong class="ir-wy__risk-title">' + esc(r.title) + "</strong>" +
            '<p class="ir-wy__risk-text">' + esc(r.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-wy") + '">' +
        '<div class="ir-wy__lede">' +
          head({ id: "ir-why-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          (body ? '<div class="ir-wy__body ir-reveal"' + at(1) + ">" + body + "</div>" : "") +
        "</div>" +
        (risks
          ? '<div class="ir-wy__register ir-reveal"' + at(2) + ">" +
              (c.risksTitle
                ? '<h3 class="ir-wy__register-title" id="ir-why-risks">' + esc(c.risksTitle) + "</h3>"
                : "") +
              '<ul class="ir-wy__risks"' +
                (c.risksTitle ? ' aria-labelledby="ir-why-risks"' : "") + ">" + risks + "</ul>" +
            "</div>"
          : "") +
      "</div>",
      "ir-wy"
    );

    return true;
  }

  /* ---- 04 · Services ------------------------------------------------------
     A bento, because the copy has a hierarchy: one emergency service (the
     dark anchor card), four response services, and one "not under
     attack?" service (the full-width band). Each card is an <article>
     with an id, so other pages can deep-link to it (#ir-svc-forensics).
     The cards are static; only the band's text link is interactive.
     -------------------------------------------------------------------- */
  function buildServices(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-sv")) return true;

    var items = c.items || [];

    var cards = items.map(function (s, i) {
      var num = '<span class="ir-sv__num" aria-hidden="true">' + pad(i + 1) + "</span>";
      var title = '<h3 class="ir-sv__title">' + esc(s.title) + "</h3>";
      var text = '<p class="ir-sv__text">' + esc(s.text) + "</p>";
      var id = s.slug ? ' id="ir-svc-' + esc(s.slug) + '"' : "";
      var card;

      if (i === 0) {
        // The photo is atmosphere behind copy that already names the
        // service, so it is decorative (alt="", in an aria-hidden layer).
        card =
          '<article class="ir-sv__card ir-sv__card--anchor' + (s.image ? " ir-sv__card--photo" : "") + '"' + id + ">" +
            (s.image
              ? '<span class="ir-sv__bg" aria-hidden="true">' +
                  '<img class="ir-sv__bg-img" src="' + esc(s.image) + '" alt="" ' +
                    'width="1707" height="2560" loading="lazy" decoding="async"' +
                    (s.imagePosition ? ' style="object-position:' + esc(s.imagePosition) + '"' : "") + ">" +
                "</span>"
              : "") +
            '<div class="ir-sv__top">' + num +
              '<span class="ir-sv__icon">' + icon(s.icon) + "</span>" +
            "</div>" +
            '<div class="ir-sv__body">' + title + text + "</div>" +
          "</article>";
      } else if (i === 5) {
        var link = s.link || {};
        card =
          '<article class="ir-sv__card ir-sv__card--band"' + id + ">" +
            '<span class="ir-sv__icon">' + icon(s.icon) + "</span>" +
            '<div class="ir-sv__body">' +
              '<div class="ir-sv__title-row">' + num + title + "</div>" + text +
            "</div>" +
            (link.label && link.href
              ? '<a class="ir-sv__link" href="' + esc(link.href) + '" data-ir-cta="service-6">' +
                  esc(link.label) + ARROW +
                "</a>"
              : "") +
          "</article>";
      } else {
        card =
          '<article class="ir-sv__card"' + id + ">" +
            '<div class="ir-sv__top">' +
              '<span class="ir-sv__icon">' + icon(s.icon) + "</span>" + num +
            "</div>" +
            title + text +
          "</article>";
      }

      return (
        '<li class="ir-sv__item ir-sv__item--s' + (i + 1) + ' ir-reveal"' + at(i + 1) + ">" +
          card +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("ir-sv") + '">' +
        head({ id: "ir-services-title", eyebrow: c.eyebrow, title: c.title, sub: c.intro }) +
        '<ul class="ir-sv__grid">' + cards + "</ul>" +
      "</div>",
      "ir-sv"
    );

    // A card photo that fails to load is removed, leaving the plain dark
    // card rather than a broken-image icon. `error` does not bubble, so
    // this listens in the capture phase.
    root.addEventListener("error", function (e) {
      var img = e.target;
      if (!img.classList || !img.classList.contains("ir-sv__bg-img")) return;
      var card = img.closest(".ir-sv__card");
      if (card) card.classList.remove("ir-sv__card--photo");
      img.parentNode.parentNode.removeChild(img.parentNode);
    }, true);

    bindAnchors(root);
    return true;
  }

  /* ---- 05 · Response process ---------------------------------------------
     The signature section: six steps on one rail whose colour runs from
     alert to green, so the incident visibly cools along it. On desktop
     the rail is one pseudo-element on the <ol>; its gradient stops are
     written here from each step's tone, so they follow CONTENT. Stacked,
     each step draws its own segment down to the next node, in a gradient
     from its tone to the next one's (--ir-next).
     -------------------------------------------------------------------- */
  function buildProcess(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-pr")) return true;

    var steps = c.steps || [];
    var last = Math.max(steps.length - 1, 1);

    var stops = steps.map(function (s, i) {
      return TONE_INK[tone(s.tone)] + " " + round((i / last) * 100) + "%";
    }).join(", ");

    var items = steps.map(function (s, i) {
      var t = tone(s.tone);
      var next = steps[i + 1] ? TONE_INK[tone(steps[i + 1].tone)] : TONE_INK[t];
      return (
        '<li class="ir-pr__step ir-pr__step--' + t + '" ' +
          'style="--i:' + i + ";--ir-next:" + next + '">' +
          '<span class="ir-pr__node" aria-hidden="true">' +
            '<span class="ir-pr__num">' + pad(i + 1) + "</span>" +
          "</span>" +
          '<div class="ir-pr__body ir-reveal"' + at(i + 2) + ">" +
            '<h3 class="ir-pr__title">' + esc(s.title) + "</h3>" +
            '<p class="ir-pr__text">' + esc(s.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-pr") + '">' +
        head({ id: "ir-process-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub }) +
        '<ol class="ir-pr__steps" style="--n:' + steps.length + ";--ir-pr-stops:" + stops + '">' +
          items +
        "</ol>" +
      "</div>",
      "ir-pr"
    );

    return true;
  }

  /* ---- 06 · Incidents we handle --------------------------------------------
     A case-file index: rows, not cards, in two CSS columns so the reading
     order runs down the left column first.
     -------------------------------------------------------------------- */
  function buildIncidents(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-ic")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="ir-ic__item ir-reveal"' + at(i + 1) + ">" +
          '<span class="ir-ic__badge">' + icon(it.icon) + "</span>" +
          '<div class="ir-ic__body">' +
            '<h3 class="ir-ic__title">' + esc(it.title) + "</h3>" +
            '<p class="ir-ic__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-ic") + (INCIDENT_HOVER_BAR ? " ir-ic--hover-bar" : "") + '">' +
        head({ id: "ir-incidents-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        '<ul class="ir-ic__list">' + items + "</ul>" +
      "</div>",
      "ir-ic"
    );

    return true;
  }

  /* ---- 07 · Platform -----------------------------------------------------
     The "rapid deployment" diagram: four sources stacked on the left, the
     IR One core on the right, HawkINT tethered under it. The sources sit
     in equal grid rows, so their centres fall at (i + .5) / n of the
     stage height; the connectors use the same numbers in a 0–100 viewBox
     stretched over the gap (preserveAspectRatio="none", with
     non-scaling strokes), so the lines meet the chips and the core at any
     width without measuring.

     The travelling signals are zero-length round-capped strokes: with a
     non-scaling stroke the cap stays a circle however the SVG stretches,
     where a <circle> would squash into an ellipse.
     -------------------------------------------------------------------- */
  function platformStage(v) {
    var src = v.sources || [];
    var n = src.length;
    var lines = "";
    var dots = "";
    var chips = "";

    src.forEach(function (s, i) {
      var y = round(((i + 0.5) * 100) / n);
      // Durations step through 2.4–3.2s out of order, so neighbouring
      // signals never move in step; negative delays start them mid-flight.
      var dur = n > 1 ? 2.4 + (((i * 3) % n) * 0.8) / (n - 1) : 2.8;

      lines += '<line x1="0" y1="' + y + '" x2="100" y2="50"/>';
      dots +=
        '<path class="ir-pf__signal" d="M0 ' + y + 'h.01" ' +
          'style="--dx:100px;--dy:' + round(50 - y) + "px;" +
          "--d:" + round(dur) + "s;--delay:-" + round(i * 0.9) + 's"/>';
      chips +=
        '<span class="ir-pf__source">' +
          '<span class="ir-pf__source-icon">' + icon(s.icon) + "</span>" +
          esc(s.label) +
        "</span>";
    });

    return (
      '<div class="ir-pf__stage" aria-hidden="true">' +
        '<span class="ir-pf__sources" style="--n:' + Math.max(n, 1) + '">' + chips + "</span>" +
        '<svg class="ir-pf__links" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' +
          '<g class="ir-pf__lines">' + lines + "</g>" +
          "<g>" + dots + "</g>" +
        "</svg>" +
        '<span class="ir-pf__hub">' +
          '<span class="ir-pf__core">' +
            '<span class="ir-pf__core-icon">' + icon("shield") + "</span>" +
            '<span class="ir-pf__core-name">' + esc(v.core) + "</span>" +
          "</span>" +
          (v.intel
            ? '<span class="ir-pf__intel">' +
                '<span class="ir-pf__tether"></span>' +
                '<span class="ir-pf__intel-chip">' + icon("globe") + esc(v.intel) + "</span>" +
              "</span>"
            : "") +
        "</span>" +
      "</div>"
    );
  }

  function buildPlatform(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-pf")) return true;

    var features = (c.features || []).map(function (f, i) {
      return (
        '<li class="ir-pf__feature ir-reveal"' + at(i + 3) + ">" +
          '<span class="ir-pf__feature-icon">' + icon(f.icon) + "</span>" +
          "<div>" +
            '<strong class="ir-pf__feature-title">' + esc(f.title) + "</strong>" +
            '<p class="ir-pf__feature-text">' + esc(f.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("ir-pf") + '">' +
        '<div class="ir-pf__copy">' +
          head({ id: "ir-platform-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          (c.body ? '<p class="ir-pf__body ir-reveal"' + at(1) + ">" + esc(c.body) + "</p>" : "") +
          (features ? '<ul class="ir-pf__features">' + features + "</ul>" : "") +
        "</div>" +
        '<div class="ir-pf__visual ir-reveal"' + at(2) + ">" + platformStage(c.visual || {}) + "</div>" +
      "</div>",
      "ir-pf"
    );

    var stage = root.querySelector(".ir-pf__stage");
    if (PLATFORM_MOTION && stage) {
      stage.classList.add("is-moving");
      whileVisible(stage, function (on) {
        stage.classList.toggle("is-paused", !on);
      });
    }

    return true;
  }

  /* ---- 08 · Industries ------------------------------------------------- */
  function buildIndustries(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-in")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="ir-in__item ir-reveal"' + at(i + 1) + ">" +
          '<div class="ir-in__card">' +
            '<span class="ir-in__icon">' + icon(it.icon) + "</span>" +
            '<h3 class="ir-in__title">' + esc(it.title) + "</h3>" +
            '<p class="ir-in__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-in") + '">' +
        head({ id: "ir-industries-title", eyebrow: c.eyebrow, title: c.title, sub: c.intro }) +
        '<ul class="ir-in__grid">' + items + "</ul>" +
      "</div>",
      "ir-in"
    );

    return true;
  }

  /* ---- 09 · Readiness & retainer -----------------------------------------
     The root carries id="ir-readiness", the target of the hero's
     secondary button and service 06's link. tabindex="-1" lets those
     links move focus here as well as scroll.
     -------------------------------------------------------------------- */
  function buildReadiness(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-rd")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="ir-rd__item ir-reveal"' + at(i + 1) + ">" +
          '<div class="ir-rd__card">' +
            '<span class="ir-rd__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
            '<div class="ir-rd__main">' +
              '<div class="ir-rd__title-row">' +
                '<span class="ir-rd__icon">' + icon(it.icon) + "</span>" +
                '<h3 class="ir-rd__title">' + esc(it.title) + "</h3>" +
              "</div>" +
              '<p class="ir-rd__text">' + esc(it.text) + "</p>" +
            "</div>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-rd") + '" id="ir-readiness" tabindex="-1">' +
        '<div class="ir-rd__lede">' +
          head({ id: "ir-readiness-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          (c.body ? '<p class="ir-rd__body ir-reveal"' + at(1) + ">" + esc(c.body) + "</p>" : "") +
        "</div>" +
        '<ol class="ir-rd__list">' + items + "</ol>" +
      "</div>",
      "ir-rd"
    );

    return true;
  }

  /* ---- 10 · Why CybrHawk --------------------------------------------------
     A dark "command panel" set inside the white section: the header, then
     five pillars side by side under one rail. Each pillar's stretch of the
     rail draws in blue as the section scrolls in, one after another, so
     the five read as one continuous commitment. The large outlined
     numerals are decoration (the <ol> already numbers them).
     -------------------------------------------------------------------- */
  function buildTrust(host, c) {
    if (!host) return false;
    if (host.querySelector(".ir-tr")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="ir-tr__item ir-reveal"' + at(i + 1) + ">" +
          '<span class="ir-tr__rail" aria-hidden="true"></span>' +
          '<span class="ir-tr__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
          (it.icon ? '<span class="ir-tr__icon">' + icon(it.icon) + "</span>" : "") +
          '<h3 class="ir-tr__title">' + esc(it.title) + "</h3>" +
          '<p class="ir-tr__text">' + esc(it.text) + "</p>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ir-tr") + '">' +
        '<div class="ir-tr__panel">' +
          '<span class="ir-tr__decor" aria-hidden="true"></span>' +
          head({ id: "ir-trust-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          '<ol class="ir-tr__list">' + items + "</ol>" +
        "</div>" +
      "</div>",
      "ir-tr"
    );

    return true;
  }

  /* ---- Mobile call bar ---------------------------------------------------
     On phones (≤767px), once the banner and the hero buttons have both
     left the screen, a fixed bar at the foot of the screen keeps the
     emergency number one tap away. It is the one node built outside a
     container: appended to <body> once, with `ir-has-callbar` on <body>
     so the page can pad its last line clear of it.

     One IntersectionObserver watches whichever of the two exists. If
     neither does, the bar shows from the start on phones, but only once
     the build has settled, so a hero that is merely late never flashes
     it. While hidden it is visibility: hidden and inert, so it cannot be
     tabbed to.
     -------------------------------------------------------------------- */
  var CALLBAR_WATCH = [".ir-bn", ".ir-hr__actions"];
  var callbar = null;
  var callbarOff = false;
  var callbarIO = null;
  var callbarMQ = null;
  var watched = [];
  var settledAll = false;

  function callBar() {
    if (callbarOff) return;

    if (!callbar) {
      var b = CONTENT.banner || {};
      var cta = b.cta || {};

      // Off, nothing to dial, or another copy of this script already built
      // (and watches) the bar.
      if (!b.mobileCallBar || !cta.label || !cta.href || !document.body ||
          document.querySelector(".ir-callbar")) {
        callbarOff = true;
        return;
      }

      document.body.insertAdjacentHTML(
        "beforeend",
        '<a class="ir-callbar" href="' + esc(cta.href) + '" data-ir-cta="callbar" inert>' +
          '<span class="ir-live" aria-hidden="true"></span>' +
          '<span class="ir-callbar__label">' + phoneText(cta.label) + "</span>" +
          '<span class="ir-callbar__icon">' + icon("phone") + "</span>" +
        "</a>"
      );
      callbar = document.querySelector(".ir-callbar");
      document.body.classList.add("ir-has-callbar");

      if (window.matchMedia) {
        callbarMQ = window.matchMedia("(max-width: 767px)");
        if (callbarMQ.addEventListener) {
          callbarMQ.addEventListener("change", syncCallBar);
        } else if (callbarMQ.addListener) {
          callbarMQ.addListener(syncCallBar);
        }
      }

      if ("IntersectionObserver" in window) {
        callbarIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            watched.forEach(function (w) {
              if (w.el === e.target) w.seen = e.isIntersecting;
            });
          });
          syncCallBar();
        });
      }
    }

    // Pick up a banner or hero that was built since the last pass.
    CALLBAR_WATCH.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      for (var i = 0; i < watched.length; i++) {
        if (watched[i].el === el) return;
      }
      // Counted as on screen until the observer reports, so the bar never
      // flashes in on load. Without an observer it can never report, so
      // the bar simply shows on phones.
      watched.push({ el: el, seen: !!callbarIO });
      if (callbarIO) callbarIO.observe(el);
    });

    syncCallBar();
  }

  function syncCallBar() {
    if (!callbar) return;

    var phone = callbarMQ ? callbarMQ.matches : false;
    var anyOnScreen = false;
    watched.forEach(function (w) {
      if (w.seen) anyOnScreen = true;
    });

    var show = phone && (watched.length ? !anyOnScreen : settledAll);

    callbar.classList.toggle("is-shown", show);
    if (show) {
      callbar.removeAttribute("inert");
    } else {
      callbar.setAttribute("inert", "");
    }
  }

  /* ---- Build ------------------------------------------------------------ */
  var BUILDERS = [
    ["banner", buildBanner],
    ["hero", buildHero],
    ["why", buildWhy],
    ["services", buildServices],
    ["process", buildProcess],
    ["incidents", buildIncidents],
    ["platform", buildPlatform],
    ["industries", buildIndustries],
    ["readiness", buildReadiness],
    ["trust", buildTrust]
  ];

  var settled = {};

  // True once every section with a selector is built (or has failed).
  function buildAll() {
    var done = true;

    BUILDERS.forEach(function (b) {
      var key = b[0];
      if (!SECTIONS[key] || settled[key]) return;

      var container = document.querySelector(SECTIONS[key]);
      var host = container && (container.querySelector(".e-con-inner") || container);

      try {
        if (container) {
          container.classList.add("ir-section");
          if (DARK[key]) container.classList.add("ir-section--dark");
        }
        if (!b[1](host, CONTENT[key] || {})) {
          done = false;                              // container not ready
          return;
        }
      } catch (err) {
        // A builder that throws would throw again on every DOM change, so
        // it is logged once and not retried; the others carry on.
        if (window.console) {
          console.error("IR: the " + key + " section failed to build.", err);
        }
      }

      settled[key] = true;
    });

    // The call bar is independent of every builder: a failure there must
    // not stop the sections, and vice versa.
    try {
      callBar();
    } catch (err) {
      if (window.console) console.error("IR: the mobile call bar failed.", err);
    }

    return done;
  }

  function reveal(root) {
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      root.classList.add("is-visible");
      return;
    }

    // About a tenth of the section in view triggers it. A section taller
    // than ten screens could never show a tenth, so the share is capped at
    // what half a screen of it amounts to.
    var share = Math.min(
      0.1,
      (window.innerHeight * 0.5) / Math.max(root.offsetHeight, 1)
    );

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          root.classList.add("is-visible");
          io.disconnect();
        });
      },
      { threshold: share }
    );
    io.observe(root);
  }

  function settle() {
    settledAll = true;
    syncCallBar();
  }

  function init() {
    // Elementor renders its containers server-side, so by `load` any
    // banner or hero that will exist does; a page with neither shows the
    // call bar from then on rather than after the 10 s build window.
    if (document.readyState === "complete") {
      settle();
    } else {
      window.addEventListener("load", settle);
    }

    if (buildAll()) {
      settle();
      return;
    }
    var obs = new MutationObserver(function () {
      if (buildAll()) {
        obs.disconnect();
        settle();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      obs.disconnect();
      settle();
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
