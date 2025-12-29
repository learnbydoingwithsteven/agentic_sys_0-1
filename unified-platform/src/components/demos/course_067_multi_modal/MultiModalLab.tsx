'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    BarChart2,
    Code,
    Scan,
    Eye
} from 'lucide-react';
import { analyzeImage } from '@/actions/course_067_multi_modal/multimodal_backend';

const IMAGES = [
    { id: 'cat', label: 'Cat Photo', icon: <ImageIcon className="w-16 h-16 text-zinc-300" /> },
    { id: 'chart', label: 'Business Chart', icon: <BarChart2 className="w-16 h-16 text-zinc-300" /> },
    { id: 'code', label: 'Code Screenshot', icon: <Code className="w-16 h-16 text-zinc-300" /> }
];

export function MultiModalLab() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [result, setResult] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const handleAnalyze = async () => {
        if (!selectedId) return;
        setIsScanning(true);
        setResult("");
        try {
            const res = await analyzeImage(selectedId);
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
                        className={`w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedId === img.id
                                ? 'bg-blue-50 border-blue-500 scale-110 shadow-lg'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-300'
                            }`}
                    >
                        {img.icon}
                        <span className="text-xs font-bold text-zinc-500">{img.label}</span>
                    </button>
                ))}
            </div>

            {/* Viewer */}
            <div className="flex-1 bg-zinc-950 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center border border-zinc-900 shadow-2xl">
                {selectedId ? (
                    <>
                        {/* Placeholder Image Display */}
                        <div className="w-64 h-48 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center relative mb-8">
                            {IMAGES.find(i => i.id === selectedId)?.icon}

                            {/* Scanning Effect */}
                            {isScanning && (
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_#10b981]"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                            )}
                        </div>

                        {/* Result */}
                        <div className="max-w-xl text-center">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-lg text-emerald-400 font-medium"
                                >
                                    <Eye className="w-5 h-5 inline mr-2" />
                                    "{result}"
                                </motion.div>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isScanning}
                                    className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Scan className="w-4 h-4" />
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
