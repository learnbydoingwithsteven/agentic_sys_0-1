'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Bug, Play, Activity, Clock, Database, ArrowRight, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runDebugAgent, type LogEvent } from '@/actions/course_013_logging_debugging/debug_agent';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const SAMPLE_INPUTS = [
    "Explain quantum entanglement like I'm 5",
    "Write a haiku about debugging code",
    "List 3 reasons why observability matters"
];

export function DebuggingLab() {
    const [input, setInput] = useState(SAMPLE_INPUTS[0]);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

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

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setLogs([]); // Clear logs
        setResult(null);

        try {
            const res = await runDebugAgent(input, model);
            if (res.success) {
                // Simulate streaming logs for effect
                const eventLogs = res.logs || [];
                // In a real streaming app, these would come in real-time. 
                // We'll reveal them quickly one by one.
                for (let i = 0; i < eventLogs.length; i++) {
                    await new Promise(r => setTimeout(r, 200)); // Delay
                    setLogs(prev => [...prev, eventLogs[i]]);
                }
                setResult(res.output);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getLogIcon = (type: LogEvent['type']) => {
        switch (type) {
            case 'chain_start': return <Play className="w-3 h-3 text-blue-500" />;
            case 'chain_end': return <Database className="w-3 h-3 text-blue-500" />;
            case 'llm_start': return <Activity className="w-3 h-3 text-purple-500" />;
            case 'llm_end': return <FileText className="w-3 h-3 text-green-500" />;
            case 'error': return <Bug className="w-3 h-3 text-red-500" />;
            default: return <Clock className="w-3 h-3 text-zinc-500" />;
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[800px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                    <Bug className="w-5 h-5 text-amber-500" />
                    <h3>Agent Observability Console</h3>
                </div>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-amber-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Controls & Output */}
                <div className="w-1/2 p-6 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
                    <form onSubmit={handleRun} className="mb-6">
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            {SAMPLE_INPUTS.map((s, i) => (
                                <button type="button" key={i} onClick={() => setInput(s)} className="whitespace-nowrap text-[10px] text-zinc-400 hover:text-amber-500 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full transition-colors">
                                    Sample {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm resize-none h-32"
                                placeholder="Enter a prompt to trace..."
                                disabled={loading}
                            />
                            <button
                                disabled={loading || !input.trim()}
                                className="absolute bottom-3 right-3 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-2 shadow-md"
                            >
                                {loading ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                Trace
                            </button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm"
                            >
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Final Output</h4>
                                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                    {result}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel: Live Logs */}
                <div className="w-1/2 flex flex-col bg-zinc-950 text-zinc-300 font-mono text-xs">
                    <div className="p-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2 text-zinc-500">
                        <Terminal className="w-3 h-3" />
                        <span className="uppercase tracking-wider font-bold text-[10px]">Trace Log</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {logs.length === 0 && (
                            <div className="h-full flex items-center justify-center text-zinc-700 italic">
                                Ready to capture events...
                            </div>
                        )}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative pl-4 border-l border-zinc-800"
                            >
                                <div className="absolute left-[-5px] top-0 bg-zinc-950 p-0.5 rounded-full border border-zinc-800">
                                    {getLogIcon(log.type)}
                                </div>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className={`font-bold ${log.type.includes('start') ? 'text-blue-400' :
                                            log.type.includes('end') ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {log.name} <span className="text-zinc-600 font-normal">::{log.type}</span>
                                    </span>
                                    <span className="text-[9px] text-zinc-700">
                                        +{log.timestamp - (logs[0]?.timestamp || log.timestamp)}ms
                                    </span>
                                </div>
                                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/50 overflow-x-auto text-[10px] text-zinc-400 whitespace-pre-wrap break-all">
                                    {log.content.length > 200 ? log.content.substring(0, 200) + '...' : log.content}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
