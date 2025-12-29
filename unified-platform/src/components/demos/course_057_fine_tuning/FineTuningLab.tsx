'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Database,
    Zap,
    TrendingDown,
    Play
} from 'lucide-react';
import { getPreTrainedOutput, getFineTunedOutput } from '@/actions/course_057_fine_tuning/finetuning_backend';

export function FineTuningLab() {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loss, setLoss] = useState(2.5);
    const [isFineTuned, setIsFineTuned] = useState(false);

    // Testing
    const [testInput, setTestInput] = useState("");
    const [output, setOutput] = useState("");

    const handleTrain = async () => {
        setIsTraining(true);
        setIsFineTuned(false);
        setProgress(0);
        setLoss(2.5);

        // Simulate training loop
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setIsTraining(false);
                    setIsFineTuned(true);
                    return 100;
                }
                return p + 2;
            });
            setLoss(l => Math.max(0.1, l - 0.05 + (Math.random() * 0.02)));
        }, 100);
    };

    const handleTest = async () => {
        if (!testInput) return;
        const res = isFineTuned
            ? await getFineTunedOutput(testInput)
            : await getPreTrainedOutput(testInput);
        setOutput(res);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Training Dashboard */}
            <div className="bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4 text-emerald-400" /> Dataset: YodaCorpus (10k samples)</h3>
                        <div className="text-zinc-500 text-sm">Targeting style adaptation</div>
                    </div>
                    {isFineTuned ? (
                        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50">
                            Model Fine-Tuned
                        </div>
                    ) : (
                        <button
                            onClick={handleTrain}
                            disabled={isTraining}
                            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            {isTraining ? 'Training...' : 'Start Training'}
                        </button>
                    )}
                </div>

                {/* Visualizer */}
                <div className="h-32 bg-zinc-950/50 rounded-xl border border-zinc-800 mb-4 flex items-end p-4 gap-1 relative z-10">
                    {/* Fake Loss Graph bars */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 bg-indigo-500/50 rounded-t-sm transition-all duration-300 ${i > (progress / 2.5) ? 'opacity-0' : 'opacity-100'}`}
                            style={{ height: `${Math.max(5, 100 - (i * 2 + Math.random() * 20))}%` }}
                        />
                    ))}
                    {!isTraining && !isFineTuned && <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm">Ready to train</div>}
                </div>

                <div className="flex justify-between text-xs font-mono text-zinc-400 relative z-10">
                    <div>Epoch: {isFineTuned ? '10/10' : Math.floor(progress / 10)}</div>
                    <div>Loss: {loss.toFixed(4)} <TrendingDown className="w-3 h-3 inline text-emerald-500" /></div>
                </div>

                {/* Progress Bar */}
                {isTraining && (
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                )}
            </div>

            {/* Playground */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Validation Playground
                </h3>

                <div className="flex gap-4">
                    <input
                        value={testInput}
                        onChange={e => setTestInput(e.target.value)}
                        placeholder="Type 'learn' or 'force'..."
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 outline-none border border-transparent focus:border-indigo-500"
                    />
                    <button
                        onClick={handleTest}
                        className="bg-zinc-800 hover:bg-zinc-900 text-white px-6 rounded-xl font-bold"
                    >
                        Run
                    </button>
                </div>

                <div className="mt-8 text-center flex-1 flex items-center justify-center">
                    {output ? (
                        <motion.div
                            key={output}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl font-serif text-zinc-800 dark:text-zinc-200"
                        >
                            "{output}"
                        </motion.div>
                    ) : (
                        <div className="text-zinc-400 opacity-50">Output will appear here</div>
                    )}
                </div>

                <div className="text-center text-xs text-zinc-400 mt-4">
                    Current Model: <span className="font-bold text-zinc-600 dark:text-zinc-300">{isFineTuned ? "qwen2.5:15b-yoda-ft" : "qwen2.5:1.5b-base"}</span>
                </div>
            </div>
        </div>
    );
}
