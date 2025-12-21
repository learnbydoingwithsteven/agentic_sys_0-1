'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Code, Cpu, ArrowRight, Zap, Play, Box, Layers, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCode, type CodeGenMode } from '@/actions/course_012_code_generation/code_gen';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const LANGUAGES = ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript', 'HTML/CSS'];

const SAMPLE_PROMPTS = [
    "A function to calculate Fibonacci numbers recursively with memoization",
    "A REST API endpoint for User Signup with validation",
    "A binary search tree class with insert and delete methods"
];

export function CodeGenLab() {
    const [input, setInput] = useState(SAMPLE_PROMPTS[0]);
    const [language, setLanguage] = useState('TypeScript');
    const [mode, setMode] = useState<CodeGenMode>('architect');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0 && available.includes("codellama")) {
                    setModel("codellama");
                } else if (available.length > 0) {
                    setModel(available[0]);
                }
            } catch (err) {
                console.error("Failed to load models", err);
            }
        };
        checkModels();
    }, []);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await generateCode(input, language, mode, model);
            if (res.success) {
                setResult({ ...res.data, systemPrompt: res.systemPrompt });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[900px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Terminal className="w-5 h-5 text-emerald-500" />
                        <h3>Code Architect</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                        >
                            {models.length === 0 && <option value="llama3.2">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div title={models.length > 0 ? "Models Loaded" : "Checking Models"} className={`w-2 h-2 rounded-full ${models.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 text-xs bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('snippet')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'snippet'
                                ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <FileCode className="w-3 h-3" /> Snippet Mode
                    </button>
                    <button
                        onClick={() => setMode('architect')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'architect'
                                ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Cpu className="w-3 h-3" /> Architect Agent
                    </button>
                </div>

                {/* Language Selector */}
                <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-lg overflow-x-auto">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${language === lang
                                    ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">

                <form onSubmit={handleRun} className="mb-8 ">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            Goal
                        </label>
                        <div className="flex gap-2">
                            {SAMPLE_PROMPTS.map((prompt, i) => (
                                <button type="button" key={i} onClick={() => setInput(prompt)} className="text-[10px] text-zinc-400 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full transition-colors">
                                    Sample {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm resize-none h-24 leading-relaxed font-mono"
                            disabled={loading}
                            placeholder="Describe the function or component you need..."
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Layers className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            {loading ? 'Building...' : 'Generate'}
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
                            {/* The Code */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg relative">
                                <div className="flex justify-between items-center px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        <Code className="w-4 h-4 text-emerald-500" /> {language} Output
                                    </h4>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <pre className="font-mono text-sm text-zinc-300">
                                        {result.code}
                                    </pre>
                                </div>
                            </div>

                            {/* Analysis Cards (Architect Only) */}
                            {mode === 'architect' && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-xl">
                                        <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                                            <Cpu className="w-3 h-3" /> Architectural Logic
                                        </h5>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-200/80 leading-relaxed mb-4">
                                            {typeof result.explanation === 'object' ? JSON.stringify(result.explanation) : result.explanation}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {result.edge_cases?.map((ec: string, i: number) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-white dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 rounded text-emerald-600 dark:text-emerald-400">
                                                    🛡️ {ec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Architecture & Prompt Viz */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    {mode === 'snippet' ? 'Generation Pipeline' : 'Architectural Pipeline'}
                                </h4>

                                {mode === 'snippet' ? (
                                    /* SIMPLE DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono mb-6 opacity-60">
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Prompt</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 font-bold">LLM</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Code</span>
                                    </div>
                                ) : (
                                    /* AGENTIC DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono mb-6">
                                        <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Requirement</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <div className="flex flex-col items-center">
                                            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 mb-1">
                                                System Design
                                            </span>
                                            <span className="text-[9px] text-zinc-400">Edge Cases, Types</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-blue-600">Optimal Implementation</span>
                                    </div>
                                )}

                                {/* System Prompt View */}
                                {result.systemPrompt && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-500 font-bold uppercase tracking-wider">
                                                <Terminal className="w-3 h-3" /> System Prompt
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto max-h-60 overflow-y-auto">
                                                {result.systemPrompt}
                                            </pre>
                                        </div>

                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase tracking-wider">
                                                <Zap className="w-3 h-3" /> {mode === 'snippet' ? 'Basic Generator' : 'Agentic Architect'}
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto max-h-60 overflow-y-auto language-typescript">
                                                {mode === 'snippet' ? `// Snippet Mode
const llm = new ChatOllama({ model: "${model}" });
const prompt = PromptTemplate.fromTemplate(snippetTemplate);
const chain = prompt.pipe(llm);
// Direct text completion` :
                                                    `// Architect Mode
const llm = new ChatOllama({
    model: "${model}",
    format: "json",
    temperature: 0.2 // Strict
});

// Enforces types, docs, and best practices
const chain = prompt.pipe(llm).pipe(new StringOutputParser());`}
                                            </pre>
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
