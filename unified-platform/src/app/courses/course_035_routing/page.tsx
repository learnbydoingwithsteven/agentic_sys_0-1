import React from 'react';
import { RouterLab } from '@/components/demos/course_035_routing/RouterLab';
import {
  GitMerge,
  Zap,
  Brain,
  Layers,
  Search
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 5.2</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Semantic Routing
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Not every decision needs an LLM. Use <strong>Vector Embeddings</strong> to route user intent instantly. It's 10x faster and 100x cheaper than generative routing.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">Two Types of Routing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Generative (Slow & Smart)</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                  Asking an LLM: <em>"Analyze this query and pick a tool."</em>
                </p>
                <ul className="text-xs text-zinc-500 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-400" /> Latency: ~1-3s</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-400" /> Best for: Complex, ambiguous tasks.</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/20 shadow-sm relative overflow-hidden bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Semantic (Fast & Cheap)</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                  Comparing vectors: <em>"Is this close to 'I want a refund'?"</em>
                </p>
                <ul className="text-xs text-zinc-500 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-400" /> Latency: ~100ms</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-400" /> Best for: Defined categories (Support, FAQ).</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Router</h2>
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Search className="w-4 h-4 text-indigo-500" /></div>
                <p>
                  <strong>Experiment:</strong> Try phrases like <em>"I want my money back"</em> (matches Refund) vs <em>"The app is stuck"</em> (matches Tech Support). <br />
                  Notice the <strong>confidence scores</strong>. If you say <em>"What is the weather?"</em>, see if it falls back to low confidence.
                </p>
              </div>
            </div>

            <RouterLab />
          </section>

        </main>
      </div>
    </div>
  );
}
