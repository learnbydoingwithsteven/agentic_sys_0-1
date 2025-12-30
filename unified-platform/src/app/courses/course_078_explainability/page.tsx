import React from 'react';
import { XaiLab } from '@/components/demos/course_078_explainability/XaiLab';
import { Search, FileText } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 9.1</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            Agent Explainability (XAI)
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            "Computer says no" isn't enough. Build agents that provide <strong>Feature Importance</strong> and rationale (Chain-of-Thought) for their decisions.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Why was I denied?</h2>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Search className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Adjust Credit, Income, and Debt sliders. Ask the Loan Agent for a decision and see the "Waterfall Chart" explaining which factors tipped the scale.</p>
            </div>
          </div>
          <XaiLab />
        </section>
      </main>
    </div>
  );
}
