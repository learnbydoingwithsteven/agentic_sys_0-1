'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Sparkles,
    Trash2,
    ThumbsDown,
    Loader2
} from 'lucide-react';
import { askAgent, teachAgent, resetBrain } from '@/actions/course_062_continuous_learning/learning_backend';
import { getAvailableModels } from '@/lib/llm_helper';

interface Message {
    role: 'user' | 'agent';
    text: string;
    isLearned?: boolean;
}

export function LearningLab() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Message[]>([]);
    const [isCorrectionMode, setIsCorrectionMode] = useState(false);
    const [correctionTarget, setCorrectionTarget] = useState(""); // The question being corrected
    const [isThinking, setIsThinking] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleSend = async () => {
        if (!input || !selectedModel) return;

        // If in correction mode, we are sending the "Truth"
        if (isCorrectionMode) {
            await teachAgent(correctionTarget, input);
            setHistory(prev => [
                ...prev,
                { role: 'user', text: `Correction: ${input}` },
                { role: 'agent', text: "Thank you! I have updated my knowledge base." }
            ]);
            setIsCorrectionMode(false);
            setCorrectionTarget("");
            setInput("");
            return;
        }

        // Normal Question
        const userMsg = input;
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsThinking(true);

        try {
            const res = await askAgent(userMsg, selectedModel);
            setHistory(prev => [...prev, { role: 'agent', text: res.answer, isLearned: res.fromMemory }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleReset = async () => {
        await resetBrain();
        setHistory([]);
        setIsCorrectionMode(false);
    };

    const startCorrection = (question: string) => {
        setIsCorrectionMode(true);
        setCorrectionTarget(question);
        setInput(""); // Clear input for the correction
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-bold">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Continuous Learning Module
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
                        disabled={isThinking}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <button onClick={handleReset} className="text-zinc-400 hover:text-red-500 transition-colors" title="Reset Memory">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {history.length === 0 && (
                    <div className="text-center text-zinc-400 mt-20 opacity-50">
                        Try asking: "What is the capital of Canada?"
                    </div>
                )}

                {history.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-700' : 'bg-indigo-600 text-white'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={`
                            max-w-[70%] p-3 rounded-2xl text-sm relative group
                            ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' : 'bg-white dark:bg-indigo-900/20 border border-zinc-200 dark:border-indigo-800 text-zinc-800 dark:text-zinc-200'}
                        `}>
                            {msg.text}

                            {/* Learned Badge */}
                            {msg.isLearned && (
                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    LEARNED
                                </span>
                            )}

                            {/* Correction Trigger */}
                            {msg.role === 'agent' && !msg.isLearned && !msg.text.includes("Thank you") && i > 0 && history[i - 1].role === 'user' && !isCorrectionMode && (
                                <button
                                    onClick={() => startCorrection(history[i - 1].text)}
                                    className="opacity-0 group-hover:opacity-100 absolute -bottom-3 -right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full shadow-sm transition-all"
                                    title="That's wrong! Correct it."
                                >
                                    <ThumbsDown className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            <div className={`
                p-2 rounded-2xl border shadow-sm transition-colors
                ${isCorrectionMode
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                    : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
                }
            `}>
                {isCorrectionMode && (
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 px-4">
                        Teaching Mode: What is the correct answer?
                    </div>
                )}
                <div className="flex">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder={isCorrectionMode ? "Enter the fact..." : "Ask a question..."}
                        className="flex-1 bg-transparent px-4 border-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
                        disabled={isThinking}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input || isThinking || !selectedModel}
                        className={`
                            px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 text-white flex items-center gap-2
                            ${isCorrectionMode ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                        `}
                    >
                        {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isCorrectionMode ? 'Teach' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}
