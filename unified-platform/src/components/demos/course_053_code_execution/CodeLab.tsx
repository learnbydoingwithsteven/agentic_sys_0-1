'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Play,
    Code2,
    CheckCircle,
    XCircle,
    Cpu,
    Loader2
} from 'lucide-react';
import { executeCodeAgent, CodeExecutionResult } from '@/actions/course_053_code_execution/code_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function CodeLab() {
    const [prompt, setPrompt] = useState("Write a Python function to calculate the first 12 Fibonacci numbers");
    const [result, setResult] = useState<CodeExecutionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!prompt || !selectedModel) return;
        setIsProcessing(true);
        setResult(null);
        try {
            const res = await executeCodeAgent(prompt, selectedModel);
            setResult(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRun()}
                    placeholder="E.g. 'Write a script to calculate Fibonacci numbers'"
                    className="flex-1 bg-transparent px-4 border-none outline-none font-mono text-sm text-zinc-900 dark:text-zinc-100"
                    disabled={isProcessing}
                />

                {/* Model Selector */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                        disabled={isProcessing}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleRun}
                    disabled={isProcessing || !prompt || !selectedModel}
                    className="bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 font-bold"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    {isProcessing ? 'Generating...' : 'Run'}
                </button>
            </div>

            {/* Notebook Interface */}
            <div className="flex-1 bg-zinc-950 rounded-3xl p-6 border border-zinc-800 overflow-y-auto custom-scrollbar shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-2 text-zinc-500 mb-6 pb-2 border-b border-zinc-900">
                    <Terminal className="w-4 h-4" /> Python 3.10 Kernel (Simulated)
                </div>

                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-zinc-400 py-10"
                        >
                            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-500" />
                            <p className="font-bold">Generating Python code...</p>
                            <p className="text-xs mt-2">LLM is writing the solution</p>
                        </motion.div>
                    )}

                    {result && !isProcessing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Code Cell */}
                            <div className="relative group">
                                <div className="absolute -left-4 top-0 text-indigo-500 text-xs font-bold">In [1]:</div>
                                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-indigo-100 whitespace-pre-wrap overflow-x-auto">
                                    {result.code}
                                </div>
                            </div>

                            {/* Output Cell */}
                            <div className="relative group pl-2">
                                <div className={`absolute -left-4 top-0 text-xs font-bold ${result.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    Out[1]:
                                </div>
                                <div className={`
                                     p-4 rounded-lg border border-dashed flex items-start gap-3
                                     ${result.status === 'success'
                                        ? 'border-zinc-800 text-green-400 bg-green-950/10'
                                        : 'border-red-900/50 text-red-400 bg-red-950/10'}
                                 `}>
                                    {result.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1 whitespace-pre-wrap">
                                        {result.output}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!result && !isProcessing && (
                    <div className="text-zinc-700 italic text-center mt-20">
                        <Code2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p># Waiting for input...</p>
                        <p className="text-xs mt-2 text-zinc-600">Enter a coding task above and click Run</p>
                    </div>
                )}
            </div>
        </div>
    );
}
