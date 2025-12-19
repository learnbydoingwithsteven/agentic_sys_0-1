'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, AlertTriangle, Send, RefreshCw, Cpu } from 'lucide-react';
import { runOllamaPrompt, getOllamaModels, type PromptResult } from '@/actions/course_002_prompt_engineering/prompt';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';


const PRESETS = [
    {
        category: 'Creative',
        label: 'Sci-Fi Story',
        technique: 'basic',
        text: 'Write a short story about a robot who discovers an old garden in a post-apocalyptic city. Focus on the sensory details.'
    },
    {
        category: 'Reasoning',
        label: 'Logic Puzzle',
        technique: 'cot',
        text: 'I have 3 apples. I eat one. Then I buy two more cartons of 6 apples each. Finally, I give half of my total apples to my friend. How many apples do I have left? Think through this step-by-step.'
    },
    {
        category: 'Coding',
        label: 'React Component',
        technique: 'role',
        text: 'You are an expert Frontend Engineer. Write a React functional component for a "Card" that takes title, content, and an image URL as props. Use Tailwind CSS for styling.'
    },

    {
        category: 'Business',
        label: 'Email Professional',
        technique: 'role',
        text: 'You are a professional executive assistant. Rewrite the following email to be more polite and professional:\n"Hey, I need that report by 5pm. Dont be late."'
    },
    {
        category: 'Education',
        label: 'Socratic Tutor',
        technique: 'socratic',
        text: 'I want to understand how photosynthesis works. Teach me.'
    },
    {
        category: 'Analysis',
        label: 'Bias Check',
        technique: 'reflection',
        text: 'Argue that remote work is bad for productivity. Then, critique your own argument.'

    }
];

const TECHNIQUES = [
    { id: 'basic', name: 'Basic Instruction', description: 'Standard direct prompting. Good for simple tasks.' },
    { id: 'fewshot', name: 'Few-Shot Learning', description: 'Provide examples to guide the model.' },
    { id: 'cot', name: 'Chain-of-Thought', description: 'Encourages step-by-step reasoning logic.' },
    { id: 'role', name: 'Role Persona', description: 'Assigns an expert persona to the model.' },
    { id: 'socratic', name: 'Socratic Method', description: 'Asks questions to guide you rather than answering.' },
    { id: 'reflection', name: 'Self-Reflection', description: 'Critiques its own output to identify bias or errors.' }
];

export function PromptLab() {
    const [result, setResult] = useState<PromptResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [technique, setTechnique] = useState('basic');
    const [prompt, setPrompt] = useState('');
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [isCheckingModels, setIsCheckingModels] = useState(false);

    useEffect(() => {
        checkModels();
    }, []);

    const checkModels = async () => {
        setIsCheckingModels(true);
        try {
            const available = await getOllamaModels();
            setModels(available);
            if (available.length > 0 && !selectedModel) {
                setSelectedModel(available[0]);
            }
        } catch (err) {
            console.error("Failed to check models", err);
        } finally {
            setIsCheckingModels(false);
        }
    };

    const loadPreset = (preset: typeof PRESETS[0]) => {
        setPrompt(preset.text);
        setTechnique(preset.technique);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('technique', technique);
        formData.append('prompt', prompt);
        formData.append('model', selectedModel);

        try {
            const res = await runOllamaPrompt(formData);
            setResult(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    Prompt Engineering Lab
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Test different techniques with a live LLM.
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-zinc-500" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Target Model</span>
                            {models.length > 0 ? (
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="bg-transparent text-sm font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
                                >
                                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <span className="text-sm text-red-500 font-medium">No Local Models Found</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={checkModels}
                        disabled={isCheckingModels}
                        className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors"
                        title="Refresh Models"
                    >
                        <RefreshCw className={`w-4 h-4 ${isCheckingModels ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Technique Strategy</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {TECHNIQUES.map((t) => {
                                const preset = PRESETS.find(p => p.technique === t.id);
                                return (
                                    <div
                                        key={t.id}
                                        onClick={() => setTechnique(t.id)}
                                        className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer group ${technique === t.id
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500'
                                            : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-zinc-800/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className={`font-semibold text-sm mb-1 ${technique === t.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                    {t.name}
                                                </div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug mb-2">
                                                    {t.description}
                                                </div>
                                            </div>
                                            {technique === t.id && (
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50 shrink-0 ml-2" />
                                            )}
                                        </div>

                                        {preset && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    loadPreset(preset);
                                                }}
                                                className={`text-[10px] px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${technique === t.id
                                                    ? 'bg-indigo-100 dark:bg-indigo-800/50 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700'
                                                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                <span className="opacity-70">Example:</span>
                                                <span className="font-medium">{preset.label}</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Your Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all resize-none font-mono text-sm"
                            placeholder="Enter your instructions here..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Generate Response
                            </>
                        )}
                    </button>
                </form>


                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Result Card */}
                        <div className={`relative group rounded-xl border shadow-sm overflow-hidden transition-all ${result.error
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                            }`}>

                            {/* Result Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${result.error ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                        }`}>
                                        <Cpu className="w-3 h-3" />
                                        {result.model}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                                        <span>{result.latency}ms</span>
                                        <span className="text-zinc-300">|</span>
                                        <span>{result.tokens} tokens</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigator.clipboard.writeText(result.response)}
                                    className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy Response"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" /> {/* Using Refresh icon as placeholder for Copy if Clipboard icon unavailable, but better to just use text or generic icon if unsure. I will check imports. */}
                                    {/* Actually I don't have Clipboard in imports. I'll add Copy logic but reuse an icon or just text. */}
                                </button>
                            </div>

                            {/* Result Body */}
                            <div className="p-5 overflow-x-auto">
                                {result.error ? (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span>{result.error}</span>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                                        <ReactMarkdown>{result.response}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
