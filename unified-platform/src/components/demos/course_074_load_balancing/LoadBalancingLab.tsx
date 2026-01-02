'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server as ServerIcon,
    Network,
    ArrowDown,
    Zap,
    Brain,
    MessageSquare,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { routeAndExecute, ServerInstance, RouterDecision } from '@/actions/course_074_load_balancing/load_bal_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function LoadBalancingLab() {
    const [servers, setServers] = useState<ServerInstance[]>([
        { id: '1', name: 'Nano-1', type: 'FAST', load: 0, description: 'Low Latency' },
        { id: '2', name: 'General-1', type: 'GENERAL', load: 0, description: 'Standard' },
        { id: '3', name: 'Brain-1', type: 'REASONING', load: 0, description: 'High Compute' }
    ]);

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ query: string, decision: RouterDecision, response: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activePacket, setActivePacket] = useState<{ targetId: string } | null>(null);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            m.length > 0 && setSelectedModel(m[0]);
        });

        // Load Decay Simulation
        const interval = setInterval(() => {
            setServers(prev => prev.map(s => ({ ...s, load: Math.max(0, s.load - 5) })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!input || !selectedModel) return;
        setIsProcessing(true);

        try {
            const { decision, response } = await routeAndExecute(input, servers, selectedModel);

            // Visualize Packet
            setActivePacket({ targetId: decision.targetId });

            // Update Load
            setServers(prev => prev.map(s => s.id === decision.targetId ? { ...s, load: Math.min(100, s.load + 40) } : s));

            setHistory(prev => [{ query: input, decision, response }, ...prev]);
            setInput("");

            setTimeout(() => setActivePacket(null), 1000);

        } catch (e) {
            console.error(e);
        }
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Network className="w-5 h-5 text-blue-500" />
                        Semantic Load Balancer
                    </h3>
                    <p className="text-zinc-500 text-sm">Routes traffic based on Intent & Complexity</p>
                </div>
                <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs font-bold"
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Visualizer Area */}
            <div className="relative flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-between overflow-hidden">

                {/* Router Node (Top) */}
                <div className="z-20 flex flex-col items-center gap-4 w-full max-w-xl">
                    <div className="flex w-full gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Enter task (e.g. 'Hi' or 'Solve this physics problem...')"
                            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm outline-none focus:ring-2 ring-blue-500/50"
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isProcessing || !input}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                        </button>
                    </div>

                    <div className="bg-blue-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-45 mb-4">
                        <div className="transform -rotate-45 font-black text-xs text-center">ROUTER<br />AI</div>
                    </div>
                </div>

                {/* Servers (Bottom) */}
                <div className="w-full flex justify-around items-end z-10">
                    {servers.map(server => {
                        const isActive = activePacket?.targetId === server.id;
                        return (
                            <div key={server.id} className="flex flex-col items-center gap-4 w-32 relative">
                                {/* Packet Animation */}
                                {isActive && (
                                    <motion.div
                                        initial={{ y: -300, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute top-0 z-30 pointer-events-none"
                                    >
                                        <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full shadow-lg font-bold whitespace-nowrap">
                                            Request
                                        </div>
                                    </motion.div>
                                )}

                                <div className={`relative w-full aspect-[3/4] rounded-2xl border-2 flex flex-col justify-end overflow-hidden transition-colors ${isActive ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-900'}`}>
                                    <motion.div
                                        className={`w-full ${server.type === 'FAST' ? 'bg-green-500' : server.type === 'GENERAL' ? 'bg-orange-500' : 'bg-purple-500'} opacity-50`}
                                        animate={{ height: `${server.load}%` }}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                        {server.type === 'FAST' && <Zap className="w-6 h-6 mb-2 text-zinc-500" />}
                                        {server.type === 'GENERAL' && <MessageSquare className="w-6 h-6 mb-2 text-zinc-500" />}
                                        {server.type === 'REASONING' && <Brain className="w-6 h-6 mb-2 text-zinc-500" />}
                                        <div className="font-bold text-sm">{server.name}</div>
                                        <div className="text-[10px] text-zinc-500 uppercase">{server.type}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* History Log Overlay */}
                <div className="absolute top-4 right-4 w-64 max-h-64 overflow-y-auto bg-white/90 dark:bg-black/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl backdrop-blur-sm text-xs space-y-3 custom-scrollbar">
                    <div className="font-bold text-zinc-400 uppercase tracking-wider">Router Logs</div>
                    {history.map((h, i) => (
                        <div key={i} className="border-l-2 border-blue-500 pl-2">
                            <div className="font-bold truncate">"{h.query}"</div>
                            <div className="flex justify-between text-zinc-500 mt-1">
                                <span>Score: {h.decision.complexityScore}</span>
                                <span className="text-blue-500">{servers.find(s => s.id === h.decision.targetId)?.type}</span>
                            </div>
                            <div className="italic text-zinc-400 mt-1">{h.decision.reasoning}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
