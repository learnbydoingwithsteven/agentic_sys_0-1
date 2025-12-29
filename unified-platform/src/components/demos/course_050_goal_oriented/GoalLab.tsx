'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    ChevronRight,
    ChevronDown,
    ListTree
} from 'lucide-react';
import { decomposeGoal, GoalNode } from '@/actions/course_050_goal_oriented/goal_backend';

export function GoalLab() {
    const [goalInput, setGoalInput] = useState("");
    const [rootGoal, setRootGoal] = useState<GoalNode | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async () => {
        if (!goalInput) return;
        setIsProcessing(true);
        try {
            const res = await decomposeGoal(goalInput);
            setRootGoal(res);
        } finally {
            setIsProcessing(false);
        }
    };

    const GoalItem = ({ node }: { node: GoalNode }) => {
        const [isOpen, setIsOpen] = useState(true);
        const hasChildren = node.subGoals.length > 0;

        return (
            <div className="ml-6">
                <div
                    className="flex items-center gap-2 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                    <Target className="w-4 h-4 text-rose-500" />
                    <span className="font-medium text-sm">{node.description}</span>
                </div>
                <AnimatePresence>
                    {isOpen && hasChildren && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-l border-zinc-200 dark:border-zinc-800 ml-4 pl-2"
                        >
                            {node.subGoals.map(child => <GoalItem key={child.id} node={child} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 h-[600px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    placeholder="High-level Goal e.g. 'Start a Technology Company'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={handleRun}
                    disabled={isProcessing || !goalInput}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Decomposing...' : 'Analyze Goal'}
                </button>
            </div>

            {/* Tree */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar shadow-inner">
                {rootGoal ? (
                    <div className="-ml-6">
                        <GoalItem node={rootGoal} />
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
