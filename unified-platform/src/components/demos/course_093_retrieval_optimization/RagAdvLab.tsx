'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ArrowRight,
    List,
    CheckCircle
} from 'lucide-react';
import { advancedSearch, SearchResult } from '@/actions/course_093_retrieval_optimization/rag_adv_backend';

export function RagAdvLab() {
    const [results, setResults] = useState<{ initial: SearchResult[], reranked: SearchResult[] } | null>(null);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        setSearching(true);
        setResults(null);
        await new Promise(r => setTimeout(r, 800)); // Retrieval time
        const res = await advancedSearch("What planet is red?");
        setResults(res);
        setSearching(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Query: <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">"What planet is red?"</span></h2>
                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                    <Search className="w-4 h-4" /> Run Search Pipeline
                </button>
            </div>

            <div className="flex-1 flex gap-8">
                {/* Stage 1: Initial Retrieval */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <div className="font-bold mb-4 flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs">
                        <List className="w-4 h-4" />
                        Stage 1: Keyword Search
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {results?.initial.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-60"
                                >
                                    <div className="text-sm font-serif">"{doc.content}"</div>
                                    <div className="text-xs text-zinc-400 mt-2">ID: {doc.id}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {searching && <div className="text-zinc-400 animate-pulse text-sm">Retrieving vectors...</div>}
                    </div>
                </div>

                <div className="flex items-center justify-center text-zinc-300">
                    <ArrowRight className="w-8 h-8" />
                </div>

                {/* Stage 2: Reranking */}
                <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-900/30 flex flex-col">
                    <div className="font-bold mb-4 flex items-center gap-2 text-blue-600 uppercase tracking-widest text-xs">
                        <CheckCircle className="w-4 h-4" />
                        Stage 2: Semantic Reranker
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {results?.reranked.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 + 0.5 }}
                                    className={`
                                        bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md relative overflow-hidden
                                        ${i === 0 ? 'ring-2 ring-blue-500' : ''}
                                    `}
                                >
                                    <div className="text-sm font-serif relative z-10">"{doc.content}"</div>

                                    {/* Relevance Bar */}
                                    <div className="mt-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative z-10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${doc.relevance * 100}%` }}
                                            className={`h-full ${doc.relevance > 0.8 ? 'bg-green-500' : 'bg-zinc-400'}`}
                                        />
                                    </div>
                                    <div className="text-[10px] text-right mt-1 font-mono opacity-50">Score: {doc.relevance.toFixed(2)}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {searching && <div className="text-blue-400 animate-pulse text-sm">Reranking candidates...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
