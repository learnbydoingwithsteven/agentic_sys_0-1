'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PenTool,
    Feather,
    Mic2,
    Skull,
    Briefcase
} from 'lucide-react';
import { generateCreativeText } from '@/actions/course_056_creative_writing/writing_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const STYLES = [
    { id: 'Shakespeare', icon: <Feather className="w-4 h-4" />, label: 'Shakespearean' },
    { id: 'Noir', icon: <Skull className="w-4 h-4" />, label: 'Film Noir' },
    { id: 'Tech Bro', icon: <Briefcase className="w-4 h-4" />, label: 'Tech Bro' },
    { id: 'Pirate', icon: <Mic2 className="w-4 h-4" />, label: 'Pirate' }
];

export function WritingLab() {
    const [topic, setTopic] = useState("Coffee");
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
    const [output, setOutput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleGenerate = async () => {
        if (!topic || !selectedModel) return;
        setIsProcessing(true);
        setOutput("");
        try {
            const res = await generateCreativeText(topic, selectedStyle.id, selectedModel);
            setOutput(res);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[600px]">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="Topic e.g. 'Coffee'"
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl outline-none"
                        disabled={isProcessing}
                    />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border-none text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer md:w-48"
                        disabled={isProcessing}
                    >
                        {models.length === 0 && <option value="">Loading models...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {STYLES.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedStyle(s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedStyle.id === s.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                                : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'
                                }`}
                        >
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !topic || !selectedModel}
                    className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.99]"
                >
                    {isProcessing ? <PenTool className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
                    {isProcessing ? 'Crafting Masterpiece...' : 'Generate Creative Text'}
                </button>
            </div>

            {/* Output */}
            <div className={`flex-1 rounded-3xl p-8 border overflow-y-auto relative transition-colors duration-500 flex flex-col justify-center
                ${selectedStyle.id === 'Noir' ? 'bg-zinc-950 border-zinc-800 text-zinc-400 font-mono shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]' : ''}
                ${selectedStyle.id === 'Shakespeare' ? 'bg-amber-50 border-amber-200 text-amber-900 font-serif shadow-inner' : ''}
                ${selectedStyle.id === 'Tech Bro' ? 'bg-blue-50 border-blue-200 text-blue-900 font-sans tracking-tight' : ''}
                ${selectedStyle.id === 'Pirate' ? 'bg-orange-50 border-orange-200 text-orange-900 italic' : ''}
            `}>
                {output ? (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl leading-loose whitespace-pre-wrap max-w-3xl mx-auto text-center"
                    >
                        {output}
                    </motion.p>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none gap-4">
                        {STYLES.find(s => s.id === selectedStyle.id)?.icon}
                        <div className="text-4xl font-bold uppercase tracking-widest">
                            {selectedStyle.id}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
