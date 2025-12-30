'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    BrainCircuit,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';
import { predictOutcome, Direction } from '@/actions/course_096_world_models/world_model_backend';

const GRID_SIZE = 5;
const WALLS = ['1,1', '1,2', '3,3', '2,3'];

export function WorldModelLab() {
    const [agentPos, setAgentPos] = useState<[number, number]>([0, 0]);
    const [ghostPos, setGhostPos] = useState<[number, number] | null>(null);
    const [status, setStatus] = useState("Idle");

    const handleSimulate = async (dir: Direction) => {
        setStatus(`Simulating move ${dir}...`);
        const res = await predictOutcome(agentPos, dir);

        // Show Ghost
        setGhostPos(res.outcome === 'CRASH' ? agentPos : res.pos); // Crash stays put visually but indicates failure

        if (res.outcome === 'CRASH') setStatus("Prediction: CRASH into Wall.");
        else if (res.outcome === 'WIN') setStatus("Prediction: GOAL reached!");
        else setStatus("Prediction: Safe move.");

        // Clean up ghost after delay
        setTimeout(() => {
            setGhostPos(null);
        }, 1500);
    };

    const handleCommit = (dir: Direction) => {
        // Real move logic (simplified duplicate of backend for UI speed)
        // In real app, we'd use the verified simulation result
        handleSimulate(dir).then(() => {
            // If sim was OK, we move.
            // For this demo, let's just create a separate "Commit" flow if needed, 
            // but to keep it simple, let's assume the user "Dreams" first, then "Acquires" the move.
            // Actually, let's just make the Dream button *also* move the agent if safe after a delay.

            // Re-sim to get value
            predictOutcome(agentPos, dir).then(res => {
                if (res.outcome !== 'CRASH') {
                    setAgentPos(res.pos);
                }
            })
        });
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        Internal World Model
                    </h3>
                    <p className="text-zinc-500 text-sm">Status: <span className="font-mono font-bold text-indigo-600">{status}</span></p>
                </div>
                <div className="flex gap-2">
                    <SimButton icon={<ArrowUp />} onClick={() => handleCommit('UP')} />
                    <SimButton icon={<ArrowLeft />} onClick={() => handleCommit('LEFT')} />
                    <SimButton icon={<ArrowDown />} onClick={() => handleCommit('DOWN')} />
                    <SimButton icon={<ArrowRight />} onClick={() => handleCommit('RIGHT')} />
                </div>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 flex items-center justify-center relative shadow-inner">
                <div className="grid grid-cols-5 gap-2 relative z-10 w-[400px] h-[400px]">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                        const r = Math.floor(i / GRID_SIZE);
                        const c = i % GRID_SIZE;
                        const isWall = WALLS.includes(`${r},${c}`);
                        const isGoal = r === 4 && c === 4;

                        return (
                            <div
                                key={i}
                                className={`
                                    rounded-lg flex items-center justify-center text-xs font-bold
                                    ${isWall ? 'bg-zinc-700' : 'bg-zinc-800'}
                                    ${isGoal ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-500' : ''}
                                `}
                            >
                                {isGoal && 'GOAL'}
                            </div>
                        );
                    })}

                    {/* Agent */}
                    <motion.div
                        initial={false}
                        animate={{
                            left: `${agentPos[1] * 20}%`,
                            top: `${agentPos[0] * 20}%`
                        }}
                        className="absolute w-[20%] h-[20%] p-2 pointer-events-none"
                    >
                        <div className="w-full h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                    </motion.div>

                    {/* Ghost (Prediction) */}
                    {ghostPos && (
                        <motion.div
                            initial={{
                                left: `${agentPos[1] * 20}%`,
                                top: `${agentPos[0] * 20}%`,
                                opacity: 0
                            }}
                            animate={{
                                left: `${ghostPos[1] * 20}%`,
                                top: `${ghostPos[0] * 20}%`,
                                opacity: 0.5
                            }}
                            className="absolute w-[20%] h-[20%] p-2 pointer-events-none z-20"
                        >
                            <div className="w-full h-full bg-white rounded-full border-2 border-dashed border-blue-400" />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SimButton({ icon, onClick }: { icon: any, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-center transition-colors"
        >
            {icon}
        </button>
    );
}
