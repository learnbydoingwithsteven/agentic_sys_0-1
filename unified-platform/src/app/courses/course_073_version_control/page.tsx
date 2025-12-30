import React from 'react';
import { VersionControlLab } from '@/components/demos/course_073_version_control/VersionControlLab';
import { GitBranch, History } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 8.1</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Agent Version Control
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Prompts are code. Treat them that way. Implement <strong>Semantic Versioning</strong> for your agents to track behavior changes and enable rollbacks.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Prompt Registry</h2>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><GitBranch className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Switch between v1.0 (Basic), v1.1 (Emoji), and v2.0 (Pirate). Test how the "Same Input" yields different "Versioned Outputs".</p>
            </div>
          </div>
          <VersionControlLab />
        </section>
      </main>
    </div>
  );
}
