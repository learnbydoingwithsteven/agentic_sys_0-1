'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CloudRain,
    Droplets,
    Sprout,
    Brain,
    Sparkles
} from 'lucide-react';
import { runIntervention, CausalNode } from '@/actions/course_094_causal_reasoning/causal_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function CausalLab() {
    const [scenario, setScenario] = useState("It rained last night and the sprinkler was off");
    const [nodes, setNodes] = useState<CausalNode[]>([]);
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const handleAnalyze = async () => {
        if (!selectedModel) return;
        setLoading(true);
        const res = await runIntervention(scenario, selectedModel);
        setNodes(res.nodes);
        setExplanation(res.explanation);
        setLoading(false);
    };

    const getNode = (id: string) => nodes.find(n => n.id === id);

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Causal Reasoning Agent
                    </h3>
                    <p className="text-zinc-500 text-sm">Analyzes cause-and-effect relationships using counterfactual reasoning</p>
                </div>
                <div className="text-xs font-mono text-zinc-400">Model: {selectedModel}</div>
            </div>

            {/* Scenario Input */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-zinc-400 mb-2 block">Scenario</label>
                    <input
                        type="text"
                        value={scenario}
                        onChange={e => setScenario(e.target.value)}
                        placeholder="e.g., 'It rained last night and the sprinkler was off'"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-purple-500"
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !selectedModel}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95 self-end"
                >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? 'Analyzing...' : 'Analyze Causality'}
                </button>
            </div>

            {/* Causal Graph Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 relative flex flex-col justify-center items-center overflow-hidden">

                {/* Top Layer: Causes */}
                <div className="flex gap-40 mb-32 z-10">
                    <NodeBox
                        icon={<CloudRain />}
                        node={getNode('rain')}
                        color={getNode('rain')?.value ? "text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-zinc-400 border-zinc-300 bg-white dark:bg-zinc-900 opacity-50"}
                        label="Rain"
                    />
                    <NodeBox
                        icon={<Droplets />}
                        node={getNode('sprinkler')}
                        color={getNode('sprinkler')?.value ? "text-cyan-500 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "text-zinc-400 border-zinc-300 bg-white dark:bg-zinc-900 opacity-50"}
                        label="Sprinkler"
                    />
                </div>

                {/* Bottom Layer: Effect */}
                <div className="z-10">
                    <NodeBox
                        icon={<Sprout />}
                        node={getNode('wet_grass')}
                        color={getNode('wet_grass')?.value ? "text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-xl ring-4 ring-green-200 dark:ring-green-900/30" : "text-zinc-400 border-zinc-300 bg-white dark:bg-zinc-900 opacity-50"}
                        label="Wet Grass"
                    />
                </div>

                {/* Causal Edges */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full stroke-2">
                    {/* Rain → Grass */}
                    <motion.line
                        x1="calc(50% - 100px)" y1="calc(50% - 60px)"
                        x2="50%" y2="calc(50% + 60px)"
                        animate={{
                            strokeWidth: getNode('wet_grass')?.causedBy?.includes('rain') ? 4 : 2,
                            opacity: getNode('wet_grass')?.causedBy?.includes('rain') ? 1 : 0.3
                        }}
                        className={getNode('wet_grass')?.causedBy?.includes('rain') ? 'stroke-blue-500' : 'stroke-zinc-300 dark:stroke-zinc-700'}
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                    />
                    {/* Sprinkler → Grass */}
                    <motion.line
                        x1="calc(50% + 100px)" y1="calc(50% - 60px)"
                        x2="50%" y2="calc(50% + 60px)"
                        animate={{
                            strokeWidth: getNode('wet_grass')?.causedBy?.includes('sprinkler') ? 4 : 2,
                            opacity: getNode('wet_grass')?.causedBy?.includes('sprinkler') ? 1 : 0.3
                        }}
                        className={getNode('wet_grass')?.causedBy?.includes('sprinkler') ? 'stroke-cyan-500' : 'stroke-zinc-300 dark:stroke-zinc-700'}
                        markerEnd="url(#arrowhead)"
                    />
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                        </marker>
                    </defs>
                </svg>

                {!nodes.length && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className="text-center">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
                            <div className="text-zinc-500">Enter a scenario to analyze causal relationships</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Explanation Panel */}
            {explanation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30"
                >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-3">
                        <Brain className="w-4 h-4" />
                        Causal Explanation
                    </div>
                    <div className="text-sm text-purple-900 dark:text-purple-100">{explanation}</div>
                </motion.div>
            )}
        </div>
    );
}

function NodeBox({ icon, node, color, label }: { icon: React.ReactNode, node?: CausalNode, color: string, label: string }) {
    return (
        <motion.div
            animate={{ scale: node?.value ? 1.05 : 1 }}
            className={`w-36 h-36 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${color} shadow-lg`}
        >
            <div className="w-10 h-10 mb-2">{icon}</div>
            <div className="font-bold text-sm">{label}</div>
            <div className="text-xs font-mono uppercase mt-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5">
                {node?.value ? 'TRUE' : 'FALSE'}
            </div>
        </motion.div>
    );
}
