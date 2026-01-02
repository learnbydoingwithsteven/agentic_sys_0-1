'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Zap,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { runFewShotTask } from '@/actions/course_066_meta_learning/meta_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function MetaLab() {
    const [examples, setExamples] = useState<{ input: string, output: string }[]>([
        { input: "Good morning", output: "Bon matin" },
        { input: "Good night", output: "Bonne nuit" }
    ]);
    const [newExInput, setNewExInput] = useState("");
    const [newExOutput, setNewExOutput] = useState("");

    const [query, setQuery] = useState("");
    const [result, setResult] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleAdd = () => {
        if (newExInput && newExOutput) {
            setExamples([...examples, { input: newExInput, output: newExOutput }]);
            setNewExInput("");
            setNewExOutput("");
        }
    };

    const handleRemove = (idx: number) => {
        setExamples(examples.filter((_, i) => i !== idx));
    };

    const handleRun = async () => {
        if (!query || !selectedModel) return;
        setIsProcessing(true);
        setResult("");
        try {
            const res = await runFewShotTask(examples, query, selectedModel);
            setResult(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex gap-8 h-[700px]">
            {/* Left: Support Set (Context) */}
            <div className="w-1/3 bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                <h3 className="font-bold text-zinc-500 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Support Set (Examples)
                </h3>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-4">
                    {examples.map((ex, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 relative group text-sm">
                            <div className="font-bold text-indigo-600 dark:text-indigo-400">In: {ex.input}</div>
                            <div className="text-zinc-600 dark:text-zinc-300">Out: {ex.output}</div>
                            <button
                                onClick={() => handleRemove(i)}
                                className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl space-y-2">
                    <input
                        value={newExInput}
                        onChange={e => setNewExInput(e.target.value)}
                        placeholder="New Input (e.g. Hello)"
                        className="w-full bg-white dark:bg-zinc-900 border-none rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <input
                        value={newExOutput}
                        onChange={e => setNewExOutput(e.target.value)}
                        placeholder="New Output (e.g. Bonjour)"
                        className="w-full bg-white dark:bg-zinc-900 border-none rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newExInput || !newExOutput}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" /> Add Shot
                    </button>
                </div>
            </div>

            {/* Right: Query (Inference) */}
            <div className="flex-1 flex flex-col justify-center gap-8 px-12">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Meta-Learner</h2>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
                            disabled={isProcessing}
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <p className="text-zinc-500 text-lg">
                        I learn the pattern from your examples instantly. No training required.
                    </p>
                </div>

                <div className="relative">
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Enter Query..."
                        className="w-full text-2xl font-light bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 py-4 outline-none focus:border-indigo-500 transition-colors placeholder-zinc-300"
                    />
                    <button
                        onClick={handleRun}
                        disabled={isProcessing || !query || !selectedModel}
                        className="absolute right-0 top-4 bg-black dark:bg-white text-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>

                <div className="h-32">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 p-6 rounded-2xl text-2xl font-serif text-center"
                        >
                            {result}
                        </motion.div>
                    ) : isProcessing && (
                        <div className="text-center text-zinc-400 animate-pulse">Inferring pattern...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
