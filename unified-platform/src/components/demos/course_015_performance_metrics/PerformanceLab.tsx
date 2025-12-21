'use client';

import React, { useState, useEffect } from 'react';
import { Gauge, Zap, DollarSign, Clock, BarChart3, Play, Activity, Repeat, GitCompare, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compareModels, type PerformanceMetrics } from '@/actions/course_015_performance_metrics/performance';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const BENCHMARK_TASKS = [
    { label: 'Summarization (Heavy)', text: "Summarize the history of the Roman Empire, focusing on the fall of Rome and the socio-economic factors involved. Provide a 3 paragraph response." },
    { label: 'Creative Writing (Creative)', text: "Write a poem about a robot discovering a flower in a cyberpunk city." },
    { label: 'Logic (Reasoning)', text: "Solve this riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? Explain your reasoning step by step." }
];

export function PerformanceLab() {
    const [input, setInput] = useState(BENCHMARK_TASKS[0].text);
    const [iterations, setIterations] = useState(1);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<Record<string, PerformanceMetrics[]> | null>(null);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setSelectedModels([available[0]]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const toggleModel = (model: string) => {
        setSelectedModels(prev =>
            prev.includes(model)
                ? prev.filter(m => m !== model)
                : [...prev, model]
        );
    };

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading || selectedModels.length === 0) return;

        setLoading(true);
        setComparisonResults(null);

        try {
            const res = await compareModels(input, selectedModels, iterations);
            setComparisonResults(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats for each model
    const getModelStats = (modelResults: PerformanceMetrics[]) => {
        const successfulRuns = modelResults.filter(r => r.success);
        if (successfulRuns.length === 0) return null;

        return {
            avgTPS: successfulRuns.reduce((acc, m) => acc + m.tokensPerSecond, 0) / successfulRuns.length,
            avgLatency: successfulRuns.reduce((acc, m) => acc + m.durationMs, 0) / successfulRuns.length,
            totalCost: successfulRuns.reduce((acc, m) => acc + m.costEstimate, 0),
            avgTokens: successfulRuns.reduce((acc, m) => acc + m.totalTokens, 0) / successfulRuns.length,
            successRate: (successfulRuns.length / modelResults.length) * 100
        };
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Gauge className="w-5 h-5 text-blue-500" />
                        <h3>LLM Benchmark Suite</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <GitCompare className="w-3 h-3" />
                        {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
                    </div>
                </div>

                {/* Model Selection */}
                <div className="flex flex-wrap gap-2">
                    {models.map(model => (
                        <button
                            key={model}
                            type="button"
                            onClick={() => toggleModel(model)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedModels.includes(model)
                                ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                }`}
                        >
                            {model}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Controls */}
                <form onSubmit={handleRun} className="max-w-3xl mx-auto space-y-6 mb-8">

                    {/* Presets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {BENCHMARK_TASKS.map((task, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setInput(task.text)}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                            >
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500">{task.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none h-24"
                            placeholder="Enter benchmark prompt..."
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Repeat className="w-4 h-4 text-zinc-400" />
                            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Iterations:</label>
                            <select
                                value={iterations}
                                onChange={(e) => setIterations(Number(e.target.value))}
                                className="bg-zinc-100 dark:bg-zinc-800 border-none rounded px-2 py-1 text-xs font-bold outline-none"
                            >
                                <option value={1}>1 Run</option>
                                <option value={3}>3 Runs (Avg)</option>
                                <option value={5}>5 Runs (Avg)</option>
                            </select>
                        </div>
                        <button
                            disabled={loading || selectedModels.length === 0}
                            className={`px-6 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 text-white shadow-md ${loading || selectedModels.length === 0 ? 'bg-zinc-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            {loading ? 'Benchmarking...' : 'Start Benchmark'}
                        </button>
                    </div>
                </form>

                {/* COMPARISON DASHBOARD */}
                <AnimatePresence>
                    {comparisonResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto space-y-6"
                        >
                            {/* Comparison Table */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50">
                                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                                    <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Model Comparison</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-zinc-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold text-zinc-600 dark:text-zinc-400">Model</th>
                                                <th className="px-4 py-3 text-right font-bold text-zinc-600 dark:text-zinc-400">TPS</th>
                                                <th className="px-4 py-3 text-right font-bold text-zinc-600 dark:text-zinc-400">Latency</th>
                                                <th className="px-4 py-3 text-right font-bold text-zinc-600 dark:text-zinc-400">Tokens</th>
                                                <th className="px-4 py-3 text-right font-bold text-zinc-600 dark:text-zinc-400">Cost</th>
                                                <th className="px-4 py-3 text-right font-bold text-zinc-600 dark:text-zinc-400">Success</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {Object.entries(comparisonResults).map(([modelName, results]) => {
                                                const stats = getModelStats(results);
                                                if (!stats) return null;

                                                return (
                                                    <tr key={modelName} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                        <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-200">{modelName}</td>
                                                        <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400">{stats.avgTPS.toFixed(1)}</td>
                                                        <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{(stats.avgLatency / 1000).toFixed(2)}s</td>
                                                        <td className="px-4 py-3 text-right font-mono text-zinc-600 dark:text-zinc-400">{Math.round(stats.avgTokens)}</td>
                                                        <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">${stats.totalCost.toFixed(5)}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${stats.successRate === 100
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                }`}>
                                                                {stats.successRate.toFixed(0)}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Individual Model Details */}
                            {Object.entries(comparisonResults).map(([modelName, results]) => (
                                <div key={modelName} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-zinc-400" />
                                            <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{modelName} - Run Log</h4>
                                        </div>
                                        <span className="text-[10px] text-zinc-500">{results.length} run{results.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {results.map((run, i) => (
                                            <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        #{i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                            {run.success ? 'Completed' : 'Failed'}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-500">
                                                            {run.totalTokens} total tokens
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                                                        {run.tokensPerSecond.toFixed(1)} t/s
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono">
                                                        {run.durationMs.toFixed(0)}ms
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
