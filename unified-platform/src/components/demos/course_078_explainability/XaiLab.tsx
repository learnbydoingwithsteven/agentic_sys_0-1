'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    CheckCircle,
    XCircle,
    Info
} from 'lucide-react';
import { explainDecision, Explanation } from '@/actions/course_078_explainability/xai_backend';

export function XaiLab() {
    const [credit, setCredit] = useState(700);
    const [income, setIncome] = useState(50000);
    const [debt, setDebt] = useState(10000);
    const [result, setResult] = useState<Explanation | null>(null);

    const handleRun = async () => {
        const res = await explainDecision(credit, income, debt);
        setResult(res);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex gap-12 items-center">
                <div className="flex-1 space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Credit Score ({credit})</label>
                        <input type="range" min="300" max="850" value={credit} onChange={e => setCredit(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Annual Income (${income})</label>
                        <input type="range" min="10000" max="200000" step="1000" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full accent-green-600" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Total Debt (${debt})</label>
                        <input type="range" min="0" max="50000" step="1000" value={debt} onChange={e => setDebt(Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                </div>

                <button
                    onClick={handleRun}
                    className="w-32 h-32 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-2xl"
                >
                    <Search className="w-8 h-8 mb-2" />
                    EXPLAIN
                </button>
            </div>

            {/* Explanation View */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
                {!result && <div className="text-zinc-400 opacity-50 text-xl font-light">Run analysis to see decision logic</div>}

                {result && (
                    <div className="w-full max-w-4xl flex gap-12 items-center">
                        {/* Outcome */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            {result.decision === 'APPROVED' ? <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" /> : <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />}
                            <h2 className="text-4xl font-black">{result.decision}</h2>
                            <p className="text-zinc-500">Score: {result.score}</p>
                        </motion.div>

                        {/* Waterfall Chart */}
                        <div className="flex-1 h-64 flex items-end gap-4 border-b-2 border-zinc-300 dark:border-zinc-700 pb-4 relative">
                            {result.factors.map((f, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                                    <div className={`text-sm font-bold mb-2 ${f.impact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {f.impact > 0 ? '+' : ''}{Math.round(f.impact)}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: Math.abs(f.impact) * 2 }} // Scaling factor
                                        className={`w-full rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity ${f.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    />
                                    <div className="absolute top-full mt-4 text-xs font-bold text-zinc-500 uppercase text-center w-24">
                                        {f.name}
                                    </div>
                                </div>
                            ))}

                            <div className="absolute top-0 right-0 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-w-xs text-xs text-zinc-500">
                                <div className="flex items-center gap-2 font-bold mb-1 text-zinc-900 dark:text-zinc-100"><Info className="w-3 h-3" /> AI Reasoning</div>
                                The decision is primarily driven by {result.factors.reduce((p, c) => Math.abs(c.impact) > Math.abs(p.impact) ? c : p).name}.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
