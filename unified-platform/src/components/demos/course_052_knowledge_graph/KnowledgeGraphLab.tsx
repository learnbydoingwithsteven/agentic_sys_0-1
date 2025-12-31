'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Database,
    Play,
    Cpu,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { extractTriples, Triple } from '@/actions/course_052_knowledge_graph/kg_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function KnowledgeGraphLab() {
    const [text, setText] = useState("Elon Musk is the CEO of Tesla. Tesla is located in Austin, Texas. Elon Musk also founded SpaceX.");
    const [triples, setTriples] = useState<Triple[]>([]);
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

    const handleRun = async () => {
        if (!text || !selectedModel) return;
        setIsProcessing(true);
        setTriples([]);
        try {
            const res = await extractTriples(text, selectedModel);
            setTriples(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[750px]">
            {/* Input */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Text e.g. 'Elon Musk is the CEO of Tesla'"
                    className="flex-1 bg-transparent px-4 py-2 border-none outline-none text-zinc-900 dark:text-zinc-100 resize-none h-20"
                    disabled={isProcessing}
                />

                {/* Model Selector */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                        disabled={isProcessing}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleRun}
                    disabled={isProcessing || !text || !selectedModel}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessing ? 'Extracting...' : 'Build Graph'}
                </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex items-center justify-center p-8">
                {isProcessing ? (
                    <div className="text-center text-zinc-400">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-indigo-500" />
                        <p className="font-bold">Extracting knowledge triples...</p>
                        <p className="text-sm mt-2">Analyzing entities and relationships</p>
                    </div>
                ) : triples.length > 0 ? (
                    <div className="relative w-full h-full flex flex-col gap-8 overflow-y-auto">
                        {triples.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="flex items-center justify-center gap-4"
                            >
                                {/* Subject Node */}
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-center p-3 shadow-lg z-10 font-bold text-sm text-white">
                                    {t.subject}
                                </div>

                                {/* Predicate Arrow */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-zinc-200 dark:bg-zinc-700 px-4 py-2 rounded-lg">
                                        <div className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 uppercase">
                                            {t.predicate}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-zinc-400" />
                                </div>

                                {/* Object Node */}
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-center p-3 shadow-lg z-10 font-bold text-sm text-white">
                                    {t.object}
                                </div>
                            </motion.div>
                        ))}

                        {/* Triple Count */}
                        <div className="text-center text-zinc-400 text-sm mt-4">
                            <Database className="w-5 h-5 inline mr-2" />
                            {triples.length} {triples.length === 1 ? 'triple' : 'triples'} extracted
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 opacity-50">
                        <Share2 className="w-16 h-16 mx-auto mb-2" />
                        <p>Waiting for unstructured text...</p>
                        <p className="text-sm mt-2">Enter text above to extract knowledge graph triples</p>
                    </div>
                )}
            </div>
        </div>
    );
}
