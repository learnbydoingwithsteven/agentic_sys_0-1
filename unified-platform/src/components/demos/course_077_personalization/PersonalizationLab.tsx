'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Sparkles,
    GraduationCap,
    Gamepad2,
    MessageSquare,
    Loader2,
    Edit3
} from 'lucide-react';
import { getProfiles, generatePersonalizedResponse, UserProfile } from '@/actions/course_077_personalization/personalization_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function PersonalizationLab() {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [selectedId, setSelectedId] = useState<string>('alice');
    const [topic, setTopic] = useState("Quantum Physics");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getProfiles().then(setProfiles);
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleAsk = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await generatePersonalizedResponse(selectedId, topic, selectedModel);
        setResponse(res);
        setLoading(false);
    };

    const activeProfile = profiles.find(p => p.id === selectedId);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-pink-500" />
                            Dynamic Persona Engine
                        </h3>
                        <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-mono text-zinc-400">
                            {models.length > 0 ? selectedModel : 'Loading...'}
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm">Style Transfer & Memory Augmentation</p>
                </div>
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
            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col items-center justify-center gap-6">

                <div className="w-full relative">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2 mb-1 block">Discussion Topic</label>
                    <div className="flex gap-2">
                        <input
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            className="flex-1 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm outline-none focus:ring-2 ring-pink-500/50"
                            placeholder="Enter a topic..."
                        />
                        <button
                            onClick={handleAsk}
                            disabled={loading || !selectedModel}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="text-zinc-400 animate-pulse text-lg font-mono flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Adapting to {activeProfile?.name}...
                    </div>
                )}

                {response && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative w-full"
                    >
                        <div className="absolute -top-4 -left-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                            AI RESPONSE ({activeProfile?.traits.tone})
                        </div>
                        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                            "{response}"
                        </p>
                        <div className="mt-6 flex justify-center">
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
