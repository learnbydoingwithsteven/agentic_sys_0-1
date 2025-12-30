'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Snowflake,
    Flame,
    Timer
} from 'lucide-react';
import { invokeAgentFunction } from '@/actions/course_086_serverless/serverless_backend';

export function ServerlessLab() {
    const [status, setStatus] = useState<'IDLE' | 'RUNNING'>('IDLE');
    const [lastRes, setLastRes] = useState<{ status: string, time: number } | null>(null);
    const [temp, setTemp] = useState(0); // 0 = Frozen, 100 = Hot

    // Cool down effect loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTemp(prev => Math.max(0, prev - 5));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleInvoke = async () => {
        setStatus('RUNNING');
        setLastRes(null);

        const res = await invokeAgentFunction();

        setLastRes({ status: res.status, time: res.executionTime });
        setStatus('IDLE');
        setTemp(100); // Heat up
    };

    const isFrozen = temp < 20;

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Lambda Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Scale-to-Zero Architecture</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm">
                    <Timer className="w-4 h-4" />
                    Last Run: <span className={`font-bold ${lastRes?.status === 'COLD' ? 'text-blue-500' : 'text-orange-500'}`}>{lastRes ? `${lastRes.time}ms` : '--'}</span>
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden">

                {/* Function Box */}
                <div className="relative group">
                    <motion.button
                        onClick={handleInvoke}
                        disabled={status === 'RUNNING'}
                        animate={{
                            scale: status === 'RUNNING' ? 1.1 : 1,
                            borderColor: status === 'RUNNING' ? '#f59e0b' : (isFrozen ? '#3b82f6' : '#d4d4d8')
                        }}
                        className={`
                            w-48 h-48 rounded-3xl border-4 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col items-center justify-center z-10 relative transition-all
                            ${isFrozen ? 'shadow-blue-200 dark:shadow-blue-900/20' : 'shadow-orange-200 dark:shadow-orange-900/20'}
                        `}
                    >
                        {status === 'RUNNING' ? (
                            <Zap className="w-16 h-16 text-yellow-500 animate-bounce" />
                        ) : isFrozen ? (
                            <Snowflake className="w-16 h-16 text-blue-400" />
                        ) : (
                            <Flame className="w-16 h-16 text-orange-500" />
                        )}
                        <div className="mt-4 font-bold text-lg">{status === 'RUNNING' ? 'EXECUTING' : (isFrozen ? 'FROZEN' : 'WARM')}</div>
                    </motion.button>

                    {/* Ice Overlay */}
                    {isFrozen && status !== 'RUNNING' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="absolute inset-0 bg-blue-200 rounded-3xl pointer-events-none blur-sm"
                        />
                    )}
                </div>

                <div className="mt-8 text-zinc-500 text-sm max-w-sm text-center">
                    {temp > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-orange-500 font-bold">
                            <Flame className="w-4 h-4" /> Cooling down... keep clicking to stay warm!
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-blue-500 font-bold">
                            <Snowflake className="w-4 h-4" /> Cold Start required (+2000ms latency)
                        </div>
                    )}
                </div>

                {/* Progress Bar for Heat */}
                <div className="absolute bottom-12 w-64 h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ width: `${temp}%` }}
                        className="h-full bg-gradient-to-r from-blue-400 to-orange-500"
                    />
                </div>
            </div>
        </div>
    );
}
