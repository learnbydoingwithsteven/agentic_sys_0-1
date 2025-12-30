'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wifi,
    WifiOff,
    Smartphone,
    Cloud,
    RefreshCw,
    Plus
} from 'lucide-react';
import { processEdge, syncBatch, EdgeTask } from '@/actions/course_087_edge_computing/edge_backend';

export function EdgeLab() {
    const [online, setOnline] = useState(true);
    const [localTasks, setLocalTasks] = useState<EdgeTask[]>([]);
    const [cloudTasks, setCloudTasks] = useState<EdgeTask[]>([]);
    const [syncing, setSyncing] = useState(false);

    // Auto-sync when online
    useEffect(() => {
        if (online && localTasks.length > 0 && !syncing) {
            handleSync();
        }
    }, [online, localTasks, syncing]);

    const handleGenerate = async () => {
        const newTask = await processEdge(`Data-${Date.now().toString().slice(-4)}`);
        setLocalTasks(prev => [...prev, newTask]);
    };

    const handleSync = async () => {
        setSyncing(true);
        const unsynced = localTasks; // Sync all
        const synced = await syncBatch(unsynced);

        setCloudTasks(prev => [...prev, ...synced]);
        setLocalTasks([]); // Clear local cache after sync
        setSyncing(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Control Bar */}
            <div className={`p-6 rounded-3xl border shadow-sm flex justify-between items-center transition-colors ${online ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900' : 'bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOnline(!online)}
                        className={`w-16 h-8 rounded-full p-1 transition-colors relative ${online ? 'bg-green-500' : 'bg-zinc-400'}`}
                    >
                        <motion.div
                            layout
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                            animate={{ x: online ? 32 : 0 }}
                        />
                    </button>
                    <div className="font-bold flex items-center gap-2">
                        {online ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-zinc-500" />}
                        {online ? 'ONLINE' : 'OFFLINE'}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Generate Data
                </button>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                {/* Edge Device */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-4 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 font-bold text-sm shadow-sm">
                        <Smartphone className="w-4 h-4 text-blue-500" /> Edge Device
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 space-y-2">
                        <AnimatePresence>
                            {localTasks.map(t => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 text-sm font-mono flex justify-between items-center"
                                >
                                    <span>{t.data}</span>
                                    <span className="text-[10px] bg-blue-200 dark:bg-blue-800 px-1 rounded text-blue-800 dark:text-blue-100">CACHE</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {localTasks.length === 0 && <div className="text-center text-zinc-400 text-sm mt-10">Local cache empty.</div>}
                    </div>
                </div>

                {/* Connection pipe */}
                <div className="flex flex-col items-center justify-center gap-2">
                    {syncing ? (
                        <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
                    ) : (
                        <div className={`w-2 h-full rounded-full transition-colors ${online ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-800'}`} />
                    )}
                </div>

                {/* Cloud */}
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-50 dark:bg-zinc-950 px-4 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 font-bold text-sm shadow-sm">
                        <Cloud className="w-4 h-4 text-zinc-500" /> Cloud Database
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 space-y-2">
                        {cloudTasks.map(t => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-mono flex justify-between items-center opacity-70"
                            >
                                <span>{t.data}</span>
                                <span className="text-[10px] bg-green-100 dark:bg-green-900 px-1 rounded text-green-800 dark:text-green-100">SYNCED</span>
                            </motion.div>
                        ))}
                        {cloudTasks.length === 0 && <div className="text-center text-zinc-400 text-sm mt-10">Cloud empty.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
