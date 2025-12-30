import React from 'react';
import { SupportLab } from '@/components/demos/course_040_customer_support/SupportLab';
import { Headphones, LifeBuoy } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3">Module 4.10</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                        AI Customer Support Agent
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Scale your support. Build an agent that <strong>Triages</strong> incoming tickets, detecting sentiment (Angry vs Happy) and extracting intent (Refund vs Technical) to route them effectively.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: Auto-Triage</h2>
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl text-sm text-teal-800 dark:text-teal-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><LifeBuoy className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Send different messages (e.g., "I love this app" vs "I want my money back"). Watch the dashboard automatically tag and prioritize them.</p>
                        </div>
                    </div>
                    <SupportLab />
                </section>
            </main>
        </div>
    );
}
