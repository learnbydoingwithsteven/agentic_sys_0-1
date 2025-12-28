import React from 'react';
import { SemanticSearchLab } from '@/components/demos/course_025_semantic_search/SemanticSearchLab';
import {
  Network,
  Map,
  Search,
  ArrowRightLeft
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 3.5</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Semantic Search Agents
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Traditional search matches keywords. Semantic search matches <strong>intent</strong>. By combining Agents with Vector Databases, we build systems that know "where to look" and "what to look for".
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">The Router Architecture</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Map,
                  title: "1. Intent Routing",
                  desc: "The agent first analyzes the user's question. Does it belong to HR? IT? Or just chit-chat?"
                },
                {
                  icon: Search,
                  title: "2. Vector Retrieval",
                  desc: "Instead of searching everything, the agent queries only the relevant 'Database Domain' using embeddings."
                },
                {
                  icon: ArrowRightLeft,
                  title: "3. Synthesis",
                  desc: "The retrieved facts are fed back to the LLM to generate a natural, helpful response."
                }
              ].map((step, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <step.icon className="w-16 h-16" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Multi-Domain Agent</h2>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Search className="w-4 h-4" /></div>
                <p>
                  <strong>Try asking:</strong> "How many vacation days do I get?" (should route to HR) vs "What is the WiFi password?" (should route to IT).
                </p>
              </div>
            </div>

            <SemanticSearchLab />
          </section>

        </main>
      </div>
    </div>
  );
}
