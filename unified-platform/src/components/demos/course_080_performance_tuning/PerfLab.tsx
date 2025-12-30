'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Gauge,
    Database,
    Cpu
} from 'lucide-react';
import { runPerfTest, PerfMetrics } from '@/actions/course_080_performance_tuning/perf_backend';

export function PerfLab() {
    const [results, setResults] = useState<PerfMetrics[]>([]);
    const [running, setRunning] = useState(false);

    const handleRace = async () => {
        setRunning(true);
        setResults([]);

        // Run Parallel for effect, but we can't truly parallelize Server Actions to the exact ms client-side easily without Promise.all
        // We will run them and display results as they arrive
        const p1 = runPerfTest('BASELINE');
        const p2 = runPerfTest('TINY_MODEL');
        const p3 = runPerfTest('CACHE');

        const r1 = await p1; setResults(prev => [...prev, r1]);
        const r2 = await p2; setResults(prev => [...prev, r2]);
        const r3 = await p3; setResults(prev => [...prev, r3]);

        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex justify-center mb-8">
                <button
                    onClick={handleRace}
                    disabled={running}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    <Zap className="w-8 h-8 fill-current" />
                    START RACE
                </button>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col justify-evenly">
                {['BASELINE', 'TINY_MODEL', 'CACHE'].map((strat) => {
                    const res = results.find(r => r.strategy === strat);
                    const isFinished = !!res;

                    let icon = <Cpu className="w-6 h-6 text-zinc-500" />;
                    if (strat === 'TINY_MODEL') icon = <Gauge className="w-6 h-6 text-blue-500" />;
                    if (strat === 'CACHE') icon = <Database className="w-6 h-6 text-yellow-500" />;

                    return (
                        <div key={strat} className="relative h-24 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 flex items-center px-6 gap-6 overflow-hidden">
                            {/* Track Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-10 pointer-events-none">
                                <div className="border-b border-white" />
                                <div className="border-b border-white" />
                            </div>

                            {/* Label */}
                            <div className="w-32 font-bold text-zinc-400 flex items-center gap-2 z-10">
                                {icon} {strat}
                            </div>

                            {/* Runner */}
                            <div className="flex-1 relative h-full flex items-center">
                                {/* Destination Line */}
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 z-0" />

                                <motion.div
                                    className={`w-12 h-12 rounded-xl shadow-lg z-10 flex items-center justify-center font-bold text-xs
                                        ${strat === 'BASELINE' ? 'bg-zinc-600 text-white' : ''}
                                        ${strat === 'TINY_MODEL' ? 'bg-blue-600 text-white' : ''}
                                        ${strat === 'CACHE' ? 'bg-yellow-500 text-black' : ''}
                                    `}
                                    initial={{ left: 0 }}
                                    animate={{ left: running || isFinished ? (isFinished ? '100%' : '10%') : '0%' }}
                                    transition={{ duration: isFinished ? 0.5 : 2, ease: "linear" }}
                                    style={{ position: 'absolute' }}
                                >
                                    {strat === 'CACHE' ? 'RAM' : 'AI'}
                                </motion.div>
                            </div>

                            {/* Metrics */}
                            <div className="w-48 text-right z-10 font-mono">
                                {isFinished ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="text-xl font-bold text-white">{res?.ttft}ms <span className="text-xs text-zinc-500">TTFT</span></div>
                                        <div className="text-sm text-zinc-400">{res?.tokensPerSecond} tok/s</div>
                                    </motion.div>
                                ) : (
                                    <div className="text-zinc-600">Waiting...</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
