'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Database, FileJson, File, Sparkles, Activity, CheckCircle, XCircle, BarChart3, Zap, Download, Upload, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processFile, type FileProcessingResponse } from '@/actions/course_018_file_processing/file_processor';
import { SAMPLE_FILES, type FileType, type ProcessingTask } from '@/actions/course_018_file_processing/constants';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const FILE_TYPES: { value: FileType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'csv', label: 'CSV', icon: <Database className="w-4 h-4" />, color: 'emerald' },
    { value: 'json', label: 'JSON', icon: <FileJson className="w-4 h-4" />, color: 'blue' },
    { value: 'txt', label: 'TXT', icon: <FileText className="w-4 h-4" />, color: 'purple' },
    { value: 'pdf', label: 'PDF', icon: <File className="w-4 h-4" />, color: 'red' }
];

const TASKS: { value: ProcessingTask; label: string; description: string }[] = [
    { value: 'summarize', label: 'Summarize', description: 'Get a concise overview' },
    { value: 'extract', label: 'Extract', description: 'Pull out key information' },
    { value: 'analyze', label: 'Analyze', description: 'Find patterns and insights' },
    { value: 'transform', label: 'Transform', description: 'Convert to different format' }
];

// Preset examples for quick testing
const PRESET_EXAMPLES = [
    { fileType: 'csv' as FileType, task: 'summarize' as ProcessingTask, label: 'Summarize Employee Data', instruction: '' },
    { fileType: 'csv' as FileType, task: 'analyze' as ProcessingTask, label: 'Analyze Salary Trends', instruction: '' },
    { fileType: 'json' as FileType, task: 'extract' as ProcessingTask, label: 'Extract Skills from JSON', instruction: '' },
    { fileType: 'txt' as FileType, task: 'summarize' as ProcessingTask, label: 'Summarize Business Report', instruction: '' },
    { fileType: 'pdf' as FileType, task: 'analyze' as ProcessingTask, label: 'Analyze Research Paper', instruction: '' },
    { fileType: 'csv' as FileType, task: 'transform' as ProcessingTask, label: 'CSV to Markdown Table', instruction: 'Convert this CSV data to a Markdown table format' },
];

