'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Tags,
    AlertCircle,
    CheckCircle,
    User,
    Cpu
} from 'lucide-react';
import { triageTicket, Ticket } from '@/actions/course_040_customer_support/support_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function SupportLab() {
    const [msg, setMsg] = useState("I want a refund, this app is terrible!");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Fetch models on mount
    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel) return;

        setLoading(true);
        const ticket = await triageTicket(msg, selectedModel);
        setTickets(prev => [ticket, ...prev]);
        setMsg("");
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Input Area */}
            <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">

                {/* Header with Model Select */}
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-2">
                    <div className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
                        <User className="w-4 h-4" /> Customer Chat
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <Cpu className="w-3 h-3 text-zinc-500" />
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                        >
                            {models.length === 0 && <option value="">Loading models...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 mt-2">
                        <User className="w-5 h-5 text-zinc-400" />
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2">
                        <textarea
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            placeholder="Type a customer complaint..."
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 p-2 outline-none focus:border-indigo-500 transition-colors resize-none h-16 font-medium"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !msg || !selectedModel}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Processing...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs font-bold px-2">
                    <Tags className="w-4 h-4" /> Agent Dashboard (Live)
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 p-2">
                    <AnimatePresence>
                        {tickets.map(t => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-start gap-4"
                            >
                                <div className={`shrink-0 w-2 h-16 rounded-full 
                                    ${t.priority === 'HIGH' ? 'bg-red-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'}
                                `} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        <Badge label={t.category} color="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" />
                                        <Badge label={t.sentiment} color={t.sentiment === 'ANGRY' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800'} />
                                        <Badge label={t.priority} color="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300" />
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-sm truncate">{t.message}</p>
                                    <div className="text-[10px] text-zinc-400 mt-2 font-mono">ID: {t.id}</div>
                                </div>

                                <div className="self-center">
                                    {t.priority === 'HIGH' ? <AlertCircle className="w-6 h-6 text-red-400" /> : <CheckCircle className="w-6 h-6 text-zinc-300" />}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {tickets.length === 0 && (
                        <div className="text-center text-zinc-400 italic mt-10">No tickets in queue.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Badge({ label, color }: { label: string, color: string }) {
    return (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${color}`}>
            {label}
        </span>
    );
}
