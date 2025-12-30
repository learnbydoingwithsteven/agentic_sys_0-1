'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    BarChart2,
    CheckCircle,
    AlertCircle,
    Play,
    Cpu
} from 'lucide-react';
import { runEvaluation, EvalRun } from '@/actions/course_041_agent_metrics/metric_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MetricLab() {
    const [runs, setRuns] = useState<EvalRun[]>([]);
    const [running, setRunning] = useState(false);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Fetch models on mount
    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setRunning(true);
        // LLM takes time per item, so no fake delay needed
        const res = await runEvaluation("default", selectedModel);
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

                <div className="flex items-center gap-4">
                    {/* Model Selector */}
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <Cpu className="w-4 h-4 text-zinc-500" />
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer w-32"
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleRun}
                        disabled={running || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Play className="w-4 h-4 fill-current" /> {running ? 'Evaluating...' : 'Run Benchmarks'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Aggregate Scores */}
                <div className="w-64 flex flex-col gap-4">
                    <ScoreCard label="Faithfulness" value={getAvg('faithfulness')} color="bg-emerald-500" />
                    <ScoreCard label="Answer Relevance" value={getAvg('answerRelevance')} color="bg-blue-500" />
                    <ScoreCard label="Context Precision" value={getAvg('contextPrecision')} color="bg-purple-500" />

                    {running && (
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-center text-xs text-zinc-400 italic animate-pulse border border-zinc-200 dark:border-zinc-800">
                            Running LLM-as-a-Judge on 3 queries...
                        </div>
                    )}
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
