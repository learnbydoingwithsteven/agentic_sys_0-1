import React from 'react';
import { ExtractionLab } from '@/components/demos/course_008_data_extraction/ExtractionLab';
import { Database, FileText, Code, CheckCircle, XCircle } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 1.8</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Data Extraction
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Turning chaos into order. Converting unstructured text (emails, logs, reports) into queryable JSON databases.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> structural Alchemy
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200/80 mb-4 leading-relaxed">
                Most of the world's data is trapped in paragraphs. Agents use <strong>Schema Injection</strong> to "read" a paragraph and "write" a database row, handling variations that would break traditional code.
              </p>
            </div>
          </section>

          <section id="comparison" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Regex vs Agentic Extraction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
                <h3 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-4">
                  <XCircle className="w-5 h-5" /> Traditional Regex
                </h3>
                <div className="space-y-4 text-sm text-red-800 dark:text-red-300">
                  <div className="bg-white dark:bg-black/20 p-3 rounded font-mono text-xs">
                    const regex = /Invoice #(\d+)/
                  </div>
                  <p><strong>Fragile:</strong> Fails if the user writes "Inv Number:" instead of "Invoice #".</p>
                  <p><strong>Rigid:</strong> Cannot handle typos or implicit data ("Next Tuesday").</p>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                <h3 className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                  <CheckCircle className="w-5 h-5" /> Agentic Extraction
                </h3>
                <div className="space-y-4 text-sm text-emerald-800 dark:text-emerald-300">
                  <div className="bg-white dark:bg-black/20 p-3 rounded font-mono text-xs">
                    Prompt: "Extract &#123; invoice_id &#125;"
                  </div>
                  <p><strong>Robust:</strong> Understands context. "Bill 505" is recognized as an ID.</p>
                  <p><strong>Smart:</strong> Converts "Next Friday" to "2024-10-27" automatically.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Mechanism: Schema Injection
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                The secret sauce is providing the LLM with a <strong>Type Definition</strong> (TypeScript or JSON Schema) in the system prompt. This constrains the infinite creativity of the model into a strict data shape.
              </p>
              <div className="bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-700/50 rounded-lg p-6 font-mono text-xs text-zinc-600 dark:text-zinc-300 flex flex-col gap-2">
                <span className="text-purple-500">interface User &#123;</span>
                <span className="pl-4">name: <span className="text-blue-500">string</span>;</span>
                <span className="pl-4">role: <span className="text-green-500">"admin" | "user"</span>; // Enum constraint</span>
                <span className="pl-4">age: <span className="text-blue-500">number</span>;</span>
                <span className="text-purple-500">&#125;</span>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ExtractionLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
