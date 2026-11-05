/* =====================================================================
   CybrHawk — SIEM Cloud (Cloud Detection & Response) page, sections 01–09
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects each
   section's markup into its own empty container and pairs with
   siem-cloud.css. Section 10 (the final call to action) is the site's
   existing CTA component and is not built here; the FAQ ends on white
   so it joins without a seam.

   One container per section, in page order, each set to Full Width with
   padding 0 and no background, its class in the CSS Classes field:

     sc-hero       sc-challenge  sc-platform   sc-capabilities
     sc-coverage   sc-usecases   sc-impact     sc-why          sc-faq

   On build each container also gets `sc-section` (and `sc-section--dark`
   for the two dark grounds, 03 and 06), which carries the shared tokens, so
   editors only ever type the one class. A missing container skips only
   its own section, and an error in one builder is logged without
   stopping the others.

   The page tells one story top to bottom: three signal lanes (posture,
   identity, threat) start out separate and are pulled into one blue
   line, the correlated story of risk. Amber, teal and red mean those
   three signal types and nothing else.

   If a live class differs, change SECTIONS below — they are the only
   selectors this file touches (siem-cloud.css is scoped to the same
   classes, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = {
    hero: ".sc-hero",
    challenge: ".sc-challenge",
    platform: ".sc-platform",
    capabilities: ".sc-capabilities",
    coverage: ".sc-coverage",
    usecases: ".sc-usecases",
    impact: ".sc-impact",
    why: ".sc-why",
    faq: ".sc-faq"
  };

  // Sections on a dark ground; their container also gets sc-section--dark.
  // The hero is light: its right-hand image panel carries its own dark.
  var DARK = { platform: true, usecases: true };

  /* ---- Content (edit freely) -----------------------------------------

     Every string a reader sees lives here; the builders hard-code none.
     In any title, "\n" becomes a line break and [[double brackets]] set
     that run in the accent colour. An empty eyebrow is not rendered, and
     a link or button with an empty href is not rendered either.

     Icons are named per item; the glyphs are in ICONS further down.
     Lanes are "posture", "identity" or "threat". Every CTA carries
     data-sc-cta="<placement>" for click tracking in GTM.
     -------------------------------------------------------------------- */
  var CONTENT = {

    hero: {
      eyebrow: "SIEM Cloud · Cloud Detection & Response (CDR)",
      // Three spans inside one <h1>; line 3 in the accent.
      title: ["Secure Every Cloud.", "Detect Every Threat.", "Respond in Real Time."],
      sub: "CybrHawk SIEM Cloud correlates cloud-native logs, posture findings, and identity activity across AWS, Azure, Google Cloud, and SaaS. It finds misconfigurations, IAM abuse, and active attacks, then responds automatically with built-in guardrails, so you can move fast in the cloud without losing control.",
      cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
      // Rendered only while section 04 (its target) exists.
      ctaSecondary: { label: "Tour All Features", href: "#sc-capabilities" },
      trust: [
        "AWS, Azure, GCP, and SaaS",
        "Agentless, API-based onboarding",
        "Posture plus threat detection",
        "Automated guardrail response"
      ],
      // The right-hand panel: full bleed to the screen edge, image shown whole.
      //   image     the banner (square, 1254×1254 WebP). "" shows the coded
      //             convergence console instead, and so does an image that
      //             fails to load
      //   imageAlt  "" because the image is atmosphere; the H1 carries the meaning
      // The console's words: signal names from the section 03 paragraph
      // ("a misconfiguration, a risky permission, and a suspicious API call"),
      // the story line from "a single, prioritized story of risk", the guardrail
      // actions from capability 5. State words are UI labels.
      visual: {
        label: "CybrHawk SIEM Cloud",
        providers: ["AWS", "Azure", "GCP", "SaaS"],
        signals: [
          { lane: "posture",  tag: "Posture",  text: "Misconfiguration" },
          { lane: "identity", tag: "Identity", text: "Risky permission" },
          { lane: "threat",   tag: "Threat",   text: "Suspicious API call" }
        ],
        story: "One prioritized story of risk",
        guardrail: "Guardrail: Revoke tokens · Rotate keys",
        states: { separate: "Separate alerts", correlated: "Correlated", guarded: "Guardrail applied" },
        image: "https://cybrhawk.com/wp-content/uploads/2026/11/seim-cloud-banner-1.webp",
        imageAlt: ""
      }
    },

    challenge: {
      eyebrow: "The Challenge",
      title: "The Cloud Moves Fast. [[So Do Attackers.]]",
      body: [
        "Cloud environments change by the minute. New workloads, identities, API keys, and permissions are created constantly, often by automation and across multiple providers. A single misconfigured storage bucket, an over-privileged role, or a leaked access key can expose sensitive data in seconds.",
        "Traditional security tools were built for static data centers. They struggle with ephemeral workloads, cloud-native logs, and identity-centric attacks. Security teams are left juggling separate consoles for each cloud, posture tools that generate endless findings, and SaaS apps they cannot see into at all."
      ],
      // dot: posture | identity | neutral | hollow. Offsets and rotation are
      // per card, in SCATTER below.
      items: [
        { dot: "posture",  title: "Misconfigurations",       text: "Misconfigured resources remain one of the most common causes of cloud breaches." },
        { dot: "identity", title: "Identity sprawl",         text: "Excessive permissions, unused roles, and long-lived keys create easy paths for attackers." },
        { dot: "neutral",  title: "Multi-cloud complexity",  text: "Each provider has its own logs, services, and security model." },
        { dot: "hollow",   title: "SaaS blind spots",        text: "Critical business data lives in Microsoft 365, Google Workspace, and other SaaS apps outside traditional monitoring." }
      ]
    },

    platform: {
      eyebrow: "Platform Overview",
      title: "Posture, Identity, and Threat Detection in [[One Cloud Security Platform]]",
      sub: "CybrHawk SIEM Cloud brings cloud security posture management, identity threat detection, and real-time threat analytics together. Instead of treating a misconfiguration, a risky permission, and a suspicious API call as three separate alerts, it connects them into a single, prioritized story of risk, and gives you the tools to fix it.",
      // Rail labels (aria-hidden), from the H2.
      lanes: ["Posture", "Identity", "Threat"],
      steps: [
        { title: "Connect",               text: "Onboard AWS, Azure, GCP, and SaaS accounts in minutes through read-only APIs, with no agents required." },
        { title: "Ingest & Correlate",    text: "Collect AWS CloudTrail, Azure Activity Logs, GCP Audit Logs, flow logs, CSPM findings, and identity events into one data layer." },
        { title: "Detect & Prioritize",   text: "Analytics, behavioral models, and threat intelligence surface real threats and rank them by exposure and business impact." },
        { title: "Respond & Remediate",   text: "Trigger guardrail actions, open tickets, and deliver step-by-step remediation guidance to cloud and DevOps teams." }
      ]
    },

    capabilities: {
      eyebrow: "Key Capabilities",
      title: "Complete [[Cloud Detection & Response]]",
      // Numbered 01–09 from array order. Each cell is
      // <article id="sc-cap-{slug}">, so other pages can deep-link to it.
      items: [
        { slug: "drift",      icon: "drift",          title: "Misconfiguration & Drift Detection",
          text: "Continuously assess cloud resources against security best practices and your own baselines. Detect drift the moment it happens, with automatic ticketing and clear remediation guidance." },
        { slug: "iam",        icon: "identity",       title: "Cloud Identity & IAM Threat Detection",
          text: "Identify suspicious IAM activity, access-key misuse, privilege escalation, and dormant or over-privileged identities before attackers exploit them." },
        { slug: "threats",    icon: "radar",          title: "Real-Time Cloud Threat Detection",
          text: "Detect crypto-mining, data exfiltration, unusual API calls, impossible travel, and attacker reconnaissance across cloud control planes." },
        { slug: "saas",       icon: "apps",           title: "SaaS Security Visibility",
          text: "Monitor Microsoft 365, Google Workspace, and other productivity and IT apps for risky sharing, account takeover, malicious OAuth apps, and admin abuse." },
        { slug: "guardrails", icon: "shield-refresh", title: "Guardrail Response Actions",
          text: "Quarantine workloads, revoke tokens, rotate keys, and block risky policies automatically or with one-click approval." },
        { slug: "network",    icon: "network",        title: "Workload & Network Visibility",
          text: "Analyze VPC and VNet flow logs to spot unexpected internet exposure, suspicious east-west traffic, and anomalous egress." },
        { slug: "supply",     icon: "link",           title: "Supply-Chain Risk Detection",
          text: "Monitor third-party integrations, CI/CD pipelines, and cross-account access for signs of supply-chain compromise." },
        { slug: "dashboard",  icon: "dashboard",      title: "Unified Multi-Cloud Dashboard",
          text: "See risk, threats, and compliance status across every cloud account and subscription in a single view." },
        { slug: "compliance", icon: "file-check",     title: "Cloud Compliance Reporting",
          text: "Map controls and evidence to CIS Benchmarks, NIST, ISO 27001, PCI DSS, HIPAA, SOC 2, and GDPR requirements." }
      ]
    },

    coverage: {
      eyebrow: "Coverage",
      title: "Broad Coverage Across [[Your Cloud Estate]]",
      // Either chips (split from the copy's list, joining "and" dropped) or text (verbatim sentence).
      items: [
        { title: "Amazon Web Services",
          chips: ["CloudTrail", "GuardDuty", "VPC Flow Logs", "IAM", "S3", "EKS", "Security Hub"] },
        { title: "Microsoft Azure",
          chips: ["Activity Logs", "Entra ID (Azure AD) sign-in and audit logs", "NSG Flow Logs", "Defender for Cloud", "AKS"] },
        { title: "Google Cloud",
          chips: ["Cloud Audit Logs", "VPC Flow Logs", "IAM", "Security Command Center", "GKE"] },
        { title: "SaaS & Productivity",
          text: "Microsoft 365, Google Workspace, and leading collaboration and IT applications" },
        { title: "Containers & Kubernetes",
          text: "Audit logs and runtime signals from managed Kubernetes services" },
        { title: "Identity Providers",
          chips: ["Okta", "Microsoft Entra ID", "federated SSO activity"] }
      ]
    },

    usecases: {
      eyebrow: "Use Cases",
      title: "Stop the Cloud Threats [[That Matter Most]]",
      // lane drives the card's top line only (decoration, no visible label).
      items: [
        { lane: "posture",  icon: "bucket",    title: "Exposed Storage & Data Leaks",
          text: "Find public buckets, open blob containers, and overly permissive sharing, and close them before data is exposed." },
        { lane: "identity", icon: "key",       title: "Compromised Credentials & Keys",
          text: "Detect leaked or misused access keys and tokens, then revoke and rotate them automatically." },
        { lane: "identity", icon: "escalate",  title: "Privilege Escalation",
          text: "Catch attackers creating new admin roles, attaching policies, or assuming roles across accounts." },
        { lane: "threat",   icon: "cpu",       title: "Crypto-Mining & Resource Abuse",
          text: "Spot unexpected compute spikes, unusual regions, and GPU instances launched by attackers." },
        { lane: "threat",   icon: "user-eye",  title: "SaaS Account Takeover",
          text: "Identify suspicious logins, mailbox rule changes, mass downloads, and malicious OAuth consent in Microsoft 365 and Google Workspace." },
        { lane: "posture",  icon: "file-check", title: "Continuous Cloud Compliance",
          text: "Maintain an always-current view of compliance posture and generate audit evidence on demand." }
      ]
    },

    impact: {
      eyebrow: "Business Impact",
      title: "Cloud Security That [[Accelerates the Business]]",
      items: [
        { title: "Reduce Cloud Breach Risk", text: "Find and fix the misconfigurations and identity weaknesses attackers target first." },
        { title: "Respond in Real Time",     text: "Automated guardrails contain cloud threats in seconds, before they escalate." },
        { title: "Cut Alert Noise",          text: "Correlated, risk-ranked findings replace thousands of disconnected posture alerts." },
        { title: "Empower DevOps",           text: "Clear remediation guidance and ticketing integrations help engineering teams fix issues fast, without slowing delivery." },
        { title: "Simplify Audits",          text: "Continuous compliance mapping and evidence collection reduce audit preparation effort." },
        { title: "Consolidate Tools",        text: "One platform replaces separate CSPM, cloud log analytics, and SaaS monitoring tools." }
      ]
    },

    why: {
      eyebrow: "",   // "Why CybrHawk" would repeat the H2
      title: "Why CybrHawk for [[Cloud Security]]",
      // Item 1 is the dark anchor card with the mini convergence diagram.
      items: [
        { icon: "",        title: "Detection and Posture Together", text: "Most tools do one or the other. CybrHawk connects misconfigurations, identities, and live threats in one view." },
        { icon: "globe",   title: "True Multi-Cloud",               text: "Consistent detection, response, and reporting across AWS, Azure, Google Cloud, and SaaS." },
        // TODO: copy says "SIEM XDR"; the UCD page writes "SIEM / XDR". Confirm before launch. Don't change it here.
        { icon: "layers",  title: "Unified With Your SOC",          text: "Cloud detections correlate natively with endpoint, network, and identity data in CybrHawk SIEM XDR." },
        { icon: "shield",  title: "Safe Automation",                text: "Guardrail responses include approvals, scoping, and rollback, so automation never breaks production." },
        { icon: "headset", title: "Expert Support",                 text: "Optional 24/7 cloud threat monitoring and response from the CybrHawk SOC." }
      ]
    },

    faq: {
      eyebrow: "",   // "FAQ" would repeat the H2
      title: "Frequently Asked Questions",
      // TODO: confirm with whoever runs Rank Math / Yoast whether it already
      // emits FAQ schema for this page before turning this on.
      schema: false,
      items: [
        { q: "What is Cloud Detection and Response (CDR)?",
          a: "CDR is a security approach that continuously monitors cloud environments for threats, using cloud-native logs, identity activity, and configuration data, and enables rapid, automated response. It is built for the speed and scale of cloud infrastructure." },
        { q: "How is SIEM Cloud different from CSPM?",
          a: "CSPM identifies misconfigurations. CybrHawk SIEM Cloud includes posture assessment but also detects active threats, correlates identity and API activity, and takes response actions, giving you prevention and detection in one platform." },
        { q: "Which cloud platforms are supported?",
          a: "Amazon Web Services, Microsoft Azure, and Google Cloud, plus SaaS applications such as Microsoft 365 and Google Workspace." },
        { q: "Do I need to install agents?",
          a: "No. CybrHawk SIEM Cloud connects through cloud provider APIs and log services using read-only access, so onboarding is fast and does not affect workloads." },
        { q: "Can it take automated action?",
          a: "Yes. Guardrail responses can quarantine workloads, revoke tokens, rotate keys, and block risky policies, either automatically or after approval." },
        { q: "Does it help with compliance?",
          a: "Yes. Controls and evidence are mapped to frameworks including CIS Benchmarks, NIST, ISO 27001, PCI DSS, HIPAA, SOC 2, and GDPR." }
      ]
    }
  };

  // Fade/rise each section's content in as it scrolls into view, the
  // hero's one-off load stagger, and the section 03 rail draw.
  var ANIMATE = true;

  // The hero console's separate → correlated → guarded loop. Paused off
  // screen and in a background tab; static in its final state under
  // reduced motion.
  var HERO_LOOP = true;

  /* Section 02's "separate consoles": each card's own offset (px) and
     tilt (deg), so the four never line up. Phones and reduced motion
     drop them (siem-cloud.css), because misalignment on a narrow screen
     just looks broken. */
  var SCATTER = [
    { dx: -8,  dy: 6,   rot: -1.2 },
    { dx: 10,  dy: -8,  rot: 0.9 },
    { dx: -6,  dy: 12,  rot: 0.7 },
    { dx: 12,  dy: -6,  rot: -0.8 }
  ];
  /* -------------------------------------------------------------------- */

  /* ---- Icons ------------------------------------------------------------
     24×24 strokes that follow currentColor. Glyphs shared with
     incident-response.js and udc.js are copied as-is so the same idea
     reads the same across the site; the six new ones (drift, apps,
     bucket, key, escalate, cpu) are drawn to the same grid and weight.
     -------------------------------------------------------------------- */
  var ICONS = {
    // From incident-response.js / udc.js
    shield:
      '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.9 7.2 9.4 4.2-1.5 7.2-5 7.2-9.4V6z"/>' +
      '<path d="m8.9 12 2.2 2.2 4-4.2"/>',
    globe:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<path d="M3.4 12h17.2"/>' +
      '<path d="M12 3.4c2.3 2.3 3.5 5.2 3.5 8.6s-1.2 6.3-3.5 8.6c-2.3-2.3-3.5-5.2-3.5-8.6s1.2-6.3 3.5-8.6z"/>',
    network:
      '<rect x="8.8" y="3" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="2.4" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<rect x="15.2" y="16" width="6.4" height="5" rx="1.7"/>' +
      '<path d="M12 8v3.6"/>' +
      '<path d="M5.6 16v-2.6a1.8 1.8 0 0 1 1.8-1.8h9.2a1.8 1.8 0 0 1 1.8 1.8V16"/>',
    identity:
      '<circle cx="9.4" cy="7.6" r="3.4"/>' +
      '<path d="M3.4 19.6c.4-3.6 2.9-5.8 6-5.8 1.3 0 2.5.3 3.5.9"/>' +
      '<path d="m17.4 12.4 3.6 1.4v2.6c0 2.3-1.5 4.1-3.6 4.9-2.1-.8-3.6-2.6-3.6-4.9v-2.6z"/>',
    "file-check":
      '<path d="M14 2.9H7.4a2 2 0 0 0-2 2v14.2a2 2 0 0 0 2 2h9.2a2 2 0 0 0 ' +
        '2-2V7.9z"/>' +
      '<polyline points="13.9 2.9 13.9 8 19 8"/>' +
      '<path d="m9.2 14.6 2 2 3.8-4"/>',
    radar:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<circle cx="12" cy="12" r="4.4"/>' +
      '<path d="m12 12 6.1-6.1M16.2 14.6h.01"/>',
    check:
      '<path d="m6.6 12.4 3.6 3.6 7.2-7.6"/>',
    "user-eye":
      '<circle cx="9" cy="7.6" r="3.4"/>' +
      '<path d="M3 19.6c.4-3.6 2.9-5.8 6-5.8 1 0 1.9.2 2.7.6"/>' +
      '<path d="M13.2 17.6s1.6-3 4.2-3 4.2 3 4.2 3-1.6 3-4.2 3-4.2-3-4.2-3z"/>' +
      '<circle cx="17.4" cy="17.6" r="1"/>',
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
    link:
      '<path d="M10.2 13.8a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1.2 1.2"/>' +
      '<path d="M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1.2-1.2"/>',
    dashboard:
      '<rect x="3" y="4.2" width="18" height="12.4" rx="2.2"/>' +
      '<path d="M12 16.6v3.6M8.4 20.2h7.2"/>' +
      '<path d="m6.8 12.6 3.1-3.1 2.6 2.4 4.7-4.7"/>',

    // 04 · Capabilities
    // A resource and its dashed, shifted copy: the baseline, and where it
    // has drifted to.
    drift:
      '<rect x="9.4" y="3.4" width="11.2" height="11.2" rx="2.2" stroke-dasharray="2.2 2.4"/>' +
      '<rect x="3.4" y="9.4" width="11.2" height="11.2" rx="2.2"/>',
    // Four app tiles: the SaaS estate.
    apps:
      '<rect x="3.6" y="3.6" width="7.2" height="7.2" rx="1.8"/>' +
      '<rect x="13.2" y="3.6" width="7.2" height="7.2" rx="1.8"/>' +
      '<rect x="3.6" y="13.2" width="7.2" height="7.2" rx="1.8"/>' +
      '<rect x="13.2" y="13.2" width="7.2" height="7.2" rx="1.8"/>',

    // 06 · Use cases
    // An open storage bucket: the rim drawn whole, so it reads as open.
    bucket:
      '<ellipse cx="12" cy="6.6" rx="7.8" ry="2.6"/>' +
      '<path d="m4.2 6.6 1.9 12.1c.2 1.4 2.8 2.5 5.9 2.5s5.7-1.1 5.9-2.5l1.9-12.1"/>' +
      '<path d="M9.4 13.2c.8.4 1.7.6 2.6.6"/>',
    key:
      '<circle cx="7.8" cy="16.2" r="4.2"/>' +
      '<path d="m10.8 13.2 9-9"/>' +
      '<path d="m16.6 7.4 2.6 2.6M14.2 9.8l2 2"/>',
    // Stacked chevrons, climbing: one more level of access each time.
    escalate:
      '<path d="m6.4 10.2 5.6-5.6 5.6 5.6"/>' +
      '<path d="m6.4 15.2 5.6-5.6 5.6 5.6"/>' +
      '<path d="m6.4 20.2 5.6-5.6 5.6 5.6"/>',
    cpu:
      '<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="1.8"/>' +
      '<rect x="9.8" y="9.8" width="4.4" height="4.4" rx=".6"/>' +
      '<path d="M9.6 3v3.4M14.4 3v3.4M9.6 17.6V21M14.4 17.6V21M3 9.6h3.4M3 14.4h3.4M17.6 9.6H21M17.6 14.4H21"/>'
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

  // The vertical stroke is its own path so CSS can fold it away: plus
  // becomes minus without swapping markup.
  var PLUS_MINUS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" aria-hidden="true" ' +
      'focusable="false">' +
      '<path d="M5.5 12h13"/>' +
      '<path class="sc-fq__v" d="M12 5.5v13"/>' +
    "</svg>";

  // The three signal lanes, in rail order. Anything else falls back to
  // the first, so a typo never leaves a line uncoloured.
  var LANES = ["posture", "identity", "threat"];

  function lane(l) {
    return LANES.indexOf(l) > -1 ? l : LANES[0];
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
      return '<span class="sc-accent">' + run + "</span>";
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  // Inline index the reveal staggers on.
  function at(i) {
    return ' style="--i:' + i + '"';
  }

  function rootClass(cls) {
    return "sc-shell " + cls + (ANIMATE ? " is-animated" : "");
  }

  /* A full-bleed root, for the sections whose decoration runs edge to
     edge past the measure: the root is the positioned, clipped layer and
     an inner .sc-shell holds the content. */
  function bleedClass(cls) {
    return cls + (ANIMATE ? " is-animated" : "");
  }

  function reducedMotion() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Eyebrow (mono, led by the three-into-one mark), H2, sub. An empty
     eyebrow or sub is dropped rather than left as an empty paragraph. A
     <div>, not a <header>: outside an <article> or <section> a <header>
     is announced as a banner landmark, and nine of those would bury the
     site's real one. */
  function head(o) {
    return (
      '<div class="sc-head' + (o.align === "start" ? " sc-head--start" : "") +
        ' sc-reveal">' +
        (o.eyebrow ? '<p class="sc-eyebrow">' + esc(o.eyebrow) + "</p>" : "") +
        '<h2 class="sc-head__title" id="' + o.id + '">' + markup(o.title) + "</h2>" +
        (o.sub ? '<p class="sc-head__sub">' + esc(o.sub) + "</p>" : "") +
      "</div>"
    );
  }

  /* kind: "primary" (solid blue) or "outline" (ink hairline, for the
     light hero). No href, no button: an empty or "#" link would only
     reload the page. */
  function button(b, kind, placement) {
    if (!b || !b.label || !b.href || b.href === "#") return "";
    return (
      '<a class="sc-btn sc-btn--' + kind + '" href="' + esc(b.href) + '" ' +
        'data-sc-cta="' + placement + '">' +
        '<span class="sc-btn__label">' + esc(b.label) + "</span>" + ARROW +
      "</a>"
    );
  }

  function mount(host, html, cls) {
    host.insertAdjacentHTML("beforeend", html);
    var root = host.querySelector("." + cls);
    if (ANIMATE && root.classList.contains("is-animated")) reveal(root);
    return root;
  }

  /* An in-page link is only worth rendering if something will answer it:
     the target already exists, or the container that builds it is on the
     page. prune() removes any that still point nowhere once the build has
     settled (say the capabilities builder threw). */
  var ANCHOR_HOSTS = { "sc-capabilities": "capabilities" };

  function anchorLive(href) {
    if (!href || href.charAt(0) !== "#") return true;
    var id = href.slice(1);
    if (document.getElementById(id)) return true;
    var key = ANCHOR_HOSTS[id];
    return !!(key && SECTIONS[key] && document.querySelector(SECTIONS[key]));
  }

  function prune() {
    var links = document.querySelectorAll('a[data-sc-cta][href^="#"]');
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute("href").slice(1);
      if (!id || !document.getElementById(id)) {
        links[i].parentNode.removeChild(links[i]);
      }
    }
  }

  /* Runs cb(true) while el is on screen and the tab is in front, and
     cb(false) otherwise: an IntersectionObserver plus visibilitychange,
     so an animation nobody can see costs no frames. */
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

  /* In-page links (#sc-capabilities) glide unless the reader prefers
     reduced motion, in which case the browser's own jump runs untouched.
     Either way the target's scroll-margin keeps its heading clear of a
     sticky header, and focus moves to it, so keyboard users continue
     from there. Delegated from the section root. */
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

  /* ---- 01 · Hero ----------------------------------------------------------
     A split: the copy on a light ground on the left, lined up with every
     other section's content edge; on the right a dark panel that runs to
     the screen's edge and the hero's full height, holding the banner image
     whole (never cropped). Below 1025px the panel drops under the copy,
     edge to edge.

     With no image, or one that fails to load, the panel holds the coded
     "convergence console" instead, the page's idea in miniature: three
     alerts in three lane colours arrive apart, slide together into one
     blue story card, and a guardrail closes it.

     The console is decoration (aria-hidden):
     the H1 and the copy already say all of it. The script only steps
     data-step 0–3 on the stage; siem-cloud.css owns every visual change.
     Its default (no data-step rules) is the final state, which is what
     reduced motion shows.

     The rail joining the rows to the story card needs no measuring: the
     three rows and the card share one grid of equal rows, so each row's
     centre is at a fixed fraction of the stack.
     -------------------------------------------------------------------- */

  // Step lengths (ms): separate, correlated, guarded, hold. Then the
  // console clears for CLEAR_MS and starts over.
  var STEP_MS = [1800, 1800, 1800, 2400];
  var CLEAR_MS = 600;
  // The console's load reveal (300ms delay + 0.7s); the loop waits it out.
  var LOOP_START_MS = 1000;

  // Inline delay for the hero's load stagger.
  function after(ms) {
    return ' style="--d:' + ms + 'ms"';
  }

  function heroConsole(v) {
    var states = v.states || {};

    var tabs = (v.providers || []).map(function (p) {
      return '<span class="sc-hr__tab">' + esc(p) + "</span>";
    }).join("");

    var rows = (v.signals || []).map(function (s, k) {
      return (
        '<span class="sc-hr__row sc-lane--' + lane(s.lane) + '" style="--k:' + k + '">' +
          '<span class="sc-hr__signal">' +
            '<span class="sc-hr__tag">' + esc(s.tag) + "</span>" +
            '<span class="sc-hr__sig-text">' + esc(s.text) + "</span>" +
          "</span>" +
        "</span>"
      );
    }).join("");

    function state(key) {
      return states[key]
        ? '<span class="sc-hr__state sc-hr__state--' + key + '">' + esc(states[key]) + "</span>"
        : "";
    }

    return (
      '<div class="sc-hr__stage" aria-hidden="true">' +
        '<span class="sc-hr__ghost"></span>' +
        '<div class="sc-hr__console">' +
          '<div class="sc-hr__bar">' +
            '<span class="sc-hr__dots"><i></i><i></i><i></i></span>' +
            '<span class="sc-hr__label">' + esc(v.label || "") + "</span>" +
            '<span class="sc-hr__status">' +
              state("separate") + state("correlated") + state("guarded") +
            "</span>" +
          "</div>" +
          (tabs ? '<div class="sc-hr__tabs">' + tabs + "</div>" : "") +
          '<div class="sc-hr__body">' +
            '<div class="sc-hr__stack" style="--n:' + ((v.signals || []).length + 1) + '">' +
              '<span class="sc-hr__spine"></span>' +
              rows +
              '<span class="sc-hr__row sc-hr__row--story">' +
                '<span class="sc-hr__story">' + esc(v.story || "") + "</span>" +
              "</span>" +
            "</div>" +
            (v.guardrail
              ? '<div class="sc-hr__guard">' +
                  '<span class="sc-hr__node">' + icon("check") + "</span>" +
                  '<span class="sc-hr__guard-text">' + esc(v.guardrail) + "</span>" +
                "</div>"
              : "") +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  /* separate → correlated → guarded → hold, then clear and start over.
     Waits for the console's load reveal, stops its timer while the
     console is off screen or the tab is hidden, and never starts under
     reduced motion (the CSS default is the final state). */
  function heroLoop(stage) {
    if (!HERO_LOOP || !stage || reducedMotion()) return;

    var step = 0;
    var timer = null;
    var running = false;
    var ready = false;

    // Starts empty: the rows arrive one by one once step 0 begins.
    stage.classList.add("is-looping");
    stage.classList.add("is-clearing");
    stage.setAttribute("data-step", "0");

    function wait(ms, fn) {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    }

    function show(n) {
      step = n;
      stage.setAttribute("data-step", String(n));
      stage.classList.remove("is-clearing");
      wait(STEP_MS[n], next);
    }

    function next() {
      if (step < STEP_MS.length - 1) {
        show(step + 1);
        return;
      }
      stage.classList.add("is-clearing");
      wait(CLEAR_MS, function () {
        show(0);
      });
    }

    function resume() {
      if (stage.classList.contains("is-clearing")) {
        show(0);
      } else {
        wait(STEP_MS[step], next);
      }
    }

    whileVisible(stage, function (on) {
      if (on === running) return;
      running = on;
      if (!ready) return;
      if (on) {
        resume();
      } else {
        clearTimeout(timer);
      }
    });

    setTimeout(function () {
      ready = true;
      if (running) show(0);
    }, LOOP_START_MS);
  }

  // The banner is the page's largest paint, so it loads eagerly at high
  // priority; width and height are its export size, so phones reserve the
  // right box before it arrives.
  function heroVisual(v) {
    if (v.image) {
      return (
        '<div class="sc-hr__media">' +
          '<img class="sc-hr__img" src="' + esc(v.image) + '" alt="' + esc(v.imageAlt || "") + '" ' +
            'width="1254" height="1254" decoding="async" fetchpriority="high">' +
        "</div>"
      );
    }
    return heroConsole(v);
  }

  function buildHero(host, c) {
    if (!host) return false;                         // container not ready
    if (host.querySelector(".sc-hr")) return true;   // already built

    var v = c.visual || {};
    var title = c.title || [];
    if (typeof title === "string") title = [title];

    var trust = (c.trust || []).map(function (t) {
      return (
        '<li class="sc-hr__trust-item">' +
          '<span class="sc-hr__check">' + icon("check") + "</span>" +
          esc(t) +
        "</li>"
      );
    }).join("");

    // Separate spans for colour and stagger, with real spaces between
    // them so a screen reader reads one sentence.
    var lines = title.map(function (line, i) {
      return (
        '<span class="sc-hr__line sc-hr__line--' + (i + 1) + ' sc-hr__in"' +
          after(80 * (i + 1)) + ">" + esc(line) +
        "</span>"
      );
    }).join(" ");

    var second = c.ctaSecondary || {};
    var actions = button(c.cta, "primary", "hero-primary") +
                  (anchorLive(second.href) ? button(second, "outline", "hero-secondary") : "");

    var root = mount(
      host,
      '<div class="' + bleedClass("sc-hr") + (v.image ? " sc-hr--image" : "") + '">' +
        '<div class="sc-shell sc-hr__inner">' +
          '<div class="sc-hr__copy">' +
            (c.eyebrow
              ? '<p class="sc-eyebrow sc-hr__eyebrow sc-hr__in"' + after(0) + ">" + esc(c.eyebrow) + "</p>"
              : "") +
            '<h1 class="sc-hr__title">' + lines + "</h1>" +
            (c.sub ? '<p class="sc-hr__sub sc-hr__in"' + after(320) + ">" + esc(c.sub) + "</p>" : "") +
            (actions
              ? '<div class="sc-hr__actions sc-hr__in"' + after(400) + ">" + actions + "</div>"
              : "") +
            (trust
              ? '<ul class="sc-hr__trust sc-hr__in"' + after(480) + ">" + trust + "</ul>"
              : "") +
          "</div>" +
          '<div class="sc-hr__visual">' +
            // Seen only around the console (the image covers it).
            '<div class="sc-hr__decor" aria-hidden="true">' +
              '<span class="sc-hr__dots-bg"></span>' +
              '<span class="sc-hr__glow sc-hr__glow--posture"></span>' +
              '<span class="sc-hr__glow sc-hr__glow--identity"></span>' +
              '<span class="sc-hr__glow sc-hr__glow--threat"></span>' +
              '<span class="sc-hr__glow sc-hr__glow--story"></span>' +
            "</div>" +
            heroVisual(v) +
          "</div>" +
        "</div>" +
      "</div>",
      "sc-hr"
    );

    // Artwork that fails to load gives way to the coded console, so the
    // column is never a broken-image icon.
    var img = root.querySelector(".sc-hr__img");
    if (img) {
      img.addEventListener("error", function () {
        var media = root.querySelector(".sc-hr__media");
        if (!media) return;
        media.insertAdjacentHTML("afterend", heroConsole(v));
        media.parentNode.removeChild(media);
        root.classList.remove("sc-hr--image");
        heroLoop(root.querySelector(".sc-hr__stage"));
      });
    }

    heroLoop(root.querySelector(".sc-hr__stage"));
    bindAnchors(root);
    return true;
  }

  /* ---- 02 · The challenge -------------------------------------------------
     Copy on the left; on the right the four pain points as four small
     console windows that refuse to line up, the picture of "juggling
     separate consoles". Each card's offset and tilt are inline custom
     properties from SCATTER, so the CSS can drop them on phones and
     under reduced motion. The chrome dot names the signal: amber
     posture, teal identity, a neutral grey, and a hollow ring for SaaS
     (no signal at all: you cannot see into it).
     -------------------------------------------------------------------- */
  var DOTS = { posture: true, identity: true, neutral: true, hollow: true };

  function buildChallenge(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-ch")) return true;

    var body = (c.body || []).map(function (p, i) {
      return '<p class="sc-ch__p' + (i === 0 ? " sc-ch__p--lead" : "") + '">' + esc(p) + "</p>";
    }).join("");

    var items = (c.items || []).map(function (it, i) {
      var s = SCATTER[i % SCATTER.length];
      var dot = DOTS[it.dot] ? it.dot : "neutral";
      return (
        '<li class="sc-ch__item" style="--i:' + (i + 1) + ";--dx:" + s.dx + "px;--dy:" + s.dy +
          "px;--rot:" + s.rot + 'deg">' +
          '<div class="sc-ch__win">' +
            '<div class="sc-ch__chrome">' +
              '<span class="sc-ch__dot sc-ch__dot--' + dot + '" aria-hidden="true"></span>' +
              '<h3 class="sc-ch__title">' + esc(it.title) + "</h3>" +
            "</div>" +
            '<p class="sc-ch__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("sc-ch") + '">' +
        '<div class="sc-ch__decor" aria-hidden="true"></div>' +
        '<div class="sc-shell sc-ch__inner">' +
          '<div class="sc-ch__lede">' +
            head({ id: "sc-challenge-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
            (body ? '<div class="sc-ch__body sc-reveal"' + at(1) + ">" + body + "</div>" : "") +
          "</div>" +
          (items ? '<ul class="sc-ch__windows">' + items + "</ul>" : "") +
        "</div>" +
      "</div>",
      "sc-ch"
    );

    return true;
  }

  /* ---- 03 · Platform overview ---------------------------------------------
     The signature section. Four steps on one rail, and the rail is the
     story: from Connect, three thin lines in the lane colours run side by
     side; at Ingest & Correlate they merge, and one blue line carries on
     through Detect and Respond.

     Every piece of the rail belongs to the step it leaves from, sized off
     the step's own box and the list gap (--sc-pf-gap), so the same markup
     lays out across (≥1100px) or down (<1100px) with no measuring. Step 1
     carries the three lanes, the merge (one small SVG per orientation)
     and the lane labels; steps 2 and 3 carry the blue segment to the next
     node. The nodes sit on top with a solid fill, so segments can run
     centre to centre beneath them.

     --t is when the line reaches each node, so the node lights then.
     -------------------------------------------------------------------- */
  // Seconds: the lanes draw first (0–0.6s), merge by 0.8s, then the blue
  // line spends 0.45s on each later segment.
  function arrival(i) {
    return i === 0 ? 0 : Math.round((0.85 + (i - 1) * 0.45) * 100) / 100;
  }

  function railLanes(labels) {
    var lanes = "";
    var tags = "";

    LANES.forEach(function (l, k) {
      lanes += '<span class="sc-pf__lane sc-lane--' + l + '" style="--k:' + k + '"></span>';
      if (labels[k]) {
        tags += '<span class="sc-pf__tag sc-lane--' + l + '">' + esc(labels[k]) + "</span>";
      }
    });

    // Two merges, one per orientation; the CSS shows one. Each lane's
    // stroke reads --sc-lane from its own class.
    var mergeH =
      '<svg class="sc-pf__merge sc-pf__merge--h" viewBox="0 0 28 16" focusable="false">' +
        '<path class="sc-lane--posture" d="M0 2c14 0 14 6 28 6"/>' +
        '<path class="sc-lane--identity" d="M0 8h28"/>' +
        '<path class="sc-lane--threat" d="M0 14c14 0 14-6 28-6"/>' +
      "</svg>";
    var mergeV =
      '<svg class="sc-pf__merge sc-pf__merge--v" viewBox="0 0 16 22" focusable="false">' +
        '<path class="sc-lane--posture" d="M2 0c0 11 6 11 6 22"/>' +
        '<path class="sc-lane--identity" d="M8 0v22"/>' +
        '<path class="sc-lane--threat" d="M14 0c0 11-6 11-6 22"/>' +
      "</svg>";

    return (
      '<span class="sc-pf__lanes" aria-hidden="true">' +
        lanes + mergeH + mergeV +
        (tags ? '<span class="sc-pf__tags">' + tags + "</span>" : "") +
      "</span>"
    );
  }

  function buildPlatform(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-pf")) return true;

    var steps = c.steps || [];
    var n = steps.length;

    var items = steps.map(function (s, i) {
      var rail = "";
      if (i < n - 1) {
        rail = i === 0
          ? railLanes(c.lanes || [])
          : '<span class="sc-pf__line" aria-hidden="true"></span>';
      }
      return (
        '<li class="sc-pf__step sc-pf__step--' + (i + 1) + (i === n - 1 ? " sc-pf__step--end" : "") +
          '" style="--i:' + i + ";--t:" + arrival(i) + 's">' +
          rail +
          '<span class="sc-pf__node" aria-hidden="true">' +
            '<span class="sc-pf__num">' + pad(i + 1) + "</span>" +
          "</span>" +
          '<div class="sc-pf__body sc-reveal"' + at(i + 2) + ">" +
            '<h3 class="sc-pf__title">' + esc(s.title) + "</h3>" +
            '<p class="sc-pf__text">' + esc(s.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("sc-pf") + '">' +
        '<div class="sc-pf__decor" aria-hidden="true"></div>' +
        '<div class="sc-shell sc-pf__inner">' +
          head({ id: "sc-platform-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub }) +
          (items ? '<ol class="sc-pf__steps" style="--n:' + n + '">' + items + "</ol>" : "") +
        "</div>" +
      "</div>",
      "sc-pf"
    );

    return true;
  }

  /* ---- 04 · Key capabilities ----------------------------------------------
     A control matrix, not nine floating cards: one white panel split by
     1px hairlines into a 3×3 grid (2 columns with the ninth spanning both
     on tablets, 1 on phones). The root carries id="sc-capabilities", the
     hero's "Tour All Features" target; tabindex="-1" lets that link move
     focus here as well as scroll. The cells are static, so their hover is
     a tint only: no lift, no pointer.
     -------------------------------------------------------------------- */
  function buildCapabilities(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-cp")) return true;

    var cells = (c.items || []).map(function (it, i) {
      var id = it.slug ? ' id="sc-cap-' + esc(it.slug) + '"' : "";
      return (
        '<li class="sc-cp__item">' +
          '<article class="sc-cp__cell sc-reveal"' + id + at(i + 1) + ">" +
            '<div class="sc-cp__top">' +
              '<span class="sc-cp__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
              '<span class="sc-cp__icon">' + icon(it.icon) + "</span>" +
            "</div>" +
            '<h3 class="sc-cp__title">' + esc(it.title) + "</h3>" +
            '<p class="sc-cp__text">' + esc(it.text) + "</p>" +
          "</article>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("sc-cp") + '" id="sc-capabilities" tabindex="-1">' +
        head({ id: "sc-capabilities-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        (cells
          ? '<div class="sc-cp__panel"><ul class="sc-cp__grid">' + cells + "</ul></div>"
          : "") +
      "</div>",
      "sc-cp"
    );

    return true;
  }

  /* ---- 05 · Coverage ------------------------------------------------------
     A service manifest: six groups, each a short blue tab marker, the
     group name and either a row of mono service chips or the copy's own
     sentence. The chips are a nested list, so a screen reader announces
     how many services each provider has. Provider names stay plain text:
     no logos, no brand colours. Two columns at ≥960px fill down first,
     so the three clouds sit together on the left.
     -------------------------------------------------------------------- */
  function buildCoverage(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-cv")) return true;

    var items = (c.items || []).map(function (it, i) {
      var detail = "";
      if (it.chips && it.chips.length) {
        detail =
          '<ul class="sc-cv__chips">' +
            it.chips.map(function (chip) {
              return '<li class="sc-cv__chip">' + esc(chip) + "</li>";
            }).join("") +
          "</ul>";
      } else if (it.text) {
        detail = '<p class="sc-cv__text">' + esc(it.text) + "</p>";
      }
      return (
        '<li class="sc-cv__item sc-reveal"' + at(i + 1) + ">" +
          '<h3 class="sc-cv__title">' + esc(it.title) + "</h3>" +
          detail +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("sc-cv") + '">' +
        head({ id: "sc-coverage-title", eyebrow: c.eyebrow, title: c.title }) +
        (items
          ? '<ul class="sc-cv__list" style="--rows:' + Math.ceil((c.items || []).length / 2) + '">' +
              items +
            "</ul>"
          : "") +
      "</div>",
      "sc-cv"
    );

    return true;
  }

  /* ---- 06 · Use cases -----------------------------------------------------
     Dark cards, each topped by a 2px line in its lane colour: by now the
     reader knows the code, so the lane needs no label (and the colour is
     decoration, not information). Static, so no lift.
     -------------------------------------------------------------------- */
  function buildUsecases(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-uc")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="sc-uc__item sc-reveal"' + at(i + 1) + ">" +
          '<div class="sc-uc__card sc-lane--' + lane(it.lane) + '">' +
            '<span class="sc-uc__icon">' + icon(it.icon) + "</span>" +
            '<h3 class="sc-uc__title">' + esc(it.title) + "</h3>" +
            '<p class="sc-uc__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("sc-uc") + '">' +
        '<div class="sc-uc__decor" aria-hidden="true"></div>' +
        '<div class="sc-shell sc-uc__inner">' +
          head({ id: "sc-usecases-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          (items ? '<ul class="sc-uc__grid">' + items + "</ul>" : "") +
        "</div>" +
      "</div>",
      "sc-uc"
    );

    return true;
  }

  /* ---- 07 · Business impact -----------------------------------------------
     An outcome ledger: editorial rows under hairlines, no cards and no
     icons. On wide screens the index sits on its own grid row so the
     title and the text share the next one and align on their first
     baseline.
     -------------------------------------------------------------------- */
  function buildImpact(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-im")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="sc-im__row sc-reveal"' + at(i + 1) + ">" +
          '<span class="sc-im__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<h3 class="sc-im__title">' + esc(it.title) + "</h3>" +
          '<p class="sc-im__text">' + esc(it.text) + "</p>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("sc-im") + '">' +
        head({ id: "sc-impact-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        (items ? '<ol class="sc-im__list">' + items + "</ol>" : "") +
      "</div>",
      "sc-im"
    );

    return true;
  }

  /* ---- 08 · Why CybrHawk --------------------------------------------------
     A bento: the first differentiator is the dark anchor card, and its
     icon is a small static replay of the page's motif (three lane lines
     merging into one blue line that ends in a node). The other four are
     white cards with an icon badge.
     -------------------------------------------------------------------- */
  var MINI_DIAGRAM =
    '<svg class="sc-wy__diagram" viewBox="0 0 240 60" preserveAspectRatio="xMinYMid meet" ' +
      'aria-hidden="true" focusable="false">' +
      '<path class="sc-lane--posture" d="M2 14h70c30 0 30 16 60 16"/>' +
      '<path class="sc-lane--identity" d="M2 30h130"/>' +
      '<path class="sc-lane--threat" d="M2 46h70c30 0 30-16 60-16"/>' +
      '<path class="sc-wy__diagram-story" d="M132 30h86"/>' +
      '<circle class="sc-wy__diagram-node" cx="226" cy="30" r="7"/>' +
    "</svg>";

  function buildWhy(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-wy")) return true;

    var items = (c.items || []).map(function (it, i) {
      var anchor = i === 0;
      var area = "abcde".charAt(i) || "";
      return (
        '<li class="sc-wy__item' + (area ? " sc-wy__item--" + area : "") + ' sc-reveal"' + at(i + 1) + ">" +
          '<div class="sc-wy__card' + (anchor ? " sc-wy__card--anchor" : "") + '">' +
            (!anchor && it.icon ? '<span class="sc-wy__icon">' + icon(it.icon) + "</span>" : "") +
            '<h3 class="sc-wy__title">' + esc(it.title) + "</h3>" +
            '<p class="sc-wy__text">' + esc(it.text) + "</p>" +
            (anchor ? MINI_DIAGRAM : "") +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("sc-wy") + '">' +
        head({ id: "sc-why-title", eyebrow: c.eyebrow, title: c.title }) +
        (items ? '<ul class="sc-wy__grid">' + items + "</ul>" : "") +
      "</div>",
      "sc-wy"
    );

    return true;
  }

  /* ---- 09 · FAQ -----------------------------------------------------------
     The UDC accordion: each question is a real <button> in an <h3>, so
     Enter and Space work without key handling, and each answer is a
     labelled region carrying `hidden` while closed. Items open
     independently. Ends on white with its normal bottom padding: the
     site's closing CTA component follows directly.
     -------------------------------------------------------------------- */
  function buildFaq(host, c) {
    if (!host) return false;
    if (host.querySelector(".sc-fq")) return true;

    var list = c.items || [];

    var items = list.map(function (it, i) {
      var q = "sc-faq-q-" + (i + 1);
      var a = "sc-faq-a-" + (i + 1);

      return (
        '<div class="sc-fq__item sc-reveal"' + at(i + 1) + ">" +
          '<h3 class="sc-fq__q">' +
            '<button type="button" class="sc-fq__btn" id="' + q + '" ' +
              'aria-expanded="false" aria-controls="' + a + '">' +
              '<span class="sc-fq__q-text">' + esc(it.q) + "</span>" +
              '<span class="sc-fq__icon">' + PLUS_MINUS + "</span>" +
            "</button>" +
          "</h3>" +
          '<div class="sc-fq__a" id="' + a + '" role="region" ' +
            'aria-labelledby="' + q + '" hidden>' +
            "<p>" + esc(it.a) + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("sc-fq") + '">' +
        head({ id: "sc-faq-title", eyebrow: c.eyebrow, title: c.title }) +
        '<div class="sc-fq__list">' + items + "</div>" +
      "</div>",
      "sc-fq"
    );

    if (c.schema) faqSchema(root, list);
    bindFaq(root);
    return true;
  }

  /* FAQPage structured data from the same CONTENT, as plain text. It
     lives inside the section root, so the builder's own "already built"
     check keeps it to one copy. "<" is escaped so no answer can close
     the script element early. */
  function faqSchema(root, list) {
    if (root.querySelector('script[type="application/ld+json"]')) return;

    var data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: list.map(function (it) {
        return {
          "@type": "Question",
          name: String(it.q),
          acceptedAnswer: { "@type": "Answer", text: String(it.a) }
        };
      })
    };

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data).replace(/</g, "\\u003c");
    root.appendChild(script);
  }

  // Delegated from the section root, so it keeps working if items change.
  function bindFaq(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".sc-fq__btn");
      if (!btn || !root.contains(btn)) return;

      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");

      if (open) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    });
  }

  /* ---- Build ------------------------------------------------------------ */
  var BUILDERS = [
    ["hero", buildHero],
    ["challenge", buildChallenge],
    ["platform", buildPlatform],
    ["capabilities", buildCapabilities],
    ["coverage", buildCoverage],
    ["usecases", buildUsecases],
    ["impact", buildImpact],
    ["why", buildWhy],
    ["faq", buildFaq]
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
          container.classList.add("sc-section");
          if (DARK[key]) container.classList.add("sc-section--dark");
        }
        if (!b[1](host, CONTENT[key] || {})) {
          done = false;                              // container not ready
          return;
        }
      } catch (err) {
        // A builder that throws would throw again on every DOM change, so
        // it is logged once and not retried; the others carry on.
        if (window.console) {
          console.error("SIEM Cloud: the " + key + " section failed to build.", err);
        }
      }

      settled[key] = true;
    });

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

  // Runs once the build is over, finished or timed out.
  function settle() {
    try {
      prune();
    } catch (err) {
      if (window.console) console.error("SIEM Cloud: anchor check failed.", err);
    }
  }

  function init() {
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
