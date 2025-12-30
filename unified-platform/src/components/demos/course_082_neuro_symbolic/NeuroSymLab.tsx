'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Calculator,
    Check,
    X,
    ArrowRight
} from 'lucide-react';
import { solveSymbolicProblem, MethodResult } from '@/actions/course_082_neuro_symbolic/neuro_sym_backend';

export function NeuroSymLab() {
    const [results, setResults] = useState<MethodResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSolve = async () => {
        setLoading(true);
        const res = await solveSymbolicProblem("4321 * 1234");
        // Reveal purely for effect
        await new Promise(r => setTimeout(r, 800));
        setResults(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-black">Problem: 4321 × 1234 = ?</h2>
                <button
                    onClick={handleSolve}
                    disabled={loading || results.length > 0}
                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {loading ? 'Solving...' : 'COMPARE APPROACHES'}
                </button>
            </div>

            <div className="flex-1 flex gap-8">
                {/* Pure LLM */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white mb-6 shadow-lg">
                        <BrainCircuit className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-4">Pure LLM</h3>
                    <p className="text-zinc-500 text-sm text-center mb-8">
                        Attempts to predict the next token based on training data patterns.
                    </p>

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-white dark:bg-black rounded-xl p-6 border-2 border-red-200 dark:border-red-900/30 shadow-sm"
                        >
                            <div className="font-mono text-xs text-zinc-400 mb-4 space-y-2">
                                {results[0].logs.map((log, i) => (
                                    <div key={i}>&gt; {log}</div>
                                ))}
                            </div>
                            <div className="text-3xl font-black text-center text-red-500 flex flex-col items-center">
                                {results[0].answer}
                                <div className="text-xs uppercase font-bold tracking-widest mt-1 flex items-center gap-1">
                                    <X className="w-4 h-4" /> Incorrect
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center">
                    <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black rounded-full w-12 h-12 flex items-center justify-center text-sm">VS</div>
                </div>

                {/* Neuro-Symbolic */}
                <div className="flex-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white mb-6 shadow-lg">
                        <Calculator className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-4">Neuro-Symbolic</h3>
                    <p className="text-indigo-800/60 dark:text-indigo-200/60 text-sm text-center mb-8">
                        Delegates logic/math to deterministic tools (Code/Calculator).
                    </p>

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-full bg-white dark:bg-black rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-900/30 shadow-sm"
                        >
                            <div className="font-mono text-xs text-zinc-400 mb-4 space-y-2">
                                {results[1].logs.map((log, i) => (
                                    <div key={i}>&gt; {log}</div>
                                ))}
                            </div>
                            <div className="text-3xl font-black text-center text-emerald-500 flex flex-col items-center">
                                {results[1].answer}
                                <div className="text-xs uppercase font-bold tracking-widest mt-1 flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Correct
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
