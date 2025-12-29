import React from 'react';
import { ReflectionLab } from '@/components/demos/course_045_self_reflection/ReflectionLab';
import { RefreshCw, UserCheck } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-3">Module 6.5</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Self-Reflection Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Quality over speed. Agents that criticize their own work produce significantly better output than zero-shot generaion.
          </p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold">The Reflexion Pattern</h2>
          </div>
          <p className="max-w-prose text-zinc-500 mb-8">
            Most LLM errors are correctable. By simply asking "Is this correct?" or "How can I improve this?", the model acts as its own editor.
          </p>
        </section>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Editor</h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><RefreshCw className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Ask for a "Polite decline email". See the first draft, read the harsh critique, and witness the polished final version.</p>
            </div>
          </div>
          <ReflectionLab />
        </section>
      </main>
    </div>
  );
}
