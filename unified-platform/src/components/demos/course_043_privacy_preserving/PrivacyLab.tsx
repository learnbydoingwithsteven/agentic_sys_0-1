'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    EyeOff,
    CheckCircle,
    Lock,
    RefreshCw,
    Cpu
} from 'lucide-react';
import { redactPII, RedactionResult } from '@/actions/course_043_privacy_preserving/privacy_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const SAMPLE_TEXT = `My email is john.doe@example.com and my credit card is 4532-1234-5678-9012. Please process payment.`;

export function PrivacyLab() {
    const [input, setInput] = useState(SAMPLE_TEXT);
    const [result, setResult] = useState<RedactionResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Fetch models on mount
    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRedact = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await redactPII(input, selectedModel);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm gap-4">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Lock className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h3 className="font-bold text-lg">PII Shield</h3>
                            <p className="text-zinc-500 text-sm">Automatic Data Redaction Middleware</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Model Selector */}
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                            <Cpu className="w-4 h-4 text-zinc-500" />
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                            >
                                {models.length === 0 && <option value="">Loading...</option>}
                                {models.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleRedact}
                            disabled={loading || !selectedModel}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                            {loading ? 'Scanning...' : 'Anonymize Data'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 h-full min-h-0">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Raw Input (Unsafe)
                    </label>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="flex-1 w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-2xl p-6 resize-none focus:ring-2 ring-red-500 outline-none font-mono text-sm leading-relaxed"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Sanitized Output (Safe)
                    </label>
                    <div className="flex-1 w-full bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 overflow-y-auto relative">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl">
                                <div className="animate-pulse text-emerald-700 font-bold">Scrubbing PII...</div>
                            </div>
                        )}
                        {!result && !loading && (
                            <div className="text-zinc-400 italic text-center mt-20">Ready to sanitize.</div>
                        )}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-mono text-sm leading-relaxed whitespace-pre-wrap"
                            >
                                {result.redacted.split(/(\[.*?\])/g).map((part, i) => (
                                    part.startsWith('[') && part.endsWith(']')
                                        ? <span key={i} className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1 rounded font-bold">{part}</span>
                                        : <span key={i} className="text-zinc-700 dark:text-zinc-300">{part}</span>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detected Badges */}
            {result && result.detectedTypes.length > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex gap-2 justify-center"
                >
                    {result.detectedTypes.map(type => (
                        <div key={type} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-2">
                            <Lock className="w-3 h-3" /> PI DETECTED: {type}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
