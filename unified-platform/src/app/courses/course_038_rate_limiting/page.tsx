import React from 'react';
import { RateLimitLab } from '@/components/demos/course_038_rate_limiting/RateLimitLab';
import {
  ShieldAlert,
  Hourglass,
  Coins,
  Activity
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-red-600 dark:text-red-400 uppercase mb-3">Module 5.5</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Agent Rate Limiting
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Protect your agents and wallet. Implement a <strong>Token Bucket</strong> algorithm to throttle excessive requests while allowing bursts.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">The Token Bucket Algorithm</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Coins className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Capacity</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  The bucket holds a max of <strong>5 tokens</strong>. This allows for short "bursts" of activity.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Hourglass className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Refill Rate</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Tokens are added back slowly (e.g., <strong>1 per 2 seconds</strong>). This sets the long-term throughput limit.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Consumption</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every API call costs <strong>1 token</strong>. If the bucket is empty, the request is rejected (429).
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Drain the Bucket</h2>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Activity className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong> Quickly click "Send Request" 6 times. <br />
                  Notice how the first 5 succeed (bucket drain), but the 6th fails. <br />
                  Wait a few seconds, and watch the bucket refill.
                </p>
              </div>
            </div>

            <RateLimitLab />
          </section>

        </main>
      </div>
    </div>
  );
}
