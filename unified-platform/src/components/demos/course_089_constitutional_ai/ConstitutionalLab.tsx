'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    ShieldAlert,
    FileText,
    ArrowRight,
    Sparkles,
    UserX
} from 'lucide-react';
import { runConstitutionalFlow, ConstitutionalStep } from '@/actions/course_089_constitutional_ai/constitution_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ConstitutionalLab() {
    const [query, setQuery] = useState("Reject this job candidate (John Doe).");
    const [principle, setPrinciple] = useState("Be professional, kind, and encourage future application.");
    const [steps, setSteps] = useState<ConstitutionalStep[]>([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        setSteps([]);
        const res = await runConstitutionalFlow(query, principle, selectedModel);

        // Stagger for effect
        for (const step of res) {
            await new Promise(r => setTimeout(r, 1000));
            setSteps(prev => [...prev, step]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Scale className="w-5 h-5 text-purple-500" />
                        Constitutional AI Guardian
                    </h3>
                    <p className="text-zinc-500 text-sm">Aligns AI outputs with a defined set of principles (The Constitution).</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Inputs */}
                <div className="w-80 flex flex-col gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shrink-0">
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">User Intent</label>
                        <textarea
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-purple-500 font-medium text-sm h-24 resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">The Constitution (Principle)</label>
                        <textarea
                            value={principle}
                            onChange={e => setPrinciple(e.target.value)}
                            className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-xl outline-none focus:ring-2 ring-purple-500 font-medium text-sm h-32 resize-none text-purple-800 dark:text-purple-200"
                        />
                    </div>

                    <button
                        onClick={handleRun}
                        disabled={loading || !selectedModel}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-auto hover:scale-105 active:scale-95"
                    >
                        {loading ? <Scale className="animate-bounce fill-current w-5 h-5" /> : <Sparkles className="fill-current w-5 h-5" />}
                        {loading ? 'Aligning...' : 'Enforce Norms'}
                    </button>
                </div>

                {/* Pipeline View */}
                <div className="flex-1 flex gap-4 items-stretch justify-center overflow-x-auto p-4 custom-scrollbar">
                    <AnimatePresence>
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                                className={`
                                    w-1/3 min-w-[250px] rounded-3xl p-6 border-2 flex flex-col relative shadow-md
                                    ${step.stage === 'DRAFT' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900' : ''}
                                    ${step.stage === 'CRITIQUE' ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900' : ''}
                                    ${step.stage === 'REFINEMENT' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' : ''}
                                `}
                            >
                                <div className={`
                                    text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2
                                    ${step.stage === 'DRAFT' ? 'text-red-500' : ''}
                                    ${step.stage === 'CRITIQUE' ? 'text-yellow-600' : ''}
                                    ${step.stage === 'REFINEMENT' ? 'text-emerald-500' : ''}
                                `}>
                                    {step.stage === 'DRAFT' && <UserX className="w-4 h-4" />}
                                    {step.stage === 'CRITIQUE' && <Scale className="w-4 h-4" />}
                                    {step.stage === 'REFINEMENT' && <ShieldAlert className="w-4 h-4" />}
                                    {step.notes}
                                </div>

                                <div className="font-mono text-xs leading-relaxed overflow-y-auto custom-scrollbar flex-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
                                    "{step.content}"
                                </div>

                                {i < steps.length - 1 && (
                                    <div className="absolute top-1/2 -right-5 z-10 text-zinc-300 dark:text-zinc-700">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {steps.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center opacity-30 text-zinc-500">
                            <Scale className="w-24 h-24 mb-4" />
                            <div>Ready to audit alignment...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
