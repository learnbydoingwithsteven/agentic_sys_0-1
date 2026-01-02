'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Play,
    AlertCircle,
    CheckCircle,
    Lightbulb,
    BrainCircuit,
    ArrowDown
} from 'lucide-react';
import { runReflexionCycle, ReflexionStep } from '@/actions/course_088_self_correction/reflexion_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ReflexionLab() {
    const [steps, setSteps] = useState<ReflexionStep[]>([]);
    const [running, setRunning] = useState(false);
    const [status, setStatus] = useState("Idle");

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setRunning(true);
        setSteps([]);
        setStatus("Agent is attempting task...");

        // In a real streaming app, we'd stream steps. Here we fetch the cycle simulation.
        const data = await runReflexionCycle(selectedModel);

        // Replay the sequence for the user
        // Step 1: Fail
        if (data.length > 0) {
            setSteps([data[0]]);
            setStatus("Error Detected! Triggering Reflexion...");
        }

        await new Promise(r => setTimeout(r, 2000));

        // Show Reflection
        // (It's already in data[0].reflection, UI will reveal it via animation logic potentially, 
        // strictly speaking state updates trigger re-render)

        await new Promise(r => setTimeout(r, 2000));

        // Step 2: Fix
        if (data.length > 1) {
            setStatus("Applying Fix based on Reflection...");
            setSteps(prev => [...prev, data[1]]);
        }

        setStatus("Task Solved.");
        setRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-500" />
                        Reflexion Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Output &rarr; Error &rarr; <b>Verbal Reflection</b> &rarr; Improved Output</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
                    <button
                        onClick={handleRun}
                        disabled={running || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
                    >
                        {running ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        {running ? 'Reflecting...' : 'Start Loop'}
                    </button>
                </div>
            </div>

            {/* Terminal / Trace View */}
            <div className="flex-1 bg-zinc-950 rounded-3xl p-8 font-mono text-sm shadow-2xl border border-zinc-800 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 bg-zinc-900/80 p-2 text-center text-xs text-zinc-500 border-b border-zinc-800 backdrop-blur-sm z-10">
                    STATUS: <span className="text-indigo-400 font-bold animate-pulse">{status}</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pt-8 space-y-8">
                    <AnimatePresence>
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                {/* Step Connector */}
                                {i > 0 && (
                                    <div className="absolute -top-6 left-6 flex justify-center">
                                        <ArrowDown className="w-5 h-5 text-zinc-700" />
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-zinc-900
                                        ${step.result === 'PASS' ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'}
                                    `}>
                                        #{step.attempt}
                                    </div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                        {step.result === 'PASS' ? 'Success' : 'Attempt Failed'}
                                    </div>
                                </div>

                                <div className={`
                                    p-4 rounded-xl border-l-4 bg-zinc-900/50
                                    ${step.result === 'PASS' ? 'border-emerald-500' : 'border-red-500'}
                                `}>
                                    <pre className="text-zinc-300 whitespace-pre-wrap font-mono text-xs overflow-x-auto">
                                        {step.code}
                                    </pre>
                                </div>

                                {step.error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-3 ml-4 flex items-start gap-3 bg-red-900/20 p-3 rounded-lg border border-red-900/50"
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <div className="text-red-400 text-xs">{step.error}</div>
                                    </motion.div>
                                )}

                                {step.reflection && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5 }}
                                        className="mt-3 ml-4 flex items-start gap-3 bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30"
                                    >
                                        <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0" />
                                        <div>
                                            <div className="text-[10px] text-indigo-300 uppercase font-bold mb-1">Agent Reflection</div>
                                            <div className="text-indigo-100 italic">"{step.reflection}"</div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {steps.length === 0 && !running && (
                        <div className="flex flex-col items-center justify-center h-48 opacity-30">
                            <Terminal className="w-16 h-16 mb-4" />
                            <div>Ready to run code generation loop...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
