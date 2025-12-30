'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Play,
    AlertCircle,
    CheckCircle,
    Lightbulb
} from 'lucide-react';
import { runReflexionLoop, ReflexionStep } from '@/actions/course_088_self_correction/reflexion_backend';

export function ReflexionLab() {
    const [steps, setSteps] = useState<ReflexionStep[]>([]);
    const [running, setRunning] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);

    const handleRun = async () => {
        setRunning(true);
        setSteps([]);
        setCurrentStepIndex(-1);

        const data = await runReflexionLoop();

        // Detailed animation sequence
        for (let i = 0; i < data.length; i++) {
            setCurrentStepIndex(i);
            setSteps(prev => [...prev, data[i]]);
            await new Promise(r => setTimeout(r, 2500)); // Read time
        }
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-500" />
                        Reflexion Architecture
                    </h3>
                    <p className="text-zinc-500 text-sm">Self-Correction Loop: Attempt &rarr; Evaluate &rarr; Reflect &rarr; Retry</p>
                </div>
                <button
                    onClick={handleRun}
                    disabled={running}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    <Play className="w-4 h-4 fill-current" /> Run Reflexion
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black rounded-3xl p-8 font-mono text-sm shadow-2xl border border-zinc-800">
                <AnimatePresence>
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <div className="flex items-center gap-2 text-zinc-500 mb-2 border-b border-zinc-800 pb-1">
                                <span className="text-indigo-400 font-bold">ATTEMPT #{step.attempt}</span>
                                <span className="text-xs">{new Date().toLocaleTimeString()}</span>
                            </div>

                            <div className="bg-zinc-900/50 p-4 rounded-lg border-l-4 border-zinc-700 mb-2">
                                <code className="text-zinc-300 block mb-2">{step.code}</code>
                            </div>

                            {step.result === 'FAIL' ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="space-y-2"
                                >
                                    <div className="text-red-400 flex items-start gap-2 bg-red-900/10 p-2 rounded">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        {step.error}
                                    </div>
                                    <div className="text-yellow-400 flex items-start gap-2 bg-yellow-900/10 p-2 rounded">
                                        <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span className="italic">"{step.reflection}"</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="text-emerald-400 flex items-center gap-2 bg-emerald-900/10 p-2 rounded font-bold"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    TESTS PASSED
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                    {steps.length === 0 && !running && <div className="text-zinc-600 italic">Ready to start loop...</div>}
                </AnimatePresence>
            </div>
        </div>
    );
}
