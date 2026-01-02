'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ArrowRight,
    List,
    CheckCircle,
    Sparkles
} from 'lucide-react';
import { advancedSearch, SearchResult } from '@/actions/course_093_retrieval_optimization/rag_adv_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function RagAdvLab() {
    const [query, setQuery] = useState("What planet is red?");
    const [results, setResults] = useState<{ initial: SearchResult[], reranked: SearchResult[], hyde: string } | null>(null);
    const [searching, setSearching] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSearch = async () => {
        if (!selectedModel) return;
        setSearching(true);
        setResults(null);

        const res = await advancedSearch(query, selectedModel);

        await new Promise(r => setTimeout(r, 500));
        setResults(res);
        setSearching(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        Advanced RAG: HyDE + Reranking
                    </h3>
                    <p className="text-zinc-500 text-sm">Hypothetical Document Embeddings + LLM-as-Judge Reranking</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Query Input */}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Enter your search query..."
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={searching || !selectedModel}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    {searching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                    {searching ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* HyDE Display */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/30"
                >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-2">
                        <Sparkles className="w-4 h-4" />
                        HyDE (Hypothetical Document)
                    </div>
                    <div className="text-sm italic text-purple-800 dark:text-purple-200">"{results.hyde}"</div>
                </motion.div>
            )}

            {/* Two-Stage Pipeline */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Stage 1: Initial Retrieval */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
                    <div className="font-bold mb-4 flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs">
                        <List className="w-4 h-4" />
                        Stage 1: Keyword Retrieval
                    </div>
                    <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
                        <AnimatePresence>
                            {results?.initial.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-50"
                                >
                                    <div className="text-sm font-serif">"{doc.content}"</div>
                                    <div className="text-xs text-zinc-400 mt-2">Doc #{doc.id}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {searching && <div className="text-zinc-400 animate-pulse text-sm">Retrieving candidates...</div>}
                    </div>
                </div>

                <div className="flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                    <ArrowRight className="w-8 h-8" />
                </div>

                {/* Stage 2: Reranking */}
                <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-900/30 flex flex-col overflow-hidden">
                    <div className="font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 uppercase tracking-widest text-xs">
                        <CheckCircle className="w-4 h-4" />
                        Stage 2: LLM Reranking
                    </div>
                    <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
                        <AnimatePresence>
                            {results?.reranked.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.15 + 0.3 }}
                                    className={`
                                        bg-white dark:bg-zinc-900 p-4 rounded-xl border shadow-md
                                        ${i === 0 ? 'ring-2 ring-blue-500 border-blue-500' : 'border-zinc-200 dark:border-zinc-800'}
                                    `}
                                >
                                    <div className="text-sm font-serif mb-3">"{doc.content}"</div>

                                    {/* Relevance Bar */}
                                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${doc.relevance * 100}%` }}
                                            transition={{ delay: i * 0.15 + 0.5 }}
                                            className={`h-full ${doc.relevance > 0.7 ? 'bg-green-500' : doc.relevance > 0.4 ? 'bg-yellow-500' : 'bg-zinc-400'}`}
                                        />
                                    </div>
                                    <div className="text-[10px] text-right mt-1 font-mono text-zinc-500">
                                        Relevance: {(doc.relevance * 100).toFixed(0)}%
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {searching && <div className="text-blue-400 animate-pulse text-sm">Reranking with LLM...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
