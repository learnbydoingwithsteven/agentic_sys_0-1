'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch,
    Code,
    Calculator,
    MessageSquare,
    Zap
} from 'lucide-react';
import { processMoeRequest, MoeLog } from '@/actions/course_092_mixture_experts/moe_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MoeLab() {
    const [query, setQuery] = useState("Write a Python function to sort a list");
    const [log, setLog] = useState<MoeLog | null>(null);
    const [animating, setAnimating] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel || !query) return;

        setAnimating(true);
        setLog(null);

        const res = await processMoeRequest(query, selectedModel);

        await new Promise(r => setTimeout(r, 800));
        setLog(res);
        setAnimating(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-indigo-500" />
                        Mixture of Experts Router
                    </h3>
                    <p className="text-zinc-500 text-sm">Routes queries to specialized expert agents dynamically.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. 'Calculate 15 * 23' or 'Explain quantum physics'"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                />
                <button
                    type="submit"
                    disabled={animating || !query || !selectedModel}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    {animating ? 'Routing...' : 'Route'}
                </button>
            </form>

            {/* Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 relative flex flex-col justify-center items-center overflow-hidden">

                {/* Router Node */}
                <div className="w-28 h-28 bg-white dark:bg-zinc-800 rounded-full border-4 border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-xl z-20 relative">
                    <GitBranch className={`w-10 h-10 ${animating ? 'animate-pulse text-indigo-500' : 'text-zinc-400'}`} />
                    <div className="text-[10px] font-bold uppercase mt-1 text-zinc-500">Router</div>
                </div>

                {/* Expert Nodes */}
                <div className="flex justify-between w-full max-w-4xl mt-32 relative z-10 gap-8">
                    <ExpertBucket
                        icon={<Code />}
                        label="CODE EXPERT"
                        active={log?.selectedExpert === 'CODE'}
                        color="text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    />
                    <ExpertBucket
                        icon={<MessageSquare />}
                        label="GENERAL EXPERT"
                        active={log?.selectedExpert === 'GENERAL'}
                        color="text-zinc-500 border-zinc-500 bg-zinc-50 dark:bg-zinc-800"
                    />
                    <ExpertBucket
                        icon={<Calculator />}
                        label="MATH EXPERT"
                        active={log?.selectedExpert === 'MATH'}
                        color="text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    />
                </div>

                {/* Routing Lines */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full stroke-zinc-300 dark:stroke-zinc-700 stroke-2">
                    <line x1="50%" y1="calc(50% - 50px)" x2="25%" y2="calc(50% + 120px)" />
                    <line x1="50%" y1="calc(50% - 50px)" x2="50%" y2="calc(50% + 120px)" />
                    <line x1="50%" y1="calc(50% - 50px)" x2="75%" y2="calc(50% + 120px)" />
                </svg>

                {/* Routing Ball Animation */}
                {log && !animating && (
                    <motion.div
                        initial={{ top: '50%', left: '50%', scale: 0 }}
                        animate={{
                            top: 'calc(50% + 150px)',
                            left: log.selectedExpert === 'CODE' ? '25%' : log.selectedExpert === 'MATH' ? '75%' : '50%',
                            scale: 1
                        }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="absolute w-5 h-5 bg-indigo-600 rounded-full z-30 shadow-2xl"
                    />
                )}

                {/* Result Panel */}
                {log && !animating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-8 left-8 right-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-xs font-bold uppercase text-zinc-400">Expert Response</div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-indigo-500" />
                                <span className="text-xs text-zinc-500">Confidence: {Math.round(log.confidence * 100)}%</span>
                            </div>
                        </div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">{log.response}</div>
                        <div className="text-xs text-zinc-400 italic">Routing: "{log.reasoning}"</div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ExpertBucket({ icon, label, active, color }: { icon: React.ReactNode, label: string, active: boolean, color: string }) {
    return (
        <motion.div
            animate={{ scale: active ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`flex-1 max-w-[180px] aspect-square rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${active ? color + ' shadow-2xl ring-4 ring-offset-2 ring-indigo-200 dark:ring-indigo-900' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-40'}`}
        >
            <div className={`w-10 h-10 mb-3 ${active ? 'opacity-100' : 'opacity-50'}`}>{icon}</div>
            <div className="font-bold text-xs text-center px-2">{label}</div>
            {active && <div className="text-[10px] font-mono mt-2 text-indigo-600 dark:text-indigo-400 animate-pulse">● ACTIVE</div>}
        </motion.div>
    );
}
