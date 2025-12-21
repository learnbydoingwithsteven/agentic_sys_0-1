'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, RefreshCcw, CheckCircle, XCircle, Activity, HeartPulse, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runUnreliableAgent, type ReliabilityMode, type ErrorLog } from '@/actions/course_014_error_handling/error_handling';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

export function ErrorHandlingLab() {
    const [input, setInput] = useState("Hello, are you working today?");
    const [mode, setMode] = useState<ReliabilityMode>('robust');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    // State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [logs, setLogs] = useState<ErrorLog[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setLogs([]);
        setResult(null);
        setStatus('running');

        try {
            const res = await runUnreliableAgent(input, mode, model);

            // Replay the logs for visual effect
            if (res.logs && res.logs.length > 0) {
                for (const log of res.logs) {
                    setLogs(prev => [...prev, log]);
                    await new Promise(r => setTimeout(r, 800)); // Visual delay
                }
            }

            if (res.success) {
                setResult(res.data || "");
                setStatus('success');
            } else {
                setResult(res.error || "Unknown Error");
                setStatus('failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[750px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                    <HeartPulse className="w-5 h-5 text-rose-500" />
                    <h3>Resilience Tester</h3>
                </div>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-rose-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 p-4 bg-zinc-50 dark:bg-black/20 border-b border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setMode('fragile')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'fragile'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    <XCircle className="w-4 h-4" /> Fragile Mode
                    <span className="text-[10px] font-normal opacity-70 block ml-1">(Crashes on error)</span>
                </button>
                <button
                    onClick={() => setMode('robust')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'robust'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    <Shield className="w-4 h-4" /> Robust Mode
                    <span className="text-[10px] font-normal opacity-70 block ml-1">(Self-healing)</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-100/50 dark:bg-black/40 flex flex-col items-center">

                <form onSubmit={handleRun} className="w-full max-w-lg mb-8">
                    <div className="relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-rose-500 outline-none shadow-sm"
                            disabled={loading}
                        />
                        <button
                            disabled={loading}
                            className={`absolute right-2 top-2 bottom-2 px-6 rounded-full font-bold text-xs transition-all flex items-center gap-2 text-white shadow-md ${loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
                                }`}
                        >
                            {loading ? <Activity className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                            {loading ? 'Testing...' : 'Test'}
                        </button>
                    </div>
                </form>

                {/* VISUALIZATION AREA */}
                <div className="w-full max-w-lg space-y-4">

                    {/* Retry Timeline */}
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                className="flex gap-4"
                            >
                                {/* Timeline Line */}
                                <div className="flex flex-col items-center">
                                    <div className="w-0.5 h-full bg-zinc-300 dark:bg-zinc-700" />
                                    <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${log.action === 'Crash' || log.action === 'Give Up' ? 'bg-red-500' : 'bg-amber-500'
                                        }`} />
                                    <div className="w-0.5 h-full bg-zinc-300 dark:bg-zinc-700" />
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 p-4 rounded-xl border mb-4 text-xs ${log.action === 'Crash' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50' :
                                    log.action === 'Give Up' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50' :
                                        'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'
                                    }`}>
                                    <div className="flex justify-between items-center mb-1 font-bold">
                                        <span className="uppercase tracking-wider opacity-70">Attempt {log.attempt}</span>
                                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="font-mono mb-2 opacity-90 break-all">{log.error}</div>
                                    <div className="flex items-center gap-2 font-bold">
                                        <Activity className="w-3 h-3" />
                                        Action: {log.action}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Final Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-2xl border-2 shadow-lg text-center ${status === 'success'
                                    ? 'bg-white border-emerald-500 dark:bg-zinc-800'
                                    : 'bg-white border-red-500 dark:bg-zinc-800'
                                    }`}
                            >
                                <div className="flex justify-center mb-3">
                                    {status === 'success' ? (
                                        logs.length > 0 ? (
                                            <div className="relative">
                                                <Shield className="w-10 h-10 text-emerald-500" />
                                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 rounded-full">
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                </div>
                                            </div>
                                        ) : (
                                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                                        )
                                    ) : (
                                        <AlertTriangle className="w-10 h-10 text-red-500" />
                                    )}
                                </div>
                                <h3 className={`font-bold text-lg mb-2 ${status === 'success' ? 'text-zinc-800 dark:text-zinc-100' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {status === 'success'
                                        ? (logs.length > 0 ? 'Recovered Successfully' : 'Operation Successful')
                                        : 'System Failure'
                                    }
                                </h3>
                                {status === 'success' && logs.length > 0 && (
                                    <span className="inline-block mb-3 px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                        Auto-Healed after {logs.length} Error{logs.length > 1 ? 's' : ''}
                                    </span>
                                )}
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                    {result}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Architecture Diagrams */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-4">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                            {mode === 'fragile' ? 'Fragile Architecture' : 'Robust Recovery Architecture'}
                        </h4>

                        {mode === 'fragile' ? (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono mb-6 opacity-60">
                                <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm border-emerald-200 border-l-4">Start</span>
                                <ArrowRight className="w-4 h-4 text-zinc-300" />
                                <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 font-bold">Error</span>
                                <ArrowRight className="w-4 h-4 text-zinc-300" />
                                <span className="px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg shadow-sm">CRASH</span>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono mb-6">
                                <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm border-emerald-200 border-l-4">Start</span>
                                <ArrowRight className="w-4 h-4 text-zinc-300" />

                                <div className="relative p-2 border border-zinc-300 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30">
                                    <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-zinc-500 border border-zinc-200 rounded">Retry Loop</div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600">Error</span>
                                        <RefreshCw className="w-3 h-3 text-amber-500 animate-[spin_3s_linear_infinite]" />
                                        <div className="flex flex-col items-center">
                                            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-amber-600">Backoff</span>
                                            <span className="text-[9px] text-zinc-400">Wait...</span>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="w-4 h-4 text-zinc-300" />
                                <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-600 font-bold shadow-sm">Success / Fallback</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
