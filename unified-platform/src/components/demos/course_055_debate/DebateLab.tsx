'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Play,
    RefreshCw
} from 'lucide-react';
import { runDebateRound, DebateTurn } from '@/actions/course_055_debate/debate_backend';

export function DebateLab() {
    const [topic, setTopic] = useState("");
    const [history, setHistory] = useState<DebateTurn[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNextTurn = async () => {
        if (!topic) return;
        setIsProcessing(true);
        try {
            const nextTurn = await runDebateRound(topic, history);
            setHistory(prev => [...prev, nextTurn]);
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
                    placeholder="Debate Topic e.g. 'Is AI Dangerous?'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={history.length > 0}
                />
                {history.length === 0 ? (
                    <button
                        onClick={() => handleNextTurn()}
                        disabled={isProcessing || !topic}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        Start Debate
                    </button>
                ) : (
                    <button
                        onClick={() => { setHistory([]); setTopic(""); }}
                        className="bg-zinc-200 hover:bg-zinc-300 text-zinc-600 px-4 rounded-xl"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Arena */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <MessageCircle className="w-96 h-96" />
                </div>

                <AnimatePresence>
                    {history.map((turn, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, x: turn.speaker === 'Pro' ? -20 : 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            className={`flex ${turn.speaker === 'Pro' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`max-w-[70%] p-5 rounded-2xl border shadow-sm relative ${turn.speaker === 'Pro'
                                    ? 'bg-blue-50 border-blue-200 text-blue-900 rounded-bl-none'
                                    : 'bg-rose-50 border-rose-200 text-rose-900 rounded-br-none'
                                }`}>
                                <div className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${turn.speaker === 'Pro'
                                        ? 'left-0 bg-blue-600'
                                        : 'right-0 bg-rose-600'
                                    }`}>
                                    {turn.speaker}
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed">{turn.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Next Turn Control */}
                {history.length > 0 && !isProcessing && (
                    <div className="flex justify-center mt-4 pb-4">
                        <button
                            onClick={handleNextTurn}
                            className="bg-zinc-800 hover:bg-zinc-900 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" /> Continue Debate
                        </button>
                    </div>
                )}

                {isProcessing && (
                    <div className="text-center text-zinc-400 text-sm animate-pulse">Thinking...</div>
                )}
            </div>
        </div>
    );
}
