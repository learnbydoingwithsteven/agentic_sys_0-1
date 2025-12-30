'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Edit3,
    MessageCircle,
    ArrowRight
} from 'lucide-react';
import { runReflexionLoop, ReflectionStep } from '@/actions/course_045_self_reflection/reflection_backend';

export function ReflectionLab() {
    const [topic, setTopic] = useState("Describe the sky");
    const [steps, setSteps] = useState<ReflectionStep[]>([]);
    const [running, setRunning] = useState(false);

    const handleRun = async () => {
        setRunning(true);
        setSteps([]);
        const result = await runReflexionLoop(topic);

        for (const step of result) {
            await new Promise(r => setTimeout(r, 1200));
            setSteps(prev => [...prev, step]);
        }
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-2 block">Writing Prompt</label>
                    <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200 focus:ring-2 ring-indigo-500 outline-none"
                    />
                </div>
                <button
                    onClick={handleRun}
                    disabled={running}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 mt-6 disabled:opacity-50"
                >
                    {running ? <Edit3 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {running ? 'Refining...' : 'Start Reflexion'}
                </button>
            </div>

            {/* Steps */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                <AnimatePresence>
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.attempt}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Attempt #{step.attempt}</div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${step.score >= 9 ? 'bg-green-100 text-green-700' :
                                        step.score >= 6 ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    Quality Score: {step.score}/10
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-lg font-serif mb-6 text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                "{step.content}"
                            </div>

                            {/* Critique (if not perfect) */}
                            {step.score < 10 && (
                                <div className="flex items-start gap-3 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                                    <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="font-bold mr-1">Self-Critique:</span>
                                        {step.critique}
                                    </div>
                                </div>
                            )}

                            {/* Final Success */}
                            {step.score === 10 && (
                                <div className="flex items-center gap-2 text-green-600 font-bold justify-center mt-4">
                                    <Sparkles className="w-5 h-5" /> Optimized Result
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {steps.length === 0 && !running && (
                    <div className="flex-1 flex items-center justify-center text-zinc-400 italic">
                        Waiting for initial draft...
                    </div>
                )}
            </div>
        </div>
    );
}
