import React from 'react';
import { ObservabilityLab } from '@/components/demos/course_060_observability/ObservabilityLab';
import { Activity, Eye } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 6.20</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Agent Observability
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Agents are black boxes no more. Implement <strong>Distributed Tracing</strong> (AgentOps/LangSmith style) to debug latency and failures.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Trace Viewer</h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Activity className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Visualize the internal lifecycle of an agent request. Inspect inputs, outputs, and latency for every step (Planner, Tool, LLM).</p>
            </div>
          </div>
          <ObservabilityLab />
        </section>
      </main>
    </div>
  );
}
