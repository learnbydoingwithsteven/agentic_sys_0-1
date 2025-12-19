'use client';

import React, { useState } from 'react';
import { Heart, Frown, Meh, Smile, Send, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSentimentAction } from '@/actions/course_007_sentiment_analysis/sentiment';

type Result = {
    score: number;
    label: string;
    emotions: string[];
};

export function SentimentLab() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        const res = await analyzeSentimentAction(input);
        setResult(res);
        setLoading(false);
    };

    const getIcon = (label: string) => {
        if (label === 'Positive') return <Smile className="w-12 h-12 text-green-500" />;
        if (label === 'Negative') return <Frown className="w-12 h-12 text-red-500" />;
        return <Meh className="w-12 h-12 text-yellow-500" />;
    };

    const getGradient = (score: number) => {
        // Map -1 to 1 to a gradient
        const pct = ((score + 1) / 2) * 100; // 0 to 100
        return `linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)`;
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Sentiment Lab
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <form onSubmit={handleAnalyze} className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type something emotional (e.g., 'I absolutely love this product!')..."
                            className="w-full h-24 p-3 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        Analyze Emotion
                    </button>
                </form>

                <div className="min-h-[140px] flex items-center justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full text-center"
                            >
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    className="mb-4 inline-block"
                                >
                                    {getIcon(result.label)}
                                </motion.div>

                                <h4 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">{result.label}</h4>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">Score: {result.score.toFixed(2)}</div>

                                {/* Meter */}
                                <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full w-full max-w-[200px] mx-auto mb-6">
                                    <div
                                        className="absolute top-0 bottom-0 w-2 h-4 -mt-1 bg-zinc-900 dark:bg-white border-2 border-white dark:border-zinc-900 shadow-sm rounded-full transition-all duration-500"
                                        style={{ left: `${((result.score + 1) / 2) * 100}%` }}
                                    />
                                    <div className="absolute inset-0 rounded-full opacity-30" style={{ background: getGradient(result.score) }} />
                                </div>

                                {/* Emotions */}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {result.emotions.map(emo => (
                                        <span key={emo} className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> {emo}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {!result && !loading && (
                            <div className="text-zinc-400 italic text-sm text-center">
                                <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                Results will appear here
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
