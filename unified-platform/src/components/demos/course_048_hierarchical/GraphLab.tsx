'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitGraph,
    Play,
    CheckCircle,
    CircleDashed,
    User
} from 'lucide-react';
import { runHierarchicalAgent, GraphState, GraphNode } from '@/actions/course_048_hierarchical/graph_backend';

export function GraphLab() {
    const [task, setTask] = useState("");
    const [currentState, setCurrentState] = useState<GraphState | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (t: string = task) => {
        if (!t.trim() || isProcessing) return;
        setIsProcessing(true);

        try {
            const history = await runHierarchicalAgent(t);
            // Replay
            for (const state of history) {
                setCurrentState(state);
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const Node = ({ node }: { node: GraphNode }) => (
        <motion.div
            layout
            className={`
                w-32 h-20 rounded-xl border-2 flex flex-col items-center justify-center relative z-10 transition-colors
                ${node.status === 'active' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg scale-110' : ''}
                ${node.status === 'completed' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' : ''}
                ${node.status === 'idle' ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500' : ''}
            `}
        >
            <div className="text-xs uppercase font-bold tracking-wider mb-1 opacity-70">Node</div>
            <div className="font-bold text-sm">{node.label}</div>

            {node.status === 'active' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
            )}
        </motion.div>
    );

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    placeholder="Task e.g. 'Write a blog about AI'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={() => handleRun()}
                    disabled={isProcessing || !task}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    <Play className="w-4 h-4" />
                </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex flex-col">

                {/* Graph Area */}
                <div className="flex-1 relative flex items-center justify-center">
                    {currentState ? (
                        <div className="relative w-full h-full p-12 flex flex-col items-center justify-between">
                            {/* Supervisor (Top) */}
                            <Node node={currentState.nodes.find(n => n.id === 'supervisor')!} />

                            {/* Middle Layer */}
                            <div className="flex gap-24 mt-12 mb-12">
                                <Node node={currentState.nodes.find(n => n.id === 'researcher')!} />
                                <Node node={currentState.nodes.find(n => n.id === 'writer')!} />
                                <Node node={currentState.nodes.find(n => n.id === 'editor')!} />
                            </div>

                            {/* Lines (Hardcoded for demo layout) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                {/* S -> R */}
                                <line x1="50%" y1="120" x2="35%" y2="50%" stroke={currentState.edges[0].active ? "#4f46e5" : "#e4e4e7"} strokeWidth="2" strokeDasharray={currentState.edges[0].active ? "5,5" : ""} />
                                {/* R -> W */}
                                <line x1="35%" y1="50%" x2="50%" y2="50%" stroke={currentState.edges[1].active ? "#4f46e5" : "#e4e4e7"} strokeWidth="2" />
                                {/* W -> E */}
                                <line x1="50%" y1="50%" x2="65%" y2="50%" stroke={currentState.edges[2].active ? "#4f46e5" : "#e4e4e7"} strokeWidth="2" />
                                {/* E -> S */}
                                <line x1="65%" y1="50%" x2="50%" y2="120" stroke={currentState.edges[3].active ? "#4f46e5" : "#e4e4e7"} strokeWidth="2" />
                            </svg>

                        </div>
                    ) : (
                        <div className="text-zinc-300 flex flex-col items-center">
                            <GitGraph className="w-16 h-16 mb-4" />
                            <p>Waiting for State Machine...</p>
                        </div>
                    )}
                </div>

                {/* Log Terminal */}
                <div className="h-48 bg-zinc-900 border-t border-zinc-800 p-6 font-mono text-sm overflow-y-auto">
                    <div className="text-zinc-500 mb-2 uppercase text-xs font-bold tracking-widest">System Logs</div>
                    <div className="space-y-1">
                        {currentState?.logs.map((log, i) => (
                            <div key={i} className="text-green-400">
                                <span className="text-zinc-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
