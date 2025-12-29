'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scan,
    Image as ImageIcon,
    Target
} from 'lucide-react';
import { detectObjects, BoundingBox } from '@/actions/course_068_computer_vision/vision_backend';

export function VisionLab() {
    const [selectedImage, setSelectedImage] = useState<'street' | 'office'>('street');
    const [boxes, setBoxes] = useState<BoundingBox[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async () => {
        setIsScanning(true);
        setBoxes([]);
        try {
            const res = await detectObjects(selectedImage);
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
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-500" />
                        YOLO Object Detection
                    </h3>
                    <p className="text-zinc-500 text-sm">Model: YOLOv8-Nano (Simulated)</p>
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
                        disabled={isScanning}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isScanning ? 'Inference...' : 'Detect Objects'} <Scan className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 bg-zinc-50 dark:bg-black/30 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-full max-w-2xl aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-2xl group">
                    {/* Mock Image Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 select-none pointer-events-none">
                        {/* We use a gradient or icon to represent the image since we don't have real assets */}
                        {selectedImage === 'street' ? (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-col">
                                <div className="text-6xl mb-4">🚗 🚦 🚶</div>
                                <div className="text-xs uppercase tracking-widest opacity-50">Street View Input</div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-col">
                                <div className="text-6xl mb-4">💻 ☕ 👤</div>
                                <div className="text-xs uppercase tracking-widest opacity-50">Office View Input</div>
                            </div>
                        )}
                    </div>

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
                                    className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-bold text-white rounded shadow-sm whitespace-nowrap"
                                    style={{ backgroundColor: box.color }}
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
