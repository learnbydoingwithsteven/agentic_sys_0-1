import React from 'react';
import { EvalLab } from '@/components/demos/course_030_eval_driven_dev/EvalLab';
import {
    Gavel,
    Scale,
    CheckCheck,
    ClipboardCheck,
    Play
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">Module 4.1</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                            Eval Driven Development
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            You wouldn't ship code without Unit Tests. Why ship AI without Evals? Learn to use <strong>LLM-as-a-Judge</strong> to automatically grade your agents' performance.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold">The Quality Control Loop</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: ClipboardCheck,
                                    title: "1. Dataset",
                                    desc: "A set of 'Golden Questions' and their 'Ground Truth' answers. This is your benchmark."
                                },
                                {
                                    icon: Play,
                                    title: "2. Inference",
                                    desc: "Run your agent against the dataset. Capture the actual outputs (which change over time)."
                                },
                                {
                                    icon: Gavel,
                                    title: "3. Auto-Grading",
                                    desc: "Use a stronger LLM (The Judge) to compare Actual vs Ground Truth and assign a score."
                                }
                            ].map((step, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
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
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Judge</h2>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Gavel className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Try the "Fact Check (Correct)" preset. You should get a 5/5.<br />
                                    Then try changing the Agent Response to be vaguely correct but missing details (e.g., "It's a city in Europe") and see the score drop.
                                </p>
                            </div>
                        </div>

                        <EvalLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
