import React from 'react';
import { SummarizationLab  } from '@/components/demos/course_009_summarization/SummarizationLab';
import { Scissors, FileText, Minimize2 } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-yellow-600 dark:text-yellow-400 uppercase mb-3">Module 1.9</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Summarization
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Distilling knowledge. Teach agents to compress vast amounts of information into concise insights.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
                <Minimize2 className="w-5 h-5 text-yellow-600" /> The Art of Compression
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200/80 mb-4 leading-relaxed">
                In an age of information overload, summarization is a superpower. Agents use it to process long documents, generate meeting notes, or create daily briefings.
              </p>
            </div>
          </section>

          <section id="extractive" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm">01</span>
              Extractive Summarization
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Selecting key sentences from the original text verbatim. Like using a highlighter.
              </p>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg font-mono text-xs">
                <span className="bg-yellow-200 dark:bg-yellow-900/50 text-zinc-900 dark:text-zinc-100 px-1 rounded">The quick brown fox jumps over the lazy dog.</span> It was a sunny day. <span className="bg-yellow-200 dark:bg-yellow-900/50 text-zinc-900 dark:text-zinc-100 px-1 rounded">The dog did not react.</span>
              </div>
            </div>
          </section>

          <section id="abstractive" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm">02</span>
              Abstractive Summarization
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Generates new sentences to capture the essence. This is what LLMs excel at — understanding meaning and rewriting it.
              </p>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg font-mono text-xs italic text-zinc-600 dark:text-zinc-400">
                &quot;A fox jumped over a sleeping dog on a sunny day.&quot;
              </div>
            </div>
          </section>

          <section id="length" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 text-sm">03</span>
              Controlling Length
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <LengthCard title="One Sentence" desc="The ultra-concise TL;DR." />
              <LengthCard title="Paragraph" desc="Balanced overview of main points." />
              <LengthCard title="Bullet Points" desc="Structured list for quick scanning." />
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

function LengthCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug">{desc}</p>
    </div>
  );
}
