import React from 'react';
import { SentimentLab } from '@/components/demos/course_007_sentiment_analysis/SentimentLab';
import { Heart, Mic, Search, BarChart3, MessageCircle } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase mb-3">Module 1.7</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Sentiment Analysis
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Equipping agents with emotional intelligence. Understanding tone, nuance, and specific feedback targets.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-rose-900 dark:text-rose-100 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" /> Beyond Good vs Bad
              </h4>
              <p className="text-rose-800 dark:text-rose-200/80 mb-4 leading-relaxed">
                Sentiment analysis isn't just about tagging text as "Positive" or "Negative". Modern AI Agents can detect identifying specific emotions (Anger, Joy, Fear) and pinpoint exactly <i>what</i> the user is feeling about (Aspect-Based Sentiment).
              </p>
            </div>
          </section>

          <section id="levels" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Levels of Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LevelCard
                icon={<BarChart3 className="text-blue-500" />}
                title="Polarity Detection"
                desc="The classic binary classification: Positive, Negative, or Neutral. Good for high-level aggregation."
              />
              <LevelCard
                icon={<MessageCircle className="text-purple-500" />}
                title="Emotion Recognition"
                desc="Identifying granular human states: Joy, Sadness, Anger, Surprise, Fear."
              />
              <LevelCard
                icon={<Search className="text-emerald-500" />}
                title="Aspect-Based Sentiment"
                desc="Connecting sentiment to specific targets. Example: 'Food (Positive) but Service (Negative)'."
              />
              <LevelCard
                icon={<Mic className="text-orange-500" />}
                title="Tone & Sarcasm"
                desc="Understanding context and irony, which traditional keyword-based systems often miss."
              />
            </div>
          </section>

          <section id="tech-evolution" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Why LLMs Win
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Traditional methods used "Bag of Words" (counting positive/negative words). They failed at sentences like:
              </p>
              <div className="bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-700/50 rounded-lg p-4 font-mono text-sm text-zinc-600 dark:text-zinc-300 italic mb-4">
                "I expected this movie to be terrible, but I was wrong."
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                A keyword system sees "terrible" and flags it as Negative. An LLM understands the <strong>contextual negation</strong> ("expected... but I was wrong") and correctly identifies it as Positive.
              </p>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <SentimentLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

function LevelCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
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
