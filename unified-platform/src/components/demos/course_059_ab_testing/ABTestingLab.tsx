'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Split,
    ThumbsUp,
    RefreshCw
} from 'lucide-react';
import { runABTest, ABResult } from '@/actions/course_059_ab_testing/ab_backend';

export function ABTestingLab() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState<ABResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [votesA, setVotesA] = useState(0);
    const [votesB, setVotesB] = useState(0);
    const [voted, setVoted] = useState(false);

    const handleRun = async () => {
        if (!prompt) return;
        setIsProcessing(true);
        setResult(null);
        setVoted(false);
        try {
            const res = await runABTest(prompt);
            setResult(res);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVote = (variant: 'A' | 'B') => {
        if (voted) return;
        if (variant === 'A') setVotesA(p => p + 1);
        else setVotesB(p => p + 1);
        setVoted(true);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Test Prompt e.g. 'How do I tie a tie?'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={handleRun}
                    disabled={isProcessing || !prompt}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Generating Variants...' : 'Run Test'}
                </button>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-center gap-12 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                <div>Model A Wins: <span className="text-zinc-900 dark:text-zinc-100 text-lg ml-2">{votesA}</span></div>
                <div>Model B Wins: <span className="text-zinc-900 dark:text-zinc-100 text-lg ml-2">{votesB}</span></div>
            </div>

            {/* Comparison View */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Variant A */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm relative">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-b border-zinc-100 dark:border-zinc-800 font-bold text-zinc-500 text-xs uppercase flex justify-between">
                        Variant A (Concise)
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {result?.responseA || (isProcessing ? <div className="animate-pulse bg-zinc-100 h-4 w-3/4 rounded mt-2" /> : "")}
                    </div>
                    {result && !voted && (
                        <button
                            onClick={() => handleVote('A')}
                            className="absolute bottom-4 right-4 bg-zinc-100 hover:bg-green-100 hover:text-green-700 p-2 rounded-full transition-colors"
                        >
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Variant B */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm relative">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-b border-zinc-100 dark:border-zinc-800 font-bold text-zinc-500 text-xs uppercase flex justify-between">
                        Variant B (Friendly)
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {result?.responseB || (isProcessing ? <div className="animate-pulse bg-zinc-100 h-4 w-3/4 rounded mt-2" /> : "")}
                    </div>
                    {result && !voted && (
                        <button
                            onClick={() => handleVote('B')}
                            className="absolute bottom-4 right-4 bg-zinc-100 hover:bg-green-100 hover:text-green-700 p-2 rounded-full transition-colors"
                        >
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
