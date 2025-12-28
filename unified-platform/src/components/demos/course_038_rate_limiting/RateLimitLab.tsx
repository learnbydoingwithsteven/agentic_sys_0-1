'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    Zap,
    History,
    Activity,
    Lock
} from 'lucide-react';
import { processLimitedRequest, getStatus, Bucket } from '@/actions/course_038_rate_limiting/ratelimit_backend';

export function RateLimitLab() {
    const [userId] = useState("user_" + Math.random().toString(36).substr(2, 9));
    const [tokens, setTokens] = useState(5);
    const [logs, setLogs] = useState<{ msg: string, success: boolean, time: number }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Polling for bucket state visualization
    useEffect(() => {
        const interval = setInterval(async () => {
            const status = await getStatus(userId);
            setTokens(status.tokens);
        }, 1000);
        return () => clearInterval(interval);
    }, [userId]);

    const handleRequest = async () => {
        setIsProcessing(true);
        try {
            const res = await processLimitedRequest(userId, `Request ${logs.length + 1}`);

            setLogs(prev => [{
                msg: res.response || "Error",
                success: res.success,
                time: Date.now()
            }, ...prev].slice(0, 10)); // Keep last 10

            // Update local token count deeply immediately for snapiness (bucket might be ahead)
            if (res.meta) setTokens(res.meta.remaining);

        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-[500px]">

            {/* Left: Bucket Visualization */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                <h3 className="text-zinc-500 font-bold mb-6 text-sm flex items-center gap-2">
                    <History className="w-4 h-4" />
                    TOKEN BUCKET
                </h3>

                {/* The Bucket Container */}
                <div className="w-24 h-64 bg-white dark:bg-zinc-800 border-4 border-zinc-300 dark:border-zinc-700 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-2 shadow-inner">
                    {/* Refill Drip Animation (Pure CSS) */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <motion.div
                            animate={{ y: [0, 20], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-2 h-4 bg-blue-400 rounded-full"
                        />
                    </div>

                    {/* Tokens */}
                    <AnimatePresence>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: i < tokens ? 1 : 0.1, scale: i < tokens ? 1 : 0.9 }}
                                transition={{ type: 'spring' }}
                                className={`w-full h-8 mb-1 rounded-full border-2 border-blue-500/20 shadow-sm ${i < tokens ? 'bg-blue-500' : 'bg-transparent'}`}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-4 text-center">
                    <div className="text-4xl font-black text-zinc-800 dark:text-zinc-100">{tokens}<span className="text-base font-normal text-zinc-400">/5</span></div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Available Tokens</div>
                </div>
            </div>

            {/* Right: Interaction Area */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Controls */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-start gap-4">
                    <div>
                        <h3 className="text-lg font-bold">API Gateway</h3>
                        <p className="text-sm text-zinc-500">
                            Send requests. You consume <strong>1 token</strong> per click. Tokens refill every <strong>2s</strong>.
                        </p>
                    </div>

                    <button
                        onClick={handleRequest}
                        // We allow clicking even if disabled logic triggers, to show the error
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${tokens > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30' : 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800 cursor-not-allowed'}`}
                    >
                        {tokens > 0 ? (
                            <><Zap className="w-5 h-5" /> Send Request</>
                        ) : (
                            <><Lock className="w-5 h-5" /> Rate Limited (429)</>
                        )}
                    </button>
                </div>

                {/* Logs */}
                <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Network Traffic
                    </h3>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.time}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-3 rounded-lg text-sm font-mono border flex items-center gap-3 ${log.success ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="opacity-50 text-xs">{new Date(log.time).toLocaleTimeString().split(' ')[0]}</span>
                                    <span>{log.msg}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {logs.length === 0 && (
                            <div className="text-center text-zinc-400 italic text-sm mt-10">
                                No requests yet. Start spamming!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
