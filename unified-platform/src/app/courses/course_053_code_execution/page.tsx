import React from 'react';
import { CodeLab } from '@/components/demos/course_053_code_execution/CodeLab';
import { Terminal, ShieldCheck } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 6.13</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            Code Execution Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            LLMs aren't calculators. They're coders. Give them a **Sandbox** to write and run Python for 100% mathematical accuracy.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The REPL</h2>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Terminal className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Ask for "Fibonacci sequence" or "Calculate 123 * 456". The agent writes syntax-highlighted Python and "executes" it.</p>
            </div>
          </div>
          <CodeLab />
        </section>
      </main>
    </div>
  );
}
