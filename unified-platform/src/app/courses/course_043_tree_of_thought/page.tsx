import React from 'react';
import { TotLab } from '@/components/demos/course_043_tree_of_thought/TotLab';
import { GitBranch, GitMerge, BrainCircuit } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 6.3</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Tree-of-Thought
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Don't just take the first idea. Explore multiple futures, evaluate them, and backtrack if necessary.
          </p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold">Search Algorithms for Thought</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-lg mb-2">Expansion</h3>
              <p className="text-sm text-zinc-500">Generating k=3 possible next steps instead of just 1.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-lg mb-2">Evaluation</h3>
              <p className="text-sm text-zinc-500">Scoring each branch to decide which one to prune.</p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Story Mapper</h2>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><GitMerge className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Generate a story about "Aliens". The agent will propose 3 intros, pick the best, and continue valid paths.</p>
            </div>
          </div>
          <TotLab />
        </section>
      </main>
    </div>
  );
}
