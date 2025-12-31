'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    ChevronRight,
    ChevronDown,
    ListTree,
    Cpu,
    Loader2
} from 'lucide-react';
import { decomposeGoal, GoalNode } from '@/actions/course_050_goal_oriented/goal_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function GoalLab() {
    const [goalInput, setGoalInput] = useState("Start a successful AI consulting business");
    const [rootGoal, setRootGoal] = useState<GoalNode | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!goalInput || !selectedModel) return;
        setIsProcessing(true);
        setRootGoal(null);
        try {
            const res = await decomposeGoal(goalInput, selectedModel);
            setRootGoal(res);
        } finally {
            setIsProcessing(false);
        }
    };

    const GoalItem = ({ node, depth = 0 }: { node: GoalNode; depth?: number }) => {
        const [isOpen, setIsOpen] = useState(true);
        const hasChildren = node.subGoals.length > 0;

        // Color intensity based on depth
        const depthColors = [
            'text-rose-600 dark:text-rose-400',
            'text-orange-600 dark:text-orange-400',
            'text-amber-600 dark:text-amber-400',
        ];
        const colorClass = depthColors[Math.min(depth, depthColors.length - 1)];

        return (
            <div className="ml-6">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: depth * 0.1 }}
                    className="flex items-center gap-2 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-2 group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                    <Target className={`w-4 h-4 ${colorClass}`} />
                    <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                        {node.description}
                    </span>
                    {depth === 0 && (
                        <span className="ml-auto text-xs text-zinc-400 font-bold">ROOT</span>
                    )}
                </motion.div>
                <AnimatePresence>
                    {isOpen && hasChildren && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 pl-2"
                        >
                            {node.subGoals.map(child => <GoalItem key={child.id} node={child} depth={depth + 1} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    placeholder="High-level Goal e.g. 'Start a Technology Company'"
                    className="flex-1 bg-transparent px-4 border-none outline-none text-zinc-900 dark:text-zinc-100"
                    disabled={isProcessing}
                />

                {/* Model Selector */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                        disabled={isProcessing}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleRun}
                    disabled={isProcessing || !goalInput || !selectedModel}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessing ? 'Decomposing...' : 'Analyze Goal'}
                </button>
            </div>

            {/* Tree */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar shadow-inner">
                {isProcessing ? (
                    <div className="text-center text-zinc-400 mt-20">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-rose-500" />
                        <p className="font-bold">Recursively decomposing goal...</p>
                        <p className="text-sm mt-2">This may take 10-15 seconds as the LLM breaks down each sub-goal</p>
                    </div>
                ) : rootGoal ? (
                    <div className="-ml-6">
                        <GoalItem node={rootGoal} depth={0} />
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 mt-20 opacity-50">
                        <ListTree className="w-16 h-16 mx-auto mb-2" />
                        <p>No goal hierarchy generated.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
