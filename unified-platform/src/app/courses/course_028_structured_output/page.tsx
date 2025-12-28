import React from 'react';
import { StructureLab } from '@/components/demos/course_028_structured_output/StructureLab';
import {
    FileJson,
    Database,
    ArrowRight,
    ScanText
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 3.8</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                            Structured Extraction
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            Software doesn't understand "Wait a sec, I'll pay you next week". It understands <code>{`{ "payment_status": "pending", "due_date": "2024-01-01" }`}</code>. This module teaches agents to bridge that gap.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <ScanText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold">The ETL Pipeline</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: ScanText,
                                    title: "1. Ingest",
                                    desc: "Raw text from emails, PDFs, transcripts, or OCR. Often messy, unstructured, and full of noise."
                                },
                                {
                                    icon: ArrowRight,
                                    title: "2. Schema Enforcement",
                                    desc: "We force the LLM to map this chaos into a rigid Zod or TypeScript schema (JSON)."
                                },
                                {
                                    icon: Database,
                                    title: "3. Database Ready",
                                    desc: "The output is clean JSON, ready to be saved via API or SQL without further human review."
                                }
                            ].map((step, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <step.icon className="w-16 h-16" />
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <step.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Data Extractor</h2>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><FileJson className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Try the provided samples. Notice how the "Angry" CEO email is converted into a <code>Critical</code> urgency ticket with <code>Angry</code> sentiment. This is sentiment analysis + extraction in one step.
                                </p>
                            </div>
                        </div>

                        <StructureLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
