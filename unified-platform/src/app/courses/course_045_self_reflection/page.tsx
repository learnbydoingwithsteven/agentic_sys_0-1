import React from 'react';
import { ReflectionLab } from '@/components/demos/course_045_self_reflection/ReflectionLab';
import { Sparkles, MessageCircle } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 5.5</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Self-Reflection Agent
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Quality over speed. Implement the <strong>Reflexion</strong> pattern, where an agent critiques its own past attempts to iteratively improve content quality.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Writer's Room</h2>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><MessageCircle className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Ask the agent to "Describe the sky". Watch it write a bad first draft, realize it's bad, and rewrite it until it achieves a perfect score.</p>
            </div>
          </div>
          <ReflectionLab />
        </section>
      </main>
    </div>
  );
}
