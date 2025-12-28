import React from 'react';
import { CachingLab } from '@/components/demos/course_037_caching/CachingLab';
import {
  Database,
  Zap,
  Search,
  Repeat
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 5.4</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Agent Caching Strategies
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Don't pay for the same answer twice. Use <strong>Semantic Caching</strong> to instantly serve results for similar queries, saving time and money.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold">Semantic vs Exact Cache</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Repeat className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Exact Match (Traditional)</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                  Only hits if the string is identical. <br />
                  <em>"Capital of France" != "What is the capital?"</em>
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 ring-1 ring-orange-500/20 shadow-sm relative overflow-hidden bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Semantic Match (Agentic)</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                  Hits if the <strong>intent</strong> is the same. <br />
                  <em>"Capital of France" ≈ "What's the capital of France?"</em>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Warm the Cache</h2>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Search className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>Click <em>"What is the capital of France?"</em> (Wait ~2s for "Thinking").</li>
                    <li>Click <em>"Capital of France?"</em> (Instant HIT).</li>
                    <li>Observe the 95%+ Similarity score.</li>
                  </ol>
                </p>
              </div>
            </div>

            <CachingLab />
          </section>

        </main>
      </div>
    </div>
  );
}
