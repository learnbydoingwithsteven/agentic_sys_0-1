'use client';

import React, { useState, useEffect } from 'react';
import { AlignLeft, FileText, Settings, RefreshCw, Zap, ArrowRight, List, Type, Check, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeText, type SummaryLength, type SummaryFormat } from '@/actions/course_009_summarization/summarization';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';
import ReactMarkdown from 'react-markdown';

const SAMPLE_TEXTS = [
    {
        title: "Space Exploration",
        content: "Space exploration is the use of astronomy and space technology to explore outer space. While the study of space is carried out mainly by astronomers with telescopes, its physical exploration though is conducted both by unmanned robotic space probes and human spaceflight. Space exploration, like its classical form astronomy, is one of the main sources for space science. While the observation of objects in space, known as astronomy, predates reliable recorded history, it was the development of large and relatively efficient rockets during the mid-twentieth century that allowed physical space exploration to become a reality. Common rationales for exploring space include advancing scientific research, national prestige, uniting different nations, ensuring the future survival of humanity, and developing military and strategic advantages against other countries."
    },
    {
        title: "Artificial Intelligence",
        content: "Artificial intelligence (AI) is the intelligence of machines or software, as opposed to the intelligence of living beings, primarily of humans. It is a field of study in computer science that develops and studies intelligent machines. Such machines may be called AIs. AI technology is widely used throughout industry, government, and science. Some high-profile applications are: advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon, and Netflix), understanding human speech (such as Google Assistant, Siri, and Alexa), self-driving cars (e.g., Waymo), generative or creative tools (ChatGPT and AI art), and competing at the highest level in strategic games (such as chess and Go). Alan Turing was the first person to conduct substantial research in the field that he called Machine Intelligence."
    }
];

export function SummarizationLab() {
    const [input, setInput] = useState(SAMPLE_TEXTS[0].content);
    const [length, setLength] = useState<SummaryLength>('medium');
    const [format, setFormat] = useState<SummaryFormat>('paragraph');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ summary: string, systemPrompt?: string } | null>(null);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const checkModels = async () => {
            setIsChecking(true);
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0 && !itemsContains(available, model)) {
                    setModel(available[0]);
                }
            } catch (err) {
                console.error("Failed to load models", err);
            } finally {
                setIsChecking(false);
            }
        };
        checkModels();
    }, []);

    const itemsContains = (arr: string[], item: string) => arr.includes(item);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await summarizeText(input, length, format, model);
            if (res.success) {
                setResult({ summary: res.summary, systemPrompt: res.systemPrompt });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <h3>Smart Summarizer</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                        >
                            {models.length === 0 && <option value="llama3.2">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div title={models.length > 0 ? "Models Loaded" : "Checking Models"} className={`w-2 h-2 rounded-full ${models.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    {/* Length Selector */}
                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg flex text-xs">
                        {(['short', 'medium', 'long'] as const).map(l => (
                            <button
                                key={l}
                                onClick={() => setLength(l)}
                                className={`flex-1 py-1 px-2 rounded capitalize font-medium transition-all ${length === l
                                        ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                    {/* Format Selector */}
                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg flex text-xs">
                        {(['paragraph', 'bullets'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                className={`flex-1 py-1 px-2 rounded capitalize font-medium transition-all flex items-center justify-center gap-1 ${format === f
                                        ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                {f === 'paragraph' ? <AlignLeft className="w-3 h-3" /> : <List className="w-3 h-3" />}
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">

                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider flex justify-between">
                        <span>Source Text</span>
                        <div className="flex gap-2">
                            {SAMPLE_TEXTS.map((s, i) => (
                                <button type="button" key={i} onClick={() => setInput(s.content)} className="text-zinc-400 hover:text-indigo-500 transition-colors">
                                    Sample {i + 1}
                                </button>
                            ))}
                        </div>
                    </label>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none h-40 leading-relaxed"
                            disabled={loading}
                            placeholder="Paste text to summarize..."
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Sparkles className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {loading ? 'Summarizing...' : 'Summarize'}
                        </button>
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto grid gap-6"
                        >
                            {/* The Summary */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg p-6 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500" /> AI Summary
                                </h4>
                                <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-700 dark:text-zinc-300">
                                    <ReactMarkdown>{result.summary}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Architecture & Prompt Viz */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">Summarization Architecture</h4>

                                <div className="flex flex-col gap-6">
                                    {/* Diagram */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono">
                                        <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Long Text</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <div className="flex flex-col items-center">
                                            <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded text-purple-600 mb-1">Compression</span>
                                            <span className="text-[10px] text-zinc-400 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                                {length} / {format}
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600">Summary</span>
                                    </div>

                                    {/* System Prompt View */}
                                    {result.systemPrompt && (
                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-purple-500 font-bold uppercase tracking-wider">
                                                <Quote className="w-3 h-3" /> Constructed System Prompt
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto">
                                                {result.systemPrompt}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
