import React from 'react';
import { MultiModalLab } from '@/components/demos/course_067_multi_modal/MultiModalLab';
import { Eye, Image as ImageIcon } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3">Module 7.7</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            Multi-Modal Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Agents with Eyes. Integrate <strong>Vision Models (VLM)</strong> to allow your agents to "see" charts, reading screenshots, and analyze photos.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Visionary</h2>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl text-sm text-teal-800 dark:text-teal-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Eye className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Select a 'Business Chart' or 'Cat Photo'. The agent will scan the pixels and produce a descriptive text analysis.</p>
            </div>
          </div>
          <MultiModalLab />
        </section>
      </main>
    </div>
  );
}
