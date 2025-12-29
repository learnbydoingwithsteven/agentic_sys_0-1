'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    Check
} from 'lucide-react';
import { checkContentSafety, SafetyScore } from '@/actions/course_071_ethical_safe/safety_backend';

export function SafetyLab() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<SafetyScore | null>(null);

    const handleCheck = async () => {
        if (!input) return;
        const res = await checkContentSafety(input);
        setResult(res);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Input Area */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    Content Moderation Sandbox
                </h3>
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message (try 'I hate everyone' to trigger filters)..."
                    className="w-full h-32 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl outline-none resize-none border border-transparent focus:border-indigo-500 transition-colors"
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleCheck}
                        disabled={!input}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        Scan Content
                    </button>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 grid grid-cols-2 gap-6">
                {/* Result Card */}
                <div className={`
                    rounded-3xl p-8 border-2 flex flex-col items-center justify-center gap-4 transition-colors
                    ${!result ? 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800' :
                        result.safe ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' :
                            'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800'}
                `}>
                    {!result ? (
                        <div className="text-zinc-400 text-center">
                            Scan to see result
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            {result.safe ? <Check className="w-20 h-20 text-emerald-500 mx-auto mb-4" /> : <ShieldAlert className="w-20 h-20 text-rose-500 mx-auto mb-4" />}
                            <h2 className="text-3xl font-black uppercase mb-2">
                                {result.safe ? 'Approved' : 'Flagged'}
                            </h2>
                            <p className="opacity-70">
                                {result.safe ? 'Content is safe for generation.' : 'Harmful content detected. Request blocked.'}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Metrics */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center gap-6">
                    {result && Object.entries(result.categories).map(([cat, score]) => (
                        <div key={cat}>
                            <div className="flex justify-between text-sm font-bold uppercase mb-2 text-zinc-500">
                                <span>{cat.replace('_', ' ')}</span>
                                <span className={score > 0.5 ? 'text-rose-500' : 'text-emerald-500'}>{(score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score * 100}%` }}
                                    className={`h-full ${score > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        </div>
                    ))}
                    {!result && (
                        <div className="text-center text-zinc-400 opacity-50">
                            Awaiting metrics...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
