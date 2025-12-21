import React from 'react';
import { WebSearchLab } from '@/components/demos/course_017_web_search/WebSearchLab';
import { Globe, Search, BookOpen, Zap, TrendingUp } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 2.7</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent with Web Search
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Breaking free from training data cutoffs. Learn how agents access real-time information from the web to answer current questions.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> The Knowledge Cutoff Problem
              </h4>
              <p className="text-blue-800 dark:text-blue-200/80 mb-4 leading-relaxed">
                LLMs are trained on data up to a specific date. Ask GPT-4 about events from last week and it will say "I don't have information about that." This is the <strong>knowledge cutoff problem</strong>.
                <br /><br />
                <strong>Web search agents solve this</strong> by:
                <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                  <li>Analyzing the query to determine what information is needed</li>
                  <li>Searching the web for current, relevant sources</li>
                  <li>Synthesizing an answer with proper citations</li>
                </ol>
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              The Research Loop
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-500" /> Query Analysis
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The agent first determines what search queries would best answer the question. For "What's new in AI?", it might generate: "latest AI developments 2024", "recent AI breakthroughs".
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> Web Retrieval
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The agent performs web searches using DuckDuckGo (no API key needed) and retrieves the top results, including titles, URLs, and snippets.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Synthesis
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The agent reads the search results and creates a comprehensive answer, citing sources by name (e.g., "According to TechCrunch...").
                </p>
              </div>
            </div>
          </section>

          <section id="tools" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Why DuckDuckGo?
            </h2>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                This module uses DuckDuckGo for web search because:
              </p>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>No API Key Required</strong>: Unlike Google or Bing, DuckDuckGo can be accessed without authentication.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Privacy-Focused</strong>: DuckDuckGo doesn't track searches or build user profiles.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Educational</strong>: Perfect for learning how web search agents work without API costs.
                  </div>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> For production systems, consider using dedicated search APIs like SerpAPI, Brave Search API, or Google Custom Search for better reliability and features.
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <WebSearchLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
