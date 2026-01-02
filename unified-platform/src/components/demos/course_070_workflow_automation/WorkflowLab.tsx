'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Database,
    MessageCircle,
    BrainCircuit,
    Play,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { runWorkflow } from '@/actions/course_070_workflow_automation/workflow_backend';
import { getAvailableModels } from '@/lib/llm_helper';

const SCENARIOS = {
    valid: {
        subject: "Enterprise License Inquiry",
        body: "Hi team, we are interested in purchasing 500 seats of your unified platform for our engineering team. Please provide a quote. - Acme Corp."
    },
    spam: {
        subject: "CONGRATULATIONS WINNER!",
        body: "You have won $5,000,000 in the Agentic Lottery. Click here to claim your prize immediately! Urgent!!!"
    }
};

export function WorkflowLab() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [activeNode, setActiveNode] = useState<number>(-1);
    const [scenario, setScenario] = useState<'valid' | 'spam'>('valid');

    // Model Selection
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        getAvailableModels().then(available => {
            setModels(available);
            if (available.length > 0) setSelectedModel(available[0]);
        });
    }, []);

    const NODES = [
        { id: 0, label: 'Email', icon: <Mail className="w-6 h-6" /> },
        { id: 1, label: 'AI Parser', icon: <BrainCircuit className="w-6 h-6" /> },
        { id: 2, label: 'CRM', icon: <Database className="w-6 h-6" /> },
        { id: 3, label: 'Slack', icon: <MessageCircle className="w-6 h-6" /> }
    ];

    const handleRun = async (type: 'valid' | 'spam') => {
        if (!selectedModel) return;
        setIsRunning(true);
        setScenario(type);
        setLogs([]);
        setActiveNode(-1);

        const email = SCENARIOS[type];
        const newLogs = await runWorkflow(email.subject, email.body, selectedModel);

        // Check if spam was detected (log contains "Spam detected")
        const isSpam = newLogs.some(l => l.includes("Spam detected"));

        // Visualize
        for (let i = 0; i < NODES.length; i++) {
            setActiveNode(i);

            // If spam, we stop after AI (Node 1)
            if (isSpam && i === 2) {
                setLogs(prev => [...prev, "⚠ Workflow Terminated: Spam Decision"]);
                break;
            }

            // Show logs relevant to this step?
            // Actually logs are mixed. We'll just dump them progressively?
            // Let's dump logs by timestamp matching, or just dump all `newLogs`.
            // For better UX, we just dump them all at end? No, step-by-step.
            // Since we don't have step-index in logs, we'll just show them.
        }

        // Just show all logs for now, maybe with a delay per log for effect
        setLogs(newLogs);

        setActiveNode(-1);
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-500" />
                            ZapAgent Builder
                        </h3>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 outline-none"
                            disabled={isRunning}
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <p className="text-zinc-500 text-sm mt-1">Automated sales pipeline simulation</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleRun('valid')}
                        disabled={isRunning || !selectedModel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} Valid Lead
                    </button>
                    <button
                        onClick={() => handleRun('spam')}
                        disabled={isRunning || !selectedModel}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}  Spam Email
                    </button>
                </div>
            </div>

            {/* Pipeline Visual */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between relative overflow-hidden">
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
                    const isError = scenario === 'spam' && i >= 2;

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
                <div className="opacity-50 mb-2">// Workflow Execution Logs</div>
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mb-1"
                    >
                        <span className="text-zinc-500 mr-4">{new Date().toLocaleTimeString()}</span>
                        {log}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
