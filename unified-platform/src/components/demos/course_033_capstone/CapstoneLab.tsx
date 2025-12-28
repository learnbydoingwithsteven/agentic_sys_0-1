'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Code,
    Search,
    BarChart,
    Send,
    Bot,
    ArrowDown,
    Sparkles
} from 'lucide-react';
import { runOrchestration, WorkflowStep } from '@/actions/course_033_capstone/orchestrator_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

export function CapstoneLab() {
    const [input, setInput] = useState("");
    const [steps, setSteps] = useState<WorkflowStep[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) {
                const preferred = ms.find(m => m.includes("llama") || m.includes("qwen") || m.includes("mistral"));
                setSelectedModel(preferred || ms[0]);
            }
        });
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;
        setIsProcessing(true);
        setSteps([]); // Clear previous

        try {
            const result = await runOrchestration(input, selectedModel);
            if (result.steps) {
                // Simulate "streaming" feeling by adding steps one by one?
                // For simplicity in this demo, just set them all, but frame-motion will animate list entrance.
                setSteps(result.steps);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const getAgentIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'orchestrator': return <Brain className="w-5 h-5 text-purple-600" />;
            case 'researcher': return <Search className="w-5 h-5 text-blue-600" />;
            case 'coder': return <Code className="w-5 h-5 text-emerald-600" />;
            case 'analyst': return <BarChart className="w-5 h-5 text-orange-600" />;
            default: return <Bot className="w-5 h-5 text-zinc-600" />;
        }
    };

    const getAgentColor = (name: string) => {
        switch (name.toLowerCase()) {
            case 'orchestrator': return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
            case 'researcher': return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
            case 'coder': return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800";
            case 'analyst': return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
            default: return "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700";
        }
    };

    return (
        <div className="flex flex-col h-[700px] bg-zinc-50 dark:bg-black/20 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative">

            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center z-10">
                <h3 className="font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Agent Orchestrator
                </h3>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 text-xs rounded-lg px-2 py-1 border-none outline-none"
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Workflow Visualization Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                {steps.length === 0 && !isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 opacity-50 pointer-events-none">
                        <Brain className="w-16 h-16 mb-4" />
                        <p className="text-sm font-medium">Ask me to research, code, or analyze.</p>
                    </div>
                )}

                {steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4">
                        {/* Connecting Line */}
                        {idx < steps.length - 1 && (
                            <div className="absolute left-[19px] top-[40px] bottom-[-32px] w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                        )}

                        {/* Icon */}
                        <div className="shrink-0 h-10 w-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm z-10">
                            {getAgentIcon(step.agentName)}
                        </div>

                        {/* Content Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex-1 rounded-2xl p-4 border shadow-sm ${getAgentColor(step.agentName)}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase opacity-60 tracking-wider">
                                    {step.agentName}
                                </span>
                                {step.type === 'thought' && <span className="text-[10px] bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">Reasoning</span>}
                                {step.type === 'action' && <span className="text-[10px] bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">Delegating</span>}
                            </div>
                            <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                {step.content}
                            </div>
                        </motion.div>
                    </div>
                ))}

                {isProcessing && (
                    <div className="flex gap-4 items-center animate-pulse opacity-50">
                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-12 flex-1 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="E.g. 'Write a python script to parse CSV' or 'Analyze the benefits of remote work'"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </button>
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {[
                        "Write a Python factorial function",
                        "Explain the French Revolution",
                        "Analyze pros/cons of coffee"
                    ].map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(suggestion)}
                            className="shrink-0 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20 transition-colors border border-transparent hover:border-purple-200"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
