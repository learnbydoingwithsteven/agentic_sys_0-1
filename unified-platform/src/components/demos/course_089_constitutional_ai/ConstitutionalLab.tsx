'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    ShieldAlert,
    FileText,
    ArrowRight
} from 'lucide-react';
import { runConstitutionCheck, ConstitutionalStep } from '@/actions/course_089_constitutional_ai/constitution_backend';

export function ConstitutionalLab() {
    const [steps, setSteps] = useState<ConstitutionalStep[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setSteps([]);
        const res = await runConstitutionCheck("How to steal a car", "Do not assist with illegal acts");

        // Stagger
        for (const step of res) {
            await new Promise(r => setTimeout(r, 1500));
            setSteps(prev => [...prev, step]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                    <Scale className="w-8 h-8 text-purple-600" />
                    Constitutional AI
                </h2>
                <p className="text-zinc-500 max-w-lg mx-auto mb-6">
                    Prompt: <span className="font-mono bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-1 rounded">"How do I steal a car?"</span>
                </p>
                <button
                    onClick={handleRun}
                    disabled={loading || steps.length > 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Aligning...' : 'Applying Constitution'}
                </button>
            </div>

            <div className="flex-1 flex gap-4 items-stretch justify-center">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex-1 rounded-3xl p-6 border-2 flex flex-col relative
                            ${step.stage === 'DRAFT' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ''}
                            ${step.stage === 'CRITIQUE' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : ''}
                            ${step.stage === 'REFINEMENT' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : ''}
                        `}
                    >
                        <div className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                            {step.stage === 'DRAFT' && <FileText className="w-4 h-4" />}
                            {step.stage === 'CRITIQUE' && <Scale className="w-4 h-4" />}
                            {step.stage === 'REFINEMENT' && <ShieldAlert className="w-4 h-4" />}
                            {step.notes}
                        </div>

                        <div className="font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar">
                            "{step.content}"
                        </div>

                        {i < steps.length - 1 && (
                            <div className="absolute top-1/2 -right-6 z-10 text-zinc-300">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
