import React from 'react';
import { ConfigurationLab } from '@/components/demos/course_019_configuration/ConfigurationLab';
import { Settings, Sliders, Zap, TrendingUp, Target } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 2.9</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent Configuration Management
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Master the art of agent tuning. Learn how configuration parameters dramatically affect agent behavior, performance, and output quality.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Why Configuration Matters
              </h4>
              <p className="text-indigo-800 dark:text-indigo-200/80 mb-4 leading-relaxed">
                The same LLM can behave completely differently based on its configuration. A well-configured agent can be:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li><strong>Factual & Consistent</strong>: Low temperature for deterministic outputs</li>
                  <li><strong>Creative & Diverse</strong>: High temperature for varied responses</li>
                  <li><strong>Concise & Fast</strong>: Limited tokens for quick answers</li>
                  <li><strong>Detailed & Comprehensive</strong>: High token limits for in-depth analysis</li>
                </ul>
              </p>
            </div>
          </section>

          <section id="parameters" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Key Configuration Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" /> Temperature (0.0 - 1.0)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Controls randomness in responses. Low = deterministic, High = creative.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span>0.1:</span> <span className="text-blue-600">Factual answers</span></div>
                  <div className="flex justify-between"><span>0.5:</span> <span className="text-emerald-600">Balanced</span></div>
                  <div className="flex justify-between"><span>0.8:</span> <span className="text-purple-600">Creative writing</span></div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" /> Max Tokens
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Maximum length of the response. Affects detail and processing time.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span>256:</span> <span className="text-blue-600">Quick summaries</span></div>
                  <div className="flex justify-between"><span>512:</span> <span className="text-emerald-600">Standard responses</span></div>
                  <div className="flex justify-between"><span>1024:</span> <span className="text-purple-600">Detailed explanations</span></div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" /> Top P (Nucleus Sampling)
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Cumulative probability cutoff. Controls diversity of word choices.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span>0.9:</span> <span className="text-blue-600">Focused</span></div>
                  <div className="flex justify-between"><span>0.95:</span> <span className="text-emerald-600">Balanced</span></div>
                  <div className="flex justify-between"><span>0.98:</span> <span className="text-purple-600">Diverse</span></div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" /> System Prompt
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Defines the agent's role, personality, and behavioral guidelines.
                </p>
                <div className="text-xs text-zinc-500">
                  Critical for setting context, tone, and expertise level.
                </div>
              </div>
            </div>
          </section>

          <section id="strategies" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Configuration Strategies
            </h2>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Minimal Configuration</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <strong>Use Case:</strong> Factual Q&A, data extraction, classification
                      <br />
                      <strong>Settings:</strong> Low temperature (0.1), small tokens (256), focused sampling
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Balanced Configuration</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <strong>Use Case:</strong> General assistance, explanations, tutorials
                      <br />
                      <strong>Settings:</strong> Medium temperature (0.5), standard tokens (512), balanced sampling
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Advanced Configuration</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <strong>Use Case:</strong> Creative writing, brainstorming, complex reasoning
                      <br />
                      <strong>Settings:</strong> High temperature (0.8), large tokens (1024), diverse sampling
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="best-practices" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">03</span>
              Best Practices
            </h2>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <div>
                    <strong>Start with presets</strong>: Use Minimal/Balanced/Advanced as baselines, then fine-tune
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <div>
                    <strong>Test systematically</strong>: Compare configurations side-by-side with the same query
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <div>
                    <strong>Match task to config</strong>: Factual tasks need low temp, creative tasks need high temp
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <div>
                    <strong>Monitor performance</strong>: Track processing time and token usage for optimization
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ConfigurationLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
