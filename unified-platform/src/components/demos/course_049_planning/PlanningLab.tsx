'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CheckSquare,
    Play,
    Loader2,
    ArrowDown,
    Cpu,
    Clock
} from 'lucide-react';
import { generatePlan, executeStep, PlanStep } from '@/actions/course_049_planning/planning_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function PlanningLab() {
    const [goal, setGoal] = useState("Launch a new AI-powered mobile app");
    const [plan, setPlan] = useState<PlanStep[]>([]);
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResults, setExecutionResults] = useState<Record<number, string>>({});

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handlePlan = async () => {
        if (!goal.trim() || !selectedModel) return;
        setIsPlanning(true);
        setPlan([]);
        setExecutionResults({});
        try {
            const steps = await generatePlan(goal, selectedModel);
            setPlan(steps);
        } finally {
            setIsPlanning(false);
        }
    };

    const handleExecute = async () => {
        if (!selectedModel) return;
        setIsExecuting(true);
        const newPlan = [...plan];
        const results: Record<number, string> = {};

        for (let i = 0; i < newPlan.length; i++) {
            newPlan[i].status = 'in-progress';
            setPlan([...newPlan]);

            const result = await executeStep(newPlan[i].id, selectedModel);
            results[newPlan[i].id] = result;
            setExecutionResults({ ...results });

            newPlan[i].status = 'completed';
            setPlan([...newPlan]);
        }
        setIsExecuting(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[750px]">
            {/* Input */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Goal e.g. 'Launch a new website'"
                    className="flex-1 bg-transparent px-4 border-none outline-none text-zinc-900 dark:text-zinc-100"
                    disabled={isPlanning || isExecuting}
                />

                {/* Model Selector */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                        disabled={isPlanning || isExecuting}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handlePlan}
                    disabled={isPlanning || isExecuting || !goal || !selectedModel}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isPlanning ? 'Planning...' : 'Generate Plan'}
                </button>
            </div>

            {/* Plan Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col items-center">
                {plan.length > 0 ? (
                    <div className="w-full max-w-2xl space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />

                        {plan.map((step, idx) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`
                                    relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all
                                    ${step.status === 'completed' ? 'bg-green-50 border-green-500 shadow-sm dark:bg-green-900/20' : ''}
                                    ${step.status === 'in-progress' ? 'bg-sky-50 border-sky-500 scale-105 shadow-md dark:bg-sky-900/20' : ''}
                                    ${step.status === 'pending' ? 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 opacity-80' : ''}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0
                                    ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                                    ${step.status === 'in-progress' ? 'bg-sky-500 text-white animate-pulse' : ''}
                                    ${step.status === 'pending' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : ''}
                                `}>
                                    {step.status === 'completed' ? <CheckSquare className="w-6 h-6" /> : step.id}
                                </div>

                                <div className="flex-1">
                                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                                        {step.description}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1 text-zinc-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{step.estimatedDuration}</span>
                                        </div>

                                        {step.dependencies.length > 0 && (
                                            <div className="text-zinc-400">
                                                Depends on: {step.dependencies.join(', ')}
                                            </div>
                                        )}

                                        <div className={`uppercase font-bold ${step.status === 'completed' ? 'text-green-600' :
                                                step.status === 'in-progress' ? 'text-sky-600' :
                                                    'text-zinc-400'
                                            }`}>
                                            {step.status}
                                        </div>
                                    </div>

                                    {/* Execution Result */}
                                    {executionResults[step.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 italic bg-zinc-100 dark:bg-zinc-800 p-2 rounded"
                                        >
                                            ✓ {executionResults[step.id]}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 mt-20 opacity-50">
                        <Calendar className="w-16 h-16 mx-auto mb-2" />
                        <p>No plan active.</p>
                    </div>
                )}
            </div>

            {plan.length > 0 && (
                <div className="flex justify-center">
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || plan.every(s => s.status === 'completed') || !selectedModel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                    >
                        {isExecuting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        {isExecuting ? 'Executing Agent...' : 'Execute Plan'}
                    </button>
                </div>
            )}
        </div>
    );
}
