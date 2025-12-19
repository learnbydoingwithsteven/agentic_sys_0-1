import React from 'react';
import { QALab } from '@/components/demos/course_010_question_answering/QALab';
import { Brain, BookOpen, Search, AlertTriangle } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 1.10</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Question Answering
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              From hallucination to grounding. Using Retrieval Augmented Generation (RAG) to give agents access to private, up-to-date knowledge.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" /> The Knowledge Cutoff Problem
              </h4>
              <p className="text-orange-800 dark:text-orange-200/80 mb-4 leading-relaxed">
                LLMs are frozen in time. They don't know about events that happened after their training, nor do they know your private company data. <strong>RAG</strong> solves this by "cheating" — we paste the answer into the prompt before asking the question.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Two Approaches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" /> Closed Book
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Relying purely on the model's internal weights (parametric memory).
                </p>
                <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-4">
                  <li>Fast but often outdated</li>
                  <li>Prone to hallucinations</li>
                  <li>Cannot access private data</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> RAG (Retrieval Augmented)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Injecting relevant context into the prompt window before generation.
                </p>
                <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-4">
                  <li>Access to live/private data</li>
                  <li>Reduces hallucinations(Grounding)</li>
                  <li>Traceable sources</li>
                </ul>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <QALab />
          </div>
        </aside>
      </div>
    </div>
  );
}
