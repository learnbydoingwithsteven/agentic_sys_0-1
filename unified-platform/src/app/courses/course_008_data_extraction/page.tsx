import React from 'react';
import { ExtractionLab  } from '@/components/demos/course_008_data_extraction/ExtractionLab';
import { FileJson, Database, ShieldCheck } from 'lucide-react';

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
              Turning chaos into order. Learn how to parse unstructured text into structured formats like JSON.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-600" /> From Text to JSON
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200/80 mb-4 leading-relaxed">
                The internet is built on unstructured text. Agents bridge the gap between human language and machine databases by robustly extracting fields, dates, and entities.
              </p>
            </div>
          </section>

          <section id="json" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm">01</span>
              JSON Mode
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Modern LLMs (like Ollama's Llama3) support <strong>JSON Mode</strong> to guarantee valid syntax. This is critical for connecting agents to APIs.
              </p>
              <div className="bg-zinc-900 text-zinc-300 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                <span className="text-zinc-500">Currently extracting...</span><br />
                &#123;<br />
                &nbsp;&nbsp;&quot;user&quot;: &quot;Alice&quot;,<br />
                &nbsp;&nbsp;&quot;intent&quot;: &quot;booking&quot;,<br />
                &nbsp;&nbsp;&quot;timestamp&quot;: &quot;2024-01-01&quot;<br />
                &#125;
              </div>
            </div>
          </section>

          <section id="entities" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-sm">02</span>
              Entity Recognition (NER)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <EntityCard label="PER" desc="Person (e.g., Elon Musk)" color="bg-blue-100 text-blue-700" />
              <EntityCard label="ORG" desc="Organization (e.g., Google)" color="bg-purple-100 text-purple-700" />
              <EntityCard label="LOC" desc="Location (e.g., Paris)" color="bg-red-100 text-red-700" />
              <EntityCard label="MISC" desc="Miscellaneous (e.g., iPhone 15)" color="bg-gray-100 text-gray-700" />
            </div>
          </section>

          <section id="schemas" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">03</span>
              Schema Validation
            </h2>
            <div className="flex gap-4 p-6 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
              <ShieldCheck className="w-8 h-8 text-orange-600 shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">Trust, but Verify</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  LLMs can hallucinate keys or formats. Always validate the extracted JSON against a schema (e.g., using Zod) before using it in your application logic.
                </p>
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

function EntityCard({ label, desc, color }: { label: string, desc: string, color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <span className={`font-bold text-xs px-2 py-1 rounded ${color}`}>{label}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</span>
    </div>
  );
}
