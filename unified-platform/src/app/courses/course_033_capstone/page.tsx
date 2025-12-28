import React from 'react';
import { CapstoneLab } from '@/components/demos/course_033_capstone/CapstoneLab';
import {
    Network,
    GitMerge,
    Share2,
    Crown
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className="w-5 h-5 text-amber-500" />
                            <div className="text-sm font-bold tracking-wider text-zinc-500 uppercase">Capstone Project</div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                            The Multi-Agent Orchestrator
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            Congratulations on reaching the final frontier. You will now build a <strong>Head Node</strong> that autonomously routes tasks to specialized <strong>Worker Nodes</strong>. This is the architecture of modern AGI-lite systems.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold">System Architecture</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <Share2 className="w-5 h-5 text-purple-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">The Router</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    Analyzing user intent. "Does this need code? Or research?" It decides <strong>WHO</strong> should handle the request.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <GitMerge className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">The Workers</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    Specialized prompts. The <strong>Coder</strong> writes Python. The <strong>Researcher</strong> summarizes facts. The <strong>Analyst</strong> uses logic.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">The Synthesizer</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    The results are fed back to the main loop, where the Orchestrator presents the final answer to the user.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Final Test</h2>
                            <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Crown className="w-4 h-4 text-amber-500" /></div>
                                <p>
                                    <strong>Objective:</strong> Ask for a breakdown of "Coffee". <br />
                                    Watch the Orchestrator delegate to the <strong>Analyst</strong>.<br />
                                    Then ask for "Python code". Watch it switch to the <strong>Coder</strong>.
                                </p>
                            </div>
                        </div>

                        <CapstoneLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
