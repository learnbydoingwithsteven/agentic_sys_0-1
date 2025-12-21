import React from 'react';
import { DebuggingLab } from '@/components/demos/course_013_logging_debugging/DebuggingLab';
import { Bug, Search, Terminal, Activity } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">Module 2.3</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent Observability
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Opening the Black Box. How to trace, log, and debug the internal thought processes of AI agents.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-600" /> Why Console.log isn't Enough
              </h4>
              <p className="text-amber-800 dark:text-amber-200/80 mb-4 leading-relaxed">
                Agents are non-deterministic and multi-step. To debug them, you need <strong>Events</strong> (Start, End, Error) and <strong>Latency Tracking</strong> (Time between thoughts). This module introduces a pattern for structured, event-driven logging.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              The Tracing Lifecycle
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" /> Event Capture
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Injecting callbacks into the LLM chain to capture `onLLMStart`, `onChainEnd`, and intermediate steps without cluttering the main logic.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Latency Analysis
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Measuring the time delta between events to identify bottlenecks (e.g., is the LLM slow, or the database retrieval?).
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <DebuggingLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
