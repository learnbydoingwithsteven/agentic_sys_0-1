'use client';

import React, { useState } from 'react';
import { FileJson, User, Calendar, MapPin, Mail, Scan, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractDataAction } from '@/actions/course_008_data_extraction/extract';

type ExtractedData = {
    name?: string;
    date?: string;
    location?: string;
    email?: string;
};

export function ExtractionLab() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ExtractedData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);

        const data = await extractDataAction(input);
        setResult(data);
        setLoading(false);
    };

    const fillSample = () => {
        setInput("Meeting with Sarah Jones on 2024-05-12 at the New York office. Contact her at sarah.j@example.com.");
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Scan className="w-4 h-4 text-emerald-500" />
                    Extraction Lab
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <form onSubmit={handleExtract} className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter unstructured text here..."
                            className="w-full h-32 p-3 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none font-mono"
                        />
                        <button
                            type="button"
                            onClick={fillSample}
                            className="absolute right-2 bottom-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        >
                            Sample
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                        Extract Entities
                    </button>
                </form>

                <div className="min-h-[200px] border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid gap-3"
                            >
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Structured Output</h4>

                                <ResultItem icon={<User className="text-blue-500" />} label="Name" value={result.name} />
                                <ResultItem icon={<Calendar className="text-orange-500" />} label="Date" value={result.date} />
                                <ResultItem icon={<MapPin className="text-red-500" />} label="Location" value={result.location} />
                                <ResultItem icon={<Mail className="text-purple-500" />} label="Email" value={result.email} />

                                <div className="mt-4 p-3 bg-zinc-950 rounded-lg overflow-hidden relative group">
                                    <div className="absolute top-2 right-2 text-[10px] text-zinc-500 font-mono">JSON</div>
                                    <pre className="text-[10px] text-green-400 font-mono overflow-x-auto">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            </motion.div>
                        ) : (
                            !loading && (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic text-sm py-12">
                                    <FileJson className="w-12 h-12 mb-3 opacity-20" />
                                    <p>Structured data will appear here</p>
                                </div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function ResultItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                    className: `w-4 h-4 ${(icon as React.ReactElement<{ className?: string }>).props.className || ''}`
                })}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">{label}</div>
                <div className={`text-sm font-medium truncate ${value ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 italic'}`}>
                    {value || 'Not found'}
                </div>
            </div>
            {value && <div className="w-2 h-2 rounded-full bg-green-500" />}
        </div>
    );
}
