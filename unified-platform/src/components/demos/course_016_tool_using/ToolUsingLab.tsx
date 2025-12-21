'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Brain, Calculator, Cloud, Clock, Zap, ArrowRight, CheckCircle, XCircle, Activity, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runToolAgent, type AgentMode, type AgentResponse } from '@/actions/course_016_tool_using/tool_agent';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const SAMPLE_QUERIES = [
    { label: 'Math', query: "What is 127 multiplied by 43?", needsTool: true },
    { label: 'Weather', query: "What's the weather like in Tokyo?", needsTool: true },
    { label: 'Time', query: "What time is it right now?", needsTool: true },
    { label: 'Complex', query: "What's the weather in Paris and what is 15% of 250?", needsTool: true },
    { label: 'General', query: "Explain what photosynthesis is", needsTool: false }
];

export function ToolUsingLab() {
    const [input, setInput] = useState(SAMPLE_QUERIES[0].query);
    const [mode, setMode] = useState<AgentMode>('tool_enabled');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AgentResponse | null>(null);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await runToolAgent(input, mode, model);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[900px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        <h3>Tool-Using Agent Lab</h3>
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 text-xs bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('vanilla')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'vanilla'
                                ? 'bg-white dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Brain className="w-3 h-3" /> Vanilla LLM
                    </button>
                    <button
                        onClick={() => setMode('tool_enabled')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'tool_enabled'
                                ? 'bg-white dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Wrench className="w-3 h-3" /> Tool Agent
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Sample Queries */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sample Queries</label>
                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_QUERIES.map((sample, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setInput(sample.query)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${sample.needsTool
                                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100'
                                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                                    }`}
                            >
                                {sample.needsTool && <Wrench className="w-3 h-3 inline mr-1" />}
                                {sample.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRun} className="mb-8">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm resize-none h-24 leading-relaxed"
                            disabled={loading}
                            placeholder="Ask a question that requires tools (math, weather, time)..."
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Activity className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {loading ? 'Processing...' : 'Run'}
                        </button>
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Response Card */}
                            <div className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-lg p-6 relative ${result.success
                                    ? 'border-emerald-200 dark:border-emerald-800'
                                    : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'
                                    }`} />
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        {result.success ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                        {result.mode === 'vanilla' ? 'Vanilla Response' : 'Agent Response'}
                                    </h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${result.mode === 'tool_enabled'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                        }`}>
                                        {result.mode === 'tool_enabled' ? 'Tools Used' : 'No Tools'}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                    {result.output || result.error}
                                </div>
                            </div>

                            {/* Tool Calls Log */}
                            {result.toolCalls && result.toolCalls.length > 0 && (
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
                                    <h5 className="text-xs font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Tool Execution Log
                                    </h5>
                                    <div className="space-y-2">
                                        {result.toolCalls.map((call, i) => (
                                            <div key={i} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-orange-200 dark:border-orange-800/50 text-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-bold text-orange-700 dark:text-orange-400">{call.tool}</span>
                                                </div>
                                                <div className="ml-7 space-y-1">
                                                    <div className="text-zinc-600 dark:text-zinc-400">
                                                        <span className="font-bold">Input:</span> {call.input}
                                                    </div>
                                                    <div className="text-zinc-600 dark:text-zinc-400">
                                                        <span className="font-bold">Output:</span> {call.output}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Architecture Diagram */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    {mode === 'vanilla' ? 'Vanilla Pipeline' : 'Tool-Augmented Pipeline'}
                                </h4>

                                {mode === 'vanilla' ? (
                                    /* VANILLA DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono mb-6 opacity-60">
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Query</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 font-bold">LLM</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Answer</span>
                                    </div>
                                ) : (
                                    /* TOOL AGENT DIAGRAM */
                                    <div className="space-y-4 mb-6">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono">
                                            <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Query</span>
                                            <ArrowRight className="w-4 h-4 text-zinc-300" />
                                            <div className="relative p-3 border-2 border-dashed border-orange-300 dark:border-orange-800 rounded-xl bg-orange-50/50 dark:bg-orange-900/10">
                                                <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-orange-600 border border-orange-200 rounded font-bold">ReAct Loop</div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Brain className="w-3 h-3 text-purple-500" />
                                                        <span className="text-purple-600 dark:text-purple-400 font-bold">Reasoning</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calculator className="w-3 h-3 text-blue-500" />
                                                        <Cloud className="w-3 h-3 text-blue-500" />
                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                        <span className="text-blue-600 dark:text-blue-400 text-[10px]">Tool Selection</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Wrench className="w-3 h-3 text-orange-500" />
                                                        <span className="text-orange-600 dark:text-orange-400 text-[10px]">Execution</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-300" />
                                            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 font-bold">Grounded Answer</span>
                                        </div>
                                    </div>
                                )}

                                {/* Available Tools */}
                                {mode === 'tool_enabled' && (
                                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl">
                                        <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Available Tools</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Calculator</div>
                                                    <div className="text-[9px] text-zinc-500">Math operations</div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                                                <Cloud className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Weather</div>
                                                    <div className="text-[9px] text-zinc-500">City weather data</div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Time</div>
                                                    <div className="text-[9px] text-zinc-500">Current date/time</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
