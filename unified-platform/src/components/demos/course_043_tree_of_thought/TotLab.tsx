'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitMerge,
    GitBranch,
    Star,
    Check
} from 'lucide-react';
import { runTreeOfThought, TotNode } from '@/actions/course_043_tree_of_thought/tot_backend';

export function TotLab() {
    const [topic, setTopic] = useState("");
    const [tree, setTree] = useState<TotNode | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (t: string = topic) => {
        if (!t.trim() || isProcessing) return;
        setIsProcessing(true);
        setTree(null);

        try {
            const result = await runTreeOfThought(t);
            setTree(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    // Recursive Renderer
    const renderNode = (node: TotNode, level: number = 0) => {
        const isRoot = node.type === 'root';
        const isWinner = node.type === 'winner';

        return (
            <div key={node.id} className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: level * 0.2 }}
                    className={`
                        relative z-10 w-64 p-4 rounded-xl border-2 text-sm text-center shadow-lg backdrop-blur-sm
                        ${isRoot ? 'bg-indigo-600 border-indigo-500 text-white' : ''}
                        ${!isRoot && !isWinner ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' : ''}
                        ${isWinner ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200' : ''}
                    `}
                >
                    {isRoot && <div className="text-xs font-bold opacity-75 mb-1 uppercase tracking-wider">Root Problem</div>}
                    <div className="line-clamp-4">{node.content}</div>

                    {!isRoot && !isWinner && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center font-bold text-xs shadow-md border-2 border-white dark:border-zinc-900">
                            {node.score}
                        </div>
                    )}
                </motion.div>

                {/* Connecting Lines (Simple absolute divs for demo, usually SVG) */}
                {/* For this demo, we use a simple vertical layout for children */}
                {node.children.length > 0 && (
                    <div className="flex justify-center gap-4 mt-8 w-full relative">
                        {/* Recursive Children */}
                        {node.children.map(child => (
                            <div key={child.id} className="relative flex flex-col items-center">
                                {/* Connector Line */}
                                <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-zinc-300 dark:bg-zinc-700 -translate-x-1/2" />
                                {renderNode(child, level + 1)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 h-[800px]">
            {/* Controls */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm z-20">
                <GitBranch className="w-6 h-6 text-indigo-500" />
                <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Enter a story topic e.g. 'A robot discovering flowers'..."
                    className="flex-1 bg-transparent border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={() => handleRun()}
                    disabled={isProcessing || !topic}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {isProcessing ? 'Thinking...' : 'Expand Tree'}
                </button>
            </div>

            {/* Tree Viewport */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-auto custom-scrollbar p-12 flex justify-center items-start">
                {!tree && !isProcessing && (
                    <div className="text-center text-zinc-400 mt-20">
                        <GitMerge className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No tree generated yet.</p>
                    </div>
                )}
                {tree && (
                    <div className="min-w-fit">
                        {renderNode(tree)}
                    </div>
                )}
            </div>
        </div>
    );
}
