import React from 'react';
import { ChunkingLab } from '@/components/demos/course_024_document_chunking/ChunkingLab';
import {
  Scissors,
  Layers,
  FileText,
  Maximize,
  BrainCircuit
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-pink-600 dark:text-pink-400 uppercase mb-3">Module 3.4</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Document Chunking Strategies
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Before an AI can understand a book, it must read the pages. Chunking is the art of splitting large documents into semantically meaningful pieces that fit into context windows.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold">Why Chunking Matters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Maximize,
                  title: "Context Limits",
                  desc: "LLMs have a fixed memory limit (e.g., 8k tokens). We can't feed a whole manual at once."
                },
                {
                  icon: Layers,
                  title: "Semantic Coherence",
                  desc: "Good chunks keep related ideas together. Bad chunks split sentences in half, confusing the AI."
                },
                {
                  icon: Scissors,
                  title: "Retrieval Precision",
                  desc: "Smaller chunks mean more precise search results. You find the 'paragraph', not the 'chapter'."
                }
              ].map((step, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-pink-300 dark:hover:border-pink-700 transition-colors">
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
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Visualizer</h2>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800 rounded-xl text-sm text-pink-800 dark:text-pink-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Layers className="w-4 h-4" /></div>
                <p>
                  <strong>The Overlap Trick:</strong> Notice how the end of Chunk 1 repeats at the start of Chunk 2? This is critical. It ensures that if a sentence like <em>"The password is 1234"</em> gets cut, the full phrase exists in at least one chunk.
                </p>
              </div>
            </div>

            <ChunkingLab />
          </section>

        </main>
      </div>
    </div>
  );
}
