import React from 'react';
import { EmbeddingLab } from '@/components/demos/course_021_embeddings/EmbeddingLab';
import {
  Binary,
  Search,
  Zap,
  Cpu,
  Network,
  Maximize2,
  MousePointer2,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 3.1</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Vector Embeddings Fundamentals
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Understand how AI represents words, sentences, and concepts as high-dimensional coordinates in a semantic space.
            </p>
          </header>

          <section id="what-are-embeddings" className="mb-16 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Binary className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">What are Embeddings?</h2>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
                Computers cannot "read" text like humans. Instead, we use <strong>Embeddings</strong> to translate human language into a language computers understand: <strong>numbers</strong>.
                Specifically, an embedding is a list of floating-point numbers (a vector) that captures the <em>meaning</em> of the text.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Network className="w-4 h-4 text-emerald-500" />
                    Spatial Relationship
                  </h4>
                  <p className="text-sm text-zinc-500">
                    If two words are similar in meaning (like "cat" and "kitten"), their embedding vectors will be mathematically close to each other in vector space.
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                    High Dimensionality
                  </h4>
                  <p className="text-sm text-zinc-500">
                    While we live in 3D, embeddings often live in 768 or 1536 dimensions. Each dimension captures a subtle nuance of the word's meaning.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              The Semantic Search Workflow
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-default group">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Text Input</h4>
                  <p className="text-sm text-zinc-500 italic">User provides a query or document.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-default group">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Embedding Generation</h4>
                  <p className="text-sm text-zinc-500">A model (like LLama or Nomic) processes the text and outputs a fixed-length numeric vector.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-default group">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Vector Comparison</h4>
                  <p className="text-sm text-zinc-500">Mathematical functions (Cosine Similarity) calculate the "angle" between vectors to find the most similar items.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="key-concepts" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Key Metrics & Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-2">Cosine Similarity</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The most common metric for comparing text. It measures the direction (angle) of vectors, meaning it's insensitive to length but highly sensitive to meaning.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-pink-600 dark:text-pink-400 font-bold text-lg mb-2">Euclidean Distance</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Measures the literal "as the crow flies" distance between points. Useful when the magnitude (length) of the vector carries important information.
                </p>
              </div>
            </div>

            <div className="mt-8 p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800 relative overflow-hidden">
              <Lightbulb className="absolute right-6 top-6 w-24 h-24 text-amber-200/50 dark:text-amber-800/10 rotate-12" />
              <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                Pro Tip: Context Matters
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200/70 leading-relaxed max-w-xl">
                Embeddings are model-specific. A vector generated by model 'A' cannot be compared directly with one from model 'B'. Always ensure your query and knowledge base use the exact same embedding model.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Normalization', 'Dot Product', 'L2 Distance', 'Dimensions'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/50 dark:bg-black/20 border border-amber-200/50 dark:border-amber-800/50 rounded-full text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <footer className="pt-12 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-400 italic">
              You are now ready to implement modern semantic search systems.
            </p>
          </footer>
        </main>

        {/* Sticky Sidebar Demos */}
        <aside className="lg:w-[450px] xl:w-[500px] px-4 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-12">
            <div className="mb-6">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-1">Interactive Lab</h3>
              <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>
            <EmbeddingLab />

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Learning Objective</h5>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium">Verify semantic clustering with mixed presets.</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium">Observe how dimensionality impacts search speed.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
