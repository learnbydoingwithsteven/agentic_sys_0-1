import React from 'react';
import { ABTestingLab } from '@/components/demos/course_059_ab_testing/ABTestingLab';
import { Split, ThumbsUp } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-fuchsia-600 dark:text-fuchsia-400 uppercase mb-3">Module 6.19</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
            Agent A/B Testing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Don't guess which prompt is better. Prove it. Serve two variants of an agent and use human feedback to pick the winner.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Head-to-Head</h2>
            <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-900/10 border border-fuchsia-100 dark:border-fuchsia-800 rounded-xl text-sm text-fuchsia-800 dark:text-fuchsia-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Split className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Compare a "Concise" model vs a "Friendly" model. Send the same prompt to both and vote for your favorite.</p>
            </div>
          </div>
          <ABTestingLab />
        </section>
      </main>
    </div>
  );
}
