'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    MessageSquare,
    Send,
    Zap,
    Wind,
    Loader2
} from 'lucide-react';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

export function StreamingLab() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [latency, setLatency] = useState<number | null>(null);
    const [tokenCount, setTokenCount] = useState(0);

    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) setSelectedModel(ms[0]);
        });
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        setIsStreaming(true);
        setResponse("");
        setTokenCount(0);
        setLatency(null);

        const startTime = Date.now();
        let firstByte = true;

        try {
            const res = await fetch('/api/course_036_streaming', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, model: selectedModel })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (firstByte) {
                    setLatency(Date.now() - startTime);
                    firstByte = false;
                }

                const chunk = decoder.decode(value, { stream: true });
                setResponse(prev => prev + chunk);
                setTokenCount(prev => prev + 1); // Approximate token count (chunk count)
            }

        } catch (e) {
            console.error(e);
            setResponse(r => r + "\n[Error: Stream failed]");
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[500px]">
            {/* Left: Input & Controls */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                        <Wind className="w-5 h-5" />
                        Stream Control
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase">Model</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full mt-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none"
                            >
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase">Prompt</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full mt-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="E.g. Write a poem about rust..."
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={isStreaming || !input}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {isStreaming ? "Streaming..." : "Generate Stream"}
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="mt-8 grid grid-cols-2 gap-2">
                        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-center">
                            <div className="text-xs text-zinc-500 mb-1">Time to First Token</div>
                            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {latency ? `${latency}ms` : '-'}
                            </div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-center">
                            <div className="text-xs text-zinc-500 mb-1">Chunks Received</div>
                            <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                {tokenCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Output */}
            <div className="flex-1 bg-zinc-900 text-zinc-100 rounded-3xl p-6 font-mono text-sm leading-relaxed overflow-y-auto shadow-inner relative border border-zinc-800">
                {response ? (
                    <div className="whitespace-pre-wrap">
                        {response}
                        {isStreaming && <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                        <Zap className="w-12 h-12 mb-4 opacity-50" />
                        <p>Waiting for tokens...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
