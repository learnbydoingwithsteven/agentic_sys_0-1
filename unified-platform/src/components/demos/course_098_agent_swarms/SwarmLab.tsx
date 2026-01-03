'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Play,
    Pause,
    Cookie,
    Radio
} from 'lucide-react';
import { tickSwarm, updateHiveStrategy, SwarmAgent } from '@/actions/course_098_agent_swarms/swarm_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function SwarmLab() {
    const [agents, setAgents] = useState<SwarmAgent[]>(
        Array.from({ length: 6 }).map((_, i) => ({ id: String(i), x: 0, y: 0, hasFood: false, role: 'WORKER' }))
    );
    const [running, setRunning] = useState(false);
    const [strategy, setStrategy] = useState("Initializing...");
    const [foodPos, setFoodPos] = useState<[number, number]>([8, 8]);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    // Tick Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running) {
            interval = setInterval(async () => {
                setAgents(prev => {
                    // We can't use async inside set state easily without chaos, so we do it outside.
                    // But effectively we need a way to move them.
                    // For demo, we invoke action.
                    return prev;
                });

                // Actual tick call
                const newAgents = await tickSwarm(agents, foodPos);
                setAgents(newAgents);
            }, 600);
        }
        return () => clearInterval(interval);
    }, [running, agents, foodPos]);

    // Hive Mind Strategy Loop (Every 5 seconds)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running && selectedModel) {
            interval = setInterval(async () => {
                const strat = await updateHiveStrategy(agents, selectedModel);
                setStrategy(strat);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [running, agents, selectedModel]);

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Hive Mind Swarm
                    </h3>
                    <p className="text-zinc-500 text-sm">Emergent behavior guided by High-Level LLM Strategy.</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-500">
                        <Radio className="w-4 h-4 animate-pulse" /> Hive Strategy
                    </div>
                    <div className="font-mono text-sm dark:text-zinc-300 max-w-md truncate">{strategy}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Model: {selectedModel}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
                <button
                    onClick={() => setRunning(!running)}
                    disabled={!selectedModel}
                    className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 ${running ? 'bg-amber-100 ring-2 ring-amber-500 text-amber-700' : 'bg-indigo-600 text-white'}`}
                >
                    {running ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    {running ? 'Pause Swarm' : 'Start Simulation'}
                </button>
            </div>

            {/* Swarm Grid */}
            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 flex items-center justify-center relative border border-zinc-800 shadow-inner overflow-hidden">
                <div className="relative w-[400px] h-[400px] bg-zinc-800/50 rounded-lg grid grid-cols-10 grid-rows-10 gap-px border border-zinc-700 shadow-2xl">
                    {/* Home Base */}
                    <div className="absolute top-0 left-0 w-[10%] h-[10%] bg-blue-500/20 border-2 border-blue-500 rounded-sm z-0 flex items-center justify-center text-[8px] text-blue-300 font-bold tracking-tighter">BASE</div>

                    {/* Food */}
                    <motion.div
                        className="absolute w-[10%] h-[10%] z-0 flex items-center justify-center"
                        animate={{ left: `${foodPos[0] * 10}%`, top: `${foodPos[1] * 10}%` }}
                    >
                        <div className="w-full h-full bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center">
                            <Cookie className="w-4 h-4 text-amber-500" />
                        </div>
                    </motion.div>

                    {/* Agents */}
                    {agents.map(agent => (
                        <motion.div
                            key={agent.id}
                            initial={false}
                            animate={{
                                left: `${agent.x * 10}%`,
                                top: `${agent.y * 10}%`
                            }}
                            transition={{ type: "tween", duration: 0.5, ease: "linear" }}
                            className="absolute w-[10%] h-[10%] p-1 z-10 pointer-events-none"
                        >
                            <div className={`w-full h-full rounded-full flex items-center justify-center text-[8px] font-bold shadow-lg transition-colors duration-300
                                ${agent.hasFood ? 'bg-green-500 text-black ring-2 ring-green-300' : 'bg-white text-zinc-900'}
                             `}>
                                {agent.id}
                            </div>
                        </motion.div>
                    ))}

                    {/* Strategic Overlay (Visual flair based on strategy) */}
                    {strategy.includes("EXPLORE") && (
                        <div className="absolute inset-0 border-4 border-dashed border-yellow-500/20 pointer-events-none animate-pulse rounded-lg" />
                    )}
                    {strategy.includes("RUSH") && (
                        <div className="absolute inset-0 border-4 border-red-500/20 pointer-events-none animate-pulse rounded-lg" />
                    )}
                </div>
            </div>
        </div>
    );
}
