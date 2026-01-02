'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Database,
    Zap,
    TrendingDown,
    Play,
    Loader2
} from 'lucide-react';
import { getPreTrainedOutput, getFineTunedOutput } from '@/actions/course_057_fine_tuning/finetuning_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function FineTuningLab() {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loss, setLoss] = useState(2.5);
    const [isFineTuned, setIsFineTuned] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    // Testing
    const [testInput, setTestInput] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const handleTrain = async () => {
        setIsTraining(true);
        setIsFineTuned(false);
        setProgress(0);
        setLoss(2.5);

        // Simulate training loop visualization
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
        if (!testInput || !selectedModel) return;
        setIsRunning(true);
        setOutput("");

        try {
            const res = isFineTuned
                ? await getFineTunedOutput(testInput, selectedModel)
                : await getPreTrainedOutput(testInput, selectedModel);
            setOutput(res);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Training Dashboard */}
            <div className="bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 relative z-10 gap-4">
                    <div>
                        <h3 className="font-bold flex items-center gap-2 text-lg"><Database className="w-5 h-5 text-emerald-400" /> Dataset: YodaCorpus (10k samples)</h3>
                        <div className="text-zinc-500 text-sm">Targeting style adaptation (Syntax shifting)</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-700 outline-none cursor-pointer"
                            disabled={isTraining}
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        {isFineTuned ? (
                            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/50 flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-current" /> Model Ready
                            </div>
                        ) : (
                            <button
                                onClick={handleTrain}
                                disabled={isTraining}
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 text-sm shadow-lg shadow-indigo-900/50"
                            >
                                {isTraining ? 'Training...' : 'Start Fine-Tuning'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Visualizer */}
                <div className="h-32 bg-zinc-950/50 rounded-xl border border-zinc-800 mb-4 flex items-end p-4 gap-1 relative z-10 shadow-inner">
                    {/* Fake Loss Graph bars */}
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 bg-indigo-500/50 rounded-t-sm transition-all duration-300 ${i > (progress / 2) ? 'opacity-0' : 'opacity-100'}`}
                            style={{ height: `${Math.max(5, 100 - (i * 1.8 + Math.random() * 20))}%` }}
                        />
                    ))}
                    {!isTraining && !isFineTuned && <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm tracking-widest uppercase">Ready to train</div>}
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
            <div className={`flex-1 rounded-3xl p-6 border flex flex-col transition-colors duration-500 ${isFineTuned ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${isFineTuned ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                    <Zap className="w-4 h-4" /> Validation Playground ({isFineTuned ? 'Fine-Tuned' : 'Base Model'})
                </h3>

                <div className="flex gap-4">
                    <input
                        value={testInput}
                        onChange={e => setTestInput(e.target.value)}
                        placeholder="Type something (e.g., 'Teach me about force')..."
                        className="flex-1 bg-white dark:bg-zinc-800 rounded-xl px-4 outline-none border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 shadow-sm"
                        disabled={isRunning}
                    />
                    <button
                        onClick={handleTest}
                        disabled={isRunning || !testInput || !selectedModel}
                        className={`px-8 rounded-xl font-bold flex items-center gap-2 transition-all ${isFineTuned
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                            : 'bg-zinc-800 hover:bg-zinc-900 text-white'}`}
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        Run
                    </button>
                </div>

                <div className="mt-8 text-center flex-1 flex items-center justify-center relative">
                    {output ? (
                        <motion.div
                            key={output}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-2xl md:text-3xl font-serif max-w-2xl leading-relaxed ${isFineTuned ? 'text-emerald-800 dark:text-emerald-100 italic' : 'text-zinc-800 dark:text-zinc-200'}`}
                        >
                            "{output}"
                        </motion.div>
                    ) : (
                        <div className="text-zinc-400 opacity-50 flex flex-col items-center">
                            <Database className="w-12 h-12 mb-2 opacity-20" />
                            <div>Output will appear here</div>
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-zinc-400 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    Current Weight: <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300">
                        {selectedModel || '...'} {isFineTuned && '+ adapter_v1.bin'}
                    </span>
                </div>
            </div>
        </div>
    );
}
