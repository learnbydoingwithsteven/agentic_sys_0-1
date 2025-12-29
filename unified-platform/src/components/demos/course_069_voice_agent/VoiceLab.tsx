'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Volume2,
    Activity
} from 'lucide-react';
import { processVoiceInput, VoiceResponse } from '@/actions/course_069_voice_agent/voice_backend';

export function VoiceLab() {
    const [state, setState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING'>('IDLE');
    const [log, setLog] = useState<{ role: 'user' | 'agent', text: string }[]>([]);

    const handlePushToTalk = async () => {
        if (state !== 'IDLE') return;

        // 1. Listen
        setState('LISTENING');
        await new Promise(r => setTimeout(r, 2000)); // Fake recording time

        // 2. Process
        setState('PROCESSING');
        const res = await processVoiceInput(true);

        // 3. User Transcript
        setLog(prev => [...prev, { role: 'user', text: res.transcript }]);

        // 4. Speak
        setState('SPEAKING');
        await new Promise(r => setTimeout(r, 2500)); // Fake playback time

        // 5. Agent Reply
        setLog(prev => [...prev, { role: 'agent', text: res.reply }]);
        setState('IDLE');
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Visualizer Area */}
            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">

                {/* Waveform (CSS Paintlet) */}
                {(state === 'LISTENING' || state === 'SPEAKING') && (
                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-2 rounded-full ${state === 'SPEAKING' ? 'bg-cyan-400' : 'bg-rose-400'}`}
                                animate={{ height: [20, Math.random() * 100 + 20, 20] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                            />
                        ))}
                    </div>
                )}

                {/* Central Button */}
                <button
                    onClick={handlePushToTalk}
                    disabled={state !== 'IDLE'}
                    className={`
                        w-32 h-32 rounded-full flex items-center justify-center border-4 z-10 transition-all
                        ${state === 'IDLE' ? 'bg-zinc-800 border-zinc-700 hover:scale-105 hover:bg-zinc-700 text-white' : ''}
                        ${state === 'LISTENING' ? 'bg-rose-600 border-rose-400 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)] text-white' : ''}
                        ${state === 'PROCESSING' ? 'bg-amber-500 border-amber-300 animate-pulse text-white' : ''}
                        ${state === 'SPEAKING' ? 'bg-cyan-600 border-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.5)] text-white' : ''}
                    `}
                >
                    {state === 'IDLE' && <Mic className="w-12 h-12" />}
                    {state === 'LISTENING' && <MicOff className="w-12 h-12" />}
                    {state === 'PROCESSING' && <Activity className="w-12 h-12 animate-spin" />}
                    {state === 'SPEAKING' && <Volume2 className="w-12 h-12 animate-bounce" />}
                </button>

                <div className="mt-8 text-xl font-mono font-bold text-zinc-400 tracking-widest uppercase">
                    {state}
                </div>
            </div>

            {/* Transcript Log */}
            <div className="h-48 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar flex flex-col gap-2 shadow-inner">
                {log.length === 0 ? (
                    <div className="text-center text-zinc-400 text-sm mt-4">Transcript will appear here...</div>
                ) : (
                    log.map((msg, i) => (
                        <div key={i} className={`text-sm ${msg.role === 'agent' ? 'text-cyan-600 dark:text-cyan-400 text-right' : 'text-zinc-600 dark:text-zinc-300 left'}`}>
                            <strong>{msg.role === 'agent' ? 'AI: ' : 'You: '}</strong>
                            {msg.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
