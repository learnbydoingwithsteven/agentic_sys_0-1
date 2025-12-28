import React from 'react';
import { ToolUseLab } from '@/components/demos/course_027_tool_use/ToolUseLab';
import {
    Wrench,
    Terminal,
    Bot,
    ArrowRight
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3">Module 3.7</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                            Multi-Step Agents (Tool Use)
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            Real power comes when AI stops guessing and starts <strong>doing</strong>. In this module, we give the agent access to tools (Calculator, APIs) and teach it to use them autonomously.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold">The ReAct Loop</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Bot,
                                    title: "1. Reason",
                                    desc: "The agent analyzes the request. 'User wants 25 * 4. I cannot do this reliably in my head. I need a tool.'"
                                },
                                {
                                    icon: Terminal,
                                    title: "2. Act",
                                    desc: "The agent outputs a structured command: { action: 'calculate', input: '25 * 4' }."
                                },
                                {
                                    icon: ArrowRight,
                                    title: "3. Observe",
                                    desc: "The system executes the tool and feeds the result ('100') back to the agent for the final answer."
                                }
                            ].map((step, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
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
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Calculations & Weather</h2>
                            <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl text-sm text-teal-800 dark:text-teal-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Terminal className="w-4 h-4" /></div>
                                <p>
                                    <strong>Tests to try:</strong> <br />
                                    1. "What is 12345 + 67890?" (Should trigger Calculator)<br />
                                    2. "What's the weather in Tokyo?" (Should trigger Weather)<br />
                                    3. "Is it raining in London?" (Should trigger Weather &rarr; Reason about Rain)
                                </p>
                            </div>
                        </div>

                        <ToolUseLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
