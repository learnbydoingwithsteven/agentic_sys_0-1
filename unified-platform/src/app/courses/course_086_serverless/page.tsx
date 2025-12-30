import React from 'react';
import { ServerlessLab } from '@/components/demos/course_086_serverless/ServerlessLab';
import { Zap, Snowflake } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 10.4</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
            Agent Serverless Architecture
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Pay per token. Utilize <strong>Scale-to-Zero</strong> patterns (Lambda/Cloud Functions) for ephemeral agents that only exist when needed.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Cold Start vs Warm Start</h2>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Snowflake className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Stop clicking to let the function "Freeze" (Cold Start). Notice the high latency. Keep clicking to keep it "Warm" and fast.</p>
            </div>
          </div>
          <ServerlessLab />
        </section>
      </main>
    </div>
  );
}
