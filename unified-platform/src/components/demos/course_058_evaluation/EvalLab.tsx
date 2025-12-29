'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardCheck,
    CheckCircle,
    XCircle,
    Play
} from 'lucide-react';
import { runEvalSet, EvalResult } from '@/actions/course_058_evaluation/eval_backend';

export function EvalLab() {
    const [results, setResults] = useState<EvalResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const handleRun = async () => {
        setIsRunning(true);
        setResults([]);
        setScore(null);

        try {
            const data = await runEvalSet();
            // Simulate incremental loading for demo if backend returns all at once
            // (We could stream, but simple iteration is easier here)
            for (let i = 0; i < data.length; i++) {
                await new Promise(r => setTimeout(r, 600));
                setResults(prev => [...prev, data[i]]);
            }

            const passed = data.filter(d => d.passed).length;
            setScore(Math.round((passed / data.length) * 100));
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                        Agent Benchmark v1
                    </h3>
                    <p className="text-zinc-500 text-sm">Dataset: General Knowledge (5 Samples)</p>
                </div>

                <div className="flex items-center gap-4">
                    {score !== null && (
                        <div className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
                            {score}%
                        </div>
                    )}
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? 'Benchmarking...' : 'Run Eval'} <Play className="w-4 h-4 fill-current" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-700">
                            <th className="pb-3 pl-2">Status</th>
                            <th className="pb-3">Question</th>
                            <th className="pb-3">Expected</th>
                            <th className="pb-3">Actual Output</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {results.map((res) => (
                            <motion.tr
                                key={res.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-b border-zinc-100 dark:border-zinc-800/50"
                            >
                                <td className="py-4 pl-2">
                                    {res.passed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                </td>
                                <td className="py-4 font-medium text-zinc-800 dark:text-zinc-200">{res.question}</td>
                                <td className="py-4 text-zinc-500">{res.expected}</td>
                                <td className={`py-4 font-mono ${res.passed ? 'text-zinc-600 dark:text-zinc-400' : 'text-red-600 dark:text-red-400 font-bold'}`}>
                                    {res.actual}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {results.length === 0 && !isRunning && (
                    <div className="text-center text-zinc-400 mt-20 opacity-50">
                        Ready to start benchmark.
                    </div>
                )}
            </div>
        </div>
    );
}
