import React from 'react';
import { DistributedLab } from '@/components/demos/course_084_distributed/DistributedLab';
import { Network, Crown } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">Module 10.2</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            Agent Distributed Systems
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Coordinate chaos. Implement <strong>Raft Consensus</strong> algorithms to elect a "Brain" agent among a cluster of nodes for distributed decision making.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Leader Election</h2>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Crown className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> There can only be one Leader. Kill the current leader and watch the cluster automatically detect the vacuum and vote a new node into power.</p>
            </div>
          </div>
          <DistributedLab />
        </section>
      </main>
    </div>
  );
}
