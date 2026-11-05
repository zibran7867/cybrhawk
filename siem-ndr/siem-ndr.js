/* =====================================================================
   CybrHawk — SIEM NDR (Network Detection & Response) page, sections 01–11
   ---------------------------------------------------------------------
   The Elementor container markup is fixed, so this script injects each
   section's markup into its own empty container and pairs with
   siem-ndr.css. The FAQ and the final call to action are not built here:
   the site's existing CTA component follows section 11, which ends on
   white so the two join without a seam.

   One container per section, in page order, each set to Full Width with
   padding 0 and no background, its class in the CSS Classes field:

     nd-hero        nd-challenge   nd-outcomes    nd-engine
     nd-analyzes    nd-response    nd-usecases    nd-deploy
     nd-integrations               nd-reporting   nd-why

   On build each container also gets `nd-section` (and `nd-section--dark`
   for the four dark grounds, 01, 04, 06 and 09), which carries the shared
   tokens, so editors only ever type the one class. A missing container
   skips only its own section, and an error in one builder is logged
   without stopping the others.

   The page reads like a protocol analyzer: a thin wire carrying packet
   ticks. Most ticks are quiet blue-grey; the few in coral are detections.
   Section 04 filters the traffic down to one coral incident, section 06
   fans it out to controls along blue paths, and the rest of the page is
   calm. Coral means "a detection in the traffic" and nothing else.

   If a live class differs, change SECTIONS below — they are the only
   selectors this file touches (siem-ndr.css is scoped to the same
   classes, so rename it there too).
   ===================================================================== */
