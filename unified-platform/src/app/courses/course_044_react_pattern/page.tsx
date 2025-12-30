import React from 'react';
import { ReActTimeline } from '@/components/demos/course_044_react_pattern/ReActTimeline';
import { BrainCircuit, BookOpen } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 5.4</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            ReAct Agent Pattern
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Reasoning + Acting. The <strong>ReAct</strong> pattern enables agents to solve complex problems by iterating through a loop of Thought, Action, and Observation.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Steps of Reasoning</h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><BrainCircuit className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Ask "What is the age of the US President?". Watch the agent breakdown the task: Search President &rarr; Get Name &rarr; Search Birthday &rarr; Calculate Age.</p>
            </div>
          </div>
          <ReActTimeline />
        </section>
      </main>
    </div>
  );
}
