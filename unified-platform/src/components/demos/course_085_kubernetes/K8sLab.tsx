'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    RefreshCw,
    X,
    Activity
} from 'lucide-react';
import { fetchPods, terminatePod, Pod } from '@/actions/course_085_kubernetes/k8s_backend';

export function K8sLab() {
    const [pods, setPods] = useState<Pod[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const fresh = await fetchPods();
            setPods(fresh);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id: string) => {
        await terminatePod(id);
        // Instant optimistic update for UI feedback
        setPods(prev => prev.map(p => p.id === id ? { ...p, status: 'Terminating' } : p));
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                    <Box className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Agent ReplicaSet</h3>
                    <p className="text-zinc-500 text-sm">Desired State: 4 Replicas | Current: {pods.filter(p => p.status === 'Running').length}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Activity className="w-4 h-4 animate-pulse text-green-500" /> Auto-Healing
                </div>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                    <AnimatePresence>
                        {pods.map(pod => (
                            <motion.div
                                key={pod.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, backgroundColor: '#ef4444' }}
                                className={`
                                    relative rounded-2xl p-6 flex flex-col justify-between border-2 transition-colors
                                    ${pod.status === 'Running' ? 'bg-white dark:bg-zinc-800 border-green-500' : ''}
                                    ${pod.status === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' : ''}
                                    ${pod.status === 'Terminating' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 opacity-50' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`w-3 h-3 rounded-full ${pod.status === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                    <button
                                        onClick={() => handleDelete(pod.id)}
                                        disabled={pod.status !== 'Running'}
                                        className="text-zinc-400 hover:text-red-500 disabled:opacity-0 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="text-center my-4">
                                    <Box className="w-12 h-12 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                                    <div className="font-mono font-bold text-sm truncate">{pod.name}</div>
                                    <div className="font-bold text-xs uppercase mt-1" style={{ color: pod.status === 'Running' ? '#10b981' : '#f59e0b' }}>
                                        {pod.status}
                                    </div>
                                </div>

                                <div className="text-xs text-zinc-500 font-mono text-center">
                                    Age: {pod.age}s
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
