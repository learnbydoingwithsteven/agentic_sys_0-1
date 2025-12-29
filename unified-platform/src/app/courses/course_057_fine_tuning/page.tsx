import React from 'react';
import { FineTuningLab } from '@/components/demos/course_057_fine_tuning/FineTuningLab';
import { Database, TrendingUp } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3">Module 6.17</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Agent Fine-Tuning
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            When prompting isn't enough, you need **Weights**. Learn how to fine-tune an agent on a specific dataset to permanently alter its behavior.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Training Run</h2>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl text-sm text-teal-800 dark:text-teal-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><TrendingUp className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Train a model on the "Yoda Corpus". Watch the Loss curve drop, then test the model to see it speak in riddles.</p>
            </div>
          </div>
          <FineTuningLab />
        </section>
      </main>
    </div>
  );
}
