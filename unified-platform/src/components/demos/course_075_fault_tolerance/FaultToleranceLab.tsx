'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    RotateCcw,
    Zap,
    Shield,
    AlertTriangle,
    CheckCircle,
    Loader2,
    Play,
    Stethoscope
} from 'lucide-react';
import { executeWithSelfHealing, HealingLog } from '@/actions/course_075_fault_tolerance/fault_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function FaultToleranceLab() {
    const [input, setInput] = useState("fail this request");
    const [logs, setLogs] = useState<HealingLog[]>([]);
    const [finalOutput, setFinalOutput] = useState("");
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            m.length > 0 && setSelectedModel(m[0]);
        });
    }, []);

    const handleRun = async () => {
        if (!selectedModel) return;
        setLoading(true);
        setLogs([]);
        setFinalOutput("");

        try {
            const res = await executeWithSelfHealing(input, selectedModel);

            // Stream logs nicely
            for (const log of res.logs) {
                setLogs(prev => [...prev, log]);
                await new Promise(r => setTimeout(r, 500)); // Visual delay
            }
            setFinalOutput(res.finalResponse);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            Self-Healing Systems
                        </h3>
                        <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-mono text-zinc-400">
                            {models.length > 0 ? selectedModel : 'Loading...'}
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm">Automatic Error Detection & Recovery Loop</p>
                </div>
            </div>

            <div className="flex-1 flex gap-8">
                {/* Left: Control Panel */}
                <div className="w-1/3 flex flex-col gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Simulation Input</div>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm h-32 outline-none focus:ring-2 ring-green-500/50 resize-none"
                            placeholder="Enter text. Use 'fail' or 'error' to trigger a simulated crash."
                        />
                        <button
                            onClick={handleRun}
                            disabled={loading || !selectedModel}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />}
                            Execute Procedure
                        </button>
                        <p className="text-xs text-zinc-500 text-center">
                            Tip: Include the word "fail" to trigger the Self-Healer.
                        </p>
                    </div>

                    {/* Result Box */}
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Final Output</div>
                        {finalOutput ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 overflow-y-auto text-sm font-mono text-zinc-700 dark:text-zinc-300"
                            >
                                {finalOutput}
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-zinc-300 italic text-sm">
                                Waiting for result...
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Visualization Log */}
                <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-zinc-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">System Trace</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 relative z-10">
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative pl-8 border-l-2 border-zinc-800"
                                >
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-zinc-900 flex items-center justify-center ${log.status === 'SUCCESS' ? 'bg-green-500' :
                                            log.status === 'FAILURE' ? 'bg-red-500' :
                                                'bg-blue-500'
                                        }`}>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.status === 'SUCCESS' ? 'bg-green-900/30 text-green-400 success-badge' :
                                                    log.status === 'FAILURE' ? 'bg-red-900/30 text-red-400 failure-badge' :
                                                        'bg-blue-900/30 text-blue-400'
                                                }`}>
                                                {log.step}
                                            </span>
                                            <span className="text-zinc-600 text-xs font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="text-zinc-300 text-sm font-mono bg-black/20 p-2 rounded-lg border border-zinc-800">
                                            {log.message}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Background Graphic */}
                    <Stethoscope className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-zinc-800/20" />
                </div>
            </div>
        </div>
    );
}
