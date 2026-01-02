'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Play,
    StopCircle,
    Loader2
} from 'lucide-react';
import { runSwarmStep, SwarmMessage } from '@/actions/course_064_swarm/swarm_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function SwarmLab() {
    const [messages, setMessages] = useState<SwarmMessage[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleStart = async () => {
        if (!selectedModel) return;
        setIsRunning(true);
        setMessages([{ sender: 'User', text: "Build a Flappy Bird clone." }]);

        let currentMessages = [{ sender: 'User', text: "Build a Flappy Bird clone." }];

        // Run 5 turns
        for (let i = 0; i < 5; i++) {
            // Check current isRunning state via function to avoid closure staleness issues if possible, 
            // but for simplicity in this loop we might need a ref or check state differently.
            // React state updates in loop won't reflect immediately in 'isRunning' var.
            // But we can check a condition or just let it run 5 turns.
            // Optimization: Let's assume user doesn't stop mid-loop for strict MVP or add a cancel ref later.

            await new Promise(r => setTimeout(r, 500));
            try {
                const msg = await runSwarmStep(currentMessages, selectedModel);
                currentMessages = [...currentMessages, msg];
                setMessages(currentMessages);
            } catch (e) {
                console.error(e);
                break;
            }
        }
        setIsRunning(false);
    };

    const AGENTS = ['Manager', 'Coder', 'Reviewer'];

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <div>
                        <h3 className="font-bold text-lg">Swarm Chat</h3>
                        <p className="text-zinc-500 text-xs">AutoGen Pattern</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-700 outline-none cursor-pointer"
                        disabled={isRunning}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleStart}
                        disabled={isRunning || !selectedModel}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        {isRunning ? 'Swarm Active...' : 'Start Swarm'}
                    </button>
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Visual Area (Agents) */}
                <div className="w-1/3 flex flex-col justify-center items-center gap-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
                    {AGENTS.map(agent => {
                        const isActive = messages.length > 0 && messages[messages.length - 1].sender === agent;
                        return (
                            <motion.div
                                key={agent}
                                animate={{ scale: isActive ? 1.1 : 1, opacity: isActive ? 1 : 0.6 }}
                                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${isActive
                                    ? 'bg-purple-100 border-purple-500 dark:bg-purple-900/40 dark:border-purple-500 shadow-lg'
                                    : 'bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'
                                    }`}
                            >
                                <div className="font-bold text-lg">{agent}</div>
                                {isActive && <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" />}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Chat Log */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex flex-col ${['User'].includes(msg.sender) ? 'items-end' : 'items-start'}`}
                        >
                            <div className="text-xs font-bold text-zinc-400 mb-1 ml-1">{msg.sender}</div>
                            <div className={`p-4 rounded-2xl max-w-[80%] ${['User'].includes(msg.sender)
                                ? 'bg-zinc-100 dark:bg-zinc-800'
                                : 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    {messages.length === 0 && (
                        <div className="text-center text-zinc-400 mt-20 opacity-50">
                            Waiting for trigger...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
