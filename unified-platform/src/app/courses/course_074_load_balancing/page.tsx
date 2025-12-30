import React from 'react';
import { LoadBalancingLab } from '@/components/demos/course_074_load_balancing/LoadBalancingLab';
import { Network, Server } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 8.2</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Agent Load Balancing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Scale horizontally. Distribute heavy LLM workloads across multiple model instances using <strong>Round Robin</strong> or <strong>Least Connection</strong> strategies.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Traffic Slicer</h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Network className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Spam the "Send" button to generate traffic. Watch how the Load Balancer routes requests to keep the server health green.</p>
            </div>
          </div>
          <LoadBalancingLab />
        </section>
      </main>
    </div>
  );
}
