'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    CheckCircle,
    XCircle,
    Info,
    BrainCircuit,
    Loader2
} from 'lucide-react';
import { explainDecision, Explanation } from '@/actions/course_078_explainability/xai_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function XaiLab() {
    const [credit, setCredit] = useState(700);
    const [income, setIncome] = useState(50000);
    const [debt, setDebt] = useState(10000);
    const [result, setResult] = useState<Explanation | null>(null);
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await explainDecision(credit, income, debt, selectedModel);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center px-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-indigo-500" />
                        Explainable AI (XAI)
                    </h2>
                    <p className="text-zinc-500 text-sm">Decision Transparency & Feature Attribution</p>
                </div>
                <div className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 font-mono">
                    Model: {selectedModel || 'Loading...'}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex gap-12 items-center">
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Credit Score</label>
                            <span className="font-mono font-bold">{credit}</span>
                        </div>
                        <input type="range" min="300" max="850" value={credit} onChange={e => setCredit(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Annual Income</label>
                            <span className="font-mono font-bold">${income.toLocaleString()}</span>
                        </div>
                        <input type="range" min="10000" max="200000" step="1000" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full accent-green-600" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Total Debt</label>
                            <span className="font-mono font-bold">${debt.toLocaleString()}</span>
                        </div>
                        <input type="range" min="0" max="50000" step="1000" value={debt} onChange={e => setDebt(Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                </div>

                <button
                    onClick={handleRun}
                    disabled={loading || !selectedModel}
                    className="w-32 h-32 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-2xl disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Search className="w-8 h-8 mb-2" />}
                    {loading ? "Thinking" : "EXPLAIN"}
                </button>
            </div>

            {/* Explanation View */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                {!result && !loading && <div className="text-zinc-400 opacity-50 text-xl font-light">Adjust parameters and click EXPLAIN</div>}

                {result && !loading && (
                    <div className="w-full max-w-4xl flex gap-12 items-center">
                        {/* Outcome */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center w-64 shrink-0"
                        >
                            {result.decision === 'APPROVED' ? <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" /> : <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />}
                            <h2 className="text-4xl font-black">{result.decision}</h2>
                            <p className="text-zinc-500 font-mono mt-1">Confidence: {result.score}%</p>
                            <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                "{result.summary}"
                            </div>
                        </motion.div>

                        {/* Waterfall Chart */}
                        <div className="flex-1 h-64 flex items-end gap-6 border-b-2 border-zinc-300 dark:border-zinc-700 pb-4 relative">
                            {result.factors.map((f, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                                    <div className={`text-sm font-bold mb-2 transition-transform group-hover:-translate-y-1 ${f.impact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {f.impact > 0 ? '+' : ''}{Math.round(f.impact)}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: Math.abs(f.impact) * 3 }} // Scaling factor
                                        className={`w-full rounded-t-lg opacity-80 group-hover:opacity-100 transition-all ${f.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                        style={{ minHeight: '4px', maxHeight: '100%' }}
                                    />
                                    <div className="absolute top-full mt-4 text-xs font-bold text-zinc-500 uppercase text-center w-full">
                                        {f.name}
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-2 rounded-lg w-48 text-center pointer-events-none z-10 shadow-xl">
                                        {f.reasoning}
                                        <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-black" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
