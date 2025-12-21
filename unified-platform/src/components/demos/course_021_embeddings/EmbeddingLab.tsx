'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Layers,
    Share2,
    Cpu,
    Zap,
    Activity,
    ChevronRight,
    BarChart3,
    Grid2X2,
    Database,
    Binary
} from 'lucide-react';
import {
    generateEmbedding,
    findSimilarTexts,
    type SimilarityResult,
    type EmbeddingResult
} from '@/actions/course_021_embeddings/embeddings';
import { EMBEDDING_PRESETS } from '@/actions/course_021_embeddings/presets';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

export function EmbeddingLab() {
    const [query, setQuery] = useState('');
    const [model, setModel] = useState("nomic-embed-text");
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState<keyof typeof EMBEDDING_PRESETS>('mixed');

    const [results, setResults] = useState<SimilarityResult[]>([]);
    const [activeEmbedding, setActiveEmbedding] = useState<EmbeddingResult | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const available = await getOllamaModels();
                // Filter for embedding models if possible, otherwise just show available
                const embedModels = available.filter(m => m.includes('embed') || m.includes('mini'));
                setModels(embedModels.length > 0 ? embedModels : available);
                if (embedModels.length > 0) setModel(embedModels[0]);
                else if (available.length > 0) setModel(available[0]);
            } catch (err) {
                console.error("Failed to fetch models", err);
            }
        };
        fetchModels();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const targets = EMBEDDING_PRESETS[activeCategory];
            const searchResults = await findSimilarTexts(query, targets, model);
            const queryEmbed = await generateEmbedding(query, model);

            setResults(searchResults);
            setActiveEmbedding(queryEmbed);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePresetClick = (text: string) => {
        setQuery(text);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px]">

            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 italic">Vector Workspace</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">MODULE 21: SEMANTIC INTELLIGENCE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Embedding Model</span>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-200 shadow-sm"
                            >
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a concept to see it as a vector..."
                        className="w-full pl-12 pr-32 py-4 bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-inner outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                        {loading ? <Activity className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        {loading ? 'Vectorizing...' : 'Embed & Search'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">

                {/* Lateral Control (Presets) */}
                <div className="w-72 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-black/20 p-4 overflow-y-auto">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Semantic Contexts</h4>
                    <div className="space-y-1 mb-6">
                        {(Object.keys(EMBEDDING_PRESETS) as Array<keyof typeof EMBEDDING_PRESETS>).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${activeCategory === cat
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800'
                                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                <span className="capitalize">{cat}</span>
                                {activeCategory === cat && <ChevronRight className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>

                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Sample Documents</h4>
                    <div className="space-y-2">
                        {EMBEDDING_PRESETS[activeCategory].map((text, i) => (
                            <button
                                key={i}
                                onClick={() => handlePresetClick(text)}
                                className="w-full text-left p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-zinc-50/20 dark:bg-zinc-950/20">
                    <AnimatePresence mode="wait">
                        {!activeEmbedding ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700">
                                    <Binary className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                                </div>
                                <h4 className="text-lg font-bold text-zinc-400">Semantic Engine Idle</h4>
                                <p className="text-sm text-zinc-500 max-w-xs mt-2 italic font-medium leading-relaxed">
                                    Pick a document or type a concept to see how the AI represents it in N-dimensional vector space.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Vector Visualization */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                <Cpu className="w-4 h-4 text-indigo-500" />
                                                Embedded Representation
                                            </h4>
                                            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                                                {activeEmbedding.dimensions} Dimensions
                                            </span>
                                        </div>
                                        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 aspect-square lg:aspect-auto h-48 flex items-center justify-center relative overflow-hidden group">
                                            {/* Simulated Matrix Visualization */}
                                            <div className="grid grid-cols-16 gap-0.5 opacity-50">
                                                {activeEmbedding.embedding.slice(0, 256).map((val, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-2 h-2 rounded-xs"
                                                        style={{
                                                            backgroundColor: `hsl(${220 + val * 50}, 70%, ${50 + val * 30}%)`,
                                                            opacity: Math.abs(val) * 2 + 0.2
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-[10px] text-zinc-500 font-mono mb-1">Vector Fragment [0:3]</div>
                                                        <div className="text-xs text-white font-mono lowercase tracking-tighter">
                                                            [{activeEmbedding.embedding.slice(0, 3).map(v => v.toFixed(6)).join(', ')}...]
                                                        </div>
                                                    </div>
                                                    <BarChart3 className="w-4 h-4 text-indigo-400 animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 border-l-2 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r-lg">
                                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium italic leading-relaxed">
                                                "Embedding space projects your text into {activeEmbedding.dimensions} numeric coordinates, where semantically similar items sit geographically closer to each other."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Database className="w-4 h-4 text-indigo-500" />
                                            Semantic Similarity Matches
                                        </h4>
                                        <div className="space-y-4 flex-1">
                                            {results.map((res, i) => (
                                                <div key={i} className="relative group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 pr-12 line-clamp-2">
                                                            {res.textB}
                                                        </p>
                                                        <div className="text-right">
                                                            <div className={`text-xs font-black ${i === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}>
                                                                {(res.score * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${res.score * 100}%` }}
                                                            transition={{ delay: i * 0.1, duration: 0.5 }}
                                                            className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-zinc-400 dark:bg-zinc-600'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Diagram Section */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                            <Share2 className="w-4 h-4 text-pink-600" />
                                        </div>
                                        <h4 className="text-sm font-bold">Semantic Clustering Workflow</h4>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 -z-0 opacity-20" />

                                        <div className="z-10 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center gap-2 w-full md:w-32 text-center shadow-lg">
                                            <Grid2X2 className="w-5 h-5 text-indigo-500" />
                                            <span className="text-[10px] font-bold uppercase">Raw Text</span>
                                            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                        </div>

                                        <ChevronRight className="w-6 h-6 text-zinc-300 md:hidden rotate-90" />

                                        <div className="z-10 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center gap-2 w-full md:w-48 text-center shadow-lg">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            <span className="text-[10px] font-bold uppercase">Embedding Model</span>
                                            <span className="text-[9px] text-zinc-500 font-mono">{model}</span>
                                            <div className="h-1 w-8 bg-yellow-500 rounded-full" />
                                        </div>

                                        <ChevronRight className="w-6 h-6 text-zinc-300 md:hidden rotate-90" />

                                        <div className="z-10 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center gap-2 w-full md:w-32 text-center shadow-lg">
                                            <Layers className="w-5 h-5 text-indigo-500" />
                                            <span className="text-[10px] font-bold uppercase">Dense Fluid</span>
                                            <span className="text-[9px] text-zinc-500">{activeEmbedding.dimensions}D Array</span>
                                            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                        </div>

                                        <ChevronRight className="w-6 h-6 text-zinc-300 md:hidden rotate-90" />

                                        <div className="z-10 bg-pink-500 p-4 rounded-xl flex flex-col items-center gap-2 w-full md:w-32 text-center shadow-lg text-white">
                                            <Search className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase">Similarity</span>
                                            <div className="h-1 w-8 bg-white opacity-50 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Legend / Status Footer */}
            <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Ollama Node Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <span>Precision: Float32</span>
                    <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                    <span>Space: Semantic Euclidean</span>
                </div>
            </div>
        </div>
    );
}
