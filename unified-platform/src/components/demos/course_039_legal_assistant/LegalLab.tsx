'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    AlertTriangle,
    FileText,
    CheckCircle,
    Info,
    Cpu
} from 'lucide-react';
import { analyzeContract, LegalClause } from '@/actions/course_039_legal_assistant/legal_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const DEFAULT_TEXT = `This Agreement shall be governed by the laws of New York.
The Vendor agrees to indemnify the Client against all losses.
Either party may terminate this agreement for convenience upon 30 days notice.`;

export function LegalLab() {
    const [text, setText] = useState(DEFAULT_TEXT);
    const [clauses, setClauses] = useState<LegalClause[]>([]);
    const [analyzing, setAnalyzing] = useState(false);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Fetch models on mount
    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleAnalyze = async () => {
        if (!selectedModel) return;
        setAnalyzing(true);
        // No fake delay needed, real LLM takes time
        const res = await analyzeContract(text, selectedModel);
        setClauses(res);
        setAnalyzing(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="flex gap-8 h-full">
                {/* Editor */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="font-bold text-zinc-600 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" /> Contract Draft
                            </label>

                            {/* Model Selector */}
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <Cpu className="w-4 h-4 text-zinc-500" />
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer"
                                >
                                    {models.length === 0 && <option value="">Loading models...</option>}
                                    {models.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing || !selectedModel}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            <Scale className="w-4 h-4" /> {analyzing ? 'Reasoning...' : 'Analyze Risk'}
                        </button>
                    </div>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 font-serif leading-relaxed resize-none focus:ring-2 ring-indigo-500 outline-none shadow-sm"
                    />
                </div>

                {/* Analysis Panel */}
                <div className="w-80 bg-zinc-50 dark:bg-zinc-950/50 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <h3 className="font-bold text-zinc-500 uppercase tracking-widest text-xs mb-2">Analysis Report</h3>

                    {clauses.map((clause, i) => (
                        <motion.div
                            key={clause.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-xl border shadow-sm ${clause.type === 'RISK' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' :
                                clause.type === 'OBLIGATION' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' :
                                    'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {clause.type === 'RISK' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                {clause.type === 'OBLIGATION' && <Info className="w-4 h-4 text-amber-500" />}
                                {clause.type === 'NEUTRAL' && <CheckCircle className="w-4 h-4 text-zinc-400" />}
                                <span className={`text-xs font-bold uppercase ${clause.type === 'RISK' ? 'text-red-700' :
                                    clause.type === 'OBLIGATION' ? 'text-amber-700' : 'text-zinc-500'
                                    }`}>{clause.type}</span>
                            </div>
                            <div className="font-bold text-sm mb-1">{clause.text}</div>
                            <div className="text-xs text-zinc-500 leading-normal">{clause.explanation}</div>
                        </motion.div>
                    ))}

                    {clauses.length === 0 && !analyzing && (
                        <div className="text-center text-zinc-400 text-sm mt-10 italic">
                            Results will appear here.
                        </div>
                    )}
                    {analyzing && (
                        <div className="text-center text-zinc-400 text-sm mt-10 italic animate-pulse">
                            Reading document...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
