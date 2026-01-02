'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    Trophy,
    Skull,
    Bot,
    Play,
    Loader2
} from 'lucide-react';
import { initRLGame, stepRLAgent, getAgentAction, GridState } from '@/actions/course_063_rl_agent/rl_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function RLLab() {
    const [state, setState] = useState<GridState | null>(null);
    const [isAuto, setIsAuto] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        initRLGame().then(setState);
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    useEffect(() => {
        if (!isAuto || !state || state.status !== 'playing') return;

        const timer = setTimeout(async () => {
            // Ask LLM for action
            const action = await getAgentAction(state, selectedModel);
            // Execute action in Environment
            const next = await stepRLAgent(state, action);
            setState(next);

            if (next.status !== 'playing') setIsAuto(false);
        }, 800); // 800ms to allow visualization

        return () => clearTimeout(timer);
    }, [state, isAuto, selectedModel]);

    const handleReset = async () => {
        setIsAuto(false);
        setState(await initRLGame());
    };

    if (!state) return <div className="text-zinc-500">Loading Environment...</div>;

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-indigo-500" />
                        Grid World Environment
                    </h3>
                    <p className="text-zinc-500 text-sm">Reward: {state.lastReward} | Steps: {state.steps}</p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
                        disabled={isAuto}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsAuto(!isAuto)}
                        disabled={state.status !== 'playing' || !selectedModel}
                        className={`px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 text-white ${isAuto ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {isAuto ? 'Stop Policy' : 'Run Policy'} <Play className="w-4 h-4 fill-current" />
                    </button>
                    <button onClick={handleReset} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold px-4">
                        Reset
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-2 w-[400px] h-[400px]">
                    {Array.from({ length: 25 }).map((_, i) => {
                        const r = Math.floor(i / 5);
                        const c = i % 5;

                        const isAgent = state.agentPos.r === r && state.agentPos.c === c;
                        const isGoal = state.goalPos.r === r && state.goalPos.c === c;
                        const isTrap = state.trapPos.r === r && state.trapPos.c === c;

                        return (
                            <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative shadow-sm">
                                {isGoal && <Trophy className="w-8 h-8 text-yellow-500" />}
                                {isTrap && <Skull className="w-8 h-8 text-zinc-400" />}

                                {isAgent && (
                                    <motion.div
                                        layoutId="agent"
                                        className="absolute inset-2 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <Bot className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Status Overlay */}
                {state.status !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute px-8 py-4 rounded-2xl shadow-2xl text-2xl font-black uppercase text-white ${state.status === 'won' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        {state.status === 'won' ? 'Goal Reached!' : 'Game Over'}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
