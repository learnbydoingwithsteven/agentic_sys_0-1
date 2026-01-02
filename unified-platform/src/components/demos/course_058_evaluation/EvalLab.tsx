'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardCheck,
    CheckCircle,
    XCircle,
    Play,
    Loader2
} from 'lucide-react';
import { runEvalSet, EvalResult } from '@/actions/course_058_evaluation/eval_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function EvalLab() {
    const [results, setResults] = useState<EvalResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState<number | null>(null);

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
        if (!selectedModel) return;
        setIsRunning(true);
        setResults([]);
        setScore(null);

        try {
            // Note: In a real app we'd stream this. For now we await the whole set
            // or we could refactor runEvalSet to return a stream.
            const data = await runEvalSet(selectedModel);

            // Simulate incremental reveal for better UX (since it's fast)
            for (let i = 0; i < data.length; i++) {
                setResults(prev => [...prev, data[i]]);
                await new Promise(r => setTimeout(r, 200));
            }

            const passed = data.filter(d => d.passed).length;
            setScore(Math.round((passed / data.length) * 100));
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm gap-4">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                        LLM-as-a-Judge Benchmark
                    </h3>
                    <p className="text-zinc-500 text-sm">Evaluating: <span className="font-mono text-zinc-700 dark:text-zinc-300">{selectedModel || 'Loading...'}</span></p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
                        disabled={isRunning}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    {score !== null && (
                        <div className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
                            {score}%
                        </div>
                    )}
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        {isRunning ? 'Running...' : 'Run Eval'}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-700">
                            <th className="pb-3 pl-2 w-16">Status</th>
                            <th className="pb-3 w-1/3">Question</th>
                            <th className="pb-3 w-1/4">Expected</th>
                            <th className="pb-3 w-1/3">Actual / Judge Reason</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {results.map((res) => (
                            <motion.tr
                                key={res.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-b border-zinc-100 dark:border-zinc-800/50 group"
                            >
                                <td className="py-4 pl-2 align-top">
                                    {res.passed ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> : <XCircle className="w-5 h-5 text-red-500 mt-1" />}
                                </td>
                                <td className="py-4 font-medium text-zinc-800 dark:text-zinc-200 align-top">{res.question}</td>
                                <td className="py-4 text-zinc-500 align-top">{res.expected}</td>
                                <td className="py-4 align-top">
                                    <div className={`font-mono font-bold mb-1 ${res.passed ? 'text-zinc-700 dark:text-zinc-300' : 'text-red-600 dark:text-red-400'}`}>
                                        "{res.actual}"
                                    </div>
                                    <div className="text-xs text-zinc-400 italic">
                                        Judge: {res.reasoning}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {results.length === 0 && !isRunning && (
                    <div className="text-center text-zinc-400 mt-20 opacity-50 flex flex-col items-center">
                        <ClipboardCheck className="w-12 h-12 mb-2 opacity-20" />
                        <div>Ready to start benchmark.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
