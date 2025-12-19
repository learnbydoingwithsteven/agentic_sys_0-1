'use client';

import React, { useState } from 'react';
import { Smile, Frown, Meh, Zap, Search, ThumbsUp, ThumbsDown, Activity, Heart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSentiment, type SentimentResult } from '@/actions/course_007_sentiment_analysis/sentiment';

const QUICK_TEMPLATES = [
    "I absolutely love the new design! It's so fresh and easy to use.",
    "The food was delicious, but the service was terrible and slow.",
    "I'm deeply disappointed with the delay. This is unacceptable.",
    "It's okay, nothing special but gets the job done.",
    "Wow! I can't believe I won the lottery! I'm shaking!"
];

export function SentimentLab() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SentimentResult | null>(null);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await analyzeSentiment(input);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to map emotions to colors and icons
    const getEmotionConfig = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'joy': return { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: <Smile className="w-6 h-6" /> };
            case 'anger': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: <AlertCircle className="w-6 h-6" /> };
            case 'sadness': return { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: <Frown className="w-6 h-6" /> };
            case 'fear': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: <Activity className="w-6 h-6" /> };
            case 'surprise': return { color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30', icon: <Zap className="w-6 h-6" /> };
            default: return { color: 'text-zinc-500', bg: 'bg-zinc-100 dark:bg-zinc-800', icon: <Meh className="w-6 h-6" /> };
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[750px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Sentiment Analyzer</h3>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">
                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                        Analyze Emotion & Tone
                    </label>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type something emotional... e.g., 'I love this product but shipping was slow.'"
                            disabled={loading}
                            rows={3}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-sm resize-none"
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>

                    {/* Quick Templates */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {QUICK_TEMPLATES.map((t, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setInput(t)}
                                className="text-[10px] px-2 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-md transition-colors"
                            >
                                "{t.substring(0, 30)}..."
                            </button>
                        ))}
                    </div>
                </form>

                {/* Result Visualization */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto space-y-6"
                        >
                            {/* Score Meter */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Sentiment Score</h4>
                                    <span className={`text-2xl font-black ${result.score > 0.2 ? 'text-emerald-500' : result.score < -0.2 ? 'text-rose-500' : 'text-zinc-500'
                                        }`}>
                                        {result.score > 0 ? '+' : ''}{result.score.toFixed(2)}
                                    </span>
                                </div>
                                {/* Bar representation */}
                                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-300 dark:bg-zinc-700 z-10" /> {/* Center Marker */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.abs(result.score) * 50}%`, x: result.score >= 0 ? '0%' : '-100%' }}
                                        className={`absolute h-full top-0 left-1/2 rounded-full ${result.score >= 0 ? 'bg-emerald-500 origin-left' : 'bg-rose-500 origin-right'}`}
                                        style={{ marginLeft: result.score >= 0 ? 0 : 0 }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                                    <span>Negative (-1.0)</span>
                                    <span>Neutral (0.0)</span>
                                    <span>Positive (+1.0)</span>
                                </div>
                            </div>

                            {/* Emotion & Explanation */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Emotion Card */}
                                <div className={`p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center gap-2 ${getEmotionConfig(result.emotion).bg}`}>
                                    <div className={`${getEmotionConfig(result.emotion).color}`}>
                                        {getEmotionConfig(result.emotion).icon}
                                    </div>
                                    <div className={`text-lg font-bold capitalize ${getEmotionConfig(result.emotion).color}`}>
                                        {result.emotion}
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-zinc-500">Detected Emotion</div>
                                </div>

                                {/* Explanation Card */}
                                <div className="md:col-span-2 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Analysis Explanation</h4>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                                        "{result.explanation}"
                                    </p>
                                </div>
                            </div>

                            {/* Aspect Analysis (Advanced) */}
                            {result.aspects.length > 0 && (
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Search className="w-4 h-4" /> Aspect-Based Analysis
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {result.aspects.map((aspect, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-zinc-800/50">
                                                <span className="font-medium text-zinc-700 dark:text-zinc-200">{aspect.target}</span>
                                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${aspect.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    aspect.sentiment === 'negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                                        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}>
                                                    {aspect.sentiment === 'positive' && <ThumbsUp className="w-3 h-3" />}
                                                    {aspect.sentiment === 'negative' && <ThumbsDown className="w-3 h-3" />}
                                                    <span className="capitalize">{aspect.sentiment}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Architecture Diagram */}
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">System Architecture</h4>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono">

                        {/* Input Node */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm">
                                <span className="text-zinc-500">Input</span>
                            </div>
                            <span className="text-zinc-400">Raw Text</span>
                        </div>

                        {/* Arrow */}
                        <div className="h-8 w-0.5 md:w-8 md:h-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-300 dark:border-zinc-700 rotate-45 transform" />
                        </div>

                        {/* LLM Node */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400 text-center p-2">
                                <Zap className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">LLM Engine</span>
                            </div>
                            <span className="text-zinc-400">Context & Tone</span>
                        </div>

                        {/* Arrow */}
                        <div className="h-8 w-0.5 md:w-8 md:h-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-300 dark:border-zinc-700 rotate-45 transform" />
                        </div>

                        {/* Analysis Node */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center shadow-sm text-purple-600 dark:text-purple-400 text-center p-2">
                                <Activity className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Extraction</span>
                            </div>
                            <span className="text-zinc-400">Entities & Emotion</span>
                        </div>

                        {/* Arrow */}
                        <div className="h-8 w-0.5 md:w-8 md:h-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-300 dark:border-zinc-700 rotate-45 transform" />
                        </div>

                        {/* Output Node */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center shadow-sm text-emerald-600 dark:text-emerald-400 text-center p-2">
                                <Search className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Structured JSON</span>
                            </div>
                            <span className="text-zinc-400">UI Render</span>
                        </div>

                    </div>
                    <div className="mt-8 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700/50 text-xs text-zinc-500 text-center font-mono">
                        <span className="font-bold text-indigo-500">System Prompt:</span> "Analyze text. Return JSON with <span className="text-rose-500">sentiment_score</span> (-1 to 1) and <span className="text-rose-500">emotion_tag</span>..." &rarr; LLM Inference
                    </div>
                </div>
            </div>
        </div>
    );
}
