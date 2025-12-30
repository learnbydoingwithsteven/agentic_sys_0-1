import React from 'react';
import { BiasLab } from '@/components/demos/course_079_bias_detection/BiasLab';
import { Scale, Users } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-3">Module 9.2</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Agent Bias Detection
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Agents inherit the biases of their training data. Implement <strong>Fairness Auditing</strong> tools to detect and mitigate stereotyping in outputs.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Bias Scan</h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Scale className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Run an automated audit on the model. Compare how it describes different demographics and identify potential representational harms.</p>
            </div>
          </div>
          <BiasLab />
        </section>
      </main>
    </div>
  );
}
