import React from 'react';
import { MoeLab } from '@/components/demos/course_092_mixture_experts/MoeLab';
import { GitBranch, Layers } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 11.5</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Agent Mixture of Experts (MoE)
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Specialists beat Generalists. Build a <strong>Router (Gating Network)</strong> that intelligently forwards queries to small, specialized Expert Agents.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Router</h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><GitBranch className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Type different queries (Math, Code, Chat). Watch the Router "Flick" the request ball into the correct Expert Bucket.</p>
            </div>
          </div>
          <MoeLab />
        </section>
      </main>
    </div>
  );
}
