'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCheck,
    Check,
    X,
    Clock,
    AlertCircle,
    ShieldAlert,
    Send,
    Loader2
} from 'lucide-react';
import { getTickets, resolveTicket, submitRequest, ActionTicket } from '@/actions/course_076_human_in_loop/hitl_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function HitlLab() {
    const [tickets, setTickets] = useState<ActionTicket[]>([]);

    // Form
    const [actionType, setActionType] = useState("REFUND");
    const [details, setDetails] = useState("Refund $20 to user");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getTickets().then(setTickets);
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSubmit = async () => {
        if (!selectedModel) return;
        setIsSubmitting(true);
        const updated = await submitRequest(actionType, details, selectedModel);
        setTickets(updated);
        setIsSubmitting(false);
    };

    const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
        const updated = await resolveTicket(id, decision);
        setTickets(updated);
    };

    const pending = tickets.filter(t => t.status === 'PENDING');
    const history = tickets.filter(t => t.status !== 'PENDING');

    return (
        <div className="flex gap-8 h-[700px]">
            {/* Left: Request Form */}
            <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold text-lg">Action Request</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Action Type</label>
                            <select
                                value={actionType}
                                onChange={e => setActionType(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm outline-none"
                            >
                                <option value="REFUND">Process Refund</option>
                                <option value="DELETE_DATA">Delete User Data</option>
                                <option value="PUBLISH_TWEET">Publish Social Post</option>
                                <option value="INTERNAL_LOG">Write Internal Log</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Details</label>
                            <textarea
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm h-24 resize-none outline-none focus:ring-2 ring-indigo-500/50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                        Submit for Analysis
                    </button>
                    <div className="text-center text-[10px] text-zinc-400">
                        AI Model: {selectedModel}
                    </div>
                </div>

                {/* Visual Guide */}
                <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30 text-indigo-900 dark:text-indigo-200 text-xs leading-relaxed">
                    <p className="font-bold mb-2">How it works:</p>
                    <p>The AI Agent acts as a Compliance Officer. It calculates a <span className="font-bold">Risk Score</span> for every request.</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1 opacity-80">
                        <li>Low Risk (Logs, Small Refunds) &rarr; <span className="text-emerald-600 font-bold">Auto-Executed</span></li>
                        <li>High Risk (Data Deletion, Public Posts) &rarr; <span className="text-amber-600 font-bold">Pending Review</span></li>
                    </ul>
                </div>
            </div>

            {/* Right: Approval Queue & Log */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Queue */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden relative">
                    <h3 className="font-bold text-zinc-500 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Pending Approval ({pending.length})
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        <AnimatePresence>
                            {pending.map(t => (
                                <motion.div
                                    key={t.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm tracking-wide">{t.actionType}</span>
                                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">RISK: {t.riskScore}%</span>
                                            </div>
                                            <div className="text-sm mt-1">{t.details}</div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-xs text-amber-800 dark:text-amber-200 mb-4 border border-amber-100 dark:border-amber-800/50 flex items-start gap-2">
                                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                        {t.riskReason}
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => handleDecision(t.id, 'APPROVED')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold transition-colors">Approve</button>
                                        <button onClick={() => handleDecision(t.id, 'REJECTED')} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-bold transition-colors">Reject</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {pending.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-50">
                                <UserCheck className="w-12 h-12 mb-2" />
                                <p>Queue Empty</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* History */}
                <div className="h-1/3 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <h3 className="font-bold text-zinc-500 uppercase text-xs tracking-wider mb-4">Activity Log</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {history.map(t => (
                            <div key={t.id} className="flex items-center justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${t.status === 'APPROVED' || t.status === 'EXECUTED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <div className="font-medium text-zinc-700 dark:text-zinc-300">{t.details}</div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${t.status === 'EXECUTED' ? 'bg-blue-100 text-blue-700' :
                                        t.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {t.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
