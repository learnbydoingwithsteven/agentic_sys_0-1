'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Power,
    Terminal,
    Cpu,
    Loader2
} from 'lucide-react';
import { runAutonomousAgent, AgentLog } from '@/actions/course_061_autonomous_task/auto_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function AutoTaskLab() {
    const [isOn, setIsOn] = useState(false);
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [fullLogs, setFullLogs] = useState<AgentLog[]>([]);
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    // Playback Effect
    useEffect(() => {
        if (!isOn || playbackIndex >= fullLogs.length) {
            if (playbackIndex >= fullLogs.length && fullLogs.length > 0) {
                // Done playback
                setIsOn(false);
            }
            return;
        }

        const timer = setTimeout(() => {
            setLogs(prev => [...prev, fullLogs[playbackIndex]]);
            setPlaybackIndex(p => p + 1);
        }, 800); // 800ms delay between steps for readability

        return () => clearTimeout(timer);
    }, [isOn, playbackIndex, fullLogs]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handlePower = async () => {
        if (isOn || isThinking) {
            // Force Stop
            setIsOn(false);
            setIsThinking(false);
            return;
        }

        if (!selectedModel) return;

        // Start New Run
        setLogs([]);
        setFullLogs([]);
        setPlaybackIndex(0);
        setIsThinking(true); // "Thinking" means fetching data from backend

        try {
            const resultLogs = await runAutonomousAgent("Market Research on AI Agents", selectedModel);
            setFullLogs(resultLogs);
            setIsThinking(false);
            setIsOn(true); // Start playback
        } catch (e) {
            console.error(e);
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-xl gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOn || isThinking ? 'bg-green-500 shadow-lg shadow-green-900/50' : 'bg-zinc-800'}`}>
                        <Bot className={`w-6 h-6 text-white ${isOn || isThinking ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AutoAgent-X1</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                            <div className={`w-2 h-2 rounded-full ${isOn || isThinking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            STATUS: {isThinking ? 'PLANNING...' : (isOn ? 'EXECUTING' : 'OFFLINE')}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-700 outline-none cursor-pointer"
                        disabled={isOn || isThinking}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <button
                        onClick={handlePower}
                        disabled={!selectedModel && !isOn}
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all hover:scale-105 active:scale-95 ${isOn || isThinking
                            ? 'bg-red-500 border-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white'
                            }`}
                    >
                        <Power className="w-8 h-8" />
                    </button>
                </div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 bg-black rounded-3xl p-8 border-4 border-zinc-800 font-mono text-sm relative overflow-hidden shadow-inner">
                <div className="absolute top-4 right-6 text-zinc-700 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> System Log
                </div>

                {isThinking && logs.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-zinc-500 animate-pulse flex flex-col items-center gap-2">
                            <Cpu className="w-12 h-12" />
                            Processing Goal...
                        </div>
                    </div>
                )}

                <div className="h-full overflow-y-auto custom-scrollbar space-y-3" ref={scrollRef}>
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4"
                            >
                                <div className="text-zinc-500 w-24 shrink-0 text-xs mt-1">{log.timestamp.split('T')[1].split('.')[0]}</div>
                                <div className="flex-1">
                                    <span className={`font-bold mr-3 ${getLogColor(log.action)
                                        }`}>[{log.action}]</span>
                                    <span className="text-zinc-300">{log.details}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isOn && (
                        <div className="flex gap-4 animate-pulse opacity-50">
                            <div className="w-24 shrink-0" />
                            <div className="h-4 w-4 bg-green-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getLogColor(action: string) {
    switch (action) {
        case 'INIT': return 'text-blue-400';
        case 'THINK': return 'text-purple-400';
        case 'SEARCH': return 'text-yellow-400';
        case 'READ': return 'text-cyan-400';
        case 'WRITE': return 'text-pink-400';
        case 'CHECK': return 'text-orange-400';
        case 'DONE': return 'text-green-400';
        case 'FINISH': return 'text-green-400';
        default: return 'text-zinc-400';
    }
}
