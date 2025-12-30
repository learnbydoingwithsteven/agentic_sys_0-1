'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server,
    Network,
    ArrowDown
} from 'lucide-react';
import { sendBalancedRequest, getLoadStats, ServerInstance } from '@/actions/course_074_load_balancing/load_bal_backend';

export function LoadBalancingLab() {
    const [stats, setStats] = useState<ServerInstance[]>([
        { id: '1', name: 'Worker-A', load: 0, status: 'idle' },
        { id: '2', name: 'Worker-B', load: 0, status: 'idle' },
        { id: '3', name: 'Worker-C', load: 0, status: 'idle' }
    ]);
    const [strategy, setStrategy] = useState<'ROUND_ROBIN' | 'LEAST_LOAD'>('ROUND_ROBIN');
    const [requests, setRequests] = useState<{ id: number, target: string }[]>([]);

    // Poll stats
    useEffect(() => {
        const interval = setInterval(async () => {
            // In a real app we'd fetch from server, but state is local to file for this demo session
            // so we manually decay locally to sync with UI nicely
            setStats(prev => prev.map(s => ({ ...s, load: Math.max(0, s.load - 2) })));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleRequest = async () => {
        // Optimistic update
        let targetId = stats[0].id;
        if (strategy === 'ROUND_ROBIN') {
            const idx = Math.floor(Date.now() / 100) % 3; // Fast spin
            targetId = stats[idx].id;
        } else {
            const min = Math.min(...stats.map(s => s.load));
            targetId = stats.find(s => s.load === min)?.id || '1';
        }

        const reqId = Date.now();
        setRequests(prev => [...prev, { id: reqId, target: targetId }]);

        // Spike load
        setStats(prev => prev.map(s => s.id === targetId ? { ...s, load: Math.min(100, s.load + 20) } : s));

        // Remove visualization after anim
        setTimeout(() => {
            setRequests(prev => prev.filter(r => r.id !== reqId));
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Network className="w-5 h-5 text-blue-500" />
                        Traffic Distributor
                    </h3>
                    <p className="text-zinc-500 text-sm">Strategy: {strategy}</p>
                </div>

                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                        onClick={() => setStrategy('ROUND_ROBIN')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${strategy === 'ROUND_ROBIN' ? 'bg-white shadow text-black' : 'text-zinc-500'}`}
                    >
                        Round Robin
                    </button>
                    <button
                        onClick={() => setStrategy('LEAST_LOAD')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${strategy === 'LEAST_LOAD' ? 'bg-white shadow text-black' : 'text-zinc-500'}`}
                    >
                        Least Load
                    </button>
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 relative flex flex-col items-center">
                {/* Generator Button (Top) */}
                <button
                    onClick={handleRequest}
                    className="mb-16 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white w-32 h-32 rounded-full font-black shadow-xl z-20 transition-all flex flex-col items-center justify-center gap-2"
                >
                    <span>SEND</span>
                    <ArrowDown className="w-8 h-8 animate-bounce" />
                </button>

                {/* Servers (Bottom) */}
                <div className="w-full flex justify-between items-end px-12">
                    {stats.map(server => {
                        const loadColor = server.load > 80 ? 'bg-red-500' : server.load > 50 ? 'bg-yellow-500' : 'bg-green-500';

                        return (
                            <div key={server.id} className="flex flex-col items-center gap-4 relative w-32">
                                {/* Incoming Packets */}
                                {requests.filter(r => r.target === server.id).map(r => (
                                    <motion.div
                                        key={r.id}
                                        initial={{ y: -300, opacity: 1, scale: 0.5 }}
                                        animate={{ y: 0, opacity: 0, scale: 1.5 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                    />
                                ))}

                                {/* Server Body */}
                                <div className="relative w-full aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 rounded-lg border-b-4 border-l-2 border-r-2 border-zinc-300 dark:border-zinc-700 flex flex-col justify-end overflow-hidden">
                                    {/* Load Fill */}
                                    <motion.div
                                        className={`w-full ${loadColor} opacity-80`}
                                        animate={{ height: `${server.load}%` }}
                                    />
                                    {/* Rack Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none p-2">
                                        <div className="h-0.5 w-full bg-black/10" />
                                        <div className="h-0.5 w-full bg-black/10" />
                                        <div className="h-0.5 w-full bg-black/10" />
                                    </div>
                                    <div className="absolute top-2 right-2 text-xs font-mono font-bold">{server.load.toFixed(0)}%</div>
                                </div>
                                <div className="font-bold text-center">
                                    <div className="text-sm">{server.name}</div>
                                    <Server className="w-4 h-4 mx-auto text-zinc-400" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
