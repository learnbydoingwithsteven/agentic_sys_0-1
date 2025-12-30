'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Cpu,
    Zap,
    Brain,
    Database,
    Eye
} from 'lucide-react';
import { runAgiLoop, AgiStep } from '@/actions/course_100_agi_prototype/agi_backend';

export function AgiLab() {
    const [objective, setObjective] = useState("");
    const [steps, setSteps] = useState<AgiStep[]>([]);
    const [activePhase, setActivePhase] = useState<string | null>(null);

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setSteps([]);
        const plan = await runAgiLoop(objective);

        for (const step of plan) {
            setActivePhase(step.phase);
            await new Promise(r => setTimeout(r, 1500));
            setSteps(prev => [...prev, step]);
        }
        setActivePhase(null);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* The Eye */}
            <div className="flex flex-col items-center justify-center p-8 bg-black rounded-3xl relative overflow-hidden shadow-2xl border border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50" />

                <motion.div
                    animate={{ scale: activePhase ? [1, 1.1, 1] : 1, rotate: activePhase ? [0, 180, 360] : 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10 w-24 h-24 rounded-full bg-indigo-600 blur-xl opacity-50"
                />
                <motion.div
                    className="relative z-20 w-32 h-32 rounded-full border-2 border-indigo-400 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <Eye className={`w-12 h-12 text-indigo-300 ${activePhase ? 'animate-pulse' : ''}`} />
                </motion.div>

                <div className="mt-8 relative z-20 w-full max-w-lg">
                    <form onSubmit={handleStart} className="flex gap-2">
                        <input
                            value={objective}
                            onChange={e => setObjective(e.target.value)}
                            placeholder="Enter any objective (e.g. 'Solve World Hunger', 'Make a game')"
                            className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-white text-black font-bold px-6 rounded-xl hover:bg-zinc-200"
                        >
                            Initialize
                        </button>
                    </form>
                </div>
            </div>

            {/* Cognitive Pipeline */}
            <div className="flex-1 grid grid-cols-4 gap-4 px-4">
                {['UNDERSTAND', 'PLAN', 'EXECUTE', 'LEARN'].map((phase, i) => {
                    const isActive = activePhase === phase;
                    const items = steps.filter(s => s.phase === phase);

                    let Icon = Brain;
                    if (phase === 'PLAN') Icon = Database;
                    if (phase === 'EXECUTE') Icon = Zap;
                    if (phase === 'LEARN') Icon = Cpu;

                    return (
                        <div key={phase} className={`rounded-xl border-2 p-4 flex flex-col transition-colors ${isActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                            <div className="font-bold text-xs text-zinc-500 tracking-widest mb-4 flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : ''}`} />
                                {phase}
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] leading-tight p-2 bg-black/5 rounded text-zinc-600 dark:text-zinc-400"
                                    >
                                        {item.message}
                                    </motion.div>
                                ))}
                                {isActive && <div className="animate-pulse w-2 h-4 bg-indigo-500/50" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
