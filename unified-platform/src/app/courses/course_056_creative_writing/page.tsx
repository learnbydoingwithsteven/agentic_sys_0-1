import React from 'react';
import { WritingLab } from '@/components/demos/course_056_creative_writing/WritingLab';
import { PenTool, Feather } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 6.16</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Creative Writing Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Style Transfer isn't just for images. Instruct your agents to adopt specific **personas** and writing styles, from Shakespeare to Silicon Valley.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Ghostwriter</h2>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Feather className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Write about "Coffee". Switch styles between <em>Film Noir</em> and <em>Pirate</em>. Notice how the vocabulary shifts completely.</p>
            </div>
          </div>
          <WritingLab />
        </section>
      </main>
    </div>
  );
}
