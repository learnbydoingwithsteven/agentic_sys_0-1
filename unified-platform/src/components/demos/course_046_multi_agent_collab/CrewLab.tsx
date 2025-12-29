'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Briefcase,
    Search,
    PenTool,
    Play
} from 'lucide-react';
import { runCrew, CrewMessage } from '@/actions/course_046_multi_agent_collab/crew_backend';

export function CrewLab() {
    const [topic, setTopic] = useState("");
    const [messages, setMessages] = useState<CrewMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (t: string = topic) => {
        if (!t.trim() || isProcessing) return;
        setIsProcessing(true);
        setMessages([]);

        try {
            const result = await runCrew(t);
            // playback
            for (const msg of result) {
                await new Promise(r => setTimeout(r, 800));
                setMessages(prev => [...prev, msg]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const getIcon = (role: string) => {
        switch (role) {
            case 'Manager': return <Briefcase className="w-4 h-4" />;
            case 'Researcher': return <Search className="w-4 h-4" />;
            case 'Writer': return <PenTool className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    const getColor = (role: string) => {
        switch (role) {
            case 'Manager': return 'bg-red-500';
            case 'Researcher': return 'bg-blue-500';
            case 'Writer': return 'bg-emerald-500';
            default: return 'bg-zinc-500';
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Topic e.g. 'Future of AI'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={() => handleRun()}
                    disabled={isProcessing || !topic}
                    className="bg-zinc-800 hover:bg-zinc-900 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    <Play className="w-4 h-4" />
                </button>
            </div>

            {/* Crew Chat */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar space-y-6">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex gap-4 ${msg.sender === 'Manager' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${getColor(msg.sender)}`}>
                                {getIcon(msg.sender)}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[70%] p-4 rounded-2xl text-sm border shadow-sm ${msg.sender === 'Manager'
                                    ? 'bg-white dark:bg-zinc-900 border-red-100 dark:border-red-900/30 rounded-tr-sm'
                                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
                                }`}>
                                <div className="text-xs font-bold opacity-50 mb-1 uppercase tracking-wider">{msg.sender}</div>
                                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {!messages.length && !isProcessing && (
                    <div className="text-center text-zinc-400 mt-20 opacity-50">
                        <Users className="w-16 h-16 mx-auto mb-2" />
                        <p>The crew is waiting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
