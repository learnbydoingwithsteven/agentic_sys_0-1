'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Code,
    CheckCircle,
    XCircle,
    Server
} from 'lucide-react';
import { sendUnstructured, sendStructured, ProtocolLog } from '@/actions/course_047_communication/protocol_backend';

export function ProtocolLab() {
    const [mode, setMode] = useState<'unstructured' | 'structured'>('unstructured');
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<ProtocolLog[]>([]);

    const handleSend = async () => {
        if (!input) return;
        const result = mode === 'unstructured'
            ? await sendUnstructured(input)
            : await sendStructured(input);
        setLogs(result);
    };

    return (
        <div className="flex flex-col gap-8 h-[600px]">
            {/* Toggle */}
            <div className="flex justify-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => { setMode('unstructured'); setInput("I want a bit of pizza, maybe huge?"); setLogs([]); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'unstructured' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-white' : 'text-zinc-500'}`}
                    >
                        <MessageSquare className="w-4 h-4" /> Natural Language (Risky)
                    </button>
                    <button
                        onClick={() => { setMode('structured'); setInput('{"action": "order", "item": "pizza", "params": {"size": "large", "topping": "pepperoni"}}'); setLogs([]); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'structured' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'}`}
                    >
                        <Code className="w-4 h-4" /> JSON Protocol (Safe)
                    </button>
                </div>
            </div>

            {/* Input */}
            <div className="flex flex-col gap-2">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full h-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 font-mono text-sm"
                />
                <button
                    onClick={handleSend}
                    className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Send Packet
                </button>
            </div>

            {/* Logs */}
            <div className="flex-1 bg-zinc-950 text-green-400 font-mono p-6 rounded-3xl overflow-y-auto shadow-inner border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-4 text-xs uppercase tracking-widest border-b border-zinc-800 pb-2">
                    <Server className="w-3 h-3" /> Server Logs
                </div>
                <div className="space-y-4">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex gap-3 text-sm ${log.status === 'failure' ? 'text-red-400' : ''}`}
                        >
                            <span className="opacity-50 min-w-[80px] text-right">[{log.sender}]</span>
                            <span className="flex-1 break-all">{log.message}</span>
                            <span>{log.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</span>
                        </motion.div>
                    ))}
                    {logs.length === 0 && <span className="text-zinc-600 italic">// System Ready. Waiting for input stream...</span>}
                </div>
            </div>
        </div>
    );
}
