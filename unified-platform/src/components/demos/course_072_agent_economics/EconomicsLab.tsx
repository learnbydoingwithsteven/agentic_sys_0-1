'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Zap,
    Brain,
    Loader2
} from 'lucide-react';
import { runEconomicSimulation, TaskEconomics } from '@/actions/course_072_agent_economics/economics_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function EconomicsLab() {
    const [transactions, setTransactions] = useState<TaskEconomics[]>([]);
    const [simulatedTier, setSimulatedTier] = useState<'cheap' | 'expensive'>('cheap');
    const [task, setTask] = useState<'low' | 'high'>('low');
    const [isRunning, setIsRunning] = useState(false);

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
        try {
            const res = await runEconomicSimulation(simulatedTier, task, selectedModel);
            setTransactions(prev => [res, ...prev].slice(0, 10)); // Keep last 10
        } catch (e) {
            console.error(e);
        }
        setIsRunning(false);
    };

    const totalProfit = transactions.reduce((acc, t) => acc + t.profit, 0);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Actual LLM */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Execution Model</div>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 outline-none w-48"
                            disabled={isRunning}
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Pricing Tier Switch */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Simulated Pricing</div>
                        <div className="flex bg-zinc-100 dark:bg-black/50 p-1 rounded-xl">
                            <button
                                onClick={() => setSimulatedTier('cheap')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${simulatedTier === 'cheap' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <Zap className="w-4 h-4 text-yellow-500" /> Standard
                            </button>
                            <button
                                onClick={() => setSimulatedTier('expensive')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${simulatedTier === 'expensive' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <Brain className="w-4 h-4 text-purple-500" /> Premium
                            </button>
                        </div>
                    </div>

                    {/* Task Switch */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Task Complexity</div>
                        <div className="flex bg-zinc-100 dark:bg-black/50 p-1 rounded-xl">
                            <button
                                onClick={() => setTask('low')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${task === 'low' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => setTask('high')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${task === 'high' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Complex
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Net Profit (Session)</div>
                    <div className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}¢
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 gap-8 overflow-hidden">
                {/* Visualizer (Run Button + Stats) */}
                <div className="w-1/3 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/30 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !selectedModel}
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl shadow-2xl flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        {isRunning ? <Loader2 className="w-12 h-12 animate-spin" /> : <DollarSign className="w-12 h-12" />}
                        {isRunning ? 'CALCULATING' : 'EXECUTE'}
                    </button>
                    <p className="mt-8 text-center text-zinc-500 text-sm max-w-[200px]">
                        Run the agent on the selected task and measure the ROI based on real token usage.
                    </p>
                </div>

                {/* Ledger */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                    <h3 className="font-bold text-zinc-400 uppercase text-xs tracking-wider mb-2">Transaction Log</h3>
                    <AnimatePresence>
                        {transactions.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
                            >
                                <div>
                                    <div className="font-bold text-sm">{t.taskName}</div>
                                    <div className="text-xs text-zinc-500">In: {t.inputTokens} | Out: {t.outputTokens}</div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div className="hidden lg:block text-xs text-zinc-400">
                                        <div>Cost: {t.cost}¢</div>
                                        <div>Val: {t.value}¢</div>
                                    </div>
                                    <div className={`font-bold font-mono text-lg flex items-center gap-1 ${t.profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {t.profit > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {t.profit > 0 ? '+' : ''}{t.profit.toFixed(2)}¢
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {transactions.length === 0 && (
                        <div className="text-center text-zinc-400 mt-20 opacity-50">
                            No transactions yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
