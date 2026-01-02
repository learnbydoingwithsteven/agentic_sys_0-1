'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Play,
    RefreshCw,
    Bot,
    Gavel,
    Loader2
} from 'lucide-react';
import { runDebateRound, DebateTurn } from '@/actions/course_055_debate/debate_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function DebateLab() {
    const [topic, setTopic] = useState("Is AI Dangerous?");
    const [history, setHistory] = useState<DebateTurn[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isProcessing]);

    const handleNextTurn = async () => {
        if (!topic || !selectedModel) return;
        setIsProcessing(true);
        try {
            const nextTurn = await runDebateRound(topic, history, selectedModel);
            setHistory(prev => [...prev, nextTurn]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Control Panel */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-3 items-center bg-zinc-50 dark:bg-zinc-800/50 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Gavel className="w-5 h-5 text-zinc-400" />
                    <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="Debate Topic e.g. 'Is AI Dangerous?'"
                        className="flex-1 bg-transparent py-3 border-none outline-none font-medium text-zinc-900 dark:text-zinc-100"
                        disabled={history.length > 0}
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer min-w-[140px]"
                        disabled={isProcessing || history.length > 0}
                    >
                        {models.length === 0 && <option value="">Loading models...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    {history.length === 0 ? (
                        <button
                            onClick={handleNextTurn}
                            disabled={isProcessing || !topic || !selectedModel}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 shadow-lg shadow-purple-900/20 active:scale-95 flex items-center gap-2"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                            Start Debate
                        </button>
                    ) : (
                        <button
                            onClick={() => { setHistory([]); setTopic(""); }}
                            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-4 rounded-xl transition-colors"
                            title="Reset Debate"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Arena */}
            <div
                ref={scrollRef}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative"
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <MessageCircle className="w-96 h-96" />
                </div>

                {history.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 opacity-50">
                        <Bot className="w-16 h-16 mb-4" />
                        <p className="font-medium text-lg">Enter a topic to start the debate</p>
                        <p className="text-sm">Two AI agents will debate the pros and cons.</p>
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {history.map((turn, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, x: turn.speaker === 'Pro' ? -20 : 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            className={`flex ${turn.speaker === 'Pro' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`max-w-[75%] p-5 rounded-2xl border shadow-sm relative ${turn.speaker === 'Pro'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 rounded-bl-none ml-2'
                                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 rounded-br-none mr-2'
                                }`}>
                                <div className={`absolute -top-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1 ${turn.speaker === 'Pro'
                                    ? 'left-0 bg-blue-600'
                                    : 'right-0 bg-rose-600'
                                    }`}>
                                    <Bot className="w-3 h-3" /> {turn.speaker}
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{turn.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex ${history.length % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm opacity-50 ${history.length % 2 === 0
                            ? 'bg-blue-600'
                            : 'bg-rose-600'
                            }`}>
                            <Loader2 className="w-3 h-3 animate-spin" /> {history.length % 2 === 0 ? 'Pro' : 'Con'} is thinking...
                        </div>
                    </motion.div>
                )}

                {/* Continue Control (Floating) */}
                {history.length > 0 && !isProcessing && (
                    <div className="sticky bottom-0 flex justify-center pt-4 pb-2 z-10">
                        <button
                            onClick={handleNextTurn}
                            className={`
                                px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 text-white
                                ${history.length % 2 === 0
                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}
                            `}
                        >
                            <Play className="w-4 h-4 fill-current" />
                            {history.length % 2 === 0 ? "Pro's Turn" : "Con's Turn"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
