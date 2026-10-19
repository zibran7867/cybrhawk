/* ==========================================================================
   HawkOps architecture · second section of /enterprise-operations-intelligence/
   Markup: second-section.html · Styles: second-section.css

   Drives the interactive diagram: view tabs, guided tour, details pop-up,
   agent permissions, connector lines, the animated brain graph,
   pause / play and full screen. Everything is scoped to #hawkops-arch.
   ========================================================================== */

(function () {
    'use strict';

    // Text the script writes into the page.
    const COPY = {
        pause: 'Pause animation',
        play: 'Enable animation',
        fullscreen: 'Full screen',
        exitFullscreen: 'Exit full screen',
        next: 'Next →',
        finish: 'Back to the map',

        // Details pop-up content, keyed by each card's data-node.
        nodes: {
            brain: {
                name: 'Enterprise brain',
                tag: 'PRIVATE KNOWLEDGE',
                where: "Supabase, within the client's infrastructure.",
                detail: 'Stores verified knowledge and references to original sources. Each company has an independent enterprise brain, separate from Temis and other clients.',
                billing: 'Plan, compute, storage, data transfer and backup add-ons according to configuration.',
                url: 'https://supabase.com/pricing'
            },
            agents: {
                name: 'Company agents',
                tag: 'CLOUDFLARE',
                where: "Cloudflare, in the client's deployment.",
                detail: 'The application and agent services use authorized knowledge. AI model inference is a separate service from application hosting.',
                billing: 'Requests, compute and enabled services such as queues or storage. Model usage is counted where it runs, without double counting.',
                url: 'https://developers.cloudflare.com/workers/platform/pricing/'
            },
            app: {
                name: 'Application and modules',
                tag: 'AUTHORIZED PEOPLE',
                where: 'A browser on a computer, tablet or phone; application hosted on Cloudflare.',
                detail: 'Each person sees authorized information, checks evidence and reviews proposals. Modules contribute new knowledge to the enterprise brain. Actions require human approval.',
                billing: 'Custom integrations, enterprise identity, support and operations when required by the agreed scope.'
            },
            temis: {
                name: 'Temis',
                tag: 'SPECIALIZED KNOWLEDGE',
                where: 'Supabase, within HawkOps infrastructure.',
                detail: 'Agents query legal and regulatory sources with provenance and validity information. Private client documents are not deposited in Temis.',
                billing: 'Access, coverage and updates under the subscription. This does not automatically mean a second Supabase bill for the client.'
            },
            archivist: {
                name: 'Archivist',
                tag: 'COMPUTER · LOCATION WITHHELD',
                where: 'An operations computer. Its physical location is not disclosed.',
                detail: 'Processes initial ingestion and updates from authorized sources. Originals remain in their repositories; processing and temporary files follow the agreed policy.',
                billing: 'Initial ingestion, updates, computer capacity and operations under contract. AI services may incur additional usage charges.'
            },
            sources: {
                name: 'Company information',
                tag: 'AUTHORIZED SOURCES',
                where: "The client's existing repositories and business systems.",
                detail: 'The client defines which information is shared and grants read-only access. References to original sources are retained. Private data is not mixed into Temis.',
                billing: 'Source-system licenses, API access, custom connectors, digitization and transcription when required.'
            },
            ai: {
                name: 'AI models',
                tag: 'VARIABLE USAGE',
                where: 'A provider approved for each deployment.',
                detail: 'The Archivist and agents use AI according to their roles. Contracts must exclude training on client data and define authorized processing.',
                billing: 'Volume, model choice, context and frequency. OCR, transcription and voice may be billed separately. Keeping originals at source does not prevent content processing by authorized services.'
            },
            email: {
                name: 'Email delivery',
                tag: 'OPTIONAL · RESEND',
                where: 'Resend or another contracted email provider.',
                detail: 'Delivers approved messages; it does not automatically receive the full enterprise brain. Resend is an option, not a mandatory provider.',
                billing: "Plan and sending volume under the provider's terms.",
                url: 'https://resend.com/pricing'
            },
            channels: {
                name: 'Messaging and calls',
                tag: 'OPTIONAL · PROVIDER TO BE SELECTED',
                where: 'A communications provider, such as Twilio.',
                detail: 'Channels are planned for each use case. An authorized person approves the action before a message is sent or a call is placed.',
                billing: 'Messages, channel and destination fees, phone numbers and minutes. Recording, transcription and speech synthesis may incur separate charges.',
                url: 'https://www.twilio.com/en-us/pricing'
            }
        },

        // Guided tour: [card to highlight, title, text]
        steps: [
            ['sources', 'Information stays in its systems', 'HawkOps accesses only the sources authorized by the client.'],
            ['archivist', 'The Archivist prepares the knowledge', 'It reads, organizes and verifies, running on a computer whose location is not disclosed.'],
            ['brain', 'Each company has its own enterprise brain', 'Knowledge and source references live in Supabase, separate from other clients.'],
            ['temis', 'Temis adds specialized context', 'It lives in Supabase, within HawkOps infrastructure. It does not receive private client records.'],
            ['agents', 'Agents connect the components', 'Running on Cloudflare, they query the brain and Temis and use AI models for analysis.'],
            ['app', 'People review and decide', 'The application presents findings and evidence. Modules also feed the enterprise brain.'],
            ['email', 'Channels are enabled as needed', 'Email, messages and calls require approval. Infrastructure, AI and communications may incur charges.']
        ]
    };

    // Connector lines lit up by each tour step (values of data-connection).
    const TOUR_LINKS = {
        sources: ['source'],
        archivist: ['source', 'publish'],
        brain: ['publish', 'query', 'read'],
        temis: ['law'],
        agents: ['query', 'law', 'use'],
        app: ['use', 'read'],
        email: []
    };

    // Proposed permissions for an agent, based on its data-kind.
    function permissionsFor(kind) {
        return [
            ['Own client brain', ['technical', 'web'].includes(kind) ? 'Necessary scope only' : 'Authorized reading', 'allowed'],
            ['Internet', kind === 'web' || kind === 'analysis' ? 'Yes · authorized sources' : 'Can be enabled by task', 'conditional'],
            ['Temis · regulatory knowledge', kind === 'analysis' ? 'Queries can be enabled' : 'Only if the role needs it', 'conditional'],
            ['SharePoint / ERP / CRM', kind === 'archive' ? 'Authorized connectors' : 'Authorized data; API if enabled', 'conditional'],
            ['Email, messaging and calls', kind === 'channel' ? 'Enabled channel + approval' : 'No direct sending by default', 'conditional'],
            ['Change data or act on its own', 'Not authorized', 'blocked'],
            ['Another client’s brain', 'No access', 'blocked']
        ];
    }

    function init(root) {
        const $ = id => root.querySelector('#ho-' + id);

        const stage = $('stage');
        const wrap = $('canvas-wrap');
        const svg = stage.querySelector('.connections');
        const motionButton = $('motion');
        const fullscreenButton = $('fullscreen');
        const tourStart = $('tour-start');
        const dialog = $('details');
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');

        let moving = !reduced.matches;
        let step = -1;
        let view = 'map';


        /* ---- Pause / play animation ---- */

        function syncMotion() {
            const running = moving && !document.hidden && !reduced.matches;
            root.classList.toggle('paused', !running);
            motionButton.textContent = moving ? COPY.pause : COPY.play;
            motionButton.setAttribute('aria-pressed', String(moving));
            if (running) svg.unpauseAnimations();
            else svg.pauseAnimations();
            startGraph();
        }

        motionButton.addEventListener('click', () => {
            moving = !moving;
            syncMotion();
        });
        reduced.addEventListener('change', () => {
            moving = !reduced.matches;
            syncMotion();
        });
        document.addEventListener('visibilitychange', syncMotion);


        /* ---- Details pop-up ---- */

        root.querySelectorAll('[data-node]').forEach(button => button.addEventListener('click', () => {
            const node = COPY.nodes[button.dataset.node];
            const link = $('detail-url');
            $('detail-title').textContent = node.name;
            $('detail-tag').textContent = node.tag;
            $('detail-where').textContent = node.where;
            $('detail-function').textContent = node.detail;
            $('detail-billing').textContent = node.billing;
            link.hidden = !node.url;
            if (node.url) link.href = node.url;
            else link.removeAttribute('href');
            dialog.classList.remove('closing');
            dialog.showModal();
        }));

        // Play the closing animation (.closing in the CSS), then close for real.
        function closeDialog() {
            if (!dialog.open || dialog.classList.contains('closing')) return;
            dialog.classList.add('closing');
            setTimeout(() => {
                dialog.classList.remove('closing');
                dialog.close();
            }, reduced.matches ? 0 : 200);
        }

        $('close-details').addEventListener('click', closeDialog);

        // The Esc key: animate out instead of closing instantly.
        dialog.addEventListener('cancel', event => {
            event.preventDefault();
            closeDialog();
        });

        // Clicking the dimmed backdrop closes the pop-up.
        dialog.addEventListener('click', event => {
            const r = dialog.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog();
        });


        /* ---- View tabs: Infrastructure / Potential charges / Modules ---- */

        function selectView(value) {
            view = value;
            for (const name of ['map', 'costs', 'modules']) $(name + '-view').hidden = name !== value;
            root.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === value)));
            tourStart.hidden = value !== 'map';
            if (value !== 'map') endTour();
            requestAnimationFrame(resizeGraph);
            startGraph();
        }

        root.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => selectView(b.dataset.view)));


        /* ---- Guided tour ---- */

        function showStep() {
            const [node, title, text] = COPY.steps[step];
            $('tour').hidden = false;
            root.classList.add('touring');
            $('step-number').textContent = `Step ${step + 1} of ${COPY.steps.length}`;
            $('step-title').textContent = title;
            $('step-text').textContent = text;
            stage.querySelectorAll('.component').forEach(el => el.classList.toggle('spotlight',
                (el.dataset.node || el.dataset.nodeGroup) === node || (node === 'email' && ['ai', 'channels'].includes(el.dataset.node))));
            svg.querySelectorAll('[data-connection]').forEach(el => el.classList.toggle('spotlight',
                (TOUR_LINKS[node] || []).includes(el.dataset.connection)));
            $('previous').disabled = step === 0;
            $('next').textContent = step === COPY.steps.length - 1 ? COPY.finish : COPY.next;
            tourStart.hidden = true;
        }

        function endTour() {
            step = -1;
            $('tour').hidden = true;
            root.classList.remove('touring');
            tourStart.hidden = view !== 'map';
        }

        tourStart.addEventListener('click', () => {
            step = 0;
            showStep();
        });
        $('next').addEventListener('click', () => {
            if (step === COPY.steps.length - 1) endTour();
            else {
                step++;
                showStep();
            }
        });
        $('previous').addEventListener('click', () => {
            if (step > 0) {
                step--;
                showStep();
            }
        });
        $('tour-close').addEventListener('click', endTour);


        /* ---- Full screen (this section only, not the whole page) ---- */

        fullscreenButton.addEventListener('click', async () => {
            try {
                if (document.fullscreenElement) await document.exitFullscreen();
                else await root.requestFullscreen();
            } catch {
                fullscreenButton.hidden = true; // not supported, e.g. Safari on iPhone
            }
        });

        document.addEventListener('fullscreenchange', () => {
            fullscreenButton.textContent = document.fullscreenElement === root ? COPY.exitFullscreen : COPY.fullscreen;
            resizeGraph();
        });


        /* ---- Company agents: role picker and permissions ---- */

        function selectRole(button) {
            root.querySelectorAll('[data-role]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
            $('selected-avatar').innerHTML = button.querySelector('svg').outerHTML;
            $('selected-name').textContent = button.querySelector('span').textContent;
            $('selected-description').textContent = button.dataset.description;
            $('permission-list').innerHTML = permissionsFor(button.dataset.kind)
                .map(([what, access, level]) => `<div class="permission-row ${level}"><span>${what}</span><strong>${access}</strong></div>`)
                .join('');
        }

        root.querySelectorAll('[data-role]').forEach(b => b.addEventListener('click', () => selectRole(b)));


        /* ---- Connector lines: re-routed around the cards' real positions ---- */

        function drawConnections() {
            if (!stage.clientWidth || getComputedStyle(svg).display === 'none') return;
            const base = stage.getBoundingClientRect();
            const box = name => {
                const r = stage.querySelector('.' + name).getBoundingClientRect();
                return {
                    l: r.left - base.left,
                    r: r.right - base.left,
                    t: r.top - base.top,
                    b: r.bottom - base.top,
                    x: (r.left + r.right) / 2 - base.left,
                    y: (r.top + r.bottom) / 2 - base.top
                };
            };
            const B = box('brain'), A = box('agents'), P = box('app'), T = box('temis'), R = box('archivist'),
                I = box('internet'), S = box('soc'), D = box('sources');
            const width = stage.clientWidth;
            svg.setAttribute('viewBox', `0 0 ${width} ${stage.clientHeight}`);

            const g1 = (B.r + A.l) / 2; // gutter between brain and agents
            const g2 = (A.r + T.l) / 2; // gutter between agents and Temis
            const outer = width - 17;
            const top = 20;

            const routes = {
                query: [[A.l, B.y], [B.r, B.y]],
                use: [[P.r, P.y], [A.l, P.y]],
                read: [[P.x, P.t], [P.x, B.b]],
                law: [[A.r, T.y], [T.l, T.y]],
                source: [[D.r - 20, D.t], [outer, D.t - 28], [outer, R.b + 28], [R.x, R.b + 28], [R.x, R.b]],
                publish: [[R.l, R.y], [g2, R.y], [g2, A.b + 32], [g1, A.b + 32], [g1, B.b - 25], [B.r, B.b - 25]],
                'internet-link': [[I.x, I.t], [I.x, I.t - 32], [A.x, I.t - 32], [A.x, A.b]],
                'soc-cloud': [[A.r, A.b - 25], [g2, A.b - 25], [g2, S.y], [S.l, S.y]],
                'soc-data': [[B.l, B.t + 28], [17, B.t + 28], [17, top], [width - 5, top], [width - 5, S.y], [S.r, S.y]]
            };
            // Where each numbered badge sits on its line.
            const badges = {
                query: [g1, B.y],
                use: [g1, P.y],
                read: [P.x, (P.t + B.b) / 2],
                law: [g2, T.y],
                source: [outer, (D.t + R.b) / 2],
                publish: [g1, B.b - 25],
                'internet-link': [A.x, I.t - 32],
                'soc-cloud': [g2, S.y],
                'soc-data': [width / 2, top]
            };

            Object.entries(routes).forEach(([id, points], i) => {
                const group = svg.querySelector(`[data-connection="${id}"]`);
                group.querySelector('.edge').setAttribute('d', points.map(([x, y], j) => `${j ? 'L' : 'M'}${x} ${y}`).join(' '));
                let badge = group.querySelector('.connection-number');
                if (!badge) {
                    badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    badge.setAttribute('class', 'connection-number');
                    badge.innerHTML = `<circle r="12"/><text>${i + 1}</text>`;
                    group.appendChild(badge);
                }
                badge.setAttribute('transform', `translate(${badges[id].join(' ')})`);
            });
        }


        /* ---- Enterprise brain: illustrative knowledge graph (no client data) ---- */

        const canvas = $('brain-graph');
        const ctx = canvas.getContext('2d');
        const COLORS = ['#f7d774', '#5ee6ff', '#b9caff', '#ffad76', '#ff8dac', '#bca0ff', '#5cc49a'];
        const points = [{ x: 420, y: 335, r: 9, color: '#f6f2ff', phase: 0, drift: 0 }];
        const links = []; // [from, to, type]: 0 = inside a cluster, 1 = centre to hub, 2 = across clusters
        const stars = [];

        // Seeded random numbers, so the graph looks the same on every visit.
        let seed = 37;
        const random = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };

        for (let cluster = 0; cluster < 9; cluster++) {
            const angle = cluster * Math.PI * 2 / 9 - Math.PI / 2;
            const dist = 145 + random() * 120;
            const hub = points.length;
            points.push({
                x: 420 + Math.cos(angle) * dist,
                y: 335 + Math.sin(angle) * dist * .83,
                r: 4.5 + random() * 3,
                color: COLORS[cluster % COLORS.length],
                phase: random() * 8,
                drift: 4
            });
            links.push([0, hub, 1]);
            const leaves = [];
            for (let j = 0; j < 17; j++) {
                const a = random() * Math.PI * 2;
                const d = 18 + random() * 90;
                const id = points.length;
                points.push({
                    x: points[hub].x + Math.cos(a) * d,
                    y: points[hub].y + Math.sin(a) * d,
                    r: 1.2 + random() * 2.6,
                    color: COLORS[(cluster + j % 3) % COLORS.length],
                    phase: random() * 9,
                    drift: 2 + random() * 5
                });
                links.push([hub, id, 0]);
                leaves.push(id);
                if (j > 0 && random() > .25) links.push([leaves[j - 1], id, 0]);
            }
            if (cluster > 0) links.push([hub, hub - 18, 0]);
        }
        for (let i = 0; i < 90; i++) {
            const a = random() * Math.PI * 2;
            const d = 30 + random() * 320;
            stars.push({ x: 420 + Math.cos(a) * d, y: 335 + Math.sin(a) * d * .92, r: .6 + random(), phase: random() * 9 });
        }
        for (let i = 0; i < 65; i++) {
            const a = 1 + Math.floor(random() * (points.length - 1));
            const b = 1 + Math.floor(random() * (points.length - 1));
            if (a !== b) links.push([a, b, 2]);
        }

        let frame = 0;
        let last = 0;
        let time = 0;
        let width = 840;
        let height = 850;
        let inView = true;

        function resizeGraph() {
            const r = canvas.getBoundingClientRect();
            if (!r.width || !r.height) return;
            const ratio = Math.min(devicePixelRatio || 1, 2);
            canvas.width = Math.round(r.width * ratio);
            canvas.height = Math.round(r.height * ratio);
            width = canvas.width;
            height = canvas.height;
            drawGraph(time);
        }

        function drawGraph(t) {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            const scale = Math.min(width / 840, height / 850);
            const dx = (width - 840 * scale) / 2;
            ctx.save();
            ctx.translate(dx, 0);
            ctx.scale(scale, scale);

            const bg = ctx.createRadialGradient(420, 335, 0, 420, 335, 430);
            bg.addColorStop(0, '#201941');
            bg.addColorStop(1, '#07070c');
            ctx.fillStyle = bg;
            ctx.fillRect(-dx / scale, 0, width / scale, height / scale);

            const xy = points.map(p => [p.x + Math.sin(t * .22 + p.phase) * p.drift, p.y + Math.cos(t * .17 + p.phase) * p.drift]);

            links.forEach(([a, b, type]) => {
                ctx.beginPath();
                ctx.moveTo(...xy[a]);
                ctx.lineTo(...xy[b]);
                ctx.strokeStyle = type === 1 ? '#a78bfa88' : type === 2 ? '#56618d25' : '#8597c34c';
                ctx.lineWidth = type === 1 ? 1.5 : .7;
                ctx.stroke();
            });

            stars.forEach(p => {
                ctx.globalAlpha = .2 + (Math.sin(t * .55 + p.phase) + 1) * .22;
                ctx.fillStyle = '#dfe7ff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            points.forEach((p, i) => {
                const [x, y] = xy[i];
                if (p.r > 3) {
                    const glow = ctx.createRadialGradient(x, y, 0, x, y, p.r * 4);
                    glow.addColorStop(0, p.color + '50');
                    glow.addColorStop(1, p.color + '00');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(x, y, p.r * 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = .72 + (Math.sin(t * .6 + p.phase) + 1) * .14;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(x, y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            const core = ctx.createRadialGradient(420, 335, 0, 420, 335, 54 + Math.sin(t * .8) * 5);
            core.addColorStop(0, '#ffffff');
            core.addColorStop(.18, '#e4d8ffdd');
            core.addColorStop(.48, '#aa88ee55');
            core.addColorStop(1, '#7c3aed00');
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(420, 335, 65, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e3d6ffbb';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(420, 335, 17, 0, Math.PI * 2);
            ctx.stroke();

            // Small dots travelling along a few links.
            if (moving && !reduced.matches) {
                for (let i = 0; i < 9; i++) {
                    const link = links[i * 18];
                    if (!link) continue;
                    const [a, b] = link;
                    const p = (t * .08 + i * .11) % 1;
                    const x = xy[a][0] + (xy[b][0] - xy[a][0]) * p;
                    const y = xy[a][1] + (xy[b][1] - xy[a][1]) * p;
                    ctx.fillStyle = '#eee2ff';
                    ctx.beginPath();
                    ctx.arc(x, y, 1.9, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        function graphShouldRun() {
            return moving && !reduced.matches && !document.hidden && view === 'map' && inView;
        }

        function tick(now) {
            frame = 0;
            if (!graphShouldRun()) return;
            if (now - last > 32) { // ~30 fps is plenty
                time += Math.min((now - last) / 1000, .05);
                drawGraph(time);
                last = now;
            }
            frame = requestAnimationFrame(tick);
        }

        function startGraph() {
            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
            drawGraph(time);
            if (graphShouldRun()) {
                last = performance.now();
                frame = requestAnimationFrame(tick);
            }
        }

        // Only animate while the brain card is on screen.
        new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            startGraph();
        }).observe(canvas);


        /* ---- Start ---- */

        new ResizeObserver(resizeGraph).observe(wrap);
        new ResizeObserver(() => requestAnimationFrame(drawConnections)).observe(stage);
        window.addEventListener('resize', () => {
            resizeGraph();
            drawConnections();
        });
        window.addEventListener('beforeprint', () => {
            root.classList.add('paused');
            svg.pauseAnimations();
        });
        window.addEventListener('afterprint', syncMotion);

        selectRole(root.querySelector('[data-role]'));
        resizeGraph();
        syncMotion();
        drawConnections();
    }

    function boot() {
        const root = document.getElementById('hawkops-arch');
        if (!root || root.dataset.ready) return; // missing, or already started
        root.dataset.ready = 'true';
        init(root);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
