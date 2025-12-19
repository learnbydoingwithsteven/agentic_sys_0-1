'use client';

import React, { useState } from 'react';
import { FileText, AlignLeft, Scissors, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeTextAction } from '@/actions/course_009_summarization/summarize';
import { cn } from '@/lib/utils';

export function SummarizationLab() {
    const [input, setInput] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

    const handleSummarize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setSummary('');

        const result = await summarizeTextAction(input, length);
        setSummary(result);
        setLoading(false);
    };

    const fillSample = () => {
        setInput("Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals. Leading AI textbooks define the field as the study of \"intelligent agents\": any system that perceives its environment and takes actions that maximize its chance of achieving its goals. Some popular accounts use the term \"artificial intelligence\" to describe machines that mimic \"cognitive\" functions that humans associate with the human mind, such as \"learning\" and \"problem solving\". AI applications include advanced web search engines (e.g., Google), recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Tesla), automated decision-making and competing at the highest level in strategic game systems (such as chess and Go).");
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-yellow-500" />
                    Summarization Lab
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Input Text</label>
                        <button onClick={fillSample} className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">Auto-Fill</button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste a long article or document here..."
                        className="w-full h-32 p-3 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Summary Length</label>
                    <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        {['short', 'medium', 'long'].map((len) => (
                            <button
                                key={len}
                                onClick={() => setLength(len as 'short' | 'medium' | 'long')}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                                    length === len
                                        ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {len}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSummarize}
                    disabled={loading || !input.trim()}
                    className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Summarize
                </button>

                <div className="min-h-[160px] border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <AnimatePresence mode="wait">
                        {summary ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <AlignLeft className="w-3 h-3" /> Output
                                </h4>
                                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {summary}
                                </p>
                            </motion.div>
                        ) : (
                            !loading && (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic text-sm py-8">
                                    <FileText className="w-10 h-10 mb-2 opacity-20" />
                                    <p>Summary will appear here</p>
                                </div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
