'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCheck,
    Check,
    X,
    Clock,
    AlertCircle
} from 'lucide-react';
import { getTickets, resolveTicket, ActionTicket } from '@/actions/course_076_human_in_loop/hitl_backend';

export function HitlLab() {
    const [tickets, setTickets] = useState<ActionTicket[]>([]);

    useEffect(() => {
        getTickets().then(setTickets);
    }, []);

    const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
        const updated = await resolveTicket(id, decision);
        setTickets(updated);
    };

    const pending = tickets.filter(t => t.status === 'PENDING');
    const history = tickets.filter(t => t.status !== 'PENDING');

    return (
        <div className="flex gap-8 h-[700px]">
            {/* Approval Queue */}
            <div className="w-1/2 flex flex-col gap-6">
                <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-3">
                    <UserCheck className="w-8 h-8" />
                    <div>
                        <h3 className="font-bold text-xl">Approval Queue</h3>
                        <p className="text-indigo-200 text-sm">Critical actions require human eyes.</p>
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    <AnimatePresence>
                        {pending.map(t => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm relative group"
                            >
                                <div className="absolute top-4 right-4 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> PENDING
                                </div>

                                <div className="mb-6">
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{t.actionType}</div>
                                    <div className="text-lg font-medium">{t.details}</div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleDecision(t.id, 'APPROVED')}
                                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-emerald-200 dark:border-emerald-800"
                                    >
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleDecision(t.id, 'REJECTED')}
                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-red-200 dark:border-red-800"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {pending.length === 0 && (
                        <div className="text-center text-zinc-400 py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                            <Check className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No pending actions.
                        </div>
                    )}
                </div>
            </div>

            {/* History Log */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                <h3 className="font-bold text-zinc-500 uppercase text-xs tracking-wider mb-4">Decision History</h3>
                <div className="space-y-4 overflow-y-auto custom-scrollbar">
                    {history.map(t => (
                        <div key={t.id} className="flex gap-4 items-start opacity-70 hover:opacity-100 transition-opacity">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${t.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <div>
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {t.status}
                                    <span className="text-zinc-400 font-normal text-xs">#{t.id}</span>
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{t.details}</div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && <div className="text-zinc-400 italic text-sm">No decisions made yet.</div>}
                </div>
            </div>
        </div>
    );
}
