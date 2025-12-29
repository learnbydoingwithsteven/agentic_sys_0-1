'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Play,
    Code2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { executeCodeAgent, CodeExecutionResult } from '@/actions/course_053_code_execution/code_backend';

export function CodeLab() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState<CodeExecutionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async () => {
        if (!prompt) return;
        setIsProcessing(true);
        setResult(null);
        try {
            const res = await executeCodeAgent(prompt);
            setResult(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[600px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="E.g. 'Write a script to calculate Fibonacci numbers'"
                    className="flex-1 bg-transparent px-4 border-none outline-none font-mono text-sm"
                    disabled={isProcessing}
                />
                <button
                    onClick={handleRun}
                    disabled={isProcessing || !prompt}
                    className="bg-zinc-800 hover:bg-zinc-900 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    {isProcessing ? <Code2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
            </div>

            {/* Notebook Interface */}
            <div className="flex-1 bg-zinc-950 rounded-3xl p-6 border border-zinc-800 overflow-y-auto custom-scrollbar shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-2 text-zinc-500 mb-6 pb-2 border-b border-zinc-900">
                    <Terminal className="w-4 h-4" /> Python 3.10 Kernel (Simulated)
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Code Cell */}
                            <div className="relative group">
                                <div className="absolute -left-4 top-0 text-indigo-500 text-xs font-bold">In [1]:</div>
                                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-indigo-100 whitespace-pre-wrap">
                                    {result.code}
                                </div>
                            </div>

                            {/* Output Cell */}
                            <div className="relative group pl-2">
                                <div className="absolute -left-4 top-0 text-red-500 text-xs font-bold">Out[1]:</div>
                                <div className={`
                                     p-4 rounded-lg border border-dashed
                                     ${result.status === 'success' ? 'border-zinc-800 text-green-400' : 'border-red-900/50 text-red-400 bg-red-950/10'}
                                 `}>
                                    {result.output}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!result && !isProcessing && (
                    <div className="text-zinc-700 italic text-center mt-20">
                        # Waiting for input...
                    </div>
                )}
            </div>
        </div>
    );
}
