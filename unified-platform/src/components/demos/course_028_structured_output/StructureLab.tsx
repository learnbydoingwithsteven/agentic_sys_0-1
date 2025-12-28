'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileJson,
    FileText,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Receipt,
    MessageSquareWarning,
    Braces
} from 'lucide-react';
import { extractData, ExtractionResult } from '@/actions/course_028_structured_output/extractor_backend';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const SAMPLES = {
    ticket: `SUBJECT: URGENT!! System Down

Hi Support,

I am incredibly frustrated right now. I've been trying to log in for 3 hours and keep getting Error 505.
This is blocking my entire team's payroll processing which is due TODAY.
Please fix this immediately or I will be demanding a refund.

- John Doe, CEO`,
    invoice: `INVOICE #INV-2024-001
Date: Dec 25, 2024
To: Acme Corp

Services Rendered:
1. Web Development - 40 hours - $4000
2. Server Hosting (Annual) - $500
3. Domain Registration - $20

Total Due: $4,520 USD
Vendor: Tech Solutions Inc.`
};

export function StructureLab() {
    const [mode, setMode] = useState<'ticket' | 'invoice'>('ticket');
    const [input, setInput] = useState(SAMPLES.ticket);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Model state
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("llama3.2");

    useEffect(() => {
        getOllamaModels().then(ms => {
            setModels(ms);
            if (ms.length > 0) {
                const preferred = ms.find(m => m.includes("llama") || m.includes("qwen") || m.includes("mistral"));
                setSelectedModel(preferred || ms[0]);
            }
        });
    }, []);

    const handleExtract = async () => {
        if (!input.trim() || isProcessing) return;
        setIsProcessing(true);
        setResult(null);

        try {
            const res = await extractData(input, mode, selectedModel);
            setResult(res);
        } catch (e) {
            console.error(e);
            setResult({ type: 'error', error: "Extraction crashed." });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl min-h-[600px]">

            {/* Left: Input */}
            <div className="w-1/2 p-6 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Unstructured Input
                    </h3>

                    <div className="flex gap-2">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 text-[10px] rounded px-2 py-1 border-none outline-none"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex text-xs font-bold">
                            <button
                                onClick={() => { setMode('ticket'); setInput(SAMPLES.ticket); setResult(null); }}
                                className={`px-3 py-1.5 rounded-md transition-all ${mode === 'ticket' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                Ticket
                            </button>
                            <button
                                onClick={() => { setMode('invoice'); setInput(SAMPLES.invoice); setResult(null); }}
                                className={`px-3 py-1.5 rounded-md transition-all ${mode === 'invoice' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                Invoice
                            </button>
                        </div>
                    </div>
                </div>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-mono text-zinc-600 dark:text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar mb-4"
                    placeholder="Paste email or invoice text here..."
                />

                <button
                    onClick={handleExtract}
                    disabled={isProcessing || !input.trim()}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isProcessing
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                        }`}
                >
                    {isProcessing ? (
                        <>Processing...</>
                    ) : (
                        <>
                            Extract Data <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            {/* Right: Output */}
            <div className="w-1/2 p-6 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col relative">
                <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-[0.03]" />

                <div className="flex items-center gap-2 mb-6 z-10">
                    <FileJson className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-zinc-700 dark:text-zinc-200">Structured Output</h3>
                </div>

                <div className="flex-1 flex items-center justify-center z-10">
                    {result ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden"
                        >
                            {/* Header Stripe */}
                            <div className={`h-2 w-full ${mode === 'ticket' ? 'bg-red-500' : 'bg-green-500'}`} />

                            <div className="p-6 space-y-4">

                                {/* TICKET VIEW */}
                                {result.type === 'ticket' && (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Category</div>
                                                <div className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{result.data.category}</div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${result.data.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    result.data.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {result.data.urgency}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-1">Summary</div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">{result.data.summary}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
                                                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Sentiment</div>
                                                <div className="text-sm font-medium flex items-center gap-2">
                                                    {result.data.customer_sentiment === 'Angry' && <MessageSquareWarning className="w-4 h-4 text-red-500" />}
                                                    {result.data.customer_sentiment}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
                                                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Recommended</div>
                                                <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight">
                                                    {result.data.next_action_suggestion}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* INVOICE VIEW */}
                                {result.type === 'invoice' && (
                                    <>
                                        <div className="flex justify-between items-start border-b border-dashed border-zinc-200 dark:border-zinc-700 pb-4">
                                            <div>
                                                <div className="text-xs uppercase font-bold text-zinc-400">Vendor</div>
                                                <div className="font-bold text-zinc-800 dark:text-zinc-100">{result.data.vendor_name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs uppercase font-bold text-zinc-400">Invoice #</div>
                                                <div className="font-mono text-zinc-600 dark:text-zinc-300">{result.data.invoice_number}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {result.data.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-zinc-600 dark:text-zinc-400">{item.description}</span>
                                                    <span className="font-mono font-bold">${item.amount}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center mt-4">
                                            <span className="font-bold text-zinc-500 text-sm">TOTAL</span>
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                ${result.data.total_amount} <span className="text-xs text-zinc-400 font-normal">{result.data.currency}</span>
                                            </span>
                                        </div>
                                    </>
                                )}

                                {result.type === 'error' && (
                                    <div className="flex flex-col items-center text-red-500 p-4">
                                        <AlertCircle className="w-8 h-8 mb-2" />
                                        <p className="text-sm font-bold">{result.error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Raw JSON Toggle (Footer) */}
                            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                                <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1 cursor-help hover:text-zinc-600 transition-colors" title={JSON.stringify(result.type === 'error' ? {} : result.data, null, 2)}>
                                    <Braces className="w-3 h-3" />
                                    View Raw JSON
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                <FileJson className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium">Ready to extract data</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
