import React from 'react';
import { ChainLab  } from '@/components/demos/course_005_agent_chains/ChainLab';
import { Network, ArrowRight, Share2, GitMerge } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 1.5</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agent Chains
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Moving beyond single prompts. Orchestrate complex workflows by chaining multiple agent steps together.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-orange-600" /> The Power of Pipelines
              </h4>
              <p className="text-orange-800 dark:text-orange-200/80 mb-4 leading-relaxed">
                Single LLM calls are powerful but limited. By breaking tasks into smaller steps (chains), you can achieve higher accuracy, handle complex logic, and create robust applications.
              </p>
            </div>
          </section>

          <section id="patterns" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">01</span>
              Chaining Patterns
            </h2>

            <div className="space-y-6">
              <PatternCard
                icon={<ArrowRight className="text-blue-500" />}
                title="Sequential Chain"
                badge="Linear"
                desc="Output of Step A becomes Input of Step B. Best for step-by-step tasks like Research -> Draft."
              />
              <PatternCard
                icon={<GitMerge className="text-purple-500" />}
                title="Router Chain"
                badge="Conditional"
                desc="Dynamically selects the next step based on input. E.g., If math question -> Math Agent, if code -> Coding Agent."
              />
              <PatternCard
                icon={<Share2 className="text-green-500" />}
                title="Parallel Chain"
                badge="Async"
                desc="Run multiple steps at once and aggregate results. Great for brainstorming or multi-perspective analysis."
              />
            </div>
          </section>

          <section id="langchain" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              LangChain Concepts
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <ul className="space-y-4">
                <ConceptItem text="LLMChain: The basic building block." />
                <ConceptItem text="Memory: Passing state between chain steps." />
                <ConceptItem text="Callbacks: Monitoring the chain's execution." />
              </ul>
            </div>
          </section>
        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ChainLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

function PatternCard({ icon, title, badge, desc }: { icon: React.ReactNode, title: string, badge: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-50 dark:bg-zinc-800">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase tracking-widest">{badge}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ConceptItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{text}</span>
    </li>
  );
}
