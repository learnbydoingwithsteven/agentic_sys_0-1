'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Power,
    Terminal,
    Cpu
} from 'lucide-react';
import { pollAgentActivity, AgentLog } from '@/actions/course_061_autonomous_task/auto_backend';

export function AutoTaskLab() {
    const [isOn, setIsOn] = useState(false);
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [step, setStep] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const loop = async () => {
            if (!isOn) return;

            // Allow loop to end naturally after 8 steps for demo loop
            if (step >= 8) {
                setIsOn(false);
                return;
            }

            try {
                const log = await pollAgentActivity(step);
                setLogs(prev => [...prev, log]);
                setStep(s => s + 1);
            } catch (e) {
                console.error(e);
                setIsOn(false);
            }
        };

        if (isOn) {
            loop();
        }

        return () => clearTimeout(timer);
    }, [isOn, step]); // Re-trigger when step changes or isOn changes

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handlePower = () => {
        if (isOn) {
            setIsOn(false);
        } else {
            setLogs([]);
            setStep(0);
            setIsOn(true);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOn ? 'bg-green-500 shadow-lg shadow-green-900/50' : 'bg-zinc-800'}`}>
                        <Bot className={`w-6 h-6 text-white ${isOn ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AutoAgent-X1</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                            <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            STATUS: {isOn ? 'RUNNING' : 'OFFLINE'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePower}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all hover:scale-105 active:scale-95 ${isOn
                            ? 'bg-red-500 border-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white'
                        }`}
                >
                    <Power className="w-8 h-8" />
                </button>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 bg-black rounded-3xl p-8 border-4 border-zinc-800 font-mono text-sm relative overflow-hidden shadow-Inner">
                <div className="absolute top-4 right-6 text-zinc-700 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> System Log
                </div>

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
        case 'WebSearch': return 'text-yellow-400';
        case 'READ': return 'text-cyan-400';
        case 'WRITE': return 'text-pink-400';
        case 'CHECK': return 'text-orange-400';
        case 'DONE': return 'text-green-400';
        default: return 'text-zinc-400';
    }
}
