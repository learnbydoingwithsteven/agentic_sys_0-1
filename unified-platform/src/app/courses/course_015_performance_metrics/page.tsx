import React from 'react';
import { PerformanceLab } from '@/components/demos/course_015_performance_metrics/PerformanceLab';
import { Gauge, Zap, TrendingUp } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 2.5</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent Performance Metrics
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Speed, Cost, and Quality. The "Iron Triangle" of AI engineering. Learn to benchmark your agents and make data-driven decisions on model selection.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Beyond "It Feels Fast"
              </h4>
              <p className="text-blue-800 dark:text-blue-200/80 mb-4 leading-relaxed">
                Subjective speed is misleading. In this module, we build a rigorous <strong>Benchmark Suite</strong> to measure:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li><strong>Tokens Per Second (TPS)</strong>: The raw throughput of your inference engine.</li>
                  <li><strong>Latency</strong>: The total round-trip time for a request.</li>
                  <li><strong>Cost Efficiency</strong>: Comparing local compute vs. cloud API pricing.</li>
                </ul>
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Key Metrics Explained
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Throughput (TPS)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The "Horsepower" of your model. Human reading speed is ~5-10 TPS. If your agent is slower than 10 TPS, it feels "laggy" to read in real-time.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-500" /> Latency
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The "Reaction Time". High latency makes chat feel unresponsive. It is affected by model size, prompt length, and hardware memory bandwidth.
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <PerformanceLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
