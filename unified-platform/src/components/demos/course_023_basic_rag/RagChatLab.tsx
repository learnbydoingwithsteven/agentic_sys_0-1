'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Send,
    FileText,
    Database,
    Zap,
    RefreshCcw,
    BookOpen,
    Trash2,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { ingestDocument, chatWithRag, type ChatMessage } from '@/actions/course_023_basic_rag/rag_backend';
import { RAG_PRESETS } from '@/actions/course_023_basic_rag/presets';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

interface Message extends ChatMessage {
    id: string;
    sources?: string[];
    latency?: number;
}

export function RagChatLab() {
    // Knowledge Base State
    const [kbContent, setKbContent] = useState(RAG_PRESETS.first_aid.content);
    const [isIngesting, setIsIngesting] = useState(false);
    const [ingestStats, setIngestStats] = useState<{ chunks: number, success: boolean } | null>(null);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am your RAG Assistant. Load a document to the left to give me knowledge, then ask me anything about it!' }
    ]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Context State
    const [activeContext, setActiveContext] = useState<string[]>([]);

    // Model Selection State
    const [models, setModels] = useState<string[]>([]);
    const [chatModel, setChatModel] = useState<string>("llama3.2");
    const [embedModel, setEmbedModel] = useState<string>("nomic-embed-text");

    // Fetch models on mount
    useEffect(() => {
        const init = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) {
                    // Try to preserve default if available, else pick first
                    if (!available.includes(chatModel)) setChatModel(available[0]);

                    // Simple heuristic for embedding model (usually contains 'embed' or 'nomic')
                    const embed = available.find(m => m.includes('embed') || m.includes('nomic'));
                    if (embed) setEmbedModel(embed);
                    else if (available.includes("nomic-embed-text")) setEmbedModel("nomic-embed-text");
                }
            } catch (e) {
                console.error("Failed to load models", e);
            }
        };
        init();
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleIngest = async () => {
        if (!kbContent.trim()) return;
        setIsIngesting(true);
        setIngestStats(null);
        try {
            const result = await ingestDocument(kbContent, embedModel);
            setIngestStats(result);
            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), role: 'assistant', content: `Creating new knowledge base... Done! created ${result.chunks} chunks using ${embedModel}. Ready for questions.` }
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsIngesting(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isGenerating) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsGenerating(true);
        setActiveContext([]); // Clear context until new answer

        try {
            // Optimistic assistant message (optional typing indicator could go here)
            const result = await chatWithRag(userMsg.content, [], chatModel, embedModel); // Pass selected models to backend

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.answer,
                sources: result.sources,
                latency: result.latency
            };

            setMessages(prev => [...prev, aiMsg]);
            setActiveContext(result.sources);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Error: Failed to generate response." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const loadPreset = (key: keyof typeof RAG_PRESETS) => {
        setKbContent(RAG_PRESETS[key].content.trim());
        setIngestStats(null);
    };

    return (
        <div className="flex h-[800px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">

            {/* 1. Knowledge Base Config (Left Panel) */}
            <div className="w-1/3 min-w-[320px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Database className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Knowledge Base</h3>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">

                    {/* Embedding Model Selector */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block">Embedding Model</label>
                        <select
                            value={embedModel}
                            onChange={(e) => setEmbedModel(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 outline-none"
                        >
                            {models.filter(m => m.includes('embed') || m.includes('nomic')).length > 0
                                ? models.filter(m => m.includes('embed') || m.includes('nomic')).map(m => <option key={m} value={m}>{m}</option>)
                                : models.map(m => <option key={m} value={m}>{m}</option>) // Fallback to all if no embeds found
                            }
                        </select>
                    </div>

                    {/* Presets */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-3 block">Load Preset</label>
                        <div className="grid grid-cols-1 gap-2">
                            {(Object.entries(RAG_PRESETS) as [keyof typeof RAG_PRESETS, typeof RAG_PRESETS['first_aid']][]).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => loadPreset(key)}
                                    className="text-left px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-colors group"
                                >
                                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{preset.title}</div>
                                    <div className="text-[10px] text-zinc-400">{preset.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="flex-1 flex flex-col min-h-[200px]">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block">Document Content (Raw Text)</label>
                        <textarea
                            value={kbContent}
                            onChange={(e) => setKbContent(e.target.value)}
                            className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-600 dark:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar"
                            placeholder="Paste your text here..."
                        />
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleIngest}
                        disabled={isIngesting || !kbContent.trim()}
                        className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-zinc-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isIngesting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isIngesting ? "Indexing Chunks..." : "Ingest & Index"}
                    </button>

                    {ingestStats && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-3 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                Successfully indexed {ingestStats.chunks} chunks.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Chat Interface (Center Panel) */}
            <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50 relative">

                {/* Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">RAG Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 hidden sm:block">Model:</label>
                        <select
                            value={chatModel}
                            onChange={(e) => setChatModel(e.target.value)}
                            className="bg-transparent text-xs font-mono text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer hover:text-indigo-600 transition-colors text-right"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-indigo-500 text-white'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm'
                                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Metadata / Sources used */}
                                {msg.role === 'assistant' && msg.sources && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 border border-white dark:border-zinc-800 flex items-center justify-center text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-medium text-zinc-400">
                                            {msg.sources.length} document chunks used • {(msg.latency || 0) / 1000}s
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isGenerating && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-5 py-4 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700 shadow-sm w-24 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={ingestStats ? "Ask a question based on the document..." : "Please ingest a document first..."}
                            disabled={!ingestStats && !kbContent} // Allow typing if content exists but not ingested, but handleSend will fail/warn or we can auto-ingest? Nah, explicit is better.
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 custom-scrollbar shadow-inner"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isGenerating}
                            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-2 text-center text-[10px] text-zinc-400">
                        Agent uses Retrieval-Augmented Generation to ground answers.
                    </div>
                </div>
            </div>

            {/* 3. Context Viewer (Rightmost Panel - Collapsible or Always On) */}
            {/* Let's make it a dedicated 25% column if there is context, or empty state */}
            <div className="w-1/4 min-w-[280px] bg-zinc-50 dark:bg-black/20 border-l border-zinc-200 dark:border-zinc-800 hidden xl:flex flex-col">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Live Context</h3>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                    {activeContext.length > 0 ? (
                        <>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mb-1">Why am I seeing this?</p>
                                <p className="text-[10px] text-zinc-500 leading-tight">
                                    These are the exact text chunks the agent retrieved from your document to answer the last question.
                                </p>
                            </div>

                            {activeContext.map((ctx, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono"
                                >
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                            {idx + 1}
                                        </div>
                                        <span className="text-[8px] uppercase font-bold text-zinc-400">Relevant Chunk</span>
                                    </div>
                                    "{ctx}"
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40 p-4">
                            <Database className="w-8 h-8 text-zinc-300 mb-2" />
                            <p className="text-xs font-bold text-zinc-400">No context active</p>
                            <p className="text-[10px] text-zinc-400 mt-1">Ask a question to see how the agent thinks.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
