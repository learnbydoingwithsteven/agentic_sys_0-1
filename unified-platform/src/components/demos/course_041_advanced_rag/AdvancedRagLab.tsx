'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    Search,
    FileText,
    ArrowRight,
    CheckCircle,
    XCircle,
    RotateCcw
} from 'lucide-react';
import { advancedRagPipeline, RagResult } from '@/actions/course_041_advanced_rag/advanced_rag_backend';

export function AdvancedRagLab() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<RagResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSearch = async (text: string = query) => {
        if (!text.trim() || isProcessing) return;
        setIsProcessing(true);
        setResult(null);

        try {
            const res = await advancedRagPipeline(text);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Search Bar */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search documents (e.g., 'Does the bridge have color?')..."
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-lg"
                />
                <button
                    onClick={() => handleSearch()}
                    disabled={isProcessing || !query}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {isProcessing ? 'Ranking...' : 'Search'}
                </button>
            </div>

            <div className="flex gap-2">
                {[
                    "What color is the Golden Gate Bridge?",
                    "Is Pizza Italian?",
                    "Tell me about Python",
                    "What is the airspeed velocity?"
                ].map(q => (
                    <button
                        key={q}
                        onClick={() => { setQuery(q); handleSearch(q); }}
                        className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Pipeline Visualization */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">

                {/* 1. Retrieval Phase */}
                <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        1. Retrieval (Top 5)
                    </h3>

                    <div className="space-y-3">
                        {result ? result.originalDocs.map((doc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: doc.keep ? 1 : 0.5, scale: doc.keep ? 1 : 0.98 }}
                                className={`p-4 rounded-xl border transition-colors relative ${doc.keep ? 'bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-800 shadow-sm' : 'bg-transparent border-zinc-200 dark:border-zinc-800'}`}
                            >
                                <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">{doc.content}</div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-mono text-zinc-400">ID: {doc.id}</span>
                                    {doc.rerankScore !== undefined && (
                                        <span className={`font-bold px-2 py-0.5 rounded ${doc.keep ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-zinc-200 text-zinc-500'}`}>
                                            Score: {doc.rerankScore}/10
                                        </span>
                                    )}
                                </div>
                                {!doc.keep && (
                                    <div className="absolute inset-x-0 bottom-0 top-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="bg-zinc-800 text-white px-2 py-1 rounded text-xs font-bold">Filtered Out</span>
                                    </div>
                                )}
                            </motion.div>
                        )) : (
                            <div className="text-center text-zinc-400 mt-20">Waiting...</div>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col justify-center items-center text-zinc-300">
                    <ArrowRight className="w-8 h-8" />
                </div>

                {/* 2. Generation Phase */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Refined Context */}
                    <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800/50 overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            2. Refined Context
                        </h3>
                        <div className="space-y-3">
                            {result?.refinedDocs.length ? result.refinedDocs.map((doc, idx) => (
                                <div key={idx} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-sm text-zinc-800 dark:text-zinc-200">
                                    {doc.content}
                                </div>
                            )) : (
                                result && <div className="text-sm text-red-500 italic">No context passes threshold.</div>
                            )}
                            {!result && <div className="text-center text-indigo-200 mt-20">Waiting...</div>}
                        </div>
                    </div>

                    {/* Final Answer */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md h-1/3">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Final Response
                        </h3>
                        <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-100 overflow-y-auto h-full">
                            {result ? (
                                <div>
                                    <div className="mb-2 text-xs font-bold uppercase tracking-wider">
                                        Status: {result.selfCorrection.startsWith("Fail") ? <span className="text-red-500">Self-Correction Triggered</span> : <span className="text-green-500">Generated</span>}
                                    </div>
                                    {result.finalAnswer}
                                </div>
                            ) : "..."}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
