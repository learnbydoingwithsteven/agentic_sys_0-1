'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Network,
    CheckCircle,
    Loader2,
    CircleDashed,
    Play,
    GitMerge
} from 'lucide-react';
import { recursiveDecomposition, AgentTask } from '@/actions/course_099_recursive_autonomy/recursion_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function RecursionLab() {
    const [goal, setGoal] = useState("Launch a new Startup");
    const [tree, setTree] = useState<AgentTask | null>(null);
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

    const handleRun = async () => {
        if (!selectedModel) return;
        setRunning(true);
        setTree(null);

        // Visualize the Agent "Thinking" recursively
        const res = await recursiveDecomposition(goal, selectedModel);

        setTree(res);
        setRunning(false);
    };

    const renderNode = (node: AgentTask, depth = 0) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: depth * 0.15 }}
            className={`
                relative pl-8 border-l-2 ml-4 my-3
                ${node.status === 'COMPLETED' ? 'border-green-300 dark:border-green-900' : 'border-zinc-300 dark:border-zinc-700'}
            `}
        >
            {/* Connecting Line */}
            <div className={`absolute top-4 left-0 w-8 h-0.5 ${node.status === 'COMPLETED' ? 'bg-green-300 dark:bg-green-900' : 'bg-zinc-300 dark:bg-zinc-700'}`} />

            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-fit min-w-[300px]">
                {node.status === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {node.status === 'RUNNING' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                {node.status === 'PENDING' && <CircleDashed className="w-4 h-4 text-zinc-400" />}

                <span className={`text-sm font-medium ${node.status === 'COMPLETED' ? 'text-zinc-500 line-through' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {node.description}
                </span>

                {node.status === 'RUNNING' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold ml-auto">PLANNING</span>}
                {depth === 0 && <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold ml-auto">ROOT</span>}
            </div>

            {node.subtasks && node.subtasks.map(child => (
                <div key={child.id}>{renderNode(child, depth + 1)}</div>
            ))}
        </motion.div>
    );

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <GitMerge className="w-5 h-5 text-purple-500" />
                        Recursive Goal Decomposition
                    </h3>
                    <p className="text-zinc-500 text-sm">Autonomous agent recursively breaking down complex goals.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Input */}
            <div className="flex gap-4">
                <input
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Enter a complex goal (e.g. 'Build a Mars Colony')"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-purple-500"
                />
                <button
                    onClick={handleRun}
                    disabled={running || !selectedModel}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Decompose Goal
                </button>
            </div>

            {/* Tree Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar relative">
                {running && !tree && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 z-10 backdrop-blur-sm">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                        <div className="text-purple-600 font-bold animate-pulse">Recursive Planning in Progress...</div>
                    </div>
                )}

                <AnimatePresence>
                    {tree && renderNode(tree)}
                </AnimatePresence>

                {!tree && !running && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                        <Network className="w-24 h-24 mb-6 opacity-10" />
                        <p className="text-sm uppercase tracking-widest font-bold opacity-50">Waiting for Objective</p>
                    </div>
                )}
            </div>
        </div>
    );
}
