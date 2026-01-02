'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    BarChart2,
    Code,
    Scan,
    Eye,
    Loader2
} from 'lucide-react';
import { analyzeImage } from '@/actions/course_067_multi_modal/multimodal_backend';
import { getAvailableModels } from '@/lib/llm_helper';

// Maps ID to public asset path
const IMAGE_PATHS: Record<string, string> = {
    'cat': '/assets/course_067/cat.png',
    'chart': '/assets/course_067/chart.png',
    'code': '/assets/course_067/code.png'
};

const IMAGES = [
    { id: 'cat', label: 'Cat Photo', icon: <ImageIcon className="w-16 h-16 text-zinc-300" /> },
    { id: 'chart', label: 'Business Chart', icon: <BarChart2 className="w-16 h-16 text-zinc-300" /> },
    { id: 'code', label: 'Code Screenshot', icon: <Code className="w-16 h-16 text-zinc-300" /> }
];

export function MultiModalLab() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [result, setResult] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            // Default to a vision-like model if possible, or just first
            const vision = available.find(m => m.includes('llava') || m.includes('moondream'));
            if (vision) setSelectedModel(vision);
            else if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleAnalyze = async () => {
        if (!selectedId || !selectedModel) return;
        setIsScanning(true);
        setResult("");
        try {
            const res = await analyzeImage(selectedId, selectedModel);
            setResult(res);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Gallery */}
            <div className="flex gap-4 justify-center">
                {IMAGES.map(img => (
                    <button
                        key={img.id}
                        onClick={() => { setSelectedId(img.id); setResult(""); }}
                        className={`w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative ${selectedId === img.id
                            ? 'bg-blue-50 border-blue-500 scale-110 shadow-lg'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-300'
                            }`}
                    >
                        {/* Show Thumbnail if available, else Icon */}
                        <img
                            src={IMAGE_PATHS[img.id]}
                            alt={img.label}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] py-1 font-bold z-10">
                            {img.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Viewer */}
            <div className="flex-1 bg-zinc-950 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center border border-zinc-900 shadow-2xl">

                {/* Model Selector Overlay */}
                <div className="absolute top-4 right-4 z-20">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-black/50 text-white backdrop-blur-md px-3 py-2 rounded-xl text-xs border border-white/10 outline-none cursor-pointer hover:bg-black/70 transition-colors"
                        disabled={isScanning}
                    >
                        {models.length === 0 && <option value="">Loading Models...</option>}
                        {models.map(m => (
                            <option key={m} value={m}>{m} {m.includes('llava') ? '👁️' : ''}</option>
                        ))}
                    </select>
                </div>

                {selectedId ? (
                    <>
                        {/* Real Image Display */}
                        <div className="relative group mb-8 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
                            <img
                                src={IMAGE_PATHS[selectedId]}
                                alt="Selected"
                                className="max-w-md max-h-[300px] object-contain"
                            />

                            {/* Scanning Effect */}
                            {isScanning && (
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_50px_10px_#10b981]"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            )}
                        </div>

                        {/* Result */}
                        <div className="max-w-xl text-center z-10">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-lg text-emerald-300 font-medium bg-zinc-900/80 backdrop-blur p-4 rounded-2xl border border-emerald-500/30"
                                >
                                    <Eye className="w-5 h-5 inline mr-2 text-emerald-400" />
                                    "{result}"
                                </motion.div>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isScanning || !selectedModel}
                                    className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                                    {isScanning ? 'Analyzing Pixels...' : 'Analyze Image'}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-zinc-600">Select an image above</div>
                )}
            </div>
        </div>
    );
}
