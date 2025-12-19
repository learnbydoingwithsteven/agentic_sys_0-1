'use client';

import React, { useState } from 'react';
import { Network, Play, GitMerge, FileText, CheckCircle, ArrowDown, Activity, Terminal, Share2, Code, FileCode, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runSequentialChain, runRouterChain, runParallelChain, type ChainResult, type ChainStep } from '@/actions/course_005_agent_chains/chains';

type ChainType = 'sequential' | 'router' | 'parallel';

const TECH_DETAILS = {
    sequential: {
        implementation: "LangChain RunnableSequence (.pipe)",
        mechanism: "Output Passing (Context Injection)",
        explanation: "This is realized by passing the string output of the previous LLM call directly into the template variables of the next System Prompt.",
        prompts: [
            "Prompt 1: 'Generate outline for {topic}'",
            "Prompt 2: 'Write intro based on {outline}'",
            "Prompt 3: 'Critique this {intro}'"
        ]
    },
    router: {
        implementation: "Conditional Logic (Switch/Case)",
        mechanism: "Intent Classification",
        explanation: "Realized by first prompting the LLM to output a specific 'category token' (e.g., 'MATH'). The application logic then selects the appropriate Specialist System Prompt.",
        prompts: [
            "Prompt 1: 'Classify {input} as MATH/CODE/ETC'",
            " Logic: if (MATH) use MathPrompt else ...",
            "Prompt 2: Specialist Expert Prompt"
        ]
    },
    parallel: {
        implementation: "LangChain RunnableMap",
        mechanism: "Async Execution & Aggregation",
        explanation: "Realized by dispatching two independent LLM requests simultaneously. Their results are collected into a dictionary and injected into a final 'Synthesis' System Prompt.",
        prompts: [
            "Prompt A: 'Give Optimistic view on {topic}'",
            "Prompt B: 'Give Pessimistic view on {topic}'",
            "Prompt C: 'Synthesize {optimist} and {pessimist}'"
        ]
    }
};

export function ChainLab() {
    const [activeTab, setActiveTab] = useState<ChainType>('sequential');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ChainResult | null>(null);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            let res: ChainResult;
            if (activeTab === 'sequential') {
                res = await runSequentialChain(input);
            } else if (activeTab === 'router') {
                res = await runRouterChain(input);
            } else {
                res = await runParallelChain(input);
            }
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[750px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Network className="w-5 h-5 text-orange-500" />
                        Chain Orchestrator
                    </h3>

                    <div className="flex bg-zinc-200 dark:bg-zinc-700 p-1 rounded-lg">
                        <button
                            onClick={() => { setActiveTab('sequential'); setResult(null); setInput(''); }}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'sequential' ? 'bg-white dark:bg-zinc-600 shadow-sm text-orange-600' : 'text-zinc-500'}`}
                        >
                            <FileText className="w-3 h-3" /> Sequential
                        </button>
                        <button
                            onClick={() => { setActiveTab('router'); setResult(null); setInput(''); }}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'router' ? 'bg-white dark:bg-zinc-600 shadow-sm text-purple-600' : 'text-zinc-500'}`}
                        >
                            <GitMerge className="w-3 h-3" /> Router
                        </button>
                        <button
                            onClick={() => { setActiveTab('parallel'); setResult(null); setInput(''); }}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'parallel' ? 'bg-white dark:bg-zinc-600 shadow-sm text-green-600' : 'text-zinc-500'}`}
                        >
                            <Share2 className="w-3 h-3" /> Parallel
                        </button>
                    </div>
                </div>

                {/* Technical Insight Box */}
                <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-md shrink-0 mt-0.5">
                            <Code className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">
                                    How it works ({TECH_DETAILS[activeTab].mechanism}):
                                </span>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {TECH_DETAILS[activeTab].explanation}
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2">
                                {TECH_DETAILS[activeTab].prompts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-mono text-zinc-500">
                                        <FileCode className="w-2.5 h-2.5" />
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-zinc-50/50 dark:bg-black/20 scroll-smooth">

                {/* Input Section */}
                <form onSubmit={handleRun} className="mb-8">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                        {activeTab === 'sequential' ? "1. Enter a Topic" : activeTab === 'router' ? "1. Enter a Request" : "1. Enter a Topic for Debate"}
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={
                                activeTab === 'sequential' ? "e.g., 'The Future of AI'" :
                                    activeTab === 'router' ? "e.g., 'Solve 2x+5=10'" :
                                        "e.g., 'Universal Basic Income' or 'Space Travel'"
                            }
                            disabled={loading}
                            className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                        >
                            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                            Run
                        </button>
                    </div>
                </form>

                {/* Loading State Skeleton */}
                {loading && !result && (
                    <div className="flex flex-col gap-4 items-center justify-center py-12 opacity-50 animate-pulse">
                        <div className="w-16 h-16 rounded-full border-4 border-zinc-200 border-t-orange-500 animate-spin" />
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Processing Chain...</span>
                    </div>
                )}

                {/* Execution Visualizer */}
                <AnimatePresence mode='wait'>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 pb-8"
                        >
                            {/* Steps Visualization */}
                            <div className="relative pl-4">
                                {/* Vertical Line Connection */}
                                <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />

                                <div className="space-y-6 relative z-10">
                                    {result.steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.15 }} // Stagger step appearance
                                            className="flex gap-4 group"
                                        >
                                            <div className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center shadow-sm z-10">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                                                {/* Status Indicator Stripe */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />

                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">{step.name}</h4>
                                                </div>
                                                <div className="text-xs font-mono bg-zinc-50 dark:bg-black/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                                                    {step.result}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Final Output */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: result.steps.length * 0.15 + 0.2 }}
                                className="bg-gradient-to-tr from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-6 shadow-sm"
                            >
                                <h4 className="font-bold flex items-center gap-2 text-orange-900 dark:text-orange-100 mb-4 text-sm uppercase tracking-wider">
                                    <Terminal className="w-4 h-4" /> Final Chain Output
                                </h4>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                    {result.finalOutput.split('\n').map((line, i) => <p key={i} className="my-1">{line}</p>)}
                                </div>
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
