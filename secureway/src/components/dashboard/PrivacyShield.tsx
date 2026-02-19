"use client";

import { motion } from "framer-motion";
import {
    EyeOff,
    ShieldCheck,
    FileLock,
    UserX,
    Database
} from "lucide-react";
import { useState, useEffect } from "react";

const rawLogs = [
    'User "john_doe" (email: john.d@example.com) accessed resource',
    'Payment processed. CC: 4532-xxxx-xxxx-9821 | CVV: 123',
    'Address updated: 123 Cyber Ave, Security City, 90210',
    'Auth token generated for user_id: 88271',
    'Debugging dump: { "password": "super_secret_pw!" }'
];

const redactedLogs = [
    'User "john_doe" (email: [EMAIL_REDACTED]) accessed resource',
    'Payment processed. CC: [CC_MASKED] | CVV: [REDACTED]',
    'Address updated: [ADDRESS_REDACTED]',
    'Auth token generated for user_id: [ID_MASKED]',
    'Debugging dump: { "password": "[SENSITIVE_DATA_REMOVED]" }'
];

export function PrivacyShield() {
    const [activeLogIndex, setActiveLogIndex] = useState(0);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setActiveLogIndex((prev) => (prev + 1) % rawLogs.length);
            }, 1000);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-8 text-slate-200 lg:grid-cols-2">

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                    <EyeOff className="h-4 w-4" />
                    Raw Data Stream (Insecure)
                </h3>
                <div className="relative h-48 overflow-hidden rounded bg-slate-950 p-4 font-mono text-xs text-red-300/80">
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                    <AnimateText text={rawLogs[activeLogIndex]} key={activeLogIndex} />
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-400">
                    <ShieldCheck className="h-4 w-4" />
                    Neural PII Scrubber (Secure)
                </h3>
                <div className="relative h-48 overflow-hidden rounded bg-slate-950 p-4 font-mono text-xs text-green-300/80">
                    <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                    {processing ? (
                        <div className="flex h-full items-center justify-center text-green-500">
                            <ProcessingAnimation />
                        </div>
                    ) : (
                        <AnimateText text={redactedLogs[activeLogIndex]} key={activeLogIndex} />
                    )}
                </div>
            </div>

        </div>
    );
}

function AnimateText({ text }: { text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="break-all"
        >
            {text}
        </motion.div>
    );
}

function ProcessingAnimation() {
    return (
        <div className="flex items-center gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500 delay-100"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500 delay-200"></span>
        </div>
    )
}