(function () {
  "use strict";

  // One container class per section. "" skips that section.
  var SECTIONS = {
    hero: ".nd-hero",
    challenge: ".nd-challenge",
    outcomes: ".nd-outcomes",
    engine: ".nd-engine",
    analyzes: ".nd-analyzes",
    response: ".nd-response",
    usecases: ".nd-usecases",
    deploy: ".nd-deploy",
    integrations: ".nd-integrations",
    reporting: ".nd-reporting",
    why: ".nd-why"
  };

  // Sections on a dark ground; their container also gets nd-section--dark.
  var DARK = { hero: true, engine: true, response: true, integrations: true };

  /* ---- Content (edit freely) -----------------------------------------

     Every string a reader sees lives here; the builders hard-code none.
     In any title, "\n" becomes a line break and [[double brackets]] set
     that run in the accent colour. An empty eyebrow is not rendered, and
     a link or button with an empty href is not rendered either.

     Icons are named per item; the glyphs are in ICONS further down.
     Labels inside decorative visuals (the hero console, the 02 strip,
     the 04 spine, the 06 stage, the 08 rollout strip, the 09 bus, the 10
     wireframes and the 11 diagram) are aria-hidden, and every one is a
     word already in the copy. Every CTA carries data-nd-cta="<placement>"
     for click tracking in GTM.
     -------------------------------------------------------------------- */
  var CONTENT = {

    hero: {
      eyebrow: "SIEM NDR · Network Detection & Response",
      // Two spans inside one <h1>; line 2 in the accent.
      title: ["When Prevention Fails,", "the Network Tells the Truth."],
      sub: "CybrHawk SIEM NDR continuously analyzes network traffic across your data center, campus, branch, cloud, and OT environments. It uses behavioral analytics, machine learning, and deep packet inspection to expose lateral movement, command-and-control, and data exfiltration that slip past endpoint and perimeter defenses.",
      cta: { label: "Request a Demo", href: "https://cybrhawk.com/request-for-demo/" },
      // Rendered only while section 04 (its target) exists.
      // TODO: confirm "Tour All Features" should land on the Detection Engine (section 04).
      ctaSecondary: { label: "Tour All Features", href: "#nd-engine" },
      trust: [
        "Agentless, full-network visibility",
        "Encrypted-traffic analytics, no decryption",
        "MITRE ATT&CK-mapped detections",
        "Automated containment in minutes"
      ],
      // The trace deck. Wire labels from section 05 item 6, detections from
      // the subheadline, the containment line from trust item 4. State words
      // are UI labels.
      //   image     optional backdrop, faded behind the right of the copy. ""
      //             (or an image that fails to load) shows none; the deck
      //             carries the hero either way
      //   imageAlt  "" because the image is atmosphere; the H1 carries the meaning
      visual: {
        label: "CybrHawk SIEM NDR",
        wires: ["East-West", "North-South"],
        detections: [
          { wire: 0, text: "Lateral movement" },
          { wire: 1, text: "Command-and-control" },
          { wire: 1, text: "Data exfiltration" }
        ],
        contained: "Automated containment in minutes",
        states: { observing: "Observing", detected: "Detected", contained: "Contained" },
        image: "",     // TODO: optional backdrop image URL (the deck carries the hero without one)
        imageAlt: ""
      }
    },

    challenge: {
      eyebrow: "The Challenge",
      title: "Attackers Live on Your Network. [[Most Tools Can’t See Them There.]]",
      body: [
        "Firewalls guard the perimeter and EDR guards the endpoint, but modern attacks happen in between. Once inside, adversaries use valid credentials and built-in tools to move laterally, establish hidden command-and-control channels, and quietly stage data for exfiltration. Unmanaged devices, IoT, OT, and encrypted traffic create blind spots where these attacks go unnoticed for weeks.",
        // Rendered as the pull line.
        "Network traffic is the one data source attackers cannot delete, disable, or evade. Every connection leaves a trace. CybrHawk SIEM NDR turns those traces into high-fidelity detections and fast, coordinated response."
      ],
      // "In between" strip labels (aria-hidden), from paragraph 1.
      strip: { from: "Perimeter", mid: "In between", to: "Endpoint" },
      items: [
        { icon: "network", title: "East-west blind spots", text: "Perimeter tools miss traffic moving between internal systems." },
        { icon: "chip",    title: "Unmanaged assets",      text: "IoT, OT, and shadow IT devices cannot run endpoint agents." },
        { icon: "lock",    title: "Encrypted threats",     text: "Most traffic is now encrypted, hiding malware callbacks and exfiltration." },
        { icon: "timer",   title: "Slow containment",      text: "Manual coordination across firewall, NAC, and identity teams lets attacks spread." }
      ]
    },

    outcomes: {
      eyebrow: "Measurable Outcomes",
      title: "What [[CybrHawk NDR]] Delivers",
      // Days → minutes graphic (aria-hidden), from outcome 1. An empty
      // `from` hides the graphic.
      visual: { from: "Days", to: "Minutes" },
      items: [
        { title: "Faster MTTD and MTTR",       text: "Detect and contain lateral movement, C2, and egress anomalies in minutes instead of days." },
        { title: "Higher Detection Fidelity",  text: "Multi-layered analytics and threat-intel fusion produce fewer, more accurate alerts with full network context." },
        { title: "Stronger Zero Trust Posture", text: "Continuously validate segmentation, enforce policy, and prove that your Zero Trust architecture works as designed." },
        { title: "Complete Asset Visibility",  text: "Discover and classify every device that talks on your network, including IoT, OT, and unmanaged endpoints." }
      ]
    },

    engine: {
      eyebrow: "Detection Engine",
      title: "A [[Multi-Layered]] Detection Engine",
      sub: "CybrHawk SIEM NDR combines five complementary detection layers, so known threats, unknown behaviors, and multi-stage attacks are all caught and correlated into a single incident.",
      // Spine labels (aria-hidden): "Layer" prefix generated; cap and end words from the paragraph.
      layerLabel: "Layer",
      spine: { start: "Traffic", end: "Single incident" },
      items: [
        { title: "Signature & Rules (IDS/IPS)",   text: "High-performance signature and rule matching detects known exploits, malware, and protocol abuse at line rate." },
        { title: "Behavior & UEBA",               text: "Per-device and per-segment baselines flag unusual peers, ports, volumes, protocols, and time-of-day activity." },
        { title: "Anomaly & Sequence Models",     text: "Machine-learning models recognize beaconing, multi-stage kill chains, data staging, and exfiltration patterns." },
        { title: "Threat Intelligence Fusion",    text: "HawkINT and curated feeds enrich every connection with reputation data and dynamic risk scoring." },
        { title: "Attack Mapping",                text: "Findings are mapped to MITRE ATT&CK tactics and techniques for fast triage, coverage analysis, and executive reporting." }
      ]
    },

    analyzes: {
      eyebrow: "What CybrHawk NDR Analyzes",
      title: "Deep Visibility Across [[Every Network, Every Protocol]]",
      // Numbered 01–06 from array order. Each cell is
      // <article id="nd-src-{slug}">, so other pages can deep-link to it.
      items: [
        { slug: "flow",      icon: "pulse", title: "Flow & Packet Metadata",
          text: "NetFlow, IPFIX, and sFlow telemetry, SPAN/mirror ports and TAPs, plus on-demand selective PCAP for forensic evidence." },
        { slug: "iot-ot",    icon: "chip",  title: "IoT, OT & Shadow IT",
          text: "Passive fingerprinting identifies device type, vendor, and behavior, and flags rogue or unauthorized assets." },
        { slug: "dns-web",   icon: "globe", title: "DNS & Web Traffic",
          text: "Detection of newly registered domains, DGA activity, suspicious TLDs, malware callbacks, and TLS SNI anomalies." },
        { slug: "cloud",     icon: "cloud", title: "Cloud Traffic",
          text: "AWS VPC Flow Logs, Azure NSG Flow Logs, GCP VPC Flow Logs, and cloud traffic mirroring." },
        { slug: "encrypted", icon: "lock",  title: "Encrypted Traffic",
          text: "JA3/JA4-style TLS fingerprinting, certificate anomalies, and handshake behavior analysis, without decrypting payloads." },
        { slug: "directions", icon: "axes", title: "East-West & North-South",
          text: "Internal lateral traffic and internet-bound egress analyzed together for complete attack context." }
      ]
    },

    response: {
      eyebrow: "Response & Orchestration",
      title: "From Detection to [[Containment in Minutes]]",
      sub: "Detection alone does not stop an attack. CybrHawk SIEM NDR orchestrates response across your network, identity, and endpoint controls, with approvals and guardrails that keep your team in control.",
      // Stage labels (aria-hidden), from the paragraph.
      core: "CybrHawk SIEM NDR",
      gate: "Approvals · Guardrails",
      items: [
        { title: "Firewalls, SD-WAN & SASE", text: "Push blocks, update ACLs, and quarantine malicious paths at the edge and across branches." },
        { title: "NAC & SDN",                text: "Move compromised devices to restricted VLANs and enforce microsegmentation automatically." },
        { title: "Identity, EDR & Email",    text: "Disable compromised credentials, isolate hosts, and quarantine malicious messages." },
        { title: "ITSM & SOAR",              text: "Open tickets, trigger playbooks, and notify on-call responders with built-in approval workflows." }
      ]
    },

    usecases: {
      eyebrow: "Use Cases",
      title: "Purpose-Built for [[Real-World Network Threats]]",
      // Direction tags: words from section 05 item 6. The assignment is an
      // interpretation. TODO: confirm each card's direction with product.
      // Empty directions hide both the tags and the legend.
      directions: { ew: "East-West", ns: "North-South" },
      items: [
        { dir: "ns", icon: "beacon",        title: "Command-and-Control & Beaconing",
          text: "Identify periodic callbacks, rare SNI and certificate usage, and connections to risky or newly registered destinations." },
        { dir: "ns", icon: "database-leak", title: "Data Exfiltration",
          text: "Detect unusual egress volumes, covert channels such as DNS tunneling, and geolocation outliers before sensitive data leaves." },
        { dir: "ew", icon: "lateral",       title: "Lateral Movement",
          text: "Expose SMB, RDP, and WinRM misuse, credential spraying, and pivot hotspots as attackers move through your environment." },
        { dir: "ew", icon: "factory",       title: "IoT & OT Security",
          text: "Discover unmanaged devices, enforce segmentation, and flag unsafe industrial and legacy protocols." },
        { dir: "ns", icon: "cloud",         title: "Cloud Egress Control",
          text: "Monitor inter-VPC and VNet flows, unexpected internet exposure, and access-key misuse in cloud workloads." },
        { dir: "ew", icon: "shield",        title: "Zero Trust Validation",
          text: "Continuously verify that segmentation policies are enforced and detect drift the moment it happens." }
      ]
    },

    deploy: {
      eyebrow: "Deployment Options",
      title: "Deploy Your Way, [[Start Fast, Scale Easily]]",
      panelLabel: "Deploy",   // chrome bar label, from the H2
      items: [
        { icon: "network",     title: "Virtual & Physical Sensors",
          text: "Deploy via SPAN, mirror ports, or TAPs across data centers, campuses, and branch offices." },
        { icon: "cloud",       title: "Cloud Sensors",
          text: "Native traffic mirroring and flow-log ingestion for AWS, Azure, and Google Cloud." },
        { icon: "layers",      title: "Lightweight Rollout",
          text: "Start with flow telemetry for instant visibility, then add packet metadata and selective PCAP as you mature.",
          // Rollout strip (aria-hidden), from this item's text.
          steps: ["Flow telemetry", "Packet metadata", "Selective PCAP"] },
        { icon: "fingerprint", title: "Privacy-Preserving Analytics",
          text: "Analyze encrypted traffic without decrypting payloads, supporting privacy and regulatory obligations." }
      ]
    },

    integrations: {
      eyebrow: "Integrations",
      title: "Integrates With Your [[Network and Security Ecosystem]]",
      bus: "CybrHawk SIEM NDR",
      portLabel: "Port",
      // chips: split from the copy's list, joining "and" dropped. tail: the rest, verbatim.
      // own: the chip that is a CybrHawk product (shown in blue).
      items: [
        { title: "Firewalls & Gateways", chips: ["Palo Alto Networks", "Fortinet", "Check Point", "Cisco"], tail: "and more" },
        { title: "NAC, SDN & Switching", chips: ["Cisco ISE", "Aruba ClearPass", "VMware NSX"], tail: "and more" },
        { title: "Cloud",                chips: ["AWS", "Microsoft Azure", "Google Cloud"], tail: "flow logs and traffic mirroring" },
        { title: "EDR, SIEM & ITSM",     chips: ["CybrHawk SIEM XDR", "ServiceNow", "Jira"], tail: "and leading EDR platforms", own: "CybrHawk SIEM XDR" }
      ]
    },

    reporting: {
      eyebrow: "Reporting & KPIs",
      title: "Reporting That Speaks to [[Analysts and Executives]]",
      // wire: the CSS wireframe type (tiles | timeline | progress | gauges);
      // labels come from each item's own text (aria-hidden).
      items: [
        { icon: "dashboard",  title: "Executive Dashboards", wire: "tiles",
          text: "Top talkers, risky destinations, blocked versus allowed traffic, and critical incidents at a glance.",
          labels: ["Top talkers", "Risky destinations", "Blocked versus allowed traffic", "Critical incidents"] },
        { icon: "clipboard",  title: "Incident Workbench",   wire: "timeline",
          text: "Unified timelines, peer graphs, evidence attachments, and ATT&CK mapping in a single investigation view.",
          labels: ["ATT&CK mapping"] },
        { icon: "file-check", title: "Compliance Scorecards", wire: "progress",
          text: "Track segmentation drift, log coverage, and retention evidence for audits.",
          labels: ["Segmentation drift", "Log coverage", "Retention evidence"] },
        { icon: "timer",      title: "Operational KPIs",     wire: "gauges",
          text: "Measure MTTD for lateral movement and C2, exfiltration detection time, segment coverage, and false-positive rate.",
          labels: ["MTTD", "Exfiltration detection time", "Segment coverage", "False-positive rate"] }
      ]
    },

    why: {
      eyebrow: "",   // "Why CybrHawk" would repeat the H2
      title: "Why CybrHawk for [[Network Detection & Response]]",
      // Item 1 is the dark anchor; its diagram labels come from its own text.
      // The first lane is this product, drawn solid blue.
      diagram: { lanes: ["Network", "Endpoint", "Cloud", "Identity"], end: "SIEM XDR" },
      items: [
        { icon: "",        title: "Native SIEM Integration",
          text: "Network detections flow directly into CybrHawk SIEM XDR for cross-domain correlation with endpoint, cloud, and identity data." },
        { icon: "layers",  title: "IT, Cloud, and OT in One View",
          text: "A single platform covers enterprise, cloud, and industrial networks." },
        { icon: "headset", title: "Expert-Backed Operations",
          text: "Optional 24/7 monitoring and threat hunting from the CybrHawk SOC." },
        { icon: "plug",    title: "Vendor-Agnostic by Design",
          text: "Works with the firewalls, switches, and security tools you already own." },
        { icon: "link",    title: "Part of Unified Cyber Defense",
          text: "Connects natively with ITDR, OT Security Monitoring, HawkINT, and IR One." }
      ]
    }
  };

  // Fade/rise each section's content in as it scrolls into view, the
  // hero's one-off load stagger, and the one-off draws (04 spine, 08
  // rollout strip, 09 jacks).
  var ANIMATE = true;

  // The hero deck's sweep: observing → detected → contained, again. Stops
  // off screen and in a background tab; static in its final state under
  // reduced motion.
  var HERO_LOOP = true;

  // Packet ticks travelling down the 04 spine, and the 06 signals. Both
  // pause off screen and in a background tab; still under reduced motion.
  var ENGINE_MOTION = true;
  var RESPONSE_MOTION = true;

  /* Section 04's packet density: how many ticks travel each stretch of
     the spine, from "Traffic" into layer 1, then out of layers 1–4.
     After layer 5 a single coral tick is left: the incident. */
  var ENGINE_PACKETS = [6, 5, 4, 3, 2];
  /* -------------------------------------------------------------------- */

  /* ---- Icons ------------------------------------------------------------
     24×24 strokes that follow currentColor. Glyphs shared with
     siem-cloud.js, incident-response.js, udc.js and hawk-int.js are copied
     as-is so the same idea reads the same across the site; the new ones
     (axes, beacon, lateral, dir-ew, dir-ns) are drawn to the same grid
     and weight.
     -------------------------------------------------------------------- */
  var ICONS = {
    // From siem-cloud.js / incident-response.js / udc.js
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
    "file-check":
      '<path d="M14 2.9H7.4a2 2 0 0 0-2 2v14.2a2 2 0 0 0 2 2h9.2a2 2 0 0 0 ' +
        '2-2V7.9z"/>' +
      '<polyline points="13.9 2.9 13.9 8 19 8"/>' +
      '<path d="m9.2 14.6 2 2 3.8-4"/>',
    check:
      '<path d="m6.6 12.4 3.6 3.6 7.2-7.6"/>',
    layers:
      '<path d="M12 3.2 21 7.8l-9 4.6-9-4.6z"/>' +
      '<path d="m3 12.2 9 4.6 9-4.6"/>' +
      '<path d="m3 16.4 9 4.6 9-4.6"/>',
    headset:
      '<path d="M4.6 13.4V12a7.4 7.4 0 0 1 14.8 0v1.4"/>' +
      '<rect x="3.4" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<rect x="16.8" y="13.4" width="3.8" height="5.8" rx="1.6"/>' +
      '<path d="M18.7 19.2v.2a2.4 2.4 0 0 1-2.4 2.4h-3.1"/>',
    link:
      '<path d="M10.2 13.8a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1.2 1.2"/>' +
      '<path d="M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1.2-1.2"/>',
    dashboard:
      '<rect x="3" y="4.2" width="18" height="12.4" rx="2.2"/>' +
      '<path d="M12 16.6v3.6M8.4 20.2h7.2"/>' +
      '<path d="m6.8 12.6 3.1-3.1 2.6 2.4 4.7-4.7"/>',
    cloud:
      '<path d="M7.2 18.6h10.1a4.1 4.1 0 0 0 .5-8.2 5.6 5.6 0 0 0-10.9 1.3A3.5 3.5 0 0 0 7.2 18.6z"/>',
    timer:
      '<circle cx="12" cy="13.4" r="7.4"/>' +
      '<path d="M12 13.4V9.6M9.6 2.8h4.8M12 2.8V6M18.4 6.6l1.4-1.4"/>',
    pulse:
      '<path d="M2.8 12.4h4l2.4-5.6 4.2 11 2.6-5.4h5.2"/>',
    factory:
      '<path d="M2.8 20.2h18.4"/>' +
      '<path d="M4 20V9.6l5.2 3.4V9.6l5.2 3.4V5.4h3.2L19 20"/>' +
      '<path d="M7.4 16.6h1.4M12.6 16.6H14"/>',
    "database-leak":
      '<ellipse cx="10.4" cy="5.8" rx="6.6" ry="2.6"/>' +
      '<path d="M3.8 5.8v12c0 1.4 3 2.6 6.6 2.6"/>' +
      '<path d="M17 5.8v4.4"/>' +
      '<path d="M3.8 11.8c0 1.4 3 2.6 6.6 2.6"/>' +
      '<path d="M17.6 13c1.7 2.1 2.8 3.6 2.8 4.9a2.8 2.8 0 0 1-5.6 0c0-1.3 1.1-2.8 2.8-4.9z"/>',
    clipboard:
      '<rect x="5.2" y="4.6" width="13.6" height="16.4" rx="2.2"/>' +
      '<rect x="8.8" y="2.8" width="6.4" height="3.6" rx="1.2"/>' +
      '<path d="M8.8 11.4h6.4M8.8 15h4.4"/>',
    fingerprint:
      '<path d="M4.6 8.6a8.4 8.4 0 0 1 14.8 0"/>' +
      '<path d="M5.6 17.4c.6-1.6.9-3.4.9-5.4a5.5 5.5 0 0 1 11 0c0 2.6-.3 5-.9 7.2"/>' +
      '<path d="M9.2 20.4c.8-2.6 1.2-5.4 1.2-8.4a1.6 1.6 0 0 1 3.2 0c0 1.8-.1 3.4-.4 5"/>' +
      '<path d="M12.8 20.6c.2-.6.4-1.2.5-1.8"/>',
    lock:
      '<rect x="4.8" y="10.6" width="14.4" height="10" rx="2.2"/>' +
      '<path d="M8.2 10.6V7.8a3.8 3.8 0 0 1 7.6 0v2.8"/>' +
      '<path d="M12 14.6v2.2"/>',
    plug:
      '<path d="M9 3.4v4.2M15 3.4v4.2"/>' +
      '<path d="M6.6 7.6h10.8v3.2a5.4 5.4 0 0 1-10.8 0z"/>' +
      '<path d="M12 16.2v4.4"/>',
    // From hawk-int.js, redrawn at this file's stroke weight.
    chip:
      '<rect x="7" y="7" width="10" height="10" rx="2"/>' +
      '<path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',

    // 05 · East-West & North-South: both directions of traffic, crossing.
    axes:
      '<path d="M3.4 12h17.2M12 3.4v17.2"/>' +
      '<path d="M6 9.2 3.4 12 6 14.8M18 9.2l2.6 2.8-2.6 2.8M9.2 6 12 3.4 14.8 6M9.2 18l2.8 2.6 2.8-2.6"/>',

    // 07 · Use cases
    // A dot calling out: two arcs leave it, the periodic callback.
    beacon:
      '<circle cx="6.4" cy="17.6" r="1.8"/>' +
      '<path d="M6.4 11.2a6.4 6.4 0 0 1 6.4 6.4"/>' +
      '<path d="M6.4 5.6a12 12 0 0 1 12 12"/>',
    // Two hosts and the sideways hop between them.
    lateral:
      '<rect x="2.8" y="8.2" width="5.6" height="7.6" rx="1.6"/>' +
      '<rect x="15.6" y="8.2" width="5.6" height="7.6" rx="1.6"/>' +
      '<path d="M10.4 12h3.6M12.2 9.8l2.2 2.2-2.2 2.2"/>',
    // Direction tags: drawn as glyphs so shape, not colour, tells them apart.
    "dir-ew":
      '<path d="M3.6 12h16.8M7.4 8.2 3.6 12l3.8 3.8M16.6 8.2l3.8 3.8-3.8 3.8"/>',
    "dir-ns":
      '<path d="M12 3.6v16.8M8.2 7.4 12 3.6l3.8 3.8M8.2 16.6l3.8 3.8 3.8-3.8"/>'
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
     ("Real-World", "Multi-Layered") is kept whole, so a balanced title
     never breaks at its hyphen; the text itself is unchanged. */
  function markup(s) {
    return nl2br(s)
      .replace(/[A-Za-z0-9’']+(?:-[A-Za-z0-9’']+)+/g, function (word) {
        return '<span class="nd-nowrap">' + word + "</span>";
      })
      .replace(/\[\[(.+?)\]\]/g, function (_, run) {
        return '<span class="nd-accent">' + run + "</span>";
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
    return "nd-shell " + cls + (ANIMATE ? " is-animated" : "");
  }

  /* A full-bleed root, for the sections whose decoration runs edge to
     edge past the measure: the root is the positioned, clipped layer and
     an inner .nd-shell holds the content. */
  function bleedClass(cls) {
    return cls + (ANIMATE ? " is-animated" : "");
  }

  function reducedMotion() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Eyebrow (mono, led by the packet-trace mark), H2, sub. An empty
     eyebrow or sub is dropped rather than left as an empty paragraph. A
     <div>, not a <header>: outside an <article> or <section> a <header>
     is announced as a banner landmark, and ten of those would bury the
     site's real one. */
  function head(o) {
    return (
      '<div class="nd-head' + (o.align === "start" ? " nd-head--start" : "") +
        ' nd-reveal">' +
        (o.eyebrow ? '<p class="nd-eyebrow">' + esc(o.eyebrow) + "</p>" : "") +
        '<h2 class="nd-head__title" id="' + o.id + '">' + markup(o.title) + "</h2>" +
        (o.sub ? '<p class="nd-head__sub">' + esc(o.sub) + "</p>" : "") +
      "</div>"
    );
  }

  /* kind: "primary" (solid blue) or "outline" (ink hairline, for the
     light hero). No href, no button: an empty or "#" link would only
     reload the page. */
  function button(b, kind, placement) {
    if (!b || !b.label || !b.href || b.href === "#") return "";
    return (
      '<a class="nd-btn nd-btn--' + kind + '" href="' + esc(b.href) + '" ' +
        'data-nd-cta="' + placement + '">' +
        '<span class="nd-btn__label">' + esc(b.label) + "</span>" + ARROW +
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
     settled (say the engine builder threw). */
  var ANCHOR_HOSTS = { "nd-engine": "engine" };

  function anchorLive(href) {
    if (!href || href.charAt(0) !== "#") return true;
    var id = href.slice(1);
    if (document.getElementById(id)) return true;
    var key = ANCHOR_HOSTS[id];
    return !!(key && SECTIONS[key] && document.querySelector(SECTIONS[key]));
  }

  function prune() {
    var links = document.querySelectorAll('a[data-nd-cta][href^="#"]');
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

  // The CSS loops (04 packets, 06 signals) only need pausing: .is-paused
  // sets animation-play-state on everything inside.
  function pauseOffscreen(el) {
    whileVisible(el, function (on) {
      el.classList.toggle("is-paused", !on);
    });
  }

  /* In-page links (#nd-engine) glide unless the reader prefers reduced
     motion, in which case the browser's own jump runs untouched. Either
     way the target's scroll-margin keeps its heading clear of a sticky
     header, and focus moves to it, so keyboard users continue from
     there. Delegated from the section root. */
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
     The analyzer. A night hero, full width: the eyebrow and the H1 run
     across the whole measure, the sub and the buttons sit under it side
     by side, and below them the "trace deck" runs edge to edge across
     the screen, the page's thesis drawn as an instrument: two wires of
     quiet packet ticks (East-West, North-South) and a playhead that
     sweeps them left to right. Each detection lights coral the moment
     the playhead crosses it; when the sweep ends the ticks freeze, every
     marker turns blue and "Automated containment in minutes" lights in
     the deck's readout bar. The trust points close the hero as a strip.

     The deck is decoration (aria-hidden): the H1 and the copy already say
     all of it. Its default styles are the final, contained state, which
     is what reduced motion shows. The playhead is a CSS animation of
     known length (SWEEP_MS), so the script lights each marker on a timer
     at its own share of the sweep (data-at). Off screen or in a hidden
     tab the cycle stops; back in view it starts over from the left.

     An optional banner (CONTENT.hero.visual.image) sits behind the right
     of the copy as a faded backdrop; the deck carries the hero without it.
     -------------------------------------------------------------------- */

  // The playhead's run across the deck, the contained hold, then the clear.
  var SWEEP_MS = 5600;
  var HOLD_MS = 2600;
  var CLEAR_MS = 600;
  // Waits out the load stagger before the first sweep.
  var LOOP_START_MS = 1100;

  /* Where each detection pins onto its wire (% across the screen), in
     CONTENT order, and which side of the wire its pill sits on. A pill
     left of centre runs right from its tick, one right of centre runs
     left, so none ever leaves the screen. */
  var MARKS = [
    { at: 34, side: "up" },
    { at: 56, side: "up" },
    { at: 78, side: "down" }
  ];

  // Inline delay for the hero's load stagger.
  function after(ms) {
    return ' style="--d:' + ms + 'ms"';
  }

  function heroDeck(v) {
    var states = v.states || {};
    var dets = v.detections || [];

    var lanes = (v.wires || []).map(function (w, k) {
      var marks = "";
      dets.forEach(function (d, j) {
        if (d.wire !== k) return;
        var m = MARKS[j % MARKS.length];
        marks +=
          '<span class="nd-hr__mark nd-hr__mark--' + m.side +
            " nd-hr__mark--" + (m.at < 50 ? "start" : "end") + '" ' +
            'data-at="' + m.at + '" style="left:' + m.at + '%">' +
            '<span class="nd-hr__mark-tick"></span>' +
            '<span class="nd-hr__mark-pill">' + esc(d.text) + "</span>" +
          "</span>";
      });
      return (
        '<div class="nd-hr__lane nd-hr__lane--' + (k + 1) + '">' +
          '<span class="nd-hr__track">' +
            '<span class="nd-shell nd-hr__lane-label">' + esc(w) + "</span>" +
            '<span class="nd-hr__baseline"></span>' +
            '<span class="nd-hr__ticks"></span>' +
            marks +
          "</span>" +
        "</div>"
      );
    }).join("");

    function state(key) {
      return states[key]
        ? '<span class="nd-hr__state nd-hr__state--' + key + '">' + esc(states[key]) + "</span>"
        : "";
    }

    return (
      '<div class="nd-hr__deck nd-hr__in" aria-hidden="true" style="--d:300ms;--sweep:' + SWEEP_MS + 'ms">' +
        '<div class="nd-shell nd-hr__readout">' +
          '<span class="nd-hr__rec"></span>' +
          '<span class="nd-hr__label">' + esc(v.label || "") + "</span>" +
          (v.contained
            ? '<span class="nd-hr__contain">' +
                '<span class="nd-hr__node">' + icon("check") + "</span>" +
                '<span class="nd-hr__contain-text">' + esc(v.contained) + "</span>" +
              "</span>"
            : "") +
          '<span class="nd-hr__status">' +
            state("observing") + state("detected") + state("contained") +
          "</span>" +
        "</div>" +
        '<div class="nd-hr__lanes">' +
          lanes +
          '<span class="nd-hr__playhead"><span class="nd-hr__cursor"></span></span>' +
        "</div>" +
      "</div>"
    );
  }

  /* One cycle: observing → each detection as the playhead reaches it →
     contained → hold → clear → again. Never starts under reduced motion
     (the CSS default is the final state). */
  function heroLoop(deck) {
    if (!HERO_LOOP || !deck || reducedMotion()) return;

    var marks = Array.prototype.slice.call(deck.querySelectorAll(".nd-hr__mark"));
    var timers = [];
    var running = false;
    var ready = false;

    // Starts empty: the first sweep fades the wires in.
    deck.classList.add("is-looping");
    deck.classList.add("is-clearing");
    deck.setAttribute("data-state", "observing");

    function later(ms, fn) {
      timers.push(setTimeout(fn, ms));
    }

    function stop() {
      timers.forEach(clearTimeout);
      timers = [];
      deck.classList.remove("is-sweeping");
    }

    function cycle() {
      stop();
      marks.forEach(function (m) {
        m.classList.remove("is-hit");
      });
      deck.setAttribute("data-state", "observing");
      deck.classList.remove("is-clearing");

      // Restart the playhead's run: a reflow between the two class
      // changes makes the browser treat it as a new animation.
      void deck.offsetWidth;
      deck.classList.add("is-sweeping");

      marks.forEach(function (m) {
        var share = parseFloat(m.getAttribute("data-at")) / 100;
        later(Math.round(SWEEP_MS * share), function () {
          m.classList.add("is-hit");
          deck.setAttribute("data-state", "detected");
        });
      });

      later(SWEEP_MS + 200, function () {
        deck.setAttribute("data-state", "contained");
      });

      later(SWEEP_MS + 200 + HOLD_MS, function () {
        deck.classList.add("is-clearing");
      });

      later(SWEEP_MS + 200 + HOLD_MS + CLEAR_MS, cycle);
    }

    whileVisible(deck, function (on) {
      deck.classList.toggle("is-paused", !on);
      if (on === running) return;
      running = on;
      if (!ready) return;
      if (on) {
        cycle();
      } else {
        stop();
        deck.classList.add("is-clearing");
      }
    });

    setTimeout(function () {
      ready = true;
      if (running) cycle();
    }, LOOP_START_MS);
  }

  // Atmosphere only: faded behind the right of the copy, never the
  // largest paint, and gone if it fails to load.
  function heroBackdrop(v) {
    if (!v.image) return "";
    return (
      '<img class="nd-hr__backdrop" src="' + esc(v.image) + '" alt="' + esc(v.imageAlt || "") + '" ' +
        'decoding="async">'
    );
  }

  function buildHero(host, c) {
    if (!host) return false;                         // container not ready
    if (host.querySelector(".nd-hr")) return true;   // already built

    var v = c.visual || {};
    var title = c.title || [];
    if (typeof title === "string") title = [title];

    // Each readout point arrives on its own beat after the deck.
    var trust = (c.trust || []).map(function (t, i) {
      return (
        '<li class="nd-hr__trust-item nd-hr__in"' + after(400 + i * 70) + ">" +
          '<span class="nd-hr__check">' + icon("check") + "</span>" +
          esc(t) +
        "</li>"
      );
    }).join("");

    // Separate spans for colour and stagger, with real spaces between
    // them so a screen reader reads one sentence. Each line is a mask
    // (the outer span) that its text rises out of (the inner one).
    var lines = title.map(function (line, i) {
      return (
        '<span class="nd-hr__line nd-hr__line--' + (i + 1) + '">' +
          '<span class="nd-hr__line-in"' + after(80 * (i + 1)) + ">" + esc(line) + "</span>" +
        "</span>"
      );
    }).join(" ");

    var second = c.ctaSecondary || {};
    var actions = button(c.cta, "primary", "hero-primary") +
                  (anchorLive(second.href) ? button(second, "ghost", "hero-secondary") : "");

    var root = mount(
      host,
      '<div class="' + bleedClass("nd-hr") + '">' +
        '<div class="nd-hr__decor" aria-hidden="true"></div>' +
        heroBackdrop(v) +
        '<div class="nd-shell nd-hr__inner">' +
          (c.eyebrow
            ? '<p class="nd-eyebrow nd-hr__eyebrow nd-hr__in"' + after(0) + ">" + esc(c.eyebrow) + "</p>"
            : "") +
          '<h1 class="nd-hr__title">' + lines + "</h1>" +
          '<div class="nd-hr__lede">' +
            (c.sub ? '<p class="nd-hr__sub nd-hr__in"' + after(240) + ">" + esc(c.sub) + "</p>" : "") +
            (actions
              ? '<div class="nd-hr__actions nd-hr__in"' + after(320) + ">" + actions + "</div>"
              : "") +
          "</div>" +
        "</div>" +
        heroDeck(v) +
        (trust
          ? '<div class="nd-shell nd-hr__bottom"><ul class="nd-hr__trust">' + trust + "</ul></div>"
          : "") +
      "</div>",
      "nd-hr"
    );

    var img = root.querySelector(".nd-hr__backdrop");
    if (img) {
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.removeChild(img);
      });
    }

    heroLoop(root.querySelector(".nd-hr__deck"));
    bindAnchors(root);
    return true;
  }

  /* ---- 02 · The challenge -------------------------------------------------
     Copy on the left, the second paragraph (the page's thesis) set as a
     pull line; on the right the four pain points as one risk register
     (IR's design: a single card of rows, not four cards).

     The register opens with the "in between" strip (aria-hidden): a wire
     from Perimeter to Endpoint, quiet ticks along it and one coral tick
     in the middle, where paragraph 1 says the attacks happen. A dashed
     page wire runs on behind the card at the strip's height, so the
     strip reads as one stretch of a longer line.
     -------------------------------------------------------------------- */
  function challengeStrip(s) {
    if (!s || !s.from) return "";
    return (
      '<div class="nd-ch__strip" aria-hidden="true">' +
        '<span class="nd-ch__key nd-ch__key--from">' + esc(s.from) + "</span>" +
        '<span class="nd-ch__key nd-ch__key--mid">' + esc(s.mid || "") + "</span>" +
        '<span class="nd-ch__key nd-ch__key--to">' + esc(s.to || "") + "</span>" +
        '<span class="nd-ch__wire"><i class="nd-ch__hit"></i></span>' +
      "</div>"
    );
  }

  function buildChallenge(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-ch")) return true;

    // Paragraph 1 is the lead; paragraph 2 is the thesis, as a pull line.
    var body = (c.body || []).map(function (p, i) {
      var cls = i === 0 ? " nd-ch__p--lead" : i === 1 ? " nd-ch__p--pull" : "";
      return '<p class="nd-ch__p' + cls + '">' + esc(p) + "</p>";
    }).join("");

    var items = (c.items || []).map(function (it) {
      return (
        '<li class="nd-ch__risk">' +
          '<span class="nd-ch__badge">' + icon(it.icon) + "</span>" +
          '<div class="nd-ch__risk-body">' +
            '<h3 class="nd-ch__risk-title">' + esc(it.title) + "</h3>" +
            '<p class="nd-ch__risk-text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("nd-ch") + '">' +
        '<div class="nd-shell nd-ch__inner">' +
          '<div class="nd-ch__lede">' +
            head({ id: "nd-challenge-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
            (body ? '<div class="nd-ch__body nd-reveal"' + at(1) + ">" + body + "</div>" : "") +
          "</div>" +
          (items
            ? '<div class="nd-ch__visual nd-reveal"' + at(2) + ">" +
                '<div class="nd-ch__register">' +
                  challengeStrip(c.strip) +
                  '<ul class="nd-ch__risks">' + items + "</ul>" +
                "</div>" +
              "</div>"
            : "") +
        "</div>" +
      "</div>",
      "nd-ch"
    );

    return true;
  }

  /* ---- 03 · Measurable outcomes -------------------------------------------
     SIEM Cloud's impact split: on desktop the header and a small graphic
     stay pinned on the left while the four outcomes scroll past on the
     right, each a row with a numbered tile.

     The graphic draws outcome 1 ("in minutes instead of days"): two bars
     from one baseline, a long faded trace labelled Days and a short solid
     blue bar ending in a check, labelled Minutes. No numbers, no axis.
     It is decoration (aria-hidden); the list says it in words.
     -------------------------------------------------------------------- */
  function outcomesVisual(v) {
    if (!v || !v.from) return "";
    return (
      '<div class="nd-oc__visual nd-reveal" aria-hidden="true"' + at(2) + ">" +
        '<span class="nd-oc__row nd-oc__row--from">' +
          '<span class="nd-oc__key">' + esc(v.from) + "</span>" +
          '<span class="nd-oc__track"><span class="nd-oc__bar"></span></span>' +
        "</span>" +
        (v.to
          ? '<span class="nd-oc__row nd-oc__row--to">' +
              '<span class="nd-oc__key">' + esc(v.to) + "</span>" +
              '<span class="nd-oc__track">' +
                '<span class="nd-oc__bar"></span>' +
                '<span class="nd-oc__node">' + icon("check") + "</span>" +
              "</span>" +
            "</span>"
          : "") +
      "</div>"
    );
  }

  function buildOutcomes(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-oc")) return true;

    var items = (c.items || []).map(function (it, i) {
      return (
        '<li class="nd-oc__row-item nd-reveal"' + at(i + 1) + ">" +
          '<span class="nd-oc__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<div class="nd-oc__body">' +
            '<h3 class="nd-oc__title">' + esc(it.title) + "</h3>" +
            '<p class="nd-oc__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("nd-oc") + '">' +
        '<div class="nd-oc__aside">' +
          head({ id: "nd-outcomes-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
          outcomesVisual(c.visual) +
        "</div>" +
        (items ? '<ol class="nd-oc__list">' + items + "</ol>" : "") +
      "</div>",
      "nd-oc"
    );

    return true;
  }

  /* ---- 04 · Detection engine ----------------------------------------------
     The signature section, on HawkINT's vertical process spine. The five
     layers are an <ol>, each a numbered node on the spine with its title
     and text; and the spine is the filter. It starts at a "Traffic" cap
     above layer 1 and ends below layer 5 in a coral "Single incident"
     node. Packet ticks travel down it, dense above layer 1 and fewer
     after each node, until one coral tick reaches the end.

     Every stretch of the spine belongs to the layer it leaves from and is
     sized off that layer's own box plus the list gap, so it threads the
     node centres however the text wraps (HawkINT's per-step connector).
     Each stretch clips its own ticks, and the nodes sit on top with a
     solid fill, so a tick vanishes into a node and fewer leave it.

     The root carries id="nd-engine", the hero's "Tour All Features"
     target; tabindex="-1" lets that link move focus here as well as
     scroll. --i is when the drawing spine reaches each node (i × 0.25s).
     -------------------------------------------------------------------- */
  function enPackets(n, hit) {
    var s = "";
    for (var p = 0; p < n; p++) {
      s += '<i class="nd-en__packet' + (hit ? " nd-en__packet--hit" : "") +
        '" style="--p:' + p + ";--n:" + n + '"></i>';
    }
    return s;
  }

  function enStretch(kind, n, hit) {
    return (
      '<span class="nd-en__seg nd-en__seg--' + kind + '">' +
        '<span class="nd-en__wire"></span>' +
        '<span class="nd-en__packets">' + enPackets(n, hit) + "</span>" +
      "</span>"
    );
  }

  function buildEngine(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-en")) return true;

    var layers = c.items || [];
    var n = layers.length;
    var spine = c.spine || {};

    var items = layers.map(function (it, i) {
      var rail = "";
      if (i === 0) {
        rail += enStretch("in", ENGINE_PACKETS[0] || 1, false);
        if (spine.start) rail += '<span class="nd-en__cap">' + esc(spine.start) + "</span>";
      }
      if (i < n - 1) {
        rail += enStretch("next", ENGINE_PACKETS[i + 1] || 1, false);
      } else {
        rail += enStretch("out", 1, true) +
          '<span class="nd-en__end">' +
            '<span class="nd-en__end-node"></span>' +
            (spine.end ? '<span class="nd-en__end-label">' + esc(spine.end) + "</span>" : "") +
          "</span>";
      }

      return (
        '<li class="nd-en__layer' + (i === n - 1 ? " nd-en__layer--last" : "") + '" style="--i:' + (i + 1) + '">' +
          '<span class="nd-en__rail" aria-hidden="true">' + rail + "</span>" +
          '<span class="nd-en__node" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<div class="nd-en__body nd-reveal"' + at(i + 2) + ">" +
            (c.layerLabel
              ? '<span class="nd-en__label" aria-hidden="true">' + esc(c.layerLabel) + " " + pad(i + 1) + "</span>"
              : "") +
            '<h3 class="nd-en__title">' + esc(it.title) + "</h3>" +
            '<p class="nd-en__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + bleedClass("nd-en") + '" id="nd-engine" tabindex="-1">' +
        '<div class="nd-en__decor" aria-hidden="true"></div>' +
        '<div class="nd-shell nd-en__inner">' +
          '<div class="nd-en__aside">' +
            head({ id: "nd-engine-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub, align: "start" }) +
          "</div>" +
          (items
            ? '<div class="nd-en__flow">' +
                '<span class="nd-en__glow nd-en__glow--top" aria-hidden="true"></span>' +
                '<span class="nd-en__glow nd-en__glow--end" aria-hidden="true"></span>' +
                '<ol class="nd-en__layers' + (spine.start ? " has-cap" : "") + '">' + items + "</ol>" +
              "</div>"
            : "") +
        "</div>" +
      "</div>",
      "nd-en"
    );

    var flow = root.querySelector(".nd-en__flow");
    if (flow && ENGINE_MOTION && ANIMATE && !reducedMotion()) {
      flow.classList.add("is-moving");
      pauseOffscreen(flow);
    }

    return true;
  }

  /* ---- 05 · What NDR analyzes ---------------------------------------------
     HawkINT's datasheet: one white panel split by 1px hairlines into a
     3×2 grid (2 columns on tablets, 1 on phones), each cell led by a large
     ghosted index numeral, then an icon and title on one row, then the
     body. The cells are static, so their hover is a tint only: no lift, no
     pointer.
     -------------------------------------------------------------------- */
  function buildAnalyzes(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-an")) return true;

    var cells = (c.items || []).map(function (it, i) {
      var id = it.slug ? ' id="nd-src-' + esc(it.slug) + '"' : "";
      return (
        '<li class="nd-an__item">' +
          '<article class="nd-an__cell nd-reveal"' + id + at(i + 1) + ">" +
            '<span class="nd-an__index" aria-hidden="true">' + pad(i + 1) + "</span>" +
            '<div class="nd-an__cellhead">' +
              '<span class="nd-an__icon">' + icon(it.icon) + "</span>" +
              '<h3 class="nd-an__title">' + esc(it.title) + "</h3>" +
            "</div>" +
            '<p class="nd-an__text">' + esc(it.text) + "</p>" +
          "</article>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("nd-an") + '">' +
        head({ id: "nd-analyzes-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        (cells
          ? '<div class="nd-an__panel"><ul class="nd-an__grid">' + cells + "</ul></div>"
          : "") +
      "</div>",
      "nd-an"
    );

    return true;
  }

  /* ---- 06 · Response & orchestration --------------------------------------
     IR's platform stage, mirrored: one core on the left fans out to four
     numbered targets on the right. A coral pulse (the detection) arrives
     at the core from the screen's left edge; blue signals then leave the
     core along the connectors, and each target's number picks up a small
     blue check when its signal first arrives.

     The targets sit in equal grid rows, so their centres fall at
     (i + .5) / n of the stage height; the connectors use the same numbers
     in a 0–100 viewBox stretched over the gap (preserveAspectRatio="none",
     with non-scaling strokes), so the lines meet the core and the targets
     at any width without measuring. The signals are zero-length round-
     capped strokes: with a non-scaling stroke the cap stays a circle
     however the SVG stretches.

     One shared cycle (RS_CYCLE) drives the pulse, the core's flash and the
     signals, so the response always follows the detection. The core, the
     connectors and the gate pill are decoration (aria-hidden); the
     targets are the content, an <ol>.
     -------------------------------------------------------------------- */
  var RS_CYCLE = 3.6;      // seconds
  var RS_START = 0.4;      // first cycle starts this long after reveal
  var RS_STAGGER = 0.12;   // between neighbouring signals
  var RS_ARRIVE = 0.86;    // share of the cycle at which a signal lands

  function buildResponse(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-rs")) return true;

    var targets = c.items || [];
    var n = targets.length;
    var lines = "";
    var dots = "";

    var items = targets.map(function (it, i) {
      var y = round(((i + 0.5) * 100) / Math.max(n, 1));
      var delay = round(RS_START + i * RS_STAGGER);
      lines += '<line x1="0" y1="50" x2="100" y2="' + y + '"/>';
      dots +=
        '<path class="nd-rs__signal" d="M0 50h.01" ' +
          'style="--dx:100px;--dy:' + round(y - 50) + "px;--delay:" + delay + 's"/>';
      return (
        '<li class="nd-rs__target nd-reveal" style="--i:' + (i + 2) +
          ";--arrive:" + round(delay + RS_CYCLE * RS_ARRIVE) + 's">' +
          '<span class="nd-rs__num" aria-hidden="true">' +
            pad(i + 1) +
            '<span class="nd-rs__tick">' + icon("check") + "</span>" +
          "</span>" +
          '<div class="nd-rs__body">' +
            '<h3 class="nd-rs__title">' + esc(it.title) + "</h3>" +
            '<p class="nd-rs__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + bleedClass("nd-rs") + '">' +
        '<div class="nd-rs__decor" aria-hidden="true"></div>' +
        '<div class="nd-shell nd-rs__inner">' +
          head({ id: "nd-response-title", eyebrow: c.eyebrow, title: c.title, sub: c.sub }) +
          '<div class="nd-rs__stage" style="--n:' + Math.max(n, 1) + ";--cycle:" + RS_CYCLE + 's">' +
            '<div class="nd-rs__hub nd-reveal" aria-hidden="true"' + at(1) + ">" +
              '<span class="nd-rs__core">' +
                '<span class="nd-rs__in"><span class="nd-rs__in-run"></span></span>' +
                '<span class="nd-rs__ring"></span>' +
                '<span class="nd-rs__core-name">' + esc(c.core || "") + "</span>" +
              "</span>" +
              (c.gate ? '<span class="nd-rs__gate">' + esc(c.gate) + "</span>" : "") +
            "</div>" +
            (n
              ? '<svg class="nd-rs__links" viewBox="0 0 100 100" preserveAspectRatio="none" ' +
                  'aria-hidden="true" focusable="false">' +
                  '<g class="nd-rs__lines">' + lines + "</g>" +
                  "<g>" + dots + "</g>" +
                "</svg>" +
                '<ol class="nd-rs__targets">' + items + "</ol>"
              : "") +
          "</div>" +
        "</div>" +
      "</div>",
      "nd-rs"
    );

    var stage = root.querySelector(".nd-rs__stage");
    if (stage && RESPONSE_MOTION && ANIMATE && !reducedMotion()) {
      stage.classList.add("is-moving");
      pauseOffscreen(stage);
    }

    return true;
  }

  /* ---- 07 · Use cases -----------------------------------------------------
     SIEM Cloud's detection cards, on a light ground: an icon tile, the
     traffic direction as a mono tag with an arrow glyph (↔ East-West,
     ↕ North-South: shape, not colour, tells them apart), the title and
     the text, under a 2px blue top line. A legend beside the H2 lists the
     two directions once.

     The tag follows the title in the DOM, so a screen reader meets the
     heading first; the CSS places it top right. The cards are static (no
     lift); under a mouse a soft blue spotlight follows the pointer, moved
     by transform from two custom properties the delegated handler below
     writes once per frame.
     -------------------------------------------------------------------- */
  var DIRS = ["ew", "ns"];

  function dir(d) {
    return DIRS.indexOf(d) > -1 ? d : DIRS[0];
  }

  function buildUsecases(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-uc")) return true;

    var names = c.directions || {};

    function tag(d, cls) {
      return names[d]
        ? '<span class="' + cls + '">' +
            '<span class="nd-uc__dir">' + icon("dir-" + d) + "</span>" +
            esc(names[d]) +
          "</span>"
        : "";
    }

    var items = (c.items || []).map(function (it, i) {
      var d = dir(it.dir);
      return (
        '<li class="nd-uc__item nd-reveal"' + at(i + 1) + ">" +
          '<div class="nd-uc__card nd-uc__card--' + d + '">' +
            '<span class="nd-uc__spot" aria-hidden="true"></span>' +
            '<span class="nd-uc__icon">' + icon(it.icon) + "</span>" +
            '<h3 class="nd-uc__title">' + esc(it.title) + "</h3>" +
            tag(d, "nd-uc__tag") +
            '<p class="nd-uc__text">' + esc(it.text) + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    // Decoration: each card already names its direction in words.
    var legend = DIRS.map(function (d) {
      return tag(d, "nd-uc__key");
    }).join("");

    var root = mount(
      host,
      '<div class="' + bleedClass("nd-uc") + '">' +
        '<div class="nd-uc__decor" aria-hidden="true"></div>' +
        '<div class="nd-shell nd-uc__inner">' +
          '<div class="nd-uc__header">' +
            head({ id: "nd-usecases-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
            (legend ? '<div class="nd-uc__legend nd-reveal" aria-hidden="true"' + at(1) + ">" + legend + "</div>" : "") +
          "</div>" +
          (items ? '<ul class="nd-uc__grid">' + items + "</ul>" : "") +
        "</div>" +
      "</div>",
      "nd-uc"
    );

    spotlight(root.querySelector(".nd-uc__grid"));
    return true;
  }

  // The 07 card spotlight: mouse only, never under reduced motion.
  function spotlight(grid) {
    if (!grid || !ANIMATE || reducedMotion() || !window.matchMedia ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var frame = 0;
    var card = null;
    var x = 0;
    var y = 0;

    function paint() {
      frame = 0;
      if (!card) return;
      card.style.setProperty("--nd-mx", Math.round(x) + "px");
      card.style.setProperty("--nd-my", Math.round(y) + "px");
    }

    grid.addEventListener("mousemove", function (e) {
      card = e.target.closest && e.target.closest(".nd-uc__card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });
  }

  /* ---- 08 · Deployment options --------------------------------------------
     HawkINT's console panel, re-skinned light: one framed panel with a
     night chrome bar ("Deploy") over the four options as rows split by
     hairlines (mono index, icon badge, title and text). Row 3 carries the
     rollout strip (aria-hidden): three chips joined by short wires, from
     its own text, that fill left to right when the section scrolls in.
     -------------------------------------------------------------------- */
  function rolloutStrip(steps) {
    if (!steps || !steps.length) return "";
    return (
      '<span class="nd-dp__rollout" aria-hidden="true">' +
        steps.map(function (s, k) {
          return (
            (k ? '<span class="nd-dp__link" style="--k:' + k + '"></span>' : "") +
            '<span class="nd-dp__step" style="--k:' + k + '">' + esc(s) + "</span>"
          );
        }).join("") +
      "</span>"
    );
  }

  function buildDeploy(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-dp")) return true;

    var rows = (c.items || []).map(function (it, i) {
      return (
        '<li class="nd-dp__row nd-reveal"' + at(i + 2) + ">" +
          '<span class="nd-dp__idx" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<span class="nd-dp__icon">' + icon(it.icon) + "</span>" +
          '<div class="nd-dp__copy">' +
            '<h3 class="nd-dp__title">' + esc(it.title) + "</h3>" +
            '<div class="nd-dp__detail">' +
              '<p class="nd-dp__text">' + esc(it.text) + "</p>" +
              rolloutStrip(it.steps) +
            "</div>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("nd-dp") + '">' +
        head({ id: "nd-deploy-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        (rows
          ? '<div class="nd-dp__console nd-reveal"' + at(1) + ">" +
              '<div class="nd-dp__bar" aria-hidden="true">' +
                '<span class="nd-dp__dots"><i></i><i></i><i></i></span>' +
                '<span class="nd-dp__label">' + esc(c.panelLabel || "") + "</span>" +
              "</div>" +
              '<ol class="nd-dp__list">' + rows + "</ol>" +
            "</div>"
          : "") +
      "</div>",
      "nd-dp"
    );

    return true;
  }

  /* ---- 09 · Integrations --------------------------------------------------
     HawkINT's patch-bay: a thin signal bus along the top, labelled with
     the product, drops a lead into each of four port cards. Each card has
     a mono port label and a jack that lights blue in turn as the section
     scrolls in, then holds; then the group name, the vendors as a nested
     list of mono text chips (no logos, no brand colours), and the copy's
     own tail as a short muted line. Our own product is the one chip in
     blue. The bus, leads, jacks and port labels are aria-hidden.
     -------------------------------------------------------------------- */
  function buildIntegrations(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-ig")) return true;

    var items = (c.items || []).map(function (it, i) {
      var chips = (it.chips || []).map(function (chip) {
        var own = it.own && chip === it.own;
        return '<li class="nd-ig__chip' + (own ? " nd-ig__chip--own" : "") + '">' + esc(chip) + "</li>";
      }).join("");
      return (
        '<li class="nd-ig__port nd-reveal"' + at(i + 2) + ">" +
          '<span class="nd-ig__lead" aria-hidden="true"></span>' +
          '<span class="nd-ig__port-head" aria-hidden="true">' +
            '<span class="nd-ig__jack"></span>' +
            (c.portLabel ? '<span class="nd-ig__port-tag">' + esc(c.portLabel) + " " + pad(i + 1) + "</span>" : "") +
          "</span>" +
          '<h3 class="nd-ig__title">' + esc(it.title) + "</h3>" +
          (chips ? '<ul class="nd-ig__chips">' + chips + "</ul>" : "") +
          (it.tail ? '<p class="nd-ig__tail">' + esc(it.tail) + "</p>" : "") +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + bleedClass("nd-ig") + '">' +
        '<div class="nd-ig__decor" aria-hidden="true"></div>' +
        '<div class="nd-shell nd-ig__inner">' +
          head({ id: "nd-integrations-title", eyebrow: c.eyebrow, title: c.title }) +
          (items
            ? '<div class="nd-ig__bay">' +
                '<div class="nd-ig__bus nd-reveal" aria-hidden="true"' + at(1) + ">" +
                  '<span class="nd-ig__bus-line"></span>' +
                  (c.bus ? '<span class="nd-ig__bus-label">' + esc(c.bus) + "</span>" : "") +
                "</div>" +
                '<ul class="nd-ig__ports">' + items + "</ul>" +
              "</div>"
            : "") +
        "</div>" +
      "</div>",
      "nd-ig"
    );

    return true;
  }

  /* ---- 10 · Reporting & KPIs ----------------------------------------------
     HawkINT's sector selector: a vertical rail of the four reports is a
     real tablist (roles, aria-selected, aria-controls, roving tabindex,
     Arrow / Home / End) driving one large detail panel; report 1 is
     selected on load. Below 860px it becomes an accordion of native
     <button aria-expanded> headers, each with its panel beneath.

     The two modes need different DOM orders (a tablist may only own tabs;
     an accordion reads header, panel, header, panel), so on a breakpoint
     change the script moves each panel: into the stage beside the rail
     for tabs, or straight after its own button for the accordion. One
     selection survives the switch. Each panel ends in a CSS-only report
     wireframe (aria-hidden) labelled with phrases from its own text.
     -------------------------------------------------------------------- */
  var RP_ACCORDION = "(max-width: 860px)";

  function reportWire(it) {
    var labels = it.labels || [];
    var html = "";

    function label(s) {
      return '<span class="nd-rp__wl">' + esc(s) + "</span>";
    }

    if (it.wire === "tiles") {
      html = labels.map(function (l, k) {
        return (
          '<span class="nd-rp__tile nd-rp__tile--' + (k + 1) + '">' +
            label(l) +
            '<span class="nd-rp__shape"><i></i><i></i><i></i></span>' +
          "</span>"
        );
      }).join("");
    } else if (it.wire === "timeline") {
      html =
        '<span class="nd-rp__lanes"><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
        '<span class="nd-rp__attack">' +
          (labels[0] ? label(labels[0]) : "") +
          '<span class="nd-rp__cells"><i></i><i></i><i></i><i></i><i></i></span>' +
        "</span>";
    } else if (it.wire === "progress") {
      html = labels.map(function (l, k) {
        return (
          '<span class="nd-rp__meter nd-rp__meter--' + (k + 1) + '">' +
            label(l) +
            '<span class="nd-rp__meter-track"><i></i></span>' +
          "</span>"
        );
      }).join("");
    } else if (it.wire === "gauges") {
      html = labels.map(function (l, k) {
        return (
          '<span class="nd-rp__gauge nd-rp__gauge--' + (k + 1) + '">' +
            '<span class="nd-rp__ring"></span>' +
            label(l) +
          "</span>"
        );
      }).join("");
    }

    return html
      ? '<div class="nd-rp__wire nd-rp__wire--' + esc(it.wire) + '" aria-hidden="true">' + html + "</div>"
      : "";
  }

  function buildReporting(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-rp")) return true;

    var list = c.items || [];
    if (!list.length) return true;

    var tabs = list.map(function (it, i) {
      return (
        '<button class="nd-rp__tab" type="button" id="nd-rp-tab-' + i + '" ' +
          'aria-controls="nd-rp-panel-' + i + '"' + at(i + 2) + ">" +
          '<span class="nd-rp__tab-icon" aria-hidden="true">' + icon(it.icon) + "</span>" +
          '<span class="nd-rp__tab-label">' + esc(it.title) + "</span>" +
          '<span class="nd-rp__tab-caret" aria-hidden="true">' + ARROW + "</span>" +
        "</button>"
      );
    }).join("");

    var panels = list.map(function (it, i) {
      return (
        '<div class="nd-rp__panel" id="nd-rp-panel-' + i + '" aria-labelledby="nd-rp-tab-' + i + '">' +
          '<div class="nd-rp__panel-head">' +
            '<span class="nd-rp__badge" aria-hidden="true">' + icon(it.icon) + "</span>" +
            '<h3 class="nd-rp__title">' + esc(it.title) + "</h3>" +
          "</div>" +
          '<p class="nd-rp__text">' + esc(it.text) + "</p>" +
          reportWire(it) +
        "</div>"
      );
    }).join("");

    var root = mount(
      host,
      '<div class="' + rootClass("nd-rp") + '">' +
        head({ id: "nd-reporting-title", eyebrow: c.eyebrow, title: c.title, align: "start" }) +
        '<div class="nd-rp__selector nd-reveal"' + at(1) + ">" +
          '<div class="nd-rp__rail">' + tabs + "</div>" +
          '<div class="nd-rp__stage">' + panels + "</div>" +
        "</div>" +
      "</div>",
      "nd-rp"
    );

    reportSelector(root);
    return true;
  }

  function reportSelector(root) {
    var rail = root.querySelector(".nd-rp__rail");
    var stage = root.querySelector(".nd-rp__stage");
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".nd-rp__tab"));
    var panels = Array.prototype.slice.call(root.querySelectorAll(".nd-rp__panel"));
    var mq = window.matchMedia ? window.matchMedia(RP_ACCORDION) : null;
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
        rail.setAttribute("aria-labelledby", "nd-reporting-title");
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

  /* ---- 11 · Why CybrHawk --------------------------------------------------
     SIEM Cloud's bento: the first differentiator is the dark anchor card,
     and its icon is a labelled diagram of the claim: four lines (Network,
     Endpoint, Cloud, Identity, words from the card's own text) merging
     into one blue line that ends in a node marked "SIEM XDR". The Network
     line is solid blue, because it is this product; the other three are
     quiet wire. Static. The other four are white cards with an icon badge.

     The diagram is decoration (aria-hidden): the card's text says it. The
     lines live in a 300×150 viewBox at a fixed ratio, so the HTML labels
     can sit on them by percentage (DIAGRAM_Y, as a share of 150).
     -------------------------------------------------------------------- */
  var DIAGRAM_Y = [22, 58, 94, 130];
  var DIAGRAM_MERGE = 75;

  function whyDiagram(d) {
    var labels = (d && d.lanes) || [];
    var paths = "";
    var keys = "";

    DIAGRAM_Y.forEach(function (y, k) {
      if (!labels[k]) return;
      var dy = DIAGRAM_MERGE - y;
      var cls = k === 0 ? "nd-wy__lane nd-wy__lane--own" : "nd-wy__lane";
      paths +=
        '<path class="' + cls + '" d="M2 ' + y + "h88c36 0 36 " + dy + " 72 " + dy + '"/>';
      keys +=
        '<span class="nd-wy__flow-key' + (k === 0 ? " nd-wy__flow-key--own" : "") + '" style="top:' +
          round((y / 150) * 100) + '%">' +
          esc(labels[k]) +
        "</span>";
    });

    return (
      '<div class="nd-wy__flow" aria-hidden="true">' +
        '<svg class="nd-wy__diagram" viewBox="0 0 300 150" focusable="false">' +
          paths +
          '<path class="nd-wy__diagram-story" d="M162 ' + DIAGRAM_MERGE + 'h108"/>' +
          '<circle class="nd-wy__diagram-halo" cx="280" cy="' + DIAGRAM_MERGE + '" r="16"/>' +
          '<circle class="nd-wy__diagram-node" cx="280" cy="' + DIAGRAM_MERGE + '" r="7"/>' +
        "</svg>" +
        keys +
        (d && d.end ? '<span class="nd-wy__flow-end">' + esc(d.end) + "</span>" : "") +
      "</div>"
    );
  }

  function buildWhy(host, c) {
    if (!host) return false;
    if (host.querySelector(".nd-wy")) return true;

    var items = (c.items || []).map(function (it, i) {
      var anchor = i === 0;
      var area = "abcde".charAt(i) || "";
      return (
        '<li class="nd-wy__item' + (area ? " nd-wy__item--" + area : "") + ' nd-reveal"' + at(i + 1) + ">" +
          '<div class="nd-wy__card' + (anchor ? " nd-wy__card--anchor" : "") + '">' +
            (!anchor && it.icon ? '<span class="nd-wy__icon">' + icon(it.icon) + "</span>" : "") +
            '<h3 class="nd-wy__title">' + esc(it.title) + "</h3>" +
            '<p class="nd-wy__text">' + esc(it.text) + "</p>" +
            (anchor ? whyDiagram(c.diagram) : "") +
          "</div>" +
        "</li>"
      );
    }).join("");

    mount(
      host,
      '<div class="' + rootClass("nd-wy") + '">' +
        head({ id: "nd-why-title", eyebrow: c.eyebrow, title: c.title }) +
        (items ? '<ul class="nd-wy__grid">' + items + "</ul>" : "") +
      "</div>",
      "nd-wy"
    );

    return true;
  }

  /* ---- Build ------------------------------------------------------------ */
  var BUILDERS = [
    ["hero", buildHero],
    ["challenge", buildChallenge],
    ["outcomes", buildOutcomes],
    ["engine", buildEngine],
    ["analyzes", buildAnalyzes],
    ["response", buildResponse],
    ["usecases", buildUsecases],
    ["deploy", buildDeploy],
    ["integrations", buildIntegrations],
    ["reporting", buildReporting],
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
          container.classList.add("nd-section");
          if (DARK[key]) container.classList.add("nd-section--dark");
        }
        if (!b[1](host, CONTENT[key] || {})) {
          done = false;                              // container not ready
          return;
        }
      } catch (err) {
        // A builder that throws would throw again on every DOM change, so
        // it is logged once and not retried; the others carry on.
        if (window.console) {
          console.error("SIEM NDR: the " + key + " section failed to build.", err);
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
      if (window.console) console.error("SIEM NDR: anchor check failed.", err);
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
