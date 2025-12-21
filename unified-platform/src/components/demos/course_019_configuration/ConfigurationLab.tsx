'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Zap, Activity, CheckCircle, XCircle, BarChart3, ArrowRight, Brain, Sliders, Sparkles, GitCompare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runConfigurableAgent, compareConfigurations, type ConfigurationStrategy, type ConfigurationResponse } from '@/actions/course_019_configuration/config_agent';
import { PRESET_PROMPTS } from '@/actions/course_019_configuration/presets';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const STRATEGIES: { value: ConfigurationStrategy; label: string; color: string; icon: React.ReactNode }[] = [
    { value: 'minimal', label: 'Minimal', color: 'blue', icon: <Sliders className="w-3 h-3" /> },
    { value: 'balanced', label: 'Balanced', color: 'emerald', icon: <BarChart3 className="w-3 h-3" /> },
    { value: 'advanced', label: 'Advanced', color: 'purple', icon: <Sparkles className="w-3 h-3" /> },
    { value: 'custom', label: 'Custom', color: 'orange', icon: <Settings className="w-3 h-3" /> }
];

export function ConfigurationLab() {
    const [strategy, setStrategy] = useState<ConfigurationStrategy>('balanced');
    const [query, setQuery] = useState('');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [mode, setMode] = useState<'single' | 'compare'>('single');

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ConfigurationResponse | null>(null);
    const [comparisonResults, setComparisonResults] = useState<ConfigurationResponse[]>([]);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const loadPreset = (preset: typeof PRESET_PROMPTS[0]) => {
        setQuery(preset.query);
        setStrategy(preset.bestStrategy);
        setResult(null);
        setComparisonResults([]);
    };

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setResult(null);
        setComparisonResults([]);

        try {
            if (mode === 'single') {
                const res = await runConfigurableAgent({ query, strategy }, model);
                setResult(res);
            } else {
                const res = await compareConfigurations(query, ['minimal', 'balanced', 'advanced'], model);
                setComparisonResults(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[950px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Settings className="w-5 h-5 text-indigo-500" />
                        <h3>Configuration Agent Lab</h3>
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setMode('single')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'single'
                            ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                            }`}
                    >
                        <Zap className="w-3 h-3" />
                        Single Config
                    </button>
                    <button
                        onClick={() => setMode('compare')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'compare'
                            ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                            }`}
                    >
                        <GitCompare className="w-3 h-3" />
                        Compare Configs
                    </button>
                </div>

                {/* Strategy Selector (only for single mode) */}
                {mode === 'single' && (
                    <div className="grid grid-cols-4 gap-2">
                        {STRATEGIES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => setStrategy(s.value)}
                                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${strategy === s.value
                                    ? `bg-${s.color}-500 text-white border-${s.color}-600 shadow-sm`
                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                    }`}
                            >
                                {s.icon}
                                <span className="text-[10px]">{s.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Preset Examples */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Quick Examples</label>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_PROMPTS.map((preset, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => loadPreset(preset)}
                                className="px-3 py-2 rounded-lg text-xs font-medium transition-all border bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-left"
                            >
                                <div className="font-bold">{preset.label}</div>
                                <div className="text-[10px] text-zinc-500 mt-0.5">
                                    Best: {preset.bestStrategy}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRun} className="mb-8 space-y-4">
                    {/* Query Input */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                            Query
                        </label>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none h-24 leading-relaxed"
                            disabled={loading}
                            placeholder="Enter your query here..."
                        />
                    </div>

                    <button
                        disabled={loading || !query.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {loading ? 'Processing...' : mode === 'single' ? 'Run Agent' : 'Compare Strategies'}
                    </button>
                </form>

                {/* Results Area */}
                <AnimatePresence>
                    {/* Single Result */}
                    {result && mode === 'single' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Configuration Card */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                                <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                    <Settings className="w-3 h-3" /> Active Configuration
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                        <div className="text-zinc-500 text-[10px]">Temperature</div>
                                        <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.config.temperature}</div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                        <div className="text-zinc-500 text-[10px]">Max Tokens</div>
                                        <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.config.maxTokens}</div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                        <div className="text-zinc-500 text-[10px]">Top P</div>
                                        <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.config.topP}</div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                        <div className="text-zinc-500 text-[10px]">Processing Time</div>
                                        <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.metadata.processingTime}ms</div>
                                    </div>
                                </div>
                                {result.metadata.configRationale && (
                                    <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                        <strong>Rationale:</strong> {result.metadata.configRationale}
                                    </div>
                                )}
                            </div>

                            {/* Answer Card with Enhanced Rendering */}
                            <div className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-lg relative ${result.success
                                ? 'border-emerald-200 dark:border-emerald-800'
                                : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'
                                    }`} />

                                {/* Header */}
                                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            {result.success ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                            Agent Response
                                        </h4>
                                        <div className="flex gap-2 text-[10px] text-zinc-500">
                                            <span>{result.answer.split(' ').length} words</span>
                                            <span>•</span>
                                            <span>{result.answer.length} chars</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Response Content */}
                                <div className="p-6">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                            {result.answer.split('\n').map((line, i) => (
                                                <p key={i} className="mb-3 last:mb-0">
                                                    {line.startsWith('```') ? (
                                                        <code className="block bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                                                            {line.replace(/```/g, '')}
                                                        </code>
                                                    ) : line.startsWith('- ') || line.startsWith('* ') ? (
                                                        <span className="flex gap-2">
                                                            <span className="text-indigo-500">•</span>
                                                            <span>{line.substring(2)}</span>
                                                        </span>
                                                    ) : line.match(/^\d+\./) ? (
                                                        <span className="flex gap-2">
                                                            <span className="font-bold text-indigo-600">{line.match(/^\d+\./)?.[0]}</span>
                                                            <span>{line.replace(/^\d+\.\s*/, '')}</span>
                                                        </span>
                                                    ) : (
                                                        line
                                                    )}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Parameter Impact Visualization */}
                                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Parameter Impact</h5>
                                    <div className="space-y-2">
                                        {/* Temperature Impact */}
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-zinc-600 dark:text-zinc-400">Temperature: {result.config.temperature}</span>
                                                <span className="text-zinc-500">
                                                    {result.config.temperature < 0.3 ? 'Deterministic' :
                                                        result.config.temperature < 0.7 ? 'Balanced' : 'Creative'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full transition-all"
                                                    style={{ width: `${result.config.temperature * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Token Limit Impact */}
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-zinc-600 dark:text-zinc-400">Max Tokens: {result.config.maxTokens}</span>
                                                <span className="text-zinc-500">
                                                    {result.config.maxTokens < 400 ? 'Concise' :
                                                        result.config.maxTokens < 800 ? 'Standard' : 'Detailed'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min((result.config.maxTokens / 1024) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Top P Impact */}
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-zinc-600 dark:text-zinc-400">Top P: {result.config.topP}</span>
                                                <span className="text-zinc-500">
                                                    {result.config.topP < 0.92 ? 'Focused' :
                                                        result.config.topP < 0.97 ? 'Balanced' : 'Diverse'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full transition-all"
                                                    style={{ width: `${result.config.topP * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Workflow Diagram */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    Configuration Agent Workflow
                                </h4>

                                <div className="flex flex-col items-center gap-2 text-xs font-mono">
                                    <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">User Query</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-blue-600 border border-blue-200 rounded font-bold">Config Selector</div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 justify-center">
                                                <Settings className="w-3 h-3 text-blue-500" />
                                                <span className="text-blue-600 dark:text-blue-400 text-[10px]">Strategy: {result.metadata.strategy}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-purple-600 border border-purple-200 rounded font-bold">LLM Initialization</div>
                                        <div className="flex flex-col gap-1 text-[9px] text-purple-600 dark:text-purple-400">
                                            <div>• Temperature: {result.config.temperature}</div>
                                            <div>• Max Tokens: {result.config.maxTokens}</div>
                                            <div>• Top P: {result.config.topP}</div>
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-indigo-600 border border-indigo-200 rounded font-bold">Agent Execution</div>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Brain className="w-3 h-3 text-indigo-500" />
                                            <span className="text-indigo-600 dark:text-indigo-400 text-[10px]">Processing with {model}</span>
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 font-bold">Configured Response</span>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* Comparison Results with Enhanced Visualization */}
                    {comparisonResults.length > 0 && mode === 'compare' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">Configuration Comparison</h4>

                            {/* Comparison Diagram */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                                <h5 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-4">Parameter Comparison</h5>

                                <div className="space-y-4">
                                    {/* Temperature Comparison */}
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 mb-2">TEMPERATURE</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {comparisonResults.map((res, i) => (
                                                <div key={i} className="text-center">
                                                    <div className="text-[9px] text-zinc-500 mb-1">{res.metadata.strategy}</div>
                                                    <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-end justify-center p-2">
                                                        <div
                                                            className={`w-full rounded-t transition-all ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                                                                }`}
                                                            style={{ height: `${res.config.temperature * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs font-bold mt-1">{res.config.temperature}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Max Tokens Comparison */}
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 mb-2">MAX TOKENS</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {comparisonResults.map((res, i) => (
                                                <div key={i} className="text-center">
                                                    <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-end justify-center p-2">
                                                        <div
                                                            className={`w-full rounded-t transition-all ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                                                                }`}
                                                            style={{ height: `${(res.config.maxTokens / 1024) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs font-bold mt-1">{res.config.maxTokens}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Processing Time Comparison */}
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 mb-2">PROCESSING TIME</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {comparisonResults.map((res, i) => {
                                                const maxTime = Math.max(...comparisonResults.map(r => r.metadata.processingTime));
                                                return (
                                                    <div key={i} className="text-center">
                                                        <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-end justify-center p-2">
                                                            <div
                                                                className={`w-full rounded-t transition-all ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                                                                    }`}
                                                                style={{ height: `${(res.metadata.processingTime / maxTime) * 100}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-xs font-bold mt-1">{res.metadata.processingTime}ms</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Individual Results */}
                            {comparisonResults.map((res, i) => (
                                <div key={i} className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-lg ${i === 0 ? 'border-blue-200 dark:border-blue-800' :
                                        i === 1 ? 'border-emerald-200 dark:border-emerald-800' :
                                            'border-purple-200 dark:border-purple-800'
                                    }`}>
                                    <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                                        }`} />

                                    {/* Header */}
                                    <div className={`p-4 border-b border-zinc-200 dark:border-zinc-800 ${i === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' :
                                            i === 1 ? 'bg-emerald-50/50 dark:bg-emerald-900/10' :
                                                'bg-purple-50/50 dark:bg-purple-900/10'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs font-bold uppercase flex items-center gap-2">
                                                {i === 0 ? <Sliders className="w-3 h-3 text-blue-600" /> :
                                                    i === 1 ? <BarChart3 className="w-3 h-3 text-emerald-600" /> :
                                                        <Sparkles className="w-3 h-3 text-purple-600" />}
                                                <span className={
                                                    i === 0 ? 'text-blue-700 dark:text-blue-400' :
                                                        i === 1 ? 'text-emerald-700 dark:text-emerald-400' :
                                                            'text-purple-700 dark:text-purple-400'
                                                }>{res.metadata.strategy} Strategy</span>
                                            </h5>
                                            <div className="flex gap-2 text-[10px] text-zinc-500">
                                                <span>{res.answer.split(' ').length} words</span>
                                                <span>•</span>
                                                <span>{res.metadata.processingTime}ms</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Config Summary */}
                                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                                        <div className="grid grid-cols-4 gap-2 text-[10px]">
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded text-center">
                                                <div className="text-zinc-500">Temp</div>
                                                <div className="font-bold">{res.config.temperature}</div>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded text-center">
                                                <div className="text-zinc-500">Tokens</div>
                                                <div className="font-bold">{res.config.maxTokens}</div>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded text-center">
                                                <div className="text-zinc-500">Top P</div>
                                                <div className="font-bold">{res.config.topP}</div>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded text-center">
                                                <div className="text-zinc-500">Top K</div>
                                                <div className="font-bold">{res.config.topK}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Response */}
                                    <div className="p-4">
                                        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-64 overflow-y-auto">
                                            {res.answer.split('\n').map((line, lineIdx) => (
                                                <p key={lineIdx} className="mb-2 last:mb-0">
                                                    {line.startsWith('- ') || line.startsWith('* ') ? (
                                                        <span className="flex gap-2">
                                                            <span className={
                                                                i === 0 ? 'text-blue-500' :
                                                                    i === 1 ? 'text-emerald-500' :
                                                                        'text-purple-500'
                                                            }>•</span>
                                                            <span>{line.substring(2)}</span>
                                                        </span>
                                                    ) : (
                                                        line
                                                    )}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
