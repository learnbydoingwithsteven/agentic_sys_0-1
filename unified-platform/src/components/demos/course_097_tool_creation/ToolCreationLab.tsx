'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hammer,
    Code,
    Play,
    Terminal,
    Wrench,
    Cpu
} from 'lucide-react';
import { generateToolCode, runGeneratedTool } from '@/actions/course_097_tool_creation/tool_creator_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function ToolCreationLab() {
    const [task, setTask] = useState("Calculate the factorial of a number");
    const [code, setCode] = useState("");
    const [inputVal, setInputVal] = useState("5");
    const [output, setOutput] = useState<any>(null);
    const [status, setStatus] = useState("Idle");
    const [isGenerating, setIsGenerating] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel) return;
        setIsGenerating(true);
        setCode("");
        setOutput(null);
        setStatus("Agent is analyzing task & writing code...");

        const res = await generateToolCode(task, selectedModel);

        setCode(res);
        setStatus("Tool Generated. Ready to execute.");
        setIsGenerating(false);
    };

    const handleRun = async () => {
        // Convert input to number if it looks like one
        const num = Number(inputVal);
        const arg = isNaN(num) ? inputVal : num;

        setStatus("Executing Tool...");
        const res = await runGeneratedTool(code, arg);
        setOutput(res);
        setStatus("Execution Complete.");
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-500" />
                        Tool Creator Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Agent dynamically writes new software tools to solve problems.</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                <form onSubmit={handleGenerate} className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-bold uppercase text-zinc-400 mb-1 block">Problem / Task</label>
                        <input
                            value={task}
                            onChange={e => setTask(e.target.value)}
                            placeholder="e.g. 'Convert Celsius to Fahrenheit'"
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating || !task || !selectedModel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 mt-6 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isGenerating ? <Cpu className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
                        Generate Tool
                    </button>
                </form>
            </div>

            {/* Code Editor & Execution */}
            <div className="flex-1 bg-[#1e1e1e] rounded-3xl p-0 font-mono border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest">
                        <Terminal className="w-4 h-4" /> Generated_Tool.js
                    </div>
                    <div className="text-[10px] text-zinc-500">{status}</div>
                </div>

                <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <div className="animate-pulse">Writing optimized JavaScript...</div>
                        </div>
                    ) : (
                        <pre className="text-sm leading-relaxed text-blue-300 font-medium">
                            {code || "// Waiting for task..."}
                        </pre>
                    )}
                </div>

                {/* Execution Panel */}
                <AnimatePresence>
                    {code && !isGenerating && (
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            className="bg-[#2d2d2d] border-t border-zinc-700 p-4 flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400 text-xs font-bold uppercase">Input Arg:</span>
                                <input
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    className="bg-black/30 text-white px-3 py-1.5 rounded border border-zinc-600 outline-none focus:border-indigo-500 w-32 font-mono text-sm"
                                    placeholder="Value"
                                />
                            </div>

                            <button
                                onClick={handleRun}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                <Play className="w-3 h-3 fill-current" /> Run Tool
                            </button>

                            {output !== null && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-auto flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg border border-white/5"
                                >
                                    <span className="text-zinc-500 text-xs uppercase font-bold">Return Value:</span>
                                    <span className="font-mono font-bold text-green-400">
                                        {typeof output === 'object' ? JSON.stringify(output) : String(output)}
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
