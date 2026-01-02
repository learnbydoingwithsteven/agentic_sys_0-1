'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Mic,
    MicOff,
    Volume2,
    Activity,
    Keyboard,
    Loader2
} from 'lucide-react';
import { processVoiceInput } from '@/actions/course_069_voice_agent/voice_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function VoiceLab() {
    const [state, setState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING'>('IDLE');
    const [log, setLog] = useState<{ role: 'user' | 'agent', text: string }[]>([]);
    const [useTextMode, setUseTextMode] = useState(false);
    const [textInput, setTextInput] = useState("");

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Audio Refs
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });

        // Init Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => setState('LISTENING');
                recognition.onend = () => {
                    // If purely end without result, go IDLE. If result processing, it will handle state.
                    if (state === 'LISTENING') setState('IDLE');
                };

                recognition.onresult = async (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    await handleInteraction(transcript);
                };

                recognitionRef.current = recognition;
            } else {
                console.warn("Speech Recognition not supported");
                setUseTextMode(true);
            }
        }
    }, []);

    const handleInteraction = async (input: string) => {
        if (!input.trim() || !selectedModel) return;

        setState('PROCESSING');
        setLog(prev => [...prev, { role: 'user', text: input }]);
        setTextInput("");

        try {
            const res = await processVoiceInput(input, selectedModel);
            setLog(prev => [...prev, { role: 'agent', text: res.reply }]);

            // Speak Response
            if (window.speechSynthesis) {
                setState('SPEAKING');
                const utterance = new SpeechSynthesisUtterance(res.reply);
                utterance.onend = () => setState('IDLE');
                window.speechSynthesis.speak(utterance);
            } else {
                setState('IDLE');
            }

        } catch (e) {
            console.error(e);
            setState('IDLE');
        }
    };

    const toggleMic = () => {
        if (state === 'IDLE' && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) { }
        } else if (state === 'LISTENING' && recognitionRef.current) {
            recognitionRef.current.stop();
        } else if (state === 'SPEAKING') {
            window.speechSynthesis.cancel();
            setState('IDLE');
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px] relative">

            {/* Top Bar */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs border border-zinc-700 outline-none cursor-pointer"
                    disabled={state !== 'IDLE'}
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button
                    onClick={() => setUseTextMode(!useTextMode)}
                    className={`p-2 rounded-full ${useTextMode ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                    <Keyboard className="w-4 h-4" />
                </button>
            </div>

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
                {!useTextMode && (
                    <button
                        onClick={toggleMic}
                        disabled={state === 'PROCESSING' || !recognitionRef.current}
                        className={`
                            w-32 h-32 rounded-full flex items-center justify-center border-4 z-10 transition-all
                            ${state === 'IDLE' ? 'bg-zinc-800 border-zinc-700 hover:scale-105 hover:bg-zinc-700 text-white' : ''}
                            ${state === 'LISTENING' ? 'bg-rose-600 border-rose-400 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)] text-white' : ''}
                            ${state === 'PROCESSING' ? 'bg-amber-500 border-amber-300 text-white' : ''}
                            ${state === 'SPEAKING' ? 'bg-cyan-600 border-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.5)] text-white' : ''}
                        `}
                    >
                        {state === 'IDLE' && <Mic className="w-12 h-12" />}
                        {state === 'LISTENING' && <MicOff className="w-12 h-12" />}
                        {state === 'PROCESSING' && <Loader2 className="w-12 h-12 animate-spin" />}
                        {state === 'SPEAKING' && <Volume2 className="w-12 h-12 animate-bounce" />}
                    </button>
                )}

                {/* Text Mode Input */}
                {useTextMode && (
                    <div className="w-full max-w-md z-10 flex gap-2">
                        <input
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInteraction(textInput)}
                            placeholder="Type a message..."
                            disabled={state !== 'IDLE'}
                            className="flex-1 bg-zinc-800 border-zinc-700 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                            onClick={() => handleInteraction(textInput)}
                            disabled={state !== 'IDLE' || !textInput}
                            className="bg-indigo-600 text-white px-4 rounded-xl font-bold disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                )}

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
