import React from 'react';
import { AdvancedRagLab } from '@/components/demos/course_041_advanced_rag/AdvancedRagLab';
import {
  Filter,
  Layers,
  RefreshCw,
  Target
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 6.1</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Advanced RAG & Self-RAG
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Retrieval is just the first step. Use <strong>Reranking</strong> and <strong>Self-Correction</strong> to filter out noise and hallucination before generating an answer.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">The CRAG Pipeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Retrieve</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Fetch top-k documents (e.g., 10) using vector search. This is often noisy and contains irrelevant chunks.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Rerank</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Use a high-precision model (or LLM-as-a-Judge) to score relevance. Filter out scores {'<'} 7.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Correct</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  If no docs remain after filtering, trigger a "Self-Correction" (e.g., web search or asking for clarification).
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Judge the Context</h2>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Filter className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong>
                  <br />Search: <em>"What color is the Golden Gate Bridge?"</em>
                  <br />Notice how documents about "Pizza" and "Python" get filtered out (Score {'<'} 6), leaving only the Bridge facts.
                </p>
              </div>
            </div>

            <AdvancedRagLab />
          </section>

        </main>
      </div>
    </div>
  );
}
