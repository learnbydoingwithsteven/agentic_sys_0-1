import React from 'react';
import { ClassificationLab } from '@/components/demos/course_006_text_classification/ClassificationLab';
import { Tag, Split, Layers, GitMerge, Check, ArrowRight, Share2, Database, BookOpen } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 1.6</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Text Classification
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Teaching agents to sort and categorize information. From spam detection to sentiment analysis.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" /> Digital Sorting
              </h4>
              <p className="text-indigo-800 dark:text-indigo-200/80 mb-4 leading-relaxed">
                Classification is one of the most fundamental NLP tasks. Agents use it to route requests (Router Chains), filter content, or tag data for databases.
              </p>
            </div>
          </section>

          <section id="types" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">01</span>
              Classification Types
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TypeCard
                icon={<Split className="text-blue-500" />}
                title="Binary"
                desc="Two classes. Example: Spam vs. Not Spam, Safe vs. Unsafe."
              />
              <TypeCard
                icon={<Layers className="text-purple-500" />}
                title="Multi-Class"
                desc="Mutually exclusive categories. Example: News vs. Sports vs. Tech."
              />
              <TypeCard
                icon={<Tag className="text-green-500" />}
                title="Multi-Label"
                desc="Can belong to multiple buckets. Example: A movie can be both 'Action' and 'Sci-Fi'."
              />
              <TypeCard
                icon={<GitMerge className="text-orange-500" />}
                title="Hierarchical"
                desc="Tree structure. Example: Product -> Electronics -> Laptops."
              />
            </div>
          </section>

          <section id="few-shot" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Few-Shot Classifiers
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Traditional ML required training on thousands of examples. LLM Agents can classify accurately with just a few examples in the prompt (Few-Shot).
              </p>

              <div className="bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-700/50 rounded-lg p-4 font-mono text-sm text-zinc-600 dark:text-zinc-300">
                <div className="text-zinc-400 mb-2"># Prompt Example</div>
                <div className="flex gap-2"><span className="text-blue-500">Text:</span> "I love this!" <span className="text-purple-500">&rarr; Positive</span></div>
                <div className="flex gap-2"><span className="text-blue-500">Text:</span> "I hate this." <span className="text-purple-500">&rarr; Negative</span></div>
                <div className="flex gap-2"><span className="text-blue-500">Text:</span> "It's okay." <span className="text-purple-500">&rarr; Neutral</span></div>
                <div className="flex gap-2 font-bold"><span className="text-blue-600 dark:text-blue-400">Text:</span> [INPUT] <span className="text-purple-600 dark:text-purple-400">&rarr; ?</span></div>
              </div>
            </div>
          </section>

          <section id="metrics" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">03</span>
              Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricItem title="Accuracy" desc="Ratio of correct predictions." />
              <MetricItem title="Precision" desc="How many selected items are relevant?" />
              <MetricItem title="Recall" desc="How many relevant items are selected?" />
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ClassificationLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

function TypeCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MetricItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
      <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">{title}</div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  )
}
