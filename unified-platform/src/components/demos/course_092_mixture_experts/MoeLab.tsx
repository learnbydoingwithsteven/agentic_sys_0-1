'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch,
    Code,
    Calculator,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import { processMoeRequest, MoeLog } from '@/actions/course_092_mixture_experts/moe_backend';

export function MoeLab() {
    const [query, setQuery] = useState("");
    const [log, setLog] = useState<MoeLog | null>(null);
    const [animating, setAnimating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAnimating(true);
        setLog(null);

        const res = await processMoeRequest(query);

        // Sim Routing delay
        await new Promise(r => setTimeout(r, 600));
        setLog(res);
        setAnimating(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl mx-auto w-full">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. 'Write a python function' or 'Calculate 5*5'"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                />
                <button
                    type="submit"
                    disabled={animating || !query}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold disabled:opacity-50"
                >
                    Route
                </button>
            </form>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 relative flex flex-col justify-center items-center">

                {/* Router Gate */}
                <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-full border-4 border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-lg z-20 relative">
                    <GitBranch className={`w-8 h-8 ${animating ? 'animate-pulse text-indigo-500' : 'text-zinc-400'}`} />
                    <div className="text-[10px] font-bold uppercase mt-1 text-zinc-500">Router</div>
                </div>

                {/* Experts */}
                <div className="flex justify-between w-full max-w-3xl mt-24 relative z-10">
                    <ExpertBucket
                        icon={<Code />}
                        label="CODE"
                        active={log?.selectedExpert === 'CODE'}
                        color="text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    />
                    <ExpertBucket
                        icon={<MessageSquare />}
                        label="GENERAL"
                        active={log?.selectedExpert === 'GENERAL'}
                        color="text-zinc-500 border-zinc-500 bg-zinc-50 dark:bg-zinc-800"
                    />
                    <ExpertBucket
                        icon={<Calculator />}
                        label="MATH"
                        active={log?.selectedExpert === 'MATH'}
                        color="text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    />
                </div>

                {/* Routing Lines */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full stroke-zinc-300 dark:stroke-zinc-700 stroke-2">
                    <line x1="50%" y1="calc(50% - 40px)" x2="20%" y2="calc(50% + 100px)" />
                    <line x1="50%" y1="calc(50% - 40px)" x2="50%" y2="calc(50% + 100px)" />
                    <line x1="50%" y1="calc(50% - 40px)" x2="80%" y2="calc(50% + 100px)" />
                </svg>

                {/* Active Ball Animation */}
                {log && !animating && (
                    <motion.div
                        initial={{ top: '50%', left: '50%', scale: 0 }}
                        animate={{
                            top: 'calc(50% + 130px)',
                            left: log.selectedExpert === 'CODE' ? '20%' : log.selectedExpert === 'MATH' ? '80%' : '50%',
                            scale: 1
                        }}
                        className="absolute w-4 h-4 bg-indigo-600 rounded-full z-30 shadow-xl"
                    />
                )}
            </div>
        </div>
    );
}

function ExpertBucket({ icon, label, active, color }: { icon: React.ReactNode, label: string, active: boolean, color: string }) {
    return (
        <motion.div
            animate={{ scale: active ? 1.1 : 1 }}
            className={`w-32 h-32 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${active ? color + ' shadow-xl' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-50'}`}
        >
            <div className={`w-8 h-8 mb-2 ${active ? 'opacity-100' : 'opacity-50'}`}>{icon}</div>
            <div className="font-bold text-sm">{label}</div>
            {active && <div className="text-[10px] font-mono mt-1">ACTIVE</div>}
        </motion.div>
    );
}
