import React from 'react';
import { SafetyLab } from '@/components/demos/course_071_ethical_safe/SafetyLab';
import { ShieldCheck, Heart } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">Module 7.11</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                        Ethical & Safe Agents
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        With great power comes great responsibility. Implement <strong>Content Moderation</strong> and Guardrails to prevent toxicity and misuse.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Moderator</h2>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><ShieldCheck className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Type in risky or harmful prompts. See how the safety layer flags them and provides a breakdown of the detected harm categories.</p>
                        </div>
                    </div>
                    <SafetyLab />
                </section>
            </main>
        </div>
    );
}
