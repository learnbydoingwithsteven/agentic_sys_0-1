'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Share2,
    Target,
    Navigation,
    Eye,
    RefreshCw
} from 'lucide-react';
import { runMeshStep, initGrid, GridState } from '@/actions/course_084_distributed/dist_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function DistributedLab() {
    const [grid, setGrid] = useState<GridState | null>(null);
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });

        initGrid().then(setGrid);
    }, []);

    const handleStep = async () => {
        if (!grid || !selectedModel) return;
        setRunning(true);
        const next = await runMeshStep(grid, selectedModel);
        setGrid(next);
        setStep(p => p + 1);
        setRunning(false);
    };

    const isGlobalSuccess = grid?.agents.some(a => a.status === 'FOUND_TARGET');

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-indigo-500" />
                        Distributed Search Mesh
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        Agents explore independently. They <b>Gossip</b> (Sync Maps) when close.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-sm font-mono text-zinc-400">Step: {step}</div>
                    <button
                        onClick={handleStep}
                        disabled={running || isGlobalSuccess || !selectedModel}
                        className={`
                            px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100
                            ${isGlobalSuccess ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                        `}
                    >
                        {isGlobalSuccess ? 'TARGET FOUND!' : running ? 'Moving...' : 'Next Step'}
                        {!isGlobalSuccess && <Navigation className="w-4 h-4 fill-current" />}
                    </button>
                </div>
            </div>

            {/* Grid Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                {!grid ? (
                    <div className="text-zinc-400 animate-pulse">Initializing Mesh...</div>
                ) : (
                    <div
                        className="grid gap-2 relative"
                        style={{
                            gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
                            width: '400px',
                            height: '400px'
                        }}
                    >
                        {/* Cells */}
                        {Array.from({ length: grid.height * grid.width }).map((_, i) => {
                            const x = i % grid.width;
                            const y = Math.floor(i / grid.width);
                            const isTarget = x === grid.targetX && y === grid.targetY;

                            return (
                                <div
                                    key={i}
                                    className={`
                                        rounded-lg border-2 flex items-center justify-center text-xs font-mono transition-colors
                                        ${isGlobalSuccess && isTarget ? 'bg-emerald-500 border-emerald-400 z-10' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}
                                    `}
                                >
                                    {isGlobalSuccess && isTarget && <Target className="w-8 h-8 text-white animate-bounce" />}
                                    <span className="opacity-10">{x},{y}</span>
                                </div>
                            );
                        })}

                        {/* Agents */}
                        <AnimatePresence>
                            {grid.agents.map((agent) => {
                                // Calculate position percentage (assuming 5x5 grid)
                                const stepX = 100 / grid.width;
                                const stepY = 100 / grid.height;
                                const top = agent.y * stepY;
                                const left = agent.x * stepX;

                                return (
                                    <motion.div
                                        key={agent.id}
                                        layout
                                        initial={false}
                                        animate={{ top: `${top}%`, left: `${left}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute w-20 h-20 -ml-0 -mt-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                                        style={{ width: `${stepX}%`, height: `${stepY}%` }}
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2
                                            ${agent.status === 'FOUND_TARGET' ? 'bg-emerald-500 border-emerald-200 text-white' : 'bg-indigo-600 border-white text-white'}
                                        `}>
                                            {agent.status === 'FOUND_TARGET' ? <Target className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                                        </div>
                                        <div className="bg-black/80 text-white text-[10px] px-2 rounded-full mt-1 backdrop-blur-sm">
                                            {agent.id}
                                        </div>

                                        {/* Knowledge Badge */}
                                        <div className="absolute -top-2 -right-2 bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border border-white">
                                            {agent.knownMap.flat().filter(c => c !== '?').length}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
