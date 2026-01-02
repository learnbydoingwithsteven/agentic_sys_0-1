'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Zap,
    Brain,
    Loader2,
    Scale,
    Trophy
} from 'lucide-react';
import { runEconomicComparison, StrategyResult } from '@/actions/course_072_agent_economics/economics_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function EconomicsLab() {
    const [results, setResults] = useState<StrategyResult[]>([]);
    const [taskType, setTaskType] = useState<'simple' | 'complex'>('complex');
    const [isRunning, setIsRunning] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            models.length > 0 && setSelectedModel(models[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setIsRunning(true);
        setResults([]);

        const prompt = taskType === 'simple'
            ? "Write a one sentence email acknowledging receipt."
            : "Analyze the pros and cons of Microservices vs Monolith architecture for a startup.";

        try {
            const res = await runEconomicComparison(prompt, selectedModel);
            setResults(res);
        } catch (e) {
            console.error(e);
        }
        setIsRunning(false);
    };

    const winner = results.length === 2
        ? (results[0].roi > results[1].roi ? results[0] : results[1])
        : null;

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header / Controls */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Scale className="w-5 h-5 text-indigo-500" />
                        Strategic ROI Optimizer
                    </h3>
                    <p className="text-zinc-500 text-sm text-center max-w-md">
                        Compare "Efficiency" vs "Deep Reasoning" strategies. The agent calculates Cost, Quality (Score), and ROI to pick the winner.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-950 p-2 rounded-2xl">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-zinc-500 pl-2 uppercase">Task</label>
                        <select
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value as any)}
                            className="bg-transparent font-bold py-1 px-2 outline-none cursor-pointer"
                        >
                            <option value="simple">Simple (Email)</option>
                            <option value="complex">Complex (Analysis)</option>
                        </select>
                    </div>
                    <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-800" />
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-zinc-500 pl-2 uppercase">Model</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent font-bold py-1 px-2 outline-none cursor-pointer w-40"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 ml-4 flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
                        Compare Strategies
                    </button>
                </div>
            </div>

            {/* Battle Arena */}
            <div className="flex-1 grid grid-cols-2 gap-6 relative">
                {/* Winner Banner */}
                {winner && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase shadow-lg z-20 flex items-center gap-2"
                    >
                        <Trophy className="w-3 h-3" />
                        Winner: {winner.strategy} Strategy
                    </motion.div>
                )}

                {/* Strategy A */}
                <StrategyCard
                    title="Efficiency Strategy"
                    icon={<Zap className="w-6 h-6 text-yellow-500" />}
                    result={results.find(r => r.strategy === 'Efficiency')}
                    loading={isRunning}
                    isWinner={winner?.strategy === 'Efficiency'}
                />

                {/* Strategy B */}
                <StrategyCard
                    title="Reasoning Strategy"
                    icon={<Brain className="w-6 h-6 text-purple-500" />}
                    result={results.find(r => r.strategy === 'Reasoning')}
                    loading={isRunning}
                    isWinner={winner?.strategy === 'Reasoning'}
                />
            </div>
        </div>
    );
}

function StrategyCard({ title, icon, result, loading, isWinner }: any) {
    return (
        <div className={`
            rounded-3xl p-6 border-2 flex flex-col gap-4 relative overflow-hidden transition-all duration-500
            ${isWinner ? 'bg-indigo-50/50 border-indigo-500 dark:bg-indigo-900/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'}
        `}>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    {icon}
                </div>
                <div className="font-bold text-lg">{title}</div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar text-sm text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-50 dark:bg-black/20 p-4 rounded-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generating...
                    </div>
                ) : result ? (
                    result.response
                ) : (
                    <div className="text-center opacity-30 mt-10">Run to generate...</div>
                )}
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-3 gap-2">
                <Metric label="Cost" value={result ? `${result.cost}¢` : '-'} color="text-zinc-500" />
                <Metric label="Quality" value={result ? `${result.score}/10` : '-'} color={result && result.score >= 8 ? "text-emerald-500" : "text-amber-500"} />
                <Metric label="ROI" value={result ? `${result.roi}%` : '-'} color={result && result.roi > 100 ? "text-emerald-600 font-black" : "text-zinc-500"} />
            </div>
        </div>
    );
}

function Metric({ label, value, color }: any) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl text-center">
            <div className="text-[10px] uppercase text-zinc-400 font-bold">{label}</div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
        </div>
    );
}
