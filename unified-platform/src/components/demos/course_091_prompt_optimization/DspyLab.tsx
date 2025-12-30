'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    MessageSquare,
    Medal
} from 'lucide-react';
import { runOptimization, PromptCandidate } from '@/actions/course_091_prompt_optimization/dspy_backend';

export function DspyLab() {
    const [candidates, setCandidates] = useState<PromptCandidate[]>([]);
    const [running, setRunning] = useState(false);

    const handleOptimize = async () => {
        setRunning(true);
        setCandidates([]);
        const res = await runOptimization("Classify Twitter Sentiment");

        for (const c of res) {
            await new Promise(r => setTimeout(r, 1000));
            setCandidates(prev => [...prev, c]);
        }
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Auto-Prompt Engineer (APE)</h2>
                <p className="text-zinc-500">Task: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Classify Twitter Sentiment</span></p>
                <button
                    onClick={handleOptimize}
                    disabled={running || candidates.length > 0}
                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform disabled:opacity-50"
                >
                    <Sparkles className="w-4 h-4 fill-current" /> Optimize Prompts
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {candidates.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`
                            relative rounded-3xl p-6 border-2 flex items-center gap-6 shadow-sm
                            ${i === candidates.length - 1 && !running ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60'}
                        `}
                    >
                        <div className="flex-shrink-0 w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500">
                            v{c.id}
                        </div>

                        <div className="flex-1 font-mono text-sm leading-relaxed">
                            "{c.promptText}"
                        </div>

                        <div className="flex-shrink-0 text-right">
                            <div className="text-xs uppercase font-bold text-zinc-500 mb-1">Eval Score</div>
                            <div className={`text-3xl font-black ${i === candidates.length - 1 && !running ? 'text-amber-600' : 'text-zinc-400'}`}>
                                {c.score}%
                            </div>
                        </div>

                        {i === candidates.length - 1 && !running && (
                            <div className="absolute -top-3 -right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                <Medal className="w-3 h-3" /> BEST
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
