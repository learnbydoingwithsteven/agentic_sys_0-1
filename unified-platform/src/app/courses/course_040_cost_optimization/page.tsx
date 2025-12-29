import React from 'react';
import { CostLab } from '@/components/demos/course_040_cost_optimization/CostLab';
import {
  DollarSign,
  Coins,
  TrendingDown,
  Scale
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 5.7</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Agent Cost Optimization
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Scale without bankruptcy. Understand token economics, track usage in real-time, and learn strategies to reduce LLM bills.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold">Token Economics 101</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Coins className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Input vs Output</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Output tokens often cost <strong>2x-3x</strong> more than input tokens. Be concise in generation.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Context Window</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every message in the history is re-sent. Costs grow <strong>linearly</strong> with conversation length.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <TrendingDown className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Reduction Strategies</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Use summarization, truncate history, or use smaller models (like we are using `qwen2.5:1.5b`) for simple tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Taxi Meter</h2>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><DollarSign className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong>
                  <br />1. Say <em>"Hi"</em> (Cheap).
                  <br />2. Say <em>"Write a 500 word essay about the history of cheese."</em> (Expensive).
                  <br />Observe how the <strong>Output Cost</strong> spikes relative to the input.
                </p>
              </div>
            </div>

            <CostLab />
          </section>

        </main>
      </div>
    </div>
  );
}
