'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Gauge,
    Database,
    Cpu,
    Timer,
    CheckCircle2
} from 'lucide-react';
import { runPerfTest, PerfMetrics } from '@/actions/course_080_performance_tuning/perf_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function PerfLab() {
    const [results, setResults] = useState<PerfMetrics[]>([]);
    const [running, setRunning] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleRace = async () => {
        if (!selectedModel) return;
        setRunning(true);
        setResults([]);

        // Sequential for clarity in this demo, or parallel if updated to allow it
        // We'll run parallel triggers
        const strats = ['BASELINE', 'OPTIMIZED_PROMPT', 'CACHE'] as const;

        for (const s of strats) {
            const r = await runPerfTest(s, selectedModel);
            setResults(prev => [...prev, r]);
        }

        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center px-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Timer className="w-6 h-6 text-green-500" />
                        Latency Optimizer
                    </h2>
                    <p className="text-zinc-500 text-sm">Compare Trace Optimization Strategies</p>
                </div>
                <div className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 font-mono">
                    Model: {selectedModel || 'Loading...'}
                </div>
            </div>

            <div className="flex justify-center mb-4">
                <button
                    onClick={handleRace}
                    disabled={running || !selectedModel}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    <Zap className="w-8 h-8 fill-current" />
                    START RACE
                </button>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col justify-evenly relative">
                <div className="absolute top-4 right-4 text-xs text-zinc-600 font-mono">Real-time Metrics (ms)</div>

                {['BASELINE', 'OPTIMIZED_PROMPT', 'CACHE'].map((strat) => {
                    const res = results.find(r => r.strategy === strat);
                    const isFinished = !!res;

                    let icon = <Cpu className="w-6 h-6 text-zinc-500" />;
                    let color = "bg-zinc-600";
                    let desc = "Generating entire context...";

                    if (strat === 'OPTIMIZED_PROMPT') {
                        icon = <Gauge className="w-6 h-6 text-blue-500" />;
                        color = "bg-blue-600";
                        desc = "Pre-computed context (Tokens ↓)";
                    }
                    if (strat === 'CACHE') {
                        icon = <Database className="w-6 h-6 text-yellow-500" />;
                        color = "bg-yellow-500";
                        desc = "Lookup from Memory (0 Latency)";
                    }

                    return (
                        <div key={strat} className="relative bg-zinc-800/50 rounded-2xl border border-zinc-700/50 p-4 overflow-hidden group">

                            <div className="flex items-center gap-6 mb-4 relative z-10">
                                <div className="w-48 font-bold text-zinc-300 flex items-center gap-3">
                                    {icon} {strat.replace('_', ' ')}
                                </div>

                                <div className="flex-1 h-3 bg-zinc-700/50 rounded-full overflow-hidden relative">
                                    <motion.div
                                        className={`h-full ${color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: isFinished ? '100%' : running && !res ? '80%' : '0%' }}
                                        transition={{ duration: isFinished ? 0.3 : 2, ease: "easeInOut" }}
                                    />
                                </div>

                                <div className="w-32 text-right font-mono text-white font-bold">
                                    {isFinished ? `${res.totalTime}ms` : running ? 'Running...' : '0ms'}
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <AnimatePresence>
                                {isFinished && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="pl-54 flex gap-4 text-xs text-zinc-500 border-t border-zinc-700 pt-2"
                                    >
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                            Output: <span className="text-zinc-400 italic">"{res.output.substring(0, 40)}..."</span>
                                        </div>
                                        <div>|</div>
                                        <div>Speed: {res.tokensPerSecond} t/s</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="text-[10px] text-zinc-600 pl-54 mt-1">{desc}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
