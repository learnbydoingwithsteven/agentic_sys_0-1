'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CloudRain,
    Droplets,
    Sprout,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { runIntervention, CausalNode } from '@/actions/course_094_causal_reasoning/causal_backend';

export function CausalLab() {
    const [nodes, setNodes] = useState<CausalNode[]>([]);
    const [intervention, setIntervention] = useState(false); // Do(Sprinkler=True)

    useEffect(() => {
        updateWorld();
    }, [intervention]);

    const updateWorld = async () => {
        const res = await runIntervention('sprinkler', intervention);
        setNodes(res);
    };

    const getNode = (id: string) => nodes.find(n => n.id === id);

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">Causal Graph</h3>
                    <p className="text-zinc-500 text-sm">Intervene (DO-operator) to test hypotheses.</p>
                </div>
                <button
                    onClick={() => setIntervention(!intervention)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold ${intervention ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
                >
                    {intervention ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    <span>DO(Sprinkler = {intervention ? 'ON' : 'OFF'})</span>
                </button>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 relative flex flex-col justify-center items-center">

                {/* Top Layer */}
                <div className="flex gap-40 mb-32 z-10">
                    <NodeBox
                        icon={<CloudRain />}
                        node={getNode('rain')}
                        color="text-zinc-400 border-zinc-400 bg-white"
                        label="Rain"
                    />
                    <NodeBox
                        icon={<Droplets />}
                        node={getNode('sprinkler')}
                        color="text-blue-500 border-blue-500 bg-blue-50"
                        label="Sprinkler"
                    />
                </div>

                {/* Bottom Layer */}
                <div className="z-10">
                    <NodeBox
                        icon={<Sprout />}
                        node={getNode('wet_grass')}
                        color={getNode('wet_grass')?.value ? 'text-green-500 border-green-500 bg-green-50' : 'text-zinc-400 border-zinc-200 bg-white opacity-50'}
                        label="Wet Grass"
                    />
                </div>

                {/* Edges */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full stroke-2">
                    {/* Rain -> Grass */}
                    <motion.line
                        x1="calc(50% - 100px)" y1="calc(50% - 60px)"
                        x2="50%" y2="calc(50% + 60px)"
                        className={getNode('wet_grass')?.causedBy?.includes('rain') ? 'stroke-green-500' : 'stroke-zinc-300'}
                        strokeDasharray="5,5"
                    />
                    {/* Sprinkler -> Grass */}
                    <motion.line
                        x1="calc(50% + 100px)" y1="calc(50% - 60px)"
                        x2="50%" y2="calc(50% + 60px)"
                        animate={{ strokeWidth: getNode('wet_grass')?.causedBy?.includes('sprinkler') ? 4 : 2 }}
                        className={getNode('wet_grass')?.causedBy?.includes('sprinkler') ? 'stroke-blue-500' : 'stroke-zinc-300'}
                    />
                </svg>
            </div>
        </div>
    );
}

function NodeBox({ icon, node, color, label }: { icon: any, node?: CausalNode, color: string, label: string }) {
    return (
        <div className={`w-32 h-32 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${color} shadow-lg`}>
            <div className="w-8 h-8 mb-2">{icon}</div>
            <div className="font-bold text-sm">{label}</div>
            <div className="text-xs font-mono uppercase mt-1">{node?.value ? 'TRUE' : 'FALSE'}</div>
        </div>
    );
}
