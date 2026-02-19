"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    Search,
    ShieldAlert,
    Terminal,
    Globe,
    Lock,
    BrainCircuit,
    Activity
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const vulnerabilities = [
    { id: 1, name: "BOLA - User ID Manipulation", severity: "Critical", time: "2m ago" },
    { id: 2, name: "Shadow DOM Injection", severity: "High", time: "5m ago" },
    { id: 3, name: "PII Leak in Logs", severity: "Medium", time: "12m ago" },
    { id: 4, name: "Unverified Graph Origin", severity: "Low", time: "15m ago" },
];

export function OverviewDashboard() {
    const [scanProgress, setScanProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setScanProgress((prev) => (prev < 100 ? prev + 1 : 100));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const chartData = {
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [
            {
                label: "Vulnerabilities",
                data: [12, 19, 3, 5],
                backgroundColor: [
                    "rgba(239, 68, 68, 0.6)",
                    "rgba(249, 115, 22, 0.6)",
                    "rgba(234, 179, 8, 0.6)",
                    "rgba(59, 130, 246, 0.6)",
                ],
                borderColor: [
                    "rgba(239, 68, 68, 1)",
                    "rgba(249, 115, 22, 1)",
                    "rgba(234, 179, 8, 1)",
                    "rgba(59, 130, 246, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#cbd5e1' }
            },
            title: {
                display: true,
                text: 'Vuln Severity Distribution',
                color: '#cbd5e1'
            },
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
        }
    };

    return (
        <div className="space-y-6 text-slate-200">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    { label: "Attack Surface", value: "86%", icon: Globe, color: "text-blue-400" },
                    { label: "Active Threats", value: "12", icon: ShieldAlert, color: "text-red-400" },
                    { label: "Logic Gaps", value: "4", icon: BrainCircuit, color: "text-purple-400" },
                    { label: "Secure Score", value: "92/100", icon: CheckCircle, color: "text-green-400" },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="mt-1 text-2xl font-bold text-slate-100">{stat.value}</h3>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Real-time Graph */}
                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Live Feed */}
                <div className="col-span-1 space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                        <Activity className="h-4 w-4 text-cyan-400" />
                        Live Threat Feed
                    </h3>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {vulnerabilities.map((vuln) => (
                                <motion.div
                                    key={vuln.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between rounded-lg border border-slate-800 p-3 hover:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className={`h-4 w-4 ${vuln.severity === "Critical" ? "text-red-500" :
                                            vuln.severity === "High" ? "text-orange-500" : "text-yellow-500"
                                            }`} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{vuln.name}</p>
                                            <p className="text-xs text-slate-500">{vuln.severity}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-600">{vuln.time}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4">
                        <div className="mb-1 flex justify-between text-xs text-slate-400">
                            <span>Scan Progress</span>
                            <span>{scanProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                                className="h-full bg-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${scanProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


