'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    HardDrive,
    MessageSquare,
    Save,
    Trash,
    Send
} from 'lucide-react';
import { processMemoryChat, resetMemory, MemoryState } from '@/actions/course_095_memory_management/memory_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MemoryLab() {
    const [msg, setMsg] = useState("");
    const [mem, setMem] = useState<MemoryState>({ shortTerm: [], longTerm: [], logs: [] });
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg || !selectedModel) return;
        setLoading(true);
        const res = await processMemoryChat(msg, selectedModel);
        setMem(res);
        setMsg("");
        setLoading(false);
    };

    const handleReset = async () => {
        const res = await resetMemory();
        setMem(res);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5 text-pink-500" />
                        Memory Management Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Intelligent triage between short-term (context) and long-term (persistent) memory</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="flex gap-4">
                <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="e.g., 'My name is Alice' or 'I like pizza' or 'The weather is nice'"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-pink-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !selectedModel}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
                >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-4 rounded-xl transition-all"
                >
                    <Trash className="w-4 h-4" />
                </button>
            </form>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Short Term (Working Memory / Context Window) */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-pink-200 dark:border-pink-900/30 flex flex-col overflow-hidden">
                    <div className="font-bold mb-4 flex items-center justify-between text-pink-600 dark:text-pink-400 uppercase tracking-widest text-xs">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Working Memory
                        </div>
                        <span className="bg-pink-100 dark:bg-pink-900/20 px-2 py-1 rounded">{mem.shortTerm.length} / 4</span>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar relative pb-8">
                        <AnimatePresence>
                            {mem.shortTerm.map((m, i) => (
                                <motion.div
                                    key={m + i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                    className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800/30 text-sm font-medium"
                                >
                                    "{m}"
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {mem.shortTerm.length === 0 && (
                            <div className="text-zinc-300 dark:text-zinc-700 text-center mt-10 text-sm">Empty context window</div>
                        )}

                        {/* Eviction Line */}
                        <div className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-red-300 dark:border-red-900 pt-2 text-[10px] text-red-500 dark:text-red-400 text-center font-mono bg-white dark:bg-zinc-900">
                            ⚠️ Older messages evicted below this line (FIFO)
                        </div>
                    </div>
                </div>

                {/* Long Term (Persistent Storage) */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-900/30 flex flex-col overflow-hidden">
                    <div className="font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 uppercase tracking-widest text-xs">
                        <HardDrive className="w-4 h-4" />
                        Long-Term Storage
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                        <AnimatePresence>
                            {mem.longTerm.map((m, i) => (
                                <motion.div
                                    key={m + i}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/30 text-sm font-medium flex items-start gap-3"
                                >
                                    <Save className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span>"{m}"</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {mem.longTerm.length === 0 && (
                            <div className="text-zinc-300 dark:text-zinc-700 text-center mt-10 text-sm">No facts archived yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Logs */}
            <div className="h-32 bg-black rounded-xl p-4 font-mono text-xs text-green-400 overflow-y-auto custom-scrollbar">
                {mem.logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
                {mem.logs.length === 0 && <div className="opacity-50">&gt; System ready. Awaiting input...</div>}
            </div>
        </div>
    );
}
