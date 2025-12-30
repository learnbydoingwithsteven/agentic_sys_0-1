'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hammer,
    Code,
    Play,
    Terminal
} from 'lucide-react';
import { generateToolCode, runGeneratedTool } from '@/actions/course_097_tool_creation/tool_creator_backend';

export function ToolCreationLab() {
    const [task, setTask] = useState("");
    const [code, setCode] = useState("");
    const [inputVal, setInputVal] = useState("5");
    const [output, setOutput] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setCode("");
        setOutput(null);

        await new Promise(r => setTimeout(r, 1000)); // Coding time
        const res = await generateToolCode(task);

        // Typewriter effect mock
        setCode(res);
        setIsGenerating(false);
    };

    const handleRun = async () => {
        const res = await runGeneratedTool(code, Number(inputVal));
        setOutput(res);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Input Section */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-indigo-500" />
                    Tool Smith Agent
                </h3>
                <form onSubmit={handleGenerate} className="flex gap-4">
                    <input
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        placeholder="e.g. 'Calculate the area of a circle' or 'Compute fibonacci sequence'"
                        className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !task}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Code className="w-4 h-4" /> Generate Tool
                    </button>
                </form>
            </div>

            {/* Code Editor */}
            <div className="flex-1 bg-[#1e1e1e] rounded-3xl p-6 font-mono border border-zinc-700 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-700 pb-2">
                    <Terminal className="w-4 h-4" /> Generated Function.js
                </div>

                <div className="flex-1 text-sm leading-relaxed text-blue-300">
                    {isGenerating ? (
                        <span className="animate-pulse text-zinc-500">Writing code...</span>
                    ) : (
                        <pre className="whitespace-pre-wrap">{code || "// No tool generated yet."}</pre>
                    )}
                </div>

                {/* Execution Panel */}
                {code && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="absolute bottom-6 right-6 left-6 bg-zinc-800 p-4 rounded-xl border border-zinc-600 flex items-center gap-4"
                    >
                        <span className="text-zinc-400 text-sm">Input Arg:</span>
                        <input
                            type="number"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            className="bg-zinc-900 text-white w-20 px-2 py-1 rounded border border-zinc-700"
                        />
                        <button
                            onClick={handleRun}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold"
                        >
                            <Play className="w-3 h-3 fill-current" /> Execute
                        </button>
                        {output !== null && (
                            <div className="ml-auto font-bold text-green-400">
                                Output: {typeof output === 'number' ? output.toFixed(2) : output}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
