import React from 'react';
import { PersonalizationLab } from '@/components/demos/course_077_personalization/PersonalizationLab';
import { Users, Fingerprint } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-pink-600 dark:text-pink-400 uppercase mb-3">Module 8.5</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                        Agent Personalization
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        One size does not fit all. Build agents that maintain <strong>User Profiles</strong> (Tone, Expertise, History) to adapt their answers dynamically.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: Dual Personas</h2>
                        <div className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800 rounded-xl text-sm text-pink-800 dark:text-pink-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><Fingerprint className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Ask "Explain Quantum Physics" to Alice (Scientist) vs Bob (Child). Observe how the Context Injection changes the generation.</p>
                        </div>
                    </div>
                    <PersonalizationLab />
                </section>
            </main>
        </div>
    );
}
