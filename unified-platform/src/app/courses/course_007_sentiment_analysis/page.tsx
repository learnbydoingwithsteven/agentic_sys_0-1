import React from 'react';
import { SentimentLab  } from '@/components/demos/course_007_sentiment_analysis/SentimentLab';
import { Heart } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-pink-600 dark:text-pink-400 uppercase mb-3">Module 1.7</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Sentiment Analysis
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Understanding the emotion behind the text. Equip your agents with empathy and emotional intelligence.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" /> Emotional Intelligence
              </h4>
              <p className="text-pink-800 dark:text-pink-200/80 mb-4 leading-relaxed">
                Beyond simple classification, Sentiment Analysis aims to determine the emotional tone (positive, negative, neutral) and specific feelings (anger, joy, sadness) within text.
              </p>
            </div>
          </section>

          <section id="absa" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">01</span>
              Aspect-Based SA
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Analyzing sentiment towards specific targets (aspects) in a sentence, not just the whole sentence.
              </p>
              <div className="bg-zinc-900 text-zinc-300 p-4 rounded-lg font-mono text-xs">
                <span className="text-zinc-500"># Example</span><br />
                Text: &quot;The food was great, but the service was terrible.&quot;<br />
                --&gt; Food: <span className="text-green-400">Positive</span><br />
                --&gt; Service: <span className="text-red-400">Negative</span>
              </div>
            </div>
          </section>

          <section id="emotion" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">02</span>
              Emotion Detection
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <EmotionCard emoji="😠" title="Anger" />
              <EmotionCard emoji="😢" title="Sadness" />
              <EmotionCard emoji="😃" title="Joy" />
              <EmotionCard emoji="😱" title="Fear" />
              <EmotionCard emoji="😲" title="Surprise" />
              <EmotionCard emoji="😐" title="Neutral" />
            </div>
          </section>

          <section id="challenges" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm">03</span>
              Challenges
            </h2>
            <ul className="space-y-4">
              <ChallengeItem title="Sarcasm" desc="'Oh great, another delay.' (Machine might think 'Great' is positive)." />
              <ChallengeItem title="Nuance" desc="'The movie was not bad.' (Double negative)." />
              <ChallengeItem title="Context" desc="'It runs cold.' (Good for a CPU, bad for a bath)." />
            </ul>
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

function EmotionCard({ emoji, title }: { emoji: string, title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <span className="text-3xl mb-2">{emoji}</span>
      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{title}</span>
    </div>
  );
}

function ChallengeItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
      <div className="shrink-0 font-bold text-amber-600 text-sm mt-0.5">{title}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 italic">&quot;{desc}&quot;</div>
    </li>
  );
}
