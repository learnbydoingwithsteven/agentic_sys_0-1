'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Save,
    Search,
    Trash2,
    Cpu,
    Loader2,
    Sparkles
} from 'lucide-react';
import { saveToMemory, recallFromMemory, clearMemory } from '@/actions/course_051_long_term_memory/memory_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MemoryLab() {
    const [fact, setFact] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [savedCount, setSavedCount] = useState(0);
    const [isRecalling, setIsRecalling] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleSave = async () => {
        if (!fact || !selectedModel) return;
        setIsSaving(true);
        try {
            await saveToMemory(fact, selectedModel);
            setFact("");
            setSavedCount(p => p + 1);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRecall = async () => {
        if (!query || !selectedModel) return;
        setIsRecalling(true);
        try {
            const res = await recallFromMemory(query, selectedModel);
            setResults(res);
        } finally {
            setIsRecalling(false);
        }
    };

    const handleClear = async () => {
        await clearMemory();
        setSavedCount(0);
        setResults([]);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Model Selector */}
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">LLM-Powered Semantic Memory</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-8 h-[600px]">
                {/* Left: Storage */}
                <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-100 dark:border-amber-800 flex flex-col">
                    <h3 className="text-amber-800 dark:text-amber-200 font-bold mb-4 flex items-center gap-2">
                        <Save className="w-5 h-5" /> Long-Term Storage
                    </h3>

                    <div className="space-y-4 flex-1">
                        <textarea
                            value={fact}
                            onChange={e => setFact(e.target.value)}
                            placeholder="Enter a fact e.g. 'My favorite color is Blue' or 'I was born in Paris'"
                            className="w-full h-32 rounded-xl p-4 text-sm bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 resize-none outline-none focus:ring-2 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                            disabled={isSaving}
                        />
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !fact || !selectedModel}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSaving ? 'Saving...' : 'Save to Memory'}
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="relative">
                            <Brain className="w-32 h-32 text-amber-300 dark:text-amber-900" />
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-700 dark:text-amber-500 text-2xl">
                                {savedCount}
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-xs text-amber-600 dark:text-amber-400 mt-2">
                        Memories Stored
                    </div>
                </div>

                {/* Right: Retrieval */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <h3 className="text-zinc-800 dark:text-zinc-200 font-bold mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2"><Search className="w-5 h-5" /> Semantic Retrieval</div>
                        <button
                            onClick={handleClear}
                            className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Clear all memories"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </button>
                    </h3>

                    <div className="flex gap-2 mb-6">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRecall()}
                            placeholder="e.g. 'What is my favorite color?' or 'Where was I born?'"
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 border-none outline-none text-zinc-900 dark:text-zinc-100"
                            disabled={isRecalling}
                        />
                        <button
                            onClick={handleRecall}
                            disabled={isRecalling || !query || !selectedModel}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
                        >
                            {isRecalling && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isRecalling ? 'Searching...' : 'Ask'}
                        </button>
                    </div>

                    <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-xl p-4 overflow-y-auto">
                        {isRecalling ? (
                            <div className="text-center text-zinc-400 mt-10">
                                <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin text-indigo-500" />
                                <p className="text-sm">Analyzing semantic relevance...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 text-zinc-700 dark:text-zinc-300">
                                                "{r}"
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-zinc-400 mt-10 text-sm">
                                <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No results yet</p>
                                <p className="text-xs mt-1">Ask a question to retrieve relevant memories</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
