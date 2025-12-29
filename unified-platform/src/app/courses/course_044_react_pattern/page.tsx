import React from 'react';
import { ReActLab } from '@/components/demos/course_044_react_pattern/ReActLab';
import { Hammer, Brain, Eye } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-3">Module 6.4</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
            ReAct Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            <strong>REA</strong>soning + <strong>ACT</strong>ing. The fundamental loop that enables agents to use Tools.
          </p>
        </header>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center">
              <Brain className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Thought</h3>
              <p className="text-sm text-zinc-500">"I need to calculate X..."</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center bg-sky-50 dark:bg-sky-900/10 border-sky-200">
              <Hammer className="w-8 h-8 text-sky-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Action</h3>
              <p className="text-sm text-zinc-500">Executes `calc(5 * 5)`</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center">
              <Eye className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Observation</h3>
              <p className="text-sm text-zinc-500">"Result is 25"</p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Loop</h2>
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 rounded-xl text-sm text-sky-800 dark:text-sky-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Hammer className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Ask "How old is Einstein?". Watch the agent figure out it needs to look up the birth year, current year, and perform subtraction.</p>
            </div>
          </div>
          <ReActLab />
        </section>
      </main>
    </div>
  );
}
