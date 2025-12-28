import React from 'react';
import { StreamingLab } from '@/components/demos/course_036_streaming/StreamingLab';
import {
  Wind,
  Clock,
  Eye,
  Zap
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 5.3</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Streaming Response Agent
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Don't make users wait. Learn how to stream tokens from the LLM to the UI in real-time, reducing perceived latency to milliseconds.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Wind className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold">Why Stream?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Perceived Latency</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Users feel the app is fast if they see the first word in &lt; 500ms, even if the full text takes 10s.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visual Feedback</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  The "cursor" effect confirms the system is working, preventing users from clicking "submit" repeatedly.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Edge Compatible</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Streaming works perfectly with Edge Runtimes and Vercel AI SDK patterns.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Real-Time Stream</h2>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Zap className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong> Ask for a short poem. Watch the "Chunks Received" counter increase in real-time.<br />
                  Note the "Time to First Token" (TTFT) - ideally under 400ms.
                </p>
              </div>
            </div>

            <StreamingLab />
          </section>

        </main>
      </div>
    </div>
  );
}
