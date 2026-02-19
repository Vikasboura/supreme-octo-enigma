"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/layout/Sidebar";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { AgenticDiscovery } from "@/components/dashboard/AgenticDiscovery";
import { LogicLab } from "@/components/dashboard/LogicLab";
import { PrivacyShield } from "@/components/dashboard/PrivacyShield";
import { AuthorizedFramework } from "@/components/dashboard/AuthorizedFramework";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Command, Search, Settings, Cpu } from "lucide-react";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="flex h-screen w-full bg-[#050509] text-slate-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/50 px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Ask SentinelNexus AI..."
                                className="h-9 w-64 rounded-full border border-slate-800 bg-slate-900 pl-9 pr-4 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Tech Stack Indicator */}
                        <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] sm:flex">
                            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-green-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            </span>
                            <span className="font-mono text-slate-400">CORE:</span>
                            <span className="font-semibold text-xs text-slate-300">Python 3.12 • FastAPI • Rust</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative text-slate-400 hover:text-slate-200">
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                            <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-slate-800 bg-slate-800">
                                {/* Placeholder Avatar */}
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-600 to-indigo-700 text-xs font-bold text-white">
                                    SR
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background Grid */}
                    <div className="pointer-events-none fixed inset-0 z-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <div className="relative z-10 max-w-6xl mx-auto">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-100 capitalize">{activeTab.replace("-", " ")}</h1>
                                <p className="mt-1 text-sm text-slate-400">Real-time security posture analysis and threat simulation.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">Last updated: Just now</span>
                                <button className="rounded bg-slate-800 p-1 hover:bg-slate-700">
                                    <Command className="h-3 w-3 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "overview" && <OverviewDashboard />}
                                {activeTab === "agentic-discovery" && <AgenticDiscovery />}
                                {activeTab === "logic-lab" && <LogicLab />}
                                {activeTab === "privacy-shield" && <PrivacyShield />}
                                {activeTab === "authorized-framework" && <AuthorizedFramework />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
