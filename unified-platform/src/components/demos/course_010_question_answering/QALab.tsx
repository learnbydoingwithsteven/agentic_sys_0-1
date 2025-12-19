'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Book, Database, Zap, BookOpen, Search, ArrowRight, Quote, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { answerQuestion, type QAMode } from '@/actions/course_010_question_answering/qa';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';
import ReactMarkdown from 'react-markdown';

export function QALab() {
    const [mode, setMode] = useState<QAMode>('closed_book');
    const [question, setQuestion] = useState("Who is the CEO of Acme Corp?");
    const [context, setContext] = useState("Acme Corp announced today that Jane Doe has been appointed as the new CEO, succeeding John Smith.");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ answer: string, systemPrompt?: string } | null>(null);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const checkModels = async () => {
            setIsChecking(true);
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0 && !itemsContains(available, model)) {
                    setModel(available[0]);
                }
            } catch (err) {
                console.error("Failed to load models", err);
            } finally {
                setIsChecking(false);
            }
        };
        checkModels();
    }, []);

    const itemsContains = (arr: string[], item: string) => arr.includes(item);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await answerQuestion(question, mode, mode === 'rag' ? context : null, model);
            if (res.success) {
                setResult({ answer: res.answer, systemPrompt: res.systemPrompt });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <HelpCircle className="w-5 h-5 text-indigo-500" />
                        <h3>Question Answering</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                        >
                            {models.length === 0 && <option value="llama3.2">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div title={models.length > 0 ? "Models Loaded" : "Checking Models"} className={`w-2 h-2 rounded-full ${models.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg flex text-xs">
                    <button
                        onClick={() => setMode('closed_book')}
                        className={`flex-1 py-1.5 px-2 rounded capitalize font-medium transition-all flex items-center justify-center gap-2 ${mode === 'closed_book'
                                ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Brain className="w-4 h-4" /> Closed Book (Memory)
                    </button>
                    <button
                        onClick={() => setMode('rag')}
                        className={`flex-1 py-1.5 px-2 rounded capitalize font-medium transition-all flex items-center justify-center gap-2 ${mode === 'rag'
                                ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" /> RAG (With Context)
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">

                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto space-y-4">

                    {/* Context Input (RAG Only) */}
                    <AnimatePresence>
                        {mode === 'rag' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                    Knowledge Base / Context
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none h-32 leading-relaxed"
                                    placeholder="Paste relevant information here..."
                                    disabled={loading}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Question Input */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                            Question
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                placeholder="Ask a question..."
                                disabled={loading}
                            />
                            <button
                                disabled={loading || !question.trim()}
                                className="absolute top-2 right-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                            >
                                {loading ? <Sparkles className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                {loading ? 'Thinking...' : 'Ask'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto grid gap-6"
                        >
                            {/* The Answer */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg p-6 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500" /> AI Answer
                                </h4>
                                <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-700 dark:text-zinc-300">
                                    <ReactMarkdown>{result.answer}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Architecture & Prompt Viz */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">System Architecture</h4>

                                <div className="flex flex-col gap-6">
                                    {/* Diagram */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">
                                                Question
                                            </span>
                                            {mode === 'rag' && (
                                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-blue-600">
                                                    + Context
                                                </span>
                                            )}
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-zinc-300" />

                                        <div className="flex flex-col items-center">
                                            <span className={`px-2 py-1 border rounded mb-1 ${mode === 'closed_book'
                                                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-600'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 text-zinc-500'
                                                }`}>
                                                Training Data
                                            </span>
                                            <span className={`px-2 py-1 border rounded ${mode === 'rag'
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 text-zinc-500'
                                                }`}>
                                                In-Context Learning
                                            </span>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600">Answer</span>
                                    </div>

                                    {/* System Prompt View */}
                                    {result.systemPrompt && (
                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-purple-500 font-bold uppercase tracking-wider">
                                                <Quote className="w-3 h-3" /> Constructed System Prompt
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto">
                                                {result.systemPrompt}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
