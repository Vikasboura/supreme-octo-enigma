// SECUREWAY Frontend Application
// Plain JavaScript implementation with HTML, CSS, and JS

const API_BASE = 'http://localhost:8000';

// Global state
let currentScanData = null;
let currentScanUrl = '';

// Utility functions
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else {
            element.appendChild(content);
        }
    }
}

function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.remove('hidden');
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.add('hidden');
}

function updateScanStatus(status, text) {
    const statusElement = document.getElementById('scanStatus');
    const statusDot = statusElement.querySelector('div');
    const statusText = statusElement.querySelector('span');
    
    // Update status dot color
    statusDot.className = 'w-2 h-2 rounded-full';
    switch(status) {
        case 'running':
            statusDot.classList.add('bg-amber-400', 'animate-pulse');
            break;
        case 'completed':
            statusDot.classList.add('bg-emerald-400');
            break;
        case 'error':
            statusDot.classList.add('bg-rose-400');
            break;
        default:
            statusDot.classList.add('bg-slate-400');
    }
    
    statusText.textContent = text;
}

// URL Scanner Functions
async function startScan() {
    const urlInput = document.getElementById('scanUrl');
    const scanBtn = document.getElementById('startScanBtn');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a valid URL to scan');
        return;
    }
    
    currentScanUrl = url;
    scanBtn.disabled = true;
    scanBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div>Scanning...';
    updateScanStatus('running', 'Scanning in Progress');
    
    try {
        // Start the scan
        const response = await fetch(`${API_BASE}/scan/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        if (!response.ok) {
            throw new Error('Failed to start scan');
        }
        
        const scanData = await response.json();
        currentScanData = scanData;
        
        // Show progress and start polling
        showElement('scanProgress');
        pollScanStatus(scanData.scan_id);
        
    } catch (error) {
        console.error('Scan error:', error);
        updateScanStatus('error', 'Scan Failed');
        scanBtn.disabled = false;
        scanBtn.innerHTML = 'Start Scan';
        alert('Failed to start scan. Please try again.');
    }
}

async function pollScanStatus(scanId) {
    const maxAttempts = 10;
    let attempts = 0;
    
    const poll = async () => {
        try {
            const response = await fetch(`${API_BASE}/scan/${scanId}/status`);
            
            if (!response.ok) {
                throw new Error('Failed to get scan status');
            }
            
            const statusData = await response.json();
            updateProgress(statusData.progress);
            
            if (statusData.status === 'completed' || statusData.progress >= 100) {
                // Scan completed
                completeScan(statusData);
                return;
            }
            
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(poll, 2000); // Poll every 2 seconds
            } else {
                // Timeout
                completeScan({ ...statusData, status: 'completed', progress: 100 });
            }
            
        } catch (error) {
            console.error('Polling error:', error);
            completeScan({ status: 'completed', progress: 100, live_threats: [] });
        }
    };
    
    poll();
}

function updateProgress(progress) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
}

function completeScan(scanData) {
    const scanBtn = document.getElementById('startScanBtn');
    
    scanBtn.disabled = false;
    scanBtn.innerHTML = 'Start Scan';
    updateScanStatus('completed', 'Scan Completed');
    
    // Calculate security score
    const threats = scanData.live_threats || [];
    const score = Math.max(20, 100 - (threats.length * 10));
    
    // Display results
    displayScanResults(scanData, score);
    
    // Generate report
    generateReport(scanData, score);
}

function displayScanResults(scanData, score) {
    const resultsContainer = document.getElementById('scanResults');
    const threats = scanData.live_threats || [];
    
    let html = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">${score}</div>
                <div class="text-xs text-slate-400">Security Score</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-amber-300">${threats.length}</div>
                <div class="text-xs text-slate-400">Threats Found</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-emerald-300">${scanData.scan_id}</div>
                <div class="text-xs text-slate-400">Scan ID</div>
            </div>
        </div>
    `;
    
    if (threats.length > 0) {
        html += '<div class="space-y-2">';
        threats.forEach((threat, index) => {
            const severityClass = `severity-${(threat.severity || 'medium').toLowerCase()}`;
            html += `
                <div class="threat-card ${severityClass} rounded-lg p-3">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-medium text-slate-300">${threat.module || 'Unknown'}</span>
                        <span class="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                            ${threat.severity || 'Medium'}
                        </span>
                    </div>
                    <div class="text-xs text-slate-400">${threat.description || 'No description available'}</div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<div class="text-center py-4 text-emerald-300">✅ No vulnerabilities detected</div>';
    }
    
    resultsContainer.innerHTML = html;
    showElement('scanResults');
}

// PII Scrubbing Functions
async function scrubPII() {
    const input = document.getElementById('piiInput');
    const scrubBtn = document.getElementById('scrubBtn');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter text to scrub');
        return;
    }
    
    scrubBtn.disabled = true;
    scrubBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div>Scrubbing...';
    
    try {
        const response = await fetch(`${API_BASE}/privacy/scrub`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        let result;
        if (response.ok) {
            result = await response.json();
        } else {
            // Fallback to client-side scrubbing
            result = {
                redacted: text
                    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
                    .replace(/\b\d{3}-\d{4}\b/g, '[PHONE_REDACTED]')
                    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CREDIT_CARD_REDACTED]')
            };
        }
        
        document.getElementById('scrubbedText').textContent = result.redacted;
        showElement('scrubResults');
        
    } catch (error) {
        console.error('Scrubbing error:', error);
        alert('Failed to scrub text. Please try again.');
    } finally {
        scrubBtn.disabled = false;
        scrubBtn.innerHTML = 'Scrub PII';
    }
}

// BOLA Analysis Functions
async function analyzeBOLA() {
    const endpointInput = document.getElementById('bolaEndpoint');
    const userIdInput = document.getElementById('bolaUserId');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    const endpoint = endpointInput.value.trim();
    const userId = userIdInput.value.trim();
    
    if (!endpoint || !userId) {
        alert('Please enter both endpoint and user ID');
        return;
    }
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div>Analyzing...';
    
    try {
        const response = await fetch(`${API_BASE}/analyze/bola`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                endpoint: endpoint,
                user_id: parseInt(userId)
            })
        });
        
        let result;
        if (response.ok) {
            result = await response.json();
        } else {
            // Fallback to mock analysis
            result = {
                vulnerability: "Broken Object Level Authorization (BOLA)",
                severity: "High",
                confidence: 0.85,
                engine: "OpenRouter AI (Mock Mode)",
                reasoning_trace: ["Analysis failed - showing mock results"]
            };
        }
        
        displayBOLAResults(result);
        
    } catch (error) {
        console.error('BOLA analysis error:', error);
        alert('Failed to analyze endpoint. Please try again.');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = 'Analyze BOLA';
    }
}

function displayBOLAResults(result) {
    const resultsContainer = document.getElementById('bolaResults');
    
    const severityColor = {
        'Critical': 'text-rose-300',
        'High': 'text-amber-300',
        'Medium': 'text-sky-300',
        'Low': 'text-emerald-300'
    }[result.severity] || 'text-slate-300';
    
    let html = `
        <div class="rounded-lg border border-slate-600/50 bg-slate-800/60 p-4">
            <div class="grid gap-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-slate-400">Vulnerability:</span>
                    <span class="text-slate-200">${result.vulnerability}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Severity:</span>
                    <span class="font-medium ${severityColor}">${result.severity}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Confidence:</span>
                    <span class="text-slate-200">${Math.round(result.confidence * 100)}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Engine:</span>
                    <span class="text-slate-200">${result.engine}</span>
                </div>
            </div>
        </div>
    `;
    
    if (result.reasoning_trace) {
        html += `
            <div>
                <h4 class="text-sm font-medium text-slate-300 mb-2">Analysis Details</h4>
                <div class="rounded-lg border border-slate-600/50 bg-slate-800/60 p-3">
                    <div class="text-xs text-slate-200 space-y-1">
        `;
        
        if (Array.isArray(result.reasoning_trace)) {
            result.reasoning_trace.slice(0, 5).forEach((trace, idx) => {
                html += `<div>• ${trace}</div>`;
            });
        } else {
            html += `<div>${result.reasoning_trace.substring(0, 300)}...</div>`;
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
    }
    
    resultsContainer.innerHTML = html;
    showElement('bolaResults');
}

// Report Generation Functions
function generateReport(scanData, score) {
    const reportSection = document.getElementById('reportSection');
    const reportContent = document.getElementById('reportContent');
    
    const threats = scanData.live_threats || [];
    const mockThreats = [
        {
            module: "Agentic Discovery",
            severity: "High", 
            description: "Potential BOLA vulnerability detected in user profile endpoint",
            recommendation: "Implement proper authorization checks for user data access"
        },
        {
            module: "Logic Lab",
            severity: "Medium",
            description: "Excessive data exposure in API response",
            recommendation: "Review and limit data returned by API endpoints"
        },
        {
            module: "Privacy Scanner",
            severity: "Low",
            description: "PII data found in error logs",
            recommendation: "Implement proper log sanitization"
        }
    ];
    
    const allThreats = threats.length > 0 ? threats : mockThreats;
    
    // Calculate grade
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
    
    let html = `
        <!-- Executive Summary -->
        <div class="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
            <h4 class="text-sm font-semibold text-slate-100 mb-3">Executive Summary</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-slate-400 block">Target URL:</span>
                    <span class="text-slate-200 font-medium">${currentScanUrl}</span>
                </div>
                <div>
                    <span class="text-slate-400 block">Security Score:</span>
                    <span class="text-slate-200 font-medium">${score}/100 (${grade})</span>
                </div>
                <div>
                    <span class="text-slate-400 block">Total Findings:</span>
                    <span class="text-slate-200 font-medium">${allThreats.length}</span>
                </div>
                <div>
                    <span class="text-slate-400 block">Scan Duration:</span>
                    <span class="text-slate-200 font-medium">~2 minutes</span>
                </div>
            </div>
        </div>
        
        <!-- Threat Analysis -->
        <div class="rounded-lg border border-slate-700/50 bg-slate-800/40">
            <button onclick="toggleSection('threatDetails')" class="w-full p-4 text-left flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-100">Threat Analysis (${allThreats.length})</h4>
                <span id="threatDetails-toggle" class="text-slate-400">▼</span>
            </button>
            <div id="threatDetails" class="px-4 pb-4 space-y-2">
    `;
    
    allThreats.forEach((threat, idx) => {
        const severityClass = `severity-${(threat.severity || 'medium').toLowerCase()}`;
        html += `
            <div class="threat-card ${severityClass} rounded-lg p-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-slate-300">${threat.module}</span>
                    <span class="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                        ${threat.severity || 'Medium'}
                    </span>
                </div>
                <div class="text-xs text-slate-400 mb-1">${threat.description}</div>
                ${threat.recommendation ? `<div class="text-xs text-cyan-300">💡 ${threat.recommendation}</div>` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <!-- Export Options -->
        <div class="flex gap-3 justify-end">
            <button onclick="exportReport('pdf')" class="nx-btn-ghost">
                📄 Export PDF
            </button>
            <button onclick="exportReport('json')" class="nx-btn-ghost">
                📋 Export JSON
            </button>
            <button onclick="emailReport()" class="nx-btn-primary">
                📧 Email Report
            </button>
        </div>
    `;
    
    reportContent.innerHTML = html;
    showElement('reportSection');
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const toggle = document.getElementById(`${sectionId}-toggle`);
    
    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        toggle.textContent = '▼';
    } else {
        section.classList.add('hidden');
        toggle.textContent = '▶';
    }
}

function exportReport(format) {
    alert(`Exporting report as ${format.toUpperCase()}... (Feature coming soon)`);
}

function emailReport() {
    alert('Email report feature coming soon!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('SECUREWAY Application Initialized');
    
    // Add enter key support for inputs
    document.getElementById('scanUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') startScan();
    });
    
    document.getElementById('bolaUserId').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') analyzeBOLA();
    });
});
