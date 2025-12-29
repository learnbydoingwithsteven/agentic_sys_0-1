'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    MessageSquare,
    PieChart,
    Coins
} from 'lucide-react';
import { generateWithCostTracking, CostReport } from '@/actions/course_040_cost_optimization/cost_backend';

export function CostLab() {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<{ q: string, report: CostReport }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Aggregate Stats
    const totalSpent = logs.reduce((acc, l) => acc + l.report.totalCost, 0);
    const totalTokens = logs.reduce((acc, l) => acc + l.report.inputTokens + l.report.outputTokens, 0);

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;
        setIsProcessing(true);

        try {
            // Pass simple history (last 5 messages)
            const context = logs.slice(0, 5).map(l => `User: ${l.q}\nAI: ${l.report.response}`);

            const res = await generateWithCostTracking(input, context);
            setLogs(prev => [{ q: input, report: res }, ...prev]);
            setInput("");
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[600px]">
            {/* Left: Dashboard */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                {/* Main Metric: Total Cost */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-24 h-24" />
                    </div>
                    <h3 className="text-emerald-100 font-semibold text-sm uppercase tracking-wider mb-1">Total Session Cost</h3>
                    <div className="text-4xl font-mono font-bold tracking-tight">
                        ${totalSpent.toFixed(6)}
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Total Tokens</div>
                        <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">{totalTokens}</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Avg Cost/Msg</div>
                        <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            ${logs.length ? (totalSpent / logs.length).toFixed(4) : "0.0000"}
                        </div>
                    </div>
                </div>

                {/* Cost Distribution (Simple Bar) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1">
                    <h3 className="text-sm font-bold text-zinc-500 mb-6 flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        Distribution
                    </h3>
                    {logs.length > 0 ? (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Input (Prompts)</span>
                                    <span>{((logs.reduce((a, l) => a + l.report.inputCost, 0) / totalSpent) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(logs.reduce((a, l) => a + l.report.inputCost, 0) / totalSpent) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Output (Completion)</span>
                                    <span>{((logs.reduce((a, l) => a + l.report.outputCost, 0) / totalSpent) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${(logs.reduce((a, l) => a + l.report.outputCost, 0) / totalSpent) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-zinc-400 text-sm mt-10">
                            No data yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {logs.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                            {/* User Bubble */}
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                                    {item.q}
                                </div>
                            </div>

                            {/* AI Bubble + Cost Card */}
                            <div className="flex flex-col items-start max-w-[85%] gap-2">
                                <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-700 dark:text-zinc-300">
                                    {item.report.response}
                                </div>

                                {/* Micro Cost Report */}
                                <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono px-2">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-blue-500" />
                                        In: {item.report.inputTokens} tok (${item.report.inputCost.toFixed(5)})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Coins className="w-3 h-3 text-purple-500" />
                                        Out: {item.report.outputTokens} tok (${item.report.outputCost.toFixed(5)})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        disabled={isProcessing}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-black rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !input}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
