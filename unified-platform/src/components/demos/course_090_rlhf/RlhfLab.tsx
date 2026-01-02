'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ThumbsUp,
    Trophy,
    TrendingUp,
    Shuffle
} from 'lucide-react';
import { generateRLHFPair, submitPreference, RLHFPair } from '@/actions/course_090_rlhf/rlhf_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function RlhfLab() {
    const [pair, setPair] = useState<RLHFPair | null>(null);
    const [score, setScore] = useState(500);
    const [round, setRound] = useState(0);
    const [loading, setLoading] = useState(true);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const loadNew = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const p = await generateRLHFPair(selectedModel);
        setPair(p);
        setLoading(false);
    };

    // Initial Load
    useEffect(() => {
        if (selectedModel) loadNew();
    }, [selectedModel]);

    const handleVote = async (choice: 'A' | 'B') => {
        if (!pair) return;
        const newScore = await submitPreference(pair.id, choice);
        setScore(newScore);
        setRound(r => r + 1);
        setPair(null);
        loadNew();
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-indigo-500" />
                        RLHF Data Collector
                    </h3>
                    <p className="text-zinc-500 text-sm">Human Feedback Loop: Vote to train the Reward Model.</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Global Reward</div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2 justify-end">
                        <TrendingUp className="w-5 h-5" /> {score}
                    </div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">Model: {selectedModel}</div>
                </div>
            </div>

            {/* Prompt Display */}
            <div className="text-center font-bold text-xl text-zinc-700 dark:text-zinc-200 py-4">
                {pair ? `"${pair.prompt}"` : (!loading && "Select a model to start")}
            </div>

            {/* Voting Arena */}
            <div className="flex-1 flex gap-8 items-stretch justify-center relative">
                {loading || !pair ? (
                    <div className="flex flex-col items-center justify-center w-full text-zinc-400 gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="animate-pulse font-bold">Generating Candidate Pairs...</div>
                    </div>
                ) : (
                    <>
                        {/* Option A */}
                        <OptionCard
                            text={pair.optionA}
                            label="A"
                            color="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                            onClick={() => handleVote('A')}
                        />

                        <div className="flex items-center justify-center font-black text-zinc-300 dark:text-zinc-700 text-2xl z-10 bg-white dark:bg-zinc-950 p-4 rounded-full border border-zinc-200 dark:border-zinc-800 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
                            VS
                        </div>

                        {/* Option B */}
                        <OptionCard
                            text={pair.optionB}
                            label="B"
                            color="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800"
                            onClick={() => handleVote('B')}
                        />
                    </>
                )}
            </div>

            <div className="text-center text-zinc-400 text-sm">
                Pick the response that is more helpful, honest, and harmless (3H).
            </div>
        </div>
    );
}

function OptionCard({ text, label, color, onClick }: { text: string, label: string, color: string, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex-1 rounded-3xl border-2 p-8 flex flex-col justify-between text-left shadow-lg hover:shadow-2xl transition-all ${color}`}
        >
            <div className="font-medium text-sm md:text-base leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 h-full overflow-y-auto custom-scrollbar">
                {text}
            </div>
            <div className="flex items-center gap-3 font-bold opacity-60 mt-6 pt-6 border-t border-black/5 dark:border-white/5 w-full">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg">{label}</div>
                <span>Vote for Option {label}</span>
            </div>
        </motion.button>
    );
}
