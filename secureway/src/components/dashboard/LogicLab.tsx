"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    UserCheck,
    ShieldX,
    RefreshCw,
    AlertOctagon,
    FileJson
} from "lucide-react";

export function LogicLab() {
    const [activeUser, setActiveUser] = useState<"user" | "admin">("user");
    const [simulationStep, setSimulationStep] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const runSimulation = () => {
        setSimulationStep(1);
        addLog("Initiating BOLA check sequence...");

        setTimeout(() => {
            setSimulationStep(2);
            addLog("Capturing auth token: eyJhbGciOiJIUzI1NiIsInR...");
        }, 1000);

        setTimeout(() => {
            setSimulationStep(3);
            addLog("Swapping User ID in API call: /api/orders/9921 -> /api/orders/1001");
        }, 2500);

        setTimeout(() => {
            setSimulationStep(4);
            addLog("Server Response: 200 OK (Unauthorized Access Successful)");
            addLog("[CRITICAL] BOLA vulnerability confirmed!");
        }, 4500);
    };

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 text-slate-200">

            {/* Simulation Control Panel */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-100">
                    <ShieldX className="h-5 w-5 text-purple-400" />
                    Dual-Token Identity Simulation
                </h3>

                <div className="mb-8 flex items-center justify-center gap-8">
                    <motion.div
                        animate={{ scale: activeUser === "user" ? 1.1 : 1, opacity: activeUser === "user" ? 1 : 0.5 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="rounded-full bg-blue-500/20 p-4 ring-1 ring-blue-500">
                            <User className="h-8 w-8 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Standard User</span>
                    </motion.div>

                    <RefreshCw className="h-6 w-6 animate-spin text-slate-600" style={{ animationDuration: '3s' }} />

                    <motion.div
                        animate={{ scale: activeUser === "admin" ? 1.1 : 1, opacity: activeUser === "admin" ? 1 : 0.5 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="rounded-full bg-red-500/20 p-4 ring-1 ring-red-500">
                            <UserCheck className="h-8 w-8 text-red-400" />
                        </div>
                        <span className="text-sm font-medium">Admin Victim</span>
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-400">
                        <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                            <span>Request Header</span>
                            <span className="text-green-400">GET</span>
                        </div>
                        <div className="space-y-1">
                            <p>Authorization: Bearer <span className="text-yellow-500">user_token_123</span></p>
                            <p>Content-Type: application/json</p>
                            <motion.p
                                animate={{ color: simulationStep >= 3 ? "#ef4444" : "#94a3b8" }}
                            >
                                Target-ID: {simulationStep >= 3 ? "1001 (Admin)" : "9921 (Self)"}
                            </motion.p>
                        </div>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={simulationStep > 0 && simulationStep < 4}
                        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        {simulationStep === 0 ? "Start BOLA Probe" : simulationStep < 4 ? "Probing..." : "Attack Verified"}
                    </button>
                </div>
            </div>

            {/* Exploit Logs */}
            <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        <FileJson className="h-4 w-4" />
                        Logic Trace
                    </h3>
                    {simulationStep === 4 && (
                        <span className="animate-pulse rounded bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400 border border-red-500/20">
                            VULNERABILITY CONFIRMED
                        </span>
                    )}
                </div>

                <div className="flex-1 space-y-2 font-mono text-xs">
                    {logs.length === 0 && <span className="text-slate-600">Waiting for simulation...</span>}
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${log.includes("CRITICAL") ? "py-1 font-bold text-red-400" : "text-green-400/80"}`}
                        >
                            {log}
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
