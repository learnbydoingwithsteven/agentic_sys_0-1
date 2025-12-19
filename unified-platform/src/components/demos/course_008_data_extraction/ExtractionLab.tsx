'use client';

import React, { useState, useEffect } from 'react';
import { FileJson, User, Calendar, Receipt, ArrowRight, Database, Zap, Sparkles, Check, Copy, RefreshCw, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractData, type SchemaType } from '@/actions/course_008_data_extraction/extraction';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const SAMPLE_TEXTS: Record<SchemaType, string[]> = {
    person: [
        "Reach out to Sarah Connor at sarah.connor@sky.net. She works as a Security Consultant for Cyberdyne Systems. Expert in survival and weapons.",
        "John Doe, Senior Developer at TechCorp. Phone: 555-0123. Email: john@example.com."
    ],
    event: [
        "Let's schedule the Project Kickoff for next Tuesday, Oct 24th at 2 PM. We'll meet in Conference Room B. Attendees: Mike, Sue, and Dave.",
        "Team Lunch at The Burger Place, 12:30 PM this Friday."
    ],
    invoice: [
        "Invoice #INV-2024-001 from Acme Corp. Date: 2024-01-15. Items: 3x Widgets at $10.00 each, 1x Gadget at $50.00. Total due: $80.00.",
        "Receipt for Uber Ride. $24.50 charged to Visa ending 4242 on Dec 12, 2023."
    ],
    mixed: [
        "Meeting Minutes: Project Alpha. Attendees: Alice (Lead), Bob (Dev). Action Items: Alice to finalize design by Friday. Bob to set up DB by Monday. Key topics: UI, Database, Auth.",
        "Notes from call with Client X. Attendees: John (Sales), Jane (Client). John to send proposal. Jane to review by next week. Topics: Pricing, Timeline."
    ]
};

