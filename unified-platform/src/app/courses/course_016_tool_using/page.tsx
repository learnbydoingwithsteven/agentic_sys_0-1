import React from 'react';
import { ToolUsingLab } from '@/components/demos/course_016_tool_using/ToolUsingLab';
import { Wrench, Brain, Zap, Target } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 2.6</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Tool-Using Agents
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              The moment AI leaves the chat box. Learn how agents use external tools (APIs, calculators, databases) to ground their responses in reality.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" /> The Hallucination Problem
              </h4>
              <p className="text-orange-800 dark:text-orange-200/80 mb-4 leading-relaxed">
                Ask a vanilla LLM "What is 127 × 43?" and it will <em>guess</em>. It has no calculator. Ask it "What's the weather in Tokyo?" and it will <em>make up</em> an answer. It has no API.
                <br /><br />
                <strong>Tool-using agents solve this</strong> by recognizing when they need external data, calling the appropriate tool, and incorporating the result into their response.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              The ReAct Pattern
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" /> Reasoning
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The agent first <strong>thinks</strong> about what it needs to do. "I need to calculate 127 × 43. I should use the calculator tool."
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-500" /> Acting
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  The agent then <strong>acts</strong> by calling the tool with the correct input. It receives the result and incorporates it into the final answer.
                </p>
              </div>
            </div>
          </section>

          <section id="tools" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Tool Design Principles
            </h2>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Every tool must have:
              </p>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Clear Description</strong>: The LLM reads this to decide when to use the tool.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Defined Schema</strong>: What inputs does it expect? (e.g., "city name" for weather).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Deterministic Output</strong>: The tool should return consistent, structured data.
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ToolUsingLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
