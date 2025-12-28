'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    MessageSquare,
    Search,
    Send,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { processAndAnswer, QAResult } from '@/actions/course_034_document_qa/doc_qa_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const DEFAULT_DOC = `
The Apollo 11 mission was the American spaceflight that first landed humans on the Moon. 
Commander Neil Armstrong and lunar module pilot Buzz Aldrin landed the Apollo Lunar Module Eagle on July 20, 1969, at 20:17 UTC, and Armstrong became the first person to step onto the Moon's surface six hours and 39 minutes later, on July 21 at 02:56 UTC. 

Aldrin joined him 19 minutes later, and they spent about two and a quarter hours together exploring the site they had named Tranquility Base upon landing. Armstrong and Aldrin collected 47.5 pounds (21.5 kg) of lunar material to bring back to Earth as pilot Michael Collins flew the Command Module Columbia in lunar orbit, and were on the Moon's surface for 21 hours, 36 minutes before lifting off to rejoin Columbia.

Apollo 11 was launched by a Saturn V rocket from Kennedy Space Center on Merritt Island, Florida, on July 16 at 13:32 UTC, and was the fifth crewed mission of NASA's Apollo program. The Apollo spacecraft had three parts: a command module (CM) with a cabin for the three astronauts, the only part that returned to Earth; a service module (SM), which supported the command module with propulsion, electrical power, oxygen, and water; and a lunar module (LM) that had two stages – a descent stage for landing on the Moon and an ascent stage to place the astronauts back into lunar orbit.
`;

export function DocQALab() {
    const [docText, setDocText] = useState(DEFAULT_DOC);
    const [question, setQuestion] = useState("");
    const [history, setHistory] = useState<{ q: string, a: string, sources: string[] }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) {
                const preferred = ms.find(m => m.includes("llama") || m.includes("mistral"));
                setSelectedModel(preferred || ms[0]);
            }
        });
    }, []);

    const handleAsk = async () => {
        if (!question.trim() || !docText.trim() || isProcessing) return;
        setIsProcessing(true);

        try {
            const result = await processAndAnswer(docText, question, selectedModel);
            setHistory(prev => [...prev, {
                q: question,
                a: result.answer,
                sources: result.sourceNodes
            }]);
            setQuestion("");
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">

            {/* Left: Document Source */}
            <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Document Context
                    </h3>
                    <div className="text-xs text-zinc-400 font-medium">
                        {docText.length} chars
                    </div>
                </div>
                <div className="flex-1 relative">
                    <textarea
                        value={docText}
                        onChange={(e) => setDocText(e.target.value)}
                        className="w-full h-full bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 text-sm font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none custom-scrollbar"
                        placeholder="Paste your document here..."
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setDocText(DEFAULT_DOC)}
                        className="text-xs px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded text-zinc-500"
                    >
                        Reset Default
                    </button>
                    <button
                        onClick={() => setDocText("")}
                        className="text-xs px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded text-zinc-500"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Right: Chat */}
            <div className="flex flex-col bg-zinc-50 dark:bg-black/20 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-lg">

                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-sm">Q&A Chat</span>
                    </div>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-[10px] rounded px-2 py-1 border-none outline-none"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {history.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 opacity-50">
                            <Search className="w-12 h-12 mb-2" />
                            <p className="text-sm">Ask a question about the document</p>
                        </div>
                    )}

                    {history.map((turn, i) => (
                        <div key={i} className="space-y-3">
                            {/* User */}
                            <div className="flex justify-end">
                                <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                                    {turn.q}
                                </div>
                            </div>

                            {/* AI */}
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-sm">
                                    <p className="mb-3 leading-relaxed">{turn.a}</p>

                                    {/* Sources */}
                                    {turn.sources.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="text-[10px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1">
                                                <Search className="w-3 h-3" /> Relevant Context
                                            </div>
                                            <div className="grid gap-1">
                                                {turn.sources.map((src, idx) => (
                                                    <div key={idx} className="text-[10px] text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded truncate font-mono">
                                                        "{src.substring(0, 80)}..."
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm flex items-center gap-2 text-zinc-400">
                                <Loader2 className="w-4 h-4 animate-spin" /> Retrieving & Generating...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder="Ask a question..."
                            disabled={isProcessing}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                        />
                        <button
                            onClick={handleAsk}
                            disabled={isProcessing || !question.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 text-white"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
