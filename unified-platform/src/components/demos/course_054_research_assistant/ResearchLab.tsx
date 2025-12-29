'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    BookOpen,
    FileText,
    Link as LinkIcon
} from 'lucide-react';
import { runResearch, ResearchResult } from '@/actions/course_054_research_assistant/research_backend';

export function ResearchLab() {
    const [topic, setTopic] = useState("");
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async () => {
        if (!topic) return;
        setIsProcessing(true);
        setResult(null);
        try {
            const res = await runResearch(topic);
            setResult(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Research Topic e.g. 'Quantum Computing'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={handleRun}
                    disabled={isProcessing || !topic}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Researcher Working...' : 'Start Research'}
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                {/* Sources Column */}
                <div className="md:w-1/3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Retrieved Sources
                    </h3>
                    <div className="space-y-3">
                        {result ? result.sources.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                            >
                                <div className="text-blue-600 dark:text-blue-400 font-bold text-sm truncate mb-1">{s.title}</div>
                                <div className="text-zinc-500 text-xs truncate mb-2 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {s.url}</div>
                                <div className="text-zinc-700 dark:text-zinc-300 text-xs italic line-clamp-2">"{s.snippet}"</div>
                            </motion.div>
                        )) : (
                            <div className="text-center text-zinc-400 text-xs mt-10">Waiting to retrieve...</div>
                        )}
                    </div>
                </div>

                {/* Synthesis Column */}
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar shadow-inner">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs mb-6 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Synthesized Report
                    </h3>

                    {result ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="prose dark:prose-invert prose-sm max-w-none"
                        >
                            <h2 className="text-xl font-bold mb-4 capitalize">{topic} Report</h2>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {result.synthesis}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="text-center text-zinc-400 mt-20 opacity-50">
                            <BookOpen className="w-16 h-16 mx-auto mb-2" />
                            <p>Report will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
