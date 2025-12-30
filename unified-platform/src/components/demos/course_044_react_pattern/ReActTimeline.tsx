'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Search,
    Eye,
    CheckCircle,
    ArrowRight,
    Cpu
} from 'lucide-react';
import { runReactLoop, ReactStep } from '@/actions/course_044_react_pattern/react_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ReActTimeline() {
    const [question, setQuestion] = useState("What is the age of the current US president?");
    const [steps, setSteps] = useState<ReactStep[]>([]);
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

        // This will block while the server loops through thoughts/actions
        const result = await runReactLoop(question, selectedModel);

        // Animate adding steps one by one for effect
        for (const step of result) {
            await new Promise(r => setTimeout(r, 600));
            setSteps(prev => [...prev, step]);
        }
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-2 block">Agent Task</label>
                    <input
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200 focus:ring-2 ring-blue-500 outline-none"
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
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 mt-6 disabled:opacity-50"
                >
                    {running ? <BrainCircuit className="w-5 h-5 animate-pulse" /> : <BrainCircuit className="w-5 h-5" />}
                    {running ? 'Reasoning...' : 'Start ReAct Loop'}
                </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar relative">
                {steps.length === 0 && !running && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 italic">
                        Waiting for input...
                    </div>
                )}
                {running && steps.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 italic animate-pulse">
                        Thinking... (Running LLM Chain)
                    </div>
                )}

                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    {steps.length > 0 && (
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
                    )}

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-6 items-start"
                        >
                            {/* Icon Bubble */}
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-zinc-50 dark:border-zinc-950 z-10
                                ${step.type === 'THOUGHT' ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300' : ''}
                                ${step.type === 'ACTION' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}
                                ${step.type === 'OBSERVATION' ? 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300' : ''}
                                ${step.type === 'ANSWER' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : ''}
                            `}>
                                {step.type === 'THOUGHT' && <BrainCircuit className="w-5 h-5" />}
                                {step.type === 'ACTION' && <Search className="w-5 h-5" />}
                                {step.type === 'OBSERVATION' && <Eye className="w-5 h-5" />}
                                {step.type === 'ANSWER' && <CheckCircle className="w-5 h-5" />}
                            </div>

                            {/* Content Card */}
                            <div className={`
                                flex-1 p-4 rounded-xl border text-sm shadow-sm
                                ${step.type === 'THOUGHT' ? 'bg-zinc-100 dark:bg-zinc-800 border-transparent italic text-zinc-600 dark:text-zinc-400' : ''}
                                ${step.type === 'ACTION' ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono text-blue-600 dark:text-blue-400' : ''}
                                ${step.type === 'OBSERVATION' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 text-amber-900 dark:text-amber-200' : ''}
                                ${step.type === 'ANSWER' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800 text-green-900 dark:text-green-200 font-bold text-lg' : ''}
                            `}>
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1">{step.type}</div>
                                {step.content}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
