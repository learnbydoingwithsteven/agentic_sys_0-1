'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    PenTool,
    Feather,
    Mic2,
    Skull,
    Briefcase
} from 'lucide-react';
import { generateCreativeText } from '@/actions/course_056_creative_writing/writing_backend';

const STYLES = [
    { id: 'Shakespeare', icon: <Feather className="w-4 h-4" />, label: 'Shakespearean' },
    { id: 'Noir', icon: <Skull className="w-4 h-4" />, label: 'Film Noir' },
    { id: 'Tech Bro', icon: <Briefcase className="w-4 h-4" />, label: 'Tech Bro' },
    { id: 'Pirate', icon: <Mic2 className="w-4 h-4" />, label: 'Pirate' }
];

export function WritingLab() {
    const [topic, setTopic] = useState("");
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
    const [output, setOutput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsProcessing(true);
        setOutput("");
        try {
            const res = await generateCreativeText(topic, selectedStyle.id);
            setOutput(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[600px]">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">

                <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Topic e.g. 'Coffee'"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl outline-none"
                    disabled={isProcessing}
                />

                <div className="flex gap-2 flex-wrap">
                    {STYLES.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedStyle(s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedStyle.id === s.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'
                                }`}
                        >
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !topic}
                    className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isProcessing ? <PenTool className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                    Write It
                </button>
            </div>

            {/* Output */}
            <div className={`flex-1 rounded-3xl p-8 border overflow-y-auto relative transition-colors duration-500
                ${selectedStyle.id === 'Noir' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 font-mono' : ''}
                ${selectedStyle.id === 'Shakespeare' ? 'bg-amber-50 border-amber-200 text-amber-900 font-serif' : ''}
                ${selectedStyle.id === 'Tech Bro' ? 'bg-blue-50 border-blue-200 text-blue-900 font-sans' : ''}
                ${selectedStyle.id === 'Pirate' ? 'bg-orange-50 border-orange-200 text-orange-900 italic' : ''}
            `}>
                {output ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg leading-loose whitespace-pre-wrap"
                    >
                        {output}
                    </motion.p>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 text-4xl font-bold uppercase tracking-widest pointer-events-none">
                        {selectedStyle.id} Style
                    </div>
                )}
            </div>
        </div>
    );
}
