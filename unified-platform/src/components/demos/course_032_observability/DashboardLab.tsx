'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    Play,
    Pause,
    Trash2,
    Database,
    Zap
} from 'lucide-react';
import { simulateTraffic, getStats, clearLogs, AgentStats } from '@/actions/course_032_observability/observability_backend';

export function DashboardLab() {
    const [stats, setStats] = useState<AgentStats>({
        totalRequests: 0,
        errorRate: 0,
        avgLatency: 0,
        estimatedCost: 0,
        logs: []
    });
    const [isSimulating, setIsSimulating] = useState(false);

    // Filter simulation loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSimulating) {
            interval = setInterval(async () => {
                await simulateTraffic();
                const newStats = await getStats();
                setStats(newStats);
            }, 800); // New request every 800ms
        }
        return () => clearInterval(interval);
    }, [isSimulating]);

    // Initial load
    useEffect(() => {
        getStats().then(setStats);
    }, []);

    const handleClear = async () => {
        await clearLogs();
        const newStats = await getStats();
        setStats(newStats);
    };

    return (
        <div className="flex flex-col gap-6 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">

            {/* Header + Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Live Observability
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
                        <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                            {isSimulating ? 'System Online' : 'System Idle'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors ${isSimulating
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                    >
                        {isSimulating ? <><Pause className="w-3 h-3" /> Pause Traffic</> : <><Play className="w-3 h-3" /> Start Traffic</>}
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 bg-zinc-100 text-zinc-500 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors"
                        title="Clear Logs"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Requests"
                    value={stats.totalRequests.toString()}
                    icon={Database}
                    color="text-blue-500"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
                <MetricCard
                    label="Error Rate"
                    value={`${stats.errorRate}%`}
                    icon={AlertCircle}
                    color={stats.errorRate > 10 ? "text-red-500" : "text-zinc-500"}
                    bg={stats.errorRate > 10 ? "bg-red-50 dark:bg-red-900/20" : "bg-zinc-100 dark:bg-zinc-800"}
                />
                <MetricCard
                    label="Avg Latency"
                    value={`${stats.avgLatency}ms`}
                    icon={Clock}
                    color={stats.avgLatency > 1000 ? "text-orange-500" : "text-emerald-500"}
                    bg="bg-zinc-100 dark:bg-zinc-800"
                />
                <MetricCard
                    label="Est. Cost"
                    value={`$${stats.estimatedCost}`}
                    icon={DollarSign}
                    color="text-indigo-500"
                    bg="bg-indigo-50 dark:bg-indigo-900/20"
                    info="Approx"
                />
            </div>

            {/* Live Logs */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[400px] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                    <h4 className="font-bold text-xs uppercase text-zinc-500 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Live Event Stream
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400">Showing last 50</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {stats.logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                            <Activity className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-xs">No traffic data.</p>
                        </div>
                    )}
                    <AnimatePresence initial={false}>
                        {stats.logs.map((log) => (
                            <motion.div
                                key={log.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-black/40 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 transition-colors text-xs"
                            >
                                <div className="w-16 font-mono text-zinc-400 shrink-0">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                </div>

                                <div className={`shrink-0 ${log.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {log.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                </div>

                                <div className="flex-1 font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                    {log.queryExcerpt}
                                </div>

                                <div className="hidden md:flex items-center gap-4 text-zinc-500 shrink-0">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {log.latencyMs}ms
                                    </span>
                                    <span className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1.5 rounded text-[10px]">
                                        {log.model}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, bg, info }: any) {
    return (
        <div className={`p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 ${bg} flex flex-col justify-between h-24 relative overflow-hidden`}>
            <div className="flex justify-between items-start z-10">
                <span className="text-[10px] font-bold uppercase text-zinc-500">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-2xl font-black ${color.replace('text-', 'text-')} z-10`}>
                {value}
            </div>
            {info && <span className="absolute bottom-2 right-2 text-[8px] opacity-50 font-bold">{info}</span>}
        </div>
    );
}
