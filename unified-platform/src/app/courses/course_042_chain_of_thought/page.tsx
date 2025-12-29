import React from 'react';
import { ReasoningLab } from '@/components/demos/course_042_chain_of_thought/ReasoningLab';
import {
  BrainCircuit,
  Lightbulb,
  Puzzle,
  GitBranch
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase mb-3">Module 6.2</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Chain-of-Thought Reasoning
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              LLMs are bad at math and logic unless they "think aloud". Unlock <strong>System 2</strong> capabilities by forcing the model to reason step-by-step.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold">Thought Verification</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Puzzle className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">The Problem</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Standard LLMs guess the next word greedily. For logic puzzles like <em>"Roger has 5 balls..."</em>, they often fail without scratchpad space.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                  <GitBranch className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">The Fix: Hidden Thoughts</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  We force the model to output a <code>&lt;thinking&gt;</code> block first. This lets it correct its own logic before committing to an answer.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Peek Inside the Brain</h2>
              <div className="p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 rounded-xl text-sm text-violet-800 dark:text-violet-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><Lightbulb className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong>
                  <br />Ask: <em>"Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 balls. How many now?"</em>
                  <br />Expand the <strong>Thinking Process</strong> to see it do the math: <code>5 + (2 * 3) = 11</code>.
                </p>
              </div>
            </div>

            <ReasoningLab />
          </section>

        </main>
      </div>
    </div>
  );
}
