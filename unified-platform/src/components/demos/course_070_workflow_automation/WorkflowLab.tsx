'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Database,
    MessageCircle,
    BrainCircuit,
    Play,
    CheckCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { getWorkflowLogs } from '@/actions/course_070_workflow_automation/workflow_backend';

export function WorkflowLab() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [activeNode, setActiveNode] = useState<number>(-1);
    const [scenario, setScenario] = useState<'valid' | 'spam'>('valid');

    const NODES = [
        { id: 0, label: 'Email', icon: <Mail className="w-6 h-6" /> },
        { id: 1, label: 'AI Parser', icon: <BrainCircuit className="w-6 h-6" /> },
        { id: 2, label: 'CRM', icon: <Database className="w-6 h-6" /> },
        { id: 3, label: 'Slack', icon: <MessageCircle className="w-6 h-6" /> }
    ];

    const handleRun = async (type: 'valid' | 'spam') => {
        setIsRunning(true);
        setScenario(type);
        setLogs([]);
        setActiveNode(-1);

        const newLogs = await getWorkflowLogs(type);

        // Visualize the flow step by step
        for (let i = 0; i < NODES.length; i++) {
            setActiveNode(i);

            // If spam, we stop after AI (Node 1)
            if (type === 'spam' && i === 2) {
                setLogs(prev => [...prev, "⚠ Workflow Terminated: Spam Detected"]);
                break;
            }

            setLogs(prev => [...prev, newLogs[i] || "Processing..."]);
            await new Promise(r => setTimeout(r, 1000));
        }

        setActiveNode(-1);
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-500" />
                        ZapAgent Builder
                    </h3>
                    <p className="text-zinc-500 text-sm">Automated sales pipeline simulation</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleRun('valid')}
                        disabled={isRunning}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Valid Lead
                    </button>
                    <button
                        onClick={() => handleRun('spam')}
                        disabled={isRunning}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Spam Email
                    </button>
                </div>
            </div>

            {/* Pipeline Visual */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between relative overflow-hidden">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-12 right-12 h-1 bg-zinc-200 dark:bg-zinc-800 -z-0" />

                {/* Progress Line */}
                <motion.div
                    className={`absolute top-1/2 left-12 h-1 -z-0 ${scenario === 'spam' ? 'bg-red-500' : 'bg-green-500'}`}
                    animate={{ width: activeNode === -1 ? '0%' : `${(activeNode / (NODES.length - 1)) * 80}%` }}
                    transition={{ duration: 0.5 }}
                />

                {NODES.map((node, i) => {
                    const isActive = i === activeNode;
                    const isPassed = i < activeNode && activeNode !== -1;
                    const isError = scenario === 'spam' && i >= 2 && activeNode >= 1; // Nodes after Spam detection

                    return (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    borderColor: isActive
                                        ? (scenario === 'spam' && i === 1 ? '#ef4444' : '#6366f1')
                                        : (isPassed ? '#10b981' : '#e4e4e7')
                                }}
                                className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center border-4 bg-white dark:bg-zinc-900 shadow-sm transition-colors
                                    ${isError ? 'opacity-30 grayscale' : ''}
                                `}
                            >
                                {isPassed ? <CheckCircle className="w-8 h-8 text-emerald-500" /> :
                                    (scenario === 'spam' && i === 1 && !isRunning && activeNode === -1) ? <XCircle className="w-8 h-8 text-red-500" /> :
                                        node.icon}
                            </motion.div>
                            <div className="font-bold text-sm text-zinc-600 dark:text-zinc-400">{node.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Logs */}
            <div className="flex-1 bg-black rounded-2xl p-6 font-mono text-sm text-green-400 overflow-y-auto custom-scrollbar shadow-inner border border-zinc-800">
                <div className="opacity-50 mb-2">// Worfklow Execution Logs</div>
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1"
                    >
                        <span className="text-zinc-500 mr-4">{new Date().toLocaleTimeString()}</span>
                        {log}
                    </motion.div>
                ))}
                {isRunning && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }} className="w-2 h-4 bg-green-500 inline-block align-middle ml-2" />}
            </div>
        </div>
    );
}
