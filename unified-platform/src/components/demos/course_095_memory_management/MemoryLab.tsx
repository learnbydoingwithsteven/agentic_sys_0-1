'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    HardDrive,
    MessageSquare,
    Save,
    Trash
} from 'lucide-react';
import { processMemoryChat, resetMemory, MemoryState } from '@/actions/course_095_memory_management/memory_backend';

export function MemoryLab() {
    const [msg, setMsg] = useState("");
    const [mem, setMem] = useState<MemoryState>({ shortTerm: [], longTerm: [], logs: [] });

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await processMemoryChat(msg);
        setMem(res);
        setMsg("");
    };

    const handleReset = async () => {
        const res = await resetMemory();
        setMem(res);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Chat Input */}
            <form onSubmit={handleSend} className="flex gap-4">
                <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Tell me facts (e.g. 'My name is Alice', 'I like Pizza')"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-sm"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold">Send</button>
                <button type="button" onClick={handleReset} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-600 px-4 rounded-xl"><Trash className="w-4 h-4" /></button>
            </form>

            <div className="flex-1 flex gap-8">
                {/* Short Term (RAM) */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <div className="font-bold mb-4 flex items-center justify-between text-zinc-500 uppercase tracking-widest text-xs">
                        <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-pink-500" /> Context Window (RAM)</div>
                        <span>{mem.shortTerm.length} / 3</span>
                    </div>

                    <div className="flex-1 space-y-2 relative">
                        <AnimatePresence>
                            {mem.shortTerm.map((m, i) => (
                                <motion.div
                                    key={m + i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                    className="p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900 text-sm font-medium"
                                >
                                    "{m}"
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {mem.shortTerm.length === 0 && <div className="text-zinc-300 text-center mt-10 text-sm">Empty Context</div>}

                        {/* Overflow Line */}
                        <div className="absolute bottom-0 w-full border-t border-dashed border-red-300 pt-2 text-[10px] text-red-400 text-center font-mono">
                            Older messages evicted below this line
                        </div>
                    </div>
                </div>

                {/* Long Term (Disk) */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <div className="font-bold mb-4 flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs">
                        <HardDrive className="w-4 h-4 text-blue-500" /> Long-Term Storage (Disk)
                    </div>

                    <div className="flex-1 space-y-2">
                        <AnimatePresence>
                            {mem.longTerm.map((m, i) => (
                                <motion.div
                                    key={m + i}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900 text-sm font-medium flex items-center gap-2"
                                >
                                    <Save className="w-3 h-3 text-blue-400" />
                                    <span>"{m}"</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {mem.longTerm.length === 0 && <div className="text-zinc-300 text-center mt-10 text-sm">No Arbitrary Facts Saved</div>}
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="h-32 bg-black rounded-xl p-4 font-mono text-xs text-green-400 overflow-y-auto custom-scrollbar">
                {mem.logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
                {mem.logs.length === 0 && <div className="opacity-50">&gt; System Ready.</div>}
            </div>
        </div>
    );
}
