'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gavel,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Play,
    Award
} from 'lucide-react';
import { runEvaluation, EvalResult } from '@/actions/course_030_eval_driven_dev/eval_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const PRESETS = [
    {
        name: "Fact Check (Correct)",
        q: "What is the capital of France?",
        gt: "The capital of France is Paris.",
        ar: "Paris is the capital city of France."
    },
    {
        name: "Fact Check (Wrong)",
        q: "What is the capital of France?",
        gt: "The capital of France is Paris.",
        ar: "The capital of France is Lyon."
    },
    {
        name: "Code Eval (Subtle)",
        q: "Write a Python function to add two numbers.",
        gt: "def add(a, b):\n    return a + b",
        ar: "def add(a, b):\n    print(a + b)" // Returns None, missed requirement usually implied
    }
];

export function EvalLab() {
    const [question, setQuestion] = useState(PRESETS[0].q);
    const [groundTruth, setGroundTruth] = useState(PRESETS[0].gt);
    const [agentResponse, setAgentResponse] = useState(PRESETS[0].ar);

    const [result, setResult] = useState<EvalResult | null>(null);
    const [isJudging, setIsJudging] = useState(false);

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
        if (!question || !groundTruth || !agentResponse || isJudging) return;
        setIsJudging(true);
        setResult(null);

        const res = await runEvaluation(question, groundTruth, agentResponse, selectedModel);
        setResult(res);
        setIsJudging(false);
    };

    const loadPreset = (idx: number) => {
        setQuestion(PRESETS[idx].q);
        setGroundTruth(PRESETS[idx].gt);
        setAgentResponse(PRESETS[idx].ar);
        setResult(null);
    };

    return (
        <div className="flex flex-col gap-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl">

            {/* Header / Controls */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 text-lg">
                        <Gavel className="w-5 h-5 text-amber-600" />
                        LLM-as-a-Judge
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                        Use AI to grade AI. Select a scenario or type your own.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-[10px] rounded px-2 py-1 border-none outline-none"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="flex gap-2">
                        {PRESETS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => loadPreset(i)}
                                className="px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-bold text-zinc-500 hover:border-amber-500 hover:text-amber-500 transition-colors"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-zinc-400">User Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-amber-500 outline-none"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-zinc-400 text-green-600/70 dark:text-green-500/70">Ground Truth (Expected)</label>
                        <textarea
                            value={groundTruth}
                            onChange={(e) => setGroundTruth(e.target.value)}
                            className="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-green-500 outline-none"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-zinc-400 text-blue-600/70 dark:text-blue-500/70">Agent Response (Actual)</label>
                        <textarea
                            value={agentResponse}
                            onChange={(e) => setAgentResponse(e.target.value)}
                            className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                        />
                    </div>

                    <button
                        onClick={handleRun}
                        disabled={isJudging}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all ${isJudging ? 'bg-zinc-400 cursor-wait' : 'bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-500/20'
                            }`}
                    >
                        {isJudging ? 'Judging...' : <>Run Evaluation <Play className="w-4 h-4 ml-1 fill-white" /></>}
                    </button>
                </div>

                {/* Scorecard */}
                <div className="bg-zinc-100 dark:bg-black/20 rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                    {result ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center w-full"
                        >
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Evaluation Score</div>

                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className={`text-6xl font-black ${result.score >= 4 ? 'text-green-500' :
                                        result.score === 3 ? 'text-amber-500' : 'text-red-500'
                                    }`}>
                                    {result.score}/5
                                </div>
                                {result.score >= 5 && <Award className="absolute -top-4 -right-8 w-8 h-8 text-yellow-400 animate-bounce" />}
                            </div>

                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 ${result.score >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    result.score === 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {result.score >= 4 ? <CheckCircle className="w-4 h-4" /> :
                                    result.score === 3 ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {result.score >= 4 ? "PASS" : "FAIL / REVIEW"}
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left">
                                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Judge's Reasoning</div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    {result.reasoning}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center opacity-30">
                            <Gavel className="w-24 h-24 text-zinc-400 mb-4" />
                            <p className="text-sm font-medium">Ready to judge</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
