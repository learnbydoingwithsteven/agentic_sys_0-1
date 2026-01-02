'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    ShieldAlert,
    Sword,
    Play,
    Loader2
} from 'lucide-react';
import { runAdversarialRound, BattleRound } from '@/actions/course_065_adversarial/adversarial_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function AdversarialLab() {
    const [rounds, setRounds] = useState<BattleRound[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'SECURE' | 'COMPROMISED'>('SECURE');

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleSimulate = async () => {
        if (!selectedModel) return;
        setIsRunning(true);
        setRounds([]);
        setStatus('SECURE');

        for (let i = 1; i <= 3; i++) {
            try {
                const res = await runAdversarialRound(i, selectedModel);
                setRounds(prev => [...prev, res]);
                if (res.outcome === 'BREACHED') {
                    setStatus('COMPROMISED');
                    break;
                }
            } catch (e) {
                console.error(e);
            }
            await new Promise(r => setTimeout(r, 1000));
        }
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Status Bar */}
            <div className={`
                flex justify-between items-center p-6 rounded-3xl border shadow-lg transition-colors
                ${status === 'SECURE' ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-red-600 border-red-500 text-white'}
            `}>
                <div className="flex items-center gap-4">
                    {status === 'SECURE' ? <Shield className="w-8 h-8 text-emerald-400" /> : <ShieldAlert className="w-8 h-8 text-white animate-pulse" />}
                    <div>
                        <h3 className="font-bold text-lg">System Integrity</h3>
                        <div className="text-xs font-mono opacity-80">STATUS: {status}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className={`bg-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-sm border border-zinc-700 outline-none cursor-pointer ${status === 'COMPROMISED' ? 'bg-red-700 border-red-400 text-white' : ''}`}
                        disabled={isRunning}
                    >
                        {models.length === 0 && <option value="">Loading...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleSimulate}
                        disabled={isRunning || !selectedModel}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        {isRunning ? 'Simulation Running...' : 'Start Red Team'}
                    </button>
                </div>
            </div>

            {/* Battle Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 p-4">
                <AnimatePresence>
                    {rounds.map((r) => (
                        <motion.div
                            key={r.round}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-2"
                        >
                            {/* Attack */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                                    <Sword className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-2xl p-4 text-sm text-red-900 dark:text-red-200 relative">
                                    <div className="absolute -top-2 left-4 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-100 text-[10px] font-bold px-2 rounded-full">
                                        ATTACK VECTOR #{r.round}
                                    </div>
                                    <span className="font-mono">{r.attack}</span>
                                </div>
                            </div>

                            {/* Defense */}
                            <div className="flex gap-4 flex-row-reverse mb-8">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-colors ${r.outcome === 'BLOCKED' ? 'bg-emerald-100 border-emerald-200' : 'bg-zinc-100 border-zinc-200 grayscale'
                                    }`}>
                                    <Shield className={`w-5 h-5 ${r.outcome === 'BLOCKED' ? 'text-emerald-600' : 'text-zinc-500'}`} />
                                </div>
                                <div className={`flex-1 rounded-2xl p-4 text-sm relative border ${r.outcome === 'BLOCKED'
                                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                                    }`}>
                                    <div className={`absolute -top-2 right-4 text-[10px] font-bold px-2 rounded-full ${r.outcome === 'BLOCKED' ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800' : 'bg-zinc-300 text-zinc-800'
                                        }`}>
                                        DEFENSE LOG
                                    </div>
                                    <div className="font-bold mb-1">{r.outcome}</div>
                                    {r.defense}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
