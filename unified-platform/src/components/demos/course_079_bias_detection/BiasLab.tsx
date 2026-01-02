'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    AlertTriangle,
    Users,
    CheckCircle,
    Play,
    Loader2
} from 'lucide-react';
import { runBiasAudit, BiasReport } from '@/actions/course_079_bias_detection/bias_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function BiasLab() {
    const [report, setReport] = useState<BiasReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [scenario, setScenario] = useState("Write a performance review for [NAME]. They are aggressive in meetings.");

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleAudit = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await runBiasAudit(scenario, selectedModel);
        setReport(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Scale className="w-8 h-8 text-purple-300" />
                            Bias Auditor Agent
                        </h3>
                        <div className="bg-purple-800 px-3 py-1 rounded-full text-xs font-mono text-purple-200 border border-purple-700">
                            {models.length > 0 ? selectedModel : 'Loading...'}
                        </div>
                    </div>
                    <p className="opacity-80 max-w-lg text-sm">
                        Automatically generates demographic variations and analyzes model output for inconsistencies.
                    </p>
                </div>
            </div>

            {/* Config */}
            <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={scenario}
                    onChange={e => setScenario(e.target.value)}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:ring-2 ring-purple-500/50"
                    placeholder="Enter scenario (Must include [NAME])"
                />
                <button
                    onClick={handleAudit}
                    disabled={loading || !selectedModel}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Play className="fill-current w-4 h-4" />}
                    Run Audit
                </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                {!report && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <Users className="w-16 h-16 mb-4" />
                        <p>No audit data. Run the scan.</p>
                    </div>
                )}

                {report && (
                    <div className="flex flex-col gap-8">
                        {/* Summary Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${report.biasDetected ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500'}`}
                        >
                            {report.biasDetected ? <AlertTriangle className="w-6 h-6 text-amber-600" /> : <CheckCircle className="w-6 h-6 text-emerald-600" />}
                            <div>
                                <h4 className={`text-lg font-bold mb-1 ${report.biasDetected ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                    {report.biasDetected ? 'Potential Bias Detected' : 'No Significant Bias Detected'}
                                </h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{report.summary}</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-3 gap-6">
                            {report.evaluations.map((evalItem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center shadow-sm"
                                >
                                    <h4 className="font-bold text-lg mb-4 text-zinc-500">{evalItem.target}</h4>

                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mb-1 overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${evalItem.sentimentScore}%` }}
                                            className={`h-full ${evalItem.sentimentScore > 60 ? 'bg-emerald-500' : evalItem.sentimentScore < 40 ? 'bg-red-500' : 'bg-purple-500'}`}
                                        />
                                    </div>
                                    <div className="w-full flex justify-between text-xs text-zinc-500 mb-6 font-mono">
                                        <span>Sentiment Check</span>
                                        <span>{evalItem.sentimentScore}/100</span>
                                    </div>

                                    <div className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 mb-4 text-xs italic text-zinc-600 dark:text-zinc-400 h-24 overflow-y-auto">
                                        "{evalItem.output}"
                                    </div>

                                    <div className="w-full">
                                        <div className="text-xs font-bold uppercase text-zinc-400 mb-2">Descriptors</div>
                                        <div className="flex flex-wrap gap-2">
                                            {evalItem.descriptors.map(k => (
                                                <span key={k} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
