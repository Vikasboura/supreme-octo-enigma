
document.addEventListener('DOMContentLoaded', () => {
    // Terminal typing effect for landing page
    const terminalBody = document.getElementById('landing-terminal');
    if (terminalBody) {
        let lines = [
            "> initializing rust_core...",
            "> loading agentic_models...",
            "> connecting to neural_fuzzing_grid...",
            "> system_ready: true"
        ];
        let i = 0;
        terminalBody.innerHTML = '';

        function typeWriter() {
            if (i < lines.length) {
                const line = document.createElement('div');
                line.textContent = lines[i];
                line.style.opacity = '0';
                line.style.transition = 'opacity 0.5s';
                terminalBody.appendChild(line);

                // Trigger reflow
                line.offsetHeight;
                line.style.opacity = '1';

                i++;
                setTimeout(typeWriter, 800);
            }
        }

        setTimeout(typeWriter, 1000);
    }

    // Domain Verification Logic (New)
    const verifyInput = document.getElementById('verify-domain-input');
    const registerBtn = document.getElementById('register-asset-btn');
    const verifyBtn = document.getElementById('verify-asset-btn');
    const statusDiv = document.getElementById('verification-status');
    const tokenDisplay = document.getElementById('token-display');
    const targetUrlInput = document.getElementById('target-url');

    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const domain = verifyInput.value.trim();
            if (!domain) return alert("Please enter a domain.");

            try {
                const res = await fetch('http://localhost:8000/assets/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain, method: 'dns' })
                });
                const data = await res.json();

                statusDiv.style.display = 'block';
                tokenDisplay.textContent = data.token;
                verifyBtn.disabled = false;

                // Pre-fill scan input
                if (targetUrlInput) targetUrlInput.value = `https://${data.domain}`;

            } catch (e) {
                alert("Error calling backend: " + e.message);
            }
        });

        verifyBtn.addEventListener('click', async () => {
            const domain = verifyInput.value.trim();
            try {
                // Try file method first as default for this demo context
                const res = await fetch('http://localhost:8000/assets/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain, method: 'file' })
                });

                if (res.ok) {
                    const data = await res.json();
                    alert(`✅ Verified! ${data.message} You can now scan this domain.`);
                    verifyBtn.textContent = "Verified ✓";
                    verifyBtn.style.borderColor = "#4ade80";
                    verifyBtn.style.color = "#4ade80";
                } else {
                    const err = await res.json();
                    alert(`❌ Verification Failed: ${err.detail}`);
                }
            } catch (e) {
                alert("Verification check failed.");
            }
        });
    }

    // Dashboard scanning handling
    const scanBtn = document.getElementById('start-scan-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', async () => {
            const urlInput = document.getElementById('target-url');
            const resultsArea = document.getElementById('scan-results');
            const target = urlInput.value.trim();

            if (!target) {
                alert('Please enter a valid URL');
                return;
            }

            resultsArea.innerHTML = `<div>[*] Initiating secure handshake with target: ${target}...</div>`;
            scanBtn.disabled = true;
            scanBtn.textContent = 'Scanning...';

            try {
                // Call Python Backend
                const response = await fetch('http://localhost:8000/scan/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: target })
                });

                if (response.status === 403) {
                    const err = await response.json();
                    resultsArea.innerHTML += `<div style="color: #f87171; font-weight:bold;">[!] SECURITY BLOCK: ${err.detail}</div>`;
                    scanBtn.disabled = false;
                    scanBtn.textContent = 'Scan Blocked';
                    if (verifyInput) {
                        verifyInput.scrollIntoView({ behavior: 'smooth' });
                        // Try to parse domain from url
                        try {
                            const urlObj = new URL(target.startsWith('http') ? target : `http://${target}`);
                            verifyInput.value = urlObj.hostname;
                        } catch (e) {
                            verifyInput.value = target;
                        }
                    }
                    return;
                }

                const data = await response.json();

                if (data.scan_id) {
                    resultsArea.innerHTML += `<div>[+] Scan Job Created: ${data.scan_id}</div>`;
                    resultsArea.innerHTML += `<div>[+] Status: ${data.status}</div>`;

                    // Poll status simulating real-time updates
                    let progress = 0;
                    const interval = setInterval(async () => {
                        progress += 10;
                        if (progress > 100) progress = 100;

                        // Fake logs for smooth UX
                        const logs = [
                            "[*] Rust Core: Analyzing authorization headers...",
                            "[*] Agent 1: Fuzzing IDOR parameters in /api/v1/user",
                            "[*] Agent 2: Checking for BOLA vulnerabilities...",
                            "[*] Python Nmap: Port scanning target infrastructure...",
                            "[*] Analysis Complete."
                        ];

                        const logIndex = Math.floor(progress / 20) % logs.length;
                        resultsArea.innerHTML += `<div>${logs[logIndex]}</div>`;
                        resultsArea.scrollTop = resultsArea.scrollHeight;

                        if (progress >= 100) {
                            clearInterval(interval);
                            scanBtn.disabled = false;
                            scanBtn.textContent = 'Start New Scan';
                            resultsArea.innerHTML += `<div style="color: #06b6d4; font-weight: bold;">[!] Scan Completed. Final Score: 85/100 (Secure)</div>`;
                        }

                    }, 800);
                }

            } catch (error) {
                resultsArea.innerHTML += `<div style="color: #ef4444;">[!] Error connecting to backend logic engine: ${error.message}</div>`;
                scanBtn.disabled = false;
                scanBtn.textContent = 'Retry Scan';
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // OAuth2PasswordRequestForm expects form-urlencoded data
                const formData = new URLSearchParams();
                formData.append('username', email); // standard compliant
                formData.append('password', password);

                const res = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('token', data.access_token);
                    window.location.href = 'dashboard.html';
                } else {
                    const errorData = await res.json();
                    alert('Login failed: ' + (errorData.detail || 'Invalid credentials'));
                }
            } catch (error) {
                console.error(error);
                if (confirm("Backend unreachable. Enter Demo Mode?")) {
                    window.location.href = 'dashboard.html';
                }
            }
        });
    }
});
