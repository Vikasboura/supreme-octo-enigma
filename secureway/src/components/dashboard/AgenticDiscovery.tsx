"use client";

import { motion } from "framer-motion";
import {
    Network,
    Search,
    Terminal,
    Code,
    Globe,
    Database,
    Server
} from "lucide-react";
import { useState, useEffect } from "react";

const mockLogs = [
    "[+] Initializing Headless V8 Context...",
    "[+] Injecting Shadow DOM Observer...",
    "[*] Found 3 encapsulated components in #shadow-root",
    "[*] Mapping internal API routes: /api/v1/user/7382",
    "[!] Lateral movement attempt: /api/v1/admin/debug",
    "[+] Fuzzing input parameters for SQLi...",
    "[*] Response 200 OK - No injection detected",
    "[!] Analyzing React Props for state leakage...",
];

export function AgenticDiscovery() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < mockLogs.length) {
                setLogs((prev) => [...prev, mockLogs[index]]);
                index++;
            } else {
                index = 0;
                setLogs([]);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-6 lg:grid-cols-3 text-slate-200">

            {/* Visual Network Graph Simulation */}
            <div className="col-span-2 flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
                        <Network className="h-4 w-4" />
                        Live Shadow DOM Mapping
                    </h3>
                    <span className="flex items-center gap-2 text-xs text-green-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        Active
                    </span>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-950/80 p-8">
                    {/* Animated Nodes */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="relative h-64 w-64 rounded-full border border-dashed border-slate-700"
                        >
                            <motion.div
                                className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-cyan-500/20 text-cyan-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Globe className="p-1" />
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-purple-500/20 text-purple-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                            >
                                <Database className="p-1" />
                            </motion.div>
                            <motion.div
                                className="absolute left-[-12px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-emerald-500/20 text-emerald-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                            >
                                <Server className="p-1" />
                            </motion.div>
                        </motion.div>

                        <div className="absolute">
                            <div className="flex flex-col items-center">
                                <div className="h-16 w-16 rounded-full bg-cyan-900/40 p-4 shadow-[0_0_30px_rgba(34,211,238,0.2)] ring-1 ring-cyan-500/50">
                                    <Code className="h-full w-full text-cyan-400" />
                                </div>
                                <span className="mt-2 text-xs font-mono text-cyan-500">App Core</span>
                            </div>
                        </div>
                    </div>

                    {/* Random Floating Particles */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-1 w-1 rounded-full bg-slate-500"
                            animate={{
                                x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                                y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Terminal Output */}
            <div className="col-span-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    <Terminal className="h-4 w-4" />
                    Agent Logs
                </h3>
                <div className="flex-1 overflow-hidden font-mono text-xs text-green-400/90">
                    <div className="flex flex-col gap-2">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-l-2 border-green-500/30 pl-2"
                            >
                                <span className="text-slate-500">{new Date().toLocaleTimeString().split(' ')[0]}</span>{" "}
                                {log}
                            </motion.div>
                        ))}
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="h-4 w-2 bg-green-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
