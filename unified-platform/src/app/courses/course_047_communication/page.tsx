import React from 'react';
import { ProtocolLab } from '@/components/demos/course_047_communication/ProtocolLab';
import { Network, Server } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-green-600 dark:text-green-400 uppercase mb-3">Module 6.7</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Agent Communication Protocols
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Don't let agents chat casually. Enforce strict <strong>JSON Schemas</strong> and Handshakes to build reliable multi-agent systems.
          </p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Network className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">The Babel Problem</h2>
          </div>
          <p className="max-w-prose text-zinc-500 mb-8">
            Natural language is ambiguous. "I want a big pizza" is hard for a machine to process. <code>{`{size: "large"}`}</code> is unambiguous.
          </p>
        </section>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Handshake</h2>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Server className="w-4 h-4" /></div>
              <p><strong>Experiment:</strong> Try ordering a pizza using natural language and watch the server struggle. Then switch to the <strong>JSON Protocol</strong> and see the instant success.</p>
            </div>
          </div>
          <ProtocolLab />
        </section>
      </main>
    </div>
  );
}
