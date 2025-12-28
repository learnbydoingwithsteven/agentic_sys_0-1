'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Zap,
    Lightbulb,
    Microscope,
    ChevronDown,
    ChevronUp,
    Play
} from 'lucide-react';
import { solveProblem, ReasoningResult } from '@/actions/course_029_reasoning_models/reasoning_backend'; // Assuming backend is implemented
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const LOGIC_PUZZLES = [
    {
        title: "The Sister Riddle",
        q: "Sally has 3 brothers. Each brother has 2 sisters. How many sisters does Sally have?"
    },
    {
        title: "The Lily Pad",
        q: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half the lake?"
    },
    {
        title: "Coffee Cooling",
        q: "I leave a cup of hot coffee on the table. In 10 minutes it cools down by 10 degrees. If I leave it for 10 more minutes, will it cool down by more than 10 degrees, less than 10 degrees, or exactly 10 degrees? Explain physics."
    }
];

export function ReasoningLab() {
    const [input, setInput] = useState(LOGIC_PUZZLES[0].q);
    const [sys1Result, setSys1Result] = useState<ReasoningResult | null>(null);
    const [sys2Result, setSys2Result] = useState<ReasoningResult | null>(null);
    const [isThinking, setIsThinking] = useState(false);

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

    const handleRun = async () => {
        if (!input.trim() || isThinking) return;
        setIsThinking(true);
        setSys1Result(null);
        setSys2Result(null);

        // Run in parallel for dramatic effect
        const p1 = solveProblem(input, 'system1', selectedModel);
        const p2 = solveProblem(input, 'system2', selectedModel);

        try {
            const [r1, r2] = await Promise.all([p1, p2]);
            setSys1Result(r1);
            setSys2Result(r2);
        } catch (e) {
            console.error(e);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">

            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                        <Brain className="w-5 h-5 text-indigo-500" />
                        Logic Challenge
                    </h3>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-xs rounded px-2 py-1 border-none outline-none"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-medium resize-none focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                    rows={3}
                />

                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {LOGIC_PUZZLES.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(p.q)}
                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors"
                        >
                            {p.title}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleRun}
                        disabled={isThinking || !input}
                        className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 text-white transition-all ${isThinking ? 'bg-zinc-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
                            }`}
                    >
                        {isThinking ? 'Analyzing...' : <>Run Experiment <Play className="w-4 h-4 fill-white" /></>}
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* System 1: Intuition */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-orange-50 dark:bg-orange-900/10">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm uppercase tracking-wider">
                            <Zap className="w-4 h-4" />
                            System 1: Intuition
                        </div>
                    </div>
                    <div className="p-6 flex-1 bg-gradient-to-b from-white to-orange-50/30 dark:from-zinc-900 dark:to-zinc-900">
                        {isThinking && (
                            <div className="animate-pulse flex space-x-2 items-center text-xs text-orange-400 font-mono">
                                <span>Generating fast response...</span>
                            </div>
                        )}
                        {sys1Result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                                    {sys1Result.finalAnswer}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* System 2: Reasoning */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-indigo-50 dark:bg-indigo-900/10">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
                            <Microscope className="w-4 h-4" />
                            System 2: Chain of Thought
                        </div>
                    </div>
                    <div className="p-0 flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950/50">
                        {isThinking && (
                            <div className="p-6 animate-pulse flex space-x-2 items-center text-xs text-indigo-400 font-mono">
                                <span>Thinking step-by-step...</span>
                            </div>
                        )}
                        {sys2Result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                                {/* Thought Process (Collapsible-ish) */}
                                <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <Lightbulb className="w-3 h-3" />
                                        <span>INTERNAL MONOLOGUE</span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{sys2Result.thoughtProcess}</p>
                                </div>
                                {/* Final Answer */}
                                <div className="p-6 bg-white dark:bg-zinc-900 flex-1">
                                    <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Verified Answer</div>
                                    <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-bold">
                                        {sys2Result.finalAnswer}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
