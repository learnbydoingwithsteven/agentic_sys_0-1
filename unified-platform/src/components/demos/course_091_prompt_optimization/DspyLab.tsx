'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    MessageSquare,
    Medal,
    ArrowDown
} from 'lucide-react';
import { runOptimization, PromptCandidate } from '@/actions/course_091_prompt_optimization/dspy_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function DspyLab() {
    const [goal, setGoal] = useState("Generate a viral tweet about AI");
    const [candidates, setCandidates] = useState<PromptCandidate[]>([]);
    const [running, setRunning] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleOptimize = async () => {
        if (!selectedModel) return;
        setRunning(true);
        setCandidates([]);
        const res = await runOptimization(goal, selectedModel);

        for (const c of res) {
            await new Promise(r => setTimeout(r, 1500));
            setCandidates(prev => [...prev, c]);
        }
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Prompt Optimizer (DSPy Style)
                    </h3>
                    <p className="text-zinc-500 text-sm">Iteratively improves prompts to maximize performance.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Control Panel */}
                <div className="w-1/3 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">Objective</label>
                        <textarea
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-amber-500 font-medium h-32 resize-none"
                            placeholder="e.g. Write a classification prompt..."
                        />
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={running || !selectedModel}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-auto hover:scale-105 active:scale-95"
                    >
                        {running ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <TrendingUp className="fill-current w-5 h-5" />}
                        {running ? 'Optimizing...' : 'Run Optimizer'}
                    </button>
                </div>

                {/* Results Stream */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-6 relative">
                    <AnimatePresence>
                        {candidates.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            >
                                {/* Arrow Connector */}
                                {i > 0 && (
                                    <div className="flex justify-center -mt-4 mb-2">
                                        <ArrowDown className="w-6 h-6 text-zinc-300" />
                                    </div>
                                )}

                                <div className={`
                                    relative rounded-3xl p-6 border-2 flex flex-col gap-4 shadow-sm transition-all
                                    ${i === candidates.length - 1 && !running ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30 shadow-xl' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}
                                `}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 text-sm">
                                                v{c.id}
                                            </div>
                                            <div className="text-xs uppercase font-bold text-zinc-400">Optimization Step</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-500">Predicted Score:</span>
                                            <span className={`text-xl font-black ${c.score > 80 ? 'text-green-500' : 'text-amber-500'}`}>{c.score}</span>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                        <div className="text-zinc-800 dark:text-zinc-200 font-mono text-sm whitespace-pre-wrap">
                                            "{c.promptText}"
                                        </div>
                                    </div>

                                    {c.reasoning && (
                                        <div className="text-xs text-zinc-500 italic">
                                            Critic: "{c.reasoning}"
                                        </div>
                                    )}

                                    {i === candidates.length - 1 && !running && (
                                        <div className="absolute -top-3 -right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-bounce">
                                            <Medal className="w-3 h-3" /> WINNER
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {candidates.length === 0 && !running && (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-zinc-500">
                            <Sparkles className="w-16 h-16 mb-4" />
                            <div>Ready to synthesize prompts...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
