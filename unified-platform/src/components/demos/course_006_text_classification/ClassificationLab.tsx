'use client';

import React, { useState } from 'react';
import { Tag, Split, Layers, GitMerge, Check, ArrowRight, BookOpen, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyText, type ClassificationType, type ClassificationResult } from '@/actions/course_006_text_classification/classification';


const QUICK_TEMPLATES: Record<ClassificationType, string[]> = {
    'binary': [
        "Congratulations! You've won a $500 gift card. Click here to claim.",
        "Hi John, are we still on for the meeting at 2 PM?",
        "Urgent: Your account security has been compromised."
    ],
    'multi-class': [
        "The Golden State Warriors defeated the Suns 113-112 last night.",
        "Inflation rates have dropped by 0.5% this quarter.",
        "Microsoft announces new AI features for Windows 11."
    ],
    'multi-label': [
        "A detective hunts a killer in a futuristic sci-fi city.",
        "A laugh-out-loud romantic comedy set in Paris.",
        "An action-packed thriller with explosive car chases."
    ],
    'hierarchical': [
        "Sony WH-1000XM5 Noise Canceling Headphones",
        "Harry Potter and the Sorcerer's Stone (Hardcover)",
        "Levi's Men's 501 Original Fit Jeans"
    ]
};


const FEW_SHOT_EXAMPLES: Record<ClassificationType, { text: string, label: string }[]> = {
    'binary': [
        { text: "Win $1,000,000 now! Click here!", label: "SPAM" },
        { text: "Hey, can we meet for lunch?", label: "NOT_SPAM" },
        { text: "Urgent: Password expired.", label: "SPAM" }
    ],
    'multi-class': [
        { text: "The Lakers won the championship.", label: "SPORTS" },
        { text: "Apple released the new M3 chip.", label: "TECH" },
        { text: "Local elections are held today.", label: "NEWS" }
    ],
    'multi-label': [
        { text: "A robot travels back in time.", label: "Action, Sci-Fi" },
        { text: "Two people fall in love in war.", label: "Romance, Drama" },
        { text: "A funny cop movie.", label: "Action, Comedy" }
    ],
    'hierarchical': [
        { text: "MacBook Pro 16 inch", label: "Electronics > Laptop" },
        { text: "Nike Air Jordan", label: "Apparel > Footwear" },
        { text: "Harry Potter Book 1", label: "Media > Books" }
    ]
};

