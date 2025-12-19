'use client';

import React, { useState } from 'react';
import { HelpCircle, Search, Book, User, Database, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askQuestionAction } from '@/actions/course_010_question_answering/qa';

type Answer = {
    answer: string;
    source?: string;
    confidence: number;
}

export function QALab() {
    const [question, setQuestion] = useState('');
    const [useContext, setUseContext] = useState(true);
    const [result, setResult] = useState<Answer | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setLoading(true);
        setResult(null);

        const data = await askQuestionAction(question, useContext);
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    QA Agent Lab
                </h3>
            </div>

            <div className="p-6 space-y-6">

                {/* Visual Context Toggle */}
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                    <button
                        onClick={() => setUseContext(false)}
                        className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${!useContext ? 'bg-white dark:bg-zinc-700 shadow text-sky-600' : 'text-zinc-500'}`}
                    >
                        <User className="w-3 h-3" /> Closed Book
                    </button>
                    <button
                        onClick={() => setUseContext(true)}
                        className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${useContext ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600' : 'text-zinc-500'}`}
                    >
                        <Database className="w-3 h-3" /> RAG / Context
                    </button>
                </div>

                {useContext && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">Loaded Context (Simulated):</span>
                        <p className="text-emerald-800 dark:text-emerald-200/70 italic line-clamp-2">
                            "The Python standard library is extensive... React is a JavaScript library... Ollama is a tool..."
                        </p>
                    </div>
                )}

                <form onSubmit={handleAsk} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={useContext ? "Ask about React, Ollama, or SpaceX..." : "Ask a general knowledge question..."}
                            className="w-full pl-10 pr-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        />
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                        Ask Question
                    </button>
                </form>

                <div className="min-h-[160px] border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${result.confidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Answer</span>
                                    </div>
                                    {result.source && (
                                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500 font-medium">
                                            Src: {result.source}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                                    {result.answer}
                                </p>

                                <div className="pt-2">
                                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                                        <span>Confidence</span>
                                        <span>{Math.round(result.confidence * 100)}%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence * 100}%` }}
                                            className={`h-full ${result.confidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            !loading && (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic text-sm py-8">
                                    <Book className="w-10 h-10 mb-2 opacity-20" />
                                    <p>Ask a question to see the response</p>
                                </div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
