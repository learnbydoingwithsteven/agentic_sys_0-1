'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    GitMerge,
    CreditCard,
    Wrench,
    MessageCircle,
    HelpCircle,
    Zap,
    ArrowRight
} from 'lucide-react';
import { routeRequest, RoutingResult } from '@/actions/course_035_routing/router_backend';

export function RouterLab() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<RoutingResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRoute = async () => {
        if (!input.trim() || isProcessing) return;
        setIsProcessing(true);
        setResult(null);

        try {
            const res = await routeRequest(input);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const getIcon = (route: string) => {
        switch (route) {
            case 'refund': return <CreditCard className="w-5 h-5" />;
            case 'technical_support': return <Wrench className="w-5 h-5" />;
            case 'greeting': return <MessageCircle className="w-5 h-5" />;
            default: return <HelpCircle className="w-5 h-5" />;
        }
    };

    const getColor = (route: string, isWinner: boolean) => {
        if (!isWinner) return "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500";
        switch (route) {
            case 'refund': return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            case 'technical_support': return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case 'greeting': return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
            default: return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-[500px]">

            {/* Input Side */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <GitMerge className="w-5 h-5 text-indigo-500" />
                        Semantic Router
                    </h3>
                    <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                        Enter a query to see how it matches against predefined intent vectors.
                        No LLM is generated—just pure math.
                    </p>

                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRoute()}
                            placeholder="E.g. 'I want a refund' or 'login failed'"
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                        />
                        <button
                            onClick={handleRoute}
                            disabled={isProcessing || !input}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 font-medium transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? '...' : 'Route'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {["Hello world", "My screen is broken", "Too expensive, cancel this"].map(ex => (
                            <button
                                key={ex}
                                onClick={() => setInput(ex)}
                                className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Side */}
            <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-zinc-700 dark:text-zinc-300">Route Confidence</h3>
                    {result && (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {result.latency}ms
                        </div>
                    )}
                </div>

                {result ? (
                    <div className="flex-1 flex flex-col gap-3 justify-center">
                        {result.scores.map((score) => {
                            const isWinner = score.route === result.selectedRoute;
                            const percentage = Math.round(score.score * 100);

                            return (
                                <div key={score.route} className="relative">
                                    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-500 ${getColor(score.route, isWinner)}`}>
                                        <div className={`shrink-0 p-2 rounded-lg ${isWinner ? 'bg-white/50 dark:bg-black/20' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                            {getIcon(score.route)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold capitalize text-sm">{score.route.replace('_', ' ')}</span>
                                                <span className="font-mono text-xs opacity-70">{percentage}%</span>
                                            </div>
                                            {/* Bar */}
                                            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    className="h-full bg-current opacity-80"
                                                />
                                            </div>
                                        </div>
                                        {isWinner && <ArrowRight className="w-5 h-5 animate-pulse" />}
                                    </div>
                                </div>
                            );
                        })}

                        {result.selectedRoute === "general_inquiry" && (
                            <div className="mt-4 text-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-sm italic">
                                Low confidence match. Creating <strong>General Inquiry</strong> ticket...
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                        <GitMerge className="w-24 h-24 opacity-20" />
                    </div>
                )}
            </div>
        </div>
    );
}
