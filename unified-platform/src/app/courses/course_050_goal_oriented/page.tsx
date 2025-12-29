import React from 'react';
import { GoalLab } from '@/components/demos/course_050_goal_oriented/GoalLab';
import { Target, ListTree } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase mb-3">Module 6.10</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
            Goal-Oriented Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            From "Do this" to "Achieve this". Agents that can recursively decompose high-level goals into actionable sub-tasks.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Goal Decomposition</h2>
            <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-xl text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><ListTree className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Give the agent a massive life goal (e.g. "Become an Astronaut"). Watch it break it down into manageable chunks.</p>
            </div>
          </div>
          <GoalLab />
        </section>
      </main>
    </div>
  );
}
