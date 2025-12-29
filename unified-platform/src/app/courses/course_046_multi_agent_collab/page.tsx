import React from 'react';
import { CrewLab } from '@/components/demos/course_046_multi_agent_collab/CrewLab';
import { Users, Briefcase } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-red-600 dark:text-red-400 uppercase mb-3">Module 6.6</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Multi-Agent Collaboration
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Specialized agents beat a single generalist. Build a "Crew" where a Manager coordinates a Researcher and a Writer.
          </p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">The CrewAI Pattern</h2>
          </div>
          <div className="flex gap-4 mb-8 flex-wrap">
            <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-bold">Manager</div>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold">Researcher</div>
            <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold">Writer</div>
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Newsroom</h2>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Briefcase className="w-4 h-4" /></div>
              <p><strong>Scenario:</strong> You are the client. Give the Manager a topic. Watch them delegate tasks to the team and assemble the final report.</p>
            </div>
          </div>
          <CrewLab />
        </section>
      </main>
    </div>
  );
}
