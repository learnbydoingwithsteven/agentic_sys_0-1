'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Briefcase,
    Search,
    PenTool,
    Cpu,
    ArrowRight
} from 'lucide-react';
import { runMultiAgentSystem, AgentStep } from '@/actions/course_046_multi_agent_collab/multi_agent_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MultiAgentLab() {
    const [topic, setTopic] = useState("The Future of AI Agents");
    const [steps, setSteps] = useState<AgentStep[]>([]);
    const [running, setRunning] = useState(false);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Fetch models on mount
    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setRunning(true);
        setSteps([]);

        // Execute Workflow
        const result = await runMultiAgentSystem(topic, selectedModel);

        // Reveal sequentially
        for (const step of result) {
            await new Promise(r => setTimeout(r, 800));
            setSteps(prev => [...prev, step]);
        }
        setRunning(false);
    };

    const getAgentIcon = (role: string) => {
        switch (role) {
            case 'MANAGER': return <Briefcase className="w-5 h-5" />;
            case 'RESEARCHER': return <Search className="w-5 h-5" />;
            case 'WRITER': return <PenTool className="w-5 h-5" />;
            default: return <Users className="w-5 h-5" />;
        }
    };

    const getAgentStyle = (role: string) => {
        switch (role) {
            case 'MANAGER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'RESEARCHER': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'WRITER': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-2 block">Project Topic</label>
                    <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200 focus:ring-2 ring-indigo-500 outline-none"
                    />
                </div>

                {/* Model Selector */}
                <div className="flex flex-col gap-2 mt-6">
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 h-12">
                        <Cpu className="w-4 h-4 text-zinc-500" />
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer w-24"
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleRun}
                    disabled={running || !selectedModel}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 mt-6 disabled:opacity-50"
                >
                    <Users className="w-5 h-5" />
                    {running ? 'Orchestrating...' : 'Deploy Crew'}
                </button>
            </div>

            {/* Workflow Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar relative">

                {steps.length === 0 && !running && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 opacity-50">
                        <Users className="w-16 h-16 mb-4" />
                        <div className="italic">Assemble your AI team to start...</div>
                    </div>
                )}

                {running && steps.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 italic animate-pulse">
                        Manager is analyzing the request...
                    </div>
                )}

                <div className="space-y-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            {/* Avatar Column */}
                            <div className="flex flex-col items-center gap-2 shrink-0 w-24 pt-2">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${getAgentStyle(step.agent)}`}>
                                    {getAgentIcon(step.agent)}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                                    {step.agent}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-800 my-2 min-h-[20px]" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex-1 rounded-2xl p-5 border shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800`}>
                                <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {step.output}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