export function FileProcessingLab() {
    const [fileType, setFileType] = useState<FileType>('csv');
    const [task, setTask] = useState<ProcessingTask>('summarize');
    const [fileContent, setFileContent] = useState(SAMPLE_FILES.csv);
    const [customInstruction, setCustomInstruction] = useState('');
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FileProcessingResponse | null>(null);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    // Update file content when file type changes
    useEffect(() => {
        setFileContent(SAMPLE_FILES[fileType]);
    }, [fileType]);

    const loadPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
        setFileType(preset.fileType);
        setTask(preset.task);
        setFileContent(SAMPLE_FILES[preset.fileType]);
        setCustomInstruction(preset.instruction);
        setResult(null);
    };

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileContent?.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await processFile({
                fileContent,
                fileType,
                task,
                customInstruction: task === 'transform' ? customInstruction : undefined
            }, model);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectedFileType = FILE_TYPES.find(ft => ft.value === fileType)!;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[950px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <h3>File Processing Agent</h3>
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* File Type Selector */}
                <div className="flex gap-2 mb-3">
                    {FILE_TYPES.map((ft) => (
                        <button
                            key={ft.value}
                            onClick={() => setFileType(ft.value)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${fileType === ft.value
                                ? `bg-${ft.color}-500 text-white border-${ft.color}-600 shadow-md`
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                }`}
                            style={fileType === ft.value ? {
                                backgroundColor: `var(--${ft.color}-500)`,
                                borderColor: `var(--${ft.color}-600)`
                            } : {}}
                        >
                            {ft.icon}
                            {ft.label}
                        </button>
                    ))}
                </div>

                {/* Task Selector */}
                <div className="grid grid-cols-2 gap-2">
                    {TASKS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setTask(t.value)}
                            className={`py-2 px-3 rounded-lg text-xs transition-all text-left border ${task === t.value
                                ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                }`}
                        >
                            <div className="font-bold">{t.label}</div>
                            <div className={`text-[10px] ${task === t.value ? 'text-indigo-100' : 'text-zinc-500'}`}>
                                {t.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Preset Examples */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Quick Examples</label>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_EXAMPLES.map((preset, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => loadPreset(preset)}
                                className="px-3 py-2 rounded-lg text-xs font-medium transition-all border bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-left"
                            >
                                <div className="font-bold">{preset.label}</div>
                                <div className="text-[10px] text-zinc-500 mt-0.5">
                                    {preset.fileType.toUpperCase()} • {preset.task}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleProcess} className="mb-8 space-y-4">
                    {/* File Content */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center justify-between">
                            <span>File Content ({selectedFileType.label})</span>
                            <button
                                type="button"
                                onClick={() => setFileContent(SAMPLE_FILES[fileType])}
                                className="text-indigo-600 hover:text-indigo-700 text-[10px] normal-case flex items-center gap-1"
                            >
                                <Upload className="w-3 h-3" />
                                Load Sample
                            </button>
                        </label>
                        <textarea
                            value={fileContent || ''}
                            onChange={(e) => setFileContent(e.target.value)}
                            className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none h-48 leading-relaxed"
                            disabled={loading}
                            placeholder={`Paste your ${selectedFileType.label} content here...`}
                        />
                    </div>

                    {/* Custom Instruction (for Transform task) */}
                    {task === 'transform' && (
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                Transformation Instructions
                            </label>
                            <input
                                type="text"
                                value={customInstruction}
                                onChange={(e) => setCustomInstruction(e.target.value)}
                                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                placeholder="e.g., Convert to Markdown table, Extract emails only, etc."
                                disabled={loading}
                            />
                        </div>
                    )}

                    <button
                        disabled={loading || !fileContent?.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {loading ? 'Processing...' : `Process File`}
                    </button>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Metadata Card */}
                            {result.metadata && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                                    <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-3 h-3" /> Processing Metadata
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                            <div className="text-zinc-500 text-[10px]">File Type</div>
                                            <div className="font-bold text-indigo-700 dark:text-indigo-400 uppercase">{result.metadata.fileType}</div>
                                        </div>
                                        <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                            <div className="text-zinc-500 text-[10px]">Task</div>
                                            <div className="font-bold text-indigo-700 dark:text-indigo-400 capitalize">{result.metadata.task}</div>
                                        </div>
                                        {result.metadata.recordCount !== undefined && (
                                            <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                                <div className="text-zinc-500 text-[10px]">Records</div>
                                                <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.metadata.recordCount}</div>
                                            </div>
                                        )}
                                        {result.metadata.processingTime !== undefined && (
                                            <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                                <div className="text-zinc-500 text-[10px]">Processing Time</div>
                                                <div className="font-bold text-indigo-700 dark:text-indigo-400">{result.metadata.processingTime}ms</div>
                                            </div>
                                        )}
                                        {result.metadata.keyFields && (
                                            <div className="col-span-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                                <div className="text-zinc-500 text-[10px] mb-1">Key Fields</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {result.metadata.keyFields.map((field, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-[10px] font-mono">
                                                            {field}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Result Card */}
                            <div className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-lg p-6 relative ${result.success
                                ? 'border-emerald-200 dark:border-emerald-800'
                                : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'
                                    }`} />
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        {result.success ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                        Processing Result
                                    </h4>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(result.result)}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <Download className="w-3 h-3" />
                                        Copy
                                    </button>
                                </div>
                                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 max-h-96 overflow-y-auto">
                                    {result.result || result.error}
                                </div>
                            </div>

                            {/* Workflow Diagram */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    File Processing Agent Workflow
                                </h4>

                                <div className="space-y-4 mb-6">
                                    <div className="flex flex-col items-center gap-2 text-xs font-mono">
                                        <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">File Upload ({result.metadata?.fileType?.toUpperCase()})</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                        <div className="relative p-3 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 w-full max-w-md">
                                            <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-purple-600 border border-purple-200 rounded font-bold">Parser Agent</div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <Database className="w-3 h-3 text-purple-500" />
                                                    <span className="text-purple-600 dark:text-purple-400 text-[10px]">Format Detection & Parsing</span>
                                                </div>
                                                {result.metadata?.recordCount !== undefined && (
                                                    <div className="text-center text-[9px] text-purple-500">
                                                        ✓ Parsed {result.metadata.recordCount} records
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                        <div className="relative p-3 border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 w-full max-w-md">
                                            <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-blue-600 border border-blue-200 rounded font-bold">Task Router</div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                                    <span className="text-blue-600 dark:text-blue-400 text-[10px]">Task: {result.metadata?.task}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                        <div className="relative p-3 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 w-full max-w-md">
                                            <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-indigo-600 border border-indigo-200 rounded font-bold">LLM Processing</div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <Brain className="w-3 h-3 text-indigo-500" />
                                                    <span className="text-indigo-600 dark:text-indigo-400 text-[10px]">AI Analysis & Generation</span>
                                                </div>
                                                {result.metadata?.processingTime && (
                                                    <div className="text-center text-[9px] text-indigo-500">
                                                        ⚡ {result.metadata.processingTime}ms
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 font-bold">Structured Result</span>
                                    </div>
                                </div>

                                {/* Agent Components */}
                                <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl">
                                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Agent Components</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Format Parser</div>
                                            <div className="text-[9px] text-zinc-500">Detects & parses file structure</div>
                                        </div>
                                        <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Task Executor</div>
                                            <div className="text-[9px] text-zinc-500">Routes to appropriate processor</div>
                                        </div>
                                        <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Result Formatter</div>
                                            <div className="text-[9px] text-zinc-500">Structures final output</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
