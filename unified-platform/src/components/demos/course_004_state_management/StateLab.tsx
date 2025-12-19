'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCw, Trash2, Cpu, Settings, Database, Layers, Plus, Search, CheckCircle } from 'lucide-react';
import { sendStatefulMessage, getOllamaModels, getVectorStore, addFactToVectorStore, testVectorSearch, type ChatMessage, type VectorDoc } from '@/actions/course_004_state_management/chat';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

type MemoryType = 'no-memory' | 'buffer' | 'window' | 'summary' | 'vector';

export function StateLab() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hello! Select a strategy to begin." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [memoryType, setMemoryType] = useState<MemoryType>('buffer');
    const [lastContext, setLastContext] = useState<string>('Full history initialized.');

    // Vector Store State
    const [vectorDocs, setVectorDocs] = useState<VectorDoc[]>([]);
    const [newFact, setNewFact] = useState('');
    const [testQuery, setTestQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ doc: VectorDoc, score: number }[]>([]);
    const [isIngesting, setIsIngesting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) setSelectedModel(ms[0]);
        });
        refreshVectorStore();
    }, []);

    const refreshVectorStore = async () => {
        const docs = await getVectorStore();
        setVectorDocs(docs);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const { response, usedContext } = await sendStatefulMessage(
                messages,
                userMsg,
                selectedModel,
                memoryType
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setLastContext(usedContext);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error processing message." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFact.trim()) return;
        setIsIngesting(true);
        await addFactToVectorStore(newFact);
        setNewFact('');
        await refreshVectorStore();
        setIsIngesting(false);
    };

    const handleTestSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testQuery.trim()) return;
        setIsSearching(true);
        const results = await testVectorSearch(testQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "Memory cleared." }]);
        setLastContext("Memory reset.");
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-500" />
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">State Management Lab</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearChat} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors" title="Clear Memory">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Strategy Selector */}
                <div className="flex items-center gap-2 px-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex-1">
                        <Settings className="w-3 h-3 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-500">Strategy:</span>
                        <select
                            value={memoryType}
                            onChange={(e) => setMemoryType(e.target.value as MemoryType)}
                            className="text-xs bg-transparent border-none outline-none flex-1 font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                        >
                            <option value="no-memory">Stateless (No Memory)</option>
                            <option value="buffer">Buffer Memory</option>
                            <option value="window">Sliding Window</option>
                            <option value="summary">Summary Memory</option>
                            <option value="vector">Vector Memory (RAG)</option>
                        </select>
                    </div>
                </div>

                {/* Context Visualizer (Debug Panel) */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-2 text-xs font-mono text-blue-800 dark:text-blue-200">
                    <span className="font-bold flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wider opacity-70">
                        <Cpu className="w-3 h-3" /> Context Sent to LLM:
                    </span>
                    {lastContext}
                </div>
            </div>

            {/* VECTOR MANAGEMENT SUB-APP (Only visible when Vector is selected) */}
            <AnimatePresence>
                {memoryType === 'vector' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Left: Ingestion & Knowledge Base */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <Database className="w-3 h-3" /> Knowledge Base Management
                                </h4>

                                <form onSubmit={handleAddFact} className="flex gap-2">
                                    <input
                                        value={newFact}
                                        onChange={e => setNewFact(e.target.value)}
                                        placeholder="Add a new fact (e.g., 'Project X is delayed')"
                                        className="flex-1 text-xs p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newFact || isIngesting}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isIngesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                    </button>
                                </form>

                                <div className="h-32 overflow-y-auto bg-white/50 dark:bg-black/20 border border-emerald-100 dark:border-emerald-900/30 rounded p-2 custom-scrollbar">
                                    {vectorDocs.length === 0 ? (
                                        <p className="text-[10px] text-zinc-400 italic">No facts in database.</p>
                                    ) : (
                                        <div className="space-y-1">
                                            {vectorDocs.map((doc, i) => (
                                                <div key={i} className="text-[10px] p-1.5 bg-white dark:bg-zinc-800 rounded border border-zinc-100 dark:border-zinc-700 flex items-start gap-2">
                                                    <span className="text-emerald-500 font-mono">#{i + 1}</span>
                                                    <span className="text-zinc-600 dark:text-zinc-300">{doc.content}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Retrieval Tester */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                    <Search className="w-3 h-3" /> Retrieval Simulation
                                </h4>

                                <form onSubmit={handleTestSearch} className="flex gap-2">
                                    <input
                                        value={testQuery}
                                        onChange={e => setTestQuery(e.target.value)}
                                        placeholder="Test a query (e.g., 'What about Project X?')"
                                        className="flex-1 text-xs p-2 rounded border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!testQuery || isSearching}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isSearching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                                    </button>
                                </form>

                                <div className="h-32 overflow-y-auto bg-white/50 dark:bg-black/20 border border-indigo-100 dark:border-indigo-900/30 rounded p-2 custom-scrollbar">
                                    {searchResults.length === 0 ? (
                                        <p className="text-[10px] text-zinc-400 italic text-center pt-10">Run a test query to see matches.</p>
                                    ) : (
                                        <div className="space-y-1">
                                            {searchResults.map((hit, i) => (
                                                <div key={i} className="text-[10px] p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-indigo-700 dark:text-indigo-300">Match #{i + 1}</span>
                                                        <span className="bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 px-1.5 py-0.5 rounded-full text-[9px] font-mono">
                                                            Score: {Math.round(hit.score * 100)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-300">{hit.doc.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Diagram Overlay */}
            <div className="absolute bottom-20 right-4 z-20 hidden md:block opacity-90 hover:opacity-100 transition-opacity pointer-events-none">
                <StateDiagram type={memoryType} />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-black/20 scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                                }`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                <Bot className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                                <span className="text-xs text-zinc-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 relative z-20">
                <form onSubmit={handleSend} className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type message..."
                        disabled={loading}
                        className="w-full pl-4 pr-12 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-blue-500 rounded-xl outline-none transition-all text-sm dark:text-zinc-200 placeholder:text-zinc-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

function StateDiagram({ type }: { type: MemoryType }) {
    return (
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-lg max-w-[200px]">
            {/* ... (Existing diagrams) ... */}
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 border-b dark:border-zinc-800 pb-1">
                Memory Access Pattern
            </h4>

            {type === 'no-memory' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md line-through opacity-50">Old Chat</div>
                    <div className="text-red-400 text-[10px]">(Ignore)</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-300">New Msg</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">LLM</div>
                </div>
            )}

            {type === 'buffer' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="w-full p-1 bg-amber-50 border border-amber-200 rounded text-center">
                        <span className="block text-[8px] text-amber-500 uppercase">Context Buffer</span>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <div className="h-1 bg-amber-200 w-3/4 mx-auto rounded"></div>
                            <div className="h-1 bg-amber-200 w-full mx-auto rounded"></div>
                            <div className="h-1 bg-amber-200 w-5/6 mx-auto rounded"></div>
                        </div>
                    </div>
                    <div className="text-zinc-400">+</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-300">New Msg</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">LLM</div>
                </div>
            )}

            {type === 'window' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="flex gap-1 items-center opacity-50">
                        <div className="h-2 w-2 bg-zinc-300 rounded-full"></div>
                        <div className="h-2 w-2 bg-zinc-300 rounded-full"></div>
                        <div className="text-[9px] text-zinc-400">Forgot</div>
                    </div>
                    <div className="w-full p-1 bg-teal-50 border border-teal-200 rounded text-center">
                        <span className="block text-[8px] text-teal-600 uppercase">Window (Last 2)</span>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <div className="h-1 bg-teal-300 w-full mx-auto rounded"></div>
                            <div className="h-1 bg-teal-300 w-full mx-auto rounded"></div>
                        </div>
                    </div>
                    <div className="text-zinc-400">+</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-300">New Msg</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">LLM</div>
                </div>
            )}

            {type === 'summary' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 text-[10px] w-full text-center">
                        ✨ Summary of Old
                    </div>
                    <div className="text-zinc-400">+</div>
                    <div className="w-full p-1 bg-teal-50 border border-teal-200 rounded text-center">
                        <span className="block text-[8px] text-teal-600 uppercase">Recent (Last 2)</span>
                    </div>
                    <div className="text-zinc-400">+</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-300">New Msg</div>
                    <div className="text-zinc-400">↓</div>
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">LLM</div>
                </div>
            )}

            {type === 'vector' && (
                <div className="flex flex-col gap-2 text-xs items-center">
                    {/* Ingestion Flow */}

                    <div className="w-full p-1 bg-emerald-50 border border-emerald-200 dashed rounded text-center mb-1">
                        <span className="block text-[8px] text-emerald-600 uppercase">Docs &rarr; Embeds &rarr; DB</span>
                    </div>

                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-300">New Query</div>
                    <div className="text-zinc-400">↓ (Similarity Search)</div>

                    {/* Retrieval Flow */}
                    <div className="flex gap-0.5">
                        <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                        <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    </div>

                    <div className="text-zinc-400">↓ (Top K Facts)</div>
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">LLM</div>
                </div>
            )}
        </div>
    )
}
