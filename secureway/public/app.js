
const app = {
    state: {
        activeTab: 'overview',
        scanProgress: 0,
        intervals: [], // Store active intervals/timeouts
        logs: [],
        bolaStep: 0
    },

    init: () => {
        app.renderSidebar();
        app.renderView('overview');
        lucide.createIcons();
    },

    clearIntervals: () => {
        app.state.intervals.forEach(id => {
            clearInterval(id);
            clearTimeout(id);
        });
        app.state.intervals = []; // Reset
    },

    validTabs: [
        { id: 'overview', label: 'Overview', icon: 'shield-check' },
        { id: 'architecture', label: 'Architecture', icon: 'server' },
        { id: 'agentic', label: 'Agentic Discovery', icon: 'activity' },
        { id: 'logic', label: 'Logic Lab', icon: 'bug' },
        { id: 'privacy', label: 'Privacy Shield', icon: 'brain-circuit' },
        { id: 'authorized', label: 'Authorized Framework', icon: 'fingerprint' }
    ],

    renderSidebar: () => {
        const nav = document.getElementById('sidebar-nav');
        if (!nav) return;
        nav.innerHTML = app.validTabs.map(tab => `
            <button onclick="app.switchTab('${tab.id}')" 
                class="flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${app.state.activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 shadow-md border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}">
                <i data-lucide="${tab.icon}" class="mr-3 h-5 w-5 ${app.state.activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}"></i>
                ${tab.label}
            </button>
        `).join('');
        lucide.createIcons();
    },

    switchTab: (tabId) => {
        app.clearIntervals(); // Cleanup previous tab actions
        app.state.activeTab = tabId;
        app.renderSidebar();
        app.renderView(tabId);
        window.scrollTo(0, 0);
    },

    renderView: (viewId) => {
        const container = document.getElementById('content-area');
        const template = document.getElementById(`view-${viewId}`);

        if (!template) return;

        // Clear and clone
        container.innerHTML = '';
        const content = template.content.cloneNode(true);
        container.appendChild(content);

        // Initialize specific view logic
        setTimeout(() => {
            if (viewId === 'overview') app.initOverview();
            if (viewId === 'agentic') app.initAgentic();
            if (viewId === 'logic') app.initLogic();
            if (viewId === 'privacy') app.initPrivacy();
            lucide.createIcons();
        }, 0);
    },

    // --- Overview Logic ---
    initOverview: () => {
        // Render Stats
        const stats = [
            { label: "Attack Surface", value: "86%", icon: "globe", color: "text-blue-400" },
            { label: "Active Threats", value: "12", icon: "shield-alert", color: "text-red-400" },
            { label: "Logic Gaps", value: "4", icon: "brain-circuit", color: "text-purple-400" },
            { label: "Secure Score", value: "92/100", icon: "check-circle", color: "text-green-400" }
        ];

        const statsGrid = document.getElementById('stats-grid');
        if (statsGrid) {
            statsGrid.innerHTML = stats.map((stat, idx) => `
                <div class="fade-in rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur" style="animation-delay: ${idx * 0.1}s">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">${stat.label}</p>
                            <h3 class="mt-1 text-2xl font-bold text-slate-100">${stat.value}</h3>
                        </div>
                        <i data-lucide="${stat.icon}" class="h-8 w-8 ${stat.color} opacity-80"></i>
                    </div>
                </div>
            `).join('');
        }

        // Render Chart
        const canvas = document.getElementById('vulnChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Critical", "High", "Medium", "Low"],
                    datasets: [{
                        label: "Vulnerabilities",
                        data: [12, 19, 3, 5],
                        backgroundColor: [
                            "rgba(239, 68, 68, 0.6)",
                            "rgba(249, 115, 22, 0.6)",
                            "rgba(234, 179, 8, 0.6)",
                            "rgba(59, 130, 246, 0.6)"
                        ],
                        borderColor: [
                            "rgba(239, 68, 68, 1)",
                            "rgba(249, 115, 22, 1)",
                            "rgba(234, 179, 8, 1)",
                            "rgba(59, 130, 246, 1)"
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#cbd5e1' } },
                    },
                    scales: {
                        y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                        x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                    }
                }
            });
        }

        // Start Threat Feed
        const threats = [
            { name: "Logic Flaw - BOLA (Gemini Detected)", severity: "Critical", time: "2m ago" },
            { name: "Redis Queue Latency Spike (PyOD)", severity: "High", time: "5m ago" },
            { name: "PII Leak in Logs (Presidio Blocked)", severity: "Medium", time: "12m ago" },
            { name: "Unknown Graph Node (NetworkX)", severity: "Low", time: "15m ago" }
        ];

        const feedContainer = document.getElementById('threat-feed');
        if (feedContainer) {
            threats.forEach((t, i) => {
                const timeoutId = setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 'flex items-center justify-between rounded-lg border border-slate-800 p-3 hover:bg-slate-800/50 fade-in transition-colors text-slate-200';
                    el.innerHTML = `
                        <div class="flex items-center gap-3">
                            <i data-lucide="alert-triangle" class="h-4 w-4 ${t.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'}"></i>
                            <div>
                                <p class="text-sm font-medium">${t.name}</p>
                                <p class="text-xs text-slate-500">${t.severity}</p>
                            </div>
                        </div>
                        <span class="text-xs font-mono text-slate-600">${t.time}</span>
                    `;
                    feedContainer.appendChild(el);
                    lucide.createIcons();
                }, i * 800);
                app.state.intervals.push(timeoutId);
            });
        }
    },

    startScanSimulation: () => {
        const btn = document.getElementById('start-scan-btn');
        if (btn) {
            btn.innerHTML = `<i data-lucide="loader-2" class="h-4 w-4 animate-spin"></i> Scanning...`;
            btn.disabled = true;
            lucide.createIcons();
        }

        let progress = 0;
        const bar = document.getElementById('scan-bar');
        const text = document.getElementById('scan-percentage');

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;
            if (progress > 100) progress = 100;

            if (bar) bar.style.width = `${progress}%`;
            if (text) text.innerText = `${progress}%`;

            if (progress === 100) {
                clearInterval(interval);
                if (btn) {
                    btn.innerHTML = `<i data-lucide="check-circle" class="h-4 w-4"></i> Completed`;
                    btn.classList.remove('bg-cyan-600', 'hover:bg-cyan-500');
                    btn.classList.add('bg-green-600', 'cursor-default');

                    // Show report button
                    if (!document.getElementById('report-btn')) {
                        const reportBtn = document.createElement('button');
                        reportBtn.id = 'report-btn';
                        reportBtn.className = 'ml-3 flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors fade-in';
                        reportBtn.innerHTML = `<i data-lucide="file-text" class="h-4 w-4"></i> Report`;
                        reportBtn.onclick = () => alert('Downloading Encrypted Proof-of-Exploit Report...');
                        btn.parentNode.appendChild(reportBtn);
                        lucide.createIcons();
                    }
                }
            }
        }, 150);
        app.state.intervals.push(interval);
    },

    // --- Agentic Discovery Logic ---
    initAgentic: () => {
        const terminal = document.getElementById('terminal-output');
        const logs = [
            "[+] Initializing Playwright (Stealth Mode)...",
            "[*] Rendering Shadow DOM components...",
            "[*] NetworkX Graph: Node added 'UserDashboard'",
            "[!] Hidden API Route Found: /api/v1/admin/debug",
            "[+] Gemini 2.0: Analyzing potential IDOR vectors...",
            "[*] Response 200 OK - No injection detected",
            "[!] React Props Analysis: Sensitive data in 'user' prop"
        ];

        // Try connecting to real backend
        fetch('http://localhost:8000/')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'operational') {
                    logs.unshift(`[+] BACKEND CONNECTED: ${data.stack.core} | ${data.stack.ai}`);
                    logs.unshift(`[+] Rust Engine: ACTIVE (Optimized Regex JIT)`);
                }
            })
            .catch(err => {
                logs.unshift(`[!] Backend Offline (Using Simulation Mode)`);
            });

        let i = 0;
        const logInterval = setInterval(() => {
            if (i < logs.length) {
                if (terminal) {
                    const p = document.createElement('div');
                    p.className = 'border-l-2 border-green-500/30 pl-2 fade-in';
                    p.innerHTML = `<span class="text-slate-500">${new Date().toLocaleTimeString().split(' ')[0]}</span> ${logs[i]}`;
                    terminal.appendChild(p);
                    terminal.scrollTop = terminal.scrollHeight;
                }
                i++;
            } else {
                i = 0;
                if (terminal) terminal.innerHTML = ''; // Loop
            }
        }, 1500);
        app.state.intervals.push(logInterval);

        // Simple Random Nodes visualizer
        const viz = document.getElementById('network-visualizer');
        const nodeInterval = setInterval(() => {
            if (viz) {
                const node = document.createElement('div');
                node.className = 'node absolute animate-ping bg-cyan-400 rounded-full h-2 w-2';
                node.style.left = `${Math.random() * 80 + 10}%`;
                node.style.top = `${Math.random() * 80 + 10}%`;
                viz.appendChild(node);
                setTimeout(() => node.remove(), 2000);
            }
        }, 800);
        app.state.intervals.push(nodeInterval);
    },

    // --- Logic Lab Logic ---
    initLogic: () => {
        // No auto-init needed, button driven
    },

    runBolaSimulation: () => {
        const btn = document.getElementById('bola-btn');
        const logs = document.getElementById('logic-logs');
        const userNode = document.getElementById('user-node');
        const adminNode = document.getElementById('admin-node');
        const targetIdLine = document.getElementById('target-id-line');
        const targetIdVal = document.getElementById('target-id-val');
        const badge = document.getElementById('vuln-badge');

        if (!btn || !logs) return;

        btn.disabled = true;
        btn.innerText = "Probing...";
        logs.innerHTML = '';

        const addLog = (msg, isCritical = false) => {
            const div = document.createElement('div');
            div.className = isCritical ? "font-bold text-red-400 py-1" : "text-green-400/80";
            div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logs.appendChild(div);
        };

        addLog("Initiating BOLA check sequence via Gemini 2.0...");

        setTimeout(() => {
            addLog("Capturing auth token: eyJhbGciOiJIUzI1NiIsInR...");
            if (userNode) userNode.classList.add('scale-110', 'opacity-100');
        }, 1000);

        setTimeout(() => {
            addLog("Swapping User ID in API call: /api/orders/9921 -> /api/orders/1001");
            if (userNode) userNode.classList.remove('scale-110');
            if (adminNode) {
                adminNode.classList.remove('opacity-50');
                adminNode.classList.add('scale-110', 'opacity-100');
            }
            if (targetIdLine) targetIdLine.classList.add('text-red-400');
            if (targetIdVal) targetIdVal.innerText = "1001 (Admin)";
        }, 2500);

        setTimeout(() => {
            addLog("Server Response: 200 OK (Unauthorized Access Successful)");
            addLog("[CRITICAL] BOLA vulnerability confirmed by Gemini Logic Engine!", true);
            if (btn) {
                btn.innerText = "Attack Verified";
                btn.classList.add('bg-red-600');
            }
            if (badge) badge.classList.remove('hidden');
        }, 4500);
    },

    // --- Privacy Shield Logic ---
    initPrivacy: () => {
        const rawEl = document.getElementById('raw-log-content');
        const secureEl = document.getElementById('secure-log-content');
        const loader = document.getElementById('scrubbing-loader');

        if (!rawEl || !secureEl) return;

        const rawData = [
            'User "john_doe" (email: john.d@example.com) accessed resource',
            'Payment processed. CC: 4532-xxxx-xxxx-9821 | CVV: 123',
            'Address updated: 123 Cyber Ave, Security City, 90210'
        ];

        const secureData = [
            'User "john_doe" (email: [EMAIL_REDACTED]) accessed resource',
            'Payment processed. CC: [CC_MASKED] | CVV: [REDACTED]',
            'Address updated: [ADDRESS_REDACTED]'
        ];

        // Add label for Presidio
        if (secureEl.parentElement && !secureEl.parentElement.querySelector('.presidio-label')) {
            const label = document.createElement('div');
            label.className = 'presidio-label absolute bottom-2 right-2 text-[10px] text-green-500/50 font-mono';
            label.innerText = 'Engine: Microsoft Presidio';
            secureEl.parentElement.appendChild(label);
        }

        let idx = 0;
        const updateLogs = () => {
            if (!document.getElementById('raw-log-content')) return;

            rawEl.innerText = rawData[idx];
            secureEl.innerText = rawData[idx]; // Initially show raw

            const t1 = setTimeout(() => {
                if (loader) loader.classList.remove('hidden'); // Show loader

                const t2 = setTimeout(() => {
                    if (loader) loader.classList.add('hidden'); // Hide loader
                    secureEl.innerText = secureData[idx]; // Show redacted

                    idx = (idx + 1) % rawData.length;
                    const t3 = setTimeout(updateLogs, 2000);
                    app.state.intervals.push(t3);
                }, 1000);
                app.state.intervals.push(t2);
            }, 1000);
            app.state.intervals.push(t1);
        };
        updateLogs();
    },

    verifyDomain: () => {
        const btn = document.getElementById('verify-btn');
        if (!btn) return;

        btn.innerHTML = `<i data-lucide="loader-2" class="h-4 w-4 animate-spin"></i> Checking...`;
        lucide.createIcons();

        setTimeout(() => {
            btn.classList.remove('bg-cyan-600', 'hover:bg-cyan-500');
            btn.classList.add('bg-green-600', 'hover:bg-green-500', 'cursor-default');
            btn.innerHTML = `<i data-lucide="check-circle" class="h-5 w-5"></i> Verified Successfully`;
            lucide.createIcons();
        }, 2000);
    }
};

// Start
document.addEventListener('DOMContentLoaded', app.init);
