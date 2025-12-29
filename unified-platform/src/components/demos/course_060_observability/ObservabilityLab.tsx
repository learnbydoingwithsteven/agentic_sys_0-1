'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Clock,
    AlertCircle,
    CheckCircle,
    Play
} from 'lucide-react';
import { runObservedRequest, TraceSpan } from '@/actions/course_060_observability/ops_backend';

export function ObservabilityLab() {
    const [trace, setTrace] = useState<TraceSpan[]>([]);
    const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (fail = false) => {
        setIsProcessing(true);
        setTrace([]);
        setSelectedSpan(null);
        try {
            const spans = await runObservedRequest(fail ? "plan fail" : "plan vacation");
            setTrace(spans);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        AgentOps Console
                    </h3>
                    <p className="text-zinc-500 text-sm">Live Trace Visualization</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleRun(false)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Success Trace
                    </button>
                    <button
                        onClick={() => handleRun(true)}
                        disabled={isProcessing}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Error Trace
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Waterfall Chart */}
                <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-y-auto relative">
                    {trace.length > 0 ? (
                        <div className="relative pt-6">
                            {/* Time Axis (Mock) */}
                            <div className="flex justify-between text-xs text-zinc-400 font-mono mb-4 border-b pb-2">
                                <span>0ms</span>
                                <span>1250ms</span>
                                <span>2500ms</span>
                            </div>

                            <div className="space-y-3">
                                {trace.map((span, i) => {
                                    const widthPct = ((span.endTime - span.startTime) / 2500) * 100;
                                    const leftPct = (span.startTime / 2500) * 100;

                                    return (
                                        <motion.div
                                            key={span.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group relative h-10 flex items-center cursor-pointer"
                                            onClick={() => setSelectedSpan(span)}
                                        >
                                            {/* Span Bar */}
                                            <div
                                                className={`
                                                    absolute h-8 rounded-lg border shadow-sm transition-all
                                                    ${selectedSpan?.id === span.id ? 'ring-2 ring-indigo-500 z-10' : ''}
                                                    ${span.status === 'error' ? 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800' : 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800'}
                                                `}
                                                style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
                                            >
                                                <div className="absolute inset-0 flex items-center px-3 truncate text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                    {span.name}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-zinc-400 mt-24 opacity-50">
                            Waiting for request...
                        </div>
                    )}
                </div>

                {/* Details Panel */}
                <div className="w-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-4">Span Details</h4>
                    {selectedSpan ? (
                        <div className="space-y-4 text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="text-zinc-500 text-xs">Operation Name</div>
                                <div className="font-mono font-bold">{selectedSpan.name}</div>
                            </div>
                            <div>
                                <div className="text-zinc-500 text-xs">Status</div>
                                <div className={`flex items-center gap-2 font-bold ${selectedSpan.status === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {selectedSpan.status === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    {selectedSpan.status.toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <div className="text-zinc-500 text-xs">Duration</div>
                                <div className="font-mono flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {selectedSpan.endTime - selectedSpan.startTime}ms
                                </div>
                            </div>
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="text-zinc-500 text-xs mb-2">Metadata</div>
                                <pre className="bg-zinc-50 dark:bg-black/30 p-2 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto">
                                    {JSON.stringify(selectedSpan.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="text-zinc-400 text-sm italic">Select a span to view details.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
