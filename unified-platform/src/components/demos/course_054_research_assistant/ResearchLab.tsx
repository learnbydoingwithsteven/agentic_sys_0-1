'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    BookOpen,
    FileText,
    Link as LinkIcon,
    Loader2,
    Globe
} from 'lucide-react';
import { runResearch, ResearchResult } from '@/actions/course_054_research_assistant/research_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ResearchLab() {
    const [topic, setTopic] = useState("Quantum Computing");
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [status, setStatus] = useState<'idle' | 'searching' | 'synthesizing'>('idle');

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!topic || !selectedModel) return;
        setStatus('searching');
        setResult(null);

        try {
            // Mimic the two phases for better UX since the backend does them sequentially
            // In a streaming setup these would be real-time
            setTimeout(() => setStatus('synthesizing'), 2000);

            const res = await runResearch(topic, selectedModel);
            setResult(res);
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input & Controls */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-4 items-center bg-zinc-50 dark:bg-zinc-800/50 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Search className="w-5 h-5 text-zinc-400" />
                    <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRun()}
                        placeholder="Enter research topic..."
                        className="flex-1 bg-transparent py-3 border-none outline-none font-medium text-zinc-900 dark:text-zinc-100"
                        disabled={status !== 'idle'}
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer min-w-[140px]"
                        disabled={status !== 'idle'}
                    >
                        {models.length === 0 && <option value="">Loading models...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleRun}
                        disabled={status !== 'idle' || !topic || !selectedModel}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center shadow-lg shadow-sky-900/20 active:scale-95"
                    >
                        {status === 'idle' ? (
                            <>Research</>
                        ) : (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        )}
                    </button>
                </div>
            </div>

            {/* Status Indicator */}
            <AnimatePresence>
                {status !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 py-2 rounded-lg"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {status === 'searching' ? 'Browsing web sources...' : 'Reading and synthesizing report...'}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
                {/* Sources Column */}
                <div className="md:w-1/3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs mb-4 flex items-center gap-2 sticky top-0 bg-inherit py-2 z-10">
                        <Globe className="w-4 h-4" /> Web Sources
                    </h3>
                    <div className="space-y-3 flex-1">
                        {result ? result.sources.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow group cursor-default"
                            >
                                <div className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-tight mb-2 group-hover:underline decoration-2 underline-offset-2">{s.title}</div>
                                <div className="text-zinc-400 text-[10px] truncate mb-3 flex items-center gap-1 font-mono uppercase tracking-wider">
                                    <LinkIcon className="w-3 h-3" /> {new URL('https://' + s.url.replace(/^https?:\/\//, '')).hostname}
                                </div>
                                <div className="text-zinc-600 dark:text-zinc-300 text-xs italic line-clamp-3 bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded border border-zinc-100 dark:border-zinc-800/50 pl-3 border-l-2 border-l-zinc-300 dark:border-l-zinc-600">
                                    "{s.snippet}"
                                </div>
                            </motion.div>
                        )) : (
                            !status && (
                                <div className="text-center text-zinc-400 text-xs mt-20 flex flex-col items-center gap-2">
                                    <Search className="w-8 h-8 opacity-20" />
                                    <span>No sources loaded</span>
                                </div>
                            )
                        )}
                        {status === 'searching' && (
                            <div className="space-y-3 opacity-50 pointer-events-none">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Synthesis Column */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar shadow-sm relative">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs mb-6 flex items-center gap-2 sticky top-0 bg-white dark:bg-zinc-900 py-2 z-10 border-b border-zinc-100 dark:border-zinc-800">
                        <FileText className="w-4 h-4" /> Synthesized Report
                    </h3>

                    {result ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="prose dark:prose-invert prose-zinc max-w-none"
                        >
                            <h1 className="text-2xl font-bold mb-6 capitalize tracking-tight text-zinc-900 dark:text-zinc-50">{topic} Report</h1>
                            <div className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300 text-base">
                                {result.synthesis}
                            </div>

                            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Sources Used</div>
                                <div className="flex flex-wrap gap-2">
                                    {result.sources.map((s, i) => (
                                        <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                                            [{i + 1}] {s.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 opacity-40 p-4">
                            <BookOpen className="w-20 h-20 mb-4" />
                            <p className="font-medium text-lg text-center">Enter a topic to generate a research report</p>
                            <p className="text-sm">The agent will browse simulated web sources and synthesize a summary.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
