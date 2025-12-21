import React from 'react';
import { FileProcessingLab } from '@/components/demos/course_018_file_processing/FileProcessingLab';
import { FileText, Database, Layers, Zap, Code } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 2.8</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              File Processing Agent
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              From raw data to insights. Learn how agents parse, analyze, and transform various file formats (CSV, JSON, PDF, TXT) into actionable intelligence.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> The Data Processing Pipeline
              </h4>
              <div className="text-indigo-800 dark:text-indigo-200/80 mb-4 leading-relaxed">
                Modern applications deal with data in many formats: spreadsheets (CSV), APIs (JSON), documents (PDF), and plain text. A file processing agent can:
                <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                  <li><strong>Parse</strong>: Understand the structure of different file formats</li>
                  <li><strong>Extract</strong>: Pull out key information (entities, dates, numbers)</li>
                  <li><strong>Analyze</strong>: Find patterns, trends, and anomalies</li>
                  <li><strong>Transform</strong>: Convert data to different formats or structures</li>
                </ol>
              </div>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Format-Specific Processing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" /> Structured Data (CSV/JSON)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  For tabular data, the agent parses headers and rows, identifies data types, and can perform aggregations, filtering, and statistical analysis.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" /> Unstructured Text (TXT/PDF)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  For documents, the agent extracts text, identifies key entities (people, places, dates), and can summarize or answer questions about the content.
                </p>
              </div>
            </div>
          </section>

          <section id="tasks" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Processing Tasks
            </h2>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                The agent supports four core processing tasks:
              </p>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Summarize</strong>: Condense large files into concise overviews, highlighting key points and patterns.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Extract</strong>: Pull out specific information like names, dates, numbers, or custom entities.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Analyze</strong>: Identify trends, anomalies, correlations, and provide data-driven insights.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Transform</strong>: Convert data to different formats (e.g., CSV to Markdown table, JSON to XML).
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section id="production" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">03</span>
              Production Considerations
            </h2>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                <strong>Note:</strong> This demo uses simplified file parsing for educational purposes. In production systems:
              </p>
              <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    Use specialized libraries: <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">pdf-parse</code> for PDFs, <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">papaparse</code> for CSVs
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    Implement file size limits and streaming for large files
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    Add virus scanning and validation before processing
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    Consider privacy and data retention policies for uploaded files
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <FileProcessingLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
