'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    Building2,
    UploadCloud,
    RefreshCw,
    ShieldCheck,
    Lock,
    FileText,
    Loader2
} from 'lucide-react';
import { runFederatedRound, FederatedRound } from '@/actions/course_081_federated_learning/federated_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function FederatedLab() {
    const [round, setRound] = useState(0);
    const [data, setData] = useState<FederatedRound | null>(null);
    const [training, setTraining] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleRound = async () => {
        if (!selectedModel) return;
        setTraining(true);
        const nextRound = round + 1;
        const res = await runFederatedRound(nextRound, selectedModel);
        setData(res);
        setRound(nextRound);
        setTraining(false);
    };

    return (
        <div className="flex gap-4 h-[700px]">
            {/* Sidebar: Global State */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-6 rounded-3xl shadow-lg border border-indigo-700">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-6 h-6 text-cyan-300" />
                        <div>
                            <h3 className="font-bold text-lg">Global Model</h3>
                            <p className="text-xs text-indigo-200">Aggregated Intelligence (Round {round})</p>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 text-xs leading-relaxed max-h-64 overflow-y-auto backdrop-blur-sm border border-white/10">
                        {data ? data.globalModel : "System Initialized. Waiting for local updates..."}
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4" />
                    <h4 className="font-bold text-lg mb-2">Privacy Preserved</h4>
                    <p className="text-sm text-zinc-500">
                        The Central Server NEVER sees "Patient 001".
                        It only receives anonymized vectors/insights.
                    </p>

                    <button
                        onClick={handleRound}
                        disabled={training || !selectedModel}
                        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all w-full justify-center disabled:opacity-50"
                    >
                        {training ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                        {training ? 'Training...' : 'Run Round'}
                    </button>
                    <div className="mt-2 text-[10px] text-zinc-400 font-mono">Model: {selectedModel}</div>
                </div>
            </div>

            {/* Network View */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex flex-col justify-center">

                {data && data.nodeUpdates.map((update, i) => (
                    <motion.div
                        key={i}
                        layoutId={update.nodeId}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        theme={{ delay: i * 0.2 }}
                        className="mb-6 relative group"
                    >
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-300 dark:bg-zinc-800 -z-10" />

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-indigo-500 flex items-center justify-center shrink-0 shadow-md z-10">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">{update.nodeId}</span>
                                    <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Private Data
                                    </span>
                                </div>

                                {/* The "Update Packet" */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-r-2xl rounded-bl-2xl shadow-sm text-xs text-zinc-600 dark:text-zinc-400 relative">
                                    <div className="absolute -left-1 top-4 w-2 h-2 bg-white dark:bg-zinc-900 border-l border-b border-zinc-200 dark:border-zinc-800 transform rotate-45" />
                                    "{update.insight}"
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {!data && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <UploadCloud className="w-32 h-32 text-indigo-300" />
                    </div>
                )}
            </div>
        </div>
    );
}
