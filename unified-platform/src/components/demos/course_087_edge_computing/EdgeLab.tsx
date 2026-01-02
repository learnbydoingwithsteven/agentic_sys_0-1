'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Router,
    Cloud,
    Siren,
    Search,
    Send,
    ArrowRight
} from 'lucide-react';
import { processEdgeRequest, EdgeResult } from '@/actions/course_087_edge_computing/edge_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function EdgeLab() {
    const [input, setInput] = useState("Intruder detected in backyard!");
    const [result, setResult] = useState<EdgeResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleSend = async () => {
        if (!selectedModel) return;
        setLoading(true);
        setResult(null);
        const res = await processEdgeRequest(input, selectedModel);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Router className="w-5 h-5 text-green-500" />
                        Hyper-Local Edge Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Routes urgent tasks Locally, offloads complex tasks to Cloud.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            <div className="flex-1 flex flex-col gap-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 relative">

                {/* Visual Pipeline */}
                <div className="grid grid-cols-3 gap-8 h-full">
                    {/* 1. User Input */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm border-zinc-200 dark:border-zinc-800">
                            <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">IoT Sensor / User Input</label>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-full p-2 bg-transparent border-b border-zinc-200 dark:border-zinc-700 outline-none h-24 text-sm font-medium resize-none mb-4"
                            />
                            <div className="flex gap-2 mb-4">
                                <button className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200" onClick={() => setInput("Fire in the kitchen!")}>🔥 Urgent</button>
                                <button className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200" onClick={() => setInput("What is the history of Rome?")}>📚 Complex</button>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={loading || !selectedModel}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : (
                                    <>Send Data <Send className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 2. Edge Node */}
                    <div className="flex flex-col items-center justify-center relative">
                        <div className={`
                            w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center z-10 bg-white dark:bg-zinc-900 transition-colors
                            ${loading ? 'border-zinc-300 animate-pulse' : (result?.path === 'EDGE_ONLY' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-zinc-400')}
                        `}>
                            <Router className={`w-10 h-10 mb-2 ${result?.path === 'EDGE_ONLY' ? 'text-green-500' : 'text-zinc-500'}`} />
                            <div className="font-bold text-xs uppercase">Edge AI</div>
                        </div>

                        {/* Edge Decision Bubble */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full mt-4 bg-zinc-800 text-white text-xs p-3 rounded-xl text-center w-48"
                            >
                                <div className="font-bold text-zinc-400 uppercase text-[10px] mb-1">Reasoning</div>
                                "{result.edgeThinking}"
                            </motion.div>
                        )}

                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-full w-full h-1 bg-zinc-200 dark:bg-zinc-800 -z-10 -ml-4" />
                    </div>

                    {/* 3. Cloud / Action Node */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={`
                            relative w-full aspect-square max-w-[200px] rounded-2xl border-4 flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-zinc-900 transition-colors
                            ${result?.path === 'EDGE_THEN_CLOUD' ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : (result?.path === 'EDGE_ONLY' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-zinc-200 dark:border-zinc-800')}
                        `}>
                            {result?.path === 'EDGE_ONLY' ? (
                                <>
                                    <Siren className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
                                    <div className="font-bold text-red-600">LOCAL ALERT</div>
                                    <div className="text-xs text-red-400 mt-2 font-mono">Latency: {result.totalLatency}ms</div>
                                </>
                            ) : result?.path === 'EDGE_THEN_CLOUD' ? (
                                <>
                                    <Cloud className="w-12 h-12 text-blue-500 mb-2" />
                                    <div className="font-bold text-blue-600">CLOUD RESPONSE</div>
                                    <div className="text-xs text-zinc-500 line-clamp-4 mt-2">{result.cloudResponse}</div>
                                    <div className="text-xs text-blue-400 mt-2 font-mono">Latency: {result.totalLatency}ms</div>
                                </>
                            ) : (
                                <div className="text-zinc-300 font-bold">Waiting...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
