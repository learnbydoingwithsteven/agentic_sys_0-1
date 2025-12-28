'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    User,
    Send,
    Terminal,
    Brain,
    Calculator,
    CloudSun,
    Play,
    CheckCircle
} from 'lucide-react';
import { runReActAgent, AgentStep } from '@/actions/course_027_tool_use/tool_agent_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function ToolUseLab() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "I have access to a Calculator and Weather tools. Try asking 'What is 25 * 4?' or 'Weather in Tokyo'." }
    ]);
    const [input, setInput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [trace, setTrace] = useState<AgentStep[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) {
                const preferred = ms.find(m => m.includes("llama") || m.includes("qwen") || m.includes("mistral"));
                setSelectedModel(preferred || ms[0]);
            }
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, trace]);

    const handleSend = async () => {
        if (!input.trim() || isRunning) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsRunning(true);
        setTrace([]);

        try {
            // We only simulate one turn interactions for this demo (Stateless ReAct)
            // But we display them in a chat history style
            const result = await runReActAgent(userMsg.content, selectedModel);

            // Animate trace appearance? 
            // Since backend returns all at once, we just set it. 
            // For a cooler effect, we could stream it, but let's keep it simple.
            setTrace(result.steps);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.finalAnswer
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Agent crashed. Check console." }]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex h-[750px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">

            {/* 1. Chat Area (Left) */}
            <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 relative">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-teal-500" />
                        <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Tool Agent</span>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="text-[10px] font-mono bg-transparent border-none outline-none text-zinc-400 cursor-pointer hover:text-teal-500"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-teal-500 text-white'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'user'
                                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-tl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isRunning && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl text-xs text-zinc-500 flex items-center gap-2">
                                <span className="animate-pulse">Thinking & Using Tools...</span>
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
                            placeholder="e.g. Calculate 123 * 45"
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none max-h-32 shadow-inner dark:text-zinc-200"
                            rows={1}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || isRunning} className="absolute right-2 top-2 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-0">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Trace Visualizer (Right) */}
            <div className="w-[380px] bg-zinc-50 dark:bg-black/20 flex flex-col border-l border-zinc-200 dark:border-zinc-800">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-teal-600" />
                        <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Execution Trace</h3>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                    {trace.length > 0 ? (
                        trace.map((step, idx) => {
                            let icon = <Brain className="w-3 h-3 text-zinc-500" />;
                            let color = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";

                            if (step.tool === 'calculate') {
                                icon = <Calculator className="w-3 h-3 text-orange-500" />;
                                color = "border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20";
                            } else if (step.tool === 'weather') {
                                icon = <CloudSun className="w-3 h-3 text-blue-500" />;
                                color = "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20";
                            }

                            if (step.type === 'thought') {
                                return (
                                    <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="text-xs text-zinc-500 italic p-2">
                                        Thinking: {step.content}
                                    </motion.div>
                                );
                            }

                            if (step.type === 'observation') {
                                return (
                                    <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`p-3 rounded-lg border text-xs font-mono shadow-sm ${color}`}>
                                        <div className="flex items-center gap-2 mb-1 opacity-70">
                                            {icon}
                                            <span className="uppercase font-bold text-[10px]">{step.tool} OUTPUT</span>
                                        </div>
                                        <div className="text-zinc-700 dark:text-zinc-300">
                                            {step.content.replace("Tool Output: ", "")}
                                        </div>
                                    </motion.div>
                                );
                            }

                            if (step.type === 'answer') return null; // Shown in chat
                            return null;
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <Play className="w-12 h-12 mb-2 text-zinc-300" />
                            <p className="text-xs text-zinc-400">Waiting for agent loop...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
