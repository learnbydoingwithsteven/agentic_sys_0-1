'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Cpu,
    Zap,
    Brain,
    Database,
    Eye,
    Infinity as InfinityIcon
} from 'lucide-react';
import { runAgiLoop, AgiStep } from '@/actions/course_100_agi_prototype/agi_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function AgiLab() {
    const [objective, setObjective] = useState("Solve World Hunger");
    const [steps, setSteps] = useState<AgiStep[]>([]);
    const [activePhase, setActivePhase] = useState<string | null>(null);
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

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel || running) return;

        setRunning(true);
        setSteps([]);

        // In a real streaming architecture, we'd get these one by one.
        // Here we fetch all then replay them for the visual demo.
        const plan = await runAgiLoop(objective, selectedModel);

        for (const step of plan) {
            setActivePhase(step.phase);
            // Variable delay to simulate "thinking" vs "doing"
            const delay = step.phase === 'EXECUTE' ? 800 : 1200;
            await new Promise(r => setTimeout(r, delay));
            setSteps(prev => [...prev, step]);
        }

        setActivePhase(null);
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* The Eye (Omni-Modal Interface) */}
            <div className="flex flex-col items-center justify-center p-8 bg-black rounded-3xl relative overflow-hidden shadow-2xl border border-zinc-800 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50" />

                {/* Animated Core */}
                <motion.div
                    animate={{
                        scale: activePhase ? [1, 1.2, 1] : 1,
                        rotate: activePhase ? [0, 180, 360] : 0
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="relative z-10 w-24 h-24 rounded-full bg-indigo-600 blur-2xl opacity-40"
                />

                <motion.div
                    className="relative z-20 w-32 h-32 rounded-full border-2 border-indigo-500/50 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                >
                    {running ? (
                        <InfinityIcon className={`w-12 h-12 text-indigo-300 animate-pulse`} />
                    ) : (
                        <Eye className="w-12 h-12 text-indigo-300" />
                    )}
                </motion.div>

                {/* Input Field */}
                <div className="mt-8 relative z-20 w-full max-w-lg">
                    <form onSubmit={handleStart} className="flex gap-2">
                        <input
                            value={objective}
                            onChange={e => setObjective(e.target.value)}
                            placeholder="Enter a Grand Objective..."
                            className="flex-1 bg-zinc-900/80 border border-zinc-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500 backdrop-blur"
                        />
                        <button
                            type="submit"
                            disabled={running || !selectedModel}
                            className="bg-white hover:bg-zinc-200 text-black font-bold px-6 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {running ? 'Running' : 'Initialize'}
                        </button>
                    </form>
                    <div className="text-center mt-2 text-[10px] text-zinc-500 font-mono">
                        Model: {selectedModel || 'Loading...'}
                    </div>
                </div>
            </div>

            {/* Cognitive Pipeline Visualization */}
            <div className="flex-1 grid grid-cols-4 gap-4 px-0 min-h-0">
                {['UNDERSTAND', 'PLAN', 'EXECUTE', 'LEARN'].map((phase, i) => {
                    const isActive = activePhase === phase;
                    const phaseSteps = steps.filter(s => s.phase === phase);

                    let Icon = Brain;
                    let color = "text-indigo-500";
                    let bgActive = "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500";

                    if (phase === 'PLAN') { Icon = Database; color = "text-purple-500"; bgActive = "bg-purple-50 dark:bg-purple-900/20 border-purple-500"; }
                    if (phase === 'EXECUTE') { Icon = Zap; color = "text-amber-500"; bgActive = "bg-amber-50 dark:bg-amber-900/20 border-amber-500"; }
                    if (phase === 'LEARN') { Icon = Cpu; color = "text-emerald-500"; bgActive = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"; }

                    return (
                        <div
                            key={phase}
                            className={`
                                rounded-2xl border-2 p-4 flex flex-col transition-all duration-500 overflow-hidden
                                ${isActive ? bgActive + ' shadow-lg scale-[1.02]' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60'}
                            `}
                        >
                            <div className={`font-bold text-xs tracking-widest mb-3 flex items-center gap-2 ${isActive ? color : 'text-zinc-500'}`}>
                                <Icon className={`w-4 h-4`} />
                                {phase}
                            </div>

                            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                                {phaseSteps.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[11px] leading-relaxed p-2 bg-black/5 dark:bg-white/5 rounded-lg text-zinc-700 dark:text-zinc-300 font-medium"
                                    >
                                        {item.message}
                                    </motion.div>
                                ))}
                                {isActive && (
                                    <div className="flex gap-1 mt-2">
                                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${color.replace('text', 'bg')}`} style={{ animationDelay: '0ms' }} />
                                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${color.replace('text', 'bg')}`} style={{ animationDelay: '150ms' }} />
                                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${color.replace('text', 'bg')}`} style={{ animationDelay: '300ms' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
