"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileCheck,
    UploadCloud,
    Server,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";

export function AuthorizedFramework() {
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "verified" | "failed">("idle");
    const [method, setMethod] = useState<"dns" | "file">("dns");

    const startVerification = () => {
        setVerificationStatus("verifying");
        setTimeout(() => {
            setVerificationStatus("verified");
        }, 2500);
    };

    return (
        <div className="mx-auto max-w-2xl text-slate-200">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 shadow-lg backdrop-blur">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-cyan-500/10 p-4 ring-1 ring-cyan-500/30">
                        <FileCheck className="h-10 w-10 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Domain Ownership Verification</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        To prevent unauthorized scanning, please verify you own <span className="font-mono text-slate-200">demo.secureway.ai</span>
                    </p>
                </div>

                {/* Method Selection */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setMethod("dns")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all ${method === "dns"
                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                            }`}
                    >
                        <Server className="h-6 w-6" />
                        <span className="text-xs font-semibold">DNS Record</span>
                    </button>
                    <button
                        onClick={() => setMethod("file")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all ${method === "file"
                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                            }`}
                    >
                        <UploadCloud className="h-6 w-6" />
                        <span className="text-xs font-semibold">HTML File Upload</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="mb-6 rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-400">
                    {method === "dns" ? (
                        <div className="space-y-2">
                            <p>Add the following TXT record to your DNS configuration:</p>
                            <div className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200">
                                <span>secureway-verification=9283-akjhe-1928</span>
                                <button className="text-xs text-cyan-500 hover:text-cyan-400">Copy</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p>Upload this HTML file to your root directory:</p>
                            <div className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200">
                                <span>secureway-verify.html</span>
                                <button className="text-xs text-cyan-500 hover:text-cyan-400">Download</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={startVerification}
                    disabled={verificationStatus === "verifying" || verificationStatus === "verified"}
                    className={`group flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold transition-all ${verificationStatus === "verified"
                            ? "bg-green-600 text-white cursor-default"
                            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        }`}
                >
                    {verificationStatus === "idle" && "Verify Ownership"}
                    {verificationStatus === "verifying" && (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Checking...
                        </>
                    )}
                    {verificationStatus === "verified" && (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            Verified Successfully
                        </>
                    )}
                </button>

                {verificationStatus === "verified" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center text-xs text-green-400"
                    >
                        You are now authorized to initiate scans on this target.
                    </motion.div>
                )}
            </div>
        </div>
    );
}
