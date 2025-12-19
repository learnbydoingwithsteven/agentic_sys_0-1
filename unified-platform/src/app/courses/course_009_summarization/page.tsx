import React from 'react';
import { SummarizationLab } from '@/components/demos/course_009_summarization/SummarizationLab';
import { FileText, AlignLeft, List, Zap, Filter } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 1.9</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Summarization
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Distilling knowledge. Controlling the compression rate and dimensionality of information.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" /> Information Compression
              </h4>
              <p className="text-indigo-800 dark:text-indigo-200/80 mb-4 leading-relaxed">
                Summarization isn't just "making things shorter." It's about selecting the most salient features of a text while discarding noise. Agents can be tuned to different <strong>compression ratios</strong> and <strong>styles</strong>.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Controllable Output
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" /> Paragraph Mode
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Best for narratives or executive summaries where flow matters. The model weaves facts into a cohesive story.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <List className="w-4 h-4" /> Bullet Mode
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Best for quick scanning. The model isolates distinct facts and presents them as atomic units.
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <SummarizationLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
