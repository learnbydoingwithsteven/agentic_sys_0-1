'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    BarChart2,
    CheckCircle,
    AlertCircle,
    Play
} from 'lucide-react';
import { runEvaluation, EvalRun } from '@/actions/course_041_agent_metrics/metric_backend';

export function MetricLab() {
    const [runs, setRuns] = useState<EvalRun[]>([]);
    const [running, setRunning] = useState(false);

    const handleRun = async () => {
        setRunning(true);
        await new Promise(r => setTimeout(r, 1000));
        const res = await runEvaluation("default");
        setRuns(res);
        setRunning(false);
    };

    const getAvg = (key: keyof EvalRun['metrics']) => {
        if (runs.length === 0) return 0;
        return runs.reduce((acc, r) => acc + r.metrics[key], 0) / runs.length;
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        RAG Evaluation Suite
                    </h3>
                    <p className="text-zinc-500 text-sm">Measure Faithfulness, Relevance, and Precision.</p>
                </div>
                <button
                    onClick={handleRun}
                    disabled={running}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    <Play className="w-4 h-4 fill-current" /> {running ? 'Evaluating...' : 'Run Benchmarks'}
                </button>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Aggregate Scores */}
                <div className="w-64 flex flex-col gap-4">
                    <ScoreCard label="Faithfulness" value={getAvg('faithfulness')} color="bg-emerald-500" />
                    <ScoreCard label="Answer Relevance" value={getAvg('answerRelevance')} color="bg-blue-500" />
                    <ScoreCard label="Context Precision" value={getAvg('contextPrecision')} color="bg-purple-500" />
                </div>

                {/* Detailed Table */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-700">
                            <tr>
                                <th className="pb-3 pl-2">Q/A Pair</th>
                                <th className="pb-3 w-32">Faithfulness</th>
                                <th className="pb-3 w-32">Relevance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runs.map((run, i) => (
                                <motion.tr
                                    key={run.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-white dark:hover:bg-zinc-900/50"
                                >
                                    <td className="py-4 pl-2">
                                        <div className="font-bold text-zinc-700 dark:text-zinc-300">Q: "{run.question}"</div>
                                        <div className="text-zinc-500 dark:text-zinc-500 mt-1">A: "{run.answer}"</div>
                                    </td>
                                    <td className="py-4">
                                        <ScoreBadge val={run.metrics.faithfulness} />
                                    </td>
                                    <td className="py-4">
                                        <ScoreBadge val={run.metrics.answerRelevance} />
                                    </td>
                                </motion.tr>
                            ))}
                            {runs.length === 0 && !running && (
                                <tr>
                                    <td colSpan={3} className="text-center py-20 text-zinc-400 italic">
                                        No metrics available. Click "Run Benchmarks" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ label, value, color }: { label: string, value: number, color: string }) {
    const percentage = Math.round(value * 100);
    return (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
            <div className="text-xs font-bold text-zinc-500 uppercase">{label}</div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-black">{percentage}%</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

function ScoreBadge({ val }: { val: number }) {
    const color = val > 0.8 ? 'text-green-600 bg-green-50' : val > 0.5 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
    return (
        <span className={`px-2 py-1 rounded font-bold ${color}`}>
            {(val * 100).toFixed(0)}%
        </span>
    );
}
