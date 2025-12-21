import React from 'react';
import { VectorDBLab } from '@/components/demos/course_022_vector_database/VectorDBLab';
import {
  Database,
  ArrowRightLeft,
  BrainCircuit,
  Search,
  HardDrive,
  Share2,
  FileJson
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 3.2</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Vector Database Integration
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Build a Retrieval-Augmented Generation (RAG) system by connecting your agent to a vector database, giving it long-term memory and access to private knowledge.
            </p>
          </header>

          <section id="vector-db-concept" className="mb-16 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">Why Vector Databases?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="prose prose-zinc dark:prose-invert">
                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Standard databases (SQL) search for exact matches. <strong className="text-indigo-600 dark:text-indigo-400">Vector Databases</strong> search for <em>meaning</em>. By storing the embeddings we learned about in the previous module, we can instantly find the most relevant documents for any query, even if the keywords don't match exactly.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-black p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
                    <Search className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Semantic Retrieval</h4>
                    <p className="text-xs text-zinc-500">Query: "Tech issues" → Finds: "Server outage reports"</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 ml-6" />
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-black p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
                    <HardDrive className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Efficient Storage</h4>
                    <p className="text-xs text-zinc-500">Millions of vectors can be indexed for millisecond-latency search.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="rag-workflow" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              The RAG Architecture
            </h2>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative">

                {/* Step 1 */}
                <div className="flex-1 relative z-10">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 text-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">1. Retrieve</h3>
                  <p className="text-sm text-zinc-500">The user's query is converted to a vector and used to search the database for relevant context.</p>
                </div>

                <ArrowRightLeft className="w-6 h-6 text-zinc-300 rotate-90 md:rotate-0" />

                {/* Step 2 */}
                <div className="flex-1 relative z-10">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">2. Augment</h3>
                  <p className="text-sm text-zinc-500">The retrieved context is injected into the prompt alongside the original question.</p>
                </div>

                <ArrowRightLeft className="w-6 h-6 text-zinc-300 rotate-90 md:rotate-0" />

                {/* Step 3 */}
                <div className="flex-1 relative z-10">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">3. Generate</h3>
                  <p className="text-sm text-zinc-500">The LLM generates an answer using the provided facts, reducing hallucinations.</p>
                </div>

              </div>
            </div>
          </section>

          <footer className="pt-12 border-t border-zinc-100 dark:border-zinc-800">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl flex items-start gap-6">
              <Share2 className="w-8 h-8 text-indigo-500 shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Why this matters</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  LLMs are "frozen in time" based on their training data. RAG is the standard industry pattern to give AI agents access to fresh, private, or domain-specific data without retraining the model.
                </p>
              </div>
            </div>
          </footer>
        </main>

        {/* Interactive Lab Container */}
        <aside className="xl:w-[600px] border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20 overflow-visible">
          <div className="sticky top-0 p-4 lg:p-8 h-screen overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-1">RAG Laboratory</h3>
              <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>

            <VectorDBLab />

            <p className="text-xs text-center text-zinc-400 font-medium mt-6">
              Powered by In-Memory Vector Store & Ollama
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
