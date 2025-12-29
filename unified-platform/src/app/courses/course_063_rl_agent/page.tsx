import React from 'react';
import { RLLab } from '@/components/demos/course_063_rl_agent/RLLab';
import { Gamepad2, Brain } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-green-600 dark:text-green-400 uppercase mb-3">Module 7.3</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Reinforcement Learning Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Agents that learn by moving. Using <strong>Rewards and Penalties</strong>, train an agent to navigate a Grid World without explicit movement code.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Grid</h2>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Gamepad2 className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Reach the Trophy (4,4) while avoiding the Skull (2,2). The agent (Policy) has already been trained to avoid danger.</p>
            </div>
          </div>
          <RLLab />
        </section>
      </main>
    </div>
  );
}
