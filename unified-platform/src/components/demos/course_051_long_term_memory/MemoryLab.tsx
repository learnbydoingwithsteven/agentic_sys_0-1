'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Save,
    Search,
    Trash2
} from 'lucide-react';
import { saveToMemory, recallFromMemory, clearMemory } from '@/actions/course_051_long_term_memory/memory_backend';

export function MemoryLab() {
    const [fact, setFact] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [savedCount, setSavedCount] = useState(0);

    const handleSave = async () => {
        if (!fact) return;
        await saveToMemory(fact);
        setFact("");
        setSavedCount(p => p + 1);
    };

    const handleRecall = async () => {
        if (!query) return;
        const res = await recallFromMemory(query);
        setResults(res);
    };

    const handleClear = async () => {
        await clearMemory();
        setSavedCount(0);
        setResults([]);
    };

    return (
        <div className="flex flex-col gap-8 h-[600px]">
            <div className="flex gap-8 h-full">
                {/* Left: Storage */}
                <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-100 dark:border-amber-800 flex flex-col">
                    <h3 className="text-amber-800 dark:text-amber-200 font-bold mb-4 flex items-center gap-2">
                        <Save className="w-5 h-5" /> Long-Term Storage
                    </h3>

                    <div className="space-y-4 flex-1">
                        <textarea
                            value={fact}
                            onChange={e => setFact(e.target.value)}
                            placeholder="Enter a fact e.g. 'My favorite color is Blue'"
                            className="w-full h-32 rounded-xl p-4 text-sm bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 resize-none outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Save to Cortex
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
                </div>

                {/* Right: Retrieval */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <h3 className="text-zinc-800 dark:text-zinc-200 font-bold mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2"><Search className="w-5 h-5" /> Retrieval</div>
                        <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </h3>

                    <div className="flex gap-2 mb-6">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="e.g. 'What is my favorite color?'"
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 border-none outline-none"
                        />
                        <button
                            onClick={handleRecall}
                            className="bg-indigo-600 text-white px-4 rounded-xl font-bold"
                        >
                            Ask
                        </button>
                    </div>

                    <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-xl p-4 overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm"
                                    >
                                        "{r}"
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-zinc-400 mt-10 text-sm">No results</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
