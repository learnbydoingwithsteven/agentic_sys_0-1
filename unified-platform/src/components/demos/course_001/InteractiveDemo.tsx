'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity, Zap, Sun, CloudRain, ThermometerSnowflake, Flame, BrainCircuit, MessageSquare, Send, User, Bot, Server } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { runAgentAction, type AgentAction, getAvailableModels } from '@/actions/course_001/demo';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


type ChatMessage = {
    role: 'user' | 'agent';
    content: string;
    type?: 'vanilla' | 'system' | 'agentic';
};

export function InteractiveDemo() {
    const [history, setHistory] = useState<AgentAction[]>([]); // For stats/chart
    const [messages, setMessages] = useState<ChatMessage[]>([]); // For chat UI
    const [loading, setLoading] = useState(false);


    // Mode State
    const [mode, setMode] = useState<'reflex' | 'vanilla' | 'system' | 'agentic'>('reflex');

    // Inputs
    const [envInput, setEnvInput] = useState('sunny');
    const [nlInput, setNlInput] = useState('');

    // Models
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAvailableModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) setSelectedModel(ms[0]);
        });
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSwitchMode = (newMode: 'reflex' | 'vanilla' | 'system' | 'agentic') => {
        setMode(newMode);
        setHistory([]);
        setMessages([]);
        setNlInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('type', mode);

        if (mode === 'reflex') {
            formData.append('envInput', envInput);
        } else {
            if (!nlInput.trim()) return;
            formData.append('nlInput', nlInput);
            formData.append('model', selectedModel);
            // Add user message immediately
            setMessages(prev => [...prev, { role: 'user', content: nlInput }]);
            setNlInput('');
        }

        try {
            const result = await runAgentAction(formData);
            setHistory((prev) => [...prev, result]);

            if (mode !== 'reflex') {
                const content = mode === 'vanilla' ? result.reason : result.reason; // Agentic returns ReAct trace in reason
                setMessages(prev => [...prev, { role: 'agent', content, type: mode }]);
            }

        } catch (error) {
            console.error('Demo failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetDemo = () => {
        setHistory([]);
        setMessages([]);
        setEnvInput('sunny');
        setNlInput('');
    };

    const getThemeColor = () => {
        if (mode === 'reflex') return 'rgb(249, 115, 22)';   // Orange
        if (mode === 'vanilla') return 'rgb(59, 130, 246)';  // Blue
        return 'rgb(147, 51, 234)';                          // Purple
    };

    const getBgColor = () => {
        if (mode === 'reflex') return 'rgba(249, 115, 22, 0.5)';
        if (mode === 'vanilla') return 'rgba(59, 130, 246, 0.5)';
        return 'rgba(147, 51, 234, 0.5)';
    };

    const data = {
        labels: history.map((_, i) => `Step ${i + 1}`),
        datasets: [
            {
                label: 'Utility Score',
                data: history.map((h) => h.utility),
                borderColor: getThemeColor(),
                backgroundColor: getBgColor(),
                tension: 0.2,
                fill: true,
            },
        ],
    };

    const currentResult = history[history.length - 1];

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-6 flex flex-col max-h-[800px]">
            {/* Header */}
            <div className={`p-4 border-b border-slate-200 backdrop-blur-sm transition-colors duration-300 ${mode === 'reflex' ? 'bg-orange-50/50' :
                mode === 'vanilla' ? 'bg-blue-50/50' : 'bg-purple-50/50'
                }`}>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">

                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            {mode === 'reflex' && <><Zap className="w-5 h-5 text-orange-500" /> Rule Engine</>}
                            {mode === 'vanilla' && <><MessageSquare className="w-5 h-5 text-blue-600" /> Chat Model</>}
                            {mode === 'system' && <><Bot className="w-5 h-5 text-green-600" /> System Agent</>}
                            {mode === 'agentic' && <><BrainCircuit className="w-5 h-5 text-purple-600" /> Agent</>}
                        </h3>

                        {/* Model Selector for LLM Modes */}
                        {mode !== 'reflex' && (
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Server className="w-3 h-3 text-slate-400" />
                                <select
                                    className="text-xs font-medium text-slate-600 bg-transparent outline-none cursor-pointer"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                                    {models.length === 0 && <option value="loading">Loading models...</option>}
                                </select>
                            </div>
                        )}
                    </div>


                    <div className="flex bg-slate-100 rounded-lg p-1 w-full gap-1">
                        <button onClick={() => handleSwitchMode('reflex')} className={`flex-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'reflex' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>Rule</button>
                        <button onClick={() => handleSwitchMode('vanilla')} className={`flex-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'vanilla' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Chat</button>
                        <button onClick={() => handleSwitchMode('system')} className={`flex-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'system' ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>Sys</button>
                        <button onClick={() => handleSwitchMode('agentic')} className={`flex-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'agentic' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Agent</button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto min-h-[400px] bg-slate-50/50">

                {/* REFLEX MODE UI */}
                {mode === 'reflex' && (
                    <div className="p-6 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-orange-500" /> Sensor Input (Environment State)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <EnvButton value="sunny" current={envInput} set={setEnvInput} icon={<Sun className="w-4 h-4" />} label="Sunny" />
                                <EnvButton value="rainy" current={envInput} set={setEnvInput} icon={<CloudRain className="w-4 h-4" />} label="Rainy" />
                                <EnvButton value="cold" current={envInput} set={setEnvInput} icon={<ThermometerSnowflake className="w-4 h-4" />} label="Cold" />
                                <EnvButton value="hot" current={envInput} set={setEnvInput} icon={<Flame className="w-4 h-4" />} label="Hot" />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                Actuate Reflex Agent
                            </button>
                        </div>

                        {/* Reflex Results */}
                        {history.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="rounded-lg p-4 border bg-orange-50 border-orange-100">
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Condition-Action Rule</div>
                                    <div className="text-xl font-bold text-slate-900 mb-1">{currentResult.action}</div>
                                    <div className="text-sm text-slate-600 italic">"{currentResult.reason}"</div>
                                </div>
                                <div className="h-32 w-full bg-white rounded-lg p-2 border border-slate-200">
                                    <Line data={data} options={{ ...chartOptions, maintainAspectRatio: false }} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* LLM / AGENTIC CHAT UI */}
                {mode !== 'reflex' && (
                    <div className="flex flex-col h-[500px]">
                        {/* Message History */}
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {messages.length === 0 && (
                                <div className="text-center py-12 opacity-40">
                                    <Bot className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm text-slate-500">
                                        {mode === 'vanilla' ? 'Start a conversation with the model.' : 'Give the agent a complex goal.'}
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'agent' && (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'agentic' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {msg.type === 'agentic' ? <BrainCircuit className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-sm'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                                        }`}>
                                        {msg.type === 'agentic' ? (
                                            <div className="font-mono text-xs whitespace-pre-wrap">{msg.content}</div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-slate-500" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSubmit} className="relative flex gap-2">
                                <input
                                    value={nlInput}
                                    onChange={e => setNlInput(e.target.value)}
                                    placeholder={mode === 'vanilla' ? "Chat with the model..." : "Enter a goal for the agent..."}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !nlInput.trim()}
                                    className={`p-2 rounded-full text-white transition-all disabled:opacity-50 disabled:scale-95 ${mode === 'vanilla' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                                        }`}
                                >
                                    {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>

                            {/* Quick Prompts */}
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                                <PromptPill text="It's pouring rain" set={setNlInput} />
                                <PromptPill text="It's freezing cold" set={setNlInput} />
                                <PromptPill text="I can't see anything" set={setNlInput} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ArchitectureDiagram mode={mode} />
        </div>
    );
}

const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, max: 1.0, display: false },
        x: { display: false }
    }
};

function EnvButton({ value, current, set, icon, label }: { value: string, current: string, set: (v: string) => void, icon: React.ReactNode, label: string }) {
    const isActive = value === current;
    return (
        <button
            type="button"
            onClick={() => set(value)}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${isActive
                ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            {icon}
            {label}
        </button>
    )
}


function MetricCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-md border border-slate-100 shadow-sm">{icon}</div>
            <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-lg font-bold text-slate-900">{value}</div>
            </div>
        </div>
    );
}

function PromptPill({ text, set }: { text: string, set: (t: string) => void }) {
    return (
        <button
            onClick={() => set(text)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap transition-colors border border-slate-200"
        >
            {text}
        </button>
    );
}


function ArchitectureDiagram({ mode }: { mode: 'reflex' | 'vanilla' | 'system' | 'agentic' }) {
    return (
        <div className="mt-4 pt-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm p-4 sticky bottom-0 z-10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">System Flow Architecture</h4>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600">

                {mode === 'reflex' && (
                    <>
                        <div className="bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Sun className="w-4 h-4 mb-1 text-orange-500" />
                            <span className="text-[10px]">Sensors</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">STATE</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-slate-100 border border-slate-300 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Zap className="w-4 h-4 mb-1 text-slate-600" />
                            <span className="text-[10px]">Rule Engine</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">CMD</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Activity className="w-4 h-4 mb-1 text-green-600" />
                            <span className="text-[10px]">Actuators</span>
                        </div>
                    </>
                )}

                {mode === 'vanilla' && (
                    <>
                        <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <User className="w-4 h-4 mb-1 text-blue-500" />
                            <span className="text-[10px]">User Input</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">TEXT</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-slate-800 text-white border border-slate-700 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Bot className="w-4 h-4 mb-1 text-blue-400" />
                            <span className="text-[10px]">LLM</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">TOKENS</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-white border border-slate-300 px-3 py-2 rounded-lg text-center flex flex-col items-center shadow-sm">
                            <MessageSquare className="w-4 h-4 mb-1 text-slate-500" />
                            <span className="text-[10px]">Output</span>
                        </div>
                    </>
                )}


                {mode === 'system' && (
                    <>
                        <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <User className="w-4 h-4 mb-1 text-green-500" />
                            <span className="text-[10px]">Context</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">PROMPT</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-green-900 text-white border border-green-800 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Bot className="w-4 h-4 mb-1 text-green-300" />
                            <span className="text-[10px]">System Agent</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">COMPLETION</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Activity className="w-4 h-4 mb-1 text-green-600" />
                            <span className="text-[10px]">Logic</span>
                        </div>
                    </>
                )}

                {mode === 'agentic' && (
                    <>
                        <div className="bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <User className="w-4 h-4 mb-1 text-purple-500" />
                            <span className="text-[10px]">Goal/Obs</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">PROMPT</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-purple-900 text-white border border-purple-800 px-4 py-2 rounded-lg text-center flex flex-col items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 animate-[pulse_3s_infinite]" />
                            <BrainCircuit className="w-4 h-4 mb-1 text-purple-300" />
                            <span className="text-[10px]">Single Agent</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-400">REACT LOOP</div>
                            <div className="absolute right-0 -top-[3px] w-1 h-1 border-t border-r border-slate-300 rotate-45" />
                        </div>
                        <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-center flex flex-col items-center">
                            <Activity className="w-4 h-4 mb-1 text-green-600" />
                            <span className="text-[10px]">Action</span>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
