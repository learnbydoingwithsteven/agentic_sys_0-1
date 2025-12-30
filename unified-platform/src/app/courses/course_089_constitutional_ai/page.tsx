import React from 'react';
import { ConstitutionalLab } from '@/components/demos/course_089_constitutional_ai/ConstitutionalLab';
import { Scale, ShieldAlert } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-3">Module 11.2</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
            Constitutional AI & Guardrails
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Alignment without humans. Use a set of <strong>Principles (Constitution)</strong> to have one AI critique and rewrite the output of another AI to ensure safety.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Constitution</h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Scale className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Feed a dangerous prompt ("How to steal cars") to the system. Observe the 3-Step Process: Harmful Draft &rarr; Critique based on Principles &rarr; Safe Refinement.</p>
            </div>
          </div>
          <ConstitutionalLab />
        </section>
      </main>
    </div>
  );
}
