import React from 'react';
import { ErrorHandlingLab } from '@/components/demos/course_014_error_handling/ErrorHandlingLab';
import { Shield, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase mb-3">Module 2.4</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Error Handling & Recovery
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Agents in the wild are fragile. APIs fail, context limits are reached, and outputs are malformed. Learn to build agents that <strong>self-heal</strong>.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-rose-900 dark:text-rose-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> The "Fragile Agent" Problem
              </h4>
              <p className="text-rose-800 dark:text-rose-200/80 mb-4 leading-relaxed">
                A standard script crashes on the first error. An <strong>Agentic System</strong> expects failure. It implements exponential backoff, retries, and fallback strategies to ensure reliability even when the underlying models or tools are unstable.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Recovery Strategies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-amber-500" /> Exponential Backoff
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  If an API call fails, don't retry immediately. Wait 1s, then 2s, then 4s. This prevents overwhelming the system and gives transient errors time to resolve.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" /> Graceful Fallbacks
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  If all retries fail, return a safe, pre-written response or a cached value instead of crashing the entire application.
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ErrorHandlingLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
