import React from 'react';
import { QALab  } from '@/components/demos/course_010_question_answering/QALab';
import { HelpCircle, Database, BookOpen } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-3">Module 2.0</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Question Answering
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Building the Oracle. From closed-book trivia bots to advanced RAG (Retrieval-Augmented Generation) systems.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-sky-900 dark:text-sky-100 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" /> The Search for Truth
              </h4>
              <p className="text-sky-800 dark:text-sky-200/80 mb-4 leading-relaxed">
                Agents function as intelligent interfaces to information. They can answer from their own memory (parametric knowledge) or fetch precise answers from your documents (contextual knowledge).
              </p>
            </div>
          </section>

          <section id="rag" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">01</span>
              Closed-Book vs RAG
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <CompareCard
                title="Closed-Book (Parametric)"
                icon={<BookOpen className="text-purple-500" />}
                desc="Relying solely on training data. Great for general creativity, bad for facts (hallucinations)."
              />
              <CompareCard
                title="RAG (Contextual)"
                icon={<Database className="text-emerald-500" />}
                desc="Retrieving relevant data first, then asking the LLM to answer using ONLY that data. Accurate and grounded."
              />
            </div>
          </section>

          <section id="context" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm">02</span>
              The Context Window
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                LLMs have a limited "short-term memory" (context window). RAG is essential because you can't fit the entire internet (or your whole company wiki) into a single prompt.
              </p>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500 w-1/4" title="System Prompt" />
                <div className="h-full bg-emerald-500 w-1/2" title="Retrieved Context" />
                <div className="h-full bg-sky-500 w-1/4" title="User Question" />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-2 font-mono">
                <span>System</span>
                <span>Retrieved Documents</span>
                <span>Question</span>
              </div>
            </div>
          </section>

          <section id="sources" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm">03</span>
              Citing Sources
            </h2>
            <div className="flex gap-4 p-6 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
              <div className="shrink-0 font-serif text-4xl text-violet-300 pointer-events-none">&ldquo;</div>
              <div>
                <h3 className="font-bold text-violet-900 dark:text-violet-100 mb-2">Transparency is Key</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  A good QA agent doesn&apos;t just answer; it points to where it found the answer. &quot;According to the HR Policy (Page 12)...&quot; builds trust with the user.
                </p>
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

function CompareCard({ title, icon, desc }: { title: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-start gap-4 h-full">
      <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
      </div>
      <div>
        <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">{title}</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
