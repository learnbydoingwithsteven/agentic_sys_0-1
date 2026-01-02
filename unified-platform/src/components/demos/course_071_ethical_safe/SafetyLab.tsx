'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    Check,
    Loader2
} from 'lucide-react';
import { checkContentSafety, SafetyScore } from '@/actions/course_071_ethical_safe/safety_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function SafetyLab() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<SafetyScore | null>(null);
    const [loading, setLoading] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleCheck = async () => {
        if (!input || !selectedModel) return;
        setLoading(true);
        try {
            const res = await checkContentSafety(input, selectedModel);
            setResult(res);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Input Area */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        Content Moderation Sandbox
                    </h3>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 outline-none"
                        disabled={loading}
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message (try 'I hate everyone' to trigger filters)..."
                    className="w-full h-32 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl outline-none resize-none border border-transparent focus:border-indigo-500 transition-colors"
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleCheck}
                        disabled={!input || loading || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Scan Content
                    </button>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 grid grid-cols-2 gap-6">
                {/* Result Card */}
                <div className={`
                    rounded-3xl p-8 border-2 flex flex-col items-center justify-center gap-4 transition-colors relative overflow-hidden
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
                            className="text-center z-10"
                        >
                            {result.safe ? <Check className="w-20 h-20 text-emerald-500 mx-auto mb-4" /> : <ShieldAlert className="w-20 h-20 text-rose-500 mx-auto mb-4" />}
                            <h2 className="text-3xl font-black uppercase mb-2">
                                {result.safe ? 'Approved' : 'Flagged'}
                            </h2>
                            <p className="opacity-70 mb-4">
                                {result.reason || (result.safe ? 'Content is safe.' : 'Harmful content detected.')}
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
