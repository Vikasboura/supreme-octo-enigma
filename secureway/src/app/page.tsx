"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type ScanStatus = "idle" | "running" | "completed";

// PII Scrubbing Component
function PIIScrubbingFeature() {
  const [inputText, setInputText] = useState("");
  const [scrubbedText, setScrubbedText] = useState("");
  const [isScrubbing, setIsScrubbing] = useState(false);

  const handleScrub = async () => {
    if (!inputText.trim() || isScrubbing) return;
    
    setIsScrubbing(true);
    
    try {
      const response = await fetch("http://localhost:8000/privacy/scrub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrub text");
      }

      const data = await response.json();
      setScrubbedText(data.redacted);
    } catch (err) {
      console.error("Scrubbing failed", err);
      // Fallback to basic scrubbing
      const basicScrubbed = inputText
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]")
        .replace(/\b\d{3}-\d{4}\b/g, "[PHONE_REDACTED]");
      setScrubbedText(basicScrubbed);
    } finally {
      setIsScrubbing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="font-medium text-slate-100">PII Scrubber</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-300">
          Privacy Protection
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-medium text-slate-300">
            Input Text (contains PII)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text containing emails, phone numbers, or other PII..."
            className="mt-1 w-full h-24 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleScrub}
            disabled={!inputText.trim() || isScrubbing}
            className="nx-btn-primary px-4 py-2 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScrubbing ? "Scrubbing..." : "Scrub PII"}
          </button>
        </div>
        
        {scrubbedText && (
          <div>
            <label className="text-[11px] font-medium text-slate-300">
              Scrubbed Output
            </label>
            <div className="mt-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200">
              {scrubbedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// BOLA Analysis Component
function BOLAAnalysisFeature() {
  const [endpoint, setEndpoint] = useState("");
  const [userId, setUserId] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!endpoint.trim() || !userId.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("http://localhost:8000/analyze/bola", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          endpoint: endpoint.trim(),
          user_id: parseInt(userId.trim())
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze endpoint");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis failed", err);
      // Fallback to mock analysis
      setAnalysisResult({
        vulnerability: "Broken Object Level Authorization (BOLA)",
        severity: "High",
        confidence: 0.85,
        engine: "OpenRouter AI (Mock Mode)",
        reasoning_trace: ["Analysis failed - showing mock results"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="font-medium text-slate-100">BOLA Analyzer</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-300">
          AI Security Analysis
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-300">
              API Endpoint
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/orders/123"
              className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
          
          <div>
            <label className="text-[11px] font-medium text-slate-300">
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="456"
              className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!endpoint.trim() || !userId.trim() || isAnalyzing}
            className="nx-btn-primary px-4 py-2 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze BOLA"}
          </button>
        </div>
        
        {analysisResult && (
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-600/50 bg-slate-800/60 p-3">
              <div className="grid gap-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vulnerability:</span>
                  <span className="text-slate-200">{analysisResult.vulnerability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Severity:</span>
                  <span className={`font-medium ${
                    analysisResult.severity === "Critical" ? "text-rose-300" :
                    analysisResult.severity === "High" ? "text-amber-300" :
                    analysisResult.severity === "Medium" ? "text-sky-300" :
                    "text-emerald-300"
                  }`}>{analysisResult.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-slate-200">{Math.round(analysisResult.confidence * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine:</span>
                  <span className="text-slate-200">{analysisResult.engine}</span>
                </div>
              </div>
            </div>
            
            {analysisResult.reasoning_trace && (
              <div>
                <label className="text-[11px] font-medium text-slate-300">
                  Analysis Details
                </label>
                <div className="mt-1 rounded-lg border border-slate-600/50 bg-slate-800/60 p-3">
                  <div className="space-y-1 text-[10px] text-slate-200">
                    {Array.isArray(analysisResult.reasoning_trace) ? 
                      analysisResult.reasoning_trace.slice(0, 5).map((trace: string, idx: number) => (
                        <div key={idx} className="truncate">• {trace}</div>
                      )) :
                      <div className="text-slate-300">{analysisResult.reasoning_trace}</div>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Scan Report Component
function ScanReport({ scanData, targetUrl, score }: { scanData: any; targetUrl: string; score: number }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("threats");

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "text-rose-300 bg-rose-500/10";
      case "high": return "text-amber-300 bg-amber-500/10";
      case "medium": return "text-sky-300 bg-sky-500/10";
      case "low": return "text-emerald-300 bg-emerald-500/10";
      default: return "text-slate-300 bg-slate-500/10";
    }
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

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

  return (
    <div className="space-y-4">
      {/* Executive Summary */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3">
        <h4 className="text-xs font-semibold text-slate-100 mb-2">Executive Summary</h4>
        <div className="grid gap-2 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Target URL:</span>
            <span className="text-slate-200">{targetUrl}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Security Score:</span>
            <span className="text-slate-200">{score}/100 ({getScoreGrade(score)} grade)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Findings:</span>
            <span className="text-slate-200">{allThreats.length} vulnerabilities</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scan Duration:</span>
            <span className="text-slate-200">~2 minutes</span>
          </div>
        </div>
      </div>

      {/* Threat Analysis */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40">
        <button
          onClick={() => setExpandedSection(expandedSection === "threats" ? null : "threats")}
          className="w-full p-3 text-left flex items-center justify-between"
        >
          <h4 className="text-xs font-semibold text-slate-100">Threat Analysis ({allThreats.length})</h4>
          <span className="text-slate-400">{expandedSection === "threats" ? "▼" : "▶"}</span>
        </button>
        
        {expandedSection === "threats" && (
          <div className="px-3 pb-3 space-y-2">
            {allThreats.map((threat: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-slate-600/30 bg-slate-900/60 p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-300">{threat.module}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mb-1">{threat.description}</div>
                {threat.recommendation && (
                  <div className="text-[9px] text-cyan-300">
                    💡 {threat.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Breakdown */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40">
        <button
          onClick={() => setExpandedSection(expandedSection === "risk" ? null : "risk")}
          className="w-full p-3 text-left flex items-center justify-between"
        >
          <h4 className="text-xs font-semibold text-slate-100">Risk Breakdown</h4>
          <span className="text-slate-400">{expandedSection === "risk" ? "▼" : "▶"}</span>
        </button>
        
        {expandedSection === "risk" && (
          <div className="px-3 pb-3">
            <div className="grid gap-2 text-[10px]">
              {["Critical", "High", "Medium", "Low"].map((severity) => {
                const count = allThreats.filter((t: any) => t.severity === severity).length;
                const percentage = allThreats.length > 0 ? (count / allThreats.length) * 100 : 0;
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <span className="text-slate-400">{severity}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">{count}</span>
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            severity === "Critical" ? "bg-rose-400" :
                            severity === "High" ? "bg-amber-400" :
                            severity === "Medium" ? "bg-sky-400" :
                            "bg-emerald-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40">
        <button
          onClick={() => setExpandedSection(expandedSection === "recommendations" ? null : "recommendations")}
          className="w-full p-3 text-left flex items-center justify-between"
        >
          <h4 className="text-xs font-semibold text-slate-100">Security Recommendations</h4>
          <span className="text-slate-400">{expandedSection === "recommendations" ? "▼" : "▶"}</span>
        </button>
        
        {expandedSection === "recommendations" && (
          <div className="px-3 pb-3 space-y-2">
            <div className="text-[10px] text-slate-300 space-y-1">
              <div>• Implement proper authentication and authorization controls</div>
              <div>• Review and limit data exposure in API responses</div>
              <div>• Add input validation and sanitization</div>
              <div>• Implement proper error handling and logging</div>
              <div>• Regular security testing and code reviews</div>
              <div>• Keep dependencies updated and patched</div>
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="flex gap-2 justify-end">
        <button className="nx-btn-ghost px-3 py-1 text-[9px]">
          📄 Export PDF
        </button>
        <button className="nx-btn-ghost px-3 py-1 text-[9px]">
          📋 Export JSON
        </button>
        <button className="nx-btn-primary px-3 py-1 text-[9px]">
          📧 Email Report
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [score, setScore] = useState(86);
  const [owaspSummary, setOwaspSummary] = useState<{ id: string; severity: string }[]>([]);
  const [scanUrl, setScanUrl] = useState("");
  const [scanResults, setScanResults] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi, I'm the SentinelNexus copilot. Ask me about recent findings, risk posture, or how the agentic fuzzers are testing your app.",
    },
  ]);

  const handleStartScan = async () => {
    if (scanStatus === "running" || !scanUrl.trim()) return;
    
    setScanStatus("running");
    setScanResults(null);
    setScore(86);

    try {
      const startResp = await fetch("http://localhost:8000/scan/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: scanUrl.trim() }),
      });

      if (!startResp.ok) {
        throw new Error("Failed to start scan");
      }

      const startData: { scan_id: string; status: string; target: string } =
        await startResp.json();

      // Poll for scan status
      let scanComplete = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!scanComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResp = await fetch(
          `http://localhost:8000/scan/${startData.scan_id}/status`,
        );

        if (statusResp.ok) {
          const statusData: {
            scan_id: string;
            progress: number;
            status: string;
            live_threats: any[];
          } = await statusResp.json();

          setScanResults(statusData);
          
          if (statusData.status === "completed" || statusData.progress >= 100) {
            scanComplete = true;
            setScanStatus("completed");
            setScore(Math.max(20, 100 - (statusData.live_threats.length * 10)));
          }
        }
        
        attempts++;
      }

      if (!scanComplete) {
        setScanStatus("completed");
        setScore(75);
      }

    } catch (err) {
      console.error("Scan failed", err);
      setTimeout(() => {
        setScanStatus("completed");
        setScore(75);
      }, 2000);
    }
  };

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user" as const, content: chatInput.trim() };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    const lower = userMessage.content.toLowerCase();
    let reply =
      "I run simulated attacks against your modern web stack, correlate anomalies with known exploit patterns, and summarize the highest-risk flows for your team.";

    if (lower.includes("bola") || lower.includes("authorization")) {
      reply =
        "The agents pivot across object IDs and user roles, looking for places where access checks are missing or inconsistent. Any successful BOLA chain is surfaced as a critical finding.";
    } else if (lower.includes("score") || lower.includes("risk")) {
      reply =
        "Your current security score is derived from severity, exploitability, and blast radius of active findings, then normalized over the last 10 scans.";
    } else if (lower.includes("how") && lower.includes("work")) {
      reply =
        "SentinelNexus combines a headless crawler, agentic cognitive fuzzers, and an AI reasoning engine. Together they explore flows, mutate inputs, and reason about which behaviors are actually dangerous.";
    }

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: reply,
        },
      ]);
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-50">
      <div className="nx-grid-overlay" />

      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 z-0 flex justify-center">
        <div className="h-64 w-[40rem] rounded-full bg-cyan-500/40 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-900/80 bg-black/40 backdrop-blur-xl">
        <div className="nx-container flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-900/80">
              <Image
                src="/secureway-logo.jpg"
                alt="SECUREWAY logo"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-slate-100 uppercase">
                SECUREWAY
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                SentinelNexus AI
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-[11px] font-medium text-slate-400 sm:flex">
            <a href="#features" className="hover:text-cyan-300">
              Features
            </a>
            <a href="#dashboard" className="hover:text-cyan-300">
              Dashboard
            </a>
            <a href="#workflow" className="hover:text-cyan-300">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-cyan-300">
              Pricing
            </a>
          </nav>
          <button className="nx-btn-ghost hidden sm:inline-flex">Request Demo</button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="nx-section pb-6">
          <div className="nx-container grid min-h-[calc(100vh-4rem)] gap-12 items-center lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <span className="nx-badge mb-4">Autonomous AI Web Security</span>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.3rem] lg:leading-tight">
                <span className="nx-gradient-text">
                  SECUREWAY AI
                </span>{" "}
                — Autonomous Security for Modern Web Applications
              </h1>
              <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-slate-400 sm:text-sm">
                SECUREWAY AI continuously red-teams your JavaScript
                and React/Next.js applications using agentic cognitive fuzzing,
                AI behavioral analysis, and automated attack simulation to
                uncover logic vulnerabilities before attackers do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="nx-btn-primary gap-2"
                >
                  <span>
                    Start Scan
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-900" />
                </button>
                <button className="nx-btn-ghost">
                  View Architecture
                </button>
                <p className="ml-1 text-[11px] text-slate-400">
                  No agents installed • Zero-knowledge scanning
                </p>
              </div>
              <div className="mt-8 grid gap-4 text-xs text-slate-300 sm:grid-cols-3">
                <div className="nx-card">
                  <div className="text-[11px] font-medium text-cyan-300">
                    Agentic Red-Teaming
                  </div>
                  <p className="mt-1 text-xs text-slate-300/90">
                    Cognitive fuzzing agents explore workflows and API edges
                    across modern SPAs.
                  </p>
                </div>
                <div className="nx-card">
                  <div className="text-[11px] font-medium text-cyan-300">
                    Logic-Aware Detection
                  </div>
                  <p className="mt-1 text-xs text-slate-300/90">
                    Targets BOLA/BAC and business logic flaws missed by
                    signature scanners.
                  </p>
                </div>
                <div className="nx-card">
                  <div className="text-[11px] font-medium text-cyan-300">
                    Encrypted Insights
                  </div>
                  <p className="mt-1 text-xs text-slate-300/90">
                    End-to-end encrypted reporting with AI-driven PII masking.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard preview card */}
            <div id="dashboard" className="nx-card border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/90">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-100">Live Scan</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${scanStatus === "running"
                    ? "bg-amber-500/10 text-amber-300"
                    : scanStatus === "completed"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-slate-700/60 text-slate-200"
                    }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {scanStatus === "running"
                    ? "Simulated Attack In Progress"
                    : scanStatus === "completed"
                      ? "Scan Completed"
                      : "Idle"}
                </span>
              </div>
              
              {/* URL Input Section */}
              <div className="mb-4 p-3 rounded-lg border border-slate-700/50 bg-slate-900/40">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-medium text-slate-300">
                    Target URL to Scan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={scanUrl}
                      onChange={(e) => setScanUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                    />
                    <button
                      onClick={handleStartScan}
                      disabled={!scanUrl.trim() || scanStatus === "running"}
                      className="nx-btn-primary px-4 py-2 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {scanStatus === "running" ? "Scanning..." : "Start Scan"}
                    </button>
                  </div>
                  {scanResults && (
                    <div className="mt-2 text-[10px] text-slate-400">
                      <div>Scan ID: {scanResults.scan_id}</div>
                      <div>Progress: {scanResults.progress}%</div>
                      <div>Status: {scanResults.status}</div>
                      {scanResults.live_threats && scanResults.live_threats.length > 0 && (
                        <div>Threats Found: {scanResults.live_threats.length}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Scan Report Section */}
              {scanResults && scanResults.status === "completed" && (
                <div className="mb-4 rounded-lg border border-slate-700/50 bg-slate-900/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-100">Scan Report</h3>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-300">
                      Analysis Complete
                    </span>
                  </div>
                  
                  <ScanReport scanData={scanResults} targetUrl={scanUrl} score={score} />
                </div>
              )}
              
              <div className="grid gap-3 text-[11px] text-slate-200 sm:grid-cols-3">
                <div>
                  <div className="text-slate-400">Security Score</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-2xl font-semibold">{score}</span>
                    <span className="text-[10px] text-emerald-300">A- grade</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Findings by severity</div>
                  <div className="mt-2 h-28 rounded-lg bg-slate-950/60 px-2 py-1.5">
                    <Bar
                      data={{
                        labels: ["Critical", "High", "Medium", "Low"],
                        datasets: [
                          {
                            data: [3, 7, 14, 9],
                            backgroundColor: [
                              "rgba(248, 113, 113, 0.9)",
                              "rgba(251, 191, 36, 0.9)",
                              "rgba(56, 189, 248, 0.9)",
                              "rgba(148, 163, 184, 0.9)",
                            ],
                            borderRadius: 6,
                            borderSkipped: false,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            enabled: true,
                            backgroundColor: "rgba(15,23,42,0.95)",
                            borderColor: "rgba(148,163,184,0.6)",
                            borderWidth: 1,
                            titleColor: "#e5e7eb",
                            bodyColor: "#e5e7eb",
                          },
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: {
                              color: "#9ca3af",
                              font: { size: 10 },
                            },
                          },
                          y: {
                            grid: {
                              color: "rgba(30,64,175,0.35)",
                            },
                            ticks: {
                              color: "#6b7280",
                              font: { size: 9 },
                              precision: 0,
                            },
                            beginAtZero: true,
                            suggestedMax: 16,
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="mt-2 rounded-lg border border-slate-800/70 bg-slate-950/80 p-2 text-[10px] text-slate-300">
                    <div className="mb-1 flex items-center justify-between text-[9px] text-slate-400">
                      <span>Recent reports</span>
                      <span>Last 24h</span>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-center justify-between">
                        <span className="truncate pr-2">
                          Checkout-flow logic bypass
                        </span>
                        <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] text-rose-300">
                          Critical
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="truncate pr-2">
                          BOLA in GraphQL order API
                        </span>
                        <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">
                          High
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="truncate pr-2">
                          Excessive data exposure in profile
                        </span>
                        <span className="rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[9px] text-sky-300">
                          Medium
                          {owaspSummary.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-slate-400">
                              <span className="text-slate-500">OWASP focus:</span>
                              {owaspSummary.map((f, idx) => (
                                <span
                                  key={`${f.id}-${idx}`}
                                  className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] text-slate-200"
                                >
                                  {f.id} · {f.severity}
                                </span>
                              ))}
                            </div>
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Agent Activity</div>
                  <ul className="mt-1 space-y-1.5">
                    <li className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300">
                        GraphQL BOLA probe
                      </span>
                      <span className="text-[9px] text-slate-500">30s ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300">
                        OAuth flow exploration
                      </span>
                      <span className="text-[9px] text-slate-500">2m ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300">
                        Business rule mutation
                      </span>
                      <span className="text-[9px] text-slate-500">5m ago</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-slate-800/70 bg-slate-900/80 p-3 text-[11px] text-slate-200">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-slate-100">
                    React Checkout Flow
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-300">
                    JS-heavy SPA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Agentic swarm simulating privilege escalation, broken object
                  level authorization (BOLA), and payment bypass vectors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PII Scrubbing Feature */}
        <section className="nx-section pt-8">
          <div className="nx-container">
            <h2 className="text-lg font-semibold text-slate-50">
              PII Data Scrubbing & Privacy Protection
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-slate-400">
              Automatically redact sensitive information from logs and text data using AI-powered privacy protection.
            </p>
            
            <div className="mt-6 nx-card border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/90">
              <PIIScrubbingFeature />
            </div>
          </div>
        </section>

        {/* BOLA Analysis Feature */}
        <section className="nx-section pt-8">
          <div className="nx-container">
            <h2 className="text-lg font-semibold text-slate-50">
              BOLA Vulnerability Analysis
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-slate-400">
              AI-powered analysis of Broken Object Level Authorization vulnerabilities in your API endpoints.
            </p>
            
            <div className="mt-6 nx-card border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/90">
              <BOLAAnalysisFeature />
            </div>
          </div>
        </section>

        {/* AI assistant panel */}
        <section className="nx-section pt-8">
          <div className="nx-container grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                SECUREWAY AI copilot for security teams
              </h2>
              <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-slate-400">
                A conversational assistant embedded into the dashboard to help
                triage findings, explain exploit chains, and suggest remediation
                steps – powered by the same reasoning engine that drives the
                scans.
              </p>
              <ul className="mt-5 grid gap-3 text-[13px] text-slate-200/90 sm:grid-cols-2">
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    Explain complex findings
                  </div>
                  <p className="mt-1 text-[13px] text-slate-300/90">
                    Turn low-level payloads and traces into human-readable
                    narratives your product teams can act on.
                  </p>
                </li>
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    Guided attack replays
                  </div>
                  <p className="mt-1 text-[13px] text-slate-300/90">
                    Ask the copilot to walk you through how an agent reached a
                    specific vulnerable state.
                  </p>
                </li>
              </ul>
            </div>

            <div className="nx-card flex h-full flex-col border-cyan-500/40 bg-slate-950/70">
              <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="nx-eyebrow">AI assistant (mock)</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] text-slate-300">
                  Gemini-powered reasoning
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-hidden rounded-2xl bg-slate-950/80 p-3 text-[11px] text-slate-200">
                <div className="h-48 space-y-2 overflow-y-auto pr-1">
                  {chatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`max-w-xs rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${m.role === "assistant"
                        ? "bg-slate-900/90 text-slate-200"
                        : "ml-auto bg-cyan-500/10 text-cyan-100"
                        }`}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>
              </div>
              <form
                onSubmit={handleChatSubmit}
                className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-2"
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about BOLA, risk score, or remediation…"
                  className="flex-1 border-none bg-transparent text-[11px] text-slate-200 outline-none placeholder:text-slate-500"
                />
                <button type="submit" className="nx-btn-primary px-4 py-2 text-[10px]">
                  Send
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* About & Key Features */}
        <section id="features" className="nx-section">
          <div className="nx-container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Built for modern web security teams
              </h2>
              <p className="mt-3 text-sm text-slate-300/90">
                Traditional scanners break on JavaScript-heavy apps and miss
                subtle authorization bugs. SECUREWAY combines a headless
                crawling engine, AI behavioral analysis, and autonomous
                red-teaming to reason about how your app behaves, not just what
                endpoints exist.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="nx-card">
                  <h3 className="text-xs font-semibold text-cyan-300">
                    Autonomous Red-Teaming
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-300/90">
                    Scenario-driven agents chain actions across flows, APIs,
                    and user roles to uncover real attacker paths.
                  </p>
                </div>
                <div className="nx-card">
                  <h3 className="text-xs font-semibold text-cyan-300">
                    AI Behavioral Scanning
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-300/90">
                    Gemini-powered reasoning detects anomalous state changes,
                    bypassed guards, and trust boundary violations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <div className="nx-card flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                    Focus on React & Next.js
                  </div>
                  <p className="mt-1 text-[13px] text-slate-300/90">
                    Captures client-side logic, feature flags, and complex
                    conditional rendering paths.
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
                  SPA-native
                </span>
              </div>
              <div className="nx-card">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                    Modern web app challenges
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    Logic flaws
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Supply chain
                  </div>
                </div>
                <p className="mt-1 text-[13px] text-slate-300/90">
                  Single-page apps, third-party SDKs, and distributed
                  micro-frontends introduce attack surfaces traditional DAST
                  tools cannot see. SentinelNexus AI reasons about user intent
                  and data flows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="nx-section border-y border-slate-800/70 bg-slate-950/60">
          <div className="nx-container">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Technology Stack
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/90">
              A full-stack, AI-native pipeline from crawling to encrypted
              reporting. Ready for cloud-native and on-prem deployments.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Backend",
                  items: ["Python 3.12", "FastAPI", "Rust extensions"],
                },
                {
                  title: "AI Layer",
                  items: ["Gemini AI", "PyOD", "LangChain"],
                },
                {
                  title: "Scanning Engine",
                  items: ["Playwright (stealth)", "Interactsh OAST"],
                },
                {
                  title: "Data Infrastructure",
                  items: ["PostgreSQL", "Redis", "Pinecone Vector DB"],
                },
                {
                  title: "Security",
                  items: [
                    "AES-256 encryption",
                    "RSA-signed reports",
                    "Vault integration",
                  ],
                },
                {
                  title: "Infrastructure",
                  items: ["Docker-based deployment"],
                },
              ].map((stack) => (
                <div key={stack.title} className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    {stack.title}
                  </div>
                  <ul className="mt-2 space-y-1 text-[13px] text-slate-200/90">
                    {stack.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Animated attack simulation strip */}
            <div className="mt-10 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900/70 to-slate-950 px-5 py-4 text-[11px] text-slate-300 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between">
                <span className="nx-eyebrow">Attack simulation timeline</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] text-slate-400">
                  {scanStatus === "running" ? "Replay in progress" : "Last simulated run"}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Unauthenticated probe</span>
                    <span>Encrypted report</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-700 ${scanStatus === "running" ? "w-4/5" : "w-full"
                        }`}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-slate-500">
                    <span>Recon</span>
                    <span>Traversal</span>
                    <span>Privilege test</span>
                    <span>Exploit chain</span>
                    <span>Reporting</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-300 md:mt-0 md:w-60">
                  <div className="h-9 w-9 rounded-2xl bg-slate-900/80 shadow-[0_12px_30px_rgba(0,0,0,0.9)]" />
                  <p>
                    Visualizes how SentinelNexus agent swarms move through your
                    app, chaining recon, exploitation, and secure evidence
                    capture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="nx-section">
          <div className="nx-container">
            <h2 className="text-lg font-semibold text-slate-50">
              From crawl to encrypted report in five stages
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {[
                {
                  step: "01",
                  title: "Intelligent crawling",
                  body: "Headless Playwright browser maps routes, auth flows, and states of your SPA.",
                },
                {
                  step: "02",
                  title: "Behavioral analysis",
                  body: "AI observes UI reactions, API calls, and state transitions to learn normal behavior.",
                },
                {
                  step: "03",
                  title: "Attack simulation",
                  body: "Agentic cognitive fuzzers mutate inputs and sequences to simulate real adversaries.",
                },
                {
                  step: "04",
                  title: "Vulnerability reasoning",
                  body: "Gemini and anomaly detectors classify BOLA/BAC, injection, and logic flaws.",
                },
                {
                  step: "05",
                  title: "Secure reporting",
                  body: "Findings are encrypted, PII-masked, and shipped into your DevSecOps workflow.",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="nx-card h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-300">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.step}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] text-slate-300/90">
                      {item.body}
                    </p>
                  </div>
                  {item.step !== "05" && (
                    <div className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-px w-9 translate-y-[-50%] bg-gradient-to-r from-cyan-400 to-transparent md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Pricing */}
        <section className="nx-section border-y border-slate-800/70 bg-slate-950/70">
          <div className="nx-container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Security & privacy by design
              </h2>
              <p className="mt-3 text-sm text-slate-300/90">
                Every scan is executed under a zero-knowledge philosophy. Raw
                payloads stay encrypted, reports are signed, and sensitive
                artifacts are automatically masked before leaving your
                environment.
              </p>
              <ul className="mt-5 grid gap-3 text-[13px] text-slate-200/90 sm:grid-cols-2">
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    End-to-end encryption
                  </div>
                  <p className="mt-1">
                    AES-256 for data in transit and at rest, with optional
                    hardware-backed keys.
                  </p>
                </li>
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    Zero-knowledge scanning
                  </div>
                  <p className="mt-1">
                    SECUREWAY never requires raw customer data; only
                    anonymized signals are analyzed.
                  </p>
                </li>
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    AI PII masking
                  </div>
                  <p className="mt-1">
                    Large language models detect and redact PII before logs and
                    reports are persisted.
                  </p>
                </li>
                <li className="nx-card">
                  <div className="text-xs font-semibold text-cyan-300">
                    Enterprise controls
                  </div>
                  <p className="mt-1">
                    Role-aware access, detailed audit trails, and on-prem
                    deployment options.
                  </p>
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div id="pricing" className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                SaaS model
              </h3>
              <div className="grid gap-3 text-[13px] text-slate-200 sm:grid-cols-2">
                <div className="nx-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      Lite
                    </span>
                    <span className="text-[11px] text-slate-400">Free</span>
                  </div>
                  <p className="mt-1">On-demand basic scans for side projects.</p>
                </div>
                <div className="nx-card border-cyan-500/70 bg-slate-900/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      Guardian
                    </span>
                    <span className="text-[11px] text-emerald-300">
                      Most popular
                    </span>
                  </div>
                  <p className="mt-1">
                    Continuous monitoring for product teams with CI/CD
                    integration.
                  </p>
                </div>
                <div className="nx-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      Compliance
                    </span>
                    <span className="text-[11px] text-slate-400">Audit-ready</span>
                  </div>
                  <p className="mt-1">
                    Deep evidence bundles for SOC2, PCI, and internal audits.
                  </p>
                </div>
                <div className="nx-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      Enterprise
                    </span>
                    <span className="text-[11px] text-slate-400">Custom</span>
                  </div>
                  <p className="mt-1">
                    On-prem or private cloud deployment with dedicated support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="nx-section pb-10">
          <div className="nx-container flex flex-col gap-6 border-t border-slate-800/80 pt-8 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-100">
                SECUREWAY • SentinelNexus AI
              </div>
              <p className="mt-1 max-w-md">
                Prototype interface for an autonomous AI-powered web security
                platform. Frontend-only demo – no real scanning performed.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Resources
                </span>
                <a className="hover:text-cyan-300" href="#">
                  Documentation (coming soon)
                </a>
                <a className="hover:text-cyan-300" href="#">
                  GitHub / Research
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Contact
                </span>
                <span>security@secureway.ai (demo)</span>
                <span>For hackathon / investor demos only.</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