export function ClassificationLab() {
    const [type, setType] = useState<ClassificationType>('binary');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ClassificationResult | null>(null);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await classifyText(input, type);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getTypeInfo = () => {
        switch (type) {
            case 'binary': return {
                icon: <Split className="w-4 h-4" />,
                title: "Binary Classification",
                desc: "Two classes. E.g., Spam vs Not Spam.",
                placeholder: "e.g., 'Win a free iPhone now!' or 'Meeting at 3pm'"
            };
            case 'multi-class': return {
                icon: <Layers className="w-4 h-4" />,
                title: "Multi-Class",
                desc: "Mutually exclusive categories. E.g., News vs Sports vs Tech.",
                placeholder: "e.g., 'The Lakers won last night' or 'New CPU released'"
            };
            case 'multi-label': return {
                icon: <Tag className="w-4 h-4" />,
                title: "Multi-Label",
                desc: "Can belong to multiple buckets. E.g., Action AND Sci-Fi.",
                placeholder: "e.g., 'A romantic comedy about space travel'"
            };
            case 'hierarchical': return {
                icon: <GitMerge className="w-4 h-4" />,
                title: "Hierarchical",
                desc: "Tree structure. E.g., Product > Electronics > Laptop.",
                placeholder: "e.g., 'Adidas Running Shoes' or 'iPhone 15 Pro'"
            };
        }
    };

    const info = getTypeInfo();

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[900px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                    <Database className="w-5 h-5 text-indigo-500" />
                    <h3>Text Classifier</h3>
                </div>

                {/* Type Selector */}
                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg overflow-x-auto">
                    {(['binary', 'multi-class', 'multi-label', 'hierarchical'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => { setType(t); setResult(null); setInput(''); }}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${type === t
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-300'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            {t === 'binary' && <Split className="w-3 h-3" />}
                            {t === 'multi-class' && <Layers className="w-3 h-3" />}
                            {t === 'multi-label' && <Tag className="w-3 h-3" />}
                            {t === 'hierarchical' && <GitMerge className="w-3 h-3" />}
                            <span className="capitalize">{t.replace('-', ' ')}</span>
                        </button>
                    ))}
                </div>

                {/* Flow Clarification Box */}
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                            Flow Clarification: {info.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                        <span className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border rounded">Input</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                        <span className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border rounded">Type: {type}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                        <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800 rounded">Few-Shot Prompt</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                        <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-100 dark:border-purple-800 rounded">Label</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">
                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                        Classify Text
                    </label>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={info.placeholder}
                            disabled={loading}
                            rows={3}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none"
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Analyzing...' : 'Classify'}
                        </button>
                    </div>

                    {/* Quick Templates */}
                    <div className="flex flex-wrap gap-2">
                        {QUICK_TEMPLATES[type].map((t, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setInput(t)}
                                className="text-[10px] px-2 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-md transition-colors text-left"
                            >
                                "{t.length > 40 ? t.substring(0, 40) + '...' : t}"
                            </button>
                        ))}
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${result.label.includes('SPAM') || result.label.includes('Negative') ? 'bg-red-500' :
                                    result.label.includes('NOT_SPAM') || result.label.includes('Positive') ? 'bg-emerald-500' : 'bg-indigo-500'
                                    }`} />

                                <div className="p-6">
                                    {/* PROMPT VISUALIZATION (Teaching Moment) */}
                                    <div className="mb-6 bg-zinc-50 dark:bg-black/40 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800/50">
                                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Model Logic (Few-Shot Pattern)</h4>
                                        <div className="font-mono text-xs space-y-2">
                                            {/* Historic Examples */}
                                            {FEW_SHOT_EXAMPLES[type].map((ex, i) => (
                                                <div key={i} className="flex gap-2 opacity-50">
                                                    <span className="text-blue-500">Text:</span>
                                                    <span className="text-zinc-600 dark:text-zinc-400">"{ex.text}"</span>
                                                    <span className="text-purple-500">&rarr; {ex.label}</span>
                                                </div>
                                            ))}
                                            {/* Separator */}
                                            <div className="border-t border-zinc-200 dark:border-zinc-700 my-2 opacity-20" />
                                            {/* Actual Result */}
                                            <div className="flex gap-2 bg-indigo-50 dark:bg-indigo-900/20 -mx-2 p-2 rounded">
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">Text:</span>
                                                <span className="text-zinc-900 dark:text-zinc-100 font-bold">"{result.rawInput}"</span>
                                                <span className="text-purple-600 dark:text-purple-400 font-bold">&rarr; {result.label}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Input Text</h4>
                                            <div className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 italic">
                                                "{result.rawInput}"
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Predicted Classification</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.label.split(',').map((l, i) => (
                                                    <span key={i} className={`text-xl font-black px-3 py-1 rounded-lg ${l.trim() === 'SPAM' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        l.trim() === 'NOT_SPAM' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                        }`}>
                                                        {l.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Confidence</h4>
                                            <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                                <BarChart3 className="w-4 h-4" />
                                                {result.confidence}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Explanation (Educational) */}
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-[10px] text-zinc-400 uppercase font-bold">Accuracy</div>
                                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mt-1">~0.92 (Model)</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400 uppercase font-bold">Precision</div>
                                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mt-1">High Relevance</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400 uppercase font-bold">Recall</div>
                                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mt-1">Broad Capture</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
