'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CheckSquare,
    Play,
    Loader2,
    ArrowDown
} from 'lucide-react';
import { generatePlan, executeStep, PlanStep } from '@/actions/course_049_planning/planning_backend';

export function PlanningLab() {
    const [goal, setGoal] = useState("");
    const [plan, setPlan] = useState<PlanStep[]>([]);
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    const handlePlan = async () => {
        if (!goal.trim()) return;
        setIsPlanning(true);
        setPlan([]);
        try {
            const steps = await generatePlan(goal);
            setPlan(steps);
        } finally {
            setIsPlanning(false);
        }
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        const newPlan = [...plan];

        for (let i = 0; i < newPlan.length; i++) {
            newPlan[i].status = 'in-progress';
            setPlan([...newPlan]);

            await executeStep(newPlan[i].id);

            newPlan[i].status = 'completed';
            setPlan([...newPlan]);
        }
        setIsExecuting(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Goal e.g. 'Launch a new website'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isPlanning || isExecuting}
                />
                <button
                    onClick={handlePlan}
                    disabled={isPlanning || isExecuting || !goal}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isPlanning ? 'Planning...' : 'Generate Plan'}
                </button>
            </div>

            {/* Plan Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col items-center">
                {plan.length > 0 ? (
                    <div className="w-full max-w-md space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />

                        {plan.map((step, idx) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`
                                    relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                                    ${step.status === 'completed' ? 'bg-green-50 border-green-500 shadow-sm' : ''}
                                    ${step.status === 'in-progress' ? 'bg-sky-50 border-sky-500 scale-105 shadow-md' : ''}
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
                                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                        {step.description}
                                    </div>
                                    <div className="text-xs text-zinc-500 uppercase font-bold mt-1">
                                        {step.status}
                                    </div>
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
                        disabled={isExecuting || plan.every(s => s.status === 'completed')}
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
