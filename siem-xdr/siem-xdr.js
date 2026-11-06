/* =====================================================================
   CybrHawk — SIEM XDR (Fusion Analytic Threat Platform) page, sections 01–09
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects each
   section's markup into its own empty container and pairs with
   siem-xdr.css. The FAQ and the final call to action are not built here:
   the site's existing CTA component follows section 09, which ends on
   white so the two join without a seam.

   One container per section, in page order, each set to Full Width with
   padding 0 and no background, its class in the CSS Classes field:

     xd-hero        xd-challenge   xd-platform    xd-capabilities
     xd-detection   xd-usecases    xd-impact      xd-integrations
     xd-why

   On build each container also gets `xd-section` (and `xd-section--dark`
   for the four dark grounds, 01, 03, 05 and 08), which carries the shared
   tokens, so editors only ever type the one class. A missing container
   skips only its own section, and an error in one builder is logged
   without stopping the others.

   The page reads like an investigation timeline: scattered events from
   different domains (quiet blue-grey) get stitched together by one blue
   thread into a single incident, which is scored and then resolved. The
   hero and section 02 are the scatter, 03–05 the stitching, 06–07 the
   resolution, 08–09 the family plugging into one hub. Amber means "this
   threat has been scored and prioritized" and appears in three places
   only: the hero's "Highest risk" pill, node 3 of the 03 rail and the
   05 core's "Scored by risk" output.

   The hero is this page's own: a night ground with the investigation
   canvas (its copy column and image mode come from siem-cloud.js). The
   rest reuse designs that already ship: 02, 03 and 08 come from
   siem-cloud.js; 04 and 06 from siem-ndr.js (HawkINT's datasheet and
   sector selector); 05, 07 and 09 from hawk-int.js (the core diagram,
   the outputs readout and the reasons ledger).

   If a live class differs, change SECTIONS below — they are the only
   selectors this file touches (siem-xdr.css is scoped to the same
   classes, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = {
    hero: ".xd-hero",
    challenge: ".xd-challenge",
    platform: ".xd-platform",
    capabilities: ".xd-capabilities",
    detection: ".xd-detection",
    usecases: ".xd-usecases",
    impact: ".xd-impact",
    integrations: ".xd-integrations",
    why: ".xd-why"
  };

  // Sections on a dark ground; their container also gets xd-section--dark.
  var DARK = { hero: true, platform: true, detection: true, integrations: true };

  /* ---- Content (edit freely) -----------------------------------------

     Every string a reader sees lives here; the builders hard-code none.
     In any title, "\n" becomes a line break and [[double brackets]] set
     that run in the accent colour. An empty eyebrow is not rendered, and
     a link or button with an empty href is not rendered either.

     Icons are named per item; the glyphs are in ICONS further down.
     Labels inside decorative visuals (the hero console, the 02 tab bar,
     the 03 rail, the 05 core, the 06 storyline strips, the 08 two-way
     strip and the 09 hub) are aria-hidden, and every one is a word
     already in the copy. Every CTA carries data-xd-cta="<placement>"
     for click tracking in GTM.
     -------------------------------------------------------------------- */
  var CONTENT = {

    hero: {
      eyebrow: "SIEM XDR · Fusion Analytic Threat Platform",
      // Three spans inside one <h1>; line 3 in the accent.
      title: ["One Platform.", "Every Signal.", "Faster Response."],
      sub: "CybrHawk SIEM XDR unifies security data from endpoints, servers, cloud, network, applications, and identities into a single, AI-driven detection and response platform. It helps your team see attacks earlier, investigate in context, and contain threats before they become business incidents.",
      cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
      ctaSecondary: { label: "Tour All Features", href: "#xd-capabilities" },
      trust: [
        "AI and machine-learning detection",
        "Mapped to MITRE ATT&CK",
        "Cloud-native and multi-tenant",
        "Backed by a 24/7 Fusion SOC"
      ],
      // The investigation canvas. Lanes and domains from the subheadline;
      // events from section 05 ("unusual logins", "lateral movement") and
      // use case 1 ("credential dumping", "mass file changes"); the
      // incident line from capability 3; "Highest risk" from capability
      // 4; the playbook from section 03 step 4. State words are UI labels.
      // Each event's domain names its lane, and each event must sit on a
      // lower lane than the one before it.
      visual: {
        label: "CybrHawk SIEM XDR",
        lanes: ["Identity", "Cloud", "Endpoint", "Network", "Application", "Server"],
        events: [
          { domain: "Identity", text: "Unusual login" },
          { domain: "Endpoint", text: "Credential dumping" },
          { domain: "Network",  text: "Lateral movement" },
          { domain: "Server",   text: "Mass file changes" }
        ],
        incident: "A single incident with a clear attack storyline",
        risk: "Highest risk",
        playbook: "Playbook: Isolate hosts · Disable accounts",
        states: { separate: "Separate alerts", correlated: "Correlated", contained: "Contained" },
        image: "",     // TODO: optional banner image URL (the console shows until one is set)
        imageAlt: ""
      }
    },

    challenge: {
      eyebrow: "The Challenge",
      title: "Too Many Tools. Too Many Alerts. [[Not Enough Context.]]",
      body: [
        "Most security teams run a stack of disconnected tools: a SIEM for logs, an EDR for endpoints, separate consoles for cloud and identity, and a ticketing system on top. Each produces its own alerts, in its own format, with its own blind spots. Analysts spend their time switching screens and stitching evidence together while real attacks move quietly from one system to the next.",
        "Legacy SIEMs made this worse. They collect everything, charge by the gigabyte, and still leave the hard work of correlation, triage, and response to people. The result is alert fatigue, longer dwell time, and a growing gap between what you can see and what you can act on."
      ],
      // Tool tab bar (aria-hidden), from paragraph 1.
      tools: ["SIEM", "EDR", "Cloud", "Identity", "Ticketing"],
      // dot: cluster | event. Offsets and rotation are per card (§6.2).
      items: [
        { dot: "cluster", title: "Alert overload",        text: "Thousands of low-fidelity alerts bury the few that matter." },
        { dot: "event",   title: "Fragmented visibility", text: "Endpoint, cloud, network, and identity data live in separate silos." },
        { dot: "event",   title: "Slow investigations",   text: "Analysts rebuild attack timelines by hand across multiple consoles." },
        { dot: "event",   title: "Rising costs",          text: "Ingest-based pricing punishes you for collecting the data you need." }
      ]
    },

    platform: {
      eyebrow: "Platform Overview",
      title: "SIEM and XDR, [[Fused Into One Platform]]",
      sub: "CybrHawk SIEM XDR combines the breadth of a modern SIEM with the speed and depth of extended detection and response. Every log, event, and alert is collected, normalized, enriched, and correlated in one data layer, so detections are built on full context rather than isolated signals. When a threat is confirmed, built-in automation and playbooks take action across your existing security stack.",
      // Rail captions (aria-hidden), from the paragraph.
      captions: { threads: "Every log, event, and alert", merged: "One data layer" },
      steps: [
        { title: "Collect",              text: "Ingest structured and unstructured data from endpoints, servers, firewalls, cloud, SaaS, identity providers, and applications through agents, APIs, and syslog." },
        { title: "Normalize & Enrich",   text: "Parse every event into a common schema and enrich it with asset context, user identity, geolocation, and HawkINT threat intelligence." },
        { title: "Detect & Prioritize",  text: "Correlation rules, behavioral analytics, and machine-learning models surface real threats and score them by risk, so analysts start with what matters most." },
        { title: "Respond & Report",     text: "Trigger automated playbooks, isolate hosts, disable accounts, open tickets, and generate audit-ready reports from the same console." }
      ]
    },

    capabilities: {
      eyebrow: "Key Capabilities",
      title: "Everything Your SOC Needs to [[Detect, Investigate, and Respond]]",
      sub: "Purpose-built capabilities that work together, not bolt-ons that compete for your analysts’ attention.",
      items: [
        { slug: "ingestion",   icon: "sources",        title: "Universal Data Ingestion",
          text: "Collect and normalize data from virtually any source, including firewalls, endpoints, servers, cloud platforms, SaaS apps, and custom applications, with out-of-the-box parsers and flexible APIs." },
        { slug: "ai",          icon: "bot",            title: "AI-Driven Threat Detection",
          text: "Behavioral analytics, UEBA, and machine-learning models identify anomalies, insider threats, and novel attacks that static signatures miss." },
        { slug: "correlation", icon: "link",           title: "Intelligent Correlation",
          text: "Link related events across users, hosts, and time into a single incident with a clear attack storyline, instead of hundreds of disconnected alerts." },
        { slug: "triage",      icon: "rank",           title: "Risk Scoring & Automated Triage",
          text: "Every incident is scored by severity, asset criticality, and threat intelligence, so your team works the highest-risk threats first." },
        { slug: "playbooks",   icon: "shield-refresh", title: "Automated Response & Playbooks",
          text: "Prebuilt and custom playbooks contain threats in seconds: isolate endpoints, block IPs, disable accounts, and notify stakeholders, with optional human approval." },
        { slug: "forensics",   icon: "evidence",       title: "Incident Response & Forensics",
          text: "Investigate with unified timelines, entity graphs, and raw-log pivoting, then preserve evidence for containment, recovery, and post-incident review." },
        { slug: "dark-web",    icon: "dark",           title: "Dark Web Monitoring",
          text: "Detect leaked credentials, exposed corporate data, and brand mentions on underground forums and marketplaces before attackers can use them." },
        { slug: "compliance",  icon: "file-check",     title: "Compliance & Reporting",
          text: "Generate customizable reports and dashboards aligned with NIST, HIPAA, GDPR, PCI DSS, and ISO 27001 requirements, with long-term log retention for audits." },
        { slug: "rules",       icon: "dashboard",      title: "Custom Rules & Dashboards",
          text: "Build your own detection rules, queries, and dashboards, or start from a library of prebuilt content mapped to MITRE ATT&CK." }
      ]
    },

    detection: {
      eyebrow: "Detection Deep Dive",
      title: "Layered Detection That [[Catches What Others Miss]]",
      sub: "No single technique catches every attack. CybrHawk SIEM XDR layers multiple detection methods, so a threat that slips past one layer is caught by another.",
      // Core label and output pill (aria-hidden). "Scored by risk" from section 03 step 3.
      core: { label: "CybrHawk SIEM XDR", output: "Scored by risk" },
      items: [
        { icon: "clipboard", title: "Rule-Based Correlation",
          text: "Real-time correlation rules detect known attack patterns, policy violations, and multi-stage kill chains." },
        { icon: "user-eye",  title: "User & Entity Behavior Analytics (UEBA)",
          text: "Dynamic baselines for every user and device flag unusual logins, privilege use, data access, and lateral movement." },
        { icon: "pulse",     title: "Machine-Learning Models",
          text: "Unsupervised and supervised models identify outliers, rare processes, beaconing, and data exfiltration." },
        { icon: "radar",     title: "Threat Intelligence Fusion",
          text: "HawkINT and curated external feeds enrich events with known-bad IPs, domains, hashes, and adversary TTPs." },
        { icon: "matrix",    title: "MITRE ATT&CK Mapping",
          text: "Every detection is mapped to tactics and techniques, so you can measure coverage and close gaps." },
        { icon: "search",    title: "Threat Hunting",
          text: "Search across all historical data with a fast query engine and saved hunts built on the latest adversary behavior." }
      ]
    },

    usecases: {
      eyebrow: "Use Cases",
      title: "Built for the Threats [[You Face Every Day]]",
      // The storyline console's chrome label (aria-hidden), as on the hero.
      console: "CybrHawk SIEM XDR",
      // trail + end drive the console's steps; every word is from that
      // item's own text. end.kind: "act" = check node, "find" = ring node.
      items: [
        { icon: "ransom",     title: "Ransomware Detection & Containment",
          text: "Spot early indicators such as credential dumping, mass file changes, and shadow-copy deletion, then isolate affected hosts automatically before encryption spreads.",
          trail: ["Credential dumping", "Mass file changes", "Shadow-copy deletion"],
          end: { kind: "act", text: "Isolate affected hosts" } },
        { icon: "identity",   title: "Insider Threat & Account Compromise",
          text: "Detect impossible travel, abnormal access, privilege escalation, and unusual data downloads that point to a compromised or malicious insider.",
          trail: ["Impossible travel", "Abnormal access", "Privilege escalation", "Unusual data downloads"],
          end: { kind: "find", text: "Compromised or malicious insider" } },
        { icon: "mail-alert", title: "Phishing & Business Email Compromise",
          text: "Correlate email, identity, and endpoint signals to trace a phishing click through to credential theft and stop follow-on activity.",
          trail: ["Phishing click", "Credential theft"],
          end: { kind: "act", text: "Stop follow-on activity" } },
        { icon: "lateral",    title: "Lateral Movement & Privilege Abuse",
          text: "Identify attackers pivoting between systems using RDP, SMB, PowerShell, or stolen credentials, and cut off the path.",
          trail: ["RDP", "SMB", "PowerShell", "Stolen credentials"],
          end: { kind: "act", text: "Cut off the path" } },
        { icon: "cloud",      title: "Cloud & SaaS Threats",
          text: "Monitor AWS, Azure, GCP, Microsoft 365, and Google Workspace for risky configuration changes, token abuse, and suspicious API activity.",
          trail: ["Risky configuration changes", "Token abuse", "Suspicious API activity"],
          end: null },
        { icon: "file-check", title: "Compliance & Audit Readiness",
          text: "Centralize logs, enforce retention, and produce evidence for auditors on demand, without manual data pulls.",
          trail: ["Centralize logs", "Enforce retention"],
          end: { kind: "act", text: "Evidence for auditors on demand" } }
      ]
    },

    impact: {
      eyebrow: "Business Impact",
      title: "Security Outcomes [[Your Board Can Understand]]",
      sub: "CybrHawk SIEM XDR turns security operations from a cost center into a measurable business capability.",
      // Console chrome label from the H2; value tags are words from each outcome.
      console: "Outcomes",
      items: [
        { tag: "MTTD",     title: "Faster Detection",
          text: "Reduce mean time to detect (MTTD) by correlating every signal in real time instead of waiting for manual review." },
        { tag: "MTTR",     title: "Faster Response",
          text: "Lower mean time to respond (MTTR) with automated triage and playbooks that act in seconds, not hours." },
        { tag: "NOISE",    title: "Fewer False Positives",
          text: "Risk scoring and context-rich correlation cut alert noise, so analysts focus on genuine threats." },
        { tag: "COST",     title: "Lower Total Cost",
          text: "Consolidate point tools into one platform and avoid the runaway ingest costs of legacy SIEMs." },
        { tag: "AUDIT",    title: "Stronger Compliance Posture",
          text: "Continuous monitoring and ready-made reports simplify audits and demonstrate due diligence." },
        { tag: "ANALYSTS", title: "Higher Analyst Productivity",
          text: "One console, one data model, and guided investigations let lean teams do more with less." }
      ]
    },

    integrations: {
      eyebrow: "Integrations",
      title: "Works With the [[Security Stack You Already Own]]",
      sub: "CybrHawk SIEM XDR is vendor-agnostic. Out-of-the-box connectors and open APIs bring in data from your existing tools and push response actions back to them, so you protect your investments instead of replacing them.",
      // Two-way strip labels (aria-hidden), from the paragraph.
      flow: { in: "Bring in data", core: "CybrHawk SIEM XDR", out: "Push response actions back" },
      // Either chips (split from the copy's list, joining "and" dropped) or text (verbatim).
      // ours: true = a CybrHawk product, the only blue chips.
      items: [
        { title: "Endpoint & EDR",
          text: "Leading endpoint protection and EDR platforms" },
        { title: "Network & Firewalls",
          chips: ["Next-generation firewalls", "IDS/IPS", "proxies",
                  { label: "CybrHawk SIEM NDR", ours: true, href: "https://cybrhawk.com/siem-ndr/" }] },
        { title: "Cloud Platforms",
          chips: ["AWS", "Microsoft Azure", "Google Cloud",
                  { label: "CybrHawk SIEM Cloud", ours: true, href: "https://cybrhawk.com/siem-cloud/" }] },
        { title: "Identity",
          chips: ["Microsoft Entra ID (Azure AD)", "Okta", "Active Directory", "PAM solutions"] },
        { title: "Productivity & SaaS",
          chips: ["Microsoft 365", "Google Workspace", "business-critical SaaS apps"] },
        { title: "ITSM & Collaboration",
          chips: ["ServiceNow", "Jira", "Slack", "Microsoft Teams", "email"] },
        { title: "Threat Intelligence",
          // TODO: confirm the live HawkINT page URL, then set href.
          chips: [{ label: "HawkINT", ours: true, href: "" }, "STIX/TAXII feeds", "commercial intelligence sources"] }
      ]
    },

    why: {
      eyebrow: "",   // "Why CybrHawk" would repeat the H2
      title: "Why Security Leaders Choose [[CybrHawk SIEM XDR]]",
      sub: "A single breach can cause severe, lasting damage to revenue, reputation, and customer trust. CybrHawk is built to stop attacks before they reach that point by pairing advanced technology with expert human defenders.",
      // Family hub (aria-hidden), from differentiator 5.
      hub: { centre: "SIEM XDR", nodes: ["NDR", "Cloud", "ITDR", "OT Security", "HawkINT", "IR One"] },
      items: [
        { icon: "headset",     title: "Fusion SOC Model",
          text: "Detection, response, and proactive threat hunting operate as one team and one workflow, backed by CybrHawk security experts around the clock." },
        { icon: "bot",         title: "AI at the Core",
          text: "Artificial intelligence and machine learning power detection, prioritization, and decision support, not just dashboards." },
        { icon: "users-table", title: "Built for MSSPs and Enterprises",
          text: "Multi-tenant architecture, role-based access, and per-tenant reporting support managed service providers, large enterprises, and hybrid environments." },
        { icon: "cloud",       title: "Cloud-Native Scale",
          text: "Elastic, cloud-ready architecture scales with your data and your business, with flexible SaaS, hybrid, or on-premises deployment." },
        { icon: "layers",      title: "Part of Unified Cyber Defense",
          text: "SIEM XDR connects natively with CybrHawk NDR, Cloud, ITDR, OT Security, HawkINT, and IR One for complete, silo-free coverage." }
      ]
    }
  };

  // Fade/rise each section's content in as it scrolls into view, the
  // hero's one-off load stagger, and the one-off draws (03 rail, 05
  // leads, 06 storyline strips).
  var ANIMATE = true;

  // The hero console's separate → correlated → contained loop. Paused
  // off screen and in a background tab; static in its final state under
  // reduced motion.
  var HERO_LOOP = true;

  // The hero banner's life after load (only with an image): a soft scan
  // line sweeping it every few seconds, and a small drift that follows
  // the mouse on desktop. Off under reduced motion.
  var HERO_AMBIENT = true;

  // The 05 core's slow orbit and ring pulse. Pauses off screen and in a
  // background tab; still under reduced motion.
  var CORE_MOTION = true;

  /* Section 02's "separate consoles": each window's own offset (px) and
     tilt (deg), so the four never line up; and the tool tabs above them,
     each nudged up or down and padded to its own width. Phones and
     reduced motion drop them (siem-xdr.css), because misalignment on a
     narrow screen just looks broken. */
  var SCATTER = [
    { dx: -8,  dy: 6,   rot: -1.2 },
    { dx: 10,  dy: -8,  rot: 0.9 },
    { dx: -6,  dy: 12,  rot: 0.7 },
    { dx: 12,  dy: -6,  rot: -0.8 }
  ];
  var TAB_SCATTER = [
    { dy: -3, pad: 14 },
    { dy: 4,  pad: 10 },
    { dy: -1, pad: 20 },
    { dy: 5,  pad: 12 },
    { dy: -4, pad: 17 }
  ];

  /* The hero canvas. Where each event sits across the timeline (% of
     its width), in CONTENT order, earlier on the left; each must be on a
     lower lane than the one before (see 01). Then each lane's background
     alerts, in CONTENT.hero.visual.lanes order, kept clear of the events
     and of the two points where the thread crosses a lane (Cloud at 15.5,
     Application at 49.5). */
  var HERO_EVENT_X = [7, 24, 41, 58];
  var HERO_NOISE = [
    [31, 52, 78, 90],
    [6, 27, 44, 66, 85],
    [12, 47, 72, 94],
    [9, 29, 61, 82],
    [18, 36, 63, 76, 91],
    [14, 33, 75, 88]
  ];

  /* Section 03: six threads leave Collect; small event dots ride a few of
     them before they merge: [thread, % along]. */
  var THREADS = 6;
  var THREAD_EVENTS = [[0, 34], [1, 70], [3, 22], [4, 56], [5, 80]];
  /* -------------------------------------------------------------------- */

  /* ---- Icons ------------------------------------------------------------
     24×24 strokes that follow currentColor. Glyphs shared with
     siem-cloud.js, siem-ndr.js, incident-response.js and hawk-int.js are
     copied as-is so the same idea reads the same across the site (the
     HawkINT ones at this file's stroke weight); the one new glyph
     (matrix) is drawn to the same grid and weight.
     -------------------------------------------------------------------- */
  var ICONS = {
    // From siem-cloud.js / siem-ndr.js / incident-response.js
    shield:
      '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.9 7.2 9.4 4.2-1.5 7.2-5 7.2-9.4V6z"/>' +
      '<path d="m8.9 12 2.2 2.2 4-4.2"/>',
    check:
      '<path d="m6.6 12.4 3.6 3.6 7.2-7.6"/>',
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
    cloud:
      '<path d="M7.2 18.6h10.1a4.1 4.1 0 0 0 .5-8.2 5.6 5.6 0 0 0-10.9 1.3A3.5 3.5 0 0 0 7.2 18.6z"/>',
    pulse:
      '<path d="M2.8 12.4h4l2.4-5.6 4.2 11 2.6-5.4h5.2"/>',
    clipboard:
      '<rect x="5.2" y="4.6" width="13.6" height="16.4" rx="2.2"/>' +
      '<rect x="8.8" y="2.8" width="6.4" height="3.6" rx="1.2"/>' +
      '<path d="M8.8 11.4h6.4M8.8 15h4.4"/>',
    // Two hosts and the sideways hop between them (siem-ndr.js).
    lateral:
      '<rect x="2.8" y="8.2" width="5.6" height="7.6" rx="1.6"/>' +
      '<rect x="15.6" y="8.2" width="5.6" height="7.6" rx="1.6"/>' +
      '<path d="M10.4 12h3.6M12.2 9.8l2.2 2.2-2.2 2.2"/>',
    // From incident-response.js
    "mail-alert":
      '<path d="M13.2 18.4H5a1.8 1.8 0 0 1-1.8-1.8V7a1.8 1.8 0 0 1 1.8-1.8h14A1.8 1.8 0 0 1 20.8 7v4.6"/>' +
      '<path d="m3.6 6.6 8.4 6 8.4-6"/>' +
      '<path d="M18.6 14.6v3M18.6 20.2v.1"/>',
    "users-table":
      '<circle cx="7" cy="6.6" r="2.4"/>' +
      '<circle cx="17" cy="6.6" r="2.4"/>' +
      '<path d="M3.4 13.2c.4-2 1.8-3.2 3.6-3.2s3.2 1.2 3.6 3.2M13.4 13.2c.4-2 1.8-3.2 3.6-3.2s3.2 1.2 3.6 3.2"/>' +
      '<path d="M2.6 15.4h18.8M5.4 15.4v5.2M18.6 15.4v5.2"/>',

    // From hawk-int.js, redrawn at this file's stroke weight.
    bot:
      '<rect x="4.5" y="8" width="15" height="11" rx="3"/>' +
      '<path d="M12 8V4.8"/><circle cx="12" cy="3.4" r="1.3"/>' +
      '<circle cx="9" cy="13.2" r="1.2" fill="currentColor"/>' +
      '<circle cx="15" cy="13.2" r="1.2" fill="currentColor"/>' +
      '<path d="M2.6 12.5v2M21.4 12.5v2"/>',
    sources:
      '<path d="M4 7c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3z"/>' +
      '<path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/>' +
      '<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    rank:
      '<path d="M4 20V11M10 20V5M16 20v-6M22 4v16"/>',
    evidence:
      '<path d="M9 3h6l1 3H8z"/>' +
      '<path d="M8 6v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/>' +
      '<path d="M10 11h4"/>',
    dark:
      '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 20 14.5z"/>',
    search:
      '<circle cx="11" cy="11" r="6.4"/>' +
      '<path d="m16 16 4.5 4.5"/>',
    ransom:
      '<rect x="4.5" y="10" width="15" height="10" rx="2"/>' +
      '<path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>' +
      '<path d="M12 14v2.5"/>',

    // 05 · MITRE ATT&CK Mapping: the matrix, a 3×3 grid of tactics and
    // techniques with one cell covered.
    matrix:
      '<rect x="3.4" y="3.4" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="9.7" y="3.4" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="16" y="3.4" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="3.4" y="9.7" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="9.7" y="9.7" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="16" y="9.7" width="4.6" height="4.6" rx="1.2" fill="currentColor"/>' +
      '<rect x="3.4" y="16" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="9.7" y="16" width="4.6" height="4.6" rx="1.2"/>' +
      '<rect x="16" y="16" width="4.6" height="4.6" rx="1.2"/>'
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

  // The white CybrHawk wordmark HawkINT's core and why badge use.
  var LOGO = "https://cybrhawk.com/wp-content/uploads/2025/07/logo-white-cybrhawk-2-scaled.png";

  /* ---- Helpers --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  /* Escape first, then promote [[…]] to an accent span. A hyphenated word
     ("AI-Driven") is kept whole, so a balanced title never breaks at its
     hyphen; the text itself is unchanged. */
  function markup(s) {
    return nl2br(s)
      .replace(/[A-Za-z0-9’']+(?:-[A-Za-z0-9’']+)+/g, function (word) {
        return '<span class="xd-nowrap">' + word + "</span>";
      })
      .replace(/\[\[(.+?)\]\]/g, function (_, run) {
        return '<span class="xd-accent">' + run + "</span>";
      });
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
    return "xd-shell " + cls + (ANIMATE ? " is-animated" : "");
  }

  /* A full-bleed root, for the sections whose decoration runs edge to
     edge past the measure: the root is the positioned, clipped layer and
     an inner .xd-shell holds the content. */
  function bleedClass(cls) {
    return cls + (ANIMATE ? " is-animated" : "");
  }

  function reducedMotion() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Eyebrow (mono, led by the stitch mark), H2, sub. An empty eyebrow or
     sub is dropped rather than left as an empty paragraph. A <div>, not a
     <header>: outside an <article> or <section> a <header> is announced
     as a banner landmark, and eight of those would bury the site's real
     one. */
  function head(o) {
    return (
      '<div class="xd-head' + (o.align === "start" ? " xd-head--start" : "") +
        ' xd-reveal">' +
        (o.eyebrow ? '<p class="xd-eyebrow">' + esc(o.eyebrow) + "</p>" : "") +
        '<h2 class="xd-head__title" id="' + o.id + '">' + markup(o.title) + "</h2>" +
        (o.sub ? '<p class="xd-head__sub">' + esc(o.sub) + "</p>" : "") +
      "</div>"
    );
  }

  /* kind: "primary" (solid blue) or "ghost" (ink hairline, for the light
     hero). No href, no button: an empty or "#" link would only reload
     the page. */
  function button(b, kind, placement) {
    if (!b || !b.label || !b.href || b.href === "#") return "";
    return (
      '<a class="xd-btn xd-btn--' + kind + '" href="' + esc(b.href) + '" ' +
        'data-xd-cta="' + placement + '">' +
        '<span class="xd-btn__label">' + esc(b.label) + "</span>" + ARROW +
      "</a>"
    );
  }

  function mount(host, html, cls) {
    host.insertAdjacentHTML("beforeend", html);
    var root = host.querySelector("." + cls);
    if (ANIMATE && root.classList.contains("is-animated")) reveal(root);
    return root;
  }

  /* An image that fails to load gives way to an icon, so a badge is never
     a broken-image glyph. */
  function iconFallback(img, name) {
    if (!img) return;
    img.addEventListener("error", function () {
      if (img.parentNode) img.parentNode.innerHTML = icon(name);
    });
  }

  /* An in-page link is only worth rendering if something will answer it:
     the target already exists, or the container that builds it is on the
     page. prune() removes any that still point nowhere once the build has
     settled (say the capabilities builder threw). */
  var ANCHOR_HOSTS = { "xd-capabilities": "capabilities" };

  function anchorLive(href) {
    if (!href || href.charAt(0) !== "#") return true;
    var id = href.slice(1);
    if (document.getElementById(id)) return true;
    var key = ANCHOR_HOSTS[id];
    return !!(key && SECTIONS[key] && document.querySelector(SECTIONS[key]));
  }

  function prune() {
    var links = document.querySelectorAll('a[data-xd-cta][href^="#"]');
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

  // A CSS loop only needs pausing: .is-paused sets animation-play-state
  // on everything inside.
  function pauseOffscreen(el) {
    whileVisible(el, function (on) {
      el.classList.toggle("is-paused", !on);
    });
  }

  /* In-page links (#xd-capabilities) glide unless the reader prefers
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
     A night ground the full width of the page: the copy on the left, its
     edge on the same line as every other section's content; on the right
     the "investigation canvas", the page's idea in one picture. Behind
     both, faint time gridlines and a blue glow. Below 1025px the canvas
     drops under the copy.

     The canvas is a timeline in swimlanes, one lane per domain the
     subheadline names, each speckled with the everyday alerts every tool
     raises. A time cursor sweeps across it and the alerts arrive as it
     passes ("Separate alerts"). Four of them, on four different lanes,
     are one attack: a blue thread stitches those four together in time
     order, their lanes light up, the rest of the noise falls back, and
     the thread runs down into a single incident, scored "Highest risk"
     in amber ("Correlated"); then a playbook contains it ("Contained").

     The canvas is decoration (aria-hidden): the H1 and the copy already
     say all of it. The script only steps data-step 0–3 on the stage;
     siem-xdr.css owns every visual change. Its default (no data-step
     rules) is the final state, which is what reduced motion shows.

     Nothing is measured. Every lane is the same fixed height, so lane l's
     line sits at (l + .5) / n down the lanes, and an event at
     HERO_EVENT_X across them; the thread's SVG uses the same numbers in a
     0–100 viewBox stretched over the lanes (preserveAspectRatio="none",
     with a non-scaling stroke). Each event's label sits above and to the
     right of its dot, the one side the thread never takes, since each
     event is on a lower lane than the one before. The thread is drawn by
     a veil sliding off it, so only transform animates.

     With CONTENT.hero.visual.image set, the banner takes the canvas's
     place, whole (never cropped), with the scan line and mouse drift; an
     image that fails to load falls back to the canvas.
     -------------------------------------------------------------------- */

  // Step lengths (ms): separate, correlated, contained, hold. Then the
  // canvas clears for CLEAR_MS and starts over.
  var STEP_MS = [2600, 2400, 1800, 2800];
  var CLEAR_MS = 600;
  // The canvas's load reveal (300ms delay + 0.9s); the loop waits it out.
  var LOOP_START_MS = 1100;

  // Inline delay for the hero's load stagger.
  function after(ms) {
    return ' style="--d:' + ms + 'ms"';
  }

  // The lane a domain runs in, or -1.
  function laneOf(lanes, domain) {
    var want = String(domain || "").toLowerCase();
    for (var i = 0; i < lanes.length; i++) {
      if (String(lanes[i]).toLowerCase() === want) return i;
    }
    return -1;
  }

  /* The thread: from each event to the next, an S-curve that leaves and
     arrives level (both control points halfway across), then straight
     down from the last event to the foot of the lanes, where the
     incident card's port picks it up. */
  function threadPath(points) {
    var d = "";
    points.forEach(function (p, i) {
      if (!i) {
        d = "M" + p[0] + " " + p[1];
        return;
      }
      var q = points[i - 1];
      var mid = round((q[0] + p[0]) / 2);
      d += " C" + mid + " " + q[1] + " " + mid + " " + p[1] + " " + p[0] + " " + p[1];
    });
    var last = points[points.length - 1];
    return last ? d + " L" + last[0] + " 100" : "";
  }

  function heroCanvas(v) {
    var states = v.states || {};
    var lanes = v.lanes || [];
    var n = Math.max(lanes.length, 1);
    var byLane = {};
    var points = [];

    (v.events || []).forEach(function (e, k) {
      var l = laneOf(lanes, e.domain);
      if (l < 0 || byLane[l]) return;
      var x = HERO_EVENT_X[k % HERO_EVENT_X.length];
      byLane[l] = { x: x, text: e.text };
      points.push([x, round(((l + 0.5) * 100) / n)]);
    });

    var last = points[points.length - 1];

    // A joined lane carries its event's x, so its name lights up as the
    // thread reaches it.
    var rows = lanes.map(function (name, l) {
      var ev = byLane[l];
      var noise = (HERO_NOISE[l] || []).map(function (x) {
        return '<span class="xd-hr__noise" style="--x:' + x + '"></span>';
      }).join("");

      return (
        '<div class="xd-hr__row' + (ev ? " is-joined" : "") + '"' +
          (ev ? ' style="--x:' + ev.x + '"' : "") + ">" +
          '<span class="xd-hr__name">' + esc(name) + "</span>" +
          '<span class="xd-hr__lane">' +
            noise +
            (ev
              ? '<span class="xd-hr__event" style="--x:' + ev.x + '">' +
                  '<span class="xd-hr__dot"></span>' +
                  '<span class="xd-hr__ev">' + esc(ev.text) + "</span>" +
                "</span>"
              : "") +
          "</span>" +
        "</div>"
      );
    }).join("");

    function state(key) {
      return states[key]
        ? '<span class="xd-hr__state xd-hr__state--' + key + '">' + esc(states[key]) + "</span>"
        : "";
    }

    return (
      '<div class="xd-hr__stage" aria-hidden="true">' +
        '<div class="xd-hr__console">' +
          '<div class="xd-hr__bar">' +
            '<span class="xd-hr__dots"><i></i><i></i><i></i></span>' +
            '<span class="xd-hr__label">' + esc(v.label || "") + "</span>" +
            '<span class="xd-hr__status">' +
              state("separate") + state("correlated") + state("contained") +
            "</span>" +
          "</div>" +
          '<div class="xd-hr__body"' + (last ? ' style="--end:' + last[0] / 100 + '"' : "") + ">" +
            '<span class="xd-hr__ruler"></span>' +
            (rows
              ? '<div class="xd-hr__lanes" style="--n:' + n + '">' +
                  (last
                    ? '<span class="xd-hr__thread">' +
                        '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' +
                          '<path d="' + threadPath(points) + '"/>' +
                        "</svg>" +
                        '<span class="xd-hr__veil"></span>' +
                      "</span>"
                    : "") +
                  rows +
                  '<span class="xd-hr__sweep"><span class="xd-hr__cursor"></span></span>' +
                "</div>"
              : "") +
            (v.incident
              ? '<div class="xd-hr__incident">' +
                  (last ? '<span class="xd-hr__port"></span>' : "") +
                  '<span class="xd-hr__incident-text">' + esc(v.incident) + "</span>" +
                  (v.risk ? '<span class="xd-hr__risk">' + esc(v.risk) + "</span>" : "") +
                "</div>"
              : "") +
            (v.playbook
              ? '<div class="xd-hr__playbook">' +
                  '<span class="xd-hr__node">' + icon("check") + "</span>" +
                  '<span class="xd-hr__playbook-text">' + esc(v.playbook) + "</span>" +
                "</div>"
              : "") +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  /* separate → correlated → contained → hold, then clear and start over.
     Waits for the canvas's load reveal, stops its timer while the canvas
     is off screen or the tab is hidden, and never starts under reduced
     motion (the CSS default is the final state). */
  function heroLoop(stage) {
    if (!HERO_LOOP || !stage || reducedMotion()) return;

    var step = 0;
    var timer = null;
    var running = false;
    var ready = false;

    // Starts empty: the alerts arrive with the sweep once step 0 begins.
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
  function heroMedia(v) {
    return (
      '<div class="xd-hr__media xd-hr__float">' +
        '<img class="xd-hr__img" src="' + esc(v.image) + '" alt="' + esc(v.imageAlt || "") + '" ' +
          'width="1254" height="1254" decoding="async" fetchpriority="high">' +
        (HERO_AMBIENT ? '<span class="xd-hr__scan" aria-hidden="true"></span>' : "") +
      "</div>"
    );
  }

  function heroVisual(v) {
    return v.image
      ? heroMedia(v)
      : '<div class="xd-hr__float">' + heroCanvas(v) + "</div>";
  }

  function buildHero(host, c) {
    if (!host) return false;                         // container not ready
    if (host.querySelector(".xd-hr")) return true;   // already built

    var v = c.visual || {};
    var title = c.title || [];
    if (typeof title === "string") title = [title];

    // Each point arrives on its own beat after the buttons.
    var trust = (c.trust || []).map(function (t, i) {
      return (
        '<li class="xd-hr__trust-item xd-hr__in"' + after(480 + i * 70) + ">" +
          '<span class="xd-hr__check">' + icon("check") + "</span>" +
          esc(t) +
        "</li>"
      );
    }).join("");

    // Separate spans for colour and stagger, with real spaces between
    // them so a screen reader reads one sentence. Each line is a mask
    // (the outer span) that its text rises out of (the inner one).
    var lines = title.map(function (line, i) {
      return (
        '<span class="xd-hr__line xd-hr__line--' + (i + 1) + '">' +
          '<span class="xd-hr__line-in"' + after(80 * (i + 1)) + ">" + esc(line) + "</span>" +
        "</span>"
      );
    }).join(" ");

    var second = c.ctaSecondary || {};
    var actions = button(c.cta, "primary", "hero-primary") +
                  (anchorLive(second.href) ? button(second, "ghost", "hero-secondary") : "");

    var root = mount(
      host,
      '<div class="' + bleedClass("xd-hr") + (v.image ? " xd-hr--image" : "") + '">' +
        // The ground's gridlines and glow, edge to edge behind everything.
        '<div class="xd-hr__decor" aria-hidden="true">' +
          '<span class="xd-hr__glow"></span>' +
          '<span class="xd-hr__glow xd-hr__glow--soft"></span>' +
        "</div>" +
        '<div class="xd-shell xd-hr__inner">' +
          '<div class="xd-hr__copy">' +
            (c.eyebrow
              ? '<p class="xd-eyebrow xd-hr__eyebrow xd-hr__in"' + after(0) + ">" + esc(c.eyebrow) + "</p>"
              : "") +
            '<h1 class="xd-hr__title">' + lines + "</h1>" +
            (c.sub ? '<p class="xd-hr__sub xd-hr__in"' + after(320) + ">" + esc(c.sub) + "</p>" : "") +
            (actions
              ? '<div class="xd-hr__actions xd-hr__in"' + after(400) + ">" + actions + "</div>"
              : "") +
            (trust ? '<ul class="xd-hr__trust">' + trust + "</ul>" : "") +
          "</div>" +
          '<div class="xd-hr__visual">' + heroVisual(v) + "</div>" +
        "</div>" +
      "</div>",
      "xd-hr"
    );

    // Artwork that fails to load gives way to the coded canvas, so the
    // column is never a broken-image icon.
    var img = root.querySelector(".xd-hr__img");
    if (img) {
      img.addEventListener("error", function () {
        var media = root.querySelector(".xd-hr__media");
        if (!media) return;
        media.insertAdjacentHTML("afterend", '<div class="xd-hr__float">' + heroCanvas(v) + "</div>");
        media.parentNode.removeChild(media);
        root.classList.remove("xd-hr--image");
        heroLoop(root.querySelector(".xd-hr__stage"));
      });
    }

    heroLoop(root.querySelector(".xd-hr__stage"));
    heroAmbient(root);
    bindAnchors(root);
    return true;
  }

  /* The visual's ambient motion. The scan line (image only) is a CSS
     animation; this only pauses it while the visual is off screen or the
     tab is hidden. The drift follows the mouse (never touch) as two
     custom properties, -1 to 1 across the hero, written once per frame;
     the CSS turns them into a small eased translate of the image or the
     canvas. Neither starts under reduced motion. */
  function heroAmbient(root) {
    if (!HERO_AMBIENT || !ANIMATE || reducedMotion()) return;

    var visual = root.querySelector(".xd-hr__visual");
    if (visual) {
      whileVisible(visual, function (on) {
        root.classList.toggle("is-paused", !on);
      });
    }

    if (!window.matchMedia ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var frame = 0;
    var x = 0;
    var y = 0;

    function paint() {
      frame = 0;
      root.style.setProperty("--xd-px", x.toFixed(3));
      root.style.setProperty("--xd-py", y.toFixed(3));
    }

    function queue() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    root.addEventListener("mousemove", function (e) {
      var r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      queue();
    });

    root.addEventListener("mouseleave", function () {
      x = 0;
      y = 0;
      queue();
    });
  }

  /* ---- 02 · The challenge -------------------------------------------------
     SIEM Cloud's split: copy on the left; on the right the four pain
     points as four small console windows that refuse to line up, the
     picture of analysts switching screens. Above them a tab bar of the
     five tools paragraph 1 lists, each tab a different width and nudged
     off the line, so even the bar never lines up (aria-hidden: the
     paragraph names them).

     Each window's offset and tilt, and each tab's nudge and padding, are
     inline custom properties from SCATTER and TAB_SCATTER, so the CSS
     can drop them on phones and under reduced motion. The chrome dots
     are quiet event grey; Alert overload's is a cluster of three, too
     many alerts. No amber: nothing has been scored yet.
     -------------------------------------------------------------------- */
  var DOTS = { cluster: true, event: true };

  function buildChallenge(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-ch")) return true;

    var body = (c.body || []).map(function (p, i) {
      return '<p class="xd-ch__p' + (i === 0 ? " xd-ch__p--lead" : "") + '">' + esc(p) + "</p>";
    }).join("");

    var tools = (c.tools || []).map(function (t, i) {
      var s = TAB_SCATTER[i % TAB_SCATTER.length];
      return (
        '<span class="xd-ch__tool" style="--i:' + i + ";--dy:" + s.dy + "px;--pad:" + s.pad + 'px">' +
          esc(t) +
        "</span>"
      );
    }).join("");

    var items = (c.items || []).map(function (it, i) {
      var s = SCATTER[i % SCATTER.length];
      var dot = DOTS[it.dot] ? it.dot : "event";
      return (
        '<li class="xd-ch__item" style="--i:' + (i + 1) + ";--dx:" + s.dx + "px;--dy:" + s.dy +
          "px;--rot:" + s.rot + 'deg">' +
          '<div class="xd-ch__win">' +
            '<div class="xd-ch__chrome">' +
              '<span class="xd-ch__dot xd-ch__dot--' + dot + '" aria-hidden="true">' +
                (dot === "cluster" ? "<i></i><i></i><i></i>" : "") +
              "</span>" +
              '<h3 class="xd-ch__title">' + esc(it.title) + "</h3>" +
            "</div>" +
            '<p class="xd-ch__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("xd-ch") + '">' +
        '<div class="xd-ch__decor" aria-hidden="true"></div>' +
        '<div class="xd-shell xd-ch__inner">' +
          '<div class="xd-ch__lede">' +
            head({ id: "xd-challenge-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
            (body ? '<div class="xd-ch__body xd-reveal"' + at(1) + ">" + body + "</div>" : "") +
          "</div>" +
          (tools || items
            ? '<div class="xd-ch__visual">' +
                (tools ? '<div class="xd-ch__tools" aria-hidden="true">' + tools + "</div>" : "") +
                (items ? '<ul class="xd-ch__windows">' + items + "</ul>" : "") +
              "</div>"
            : "") +
        "</div>" +
      "</div>",
      "xd-ch"
    );

    return true;
  }

  /* ---- 03 · Platform overview ---------------------------------------------
     The signature section, on SIEM Cloud's rail. Four steps on one line,
     and the line is the storyline: from Collect, six thin threads in
     quiet event grey run side by side ("Every log, event, and alert"),
     a few of them carrying event dots; at Normalize & Enrich they merge,
     and one blue line ("One data layer") carries on. Node 3, Detect &
     Prioritize, is the page's one amber node: the threat is scored
     there. Node 4 ends the line in blue with a check.

     Every piece of the rail belongs to the step it leaves from, sized off
     the step's own box and the list gap (--xd-pf-gap), so the same markup
     lays out across (≥1100px) or down (<1100px) with no measuring. Step 1
     carries the threads, their dots, the merge (one small SVG per
     orientation) and the first caption; steps 2 and 3 carry the blue
     segment to the next node, step 2 the second caption. The nodes sit
     on top with a solid fill, so segments run centre to centre beneath.

     --t is when the line reaches each node, so the node lights then.
     -------------------------------------------------------------------- */
  // Seconds: the threads draw first (0–0.65s), merge by 0.7s, then the
  // blue line spends 0.45s on each later segment.
  function arrival(i) {
    return i === 0 ? 0 : round(0.75 + (i - 1) * 0.45);
  }

  function railThreads(caption) {
    var threads = "";
    var dots = "";
    var mergeH = "";
    var mergeV = "";

    // Six lines 4px apart in a 22px band, centred on the node (y 11).
    for (var k = 0; k < THREADS; k++) {
      var p = 1 + k * 4;
      threads += '<span class="xd-pf__thread" style="--k:' + k + '"></span>';
      mergeH += '<path d="M0 ' + p + "c14 0 14 " + (11 - p) + " 28 " + (11 - p) + '"/>';
      mergeV += '<path d="M' + p + " 0c0 14 " + (11 - p) + " 14 " + (11 - p) + ' 28"/>';
    }

    THREAD_EVENTS.forEach(function (e) {
      dots += '<i class="xd-pf__ev" style="--k:' + e[0] + ";--at:" + e[1] + '%"></i>';
    });

    return (
      '<span class="xd-pf__threads" aria-hidden="true">' +
        threads + dots +
        // Two merges, one per orientation; the CSS shows one.
        '<svg class="xd-pf__merge xd-pf__merge--h" viewBox="0 0 28 22" focusable="false">' + mergeH + "</svg>" +
        '<svg class="xd-pf__merge xd-pf__merge--v" viewBox="0 0 22 28" focusable="false">' + mergeV + "</svg>" +
        (caption ? '<span class="xd-pf__caption xd-pf__caption--threads">' + esc(caption) + "</span>" : "") +
      "</span>"
    );
  }

  function buildPlatform(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-pf")) return true;

    var steps = c.steps || [];
    var n = steps.length;
    var captions = c.captions || {};

    var items = steps.map(function (s, i) {
      var rail = "";
      if (i < n - 1) {
        rail = i === 0
          ? railThreads(captions.threads)
          : '<span class="xd-pf__line" aria-hidden="true"></span>' +
            (i === 1 && captions.merged
              ? '<span class="xd-pf__caption xd-pf__caption--merged" aria-hidden="true">' + esc(captions.merged) + "</span>"
              : "");
      }
      return (
        '<li class="xd-pf__step xd-pf__step--' + (i + 1) + (i === n - 1 ? " xd-pf__step--end" : "") +
          '" style="--i:' + i + ";--t:" + arrival(i) + 's">' +
          rail +
          '<span class="xd-pf__node" aria-hidden="true">' +
            '<span class="xd-pf__num">' + pad(i + 1) + "</span>" +
            (i === n - 1 ? '<span class="xd-pf__tick">' + icon("check") + "</span>" : "") +
          "</span>" +
          '<div class="xd-pf__body xd-reveal"' + at(i + 2) + ">" +
            '<h3 class="xd-pf__title">' + esc(s.title) + "</h3>" +
            '<p class="xd-pf__text">' + esc(s.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("xd-pf") + '">' +
        '<div class="xd-pf__decor" aria-hidden="true"><span class="xd-pf__glow"></span></div>' +
        '<div class="xd-shell xd-pf__inner">' +
          head({ id: "xd-platform-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub }) +
          (items ? '<ol class="xd-pf__steps" style="--n:' + n + '">' + items + "</ol>" : "") +
        "</div>" +
      "</div>",
      "xd-pf"
    );

    return true;
  }

  /* ---- 04 · Key capabilities ----------------------------------------------
     HawkINT's datasheet, as siem-ndr.js ports it: one white panel split
     by 1px hairlines into a 3×3 grid (2 columns with the ninth spanning
     both on tablets, 1 on phones), each cell led by a large ghosted
     index numeral, then an icon and title on one row, then the body. The
     cells are static, so their hover is a tint only: no lift, no pointer.

     The root carries id="xd-capabilities", the hero's "Tour All
     Features" target; tabindex="-1" lets that link move focus here as
     well as scroll. Each cell is <article id="xd-cap-{slug}">, so other
     pages can deep-link to it.
     -------------------------------------------------------------------- */
  function buildCapabilities(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-cp")) return true;

    var cells = (c.items || []).map(function (it, i) {
      var id = it.slug ? ' id="xd-cap-' + esc(it.slug) + '"' : "";
      return (
        '<li class="xd-cp__item">' +
          '<article class="xd-cp__cell xd-reveal"' + id + at(i + 1) + ">" +
            '<span class="xd-cp__index" aria-hidden="true">' + pad(i + 1) + "</span>" +
            '<div class="xd-cp__cellhead">' +
              '<span class="xd-cp__icon">' + icon(it.icon) + "</span>" +
              '<h3 class="xd-cp__title">' + esc(it.title) + "</h3>" +
            "</div>" +
            '<p class="xd-cp__text">' + esc(it.text) + "</p>" +
          "</article>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("xd-cp") + '" id="xd-capabilities" tabindex="-1">' +
        head({ id: "xd-capabilities-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub, align: "start" }) +
        (cells
          ? '<div class="xd-cp__panel"><ul class="xd-cp__grid">' + cells + "</ul></div>"
          : "") +
      "</div>",
      "xd-cp"
    );

    return true;
  }

  /* ---- 05 · Detection deep dive -------------------------------------------
     HawkINT's core diagram: the intro on the left with a living core
     under it (two orbit rings, a ring pulse, the white CybrHawk logo on a
     night badge), and on the right the six detection layers as connected
     pills. A thin lead runs from each pill toward the core, so six layers
     visibly feed one core, and under the core sits its one output,
     "Scored by risk", in amber.

     The leads live in one SVG over the column gap, in a 0–100 viewBox
     stretched to the pill list (preserveAspectRatio="none", non-scaling
     strokes). Where they converge is the core's height against the list,
     which depends on how the header wraps, so it is measured: from
     layout offsets (never getBoundingClientRect, so the reveal's
     translate cannot skew it), again whenever the section resizes. A
     short feed line carries the converged leads across to the core.

     On a desktop screen at least 640px tall the left column is sticky:
     the header and core hold still while the layers scroll past, each
     lighting up as it comes level with the core (detectionLeads).

     Below 1100px the diagram stacks: header, core, then the pills with a
     single blue line down their left instead of the leads. The core,
     leads, feed and output pill are decoration (aria-hidden).
     -------------------------------------------------------------------- */
  function offsetY(el, stop) {
    var y = 0;
    while (el && el !== stop) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  /* On a tall enough desktop screen the left column is sticky (see
     siem-xdr.css), so the core holds still while the layers scroll past
     it: the leads are redrawn on every scrolled frame while the section
     is on screen (offsetTop follows a sticky element's stuck position),
     and the layer level with the core is marked .is-active, with its
     lead, as it feeds the core. Static layouts mark none. */
  function detectionLeads(root) {
    var inner = root.querySelector(".xd-dt__inner");
    var aside = root.querySelector(".xd-dt__aside");
    var svg = root.querySelector(".xd-dt__leads");
    var feed = root.querySelector(".xd-dt__feed");
    var list = root.querySelector(".xd-dt__pills");
    if (!inner || !aside || !svg || !feed || !list) return;

    var paths = svg.querySelectorAll("path");
    var pills = list.children;
    var frame = 0;
    var active = -1;

    // SVG elements have no classList in older browsers.
    function mark(i, on) {
      if (i < 0 || i >= pills.length) return;
      pills[i].classList.toggle("is-active", on);
      if (paths[i]) paths[i].setAttribute("class", on ? "is-active" : "");
    }

    /* While sticky, the layers' column is lifted so its first layer
       starts level with the core, and given room below so its last layer
       ends level with it when the column comes unstuck: every layer then
       passes the core in turn. Measured inside each column, so the stuck
       offset cancels out; written only on a change, so the resize it
       causes settles at once. */
    var lift = -1;
    var drop = -1;

    function align(sticky) {
      var l = 0;
      var d = 0;
      if (sticky && pills.length) {
        var asideTop = offsetY(aside, inner);
        var listTop = offsetY(list, inner);
        var first = pills[0];
        var last = pills[pills.length - 1];
        var coreY = offsetY(feed, inner) + feed.offsetHeight / 2 - asideTop;
        var firstY = offsetY(first, inner) + first.offsetHeight / 2 - listTop;
        var lastBelow = list.offsetHeight - (offsetY(last, inner) + last.offsetHeight / 2 - listTop);
        l = Math.max(0, Math.round(coreY - firstY));
        d = Math.max(0, Math.round(aside.offsetHeight - coreY - lastBelow));
      }
      if (l !== lift || d !== drop) {
        lift = l;
        drop = d;
        inner.style.setProperty("--xd-dt-lift", l + "px");
        inner.style.setProperty("--xd-dt-drop", d + "px");
      }
    }

    function draw() {
      frame = 0;
      var h = list.offsetHeight;
      if (!h || !feed.offsetHeight) return;          // stacked: the leads are hidden
      var sticky = window.getComputedStyle(aside).position === "sticky";
      align(sticky);
      var top = offsetY(list, inner);
      var cy = round(((offsetY(feed, inner) + feed.offsetHeight / 2 - top) / h) * 100);
      var best = -1;
      var bestGap = Infinity;

      for (var i = 0; i < paths.length && i < pills.length; i++) {
        var y = round(((offsetY(pills[i], inner) + pills[i].offsetHeight / 2 - top) / h) * 100);
        paths[i].setAttribute("d", "M0 " + cy + "C50 " + cy + " 50 " + y + " 100 " + y);
        if (Math.abs(y - cy) < bestGap) {
          bestGap = Math.abs(y - cy);
          best = i;
        }
      }

      if (!sticky) best = -1;
      if (best !== active) {
        mark(active, false);
        mark(best, true);
        active = best;
      }
    }

    function queue() {
      if (!frame) frame = window.requestAnimationFrame(draw);
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(queue).observe(inner);
    } else {
      window.addEventListener("resize", queue);
    }

    // Scroll only moves the core against the list while it is stuck, and
    // only matters while the section is on screen.
    var listening = false;
    whileVisible(root, function (on) {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", queue, { passive: true });
        queue();
      } else {
        window.removeEventListener("scroll", queue, { passive: true });
      }
    });

    queue();
  }

  function buildDetection(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-dt")) return true;

    var list = c.items || [];
    var n = list.length;
    var core = c.core || {};
    var paths = "";

    var items = list.map(function (it, i) {
      // Placeholder geometry until detectionLeads() measures: even rows,
      // converging at mid-height.
      var y = round(((i + 0.5) * 100) / Math.max(n, 1));
      paths += '<path style="--k:' + i + '" d="M0 50C50 50 50 ' + y + " 100 " + y + '"/>';
      return (
        '<li class="xd-dt__pill xd-reveal"' + at(i + 2) + ">" +
          '<span class="xd-dt__pill-ico">' + icon(it.icon) + "</span>" +
          '<div class="xd-dt__pill-copy">' +
            '<h3 class="xd-dt__pill-title">' + esc(it.title) + "</h3>" +
            '<p class="xd-dt__pill-text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + bleedClass("xd-dt") + '">' +
        '<div class="xd-dt__decor" aria-hidden="true"></div>' +
        '<div class="xd-shell xd-dt__inner">' +
          '<div class="xd-dt__aside">' +
            head({ id: "xd-detection-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub, align: "start" }) +
            '<div class="xd-dt__hub xd-reveal" aria-hidden="true"' + at(1) + ">" +
              '<div class="xd-dt__core">' +
                '<span class="xd-dt__ring xd-dt__ring--1"></span>' +
                '<span class="xd-dt__ring xd-dt__ring--2"></span>' +
                '<span class="xd-dt__pulse"></span>' +
                '<span class="xd-dt__badge">' +
                  '<img class="xd-dt__logo" src="' + LOGO + '" alt="" loading="lazy" decoding="async">' +
                "</span>" +
                (core.label ? '<span class="xd-dt__core-label">' + esc(core.label) + "</span>" : "") +
              "</div>" +
              (n ? '<span class="xd-dt__feed"></span>' : "") +
              (core.output ? '<span class="xd-dt__output">' + esc(core.output) + "</span>" : "") +
            "</div>" +
          "</div>" +
          (items
            ? '<div class="xd-dt__layers">' +
                '<svg class="xd-dt__leads" viewBox="0 0 100 100" preserveAspectRatio="none" ' +
                  'aria-hidden="true" focusable="false">' + paths + "</svg>" +
                '<ol class="xd-dt__pills">' + items + "</ol>" +
              "</div>"
            : "") +
        "</div>" +
      "</div>",
      "xd-dt"
    );

    iconFallback(root.querySelector(".xd-dt__logo"), "shield");
    detectionLeads(root);

    var hub = root.querySelector(".xd-dt__hub");
    if (hub && CORE_MOTION && ANIMATE && !reducedMotion()) {
      hub.classList.add("is-moving");
      pauseOffscreen(hub);
    }

    return true;
  }

  /* ---- 06 · Use cases -----------------------------------------------------
     HawkINT's sector selector, as siem-ndr.js ports it: a vertical rail
     of the six use cases is a real tablist (roles, aria-selected,
     aria-controls, roving tabindex, Arrow / Home / End) driving one large
     detail panel; use case 1 is selected on load. Below 860px it becomes
     an accordion of native <button aria-expanded> headers, each with its
     panel beneath.

     The two modes need different DOM orders (a tablist may only own tabs;
     an accordion reads header, panel, header, panel), so on a breakpoint
     change the script moves each panel: into the stage beside the rail
     for tabs, or straight after its own button for the accordion. One
     selection survives the switch.

     Each panel ends in a small console (aria-hidden), the hero canvas's
     idiom: the use case's own words as steps on a blue thread, ending in
     a check node (a response, end.kind "act") or a ring node (what the
     signals point to, "find"), or simply stopping. siem-xdr.css runs the
     steps across the console when it is wide enough and down it when it
     is not (a container query), and draws them in, one by one, whenever
     a panel is shown.
     -------------------------------------------------------------------- */
  var UC_ACCORDION = "(max-width: 860px)";

  function storyConsole(it, label) {
    var trail = it.trail || [];
    if (!trail.length) return "";

    var steps = trail.map(function (t, k) {
      return (
        '<li class="xd-uc__step" style="--k:' + k + '">' +
          '<span class="xd-uc__node"></span>' +
          '<span class="xd-uc__step-text">' + esc(t) + "</span>" +
        "</li>"
      );
    }).join("");

    var end = it.end || null;
    var kind = end && end.text && (end.kind === "act" || end.kind === "find") ? end.kind : "";
    if (kind) {
      steps +=
        '<li class="xd-uc__step xd-uc__step--' + kind + '" style="--k:' + trail.length + '">' +
          '<span class="xd-uc__node">' + (kind === "act" ? icon("check") : "") + "</span>" +
          '<span class="xd-uc__step-text">' + esc(end.text) + "</span>" +
        "</li>";
    }

    return (
      '<div class="xd-uc__console" aria-hidden="true">' +
        '<div class="xd-uc__bar">' +
          '<span class="xd-uc__dots"><i></i><i></i><i></i></span>' +
          (label ? '<span class="xd-uc__label">' + esc(label) + "</span>" : "") +
        "</div>" +
        '<ol class="xd-uc__steps">' + steps + "</ol>" +
      "</div>"
    );
  }

  function buildUsecases(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-uc")) return true;

    var list = c.items || [];
    if (!list.length) return true;
    var count = pad(list.length);

    // The index and the caret are aria-hidden, so each tab's name is its
    // title alone. The index shows in the tab rail, the caret in the
    // accordion (siem-xdr.css).
    var tabs = list.map(function (it, i) {
      return (
        '<button class="xd-uc__tab" type="button" id="xd-uc-tab-' + i + '" ' +
          'aria-controls="xd-uc-panel-' + i + '"' + at(i + 2) + ">" +
          '<span class="xd-uc__tab-icon" aria-hidden="true">' + icon(it.icon) + "</span>" +
          '<span class="xd-uc__tab-label">' + esc(it.title) + "</span>" +
          '<span class="xd-uc__tab-num" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<span class="xd-uc__tab-caret" aria-hidden="true">' + ARROW + "</span>" +
        "</button>"
      );
    }).join("");

    var panels = list.map(function (it, i) {
      return (
        '<div class="xd-uc__panel" id="xd-uc-panel-' + i + '" aria-labelledby="xd-uc-tab-' + i + '">' +
          '<div class="xd-uc__panel-head">' +
            '<span class="xd-uc__badge" aria-hidden="true">' + icon(it.icon) + "</span>" +
            '<div class="xd-uc__heading">' +
              '<span class="xd-uc__count" aria-hidden="true">' + pad(i + 1) + " / " + count + "</span>" +
              '<h3 class="xd-uc__title">' + esc(it.title) + "</h3>" +
            "</div>" +
          "</div>" +
          '<p class="xd-uc__text">' + esc(it.text) + "</p>" +
          storyConsole(it, c.console) +
        "</div>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("xd-uc") + '">' +
        head({ id: "xd-usecases-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        '<div class="xd-uc__selector xd-reveal"' + at(1) + ">" +
          '<div class="xd-uc__rail">' + tabs + "</div>" +
          '<div class="xd-uc__stage">' + panels + "</div>" +
        "</div>" +
      "</div>",
      "xd-uc"
    );

    useCaseSelector(root);
    return true;
  }

  function useCaseSelector(root) {
    var rail = root.querySelector(".xd-uc__rail");
    var stage = root.querySelector(".xd-uc__stage");
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".xd-uc__tab"));
    var panels = Array.prototype.slice.call(root.querySelectorAll(".xd-uc__panel"));
    var mq = window.matchMedia ? window.matchMedia(UC_ACCORDION) : null;
    var current = 0;
    var mode = "";

    function accordion() {
      return mode === "accordion";
    }

    // Selection state, written for whichever mode is live. In the
    // accordion, current is -1 when every panel is closed.
    function paint() {
      tabs.forEach(function (t, i) {
        var on = i === current;
        if (accordion()) {
          t.setAttribute("aria-expanded", on ? "true" : "false");
          t.removeAttribute("aria-selected");
          t.removeAttribute("tabindex");
        } else {
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.setAttribute("tabindex", on ? "0" : "-1");
          t.removeAttribute("aria-expanded");
        }
        t.classList.toggle("is-active", on);
        panels[i].classList.toggle("is-active", on);
      });
    }

    function layout(next) {
      if (next === mode) return;
      mode = next;

      if (accordion()) {
        rail.removeAttribute("role");
        rail.removeAttribute("aria-orientation");
        rail.removeAttribute("aria-labelledby");
        tabs.forEach(function (t, i) {
          t.removeAttribute("role");
          panels[i].setAttribute("role", "region");
          t.parentNode.insertBefore(panels[i], t.nextSibling);
        });
      } else {
        rail.setAttribute("role", "tablist");
        rail.setAttribute("aria-orientation", "vertical");
        rail.setAttribute("aria-labelledby", "xd-usecases-title");
        if (current < 0) current = 0;               // a tablist always has one
        tabs.forEach(function (t, i) {
          t.setAttribute("role", "tab");
          panels[i].setAttribute("role", "tabpanel");
          stage.appendChild(panels[i]);
        });
      }

      root.setAttribute("data-mode", mode);
      paint();
    }

    function select(i, focus) {
      current = i;
      paint();
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        // An open accordion header closes its panel; a tab always selects.
        select(accordion() && current === i ? -1 : i, false);
      });

      t.addEventListener("keydown", function (e) {
        if (accordion()) return;                    // native buttons: Tab moves between them
        var n = tabs.length;
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = n - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
      });
    });

    function sync() {
      layout(mq && mq.matches ? "accordion" : "tabs");
    }

    if (mq) {
      if (mq.addEventListener) mq.addEventListener("change", sync);
      else if (mq.addListener) mq.addListener(sync);
    }
    sync();
  }

  /* ---- 07 · Business impact -----------------------------------------------
     HawkINT's console outputs readout, set as a dark panel on a light
     ground: on desktop the header stays pinned on the left while the six
     outcomes scroll past in a night console on the right ("Outcomes" in
     its chrome bar). Each outcome is a row: a mono index on a thin rail,
     a mono value tag (MTTD, MTTR, … — labels, never numbers), the title
     and the text. The rail's node lights only when something in the row
     has keyboard focus.

     The tag sits before the title in the DOM, where it reads as a label,
     so it is aria-hidden: the title and text already say it.
     -------------------------------------------------------------------- */
  function buildImpact(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-im")) return true;

    var rows = (c.items || []).map(function (it, i) {
      return (
        '<li class="xd-im__out xd-reveal"' + at(i + 2) + ">" +
          '<span class="xd-im__glow" aria-hidden="true"></span>' +
          '<span class="xd-im__rail" aria-hidden="true">' +
            '<span class="xd-im__idx">' + pad(i + 1) + "</span>" +
          "</span>" +
          '<div class="xd-im__copy">' +
            (it.tag ? '<span class="xd-im__tag" aria-hidden="true">' + esc(it.tag) + "</span>" : "") +
            '<h3 class="xd-im__title">' + esc(it.title) + "</h3>" +
            '<p class="xd-im__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("xd-im") + '">' +
        '<div class="xd-im__aside">' +
          head({ id: "xd-impact-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub, align: "start" }) +
        "</div>" +
        (rows
          ? '<div class="xd-im__console xd-reveal"' + at(1) + ">" +
              '<div class="xd-im__bar" aria-hidden="true">' +
                '<span class="xd-im__dots"><i></i><i></i><i></i></span>' +
                '<span class="xd-im__label">' + esc(c.console || "") + "</span>" +
              "</div>" +
              '<ol class="xd-im__list">' + rows + "</ol>" +
            "</div>"
          : "") +
      "</div>",
      "xd-im"
    );

    return true;
  }

  /* ---- 08 · Integrations --------------------------------------------------
     SIEM Cloud's service manifest, re-skinned dark: seven groups as rows
     under hairlines, each with a short blue tab marker, the group name and
     either a row of mono vendor chips or the copy's own sentence. The
     chips are a nested list, so a screen reader announces how many each
     group has. Vendor names stay plain text: no logos, no brand colours.
     The CybrHawk products are the only blue chips, and link to their
     pages where CONTENT gives an href. Two columns at ≥960px, the seventh
     group (Threat Intelligence) spanning both as the closing row.

     Above the groups a two-way strip (aria-hidden) draws the paragraph's
     promise: data comes in to the platform, response actions go back.
     -------------------------------------------------------------------- */
  function vendorChip(ch) {
    if (typeof ch === "string") return '<li class="xd-ig__chip">' + esc(ch) + "</li>";
    if (!ch || !ch.label) return "";
    var cls = "xd-ig__chip" + (ch.ours ? " xd-ig__chip--ours" : "");
    return ch.href
      ? '<li class="' + cls + ' xd-ig__chip--link">' +
          '<a class="xd-ig__chip-link" href="' + esc(ch.href) + '">' + esc(ch.label) + "</a>" +
        "</li>"
      : '<li class="' + cls + '">' + esc(ch.label) + "</li>";
  }

  function flowStrip(f) {
    if (!f || !f.core) return "";
    return (
      '<div class="xd-ig__flow xd-reveal" aria-hidden="true"' + at(1) + ">" +
        (f["in"] ? '<span class="xd-ig__flow-label">' + esc(f["in"]) + "</span>" : "") +
        '<span class="xd-ig__arrow"></span>' +
        '<span class="xd-ig__flow-core">' + esc(f.core) + "</span>" +
        '<span class="xd-ig__arrow"></span>' +
        (f.out ? '<span class="xd-ig__flow-label">' + esc(f.out) + "</span>" : "") +
      "</div>"
    );
  }

  function buildIntegrations(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-ig")) return true;

    var items = (c.items || []).map(function (it, i) {
      var detail = "";
      if (it.chips && it.chips.length) {
        detail = '<ul class="xd-ig__chips">' + it.chips.map(vendorChip).join("") + "</ul>";
      } else if (it.text) {
        detail = '<p class="xd-ig__text">' + esc(it.text) + "</p>";
      }
      return (
        '<li class="xd-ig__item xd-reveal"' + at(i + 2) + ">" +
          '<h3 class="xd-ig__title">' + esc(it.title) + "</h3>" +
          detail +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("xd-ig") + '">' +
        '<div class="xd-ig__decor" aria-hidden="true"></div>' +
        '<div class="xd-shell xd-ig__inner">' +
          head({ id: "xd-integrations-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub }) +
          flowStrip(c.flow) +
          (items ? '<ul class="xd-ig__list">' + items + "</ul>" : "") +
        "</div>" +
      "</div>",
      "xd-ig"
    );

    return true;
  }

  /* ---- 09 · Why CybrHawk --------------------------------------------------
     HawkINT's reasons ledger: on desktop a header panel stays pinned on
     the left beside the five differentiators, set as one framed ledger of
     numbered rows (mono index, icon tile, claim, supporting line).

     The header panel ends in the family hub (aria-hidden), the close of
     the family story the SIEM Cloud and SIEM NDR pages start with their
     lines merging into "SIEM XDR": here every line arrives. "SIEM XDR" is
     a solid blue centre node with the six products of differentiator 5
     ringed around it, each joined by a spoke. Static. The spokes live in
     a square 0–100 viewBox, so the HTML labels sit on them by percentage
     (r = HUB_R, clockwise from the top).
     -------------------------------------------------------------------- */
  var HUB_R = 35;

  function whyHub(h) {
    var nodes = (h && h.nodes) || [];
    if (!h || !h.centre || !nodes.length) return "";
    var spokes = "";
    var keys = "";

    nodes.forEach(function (label, k) {
      var a = ((-90 + (360 / nodes.length) * k) * Math.PI) / 180;
      var x = round(50 + HUB_R * Math.cos(a));
      var y = round(50 + HUB_R * Math.sin(a));
      spokes += '<line x1="50" y1="50" x2="' + x + '" y2="' + y + '"/>';
      keys += '<span class="xd-wy__node" style="left:' + x + "%;top:" + y + '%">' + esc(label) + "</span>";
    });

    return (
      '<div class="xd-wy__hub xd-reveal" aria-hidden="true"' + at(2) + ">" +
        '<svg class="xd-wy__spokes" viewBox="0 0 100 100" focusable="false">' +
          '<circle class="xd-wy__orbit" cx="50" cy="50" r="' + HUB_R + '"/>' +
          spokes +
        "</svg>" +
        keys +
        '<span class="xd-wy__centre">' + esc(h.centre) + "</span>" +
      "</div>"
    );
  }

  function buildWhy(host, c) {
    if (!host) return false;
    if (host.querySelector(".xd-wy")) return true;

    var rows = (c.items || []).map(function (it, i) {
      return (
        '<li class="xd-wy__row xd-reveal"' + at(i + 1) + ">" +
          '<span class="xd-wy__idx" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<span class="xd-wy__tile">' + icon(it.icon) + "</span>" +
          '<div class="xd-wy__copy">' +
            '<h3 class="xd-wy__title">' + esc(it.title) + "</h3>" +
            '<p class="xd-wy__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("xd-wy") + '">' +
        '<div class="xd-wy__aside">' +
          head({ id: "xd-why-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub, align: "start" }) +
          whyHub(c.hub) +
        "</div>" +
        (rows ? '<ol class="xd-wy__ledger">' + rows + "</ol>" : "") +
      "</div>",
      "xd-wy"
    );

    return true;
  }

  /* ---- Build ------------------------------------------------------------ */
  var BUILDERS = [
    ["hero", buildHero],
    ["challenge", buildChallenge],
    ["platform", buildPlatform],
    ["capabilities", buildCapabilities],
    ["detection", buildDetection],
    ["usecases", buildUsecases],
    ["impact", buildImpact],
    ["integrations", buildIntegrations],
    ["why", buildWhy]
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
          container.classList.add("xd-section");
          if (DARK[key]) container.classList.add("xd-section--dark");
        }
        if (!b[1](host, CONTENT[key] || {})) {
          done = false;                              // container not ready
          return;
        }
      } catch (err) {
        // A builder that throws would throw again on every DOM change, so
        // it is logged once and not retried; the others carry on.
        if (window.console) {
          console.error("SIEM XDR: the " + key + " section failed to build.", err);
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
      if (window.console) console.error("SIEM XDR: anchor check failed.", err);
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
