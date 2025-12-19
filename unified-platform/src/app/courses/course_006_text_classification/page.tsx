import React from 'react';
import { ClassificationLab  } from '@/components/demos/course_006_text_classification/ClassificationLab';
import { Tag } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase mb-3">Module 1.6</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Text Classification
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Teaching agents to sort and categorize information. From spam detection to sentiment analysis (coming next).
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-violet-900 dark:text-violet-100 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-600" /> Digital Sorting
              </h4>
              <p className="text-violet-800 dark:text-violet-200/80 mb-4 leading-relaxed">
                Classification is one of the most fundamental NLP tasks. Agents use it to route requests (Router Chains), filter content, or tag data for databases.
              </p>
            </div>
          </section>

          <section id="types" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm">01</span>
              Classification Types
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card title="Binary" desc="Two classes. Example: Spam vs. Not Spam, Safe vs. Unsafe." />
              <Card title="Multi-Class" desc="Mutually exclusive categories. Example: News vs. Sports vs. Tech." />
              <Card title="Multi-Label" desc="Can belong to multiple buckets. Example: A movie can be both 'Action' and 'Sci-Fi'." />
              <Card title="Hierarchical" desc="Tree structure. Example: Product -> Electronics -> Laptops." />
            </div>
          </section>

          <section id="fewshot" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm">02</span>
              Few-Shot Classifiers
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Traditional ML required training on thousands of examples. LLM Agents can classify accurately with just a few examples in the prompt (Few-Shot).
              </p>
              <div className="bg-zinc-900 text-zinc-300 p-4 rounded-lg font-mono text-xs">
                <span className="text-zinc-500"># Prompt Example</span><br />
                Text: "I love this!" -&gt; Positive<br />
                Text: "I hate this." -&gt; Negative<br />
                Text: "It's okay." -&gt; Neutral<br />
                Text: [INPUT] -&gt; ?
              </div>
            </div>
          </section>

          <section id="evaluation" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-sm">03</span>
              Metrics
            </h2>
            <div className="space-y-4">
              <MetricItem name="Accuracy" text="Ratio of correct predictions." />
              <MetricItem name="Precision" text="How many selected items are relevant?" />
              <MetricItem name="Recall" text="How many relevant items are selected?" />
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

function Card({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function MetricItem({ name, text }: { name: string, text: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
      <div className="font-bold text-violet-600 text-sm min-w-[80px]">{name}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">{text}</div>
    </div>
  );
}
