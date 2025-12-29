import React from 'react';
import { LearningLab } from '@/components/demos/course_062_continuous_learning/LearningLab';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-yellow-600 dark:text-yellow-400 uppercase mb-3">Module 7.2</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">
            Continuous Learning
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Static models are obsolete. Build agents that <strong>learn from feedback</strong> in real-time, updating their knowledge base instantly.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Teach the AI</h2>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-xl text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><GraduationCap className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> The agent has some wrong facts (e.g. outdated CEOs). Correct it in the chat, and watch it answer correctly next time.</p>
            </div>
          </div>
          <LearningLab />
        </section>
      </main>
    </div>
  );
}
