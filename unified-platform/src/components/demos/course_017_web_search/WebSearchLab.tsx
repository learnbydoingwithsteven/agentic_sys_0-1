'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Brain, Search, ExternalLink, BookOpen, Zap, Activity, CheckCircle, XCircle, ArrowRight, Sparkles, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runWebSearchAgent, type SearchMode, type WebSearchResponse, type SearchResult } from '@/actions/course_017_web_search/web_search';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const SAMPLE_QUERIES = [
    { label: 'Current Events', query: "What are the latest developments in AI regulation in 2024?", needsSearch: true },
    { label: 'Recent Tech', query: "What is the latest version of Next.js and its new features?", needsSearch: true },
    { label: 'Scientific', query: "What are recent breakthroughs in quantum computing?", needsSearch: true },
    { label: 'Historical', query: "Who was the first person to climb Mount Everest?", needsSearch: false },
    { label: 'General', query: "Explain how photosynthesis works", needsSearch: false }
];

export function WebSearchLab() {
    const [input, setInput] = useState(SAMPLE_QUERIES[0].query);
    const [mode, setMode] = useState<SearchMode>('web_search');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<WebSearchResponse | null>(null);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await runWebSearchAgent(input, mode, model);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[950px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <h3>Web Search Agent Lab</h3>
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 text-xs bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('no_search')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'no_search'
                                ? 'bg-white dark:bg-zinc-700 shadow text-blue-600 dark:text-blue-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Brain className="w-3 h-3" /> No Search (Training Data)
                    </button>
                    <button
                        onClick={() => setMode('web_search')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'web_search'
                                ? 'bg-white dark:bg-zinc-700 shadow text-blue-600 dark:text-blue-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Search className="w-3 h-3" /> Web Search
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Sample Queries */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sample Queries</label>
                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_QUERIES.map((sample, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setInput(sample.query)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${sample.needsSearch
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100'
                                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                                    }`}
                            >
                                {sample.needsSearch && <Globe className="w-3 h-3 inline mr-1" />}
                                {sample.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRun} className="mb-8">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none h-24 leading-relaxed"
                            disabled={loading}
                            placeholder="Ask a question that requires current information..."
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Activity className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {loading ? 'Researching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Answer Card */}
                            <div className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-lg p-6 relative ${result.success
                                    ? 'border-emerald-200 dark:border-emerald-800'
                                    : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'
                                    }`} />
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        {result.success ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                        {result.mode === 'no_search' ? 'Training Data Answer' : 'Web-Researched Answer'}
                                    </h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${result.mode === 'web_search'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                        }`}>
                                        {result.mode === 'web_search' ? `${result.searchResults?.length || 0} Sources` : 'No Sources'}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                    {result.answer || result.error}
                                </div>
                            </div>

                            {/* Search Results */}
                            {result.searchResults && result.searchResults.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                                    <h5 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" /> Search Results Used
                                    </h5>
                                    <div className="space-y-2">
                                        {result.searchResults.map((searchResult, i) => (
                                            <div key={i} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50 text-xs hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <a
                                                            href={searchResult.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-bold text-blue-700 dark:text-blue-400 hover:underline truncate"
                                                        >
                                                            {searchResult.title}
                                                        </a>
                                                    </div>
                                                    <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                                                </div>
                                                <div className="ml-7 text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                                    {searchResult.snippet}
                                                </div>
                                                <div className="ml-7 mt-1 text-[10px] text-zinc-500 truncate">
                                                    {searchResult.url}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reasoning */}
                            {result.reasoning && (
                                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                                    <h5 className="text-xs font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Research Process
                                    </h5>
                                    <div className="text-xs text-purple-700 dark:text-purple-400">
                                        {result.reasoning}
                                    </div>
                                </div>
                            )}

                            {/* Architecture Diagram */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    {mode === 'no_search' ? 'Static Knowledge Pipeline' : 'Dynamic Research Pipeline'}
                                </h4>

                                {mode === 'no_search' ? (
                                    /* NO SEARCH DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono mb-6 opacity-60">
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Query</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 font-bold">LLM (Training Data)</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Answer</span>
                                    </div>
                                ) : (
                                    /* WEB SEARCH DIAGRAM */
                                    <div className="space-y-4 mb-6">
                                        <div className="flex flex-col items-center gap-2 text-xs font-mono">
                                            <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Query</span>
                                            <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />
                                            <div className="relative p-3 border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 w-full max-w-md">
                                                <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-blue-600 border border-blue-200 rounded font-bold">Research Agent</div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <Brain className="w-3 h-3 text-purple-500" />
                                                        <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px]">1. Analyze Query</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <Search className="w-3 h-3 text-blue-500" />
                                                        <span className="text-blue-600 dark:text-blue-400 text-[10px]">2. Web Search (DuckDuckGo)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <LinkIcon className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">3. Synthesize with Citations</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />
                                            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 font-bold">Cited Answer + Sources</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
