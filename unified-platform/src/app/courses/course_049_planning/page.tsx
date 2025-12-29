import React from 'react';
import { PlanningLab } from '@/components/demos/course_049_planning/PlanningLab';
import { Calendar, List } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-3">Module 6.9</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
            Agent Planning & Scheduling
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Agents that "wing it" fail at complex tasks. Give them the ability to <strong>Plan</strong> first, then execute.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Project Manager</h2>
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 rounded-xl text-sm text-sky-800 dark:text-sky-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Calendar className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Generate a plan for a complex task (e.g. "Launch a product"). Then execute the plan step-by-step.</p>
            </div>
          </div>
          <PlanningLab />
        </section>
      </main>
    </div>
  );
}
