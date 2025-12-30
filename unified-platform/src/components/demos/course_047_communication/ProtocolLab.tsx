'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Code,
    ArrowRight,
    Braces,
    FileText,
    Cpu
} from 'lucide-react';
import { runProtocolTest, ProtocolResult } from '@/actions/course_047_communication/communication_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ProtocolLab() {
    const [request, setRequest] = useState("I'll have two chemex coffees, table 5. One with extra milk. Oh and a croissant.");
    const [result, setResult] = useState<ProtocolResult | null>(null);
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

    const handleRun = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await runProtocolTest(request, selectedModel);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-2 block">User Request (Ambiguous)</label>
                    <input
                        value={request}
                        onChange={e => setRequest(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200 focus:ring-2 ring-indigo-500 outline-none"
                    />
                </div>

                {/* Model Selector */}
                <div className="flex flex-col gap-2 mt-6">
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 h-12">
                        <Cpu className="w-4 h-4 text-zinc-500" />
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer w-24"
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleRun}
                    disabled={loading || !selectedModel}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 mt-6 disabled:opacity-50"
                >
                    {loading ? <Braces className="w-5 h-5 animate-spin" /> : <Braces className="w-5 h-5" />}
                    {loading ? 'Testing...' : 'Compare Protocols'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 min-h-0">
                {/* Left: Natural Language (Sloppy) */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                        <MessageSquare className="w-4 h-4" /> Unstructured (Sloppy)
                    </div>
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
                        {loading && <div className="absolute inset-0 bg-white/50 dark:bg-black/50 animate-pulse" />}
                        {!result && !loading && <div className="text-zinc-400 italic">No output yet.</div>}

                        {result && (
                            <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                {result.sloppyOutput}
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                            Human-Readable Only
                        </div>
                    </div>
                </div>

                {/* Right: Structured (Strict) */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                        <Code className="w-4 h-4" /> JSON Protocol (Strict)
                    </div>
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden font-mono text-sm text-green-400">
                        {loading && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
                        {!result && !loading && <div className="text-zinc-600 italic">No output yet.</div>}

                        {result && result.strictOutput && (
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(result.strictOutput, null, 2)}
                            </pre>
                        )}

                        <div className="absolute bottom-4 right-4 bg-green-900 text-green-300 text-xs font-bold px-2 py-1 rounded border border-green-800">
                            Machine-Readable
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
