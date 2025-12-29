'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Database,
    Play
} from 'lucide-react';
import { extractTriples, Triple } from '@/actions/course_052_knowledge_graph/kg_backend';

export function KnowledgeGraphLab() {
    const [text, setText] = useState("");
    const [triples, setTriples] = useState<Triple[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async () => {
        if (!text) return;
        setIsProcessing(true);
        try {
            const res = await extractTriples(text);
            setTriples(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Text e.g. 'Elon Musk is the CEO of Tesla'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={handleRun}
                    disabled={isProcessing || !text}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Extracting...' : 'Build Graph'}
                </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex items-center justify-center">
                {triples.length > 0 ? (
                    <div className="relative w-full h-full p-12 flex flex-wrap content-center justify-center gap-12">
                        {triples.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex items-center"
                            >
                                {/* Subject Node */}
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-4 border-indigo-500 flex items-center justify-center text-center p-2 shadow-lg z-10 font-bold text-sm">
                                    {t.subject}
                                </div>

                                {/* Predicate Arrow */}
                                <div className="w-32 h-1 bg-zinc-300 dark:bg-zinc-700 relative flex items-center justify-center">
                                    <div className="absolute -top-3 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-xs font-mono text-zinc-500 uppercase">
                                        {t.predicate}
                                    </div>
                                </div>

                                {/* Object Node */}
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-4 border-emerald-500 flex items-center justify-center text-center p-2 shadow-lg z-10 font-bold text-sm">
                                    {t.object}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 opacity-50">
                        <Share2 className="w-16 h-16 mx-auto mb-2" />
                        <p>Waiting for unstructured text...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
