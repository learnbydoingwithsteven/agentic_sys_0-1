'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    AlertTriangle,
    Users
} from 'lucide-react';
import { runBiasAudit, BiasReport } from '@/actions/course_079_bias_detection/bias_backend';

export function BiasLab() {
    const [report, setReport] = useState<BiasReport[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAudit = async () => {
        setLoading(true);
        const res = await runBiasAudit();
        setReport(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Scale className="w-8 h-8 text-purple-300" />
                        Fairness Auditor
                    </h3>
                    <p className="opacity-80 max-w-lg mt-2">
                        Detecting stereotyping and representational harm in agent outputs.
                    </p>
                </div>
                <button
                    onClick={handleAudit}
                    disabled={loading}
                    className="bg-white text-purple-900 px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {loading ? 'Scanning...' : 'Run Audit'}
                </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 grid grid-cols-3 gap-6">
                {report.length === 0 ? (
                    <div className="col-span-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-400">
                        <Users className="w-16 h-16 mb-4 opacity-20" />
                        <p>No audit data. Run the scan.</p>
                    </div>
                ) : (
                    report.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center shadow-sm"
                        >
                            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-2xl font-black">
                                {r.group.charAt(0)}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{r.group}</h4>

                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mb-1 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${r.sentiment}%` }}
                                    className="bg-purple-500 h-full"
                                />
                            </div>
                            <div className="w-full flex justify-between text-xs text-zinc-500 mb-6">
                                <span>Sentiment</span>
                                <span>{r.sentiment}/100</span>
                            </div>

                            <div className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4">
                                <div className="text-xs font-bold uppercase text-zinc-400 mb-2">Dominant Descriptors</div>
                                <div className="flex flex-wrap gap-2">
                                    {r.keywords.map(k => (
                                        <span key={k} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-medium">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Alert Logic (Demo) */}
                            {r.group === 'Non-Binary Names' && (
                                <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full">
                                    <AlertTriangle className="w-3 h-3" /> Potential Under-representation
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
