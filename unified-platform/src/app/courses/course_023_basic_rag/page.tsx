import React from 'react';
import { RagChatLab } from '@/components/demos/course_023_basic_rag/RagChatLab';
import {
  MessageSquareText,
  FileText,
  BrainCircuit,
  Database,
  ArrowRight
} from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 3.3</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Basic RAG System
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Turn your AI agent into a domain expert. In this module, we build a complete <strong>Chat with Data</strong> system that can read documents and answer questions with precision.
            </p>
          </header>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">The RAG Chat Loop</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "1. Ingest",
                  desc: "Documents are broken down into small, digestible chunks and indexed."
                },
                {
                  icon: Database,
                  title: "2. Retrieve",
                  desc: "User questions are converted to vectors to find the most relevant chunks."
                },
                {
                  icon: MessageSquareText,
                  title: "3. Respond",
                  desc: "The LLM generates an answer using ONLY the retrieved chunks as truth."
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
              <h2 className="text-2xl font-bold mb-4">Interactive Lab: Chat with Your Data</h2>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
                <div className="shrink-0 mt-0.5"><brain className="w-4 h-4" /></div>
                <p>
                  <strong>Experiment:</strong> Try pasting your own text (like a short article or email) into the "Document Content" area, click Ingest, and then ask questions about details that strictly exist in that text. See how the agent ignores its general knowledge when restricted to the context.
                </p>
              </div>
            </div>

            <RagChatLab />
          </section>

        </main>
      </div>
    </div>
  );
}
