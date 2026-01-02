'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch,
    History,
    RotateCcw,
    Play,
    Plus,
    Save,
    Loader2
} from 'lucide-react';
import { getAgentVersions, runAgentVersion, createNewVersion, AgentVersion } from '@/actions/course_073_version_control/version_backend';
import { getAvailableModels } from '@/lib/llm_helper';

export function VersionControlLab() {
    const [versions, setVersions] = useState<AgentVersion[]>([]);
    const [selectedVer, setSelectedVer] = useState<string>('');
    const [input, setInput] = useState("Hello agent!");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    // Modification State
    const [instruction, setInstruction] = useState("");
    const [isCommitting, setIsCommitting] = useState(false);

    // Model Config
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        refreshVersions();
        getAvailableModels().then(m => {
            setModels(m);
            if (m.length > 0) setSelectedModel(m[0]);
        });
    }, []);

    const refreshVersions = () => {
        getAgentVersions().then(data => {
            setVersions(data);
            if (!selectedVer && data.length > 0) setSelectedVer(data[0].version);
        });
    };

    const handleRun = async () => {
        setLoading(true);
        const res = await runAgentVersion(selectedVer, input);
        setOutput(res);
        setLoading(false);
    };

    const handleCommit = async () => {
        if (!instruction || !selectedVer) return;
        setIsCommitting(true);
        try {
            const newVer = await createNewVersion(selectedVer, instruction, selectedModel);
            setSelectedVer(newVer.version);
            setInstruction("");
            await refreshVersions();
        } catch (e) {
            console.error(e);
        }
        setIsCommitting(false);
    };

    const activeVersionData = versions.find(v => v.version === selectedVer);

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-orange-500" />
                            LLM Prompt Registry
                        </h3>
                        <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-mono text-zinc-400">
                            {models.length > 0 ? selectedModel : 'Loading...'}
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm">Semantic Versioning for AI behavior</p>
                </div>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                {/* Sidebar list */}
                <div className="w-1/4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-wider flex items-center gap-2 px-2">
                        <History className="w-3 h-3" /> Commit History
                    </h4>
                    <div className="space-y-2">
                        {versions.map(v => (
                            <button
                                key={v.version}
                                onClick={() => setSelectedVer(v.version)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedVer === v.version
                                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:bg-zinc-100'
                                    }`}
                            >
                                <div className="font-bold flex justify-between items-center">
                                    <span className="font-mono text-sm">{v.version}</span>
                                    {selectedVer === v.version && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                                </div>
                                <div className="text-xs text-zinc-500 truncate mt-1">{v.changelog}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Prompt Editor / Diff View (Simulated) */}
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
                        {activeVersionData && (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-2xl font-black">{activeVersionData.version}</div>
                                        <div className="text-sm text-zinc-500 font-mono">Based on {activeVersionData.changelog}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={instruction}
                                            onChange={(e) => setInstruction(e.target.value)}
                                            placeholder="Ex: Make it speak like a pirate..."
                                            className="bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 w-64 shadow-inner"
                                            disabled={isCommitting}
                                        />
                                        <button
                                            onClick={handleCommit}
                                            disabled={!instruction || isCommitting}
                                            className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isCommitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Commit Change
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1 overflow-hidden flex flex-col">
                                    <div className="text-xs font-bold text-zinc-400 uppercase">System Prompt</div>
                                    <div className="flex-1 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-sm text-zinc-600 dark:text-zinc-300 overflow-y-auto whitespace-pre-wrap shadow-inner">
                                        {activeVersionData.prompt}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Playground */}
                    <div className="h-48 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 shadow-xl">
                        <div className="flex gap-4">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl border-none outline-none focus:ring-2 ring-orange-500/50"
                                placeholder="Test input..."
                            />
                            <button
                                onClick={handleRun}
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                Execute v{activeVersionData?.version}
                            </button>
                        </div>

                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 font-mono text-sm border border-zinc-100 dark:border-zinc-800 relative overflow-y-auto">
                            {output ? (
                                <motion.div key={output} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {output}
                                </motion.div>
                            ) : (
                                <span className="text-zinc-400 italic">Output will appear here...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
