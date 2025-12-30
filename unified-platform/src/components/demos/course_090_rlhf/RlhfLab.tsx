'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ThumbsUp,
    Trophy,
    TrendingUp
} from 'lucide-react';
import { getTrainingPair, submitPreference, RLHFPair } from '@/actions/course_090_rlhf/rlhf_backend';

export function RlhfLab() {
    const [pair, setPair] = useState<RLHFPair | null>(null);
    const [score, setScore] = useState(50);
    const [round, setRound] = useState(0);

    useEffect(() => {
        loadNew();
    }, []);

    const loadNew = async () => {
        const p = await getTrainingPair();
        setPair(p);
    };

    const handleVote = async (choice: 'A' | 'B') => {
        const newScore = Math.min(100, score + 10);
        setScore(newScore);
        setRound(r => r + 1);
        setPair(null);
        setTimeout(loadNew, 500);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Scoreboard */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        RLHF Trainer
                    </h3>
                    <p className="text-zinc-500 text-sm">Round: {round + 1}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Alignment Score</div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> {score}
                    </div>
                </div>
            </div>

            {/* Voting Arena */}
            <div className="flex-1 flex gap-8 items-center justify-center">
                {!pair ? (
                    <div className="animate-pulse text-zinc-400 font-bold">Loading Comparison Pair...</div>
                ) : (
                    <>
                        <OptionCard
                            text={pair.optionA}
                            label="A"
                            color="bg-blue-50 dark:bg-blue-900/10 border-blue-200"
                            onClick={() => handleVote('A')}
                        />
                        <div className="font-black text-zinc-300 text-xl">VS</div>
                        <OptionCard
                            text={pair.optionB}
                            label="B"
                            color="bg-orange-50 dark:bg-orange-900/10 border-orange-200"
                            onClick={() => handleVote('B')}
                        />
                    </>
                )}
            </div>

            <div className="text-center text-zinc-400 text-sm">
                Pick the response that is more helpful, honest, and harmless.
            </div>
        </div>
    );
}

function OptionCard({ text, label, color, onClick }: { text: string, label: string, color: string, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex-1 h-full max-h-80 rounded-3xl border-2 p-8 flex flex-col justify-between text-left shadow-lg hover:shadow-xl transition-all ${color}`}
        >
            <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
                "{text}"
            </div>
            <div className="flex items-center gap-2 font-bold opacity-60">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">{label}</div>
                Vote for {label}
            </div>
        </motion.button>
    );
}
