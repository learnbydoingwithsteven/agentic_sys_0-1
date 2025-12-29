import React from 'react';
import { AdversarialLab } from '@/components/demos/course_065_adversarial/AdversarialLab';
import { ShieldAlert, Sword } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-red-600 dark:text-red-400 uppercase mb-3">Module 7.5</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
            Adversarial Agent Training
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            To build a secure shield, you must forge a sharp sword. Train agents by pitting a <strong>Red Team Attacker</strong> against a <strong>Blue Team Defender</strong>.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: War Games</h2>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><ShieldAlert className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Start the simulation. Watch the Attacker try 3 creative prompt injections to steal the password, and see if the Defender holds up.</p>
            </div>
          </div>
          <AdversarialLab />
        </section>
      </main>
    </div>
  );
}
