'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Calculator,
    Check,
    X,
    ArrowRight,
    Play
} from 'lucide-react';
import { solveSymbolicProblem, MethodResult } from '@/actions/course_082_neuro_symbolic/neuro_sym_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function NeuroSymLab() {
    const [results, setResults] = useState<MethodResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState("1234 * 5678");

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSolve = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await solveSymbolicProblem(problem, selectedModel);
        setResults(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl font-black flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-pink-500" />
                    +
                    <Calculator className="w-8 h-8 text-indigo-500" />
                </h2>
                <div className="flex gap-2 w-full max-w-lg">
                    <input
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-6 py-4 rounded-full font-mono text-center font-bold text-xl outline-none focus:ring-2 ring-indigo-500"
                        placeholder="e.g. 123 * 456"
                    />
                    <button
                        onClick={handleSolve}
                        disabled={loading || !selectedModel}
                        className="bg-black dark:bg-white text-white dark:text-black w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 shadow-lg"
                    >
                        {loading ? <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                </div>
                <div className="text-xs text-zinc-500 font-mono">Model: {selectedModel}</div>
            </div>

            <div className="flex-1 flex gap-8 pb-4">
                {/* Pure LLM */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-pink-500" />
                    <h3 className="font-bold text-xl mb-4 text-pink-600">Pure LLM</h3>
                    <p className="text-zinc-500 text-xs text-center mb-8 max-w-xs">
                        Relies on probabilistic next-token prediction. Often struggles with precise calculations.
                    </p>

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col"
                        >
                            <div className="flex-1 font-mono text-xs text-zinc-400 mb-4 space-y-2 overflow-y-auto bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                {results[0].logs.map((log, i) => (
                                    <div key={i} className="whitespace-pre-wrap break-all">{log}</div>
                                ))}
                            </div>
                            <div className={`text-center p-6 rounded-2xl border-2 ${results[0].isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                <div className="text-2xl font-black break-all">{results[0].answer}</div>
                                <div className="text-xs uppercase font-bold tracking-widest mt-2 flex items-center justify-center gap-1">
                                    {results[0].isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {results[0].isCorrect ? 'CORRECT' : 'HALLUCINATION'}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center">
                    <ArrowRight className="text-zinc-300 w-8 h-8" />
                </div>

                {/* Neuro-Symbolic */}
                <div className="flex-1 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
                    <h3 className="font-bold text-xl mb-4 text-indigo-600">Neuro-Symbolic</h3>
                    <p className="text-indigo-800/60 dark:text-indigo-300/60 text-xs text-center mb-8 max-w-xs">
                        Uses LLM to plan, but delegates math to a deterministic Symbolic Tool (Calculator).
                    </p>

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full h-full flex flex-col"
                        >
                            <div className="flex-1 font-mono text-xs text-indigo-400 mb-4 space-y-2 overflow-y-auto bg-white dark:bg-black p-4 rounded-xl border border-indigo-100 dark:border-indigo-900">
                                {results[1].logs.map((log, i) => (
                                    <div key={i} className="whitespace-pre-wrap">{log}</div>
                                ))}
                            </div>
                            <div className={`text-center p-6 rounded-2xl border-2 ${results[1].isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                                <div className="text-2xl font-black">{results[1].answer}</div>
                                <div className="text-xs uppercase font-bold tracking-widest mt-2 flex items-center justify-center gap-1">
                                    {results[1].isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {results[1].isCorrect ? 'VERIFIED CORRECT' : 'EXECUTION ERROR'}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
