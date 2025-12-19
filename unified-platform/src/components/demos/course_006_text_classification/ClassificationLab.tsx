'use client';

import React, { useState } from 'react';
import { Tag, Send, AlertCircle, ShoppingCart, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyTextAction } from '@/actions/course_006_text_classification/classify';

const categories = ['Spam', 'Support', 'Sales', 'General'];

const categoryColors: Record<string, string> = {
    'Spam': 'bg-red-100 text-red-700 border-red-200',
    'Support': 'bg-blue-100 text-blue-700 border-blue-200',
    'Sales': 'bg-green-100 text-green-700 border-green-200',
    'General': 'bg-zinc-100 text-zinc-700 border-zinc-200',
    'Error': 'bg-gray-100 text-gray-700'
};

export function ClassificationLab() {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClassify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        setLoading(true);
        setResult(null);

        const category = await classifyTextAction(inputText, categories);
        // Normalize result to match known categories if the LLM is chatty
        const match = categories.find(c => category.includes(c)) || 'General';

        setResult(match);
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-violet-500" />
                    Classifier Lab
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Categories Legend */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {categories.map(c => (
                        <span key={c} className={`px-2 py-1 rounded-full border ${categoryColors[c] || categoryColors['General']}`}>
                            {c}
                        </span>
                    ))}
                </div>

                <form onSubmit={handleClassify} className="space-y-4">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to classify (e.g., 'Win a free iPhone now!')..."
                        className="w-full h-32 p-3 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                    />
                    <button
                        type="submit"
                        disabled={loading || !inputText.trim()}
                        className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        Classify Text
                    </button>
                </form>

                <div className="h-24 flex items-center justify-center border-t border-zinc-100 dark:border-zinc-800">
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                key={result}
                                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className={`text-xl font-bold px-6 py-3 rounded-2xl border-2 flex items-center gap-3 shadow-sm ${categoryColors[result] || categoryColors['General']}`}
                            >
                                {result === 'Spam' && <AlertCircle className="w-6 h-6" />}
                                {result === 'Sales' && <ShoppingCart className="w-6 h-6" />}
                                {result === 'Support' && <MessageSquare className="w-6 h-6" />}
                                {result === 'General' && <Mail className="w-6 h-6" />}
                                {result}
                            </motion.div>
                        )}
                        {!result && !loading && (
                            <span className="text-zinc-400 text-sm italic">Result will appear here...</span>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
