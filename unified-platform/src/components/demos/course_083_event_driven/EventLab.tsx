'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radio,
    Newspaper,
    Wifi,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { publishEvent, AgentAction } from '@/actions/course_083_event_driven/event_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function EventLab() {
    const [headline, setHeadline] = useState("Apple announces new AI-powered iPhone.");
    const [actions, setActions] = useState<AgentAction[]>([]);
    const [processing, setProcessing] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleBroadcast = async () => {
        if (!selectedModel) return;
        setProcessing(true);
        setActions([]); // Clear previous state to show "Waiting" state effectively if we wanted, but here we wait for result

        // In a real event system, this is async. Here we await for the demo results.
        const res = await publishEvent(headline, selectedModel);
        setActions(res);
        setProcessing(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Publisher Zone */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                    <Radio className="w-4 h-4" /> Start Event Stream
                </div>

                <div className="w-full max-w-2xl flex gap-4">
                    <div className="flex-1 relative">
                        <Newspaper className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                        <input
                            value={headline}
                            onChange={e => setHeadline(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-indigo-500 font-medium"
                            placeholder="Enter a breaking news headline..."
                        />
                    </div>
                    <button
                        onClick={handleBroadcast}
                        disabled={processing || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : <Wifi className="w-5 h-5" />}
                        Broadcast
                    </button>
                </div>
                <div className="text-xs text-zinc-500 font-mono">Model: {selectedModel}</div>
            </div>

            {/* Event Bus Visualization */}
            <div className="flex-1 relative flex flex-col justify-center gap-8">
                {/* Visual Connector Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />

                {/* Agents Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {['FinancialBot', 'SportsBot', 'TechBot'].map((name, i) => {
                        // Find result if available
                        const result = actions.find(a => a.agentName === name);
                        const isRelevant = result?.didAct;

                        return (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`
                                    relative p-6 rounded-2xl border-2 transition-colors min-h-[200px] flex flex-col
                                    ${result
                                        ? (isRelevant ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800')
                                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}
                                `}
                            >
                                {/* Agent Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-lg">{name}</h4>
                                    {result && (
                                        isRelevant
                                            ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            : <XCircle className="w-6 h-6 text-zinc-300" />
                                    )}
                                </div>

                                {/* Status / Output */}
                                <div className="flex-1">
                                    {processing ? (
                                        <div className="flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Listening...
                                        </div>
                                    ) : result ? (
                                        isRelevant ? (
                                            <div className="text-sm text-emerald-800 dark:text-emerald-200">
                                                <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-70">Action Taken</div>
                                                <div className="flex gap-2">
                                                    <MessageSquare className="w-4 h-4 shrink-0 mt-1" />
                                                    <p>"{result.output}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-zinc-500 italic">
                                                Ignored: {result.reason}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-sm text-zinc-400 italic">Waiting for event...</div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
