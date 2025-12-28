import React from 'react';
import { MemoryLab } from '@/components/demos/course_026_memory_systems/MemoryLab';
import {
    Brain,
    History,
    HardDrive,
    RotateCcw,
    Maximize
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-fuchsia-600 dark:text-fuchsia-400 uppercase mb-3">Module 3.6</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-fuchsia-600 to-purple-500 bg-clip-text text-transparent">
                            Conversational Memory
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            LLMs are stateless—they forget you the moment they answer. To build a true companion, we must engineer <strong>Memory Systems</strong> that manage context without overflowing limits.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                            </div>
                            <h2 className="text-2xl font-bold">Memory Strategies</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: HardDrive,
                                    title: "Buffer Memory",
                                    desc: "Stores everything. Simple, but expensive. Will eventually crash the context window."
                                },
                                {
                                    icon: History,
                                    title: "Window Memory",
                                    desc: "Keeps only the last K interactions (e.g., last 5 messages). You forget the start, but stay fast."
                                },
                                {
                                    icon: RotateCcw,
                                    title: "Summary Memory",
                                    desc: "An LLM summarizes old conversation into a condensed 'System Note' to save space."
                                }
                            ].map((step, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-fuchsia-300 dark:hover:border-fuchsia-700 transition-colors">
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
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Window Memory</h2>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Maximize className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Set "Memory Window" to <strong>1</strong> (remember last 1 pair). Tell the agent your name. Then ask a random question. Then ask "What is my name?". See if it forgot!
                                </p>
                            </div>
                        </div>

                        <MemoryLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
