'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Sparkles,
    GraduationCap,
    Gamepad2,
    MessageSquare
} from 'lucide-react';
import { getProfiles, generatePersonalizedResponse, UserProfile } from '@/actions/course_077_personalization/personalization_backend';

export function PersonalizationLab() {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [selectedId, setSelectedId] = useState<string>('alice');
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfiles().then(setProfiles);
    }, []);

    const handleAsk = async () => {
        setLoading(true);
        const res = await generatePersonalizedResponse(selectedId, "Quantum Physics");
        setResponse(res);
        setLoading(false);
    };

    const activeProfile = profiles.find(p => p.id === selectedId);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-pink-500" />
                    Same Prompt, Different Agent
                </h2>
                <p className="text-zinc-500 mt-2">The prompt is always: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">"Explain Quantum Physics"</span></p>
            </div>

            {/* Profile Selector */}
            <div className="flex justify-center gap-8">
                {profiles.map(p => (
                    <button
                        key={p.id}
                        onClick={() => { setSelectedId(p.id); setResponse(""); }}
                        className={`
                            relative w-64 p-6 rounded-3xl border-2 transition-all text-left group
                            ${selectedId === p.id
                                ? 'bg-pink-50 border-pink-500 dark:bg-pink-900/20 dark:border-pink-500 scale-105 shadow-xl'
                                : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-pink-300 opacity-60 hover:opacity-100'}
                        `}
                    >
                        <div className={`
                             w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white shadow-lg
                             ${p.id === 'alice' ? 'bg-indigo-500' : 'bg-orange-500'}
                         `}>
                            {p.id === 'alice' ? <GraduationCap className="w-6 h-6" /> : <Gamepad2 className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-lg mb-1">{p.name}</div>
                        <div className="text-xs text-zinc-500 space-y-1">
                            <div>Tone: {p.traits.tone}</div>
                            <div>Level: {p.traits.expertise}</div>
                        </div>

                        {selectedId === p.id && (
                            <motion.div layoutId="check" className="absolute top-4 right-4">
                                <Sparkles className="w-5 h-5 text-pink-500 fill-current" />
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>

            {/* Dynamic Output */}
            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col items-center justify-center">
                {!response && !loading && (
                    <button
                        onClick={handleAsk}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" /> Generate Explanation
                    </button>
                )}

                {loading && (
                    <div className="text-zinc-400 animate-pulse text-lg font-mono">
                        Consulting {activeProfile?.name}...
                    </div>
                )}

                {response && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
                    >
                        <div className="absolute -top-4 -left-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                            AI RESPONSE ({activeProfile?.traits.tone})
                        </div>
                        <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                            "{response}"
                        </p>
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => setResponse("")} className="text-sm text-zinc-400 hover:text-pink-500 font-bold underline">
                                Try another persona
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
