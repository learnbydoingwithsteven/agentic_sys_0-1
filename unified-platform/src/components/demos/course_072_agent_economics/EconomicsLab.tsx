'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Brain
} from 'lucide-react';
import { runEconomicSimulation, TaskEconomics } from '@/actions/course_072_agent_economics/economics_backend';

export function EconomicsLab() {
    const [transactions, setTransactions] = useState<TaskEconomics[]>([]);
    const [model, setModel] = useState<'cheap' | 'expensive'>('cheap');
    const [task, setTask] = useState<'low' | 'high'>('low');

    const handleRun = async () => {
        const res = await runEconomicSimulation(model, task);
        setTransactions(prev => [res, ...prev].slice(0, 10)); // Keep last 10
    };

    const totalProfit = transactions.reduce((acc, t) => acc + t.profit, 0);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div className="flex gap-8">
                    {/* Model Switch */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Model Selection</div>
                        <div className="flex bg-zinc-100 dark:bg-black/50 p-1 rounded-xl">
                            <button
                                onClick={() => setModel('cheap')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${model === 'cheap' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <Zap className="w-4 h-4 text-yellow-500" /> Flash-Mini
                            </button>
                            <button
                                onClick={() => setModel('expensive')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${model === 'expensive' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <Brain className="w-4 h-4 text-purple-500" /> Omni-Reasoning
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
                                Simple (Email)
                            </button>
                            <button
                                onClick={() => setTask('high')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${task === 'high' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Complex (Analysis)
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
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl shadow-2xl flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                    >
                        <DollarSign className="w-12 h-12" />
                        EXECUTE
                    </button>
                    <p className="mt-8 text-center text-zinc-500 text-sm max-w-[200px]">
                        Run the agent on the selected task and measure the ROI.
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
