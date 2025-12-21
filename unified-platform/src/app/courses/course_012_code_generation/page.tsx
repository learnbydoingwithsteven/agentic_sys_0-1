import React from 'react';
import { CodeGenLab } from '@/components/demos/course_012_code_generation/CodeGenLab';
import { Code, Cpu, Shield, Zap } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 2.2</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Agentic Code Generation
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Moving beyond "Autocomplete" to "Architecture". How agents plan, implement, and review code before showing it to you.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-600" /> Use Case: The Invisible Senior Engineer
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200/80 mb-4 leading-relaxed">
                Standard LLMs are great at writing snippets. Agents are great at writing systems. By injecting prompts that force the model to consider <strong>edge cases</strong>, <strong>complexity</strong>, and <strong>typing</strong>, we transform a text completer into a code architect.
              </p>
            </div>
          </section>

          <section id="mechanism" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Architectural Differences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> "Snippet" Mode
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Zero-shot generation. The model predicts the next tokens based on probability. Fast, but prone to bugs and lack of context.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" /> "Architect" Mode
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Chain-of-Thought reasoning. The agent first outlines the requirements, plans the types, considers edge cases, and <em>then</em> writes the code.
                </p>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <CodeGenLab />
          </div>
        </aside>
      </div>
    </div>
  );
}
