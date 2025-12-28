'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Send,
    Eraser,
    History,
    BrainCircuit,
    Maximize,
    Minimize,
    Archive
} from 'lucide-react';
import { chatWithMemory, clearMemory } from '@/actions/course_026_memory_systems/memory_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ContextItem {
    role: string;
    content: string;
}

export function MemoryLab() {
    // Session State
    const [sessionId] = useState(() => `session-${Math.random().toString(36).substring(7)}`);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Hi! I remember our conversation based on your settings. Try telling me your name, then ask for it later!" }
    ]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Memory Config
    const [windowSize, setWindowSize] = useState(2); // K=2 pairs
    const [lastContext, setLastContext] = useState<ContextItem[]>([]);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    // Init
    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) {
                // Try to pick a sensible default
                const preferred = ms.find(m => m.includes("llama") || m.includes("qwen") || m.includes("mistral"));
                setSelectedModel(preferred || ms[0]);
            }
        });
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isGenerating) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsGenerating(true);

        try {
            const result = await chatWithMemory(sessionId, userMsg.content, selectedModel, windowSize);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.answer
            };

            setMessages(prev => [...prev, aiMsg]);
            setLastContext(result.contextUsed);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Memory error (check console)." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClear = async () => {
        setIsGenerating(true);
        await clearMemory(sessionId);
        setMessages([{ id: Date.now().toString(), role: 'assistant', content: "Memory wiped! I've forgotten everything we talked about." }]);
        setLastContext([]);
        setIsGenerating(false);
    };

    return (
        <div className="flex h-[750px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">

            {/* 1. Chat Area (Left) */}
            <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 relative">
                {/* Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-fuchsia-500" />
                        <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Memory Agent</span>
                        {/* Model Selector */}
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="text-[10px] font-mono bg-transparent border-none outline-none text-zinc-400 cursor-pointer hover:text-fuchsia-500"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleClear}
                        className="p-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Eraser className="w-3 h-3" />
                        Reset Memory
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-fuchsia-500 text-white'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`flex flex-col max-w-[85%]`}>
                                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm'
                                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isGenerating && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-5 py-4 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700 shadow-sm w-24 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a message..."
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none max-h-32 shadow-inner dark:text-zinc-200"
                            rows={1}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || isGenerating} className="absolute right-2 top-2 p-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg transition-colors disabled:opacity-0">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Visualizer (Right) */}
            <div className="w-[380px] bg-zinc-50 dark:bg-black/20 flex flex-col border-l border-zinc-200 dark:border-zinc-800">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="w-4 h-4 text-fuchsia-500" />
                        <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Context Simulation</h3>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Memory Window</label>
                            <span className="text-xs font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400">{windowSize} pairs</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5" // Keep small to force forgetting
                            step="1"
                            value={windowSize}
                            onChange={(e) => setWindowSize(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                        />
                        <p className="mt-2 text-[10px] text-zinc-500 leading-tight">
                            The agent will only "see" the last {windowSize} exchanges. Older messages are dropped from the prompt.
                        </p>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 relative">
                    <h4 className="text-[10px] uppercase font-bold text-zinc-400 sticky top-0 bg-zinc-50 dark:bg-zinc-900/0 py-2 z-10">Messages sent to LLM</h4>

                    {lastContext.length > 0 ? (
                        lastContext.map((ctx, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-sm relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ctx.role === 'user' ? 'bg-zinc-800' : 'bg-fuchsia-500'}`} />
                                <div className="text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider pl-2">{ctx.role}</div>
                                <div className="text-xs text-zinc-600 dark:text-zinc-300 pl-2 leading-relaxed font-mono whitespace-pre-wrap">
                                    {ctx.content}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <History className="w-12 h-12 mb-2 text-zinc-300" />
                            <p className="text-xs text-zinc-400">No context history yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
