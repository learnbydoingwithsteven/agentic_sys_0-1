'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Cpu
} from 'lucide-react';
import { generateWithReasoning } from '@/actions/course_042_chain_of_thought/reasoning_backend';

export function ReasoningLab() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ q: string, thinking: string, answer: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isProcessing) return;
        setIsProcessing(true);

        try {
            const res = await generateWithReasoning(text);
            setHistory(prev => [{ q: text, thinking: res.thinking, answer: res.answer }, ...prev]);
            setInput("");
            setExpandedIdx(0); // Auto-expand new one
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input Area */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a complex logic puzzle (e.g. 'Roger has 5 tennis balls...')"
                    disabled={isProcessing}
                    className="flex-1 bg-transparent outline-none text-lg"
                />
                <button
                    onClick={() => handleSend()}
                    disabled={isProcessing || !input}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {isProcessing ? 'Thinking...' : 'Reason'}
                </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex gap-2 flex-wrap justify-center">
                {[
                    "If I have 3 apples and eat 1, then buy 2 more, how many do I have?",
                    "Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 balls. How many now?",
                    "Explain why the sky is blue using simple physics."
                ].map(q => (
                    <button
                        key={q}
                        onClick={() => { setInput(q); handleSend(q); }}
                        className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 rounded-full text-zinc-600 dark:text-zinc-400"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {history.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 last:mb-0"
                        >
                            {/* User Question */}
                            <div className="flex justify-end mb-4">
                                <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-5 py-3 rounded-2xl rounded-tr-sm text-sm font-medium max-w-[80%]">
                                    {item.q}
                                </div>
                            </div>

                            {/* AI Response Block */}
                            <div className="flex flex-col items-start max-w-[90%] gap-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                                    <Cpu className="w-3 h-3" />
                                    System 2 Response
                                </div>

                                {/* 1. Thinking Process (Accordion) */}
                                <div className="w-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-3 text-sm text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <BrainCircuit className="w-4 h-4" />
                                            Thinking Process
                                        </div>
                                        {expandedIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <AnimatePresence>
                                        {expandedIdx === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-4 pb-4"
                                            >
                                                <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30 whitespace-pre-wrap leading-relaxed">
                                                    {item.thinking}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 2. Final Answer */}
                                <div className="bg-white dark:bg-zinc-900 px-6 py-5 rounded-2xl rounded-tl-sm text-sm border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-800 dark:text-zinc-200 leading-relaxed w-full">
                                    <div className="flex gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                        <div>{item.answer}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {history.length === 0 && !isProcessing && (
                    <div className="text-center text-zinc-400 mt-20">
                        <BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Ask me something tricky.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
