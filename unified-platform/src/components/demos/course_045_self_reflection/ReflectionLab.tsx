'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    PenTool,
    MessageSquare,
    CheckCircle,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { runSelfReflection, ReflectionResult } from '@/actions/course_045_self_reflection/reflection_backend';

export function ReflectionLab() {
    const [request, setRequest] = useState("");
    const [result, setResult] = useState<ReflectionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRun = async (t: string = request) => {
        if (!t.trim() || isProcessing) return;
        setIsProcessing(true);
        setResult(null); // Clear previous

        try {
            const res = await runSelfReflection(t);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[800px]">
            {/* Input */}
            <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <input
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                    placeholder="E.g. 'Write a polite email declining a wedding invitation'"
                    className="flex-1 bg-transparent px-4 border-none outline-none"
                    disabled={isProcessing}
                />
                <button
                    onClick={() => handleRun()}
                    disabled={isProcessing || !request}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                </button>
            </div>

            {/* Pipeline View */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">

                {/* 1. Draft */}
                <div className="flex-1 flex flex-col min-h-0 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <PenTool className="w-4 h-4" /> 1. Draft
                    </div>
                    <div className="flex-1 overflow-y-auto text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap custom-scrollbar">
                        {result ? result.draft : (isProcessing && "Drafting...")}
                    </div>
                </div>

                <div className="hidden md:flex flex-col justify-center text-zinc-300"><ArrowRight /></div>

                {/* 2. Critique */}
                <div className="flex-1 flex flex-col min-h-0 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4" /> 2. Critique
                    </div>
                    <div className="flex-1 overflow-y-auto text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap custom-scrollbar">
                        {result ? result.critique : (isProcessing && result?.draft && "Critiquing...")}
                    </div>
                </div>

                <div className="hidden md:flex flex-col justify-center text-zinc-300"><ArrowRight /></div>

                {/* 3. Final */}
                <div className="flex-1 flex flex-col min-h-0 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" /> 3. Final Version
                    </div>
                    <div className="flex-1 overflow-y-auto text-sm text-emerald-900 dark:text-emerald-100 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                        {result ? result.final : (isProcessing && result?.critique && "Revising...")}
                    </div>
                </div>

            </div>
        </div>
    );
}
