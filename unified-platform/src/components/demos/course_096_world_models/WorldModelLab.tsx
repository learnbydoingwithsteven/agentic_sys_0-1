'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    BrainCircuit,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Map
} from 'lucide-react';
import { predictOutcome, Direction } from '@/actions/course_096_world_models/world_model_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const GRID_SIZE = 5;
const WALLS = ['1,1', '1,2', '3,3', '2,3'];

export function WorldModelLab() {
    const [agentPos, setAgentPos] = useState<[number, number]>([0, 0]);
    const [ghostPos, setGhostPos] = useState<[number, number] | null>(null);
    const [status, setStatus] = useState("Idle. Select a move to simulate.");
    const [simulating, setSimulating] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleAction = async (dir: Direction) => {
        if (!selectedModel || simulating) return;
        setSimulating(true);
        setStatus(`🧠 Neural Simulation: Moving ${dir}...`);

        // 1. Sim Move
        const res = await predictOutcome(agentPos, dir, selectedModel);

        // 2. Viz Prediction (Ghost)
        // If crash, ghost stays at current pos but shows error state
        const predPos = res.outcome === 'CRASH' ? agentPos : res.pos;
        setGhostPos(predPos);

        if (res.outcome === 'CRASH') setStatus(`⛔ Model Predicts: CRASH! (${res.explanation})`);
        else if (res.outcome === 'WIN') setStatus(`🏆 Model Predicts: GOAL! (${res.explanation})`);
        else setStatus(`✅ Model Predicts: Clear. (${res.explanation})`);

        // 3. Commit Move (Agent follows dream if safe-ish, or just follows physics)
        // In this demo, we let the agent "trust" the model and move to the predicted spot if it's not a crash.
        setTimeout(() => {
            if (res.outcome !== 'CRASH') {
                setAgentPos(res.pos);
            }
            setGhostPos(null);
            setSimulating(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        World Model Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Agent "imagines" outcomes before interacting with reality.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-4">
                <div className="font-mono text-sm dark:text-zinc-300 flex-1">
                    {status}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div />
                    <SimButton icon={<ArrowUp />} onClick={() => handleAction('UP')} disabled={simulating} />
                    <div />
                    <SimButton icon={<ArrowLeft />} onClick={() => handleAction('LEFT')} disabled={simulating} />
                    <SimButton icon={<ArrowDown />} onClick={() => handleAction('DOWN')} disabled={simulating} />
                    <SimButton icon={<ArrowRight />} onClick={() => handleAction('RIGHT')} disabled={simulating} />
                </div>
            </div>

            {/* Visualization */}
            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 flex items-center justify-center relative shadow-inner overflow-hidden border border-zinc-800">
                <div className="grid grid-cols-5 gap-2 relative z-10 w-[400px] h-[400px]">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                        const r = Math.floor(i / GRID_SIZE);
                        const c = i % GRID_SIZE;
                        const posStr = `${r},${c}`;
                        const isWall = WALLS.includes(posStr);
                        const isGoal = r === 4 && c === 4;

                        return (
                            <div
                                key={i}
                                className={`
                                    rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                    ${isWall ? 'bg-zinc-700 shadow-inner' : 'bg-zinc-800'}
                                    ${isGoal ? 'bg-emerald-900/30 border-2 border-emerald-500 text-emerald-400' : ''}
                                `}
                            >
                                {isGoal && 'GOAL'}
                            </div>
                        );
                    })}

                    {/* Agent (Reality) */}
                    <motion.div
                        initial={false}
                        animate={{
                            left: `${agentPos[1] * 20}%`,
                            top: `${agentPos[0] * 20}%`
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute w-[20%] h-[20%] p-2 pointer-events-none z-10"
                    >
                        <div className="w-full h-full bg-blue-500 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                    </motion.div>

                    {/* Ghost (Prediction/Imagination) */}
                    <AnimatePresence>
                        {ghostPos && (
                            <motion.div
                                initial={{
                                    left: `${agentPos[1] * 20}%`,
                                    top: `${agentPos[0] * 20}%`,
                                    opacity: 0,
                                    scale: 0.8
                                }}
                                animate={{
                                    left: `${ghostPos[1] * 20}%`,
                                    top: `${ghostPos[0] * 20}%`,
                                    opacity: 0.6,
                                    scale: 1
                                }}
                                exit={{ opacity: 0 }}
                                className="absolute w-[20%] h-[20%] p-2 pointer-events-none z-20"
                            >
                                <div className="w-full h-full bg-indigo-400 rounded-2xl border-2 border-dashed border-white flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-white animate-spin-slow" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {simulating && (
                    <div className="absolute top-4 right-4 bg-zinc-800 text-xs text-zinc-400 px-3 py-1 rounded-full animate-pulse">
                        Simulating Physics...
                    </div>
                )}
            </div>
        </div>
    );
}

function SimButton({ icon, onClick, disabled }: { icon: React.ReactNode, onClick: () => void, disabled: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-12 h-12 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-95 text-zinc-700 dark:text-zinc-200 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-100 shadow-sm"
        >
            {icon}
        </button>
    );
}
