'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    RotateCcw,
    Zap,
    ZapOff,
    Shield,
    ShieldAlert
} from 'lucide-react';
import { unreliableApiCall, resetCircuit, CircuitState } from '@/actions/course_075_fault_tolerance/fault_backend';

export function FaultToleranceLab() {
    const [logs, setLogs] = useState<{ msg: string, success: boolean, time: string }[]>([]);
    const [circuit, setCircuit] = useState<CircuitState>({ status: 'CLOSED', failures: 0, lastFailure: 0 });
    const [loading, setLoading] = useState(false);

    const handleCall = async () => {
        setLoading(true);
        const res = await unreliableApiCall();
        setCircuit(res.circuit);
        setLogs(prev => [{ msg: res.message, success: res.success, time: new Date().toLocaleTimeString() }, ...prev]);
        setLoading(false);
    };

    const handleReset = async () => {
        await resetCircuit();
        setCircuit({ status: 'CLOSED', failures: 0, lastFailure: 0 });
        setLogs([]);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Diagram */}
            <div className="flex justify-center items-center py-8">
                <div className="relative flex items-center w-full max-w-2xl justify-between px-12">
                    {/* Client */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div className="font-bold">Agent</div>
                    </div>

                    {/* Circuit Breaker Visual */}
                    <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 relative mx-4 rounded-full">
                        {/* The Switch */}
                        <motion.div
                            className={`absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 rounded-xl flex items-center justify-center border-4 shadow-xl z-20 bg-white dark:bg-zinc-900 transition-colors ${circuit.status === 'CLOSED' ? 'border-green-500' :
                                    circuit.status === 'HALF_OPEN' ? 'border-yellow-500' : 'border-red-500'
                                }`}
                            animate={{ rotate: circuit.status === 'OPEN' ? -45 : 0 }}
                        >
                            {circuit.status === 'CLOSED' && <Zap className="w-6 h-6 text-green-500 fill-current" />}
                            {circuit.status === 'HALF_OPEN' && <Shield className="w-6 h-6 text-yellow-500" />}
                            {circuit.status === 'OPEN' && <ZapOff className="w-6 h-6 text-red-500" />}
                        </motion.div>

                        {/* Connection Line */}
                        <motion.div
                            className={`h-full rounded-full transition-colors ${circuit.status === 'CLOSED' ? 'bg-green-500' : 'bg-red-200'}`}
                            animate={{ width: circuit.status === 'OPEN' ? '50%' : '100%' }}
                        />
                    </div>

                    {/* API */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10 transition-colors ${circuit.status === 'OPEN' ? 'bg-zinc-300' : 'bg-purple-600'} text-white`}>
                            <div className="text-xl font-black">API</div>
                        </div>
                        <div className="font-bold">Service (Unstable)</div>
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex gap-6 overflow-hidden">
                {/* Status Box */}
                <div className="w-1/3 flex flex-col justify-between">
                    <div>
                        <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-4">Breaker State</h3>
                        <div className={`text-4xl font-black mb-2 ${circuit.status === 'CLOSED' ? 'text-green-400' :
                                circuit.status === 'OPEN' ? 'text-red-500' : 'text-yellow-400'
                            }`}>
                            {circuit.status}
                        </div>
                        <div className="text-zinc-500">Failures: {circuit.failures}/3</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCall}
                            disabled={loading || circuit.status === 'OPEN'}
                            className="bg-zinc-100 hover:bg-white text-black px-6 py-4 rounded-xl font-bold flex items-center justify-between disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
                        >
                            <span>Make Request</span>
                            {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset System
                        </button>
                    </div>
                </div>

                {/* Console */}
                <div className="flex-1 bg-black/50 rounded-2xl p-4 font-mono text-sm overflow-y-auto custom-scrollbar border border-zinc-800/50">
                    <div className="opacity-50 mb-2">// System Logs</div>
                    <AnimatePresence>
                        {logs.map((L, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`mb-1 flex gap-4 ${L.success ? 'text-green-400' : 'text-red-400'}`}
                            >
                                <span className="text-zinc-600 shrink-0">{L.time}</span>
                                <span>{L.msg}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {logs.length === 0 && <div className="text-zinc-600 italic">No activity recorded.</div>}
                </div>
            </div>
        </div>
    );
}
