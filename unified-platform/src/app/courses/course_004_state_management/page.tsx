import React from 'react';
import { StateLab } from '@/components/demos/course_004_state_management/StateLab';
import { Database, HardDrive, Cpu, Archive, List, Layers, Shield } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">


      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 1.4</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent State Management
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Giving your agents a memory. Learn how to store, retrieve, and manage context across conversations and sessions.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" /> Why State Matters?
              </h4>
              <p className="text-blue-800 dark:text-blue-200/80 mb-4 leading-relaxed">
                Most LLMs are stateless by default—they don't remember previous queries. To build coherent agents, we must simulate memory by externally storing and reinforcing context.
              </p>
            </div>
          </section>


          <section id="types" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm">01</span>
              Memory Strategies
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <ConceptCard
                icon={<Cpu className="text-gray-500" />}
                title="Stateless (No Memory)"
                desc="The model sees only the latest message. It forgets everything immediately. Good for one-off tasks."
              />
              <ConceptCard
                icon={<Database className="text-blue-500" />}
                title="Buffer Memory"
                desc="Stores the entire conversation history. Simplest approach, but quickly hits token limits."
              />
              <ConceptCard
                icon={<List className="text-purple-500" />}
                title="Sliding Window"
                desc="Keeps only the last N messages (e.g., last 2). Efficient, but loses older context."
              />
              <ConceptCard
                icon={<Archive className="text-orange-500" />}
                title="Summary Memory"
                desc="Uses an LLM to periodically summarize older messages, keeping the 'gist' while saving tokens."
              />
            </div>
          </section>

          <section id="vector" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm">02</span>
              Vector Memory (RAG)
            </h2>

            <div className="space-y-6">
              <PatternCard title="Embeddings" badge="Concept">
                Converting text into numerical vectors (arrays of floats) that represent semantic meaning.
              </PatternCard>
              <PatternCard title="Similarity Search" badge="Mechanism">
                Finding memories that are 'close' to the current query in vector space, rather than exact keyword matches.
              </PatternCard>
            </div>
          </section>

          <section id="practices" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm">03</span>
              Best Practices
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-6">
              <ul className="space-y-4">
                <PracticeItem text="Summarize old history to save tokens." />
                <PracticeItem text="Use metadata filtering (e.g., 'user_id') in vector search." />
                <PracticeItem text="Never store PII (Personally Identifiable Information) in plain text." />
              </ul>
            </div>
          </section>
        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <StateLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ConceptCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 w-fit">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function PatternCard({ title, badge, children }: { title: string, badge: string, children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">
        <Layers className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-indigo-600 border border-indigo-200 dark:border-indigo-800 uppercase tracking-widest">{badge}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
      </div>
    </div>
  );
}

function PracticeItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{text}</span>
    </li>
  );
}
