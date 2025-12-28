'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Zap,
    Clock,
    RefreshCw,
    Search,
    Server,
    Trash2
} from 'lucide-react';
import { askWithCache, clearCache, ProcessingResult } from '@/actions/course_037_caching/caching_backend';

export function CachingLab() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ q: string, res: ProcessingResult }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAsk = async (text: string = input) => {
        if (!text.trim() || isProcessing) return;
        setIsProcessing(true);

        try {
            const res = await askWithCache(text);
            setHistory(prev => [{ q: text, res }, ...prev]);
            setInput("");
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClear = async () => {
        await clearCache();
        setHistory([]);
    };

    return (
        <div className="flex flex-col gap-6 h-[600px]">
            {/* Top Stats Bar */}
            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Database className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold text-sm">Semantic Cache</span>
                </div>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                    Clear Cache
                </button>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Left: Interactive Section */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Input Area */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-zinc-500 uppercase tracking-wider">
                            <Search className="w-4 h-4" />
                            Query
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                                placeholder="E.g. 'What is the speed of light?'"
                                disabled={isProcessing}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => handleAsk()}
                                disabled={isProcessing || !input}
                                className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex gap-2 mt-4 flex-wrap">
                            {[
                                "What is the capital of France?",
                                "Capital of France?",
                                "Who is Elon Musk?",
                                "Tell me about Elon"
                            ].map(q => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); handleAsk(q); }}
                                    disabled={isProcessing}
                                    className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result Card (Latest) */}
                    <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-bold mb-4 text-zinc-500 uppercase tracking-wider">Request Log</h3>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {history.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200 max-w-[70%]">
                                                "{item.q}"
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.res.isHit ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                {item.res.isHit ? (
                                                    <><Zap className="w-3 h-3" /> Cache HIT</>
                                                ) : (
                                                    <><Server className="w-3 h-3" /> Cache MISS</>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg">
                                            {item.res.answer}
                                        </p>

                                        <div className="flex gap-4 text-xs text-zinc-500 font-mono">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {item.res.latency}ms
                                            </span>
                                            {item.res.isHit && (
                                                <span className="flex items-center gap-1 text-indigo-500">
                                                    Similarity: {(item.res.similarity * 100).toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                        {item.res.isHit && item.res.matchedQuery && (
                                            <div className="mt-2 text-xs text-zinc-400 italic">
                                                Matched: "{item.res.matchedQuery}"
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {history.length === 0 && !isProcessing && (
                                <div className="text-center text-zinc-400 mt-12">
                                    <Database className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Cache is empty. Make a request to warm it up.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
