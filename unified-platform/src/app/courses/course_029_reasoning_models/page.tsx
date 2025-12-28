import React from 'react';
import { ReasoningLab } from '@/components/demos/course_029_reasoning_models/ReasoningLab';
import {
    Brain,
    Zap,
    Microscope,
    Cpu
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 3.9</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                            Reasoning Models (CoT)
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            LLMs are naturally "System 1" thinkers—fast and intuitive. By using <strong>Chain of Thought (CoT)</strong>, we force them into "System 2" mode, enabling them to solve complex logic puzzles by thinking step-by-step.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold">Two Modes of Thinking</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap className="w-24 h-24" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-orange-500">
                                    <Zap className="w-5 h-5" /> System 1: Fast
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                    <strong>"The Gut Feeling"</strong><br />
                                    Operating on pattern matching. Fast, cheap, but prone to logical hallucinations and trick questions.
                                </p>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-xs font-mono text-orange-800 dark:text-orange-200">
                                    User: 2+2?<br />
                                    AI: 4.
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Microscope className="w-24 h-24" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-indigo-500">
                                    <Microscope className="w-5 h-5" /> System 2: Slow
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                    <strong>"The Analyst"</strong><br />
                                    Allocates compute to reasoning tokens. "Let's think step by step". Slower, more expensive, but far more accurate.
                                </p>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-xs font-mono text-indigo-800 dark:text-indigo-200">
                                    User: 25 * 14?<br />
                                    AI: Let's break it down. 25 * 10 is 250...
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Logic Battle</h2>
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Cpu className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Run the "Sister Riddle".<br />
                                    System 1 often says "Sally has 6 sisters" (3 brothers * 2 sisters each).<br />
                                    System 2 should realize "Wait, the brothers are siblings. They share the SAME sisters."
                                </p>
                            </div>
                        </div>

                        <ReasoningLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
