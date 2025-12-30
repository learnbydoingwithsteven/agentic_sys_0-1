'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    AlertTriangle,
    FileText,
    Bot,
    Cpu
} from 'lucide-react';
import { checkHallucination, FactCheck } from '@/actions/course_042_agent_hallucination/hallucination_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const DEFAULT_SOURCE = `Apollo 11 was the spaceflight that first landed humans on the Moon. Commander Neil Armstrong and lunar module pilot Buzz Aldrin formed the American crew that landed the Apollo Lunar Module Eagle on July 20, 1969.`;

const DEFAULT_RESPONSE = `Apollo 11 landed on the Moon on July 20, 1969. The mission was commanded by John Glenn, who stepped onto the surface first.`;

export function HallucinationLab() {
    const [source, setSource] = useState(DEFAULT_SOURCE);
    const [response, setResponse] = useState(DEFAULT_RESPONSE);
    const [checks, setChecks] = useState<FactCheck[]>([]);
    const [analyzing, setAnalyzing] = useState(false);

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

    const handleCheck = async () => {
        if (!selectedModel) return;
        setAnalyzing(true);
        const res = await checkHallucination(source, response, selectedModel);
        setChecks(res);
        setAnalyzing(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="grid grid-cols-2 gap-8 h-1/2">
                {/* Source Input */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Ground Truth Source
                    </label>
                    <textarea
                        value={source}
                        onChange={e => setSource(e.target.value)}
                        className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm resize-none focus:ring-2 ring-indigo-500 outline-none"
                    />
                </div>

                {/* Agent Output Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                            <Bot className="w-4 h-4" /> Agent Response
                        </label>

                        {/* Model Selector */}
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                            <Cpu className="w-3 h-3 text-zinc-500" />
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
                    </div>
                    <textarea
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                        className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm resize-none focus:ring-2 ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleCheck}
                    disabled={analyzing || !selectedModel}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                >
                    <ShieldCheck className="w-5 h-5" />
                    {analyzing ? 'Verifying Facts...' : 'Check for Hallucinations'}
                </button>
            </div>

            {/* Analysis Result */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Verification Report
                </h3>

                <div className="space-y-4">
                    {checks.length === 0 && !analyzing && (
                        <div className="text-zinc-400 italic text-center text-sm">Run check to see analysis.</div>
                    )}
                    {analyzing && (
                        <div className="text-zinc-400 italic text-center text-sm animate-pulse">Running Fact Check Agent...</div>
                    )}

                    {checks.map((check, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-xl border flex gap-4 items-start ${check.isHallucinated
                                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900'
                                    : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900'
                                }`}
                        >
                            <div className="shrink-0 mt-1">
                                {check.isHallucinated
                                    ? <AlertTriangle className="w-5 h-5 text-red-500" />
                                    : <ShieldCheck className="w-5 h-5 text-green-500" />
                                }
                            </div>
                            <div>
                                <div className={`font-medium ${check.isHallucinated ? 'text-red-900 dark:text-red-200' : 'text-green-900 dark:text-green-200'}`}>
                                    "{check.sentence}"
                                </div>
                                {check.isHallucinated && (
                                    <div className="text-sm text-red-600 dark:text-red-400 mt-1 font-bold">
                                        Potential Hallucination: {check.reason}
                                    </div>
                                )}
                                {!check.isHallucinated && (
                                    <div className="text-xs text-green-600 dark:text-green-400 mt-1 opacity-70">
                                        Verified against source text.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
