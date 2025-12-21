'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Search,
    FileText,
    ArrowRight,
    Bot,
    Zap,
    Trash2,
    RefreshCcw,
    Server,
    BookOpen,
    CheckCircle2,
    XCircle,
    BrainCircuit
} from 'lucide-react';
import {
    addDocumentsToStore,
    clearStore,
    runRagWorkflow,
    getStoreStats,
    type RagResult,
    type VectorDocument
} from '@/actions/course_022_vector_database/vector_store';
import { KNOWLEDGE_BASE_PRESETS } from '@/actions/course_022_vector_database/presets';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

export function VectorDBLab() {
    const [model, setModel] = useState("llama3.2");
    const [embedModel, setEmbedModel] = useState("nomic-embed-text");
    const [models, setModels] = useState<string[]>([]);

    // Store State
    const [docCount, setDocCount] = useState(0);
    const [isIngesting, setIsIngesting] = useState(false);
    const [activePreset, setActivePreset] = useState<keyof typeof KNOWLEDGE_BASE_PRESETS | null>(null);

    // Query State
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<RagResult | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);

                // Find embedding model
                const embed = available.find(m => m.includes('embed') || m.includes('nomic'));
                if (embed) setEmbedModel(embed);

                updateStats();
            } catch (e) {
                console.error("Failed to load models", e);
            }
        };
        init();
    }, []);

    const updateStats = async () => {
        const stats = await getStoreStats();
        setDocCount(stats.count);
    };

    const handleIngest = async (key: keyof typeof KNOWLEDGE_BASE_PRESETS) => {
        setIsIngesting(true);
        setActivePreset(key);
        try {
            await clearStore(); // Clear existing for cleaner demo
            const preset = KNOWLEDGE_BASE_PRESETS[key];
            await addDocumentsToStore(preset.documents, [], embedModel);
            await updateStats();
            setResult(null); // Clear previous results
        } catch (error) {
            console.error("Ingest failed", error);
        } finally {
            setIsIngesting(false);
        }
    };

    const handleClear = async () => {
        await clearStore();
        await updateStats();
        setActivePreset(null);
        setResult(null);
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const data = await runRagWorkflow(query, model, embedModel);
            setResult(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col h-[850px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">

            {/* Top Bar: Configuration */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Vector Knowledge Base</h3>
                        <p className="text-xs text-zinc-500 font-medium">RAG PIPELINE ACTIVE • {docCount} DOCUMENTS INDEXED</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Embedding Model</label>
                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{embedModel}</span>
                    </div>
                    <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex flex-col items-end">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Chat Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer text-right"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Left Panel: Data Ingestion */}
                <div className="w-80 bg-zinc-50 dark:bg-black/20 border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto flex flex-col">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Knowledge Source</h4>

                    <div className="space-y-3 mb-8">
                        {(Object.entries(KNOWLEDGE_BASE_PRESETS) as [keyof typeof KNOWLEDGE_BASE_PRESETS, typeof KNOWLEDGE_BASE_PRESETS.company_policy][]).map(([key, preset]) => (
                            <button
                                key={key}
                                onClick={() => handleIngest(key)}
                                disabled={isIngesting}
                                className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${activePreset === key
                                        ? 'bg-white dark:bg-zinc-800 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                                    }`}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-bold ${activePreset === key ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                            {preset.title}
                                        </span>
                                        {activePreset === key && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-tight line-clamp-2">
                                        {preset.description}
                                    </p>
                                </div>
                                {isIngesting && activePreset === key && (
                                    <motion.div
                                        layoutId="ingest-progress"
                                        className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
                            <h5 className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Database Status</h5>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Vectors</span>
                                <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{docCount}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            disabled={docCount === 0 || isIngesting}
                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-3 h-3" />
                            Reset Database
                        </button>
                    </div>
                </div>

                {/* Right Panel: RAG Interface */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative">

                    {/* Query Input */}
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask a question based on the knowledge base..."
                                className="w-full pl-5 pr-14 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-zinc-900 dark:text-zinc-100"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !query.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md"
                            >
                                {isSearching ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Sample Queries */}
                        {activePreset && (
                            <div className="max-w-2xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {KNOWLEDGE_BASE_PRESETS[activePreset].sampleQueries.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(q)}
                                        className="shrink-0 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-medium text-zinc-600 dark:text-zinc-400 hover:border-indigo-400 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >

                                        {/* 1. Retrieval Visualization */}
                                        <section>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg">
                                                    <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                                                    Retrieved Context (Top 3)
                                                </h4>
                                                <span className="ml-auto text-[10px] font-mono text-zinc-400">{result.stats.retrievalTime}ms</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {result.retrievedContext.map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4 relative group"
                                                    >
                                                        <div className="absolute top-3 right-3 text-[10px] font-bold bg-white dark:bg-black/40 px-2 py-0.5 rounded-full text-emerald-600 shadow-sm">
                                                            {(item.score * 100).toFixed(1)}% Match
                                                        </div>
                                                        <FileText className="w-5 h-5 text-emerald-300 dark:text-emerald-700/50 mb-3" />
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium line-clamp-4">
                                                            "{item.document.content}"
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* 2. Generation Comparison */}
                                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                            {/* Connector Line */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center z-10 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-400">
                                                VS
                                            </div>

                                            {/* RAG Answer */}
                                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                                <div className="flex items-center gap-2 mb-4">
                                                    <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">RAG Enhanced Answer</h4>
                                                </div>
                                                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                                    {result.answer}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-indigo-200/50 dark:border-indigo-800/50 flex gap-4">
                                                    <div className="text-[10px] font-medium text-indigo-400">
                                                        <span className="font-bold">Fact Check:</span> Grounded in {result.retrievedContext.length} sources
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Direct Answer */}
                                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 opacity-75 grayscale hover:grayscale-0 transition-all">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Bot className="w-5 h-5 text-zinc-500" />
                                                    <h4 className="text-sm font-bold text-zinc-500">Standard LLM Answer</h4>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                                    {result.noRagAnswer}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-medium">
                                                    Standard Model Knowledge Only
                                                </div>
                                            </div>
                                        </section>

                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                                            <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                                        </div>
                                        <h4 className="text-lg font-bold text-zinc-400">Ready for Query</h4>
                                        <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">
                                            Select a knowledge base, ingest the data, and ask questions to test the RAG pipeline.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