export function ExtractionLab() {
    const [schema, setSchema] = useState<SchemaType>('person');
    const [input, setInput] = useState(SAMPLE_TEXTS['person'][0]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const checkModels = async () => {
            setIsChecking(true);
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0 && !itemsContains(available, model)) {
                    setModel(available[0]);
                }
            } catch (err) {
                console.error("Failed to load models", err);
            } finally {
                setIsChecking(false);
            }
        };
        checkModels();
    }, []);

    const itemsContains = (arr: string[], item: string) => arr.includes(item);

    const handleRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await extractData(input, schema, model);
            if (res.success) {
                setResult(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSchema = (s: SchemaType) => {
        setSchema(s);
        setInput(SAMPLE_TEXTS[s][0]);
        setResult(null);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <Database className="w-5 h-5 text-emerald-500" />
                        <h3>Data Extractor</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                        >
                            {models.length === 0 && <option value="llama3.2">Loading...</option>}
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div title={models.length > 0 ? "Models Loaded" : "Checking Models"} className={`w-2 h-2 rounded-full ${models.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                </div>

                {/* Schema Tabs */}
                <div className="flex gap-2 bg-zinc-200 dark:bg-zinc-800/50 p-1 rounded-lg overflow-x-auto">
                    {(['person', 'event', 'invoice', 'mixed'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => toggleSchema(s)}
                            className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${schema === s
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            {s === 'person' && <User className="w-3 h-3" />}
                            {s === 'event' && <Calendar className="w-3 h-3" />}
                            {s === 'invoice' && <Receipt className="w-3 h-3" />}
                            {s === 'mixed' && <Copy className="w-3 h-3" />}
                            <span className="capitalize">{s}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 dark:bg-black/20">

                <form onSubmit={handleRun} className="mb-8 max-w-2xl mx-auto">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                        Unstructured Input
                    </label>
                    <div className="relative mb-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 pr-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm resize-none h-32"
                            disabled={loading}
                        />
                        <button
                            disabled={loading || !input.trim()}
                            className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                        >
                            {loading ? <Sparkles className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {loading ? 'Extracting...' : 'Extract'}
                        </button>
                    </div>

                    {/* Example Pills */}
                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_TEXTS[schema].map((text, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => runExample(text)}
                                className="text-[10px] px-2 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-md transition-colors text-left max-w-full truncate"
                            >
                                Example {i + 1}
                            </button>
                        ))}
                    </div>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Extracted Data</h4>
                                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-md">
                                    <button onClick={() => setViewMode('visual')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${viewMode === 'visual' ? 'bg-white dark:bg-zinc-600 shadow-sm' : 'text-zinc-500'}`}>Visual</button>
                                    <button onClick={() => setViewMode('json')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${viewMode === 'json' ? 'bg-white dark:bg-zinc-600 shadow-sm' : 'text-zinc-500'}`}>JSON</button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg min-h-[200px]">
                                {viewMode === 'json' ? (
                                    <pre className="p-4 text-xs font-mono text-zinc-600 dark:text-zinc-300 overflow-x-auto">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="p-6">
                                        <VisualCard data={result} type={schema} />
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Diagram Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">Extraction Architecture</h4>
                    <div className="flex flex-col gap-6">

                        {/* Flow Diagram */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono">
                            <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Unstructured Text</span>
                            <ArrowRight className="w-4 h-4 text-zinc-300" />
                            <div className="flex flex-col items-center">
                                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded text-indigo-600 mb-1">Schema Injection</span>
                                <span className="text-[10px] text-zinc-400 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                    Type: {schema.toUpperCase()}
                                </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300" />
                            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600">Structured Data</span>
                        </div>

                        {/* Active Schema Visualization */}
                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 overflow-x-auto">
                            <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold uppercase tracking-wider">
                                <Code className="w-3 h-3" /> Injected System Schema
                            </div>
                            <pre className="whitespace-pre-wrap">
                                {getSchemaPreview(schema)}
                            </pre>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    function runExample(txt: string) {
        setInput(txt);
        // Optional auto-run logic could go here
    }
}

function VisualCard({ data, type }: { data: any, type: SchemaType }) {
    if (type === 'person') {
        return (
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <User className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{data.full_name || 'Unknown Name'}</h3>
                    <p className="text-sm text-zinc-500 font-medium">{data.job_title} {data.company && `at ${data.company}`}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data.email && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">{data.email}</span>}
                        {data.phone && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100">{data.phone}</span>}
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'event') {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{data.event_title}</h3>
                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wide">{data.date} • {data.time}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <span className="text-zinc-400 text-xs block mb-1">Location</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{data.location || 'TBD'}</span>
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <span className="text-zinc-400 text-xs block mb-1">Attendees</span>
                        <div className="flex -space-x-2">
                            {data.attendees?.map((a: string, i: number) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] text-indigo-600 font-bold" title={a}>
                                    {a.charAt(0)}
                                </div>
                            )) || '-'}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (type === 'invoice') {
        return (
            <div className="font-mono text-sm">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                    <div>
                        <div className="font-bold text-xl text-zinc-900 dark:text-zinc-100">{data.vendor_name}</div>
                        <div className="text-zinc-400 text-xs">{data.date}</div>
                    </div>
                    <div className="text-right">
                        <div className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500 text-xs">{data.invoice_id || 'NO ID'}</div>
                    </div>
                </div>
                <div className="space-y-2 mb-6">
                    {data.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                            <span>{item.description} <span className="text-zinc-400">x{item.quantity}</span></span>
                            <span>${item.price?.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700 font-bold text-lg">
                    <span>Total</span>
                    <span>${data.total_amount?.toFixed(2)}</span>
                </div>
            </div>
        )
    }
    if (type === 'mixed') {
        return (
            <div className="space-y-6">
                <div>
                    <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">People Discovered</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.people?.map((p: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{p.name.charAt(0)}</div>
                                <div className="leading-none">
                                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{p.name}</div>
                                    <div className="text-[10px] text-zinc-500">{p.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Action Items</h5>
                    <div className="space-y-2">
                        {data.action_items?.map((item: any, i: number) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                                <div className="mt-0.5"><Check className="w-4 h-4 text-yellow-600" /></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.task}</div>
                                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                                        <span>Assignee: {item.assignee}</span>
                                        {item.deadline && <span>Due: {item.deadline}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    return <pre>{JSON.stringify(data)}</pre>;
}

function getSchemaPreview(type: SchemaType): string {
    const SCHEMAS = {
        person: `
{
    "full_name": "string",
    "email": "string | null",
    "phone": "string | null",
    "job_title": "string | null",
    "company": "string | null",
    "skills": ["string"]
}`,
        event: `
{
    "event_title": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM 24hr)",
    "location": "string | null",
    "attendees": ["string"],
    "is_virtual": "boolean"
}`,
        invoice: `
{
    "invoice_id": "string | null",
    "vendor_name": "string",
    "total_amount": "number",
    "currency": "string",
    "date": "string",
    "items": [
        { "description": "string", "quantity": "number", "price": "number" }
    ]
}`,
        mixed: `
{
    "people": [
         { "name": "string", "role": "string", "contact": "string | null" }
    ],
    "action_items": [
         { "task": "string", "assignee": "string", "deadline": "string | null" }
    ],
    "key_topics": ["string"]
}`
    };
    return SCHEMAS[type] || "Unknown Schema";
}
