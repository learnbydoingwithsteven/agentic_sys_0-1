import React from 'react';
import { WorldModelLab } from '@/components/demos/course_096_world_models/WorldModelLab';
import { Globe, ArrowUpRight } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-green-600 dark:text-green-400 uppercase mb-3">Module 12.3</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Agent World Models
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Model-Based RL. Give your agents an <strong>Internal Simulator</strong> so they can "Dream" about future actions and predict consequences before acting in the real world.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Dreamer</h2>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Globe className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Navigate the maze. Before moving, use the simulator to project a "Ghost" agent into the future to verify if a move leads to a crash or a clear path.</p>
            </div>
          </div>
          <WorldModelLab />
        </section>
      </main>
    </div>
  );
}
