'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GitBranch,
    History,
    RotateCcw,
    Play
} from 'lucide-react';
import { getAgentVersions, runAgentVersion, AgentVersion } from '@/actions/course_073_version_control/version_backend';

export function VersionControlLab() {
    const [versions, setVersions] = useState<AgentVersion[]>([]);
    const [selectedVer, setSelectedVer] = useState<string>('');
    const [input, setInput] = useState("Hello");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAgentVersions().then(data => {
            setVersions(data);
            if (data.length > 0) setSelectedVer(data[0].version);
        });
    }, []);

    const handleRun = async () => {
        setLoading(true);
        const res = await runAgentVersion(selectedVer, input);
        setOutput(res);
        setLoading(false);
    };

    const activeVersionData = versions.find(v => v.version === selectedVer);

    return (
        <div className="flex flex-col gap-6 h-[700px]">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-orange-500" />
                        Prompt Registry
                    </h3>
                    <p className="text-zinc-500 text-sm">Semantic Versioning for AI behavior</p>
                </div>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                {/* Sidebar list */}
                <div className="w-1/4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider flex items-center gap-2"><History className="w-3 h-3" /> History</h4>
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
                                <div className="font-bold flex justify-between">
                                    <span>{v.version}</span>
                                    {selectedVer === v.version && <span className="text-orange-500 text-xs bg-orange-100 dark:bg-orange-900 px-2 py-0.5 rounded-full">Active</span>}
                                </div>
                                <div className="text-xs text-zinc-500 truncate mt-1">{v.changelog}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Config Card */}
                    <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
                        {activeVersionData && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-2xl font-black">{activeVersionData.version}</div>
                                        <div className="text-sm text-zinc-500 font-mono">{activeVersionData.model}</div>
                                    </div>
                                    <button className="text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                        <RotateCcw className="w-3 h-3" /> Rollback to here
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-zinc-400 uppercase">System Prompt</div>
                                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-sm text-zinc-600 dark:text-zinc-300">
                                        {activeVersionData.prompt}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Playground */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
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
                                <Play className="w-4 h-4 fill-current" /> Run
                            </button>
                        </div>

                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 font-mono text-sm border border-zinc-100 dark:border-zinc-800 relative">
                            {output ? (
                                <motion.div key={output} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {output}
                                </motion.div>
                            ) : (
                                <span className="text-zinc-400 italic">Output will appear here...</span>
                            )}
                            {loading && <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
