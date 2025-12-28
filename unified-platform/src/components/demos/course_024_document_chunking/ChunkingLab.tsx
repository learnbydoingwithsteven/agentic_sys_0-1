'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    AlignLeft,
    Code,
    FileText,
    Scissors,
    RefreshCcw,
    Layers,
    Info
} from 'lucide-react';
import { CHUNKING_SAMPLES } from '@/actions/course_024_document_chunking/samples';

type Strategy = 'fixed' | 'recursive';

export function ChunkingLab() {
    // State
    const [text, setText] = useState(CHUNKING_SAMPLES.article.content.trim());
    const [strategy, setStrategy] = useState<Strategy>('recursive');
    const [chunkSize, setChunkSize] = useState(200);
    const [overlap, setOverlap] = useState(20);
    const [chunks, setChunks] = useState<string[]>([]);

    // Logic (Client-side for instant feedback)
    const generateChunks = useCallback(() => {
        if (!text) {
            setChunks([]);
            return;
        }

        const result: string[] = [];
        const separators = ["\n\n", "\n", " ", ""];
        let start = 0;

        // Safety caps
        const effectiveSize = Math.max(10, chunkSize);
        const effectiveOverlap = Math.min(overlap, effectiveSize - 1);

        while (start < text.length) {
            let end = Math.min(start + effectiveSize, text.length);

            if (strategy === 'recursive' && end < text.length) {
                // Backtrack for separator
                let found = false;
                for (const sep of separators) {
                    const lastIdx = text.lastIndexOf(sep, end);
                    if (lastIdx !== -1 && lastIdx > start) {
                        end = lastIdx + sep.length;
                        found = true;
                        break;
                    }
                }
            }

            result.push(text.slice(start, end));

            // Move forward
            const nextStart = end - effectiveOverlap;
            start = Math.max(start + 1, nextStart);
            if (start >= text.length) break;
        }

        setChunks(result);
    }, [text, strategy, chunkSize, overlap]);

    // Update on change
    useEffect(() => {
        generateChunks();
    }, [generateChunks]);

    return (
        <div className="flex h-[800px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">

            {/* 1. Controls & Input (Left) */}
            <div className="w-1/3 min-w-[350px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                        <Scissors className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Configuration</h3>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Strategy Selector */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-3 block">Splitting Strategy</label>
                        <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                            {(['fixed', 'recursive'] as Strategy[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStrategy(s)}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${strategy === s
                                        ? 'bg-white dark:bg-zinc-700 text-pink-600 shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                        }`}
                                >
                                    {s === 'fixed' ? 'Fixed Size' : 'Recursive'}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-[10px] text-zinc-500">
                            {strategy === 'fixed'
                                ? "Splits purely by character count. Can break words mid-sentence."
                                : "Respects sentence boundaries (newlines, spaces) where possible."}
                        </p>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Chunk Size</label>
                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{chunkSize} chars</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="1000"
                                step="10"
                                value={chunkSize}
                                onChange={(e) => setChunkSize(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Overlap</label>
                                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{overlap} chars</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100" // Cap overlap to prevent confusion
                                step="5"
                                value={overlap}
                                onChange={(e) => setOverlap(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <p className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                Overlap ensures context isn't lost at cut points.
                            </p>
                        </div>
                    </div>

                    {/* Input Text */}
                    <div className="flex flex-col h-[300px]">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Source Text</label>
                            <div className="flex gap-1">
                                <button onClick={() => setText(CHUNKING_SAMPLES.article.content.trim())} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" title="Article"><AlignLeft className="w-3 h-3 text-zinc-400" /></button>
                                <button onClick={() => setText(CHUNKING_SAMPLES.legal.content.trim())} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" title="Legal"><FileText className="w-3 h-3 text-zinc-400" /></button>
                                <button onClick={() => setText(CHUNKING_SAMPLES.code.content.trim())} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" title="Code"><Code className="w-3 h-3 text-zinc-400" /></button>
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-600 dark:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 custom-scrollbar"
                            placeholder="Type or paste content here..."
                        />
                    </div>
                </div>
            </div>

            {/* 2. Visualization (Right) */}
            <div className="flex-1 bg-zinc-100/50 dark:bg-black/20 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-[0.03]" />

                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-zinc-400" />
                        Chunk Visualization
                    </h3>
                    <div className="flex gap-4 text-xs font-mono">
                        <span className="text-zinc-500">Total Chunks: <strong className="text-zinc-900 dark:text-zinc-100">{chunks.length}</strong></span>
                        <span className="text-zinc-500">Avg Size: <strong className="text-zinc-900 dark:text-zinc-100">{chunks.length ? Math.round(chunks.reduce((a, b) => a + b.length, 0) / chunks.length) : 0} chars</strong></span>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto pb-20">
                        <AnimatePresence>
                            {chunks.map((chunk, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative group"
                                >
                                    {/* Connector Line */}
                                    {idx < chunks.length - 1 && (
                                        <div className="absolute left-[20px] bottom-[-20px] w-0.5 h-6 bg-zinc-200 dark:bg-zinc-800 z-0" />
                                    )}

                                    <div className={`
                                        relative z-10 p-5 rounded-2xl border shadow-sm transition-all duration-200
                                        ${idx % 2 === 0
                                            ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-700'
                                            : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }
                                    `}>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-mono bg-zinc-900 text-white px-2 py-1 rounded-full">
                                                {chunk.length} chars
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${idx % 2 === 0 ? 'bg-pink-100 text-pink-600' : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-all">
                                                {chunk}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {chunks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        <p>No text to chunk.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
