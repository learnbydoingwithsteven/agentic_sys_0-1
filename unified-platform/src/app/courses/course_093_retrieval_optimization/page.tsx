import React from 'react';
import { RagAdvLab } from '@/components/demos/course_093_retrieval_optimization/RagAdvLab';
import { Search, ListFilter } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 11.6</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Agent Retrieval Optimization (Rerank)
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Precision matters. Enhance your RAG pipelines by adding a <strong>Cross-Encoder Re-ranker</strong> stage to sort retrieved documents by true semantic relevance.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Reranking Pipeline</h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><ListFilter className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Search for "Red Planet". See how naive search returns "Red Apples" first. Then, watch the Re-ranker fix the order to put "Mars" at the top.</p>
            </div>
          </div>
          <RagAdvLab />
        </section>
      </main>
    </div>
  );
}
