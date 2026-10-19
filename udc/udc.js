/* =====================================================================
   CybrHawk — Unified Cyber Defense (UCD) solution page, sections 1–12
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects each
   section's markup into its own empty container and pairs with udc.css.
   Section 13, the closing call to action, is the site's existing CTA
   component and is not built here.

   One container per section, in page order, each set to Full Width with
   padding 0 and no background, its class in the CSS Classes field:

     ucd-hero        ucd-trust       ucd-problem     ucd-capabilities
     ucd-how         ucd-outcomes    ucd-soc-models  ucd-nist
     ucd-regulatory  ucd-industries  ucd-solutions   ucd-faq

   On build each container also gets `ucd-section`, which carries the
   shared tokens, so editors only ever type the one class. A missing
   container skips only its own section, and an error in one builder is
   logged without stopping the others.

   If a live class differs, change SECTIONS below — they are the only
   selectors this file touches (udc.css is scoped to the same classes,
   so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = {
    hero: ".ucd-hero",
    trust: ".ucd-trust",
    problem: ".ucd-problem",
    capabilities: ".ucd-capabilities",
    how: ".ucd-how",
    outcomes: ".ucd-outcomes",
    socModels: ".ucd-soc-models",
    nist: ".ucd-nist",
    regulatory: ".ucd-regulatory",
    industries: ".ucd-industries",
    solutions: ".ucd-solutions",
    faq: ".ucd-faq"
  };

  /* ---- Content (edit freely) -----------------------------------------

     Every string a reader sees lives here; the builders hard-code none.
     In any title, "\n" becomes a line break and [[double brackets]] set
     that run in the accent colour. An empty eyebrow is not rendered.

     Icons are named per item; the glyphs are in ICONS further down.
     -------------------------------------------------------------------- */
  var CONTENT = {

    hero: {
      eyebrow: "Solution 01 · Unified Cyber Defense",
      title: "One platform. Unified defense. [[Autonomous.]]",
      lead: "AI-powered detection and response across your endpoints, network, cloud, identities and industrial systems, with security experts watching 24/7.",
      body: "CybrHawk UCD brings your security operation into one place: an AI SOC, SIEM and XDR, identity and OT protection, cloud detection, exposure management and AI agents, connected to the tools you already run.",
      tagline: "Detect. Defend. Respond. All in one.",
      cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
      // TODO: confirm the target for the architect button.
      ctaSecondary: { label: "Speak to a Security Architect", href: "https://cybrhawk.com/contact/" },
      proof: [
        "24/7 SOC and incident response",
        "AI plus human analysts",
        "IT, cloud, identity and OT in one view",
        "Broad integrations"
      ],
      // Labels come from the lead. image "" keeps the built-in illustration.
      visual: {
        core: "UCD",
        caption: "Unified Cyber Defense",
        nodes: [
          { icon: "endpoint", label: "Endpoints" },
          { icon: "network",  label: "Network" },
          { icon: "cloud",    label: "Cloud" },
          { icon: "identity", label: "Identity" },
          { icon: "ot",       label: "OT" }
        ],
        image: "",
        imageAlt: ""
      }
    },

    trust: {
      label: "Certifications and assurance",   // aria-label only, not shown
      // image: optional badge artwork URL; "" uses the icon.
      items: [
        { icon: "shield-check", label: "SOC 2 Type II", image: "" },
        { icon: "award",        label: "ISO-certified", image: "" },
        { icon: "file-check",   label: "HIPAA-compliant", image: "" },
        { icon: "lock",         label: "ITAR-certified", image: "" },
        { icon: "crosshair",    label: "Independently penetration tested", image: "" }
      ]
    },

    problem: {
      eyebrow: "The enterprise problem",
      title: "Complexity is the attacker's advantage.",
      intro: "Large organisations rarely lack security tools. They lack one trustworthy picture. Endpoint, network, cloud, identity and operational-technology alerts sit in separate consoles, owned by separate teams, escalated on separate clocks. Attackers cross all of those boundaries in one campaign. Defenders often can't.",
      // lead is set in <strong>; lead + " " + text is the original sentence.
      points: [
        { icon: "hourglass", lead: "Dwell time grows", text: "when weak signals in different tools never become one story." },
        { icon: "alerts",    lead: "Analysts drown",   text: "in alerts instead of hunting." },
        { icon: "timer",     lead: "Regulatory clocks run in hours and days.", text: "If you can't scope an incident quickly, you can't report it credibly." }
      ],
      resolution: {
        lead: "UCD removes the seams.",
        text: "Telemetry from every layer is collected, correlated and acted on in one place, by AI and by accountable experts."
      }
    },

    capabilities: {
      eyebrow: "What's inside UCD",
      title: "Eight capabilities. [[One defense.]]",
      // Numbered 01–08 from the array order. full: "" hides the expanded name.
      // image: square artwork URL, shown beside the title (prompts and export
      // sizes in capability-image-prompts.md). "" or a URL that fails to load
      // shows the icon in the same tile instead.
      items: [
        {
          slug: "ai-soc", icon: "soc", title: "AI SOC", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/AI-Analytics-Dashboard-Hub.webp",
          text: "An autonomous SOC that pairs AI-driven triage with human analysts, running 24×7×365. Alerts are investigated and prioritised automatically; analysts and threat hunters handle what needs judgement. A customer portal gives you cases, evidence and approvals in one place, and executive dashboards track detection and response times, monitoring coverage and risk by business unit."
        },
        {
          slug: "siem-xdr", icon: "layers", title: "SIEM / XDR", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Glowing-Data-Network-Platform.webp",
          text: "A cloud-native extended detection and response platform that ingests and correlates data from endpoints, servers, firewalls, applications, SaaS platforms and user activity, structured and unstructured. Behaviour-based anomaly detection, machine learning and threat intelligence drive automatic scoring and triage. Rules, dashboards and playbooks are customisable, and reporting supports NIST, HIPAA and GDPR requirements. Network detection and response (NDR) sensors extend visibility to traffic that endpoint tools never see."
        },
        {
          slug: "itdr", icon: "identity", title: "ITDR", full: "Identity Threat Detection & Response",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Shielded-Digital-Identity-Security.webp",
          text: "Identity is the main attack path. UCD baselines normal behaviour across cloud, hybrid and on-premises environments and flags deviation: credential stuffing and brute force, impossible travel, session hijacking and token replay, privilege escalation, MFA fatigue and bypass. Every identity carries a dynamic risk score, and responses can be automatic: end sessions, suspend accounts, force credential resets or require step-up authentication. Privileged access monitoring adds extra scrutiny to your most powerful accounts."
        },
        {
          slug: "ot-security", icon: "factory", title: "OT Security", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Futuristic-IoT-Factory-Under-Glass-Dome.webp",
          text: "A dedicated OT SOC for industrial environments, covering PLCs, SCADA, HMIs, engineering workstations and the networks that connect them. Behavioural analytics with industrial context, continuous asset and traffic visibility, and triage that ranks alerts by operational impact, not just technical severity."
        },
        {
          slug: "cdr", icon: "cloud-shield", title: "CDR", full: "Cloud Detection & Response",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Secure-Cloud-Network-Platform.webp",
          text: "Continuous monitoring of cloud workloads and cloud-delivered services, correlated with identity, endpoint and network activity. Microsoft 365 and Entra ID monitoring are supported through CybrHawk's endpoint and cloud integrations."
        },
        {
          slug: "exposure-management", icon: "crosshair", title: "Exposure Management", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Isometric-Network-Analytics-Target.webp",
          text: "Know what an attacker can reach and fix what matters first. UCD aggregates findings from scanners, penetration tests and threat intelligence, prioritises them by severity, exploitability and asset value, plans remediation step by step, and validates fixes by retesting. Your team can run it, or CybrHawk can work alongside you or remediate directly."
        },
        {
          slug: "ai-agents", icon: "bot", title: "AI Agents", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/AI-Workflow-to-Secure-Approval.webp",
          text: "Automation that does the repetitive work. Once a threat is validated, predefined playbooks run automatically: isolate affected assets, block malicious IPs and domains, notify teams through chat or ticketing tools, and open the investigation, with human approval wherever you want it."
        },
        {
          slug: "integrations", icon: "plug", title: "Broad Integrations", full: "",
          image: "https://cybrhawk.com/wp-content/uploads/2026/10/Connected-Systems-Hub.webp",
          text: "UCD is vendor-agnostic. It connects to the security and IT tooling you already have, including SIEM and SOAR systems, rather than demanding a rip-and-replace."
        }
      ]
    },

    how: {
      eyebrow: "How UCD works",
      title: "One continuous loop, from telemetry to [[contained incident.]]",
      // First letters capitalised now that each step stands alone (the only edit).
      steps: [
        { icon: "radar",      title: "Sense",     text: "Collect and normalise telemetry from every layer, plus external threat intelligence." },
        { icon: "link",       title: "Correlate", text: "Link weak signals across layers into scored, high-confidence incidents." },
        { icon: "decide",     title: "Decide",    text: "AI clears the noise; analysts investigate what matters with full context." },
        { icon: "bolt",       title: "Act",       text: "Playbooks contain the threat, with human approval where required." },
        { icon: "file-check", title: "Prove",     text: "Root-cause analysis, timeline and recommendations after every incident, plus dashboards and compliance scorecards." }
      ]
    },

    outcomes: {
      eyebrow: "What you get",
      title: "See everything. Detect early. Respond fast. [[Stay resilient.]]",
      items: [
        { icon: "eye",            title: "See everything.", text: "IT, cloud, identity and industrial systems in one view, with no blind spots between teams." },
        { icon: "pulse",          title: "Detect early.",   text: "Behavioural analytics and correlation surface the weak signals that become breaches." },
        { icon: "bolt",           title: "Respond fast.",   text: "Automated playbooks and 24/7 analysts contain threats while they're still small." },
        { icon: "shield-refresh", title: "Stay resilient.", text: "Root-cause reviews and hardening recommendations keep each incident from repeating." }
      ],
      quote: "Protect critical infrastructure. Preserve operational continuity."
    },

    socModels: {
      eyebrow: "",
      title: "Choose your SOC model",
      labels: { how: "How it works", coverage: "Coverage", bestFor: "Best for" },
      // image: 3:2 landscape artwork across the top of the card (prompts and
      // export sizes in soc-model-image-prompts.md). "" or a URL that fails
      // to load shows the icon in the same panel instead.
      models: [
        { name: "Virtual SOC", how: "Analysts engage when a critical alert or incident occurs", coverage: "On demand", bestFor: "Teams needing expert backup",
          icon: "headset", image: "https://cybrhawk.com/wp-content/uploads/2026/10/vnerutm8bo6z1zy9qfjw.webp" },
        { name: "Co-managed SOC", how: "Semi-dedicated CybrHawk analysts work alongside your team", coverage: "8×5", bestFor: "Organisations with a daytime security team",
          icon: "link", image: "https://cybrhawk.com/wp-content/uploads/2026/10/vvhmpqw0dmysfw0lks5z.webp" },
        { name: "Dedicated SOC", how: "Dedicated staff and technology aligned to your organisation", coverage: "24/7", bestFor: "Enterprises needing a private, always-on capability",
          icon: "lock", image: "https://cybrhawk.com/wp-content/uploads/2026/10/tny4qnfpqj2v5xer8sky.webp" },
        { name: "Fusion SOC", how: "Threat intelligence, incident response and OT security operate together", coverage: "24/7", bestFor: "Complex, regulated or industrial environments",
          icon: "layers", image: "https://cybrhawk.com/wp-content/uploads/2026/10/kssjwabg416zju55mmnh.webp" },
        { name: "Autonomous SOC & Command Center", how: "AI triage with human analysts, customer portal, executive dashboards", coverage: "24×7×365", bestFor: "Scale without growing headcount",
          icon: "dashboard", image: "https://cybrhawk.com/wp-content/uploads/2026/10/mrg8eggqijiwqeqkocuq.webp" }
      ]
    },

    nist: {
      eyebrow: "",
      title: "Mapped to NIST CSF 2.0",
      functions: [
        { code: "GV", name: "Govern",   capabilities: ["Executive dashboards", "compliance scorecards", "risk by business unit"] },
        { code: "ID", name: "Identify", capabilities: ["Exposure management", "OT asset visibility", "cloud and identity inventory"] },
        { code: "PR", name: "Protect",  capabilities: ["ITDR controls", "privileged access monitoring", "remediation and validation"] },
        { code: "DE", name: "Detect",   capabilities: ["SIEM / XDR", "NDR", "CDR", "ITDR", "OT SOC", "24/7 AI SOC"] },
        { code: "RS", name: "Respond",  capabilities: ["AI Agents playbooks", "analyst-led containment", "incident response"] },
        { code: "RC", name: "Recover",  capabilities: ["Root-cause analysis", "hardening recommendations", "guided recovery"] }
      ]
      // Lower-case chips are as written. You may capitalise the first letter in CSS (::first-letter) for consistency; don't change the source text.
    },

    regulatory: {
      eyebrow: "",
      title: "Built for the regulatory clock",
      columns: ["Regime", "Applies to", "Key timelines"],
      // [[…]] only highlights; the wording is legal copy, so keep it exact.
      rows: [
        { regime: "SEC Form 8-K, Item 1.05", appliesTo: "US public companies",
          timelines: "Within [[four business days]] of determining an incident is material" },
        { regime: "NIS2 (EU)", appliesTo: "Essential and important entities",
          timelines: "Early warning within [[24 hours]]; notification at [[72 hours]]; final report within [[one month]]" },
        { regime: "DORA (EU)", appliesTo: "Financial entities",
          timelines: "Initial notice within [[4 hours]] of classifying a major incident, and no later than [[24 hours]] after awareness; intermediate report within [[72 hours]]; final report within [[one month]]" }
      ],
      note: {
        text: "Fast scoping, forensic evidence and a defensible audit trail give your legal, risk and executive teams the facts they need.",
        strong: "Obligations remain yours; UCD helps you meet the clock."
      }
    },

    industries: {
      eyebrow: "",
      title: "Industries we serve",
      items: [
        { icon: "factory",    label: "Manufacturing" },
        { icon: "derrick",    label: "Oil & Gas" },
        { icon: "pylon",      label: "Utilities" },
        { icon: "droplet",    label: "Water" },
        { icon: "bolt",       label: "Power Generation" },
        { icon: "truck",      label: "Transportation" },
        { icon: "medical",    label: "Healthcare" },
        { icon: "city",       label: "Smart Cities" },
        { icon: "bank",       label: "Government" },
        { icon: "coins",      label: "Financial Services" },
        { icon: "graduation", label: "Education" }
      ],
      more: "And more"
    },

    solutions: {
      eyebrow: "Part of CybrHawk's five solutions",
      title: "UCD is the core. [[Four more extend it.]]",
      hub: { icon: "shield", num: "01", name: "UCD", caption: "Unified Cyber Defense" },
      // href "" renders the card as a non-link.
      items: [
        { icon: "globe", num: "02", name: "HawkINT",
          focus: "Threat intelligence: dark web, credential exposure, brand monitoring, takedowns",
          tagline: "Know the threat before it reaches you.",
          href: "https://cybrhawk.com/ai-powered-threat-intelligence-platform/" },
        { icon: "crosshair", num: "03", name: "HawkStrike",
          focus: "Offensive security: autonomous pen testing, continuous testing, red team",
          tagline: "Think like an attacker. Strike before they do.",
          href: "" },   // TODO: HawkStrike page URL
        { icon: "dashboard", num: "04", name: "HawkOps",
          focus: "Enterprise operations intelligence: AI agents, workflow and decision intelligence",
          tagline: "Turn enterprise operations into actionable intelligence.",
          href: "https://cybrhawk.com/enterprise-operations-intelligence/" },
        { icon: "headset", num: "05", name: "Cybersecurity Services",
          focus: "24/7 managed SOC, incident response and forensics, assessments, compliance readiness",
          tagline: "Expertise when and where your organisation needs it.",
          href: "" }    // TODO: Cybersecurity Services page URL
      ],
      link: { label: "Explore all five solutions", href: "" }   // TODO: URL; hidden while ""
    },

    faq: {
      eyebrow: "",
      title: "FAQ",
      items: [
        { q: "Do we have to replace our existing tools?",
          a: "No. UCD is vendor-agnostic and integrates with existing tooling." },
        { q: "Can you cover OT and industrial systems, not just IT?",
          a: "Yes. A dedicated OT SOC monitors industrial environments with operational-impact triage, alongside IT and cloud." },
        // TODO: flagged (⚑) for review in the copy doc. Confirm before launch.
        { q: "How does AI fit in, and who stays in control?",
          a: "AI handles triage, correlation and playbook execution. Analysts review what matters, and the customer portal gives you approvals and a full record of actions." },
        { q: "Can we keep control of our own SOC?",
          a: "Yes. Choose a co-managed model, or run the platform yourselves and call on CybrHawk for guidance and escalation." },
        { q: "What happens during an active incident?",
          a: "CybrHawk's incident response team engages around the clock, contains the threat, runs forensics with documented evidence handling, eradicates persistence, and delivers a root-cause report." },
        { q: "Where do we start?",
          a: "A posture assessment and a live walkthrough tailored to your environment." }
      ]
    }
  };

  // Fade/rise each section's content in as it scrolls into view.
  var ANIMATE = true;

  // Signals travelling into the hero core, and its soft pulse. Paused off
  // screen and in a background tab; never runs under reduced motion.
  var HERO_MOTION = true;

  // Faint orb and dot fields behind the hero. false drops them.
  var DECOR = true;

  // 64×4 accent bar above every section header.
  var HEAD_BAR = true;
  /* -------------------------------------------------------------------- */

  /* ---- Icons ------------------------------------------------------------
     24×24 strokes that follow currentColor. Glyphs shared with other
     sections are copied as-is so the same idea reads the same everywhere:
     the solution badges from five-solution-cards.js, the industries from
     use-cases.js, `bolt` from landscape.js and the document outline from
     how-it-works.js. The rest are drawn to the same grid and weight.
     -------------------------------------------------------------------- */
  var ICONS = {
    // Solution badges
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

    // Industries
    bank:
      '<path d="M3 9.5 12 4l9 5.5"/>' +
      '<path d="M5.4 10.4V17M9.8 10.4V17M14.2 10.4V17M18.6 10.4V17"/>' +
      '<path d="M3.4 20h17.2"/>',
    factory:
      '<path d="M2.8 20.2h18.4"/>' +
      '<path d="M4 20V9.6l5.2 3.4V9.6l5.2 3.4V5.4h3.2L19 20"/>' +
      '<path d="M7.4 16.6h1.4M12.6 16.6H14"/>',
    derrick:
      '<path d="M7.6 19.4 11 4.6h2l3.4 14.8"/>' +
      '<path d="M9.1 13h5.8M9.8 9.4h4.4"/>' +
      '<path d="M4.6 19.4h14.8"/>',
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
    droplet:
      '<path d="M12 3.2c3.2 4 5.8 7.4 5.8 10.8a5.8 5.8 0 0 1-11.6 0c0-3.4 2.6-6.8 5.8-10.8z"/>',
    bolt:
      '<path d="M13.4 2.8 4.9 13.5h6.1L10.6 21.2l8.5-10.7h-6.1z"/>',
    truck:
      '<path d="M2.6 5.6h11.2v10H2.6z"/>' +
      '<path d="M13.8 9h3.9l3.3 3.5v3.1h-7.2"/>' +
      '<circle cx="6.6" cy="18" r="2"/>' +
      '<circle cx="17.4" cy="18" r="2"/>',
    medical:
      '<path d="M9.4 3.6h5.2v5.8h5.8v5.2h-5.8v5.8H9.4v-5.8H3.6V9.4h5.8z"/>',
    city:
      '<path d="M3 20.6h18"/>' +
      '<path d="M4.6 20.6V9.6l5-2.4v13.4"/>' +
      '<path d="M9.6 20.6V4.2h9.8v16.4"/>' +
      '<path d="M12.6 8h1.2M15.4 8h1.2M12.6 11.6h1.2M15.4 11.6h1.2M12.6 15.2h1.2M15.4 15.2h1.2"/>',
    coins:
      '<circle cx="9.4" cy="9.4" r="6"/>' +
      '<path d="M15.35 8.65A6 6 0 1 1 8.65 15.35"/>' +
      '<path d="M9.4 7v4.8"/>',
    graduation:
      '<path d="M2.4 9.2 12 4.6l9.6 4.6-9.6 4.6z"/>' +
      '<path d="M6.4 11.2v4.4c0 1.4 2.5 2.8 5.6 2.8s5.6-1.4 5.6-2.8v-4.4"/>' +
      '<path d="M21.6 9.2v5"/>',

    // Hero nodes
    endpoint:
      '<rect x="4.6" y="5" width="14.8" height="10.4" rx="1.6"/>' +
      '<path d="M2.6 18.8h18.8"/>',
    cloud:
      '<path d="M7.2 18.6h10.1a4.1 4.1 0 0 0 .5-8.2 5.6 5.6 0 0 0-10.9 1.3A3.5 3.5 0 0 0 7.2 18.6z"/>',
    identity:
      '<circle cx="9.4" cy="7.6" r="3.4"/>' +
      '<path d="M3.4 19.6c.4-3.6 2.9-5.8 6-5.8 1.3 0 2.5.3 3.5.9"/>' +
      '<path d="m17.4 12.4 3.6 1.4v2.6c0 2.3-1.5 4.1-3.6 4.9-2.1-.8-3.6-2.6-3.6-4.9v-2.6z"/>',

    // Trust bar
    award:
      '<circle cx="12" cy="9.2" r="5.6"/>' +
      '<path d="m8.6 13.6-1.6 7 5-2.6 5 2.6-1.6-7"/>',
    "file-check":
      '<path d="M14 2.9H7.4a2 2 0 0 0-2 2v14.2a2 2 0 0 0 2 2h9.2a2 2 0 0 0 ' +
        '2-2V7.9z"/>' +
      '<polyline points="13.9 2.9 13.9 8 19 8"/>' +
      '<path d="m9.2 14.6 2 2 3.8-4"/>',
    lock:
      '<rect x="4.8" y="10.6" width="14.4" height="10" rx="2.2"/>' +
      '<path d="M8.2 10.6V7.8a3.8 3.8 0 0 1 7.6 0v2.8"/>' +
      '<path d="M12 14.6v2.2"/>',

    // The enterprise problem
    hourglass:
      '<path d="M6.6 3.4h10.8M6.6 20.6h10.8"/>' +
      '<path d="M7.8 3.4v2.8c0 2.2 1.6 3.6 4.2 5.8 2.6-2.2 4.2-3.6 4.2-5.8V3.4"/>' +
      '<path d="M7.8 20.6v-2.8c0-2.2 1.6-3.6 4.2-5.8 2.6 2.2 4.2 3.6 4.2 5.8v2.8"/>',
    alerts:
      '<rect x="3.4" y="8.2" width="13.6" height="12.2" rx="2.2"/>' +
      '<path d="M7 5.2h11.4a2.2 2.2 0 0 1 2.2 2.2v9.4"/>' +
      '<path d="M10.2 11.6v3.2M10.2 17.4v.1"/>',
    timer:
      '<circle cx="12" cy="13.4" r="7.4"/>' +
      '<path d="M12 13.4V9.6M9.6 2.8h4.8M12 2.8V6M18.4 6.6l1.4-1.4"/>',

    // Capabilities
    layers:
      '<path d="M12 3.2 21 7.8l-9 4.6-9-4.6z"/>' +
      '<path d="m3 12.2 9 4.6 9-4.6"/>' +
      '<path d="m3 16.4 9 4.6 9-4.6"/>',
    "cloud-shield":
      '<path d="M8 17.8H6.8a3.6 3.6 0 0 1-.4-7.2 5.6 5.6 0 0 1 10.9-1.4 4.2 4.2 0 0 1 .6 8.4"/>' +
      '<path d="m12.9 11.8 3.6 1.4v2.8c0 2.4-1.5 4.2-3.6 5-2.1-.8-3.6-2.6-3.6-5v-2.8z"/>',
    bot:
      '<rect x="4.6" y="8" width="14.8" height="11" rx="3"/>' +
      '<path d="M12 8V5.4"/>' +
      '<circle cx="12" cy="4.2" r="1.2"/>' +
      '<path d="M9.2 12.8v1.2M14.8 12.8v1.2M2.6 12.4v3M21.4 12.4v3"/>',
    plug:
      '<path d="M9 3.4v4.2M15 3.4v4.2"/>' +
      '<path d="M6.6 7.6h10.8v3.2a5.4 5.4 0 0 1-10.8 0z"/>' +
      '<path d="M12 16.2v4.4"/>',

    // How UCD works
    radar:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<circle cx="12" cy="12" r="4.4"/>' +
      '<path d="m12 12 6.1-6.1M16.2 14.6h.01"/>',
    link:
      '<path d="M10.2 13.8a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1.2 1.2"/>' +
      '<path d="M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1.2-1.2"/>',
    // A funnel: the noise is filtered out before anyone decides.
    decide:
      '<path d="M3.6 4.6h16.8l-6.4 7.6v6.4l-4 1.8v-8.2z"/>',

    // What you get
    eye:
      '<path d="M2.6 12s3.4-6.4 9.4-6.4 9.4 6.4 9.4 6.4-3.4 6.4-9.4 6.4S2.6 12 2.6 12z"/>' +
      '<circle cx="12" cy="12" r="2.8"/>',
    pulse:
      '<path d="M2.8 12.4h4l2.4-5.6 4.2 11 2.6-5.4h5.2"/>',
    "shield-refresh":
      '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.9 7.2 9.4 4.2-1.5 7.2-5 7.2-9.4V6z"/>' +
      '<path d="M16.4 8.6V11H14"/>' +
      '<path d="M15.4 13a3.6 3.6 0 1 1-.85-3.74L16.4 11"/>',

    // SOC models, check marks, "And more"
    clock:
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<path d="M12 7.4V12l3 1.8"/>',
    check:
      '<path d="m6.6 12.4 3.6 3.6 7.2-7.6"/>',
    plus:
      '<path d="M12 5.5v13M5.5 12h13"/>'
  };

  // One glyph, several names used in CONTENT.
  ICONS["shield-check"] = ICONS.shield;
  ICONS.soc = ICONS.headset;
  ICONS.ot = ICONS.factory;

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
      '<path class="ucd-fq__v" d="M12 5.5v13"/>' +
    "</svg>";

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
      return '<span class="ucd-accent">' + run + "</span>";
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
    return "ucd-shell " + cls + (ANIMATE ? " is-animated" : "");
  }

  /* Bar, eyebrow, H2, sub. An empty eyebrow or sub is dropped rather than
     left as an empty paragraph. A <div>, not a <header>: outside an
     <article> or <section> a <header> is announced as a banner landmark,
     and twelve of those would bury the site's real one. */
  function head(o) {
    return (
      '<div class="ucd-head' + (o.align === "start" ? " ucd-head--start" : "") +
        ' ucd-reveal">' +
        (HEAD_BAR ? '<span class="ucd-head__bar" aria-hidden="true"></span>' : "") +
        (o.eyebrow ? '<p class="ucd-head__eyebrow">' + esc(o.eyebrow) + "</p>" : "") +
        '<h2 class="ucd-head__title" id="' + o.id + '">' + markup(o.title) + "</h2>" +
        (o.sub ? '<p class="ucd-head__sub">' + esc(o.sub) + "</p>" : "") +
      "</div>"
    );
  }

  // No href, no button: an empty or "#" link would only reload the page.
  function button(b, ghost) {
    if (!b || !b.label || !b.href) return "";
    return (
      '<a class="ucd-btn' + (ghost ? " ucd-btn--ghost" : "") + '" href="' +
        esc(b.href) + '">' + esc(b.label) + ARROW +
      "</a>"
    );
  }

  function mount(host, html, cls) {
    host.insertAdjacentHTML("beforeend", html);
    var root = host.querySelector("." + cls);
    if (ANIMATE) reveal(root);
    return root;
  }

  /* An artwork panel: `item.image` once CONTENT sets one, its icon until
     then. The image is decorative, alt="", because the card's heading
     already names it; w and h are the export size, so the browser can
     reserve the space before it loads. */
  function media(block, item, w, h) {
    return (
      '<span class="' + block + '__media">' +
        (item.image
          ? '<img class="' + block + '__img" src="' + esc(item.image) + '" alt="" ' +
              'width="' + w + '" height="' + h + '" loading="lazy" decoding="async" ' +
              'data-icon="' + esc(item.icon) + '">'
          : icon(item.icon)) +
      "</span>"
    );
  }

  /* Artwork that fails to load is swapped for the icon named in its
     data-icon, optionally wrapped in a span of class `wrap`, rather than
     leaving a broken-image icon. `error` does not bubble, so this listens
     in the capture phase. */
  function iconFallback(root, imgClass, wrap) {
    root.addEventListener("error", function (e) {
      var img = e.target;
      if (!img.classList || !img.classList.contains(imgClass)) return;
      var svg = icon(img.getAttribute("data-icon"));
      img.insertAdjacentHTML(
        "afterend",
        wrap ? '<span class="' + wrap + '">' + svg + "</span>" : svg
      );
      img.parentNode.removeChild(img);
    }, true);
  }

  /* ---- 1 · Hero ----------------------------------------------------------
     The illustration is coded, so it needs no image and stays sharp. Its
     geometry lives in one 0–100 coordinate space: the nodes sit on a ring
     of NODE_R per cent of the stage, the SVG connectors and signals use
     the same numbers in its 100×100 viewBox, and the HTML chips use them
     as left/top percentages, so the three line up at any width without
     measuring. The ring follows NODE_R too, since it is drawn in the same
     SVG. 36 is the most that keeps the widest side chip ("Network") inside
     a 284px stage, the stage at a 320px viewport.
     -------------------------------------------------------------------- */
  var NODE_R = 36;

  var HERO_DECOR =
    '<div class="ucd-hr__decor" aria-hidden="true">' +
      '<span class="ucd-hr__orb"></span>' +
      '<span class="ucd-hr__dots ucd-hr__dots--tr"></span>' +
      '<span class="ucd-hr__dots ucd-hr__dots--br"></span>' +
    "</div>";

  function round(n) {
    return Math.round(n * 100) / 100;
  }

  function heroStage(v) {
    var nodes = v.nodes || [];
    var n = nodes.length;
    var lines = "";
    var signals = "";
    var chips = "";

    nodes.forEach(function (node, i) {
      // First node at 12 o'clock, the rest clockwise.
      var a = ((-90 + (360 / n) * i) * Math.PI) / 180;
      var x = round(50 + NODE_R * Math.cos(a));
      var y = round(50 + NODE_R * Math.sin(a));

      // Durations step through 2.8–3.6s out of order, so neighbouring
      // signals never pulse in step; negative delays start them mid-flight.
      var dur = n > 1 ? 2.8 + (((i * 3) % n) * 0.8) / (n - 1) : 3.2;

      lines += '<line x1="' + x + '" y1="' + y + '" x2="50" y2="50"/>';

      // Translate lengths on SVG content are user units, so --dx/--dy
      // carry the signal exactly onto the core in viewBox space.
      signals +=
        '<circle class="ucd-hr__signal" cx="' + x + '" cy="' + y + '" r=".8" ' +
          'style="--dx:' + round(50 - x) + "px;--dy:" + round(50 - y) + "px;" +
          "--d:" + round(dur) + "s;--delay:-" + round(i * 0.7) + 's"/>';

      chips +=
        '<span class="ucd-hr__node" style="left:' + x + "%;top:" + y + '%">' +
          '<span class="ucd-hr__node-icon">' + icon(node.icon) + "</span>" +
          esc(node.label) +
        "</span>";
    });

    return (
      '<div class="ucd-hr__stage" aria-hidden="true">' +
        '<svg class="ucd-hr__links" viewBox="0 0 100 100" focusable="false">' +
          '<circle class="ucd-hr__ring ucd-hr__ring--outer" cx="50" cy="50" r="48"/>' +
          '<circle class="ucd-hr__ring" cx="50" cy="50" r="' + NODE_R + '"/>' +
          '<g class="ucd-hr__lines">' + lines + "</g>" +
          "<g>" + signals + "</g>" +
        "</svg>" +
        '<div class="ucd-hr__core">' +
          '<span class="ucd-hr__core-icon">' + icon("shield") + "</span>" +
          '<span class="ucd-hr__core-name">' + esc(v.core) + "</span>" +
          (v.caption
            ? '<span class="ucd-hr__core-caption">' + esc(v.caption) + "</span>"
            : "") +
        "</div>" +
        chips +
      "</div>"
    );
  }

  function buildHero(host, c) {
    if (!host) return false;                          // container not ready
    if (host.querySelector(".ucd-hr")) return true;   // already built

    var v = c.visual || {};

    var proof = (c.proof || []).map(function (p) {
      return (
        '<li class="ucd-hr__proof-item">' +
          '<span class="ucd-hr__check">' + icon("check") + "</span>" +
          esc(p) +
        "</li>"
      );
    }).join("");

    // An editor-supplied image replaces the illustration; it is real
    // content then, so it keeps its alt and loses the aria-hidden.
    var visual = v.image
      ? '<figure class="ucd-hr__media">' +
          '<img class="ucd-hr__img" src="' + esc(v.image) + '" alt="' +
            esc(v.imageAlt || "") + '" decoding="async">' +
        "</figure>"
      : heroStage(v);

    var root = mount(
      host,
      '<div class="' + rootClass("ucd-hr") + '">' +
        (DECOR ? HERO_DECOR : "") +
        '<div class="ucd-hr__copy">' +
          (c.eyebrow
            ? '<p class="ucd-hr__eyebrow ucd-reveal">' + esc(c.eyebrow) + "</p>"
            : "") +
          '<h1 class="ucd-hr__title ucd-reveal"' + at(1) + ">" + markup(c.title) + "</h1>" +
          '<p class="ucd-hr__lead ucd-reveal"' + at(2) + ">" + esc(c.lead) + "</p>" +
          '<p class="ucd-hr__body ucd-reveal"' + at(3) + ">" + esc(c.body) + "</p>" +
          (c.tagline
            ? '<p class="ucd-hr__tagline ucd-reveal"' + at(4) + ">" + esc(c.tagline) + "</p>"
            : "") +
          '<div class="ucd-hr__actions ucd-reveal"' + at(5) + ">" +
            button(c.cta) + button(c.ctaSecondary, true) +
          "</div>" +
          (proof
            ? '<ul class="ucd-hr__proof ucd-reveal"' + at(6) + ">" + proof + "</ul>"
            : "") +
        "</div>" +
        '<div class="ucd-hr__visual ucd-reveal"' + at(3) + ">" + visual + "</div>" +
      "</div>",
      "ucd-hr"
    );

    // A missing image falls back to the illustration, as the proof-points
    // frame does, rather than leaving a broken-image icon.
    var img = root.querySelector(".ucd-hr__img");
    if (img) {
      img.addEventListener("error", function () {
        var media = root.querySelector(".ucd-hr__media");
        if (!media) return;
        media.insertAdjacentHTML("afterend", heroStage(v));
        media.parentNode.removeChild(media);
        heroMotion(root.querySelector(".ucd-hr__stage"));
      });
    } else {
      heroMotion(root.querySelector(".ucd-hr__stage"));
    }

    return true;
  }

  /* The signals only run while the stage is on screen and the tab is in
     front: an IntersectionObserver and visibilitychange toggle one class
     that pauses every animation in it, so a reader deep in the FAQ or an
     idle tab costs no frames. Reduced motion is handled in udc.css, which
     also catches the preference changing after load. */
  function heroMotion(stage) {
    if (!HERO_MOTION || !stage) return;
    var onScreen = true;

    function sync() {
      stage.classList.toggle("is-paused", !onScreen || document.hidden);
    }

    stage.classList.add("is-moving");

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      }).observe(stage);
    }

    document.addEventListener("visibilitychange", sync);
    sync();
  }

  /* ---- 2 · Trust bar ---------------------------------------------------- */
  function buildTrust(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-tb")) return true;

    var items = (c.items || []).map(function (t, i) {
      // Badge artwork sits beside the label, so it is decorative (alt="").
      var mark = t.image
        ? '<img class="ucd-tb__badge" src="' + esc(t.image) + '" alt="" ' +
            'data-icon="' + esc(t.icon) + '" loading="lazy" decoding="async">'
        : '<span class="ucd-tb__icon">' + icon(t.icon) + "</span>";

      return (
        '<li class="ucd-tb__item ucd-reveal"' + at(i) + ">" +
          mark + '<span class="ucd-tb__label">' + esc(t.label) + "</span>" +
        "</li>"
      );
    }).join("");

    // No visible heading, but the strip still gets its H2 for heading
    // navigation, hidden visually and worded from the same label.
    var root = mount(
      host,
      '<div class="' + rootClass("ucd-tb") + '">' +
        (c.label ? '<h2 class="ucd-sr" id="ucd-trust-title">' + esc(c.label) + "</h2>" : "") +
        '<ul class="ucd-tb__list" aria-label="' + esc(c.label) + '">' + items + "</ul>" +
      "</div>",
      "ucd-tb"
    );

    iconFallback(root, "ucd-tb__badge", "ucd-tb__icon");
    return true;
  }

  /* ---- 3 · The enterprise problem ------------------------------------- */
  function buildProblem(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-pb")) return true;

    var points = (c.points || []).map(function (p, i) {
      return (
        '<li class="ucd-card ucd-pb__point ucd-reveal"' + at(i + 2) + ">" +
          '<span class="ucd-badge">' + icon(p.icon) + "</span>" +
          '<p class="ucd-pb__point-text">' +
            "<strong>" + esc(p.lead) + "</strong> " + esc(p.text) +
          "</p>" +
        "</li>"
      );
    }).join("");

    var r = c.resolution || {};

    mount(
      host,
      '<div class="' + rootClass("ucd-pb") + '">' +
        '<div class="ucd-pb__grid">' +
          '<div class="ucd-pb__lede">' +
            head({ id: "ucd-problem-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
            '<p class="ucd-pb__intro ucd-reveal"' + at(1) + ">" + esc(c.intro) + "</p>" +
          "</div>" +
          '<ul class="ucd-pb__points">' + points + "</ul>" +
        "</div>" +
        (r.lead || r.text
          ? '<div class="ucd-pb__resolution ucd-reveal"' + at(5) + ">" +
              '<span class="ucd-badge ucd-badge--solid">' + icon("shield") + "</span>" +
              '<p class="ucd-pb__resolution-text">' +
                "<strong>" + esc(r.lead) + "</strong> " + esc(r.text) +
              "</p>" +
            "</div>"
          : "") +
      "</div>",
      "ucd-pb"
    );

    return true;
  }

  /* ---- 4 · Eight capabilities -------------------------------------------
     Every card shows its full copy: these are the product's substance, so
     nothing hides behind a toggle. Each <article> carries an id, so other
     pages can deep-link to one capability (#ucd-cap-itdr).

     Each card leads with a square artwork tile beside its number and
     title, and the paragraph runs the card's full width beneath, so the
     long copy is never squeezed beside a large image. The tile shows the
     image once CONTENT sets one, and the icon until then (or if the image
     fails to load).
     -------------------------------------------------------------------- */
  function buildCapabilities(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-cp")) return true;

    var cards = (c.items || []).map(function (cap, i) {
      return (
        '<li class="ucd-cp__item ucd-reveal"' + at(i + 1) + ">" +
          '<article class="ucd-card ucd-cp__card" id="ucd-cap-' + esc(cap.slug) + '">' +
            '<div class="ucd-cp__head">' +
              media("ucd-cp", cap, 320, 320) +
              '<div class="ucd-cp__meta">' +
                '<span class="ucd-cp__num">' + pad(i + 1) + "</span>" +
                '<h3 class="ucd-cp__title">' + esc(cap.title) + "</h3>" +
                (cap.full ? '<p class="ucd-cp__full">' + esc(cap.full) + "</p>" : "") +
              "</div>" +
            "</div>" +
            '<p class="ucd-cp__text">' + esc(cap.text) + "</p>" +
          "</article>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("ucd-cp") + '">' +
        head({ id: "ucd-capabilities-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ul class="ucd-cp__grid">' + cards + "</ul>" +
      "</div>",
      "ucd-cp"
    );

    iconFallback(root, "ucd-cp__img");
    return true;
  }

  /* ---- 5 · How UCD works -------------------------------------------------
     The how-it-works pipeline: icon card, then the text. Connectors and
     the return line are drawn in CSS from the gap, so adding a step needs
     no other change.
     -------------------------------------------------------------------- */
  function buildHow(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-hw")) return true;

    var steps = (c.steps || []).map(function (s, i) {
      return (
        '<li class="ucd-hw__step ucd-reveal"' + at(i + 1) + ">" +
          '<div class="ucd-hw__card">' +
            '<span class="ucd-hw__icon">' + icon(s.icon) + "</span>" +
            '<h3 class="ucd-hw__name">' + esc(s.title) + "</h3>" +
          "</div>" +
          '<p class="ucd-hw__text">' + esc(s.text) + "</p>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ucd-hw") + '">' +
        head({ id: "ucd-how-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ol class="ucd-hw__steps">' + steps + "</ol>" +
      "</div>",
      "ucd-hw"
    );

    return true;
  }

  /* ---- 6 · What you get --------------------------------------------------
     Source order is header, cards, quote, so the stacked layout ends on
     the quote; on desktop grid areas lift it under the header.
     -------------------------------------------------------------------- */
  function buildOutcomes(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-oc")) return true;

    var cards = (c.items || []).map(function (o, i) {
      return (
        '<li class="ucd-card ucd-oc__card ucd-reveal"' + at(i + 1) + ">" +
          '<span class="ucd-badge">' + icon(o.icon) + "</span>" +
          '<h3 class="ucd-oc__title">' + esc(o.title) + "</h3>" +
          '<p class="ucd-oc__text">' + esc(o.text) + "</p>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ucd-oc") + '">' +
        head({ id: "ucd-outcomes-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        '<ul class="ucd-oc__cards">' + cards + "</ul>" +
        (c.quote
          ? '<blockquote class="ucd-oc__quote ucd-reveal"' + at(3) + ">" +
              "<p>" + esc(c.quote) + "</p>" +
            "</blockquote>"
          : "") +
      "</div>",
      "ucd-oc"
    );

    return true;
  }

  /* ---- 7 · Choose your SOC model ----------------------------------------
     Each card opens with a landscape artwork panel, edge to edge, above
     the name. Like the capability tiles, it shows the image once CONTENT
     sets one and the icon until then (or if the image fails to load).
     -------------------------------------------------------------------- */
  function buildSocModels(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-sm")) return true;

    var L = c.labels || {};

    var cards = (c.models || []).map(function (m, i) {
      return (
        '<li class="ucd-sm__item ucd-reveal"' + at(i + 1) + ">" +
          '<div class="ucd-card ucd-sm__card">' +
            media("ucd-sm", m, 960, 640) +
            '<div class="ucd-sm__head">' +
              '<h3 class="ucd-sm__name">' + esc(m.name) + "</h3>" +
              '<p class="ucd-sm__coverage">' +
                '<span class="ucd-sr">' + esc(L.coverage) + ": </span>" +
                icon("clock") + esc(m.coverage) +
              "</p>" +
            "</div>" +
            '<dl class="ucd-sm__facts">' +
              '<div class="ucd-sm__fact">' +
                "<dt>" + esc(L.how) + "</dt><dd>" + esc(m.how) + "</dd>" +
              "</div>" +
              '<div class="ucd-sm__fact">' +
                "<dt>" + esc(L.bestFor) + "</dt><dd>" + esc(m.bestFor) + "</dd>" +
              "</div>" +
            "</dl>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("ucd-sm") + '">' +
        head({ id: "ucd-soc-models-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ul class="ucd-sm__list">' + cards + "</ul>" +
      "</div>",
      "ucd-sm"
    );

    iconFallback(root, "ucd-sm__img");
    return true;
  }

  /* ---- 8 · Mapped to NIST CSF 2.0 --------------------------------------- */
  function buildNist(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-ns")) return true;

    var tiles = (c.functions || []).map(function (f, i) {
      var chips = (f.capabilities || []).map(function (cap) {
        return '<li class="ucd-chip">' + esc(cap) + "</li>";
      }).join("");

      // The code repeats the name in short, so it is hidden from readers.
      return (
        '<li class="ucd-card ucd-ns__tile ucd-reveal"' + at(i + 1) + ">" +
          '<div class="ucd-ns__head">' +
            '<span class="ucd-ns__code" aria-hidden="true">' + esc(f.code) + "</span>" +
            '<h3 class="ucd-ns__name">' + esc(f.name) + "</h3>" +
          "</div>" +
          '<ul class="ucd-ns__chips">' + chips + "</ul>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("ucd-ns") + '">' +
        head({ id: "ucd-nist-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ul class="ucd-ns__grid">' + tiles + "</ul>" +
      "</div>",
      "ucd-ns"
    );

    return true;
  }

  /* ---- 9 · Built for the regulatory clock -------------------------------
     A real table, named by the H2. Below 760px udc.css re-flows each row
     into a card, and some browsers drop table semantics as soon as a
     table's display changes; the explicit roles keep the cells announced
     as cells either way.
     -------------------------------------------------------------------- */
  function buildRegulatory(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-rg")) return true;

    var cols = c.columns || [];

    var headRow = cols.map(function (col) {
      return '<th scope="col" role="columnheader">' + esc(col) + "</th>";
    }).join("");

    var rows = (c.rows || []).map(function (r) {
      return (
        '<tr role="row">' +
          '<th scope="row" role="rowheader">' + esc(r.regime) + "</th>" +
          '<td role="cell" data-label="' + esc(cols[1] || "") + '">' + esc(r.appliesTo) + "</td>" +
          '<td role="cell" data-label="' + esc(cols[2] || "") + '">' + markup(r.timelines) + "</td>" +
        "</tr>"
      );
    }).join("");

    var note = c.note || {};

    mount(
      host,
      '<div class="' + rootClass("ucd-rg") + '">' +
        head({ id: "ucd-regulatory-title", eyebrow: c.eyebrow, title: c.title }) +
        '<div class="ucd-rg__frame ucd-reveal"' + at(1) + ">" +
          '<table class="ucd-rg__table" role="table" aria-labelledby="ucd-regulatory-title">' +
            '<thead role="rowgroup"><tr role="row">' + headRow + "</tr></thead>" +
            '<tbody role="rowgroup">' + rows + "</tbody>" +
          "</table>" +
        "</div>" +
        (note.text || note.strong
          ? '<p class="ucd-rg__note ucd-reveal"' + at(2) + ">" +
              esc(note.text) + (note.strong ? " <strong>" + esc(note.strong) + "</strong>" : "") +
            "</p>"
          : "") +
      "</div>",
      "ucd-rg"
    );

    return true;
  }

  /* ---- 10 · Industries we serve ------------------------------------------ */
  function buildIndustries(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-in")) return true;

    var items = c.items || [];

    var tiles = items.map(function (it, i) {
      return (
        '<li class="ucd-card ucd-in__tile ucd-reveal"' + at(i + 1) + ">" +
          '<span class="ucd-badge ucd-badge--lg">' + icon(it.icon) + "</span>" +
          '<span class="ucd-in__name">' + esc(it.label) + "</span>" +
        "</li>"
      );
    }).join("");

    if (c.more) {
      tiles +=
        '<li class="ucd-in__tile ucd-in__tile--more ucd-reveal"' + at(items.length + 1) + ">" +
          '<span class="ucd-badge ucd-badge--lg ucd-in__plus">' + icon("plus") + "</span>" +
          '<span class="ucd-in__name">' + esc(c.more) + "</span>" +
        "</li>";
    }

    mount(
      host,
      '<div class="' + rootClass("ucd-in") + '">' +
        head({ id: "ucd-industries-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ul class="ucd-in__grid">' + tiles + "</ul>" +
      "</div>",
      "ucd-in"
    );

    return true;
  }

  /* ---- 11 · Part of CybrHawk's five solutions ---------------------------
     The landscape layout: the hub (UCD itself, solution 01) with four
     cards around it. All five are one list, hub first, so the reading
     order runs 01 to 05 and the hub stays on top when the grid stacks.

     The connectors are one fixed 380×420 SVG in the middle column. That
     column is 320px with a fixed 30px gap either side, so the SVG's edges
     land on the cards' inner edges without measuring.
     -------------------------------------------------------------------- */
  var SL_LINKS =
    '<svg class="ucd-sl__links" viewBox="0 0 380 420" aria-hidden="true" ' +
      'focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<path d="M6 92C48 92 74 96 92 122"/>' +
        '<path d="M374 92C332 92 306 96 288 122"/>' +
        '<path d="M6 328C48 328 74 324 92 298"/>' +
        '<path d="M374 328C332 328 306 324 288 298"/>' +
      "</g>" +
      '<g fill="currentColor">' +
        '<circle cx="6" cy="92" r="4.5"/>' +
        '<circle cx="374" cy="92" r="4.5"/>' +
        '<circle cx="6" cy="328" r="4.5"/>' +
        '<circle cx="374" cy="328" r="4.5"/>' +
      "</g>" +
    "</svg>";

  var SL_RING =
    '<svg class="ucd-sl__ring" viewBox="0 0 300 300" aria-hidden="true" ' +
      'focusable="false">' +
      '<circle cx="150" cy="150" r="146" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5 9"/>' +
    "</svg>";

  // A card with an href is one whole link; without one it is a plain
  // <article>, so no dead link ships while a page URL is still missing.
  function solutionCard(s, i) {
    var inner =
      '<span class="ucd-badge">' + icon(s.icon) + "</span>" +
      '<div class="ucd-sl__body">' +
        '<h3 class="ucd-sl__name">' +
          '<span class="ucd-sl__num">' + esc(s.num) + "</span> · " + esc(s.name) +
        "</h3>" +
        '<p class="ucd-sl__focus">' + esc(s.focus) + "</p>" +
        '<p class="ucd-sl__tagline">' + esc(s.tagline) + "</p>" +
      "</div>";

    return (
      '<li class="ucd-sl__item ucd-reveal"' + at(i + 2) + ">" +
        (s.href
          ? '<a class="ucd-card ucd-card--link ucd-sl__card" href="' + esc(s.href) + '">' +
              inner + '<span class="ucd-sl__go">' + ARROW + "</span>" +
            "</a>"
          : '<article class="ucd-card ucd-sl__card">' + inner + "</article>") +
      "</li>"
    );
  }

  function buildSolutions(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-sl")) return true;

    var hub = c.hub || {};
    var link = c.link || {};

    mount(
      host,
      '<div class="' + rootClass("ucd-sl") + '">' +
        head({ id: "ucd-solutions-title", eyebrow: c.eyebrow, title: c.title }) +
        '<ul class="ucd-sl__stage">' +
          '<li class="ucd-sl__hub ucd-reveal"' + at(1) + ">" +
            SL_LINKS +
            '<div class="ucd-sl__orb">' +
              SL_RING +
              '<div class="ucd-sl__core">' +
                '<span class="ucd-sl__core-icon">' + icon(hub.icon) + "</span>" +
                '<h3 class="ucd-sl__hub-name">' +
                  '<span class="ucd-sl__num">' + esc(hub.num) + "</span> · " + esc(hub.name) +
                "</h3>" +
                '<p class="ucd-sl__caption">' + esc(hub.caption) + "</p>" +
              "</div>" +
            "</div>" +
          "</li>" +
          (c.items || []).map(solutionCard).join("") +
        "</ul>" +
        (link.label && link.href
          ? '<p class="ucd-sl__more ucd-reveal"' + at(6) + ">" +
              '<a class="ucd-sl__more-link" href="' + esc(link.href) + '">' +
                esc(link.label) + ARROW +
              "</a>" +
            "</p>"
          : "") +
      "</div>",
      "ucd-sl"
    );

    return true;
  }

  /* ---- 12 · FAQ ----------------------------------------------------------
     Each question is a native <button> inside an <h3>, so Enter and Space
     work without key handling, and each answer is a labelled region
     carrying `hidden` while closed. Items open independently.
     -------------------------------------------------------------------- */
  function buildFaq(host, c) {
    if (!host) return false;
    if (host.querySelector(".ucd-fq")) return true;

    var items = (c.items || []).map(function (it, i) {
      var q = "ucd-faq-q-" + (i + 1);
      var a = "ucd-faq-a-" + (i + 1);

      return (
        '<div class="ucd-fq__item ucd-reveal"' + at(i + 1) + ">" +
          '<h3 class="ucd-fq__q">' +
            '<button type="button" class="ucd-fq__btn" id="' + q + '" ' +
              'aria-expanded="false" aria-controls="' + a + '">' +
              '<span class="ucd-fq__q-text">' + esc(it.q) + "</span>" +
              '<span class="ucd-fq__icon">' + PLUS_MINUS + "</span>" +
            "</button>" +
          "</h3>" +
          '<div class="ucd-fq__a" id="' + a + '" role="region" ' +
            'aria-labelledby="' + q + '" hidden>' +
            "<p>" + esc(it.a) + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("ucd-fq") + '">' +
        head({ id: "ucd-faq-title", eyebrow: c.eyebrow, title: c.title }) +
        '<div class="ucd-fq__list">' + items + "</div>" +
      "</div>",
      "ucd-fq"
    );

    bindFaq(root);
    return true;
  }

  // Delegated from the section root, so it keeps working if items change.
  function bindFaq(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".ucd-fq__btn");
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
    ["trust", buildTrust],
    ["problem", buildProblem],
    ["capabilities", buildCapabilities],
    ["how", buildHow],
    ["outcomes", buildOutcomes],
    ["socModels", buildSocModels],
    ["nist", buildNist],
    ["regulatory", buildRegulatory],
    ["industries", buildIndustries],
    ["solutions", buildSolutions],
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
        if (container) container.classList.add("ucd-section");
        if (!b[1](host, CONTENT[key] || {})) {
          done = false;                              // container not ready
          return;
        }
      } catch (err) {
        // A builder that throws would throw again on every DOM change, so
        // it is logged once and not retried; the others carry on.
        if (window.console) {
          console.error("UCD: the " + key + " section failed to build.", err);
        }
      }

      settled[key] = true;
    });

    return done;
  }

  function reveal(root) {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      root.classList.add("is-visible");
      return;
    }

    // About a tenth of the section in view triggers it. A section taller
    // than ten screens (the capabilities on a short phone held sideways)
    // could never show a tenth, so the share is capped at what half a
    // screen of it amounts to.
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

  function init() {
    if (buildAll()) return;
    var obs = new MutationObserver(function () {
      if (buildAll()) obs.disconnect();
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
