'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Play,
    Pause,
    Cookie
} from 'lucide-react';
import { tickSwarm, SwarmAgent } from '@/actions/course_098_agent_swarms/swarm_backend';

export function SwarmLab() {
    const [agents, setAgents] = useState<SwarmAgent[]>(
        Array.from({ length: 5 }).map((_, i) => ({ id: String(i), x: 0, y: 0, energy: 100, hasFood: false }))
    );
    const [running, setRunning] = useState(false);
    const [foodPos, setFoodPos] = useState<[number, number]>([8, 8]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running) {
            interval = setInterval(async () => {
                const newAgents = await tickSwarm(agents, foodPos);
                setAgents(newAgents);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [running, agents, foodPos]);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Swarm Intelligence
                    </h3>
                    <p className="text-zinc-500 text-sm">Emergent behavior from simple rules.</p>
                </div>
                <button
                    onClick={() => setRunning(!running)}
                    className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${running ? 'bg-amber-100 text-amber-700' : 'bg-green-600 text-white'}`}
                >
                    {running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    {running ? 'Pause' : 'Start Swarm'}
                </button>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 flex items-center justify-center relative border border-zinc-800 shadow-inner overflow-hidden">

                {/* Grid */}
                <div className="relative w-[400px] h-[400px] bg-zinc-800/50 rounded-lg grid grid-cols-10 grid-rows-10 gap-px border border-zinc-700">
                    {/* Home Base */}
                    <div className="absolute top-0 left-0 w-[10%] h-[10%] bg-blue-500/30 border-2 border-blue-500 rounded-sm z-0 flex items-center justify-center text-[8px] text-blue-200 font-bold">BASE</div>

                    {/* Food */}
                    <div
                        className="absolute w-[10%] h-[10%] bg-amber-500/30 border-2 border-amber-500 rounded-full z-0 flex items-center justify-center"
                        style={{ left: `${foodPos[0] * 10}%`, top: `${foodPos[1] * 10}%` }}
                    >
                        <Cookie className="w-4 h-4 text-amber-500" />
                    </div>

                    {/* Agents */}
                    {agents.map(agent => (
                        <motion.div
                            key={agent.id}
                            initial={false}
                            animate={{
                                left: `${agent.x * 10}%`,
                                top: `${agent.y * 10}%`
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute w-[10%] h-[10%] p-1 z-10 pointer-events-none"
                        >
                            <div className={`w-full h-full rounded-full flex items-center justify-center text-[8px] font-bold shadow-lg
                                ${agent.hasFood ? 'bg-green-500 text-white scan-line' : 'bg-white text-zinc-900'}
                             `}>
                                {agent.id}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
