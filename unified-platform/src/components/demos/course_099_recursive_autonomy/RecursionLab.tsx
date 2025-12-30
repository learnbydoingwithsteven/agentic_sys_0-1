'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Network,
    CheckCircle,
    Loader2,
    CircleDashed,
    Play
} from 'lucide-react';
import { startRecursiveLoop, AgentTask } from '@/actions/course_099_recursive_autonomy/recursion_backend';

export function RecursionLab() {
    const [goal, setGoal] = useState("Plan a Vacation to Japan");
    const [tree, setTree] = useState<AgentTask | null>(null);
    const [running, setRunning] = useState(false);

    const handleRun = async () => {
        setRunning(true);
        setTree(null);
        await new Promise(r => setTimeout(r, 1000)); // Thinking delay
        const res = await startRecursiveLoop(goal);
        setTree(res);
        setRunning(false);
    };

    const renderNode = (node: AgentTask, depth = 0) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: depth * 0.2 }}
            className={`
                relative pl-6 border-l-2 ml-4 my-2
                ${node.status === 'COMPLETED' ? 'border-green-300 dark:border-green-900' : 'border-zinc-300 dark:border-zinc-700'}
            `}
        >
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-fit">
                {node.status === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {node.status === 'RUNNING' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                {node.status === 'PENDING' && <CircleDashed className="w-4 h-4 text-zinc-400" />}

                <span className={`text-sm font-medium ${node.status === 'COMPLETED' ? 'text-zinc-500 line-through' : ''}`}>
                    {node.description}
                </span>

                {node.status === 'RUNNING' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded">ACTIVE AGENT</span>}
            </div>

            {node.subtasks && node.subtasks.map(child => (
                <div key={child.id}>{renderNode(child, depth + 1)}</div>
            ))}
        </motion.div>
    );

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Network className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg">Goal Decomposition Engine</h3>
                    <p className="text-zinc-500 text-sm">Recursive Task Planning</p>
                </div>
                <div className="flex gap-2">
                    <input
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm w-64 outline-none"
                    />
                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Auto-Decompose
                    </button>
                </div>
            </div>

            {/* Tree Canvas */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {tree && renderNode(tree)}
                </AnimatePresence>
                {!tree && !running && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                        <Network className="w-16 h-16 mb-4 opacity-20" />
                        <p>Waiting for Main Objective...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
