'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Crown,
    Server,
    Vote,
    Skull
} from 'lucide-react';
import { runElection, DistNode } from '@/actions/course_084_distributed/dist_backend';

export function DistributedLab() {
    const [nodes, setNodes] = useState<DistNode[]>([
        { id: '1', role: 'LEADER', votes: 0 },
        { id: '2', role: 'FOLLOWER', votes: 0 },
        { id: '3', role: 'FOLLOWER', votes: 0 },
        { id: '4', role: 'FOLLOWER', votes: 0 },
        { id: '5', role: 'FOLLOWER', votes: 0 },
    ]);
    const [status, setStatus] = useState('STABLE');

    const killLeader = async () => {
        setStatus('ELECTION');

        // 1. Identify Leader and Kill
        const currentLeader = nodes.find(n => n.role === 'LEADER');
        if (currentLeader) {
            setNodes(prev => prev.map(n => n.id === currentLeader.id ? { ...n, role: 'FOLLOWER' } : n)); // Demote
        }

        // 2. Wait for "Timeout"
        await new Promise(r => setTimeout(r, 1000));

        // 3. Run Election
        const newState = await runElection(nodes);
        setNodes(newState);
        setStatus('STABLE');
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        Raft Consensus Simulator
                    </h3>
                    <p className="text-zinc-500 text-sm">Status: <span className="font-mono font-bold text-amber-600">{status}</span></p>
                </div>
                <button
                    onClick={killLeader}
                    disabled={status !== 'STABLE'}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    <Skull className="w-4 h-4 fill-current" /> Kill Leader
                </button>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-3xl p-12 border border-zinc-800 relative flex items-center justify-center overflow-hidden">
                {/* Node Ring */}
                {nodes.map((node, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180); // 5 nodes * 72deg
                    const radius = 220;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    const isLeader = node.role === 'LEADER';

                    return (
                        <motion.div
                            key={node.id}
                            layout
                            className={`
                                absolute w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl z-10
                                ${isLeader
                                    ? 'bg-amber-500 border-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
                                    : 'bg-zinc-800 border-zinc-700'}
                            `}
                            style={{ x, y }} // Framer Motion handles the 'transform'
                        >
                            {isLeader ? (
                                <Crown className="w-12 h-12 text-white mb-2" />
                            ) : (
                                <Server className="w-10 h-10 text-zinc-500 mb-2" />
                            )}
                            <div className="font-bold text-white text-lg">Node {node.id}</div>
                            <div className="text-xs uppercase font-bold opacity-60 text-white">{node.role}</div>

                            {/* Vote Count (during election) */}
                            {status === 'ELECTION' && node.votes > 0 && (
                                <div className="absolute -top-4 -right-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                                    {node.votes}
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Election Particles */}
                {status === 'ELECTION' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="text-zinc-700 text-9xl font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-pulse">
                            VOTING
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
