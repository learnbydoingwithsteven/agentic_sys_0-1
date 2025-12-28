import React from 'react';
import { DocQALab } from '@/components/demos/course_034_document_qa/DocQALab';
import {
  FileText,
  Search,
  MessageSquare,
  Zap
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 5.1</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Document QA Agent
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              "Chat with your Data." Build an agent that ingests a specific document on-the-fly, chunks it, embeds it, and answers questions with <strong>citations</strong>.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">The Micro-RAG Pipeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "1. Ingest",
                  desc: "Accept raw text or file uploads. For this demo, we paste the text directly."
                },
                {
                  icon: Zap,
                  title: "2. Ephemeral Index",
                  desc: "Create an in-memory Vector Store. It lives only as long as the session."
                },
                {
                  icon: Search,
                  title: "3. Cited Answers",
                  desc: "Retrieve the top 3 relevant chunks and use them to ground the LLM's answer."
                }
              ].map((step, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <step.icon className="w-16 h-16" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Apollo 11 QA</h2>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><MessageSquare className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong> The text on the left contains details about Apollo 11. <br />
                  Ask <em>"How long were they on the moon?"</em> or <em>"Who flew the command module?"</em>.<br />
                  Notice how the agent finds the exact sentence to answer you.
                </p>
              </div>
            </div>

            <DocQALab />
          </section>

        </main>
      </div>
    </div>
  );
}
