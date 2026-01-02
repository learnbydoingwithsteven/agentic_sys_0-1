'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Activity,
    Server,
    Zap,
    Layers,
    Bot
} from 'lucide-react';
import { manageCluster, ClusterState, Pod } from '@/actions/course_085_kubernetes/k8s_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function K8sLab() {
    const [queue, setQueue] = useState(20);
    const [state, setState] = useState<ClusterState>({ pods: [], queueLength: 20, decision: "Initializing..." });
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const tickRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });

        // Loop
        tickRef.current = setInterval(async () => {
            // We need current queue state, but valid approach in React interval with refs or functional update is complex.
            // Here we'll read queue from a ref if we wanted precise, but let's just pass `queue` cleanly via dependency or separate trigger.
            // Actually, best pattern here is manual trigger or fast refresh.
            // Let's use a "Pulse" approach.
        }, 3000);

        return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }, []);

    // Effect to sync with loop, handling closure staleness by using a separate function or ref-based value
    // Let's just use useInterval pattern or restart interval on queue change.
    useEffect(() => {
        if (!selectedModel) return;
        const tick = async () => {
            const res = await manageCluster(queue, selectedModel);
            setState(res);
        };

        // Run immediately
        tick();

        const id = setInterval(tick, 3000); // 3s Control Loop
        return () => clearInterval(id);
    }, [queue, selectedModel]);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Control Plane */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-500" />
                            Agent Orchestrator
                        </h3>
                        <p className="text-zinc-500 text-sm">LLM monitors Load and Scales Infrastructure.</p>
                    </div>
                    <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">Task Queue Load</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={queue}
                            onChange={(e) => setQueue(parseInt(e.target.value))}
                            className="w-full accent-blue-600 h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-mono mt-2">
                            <span>0 Tasks</span>
                            <span className="font-bold text-blue-600">{queue} Pending</span>
                            <span>100 Tasks</span>
                        </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 w-1/3">
                        <div className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Latest Decision</div>
                        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-2">
                            {state.decision}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cluster View */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                <div className="grid grid-cols-4 gap-4">
                    <AnimatePresence>
                        {state.pods.map(pod => (
                            <motion.div
                                key={pod.id}
                                layout
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, backgroundColor: "#ef4444" }}
                                className={`
                                    relative p-4 rounded-2xl border-2 flex flex-col gap-2
                                    ${pod.status === 'Running' ? 'bg-white dark:bg-zinc-800 border-green-500' : ''}
                                    ${pod.status === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' : ''}
                                    ${pod.status === 'Terminating' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 opacity-50' : ''}
                                `}
                            >
                                <div className="flex justify-between items-center">
                                    <Server className={`w-4 h-4 ${pod.status === 'Running' ? 'text-green-500' : 'text-yellow-500'}`} />
                                    <div className="text-[10px] font-mono opacity-50">{pod.id}</div>
                                </div>
                                <div className="font-bold text-sm truncate">{pod.name}</div>
                                <div className="text-xs uppercase font-bold" style={{ color: pod.status === 'Running' ? '#10b981' : '#f59e0b' }}>
                                    {pod.status}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {state.pods.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                        <Layers className="w-16 h-16 text-zinc-500 mb-2" />
                        <div className="font-bold">Cluster Empty</div>
                    </div>
                )}
            </div>
        </div>
    );
}
