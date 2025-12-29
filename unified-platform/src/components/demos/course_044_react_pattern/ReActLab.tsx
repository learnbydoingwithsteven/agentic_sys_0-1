'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Terminal,
    Eye,
    Hammer,
    Brain
} from 'lucide-react';
import { runReActAgent, ReActStep } from '@/actions/course_044_react_pattern/react_backend';

export function ReActLab() {
    const [query, setQuery] = useState("");
    const [steps, setSteps] = useState<ReActStep[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (q: string = query) => {
        if (!q.trim() || isProcessing) return;
        setIsProcessing(true);
        setSteps([]);

        try {
            const result = await runReActAgent(q);
            // playback effect
            for (let i = 0; i < result.length; i++) {
                await new Promise(r => setTimeout(r, 600)); // Delay between steps
                setSteps(prev => [...prev, result[i]]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask: 'How old is Einstein?'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={() => handleRun()}
                    disabled={isProcessing || !query}
                    className="bg-sky-600 hover:bg-sky-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    <Play className="w-4 h-4 fill-current" />
                </button>
            </div>

            <div className="flex gap-2 justify-center">
                {["How old is Einstein?", "How old is Obama today?"].map(q => (
                    <button key={q} onClick={() => { setQuery(q); handleRun(q); }} className="text-xs px-3 py-1 bg-zinc-100 rounded-full dark:bg-zinc-800">
                        {q}
                    </button>
                ))}
            </div>

            {/* Trace Timeline */}
            <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                <div className="space-y-6 relative">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4 ml-3"
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-zinc-50 dark:ring-black
                                ${step.type === 'thought' ? 'bg-zinc-200 text-zinc-600' : ''}
                                ${step.type === 'action' ? 'bg-blue-100 text-blue-600 border border-blue-200' : ''}
                                ${step.type === 'observation' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : ''}
                                ${step.type === 'answer' ? 'bg-purple-600 text-white shadow-lg' : ''}
                            `}>
                                {step.type === 'thought' && <Brain className="w-4 h-4" />}
                                {step.type === 'action' && <Hammer className="w-4 h-4" />}
                                {step.type === 'observation' && <Eye className="w-4 h-4" />}
                                {step.type === 'answer' && <Star className="w-4 h-4 fill-current" />}
                            </div>

                            <div className={`p-4 rounded-xl text-sm border flex-1 ${step.type === 'answer' ? 'bg-white dark:bg-zinc-900 border-purple-200 dark:border-purple-900' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                                <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-50">
                                    {step.type}
                                    {step.tool && <span className="ml-2 bg-zinc-100 dark:bg-zinc-800 px-1 rounded normal-case font-mono">{step.tool}()</span>}
                                </div>
                                <div className="font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {step.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {steps.length === 0 && !isProcessing && (
                        <div className="ml-12 text-zinc-400">Waiting for task...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
