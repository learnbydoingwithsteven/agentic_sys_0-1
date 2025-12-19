'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCw, Trash2, Cpu, Settings, Search, ExternalLink } from 'lucide-react';
import { sendMessage, getOllamaModels, type ChatMessage } from '@/actions/course_003_simple_chatbot/chat';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

type ChatPattern = 'stateful' | 'stateless' | 'system' | 'rag';

export function ChatBotLab() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hello! I'm your local AI Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    // Pattern State
    const [pattern, setPattern] = useState<ChatPattern>('stateful');
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
    const [searchProvider, setSearchProvider] = useState<'duckduckgo'>('duckduckgo');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const checkModels = React.useCallback(async () => {
        setIsChecking(true);
        try {
            const available = await getOllamaModels();
            setModels(available);
            if (available.length > 0 && !selectedModel) {
                setSelectedModel(available[0]);
            }
        } finally {
            setIsChecking(false);
        }
    }, [selectedModel]);

    useEffect(() => {
        checkModels();
    }, [checkModels]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const responseContent = await sendMessage(
                messages,
                userMsg,
                selectedModel,
                {
                    pattern,
                    systemPrompt: pattern === 'system' ? systemPrompt : undefined,
                    searchProvider: pattern === 'rag' ? searchProvider : undefined
                }
            );
            setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "Chat cleared. Starting fresh!" }]);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[650px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-emerald-500" />
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Simple Chatflow</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-zinc-500">
                                        {selectedModel || (models.length > 0 ? models[0] : 'Simulated')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                            <Cpu className="w-3 h-3 text-zinc-400" />
                            <select
                                title="Select Model"
                                className="text-xs bg-transparent border-none outline-none max-w-[100px]"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                {models.length === 0 && <option value="">No Models</option>}
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <button onClick={checkModels} disabled={isChecking} className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 transition-colors">
                            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={clearChat} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors" title="Clear Chat">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex-1">
                            <Settings className="w-3 h-3 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-500">Mode:</span>
                            <select
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value as ChatPattern)}
                                className="text-xs bg-transparent border-none outline-none flex-1 font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            >
                                <option value="stateful">Stateful (Memory)</option>
                                <option value="stateless">Stateless (No Memory)</option>
                                <option value="system">System Prompting</option>
                                <option value="rag">RAG (Web Search)</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Provider Selector (RAG Only) */}
                    <AnimatePresence>
                        {pattern === 'rag' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-1 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                    <Search className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Search Tool:</span>
                                    <select
                                        value={searchProvider}
                                        onChange={(e) => setSearchProvider(e.target.value as 'duckduckgo')}
                                        className="text-xs bg-transparent border-none outline-none flex-1 font-medium text-blue-800 dark:text-blue-100 cursor-pointer"
                                    >
                                        <option value="duckduckgo">DuckDuckGo (Free)</option>
                                    </select>
                                    <a href="https://duckduckgo.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-500 flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* System Prompt Input */}
                <AnimatePresence>
                    {pattern === 'system' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden px-1"
                        >
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                placeholder="Enter system instructions (e.g., 'You are a pirate')..."
                                className="w-full h-16 text-xs p-2 rounded-md border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 placeholder:text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none mt-2"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Architecture Diagram Overlay */}
            <div className="absolute bottom-20 right-4 z-20 hidden md:block opacity-90 hover:opacity-100 transition-opacity pointer-events-none">
                <ArchitectureDiagram pattern={pattern} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-black/20 scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                                : (msg.role === 'system' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600')
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                                }`}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose dark:prose-invert max-w-none prose-sm prose-p:my-1 prose-headings:my-2 prose-pre:bg-zinc-900 prose-pre:p-2 prose-pre:rounded-lg">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="w-full pl-4 pr-12 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-indigo-500 rounded-xl outline-none transition-all text-sm dark:text-zinc-200 placeholder:text-zinc-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <p className="text-center text-[10px] text-zinc-400 mt-2">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>

        </div>
    );
}

function ArchitectureDiagram({ pattern }: { pattern: ChatPattern | 'rag' }) {
    return (
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-lg max-w-[200px]">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 border-b dark:border-zinc-800 pb-1">
                Flow: {pattern === 'rag' ? 'Retrieval Aug. Gen.' : pattern.charAt(0).toUpperCase() + pattern.slice(1)}
            </h4>

            {pattern === 'stateless' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 rounded-md border border-indigo-200">User Msg</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 rounded-md border border-emerald-200">LLM</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 rounded-md">Response</div>
                </div>
            )}

            {pattern === 'stateful' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="flex gap-1">
                        <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 rounded-md">Msg</div>
                        <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 rounded-md">+ Hist</div>
                    </div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 rounded-md border border-emerald-200">LLM</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 rounded-md">Response + Update Hist</div>
                </div>
            )}

            {pattern === 'system' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded-md w-full text-center font-bold">System Prompt</div>
                    <div className="text-zinc-400">↓ (Prefix)</div>
                    <div className="flex gap-1">
                        <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 rounded-md">Msg</div>
                        <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 rounded-md">+ Hist</div>
                    </div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 rounded-md">LLM</div>
                </div>
            )}

            {pattern === 'rag' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 rounded-md">User Query</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 rounded-md border-blue-200 border border-dashed">DuckDuckGo</div>
                    <div className="text-zinc-400">↓ (Context)</div>
                    <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 rounded-md">LLM w/ Context</div>
                </div>
            )}
        </div>
    );
}
