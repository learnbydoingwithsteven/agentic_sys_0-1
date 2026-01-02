'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scan,
    Image as ImageIcon,
    Target,
    Loader2
} from 'lucide-react';
import { detectObjects, BoundingBox } from '@/actions/course_068_computer_vision/vision_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function VisionLab() {
    const [selectedImage, setSelectedImage] = useState<'street' | 'office'>('street');
    const [boxes, setBoxes] = useState<BoundingBox[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            const vision = available.find(m => m.includes('llava') || m.includes('moondream'));
            if (vision) setSelectedModel(vision);
            else if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const handleScan = async () => {
        if (!selectedModel) return;
        setIsScanning(true);
        setBoxes([]);
        try {
            const res = await detectObjects(selectedImage, selectedModel);
            setBoxes(res);
        } finally {
            setIsScanning(false);
        }
    };

    const toggleImage = () => {
        setBoxes([]);
        setSelectedImage(prev => prev === 'street' ? 'office' : 'street');
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-rose-500" />
                            AI Object Detection
                        </h3>
                        {/* Model Selector */}
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg text-xs border border-zinc-700 outline-none cursor-pointer"
                            disabled={isScanning}
                        >
                            {models.length === 0 && <option value="">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m} {m.includes('llava') ? '👁️' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <p className="text-zinc-500 text-sm mt-1">Estimates bounding boxes using Vision LLM.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggleImage}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                        <ImageIcon className="w-4 h-4" /> Next Image
                    </button>
                    <button
                        onClick={handleScan}
                        disabled={isScanning || !selectedModel}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                        {isScanning ? 'Inference...' : 'Detect Objects'}
                    </button>
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 bg-zinc-50 dark:bg-black/30 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-full max-w-2xl bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-2xl group flex items-center justify-center">

                    {/* Real Image */}
                    <img
                        src={`/assets/course_068/${selectedImage}.png`}
                        alt={selectedImage}
                        className="w-full h-auto max-h-[500px] object-contain"
                    />

                    {/* Scanning Line */}
                    {isScanning && (
                        <motion.div
                            className="absolute left-0 top-0 w-1 h-full bg-rose-500 shadow-[0_0_20px_#f43f5e] z-20"
                            animate={{ left: ['0%', '100%'] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    )}

                    {/* Bounding Boxes */}
                    <AnimatePresence>
                        {boxes.map((box) => (
                            <motion.div
                                key={box.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute border-2 z-10 hover:bg-white/10 transition-colors cursor-crosshair"
                                style={{
                                    left: `${box.x}%`,
                                    top: `${box.y}%`,
                                    width: `${box.width}%`,
                                    height: `${box.height}%`,
                                    borderColor: box.color
                                }}
                            >
                                <div
                                    className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-bold text-white rounded shadow-sm whitespace-nowrap bg-black/50 backdrop-blur-sm"
                                    style={{ borderBottom: `2px solid ${box.color}` }}
                                >
                                    {box.label} {Math.round(box.confidence * 100)}%
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
