'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Snowflake,
    Flame,
    Code2,
    Play,
    Terminal
} from 'lucide-react';
import { runEphemeralAgent, EphemeralResult } from '@/actions/course_086_serverless/serverless_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ServerlessLab() {
    const [task, setTask] = useState("Filter even numbers");
    const [inputData, setInputData] = useState("[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]");
    const [result, setResult] = useState<EphemeralResult | null>(null);
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
        const res = await runEphemeralAgent(task, inputData, selectedModel);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-purple-500" />
                        Serverless Function Factory
                    </h3>
                    <p className="text-zinc-500 text-sm">Agent generates code on Cold Start, reuses it on Warm Start.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Inputs */}
                <div className="w-1/3 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">Task Instruction</label>
                        <input
                            value={task}
                            onChange={e => setTask(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-purple-500 font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">Input Data (JSON)</label>
                        <textarea
                            value={inputData}
                            onChange={e => setInputData(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-purple-500 font-mono text-xs h-32 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleRun}
                        disabled={loading || !selectedModel}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-auto"
                    >
                        {loading ? <Zap className="animate-bounce fill-current" /> : <Play className="fill-current w-5 h-5" />}
                        {loading ? 'Generating...' : 'Execute Function'}
                    </button>

                    <div className="text-xs text-center text-zinc-400">
                        Try repeatedly to trigger Cache Hit.
                    </div>
                </div>

                {/* Output Viz */}
                <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 relative flex flex-col items-center justify-center overflow-hidden font-mono">
                    {!result && !loading && (
                        <div className="text-zinc-600 flex flex-col items-center gap-2 opacity-50">
                            <Terminal className="w-12 h-12" />
                            <div>Waiting for execution...</div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center gap-4 text-purple-400">
                            <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                            <div className="animate-pulse">Synthesizing Code...</div>
                        </div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-lg"
                        >
                            {/* Status Badge */}
                            <div className="flex justify-center mb-8">
                                <div className={`px-6 py-2 rounded-full border-2 font-bold flex items-center gap-2 ${result.type === 'COLD_START' ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-orange-900/30 border-orange-500 text-orange-400'}`}>
                                    {result.type === 'COLD_START' ? <Snowflake className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                                    {result.type} ({result.latency}ms)
                                </div>
                            </div>

                            <div className="bg-black/50 p-6 rounded-2xl border border-white/10 mb-4">
                                <div className="text-[10px] uppercase text-zinc-500 mb-2">Generated Logic</div>
                                <pre className="text-xs text-green-400 whitespace-pre-wrap">{result.code}</pre>
                            </div>

                            <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30">
                                <div className="text-[10px] uppercase text-purple-300 mb-2">Return Value</div>
                                <div className="text-lg font-bold text-white break-all">{result.result}</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
