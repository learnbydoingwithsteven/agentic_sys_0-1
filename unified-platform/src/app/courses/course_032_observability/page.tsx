import React from 'react';
import { DashboardLab } from '@/components/demos/course_032_observability/DashboardLab';
import {
    Activity,
    Search,
    DollarSign,
    BarChart3
} from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

            <div className="flex-1 flex flex-col xl:flex-row">
                {/* Main Content */}
                <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                    <header className="mb-12">
                        <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 4.3</div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Deployment & Observability
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                            "It works on my machine" isn't enough. Production AI requires rigorous monitoring. Learn to track <strong>Latency</strong>, <strong>Costs</strong>, and <strong>Traces</strong> to ensure reliability at scale.
                        </p>
                    </header>

                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold">The Three Pillars of AI Ops</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Activity,
                                    title: "1. Metrics",
                                    desc: "Quantitative data over time. Requests per second, Average Latency, Error Rate (% of failed tool calls)."
                                },
                                {
                                    icon: Search,
                                    title: "2. Traces",
                                    desc: "The lifecycle of a single request. Did the tool fail? Did the retrieval step take too long? Why did it hallucinate?"
                                },
                                {
                                    icon: DollarSign,
                                    title: "3. Costs",
                                    desc: "Token counting is vital. One runaway loop can cost thousands. Track input/output tokens per model."
                                }
                            ].map((step, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
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
                            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Ops Dashboard</h2>
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                                <div className="shrink-0 mt-0.5"><Activity className="w-4 h-4" /></div>
                                <p>
                                    <strong>Experiment:</strong> Click <strong>Start Traffic</strong> to simulate a production workload.<br />
                                    Watch the "Live Event Stream" populate. Notice how random errors (red) affect the "Error Rate" widget, and how varying query complexity impacts "Avg Latency".
                                </p>
                            </div>
                        </div>

                        <DashboardLab />
                    </section>

                </main>
            </div>
        </div>
    );
}
