'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    Building2,
    UploadCloud,
    RefreshCw
} from 'lucide-react';
import { runFederatedRound, FederatedRound } from '@/actions/course_081_federated_learning/federated_backend';

export function FederatedLab() {
    const [round, setRound] = useState(0);
    const [data, setData] = useState<FederatedRound | null>(null);
    const [training, setTraining] = useState(false);

    const handleRound = async () => {
        setTraining(true);
        // Simulate Local Train Time
        await new Promise(r => setTimeout(r, 1000));

        const nextRound = round + 1;
        const res = await runFederatedRound(nextRound);

        // Simulate Aggregation Time
        await new Promise(r => setTimeout(r, 1000));

        setData(res);
        setRound(nextRound);
        setTraining(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        Decentralized Learning Network
                    </h3>
                    <p className="text-zinc-500 text-sm">Train locally, aggregate globally. Privacy preserved.</p>
                </div>

                <div className="text-right">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Global Accuracy</div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                        {data ? `${data.globalAccuracy}%` : '50.0%'}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex items-center justify-center">
                {/* Global Server (Center) */}
                <div className="relative z-10 w-32 h-32 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-indigo-400">
                    <UploadCloud className="w-10 h-10 mb-1" />
                    <div className="font-bold text-xs">Global Model</div>
                </div>

                {/* Nodes */}
                {['Hospital A', 'Hospital B', 'Hospital C'].map((name, i) => {
                    const angle = (i * 120 + 90) * (Math.PI / 180);
                    const radius = 200;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <div
                            key={name}
                            className="absolute flex flex-col items-center"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                            <div className={`
                                w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 border-2 flex items-center justify-center shadow-lg transition-colors duration-500 relative
                                ${training ? 'border-indigo-400 animate-pulse' : 'border-zinc-300 dark:border-zinc-700'}
                             `}>
                                <Building2 className="w-8 h-8 text-zinc-400" />

                                {/* Data Packet Animation */}
                                {training && (
                                    <motion.div
                                        className="absolute w-4 h-4 bg-indigo-500 rounded-full"
                                        initial={{ x: 0, y: 0, opacity: 1 }}
                                        animate={{ x: -x, y: -y, opacity: 0 }}
                                        transition={{ delay: 1, duration: 1 }}
                                    />
                                )}
                            </div>
                            <div className="mt-2 font-bold text-sm text-zinc-500 bg-white/80 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                {name}
                            </div>
                        </div>
                    );
                })}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-300 dark:stroke-zinc-800" style={{ strokeDasharray: "5,5" }}>
                    <line x1="50%" y1="50%" x2="50%" y2="calc(50% + 200px)" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="calc(50% - 173px)" y2="calc(50% - 100px)" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="calc(50% + 173px)" y2="calc(50% - 100px)" strokeWidth="2" />
                </svg>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleRound}
                    disabled={training}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-opacity disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${training ? 'animate-spin' : ''}`} />
                    {training ? `Running Round ${round + 1}...` : `Start Round ${round + 1}`}
                </button>
            </div>
        </div>
    );
}
