'use client';

import React, { useState, useEffect } from 'react';
import { Languages, ArrowRight, Zap, Sparkles, Globe, Quote, MessageCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateText, type TargetLanguage, type TranslationMode } from '@/actions/course_011_translation/translation';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const LANGUAGES: TargetLanguage[] = ['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Italian', 'Portuguese', 'Russian', 'Hindi', 'Arabic'];

const SAMPLE_PHRASES = [
    "It's raining cats and dogs out there!",
    "Can you please send me the quarterly report by EOD?",
    "I'm feeling a bit under the weather today."
];

export function TranslationLab() {
    const [input, setInput] = useState(SAMPLE_PHRASES[0]);
    const [targetLang, setTargetLang] = useState<TargetLanguage>('Spanish');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [mode, setMode] = useState<TranslationMode>('polyglot');

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
            const res = await translateText(input, targetLang, mode, model);
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
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        <h3>Polyglot Agent</h3>
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

                {/* Mode Selector */}
                <div className="flex gap-2 text-xs bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('simple')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'simple'
                            ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Zap className="w-3 h-3" /> Simple Translator
                    </button>
                    <button
                        onClick={() => setMode('polyglot')}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${mode === 'polyglot'
                            ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        <Sparkles className="w-3 h-3" /> Polyglot Agent
                    </button>
                </div>

                {/* Target Language Selector */}
                <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-lg overflow-x-auto">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang}
                            onClick={() => setTargetLang(lang)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${targetLang === lang
                                ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400'
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

                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            Source Input
                        </label>
                        <div className="flex gap-2">
                            {SAMPLE_PHRASES.map((phrase, i) => (
                                <button type="button" key={i} onClick={() => setInput(phrase)} className="text-[10px] text-zinc-400 hover:text-indigo-500 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full transition-colors">
                                    Sample {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none h-32 leading-relaxed"
                            disabled={loading}
                            placeholder="Type something to translate..."
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Sparkles className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {loading ? 'Translating...' : 'Translate'}
                        </button>
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto space-y-6"
                        >
                            {/* The Translation */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg p-6 relative">
                                <div className={`absolute top-0 left-0 w-1 h-full ${mode === 'polyglot' ? 'bg-indigo-500' : 'bg-zinc-400'}`} />
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        <Languages className={`w-4 h-4 ${mode === 'polyglot' ? 'text-indigo-500' : 'text-zinc-500'}`} />
                                        {targetLang} Translation
                                        {mode === 'simple' && <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-200 dark:border-zinc-700">Vanilla Mode</span>}
                                    </h4>
                                    {result.detected_source_language && (
                                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                                            From: {result.detected_source_language}
                                        </span>
                                    )}
                                </div>
                                <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                    {typeof result.translation === 'object' ? JSON.stringify(result.translation) : result.translation}
                                </div>
                            </div>

                            {/* Analysis Cards (Polyglot Only) */}
                            {mode === 'polyglot' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-xl">
                                        <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                            <MessageCircle className="w-3 h-3" /> Tone Analysis
                                        </h5>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-200/80 leading-relaxed">
                                            {typeof result.tone_analysis === 'object' ? JSON.stringify(result.tone_analysis) : result.tone_analysis}
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-xl">
                                        <h5 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Nuance Notes
                                        </h5>
                                        <p className="text-xs text-amber-700 dark:text-amber-200/80 leading-relaxed">
                                            {typeof result.nuance_notes === 'object' ? JSON.stringify(result.nuance_notes) : result.nuance_notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Architecture & Prompt Viz */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    {mode === 'simple' ? 'Simple Translation Pipeline' : 'Polyglot Agent Pipeline'}
                                </h4>

                                {mode === 'simple' ? (
                                    /* SIMPLE DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono mb-6 opacity-60">
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Text</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 font-bold">LLM</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-zinc-500 shadow-sm">Translation</span>
                                    </div>
                                ) : (
                                    /* AGENTIC DIAGRAM */
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono mb-6">
                                        <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Input Text</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <div className="flex flex-col items-center">
                                            <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded text-purple-600 mb-1">
                                                Cultural Analysis
                                            </span>
                                            <span className="text-[9px] text-zinc-400">Tone + Nuance</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600">Localized Output</span>
                                    </div>
                                )}

                                {/* System Prompt View */}
                                {result.systemPrompt && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-purple-500 font-bold uppercase tracking-wider">
                                                <Quote className="w-3 h-3" /> Constructed System Prompt
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto max-h-60 overflow-y-auto">
                                                {result.systemPrompt}
                                            </pre>
                                        </div>

                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase tracking-wider">
                                                <Zap className="w-3 h-3" /> {mode === 'simple' ? 'Implementation (Basic Call)' : 'Implementation (Agentic Chain)'}
                                            </div>
                                            <pre className="whitespace-pre-wrap opacity-80 overflow-x-auto max-h-60 overflow-y-auto language-typescript">
                                                {mode === 'simple' ? `// Direct Prompting (Zero-Shot)
// We use LangChain here for consistency, but this represents
// a raw IO call without schema enforcement or reasoning.

const llm = new ChatOllama({ model: "${model}" });
const prompt = PromptTemplate.fromTemplate(simpleTemplate);
const chain = prompt.pipe(llm);

// Returns raw string
const result = await chain.invoke({ text, targetLanguage });` :
                                                    `// Agentic Chain
const llm = new ChatOllama({
    model: "${model}",
    format: "json", // Structured Output w/ Schema
    temperature: 0.3
});

// 1. Complex System Prompt Injection
const prompt = PromptTemplate.fromTemplate(polyglotTemplate);

// 2. Chain with Output Parser
const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// 3. Execution & Parsing
const result = await chain.invoke({
    text: input,
    targetLanguage: "${targetLang}"
});`}
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
