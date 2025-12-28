'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Send,
    Search,
    Brain,
    Database,
    ArrowRight,
    CheckCircle,
    Server,
    Shield
} from 'lucide-react';
import { runSemanticAgent, initializeSearchAgent } from '@/actions/course_025_semantic_search/agent_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: AgentMetadata;
}

interface AgentMetadata {
    tool: string;
    thought: string;
    retrieved?: string;
}

export function SemanticSearchLab() {
    // State
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Hi! I'm the Unified Service Agent. I can help with HR Policies (Vacation, Payroll) or IT Support (WiFi, VPN). What do you need?" }
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [agentState, setAgentState] = useState<'IDLE' | 'ROUTING' | 'SEARCHING' | 'ANSWERING'>('IDLE');
    const [lastTrace, setLastTrace] = useState<AgentMetadata | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Models
    const [chatModel, setChatModel] = useState("llama3.2");
    const [embedModel, setEmbedModel] = useState("nomic-embed-text");
    const [allModels, setAllModels] = useState<string[]>([]);

    useEffect(() => {
        getOllamaModels().then(ms => {
            setAllModels(ms);
            if (ms.includes('qwen2.5:1.5b')) setChatModel('qwen2.5:1.5b'); // Fast router
        });
        // Init backend (index docs)
        initializeSearchAgent();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsThinking(true);
        setAgentState('ROUTING');
        setLastTrace(null);

        try {
            // Visualize "Routing" delay slightly for effect
            await new Promise(r => setTimeout(r, 600));

            const result = await runSemanticAgent(userMsg.content, chatModel, embedModel);

            if (result.tool !== 'GENERAL') {
                setAgentState('SEARCHING');
                await new Promise(r => setTimeout(r, 800));
            }

            setAgentState('ANSWERING');
            setLastTrace({
                tool: result.tool,
                thought: result.thought,
                retrieved: result.retrieved
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.finalAnswer,
                metadata: {
                    tool: result.tool,
                    thought: result.thought,
                    retrieved: result.retrieved
                }
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Sorry, I encountered an error connecting to my brain." }]);
        } finally {
            setIsThinking(false);
            setAgentState('IDLE');
        }
    };

    return (
        <div className="flex h-[750px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">

            {/* 1. Chat Area (Left) */}
            <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 relative">
                {/* Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Service Agent</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-indigo-500 text-white'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`flex flex-col max-w-[85%]`}>
                                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm'
                                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                                {msg.metadata && msg.metadata.tool !== 'GENERAL' && (
                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                                        <Database className="w-3 h-3" />
                                        Used {msg.metadata.tool}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isThinking && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl text-xs text-zinc-500 flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                {agentState === 'ROUTING' && "Analyzing intent..."}
                                {agentState === 'SEARCHING' && "Querying database..."}
                                {agentState === 'ANSWERING' && "Formulating answer..."}
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a greeting or ask a question..."
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 shadow-inner dark:text-zinc-200"
                            rows={1}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || isThinking} className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-0">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Agent Internals (Right) */}
            <div className="w-[350px] bg-zinc-50 dark:bg-black/20 flex flex-col">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-pink-500" />
                    <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Agent Brain</h3>
                </div>

                <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                    {/* Status Visualization */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex justify-between items-center shadow-sm">
                        <div className={`flex flex-col items-center gap-2 transition-all ${agentState === 'ROUTING' ? 'scale-110' : 'opacity-40'}`}>
                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600">
                                <Search className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold">ROUTER</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                        <div className={`flex flex-col items-center gap-2 transition-all ${agentState === 'SEARCHING' ? 'scale-110' : 'opacity-40'}`}>
                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600">
                                <Database className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold">VECTOR DB</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                        <div className={`flex flex-col items-center gap-2 transition-all ${agentState === 'ANSWERING' ? 'scale-110' : 'opacity-40'}`}>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold">SYNTHESIS</span>
                        </div>
                    </div>

                    {/* Decision Log */}
                    {lastTrace ? (
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Intent Classification</h4>
                                <div className="text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-2">
                                    "{lastTrace.thought}"
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${lastTrace.tool === 'GENERAL' ? 'bg-zinc-100 text-zinc-600' : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    SELECTED: {lastTrace.tool}
                                </div>
                            </motion.div>

                            {lastTrace.tool !== 'GENERAL' && lastTrace.retrieved && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Retrieved Context</h4>
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 italic">
                                            "{lastTrace.retrieved}"
                                        </p>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">Top Match</div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 opacity-60">
                            <Brain className="w-12 h-12 mb-4 stroke-1" />
                            <p className="text-xs text-center">Waiting for user input...</p>
                        </div>
                    )}

                    {/* Database Preview */}
                    <div className="mt-auto">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-3 block">Available Knowledge</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">HR Policy DB</div>
                                    <div className="text-[10px] text-zinc-500">5 vectors indexed</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Server className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">IT Support DB</div>
                                    <div className="text-[10px] text-zinc-500">5 vectors indexed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
