import React from 'react';
import { FaultToleranceLab } from '@/components/demos/course_075_fault_tolerance/FaultToleranceLab';
import { ShieldAlert, ZapOff } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-red-600 dark:text-red-400 uppercase mb-3">Module 8.3</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
            Agent Fault Tolerance
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Expect failure. Implement <strong>Circuit Breakers</strong> and Retry logic to prevent cascading failures when your LLM provider creates errors.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Breaker</h2>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><ZapOff className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> The API fails 70% of the time. Send requests until the Circuit Breaker "Trips" (Opens) to protect the system. Then Reset it.</p>
            </div>
          </div>
          <FaultToleranceLab />
        </section>
      </main>
    </div>
  );
}
