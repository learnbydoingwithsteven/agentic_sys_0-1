import React from 'react';
import { SimulatorLab } from '@/components/demos/course_031_e2e_testing/SimulatorLab';
import {
    Bug,
    Users,
    Activity,
    Bot
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-3">Module 4.2</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            E2E Testing (The Simulator)
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            Manual testing is slow. Pro engineers build <strong>User Simulator Agents</strong> to stress-test their systems 24/7. Watch two AI models talk to each other to uncover edge cases.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold">The Simulation Loop</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Bot className="w-24 h-24" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-500">
                                    <Bot className="w-5 h-5" /> System Agent (Target)
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                    The AI you are building. It has instructions to be helpful, polite, and follow specific business rules.
                                </p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs font-mono text-blue-800 dark:text-blue-200">
                                    SYS: "Hello! How can I help you today?"
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Activity className="w-24 h-24" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-red-500">
                                    <Users className="w-5 h-5" /> User Simulator (Tester)
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                    An adversarial agent prompted to act like a specific user (e.g., "Karen"). Its goal is to break the system or achieve a difficult outcome.
                                </p>
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-xs font-mono text-red-800 dark:text-red-200">
                                    USER: "I demand a refund NOW! Your product is garbage!"
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Arena</h2>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Bug className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Select the "Angry Customer" persona and press Play.<br />
                                    Watch if your System Agent (Blue) maintains composure or if it gets tricked into breaking policy by the persistent User Simulator (Red).
                                </p>
                            </div>
                        </div>

                        <SimulatorLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
