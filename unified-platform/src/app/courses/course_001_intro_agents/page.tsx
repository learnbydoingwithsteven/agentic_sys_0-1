import React from 'react';
import { InteractiveDemo } from '@/components/demos/course_001/InteractiveDemo';
import { Brain, Database, Eye, Network, Bot, Zap } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Article Content */}
            <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-3">Module 1.1</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
                        Introduction to AI Agents
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                        An AI agent is an autonomous entity that perceives its environment through sensors and acts upon it through actuators to achieve specific goals.
                    </p>
                </header>

                <section id="overview" className="mb-16 scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 text-sm">01</span>
                        Key Components
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <FeatureCard
                            icon={<Eye className="w-5 h-5 text-blue-500" />}
                            title="Perception"
                            description="Ability to sense and understand the environment."
                        />
                        <FeatureCard
                            icon={<Brain className="w-5 h-5 text-purple-500" />}
                            title="Reasoning"
                            description="Processing information to make decisions."
                        />
                        <FeatureCard
                            icon={<Zap className="w-5 h-5 text-amber-500" />}
                            title="Action"
                            description="Executing decisions in the environment."
                        />
                        <FeatureCard
                            icon={<Database className="w-5 h-5 text-emerald-500" />}
                            title="Learning"
                            description="Improving performance over time."
                        />
                    </div>
                </section>

                <section id="concepts" className="mb-16 scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 text-sm">02</span>
                        Agent Architecture
                    </h2>
                    <p className="text-slate-700 mb-8 leading-relaxed">
                        Agents can be classified based on their underlying architecture and complexity.
                    </p>

                    <div className="space-y-4">
                        <ArchItem title="Simple Reflex Agent" desc="Acts based on current perception only." badge="Basic" />
                        <ArchItem title="Model-Based Agent" desc="Maintains internal state of the world." badge="Intermediate" />
                        <ArchItem title="Goal-Based Agent" desc="Acts to achieve specific goals." badge="Advanced" />
                        <ArchItem title="Utility-Based Agent" desc="Maximizes expected utility." badge="Expert" />
                    </div>
                </section>

                <section id="applications" className="mb-16 scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 text-sm">03</span>
                        Types of AI Agents
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8 space-y-8">

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-lg text-emerald-900 mb-2">
                                <Zap className="w-4 h-4 text-emerald-500" /> 1. Reactive Agents
                            </h3>
                            <p className="text-emerald-800 ml-6">Respond directly to environmental stimuli without internal state.</p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-lg text-emerald-900 mb-2">
                                <Brain className="w-4 h-4 text-emerald-500" /> 2. Deliberative Agents
                            </h3>
                            <p className="text-emerald-800 ml-6">Maintain internal models and plan actions to achieve goals.</p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-lg text-emerald-900 mb-2">
                                <Network className="w-4 h-4 text-emerald-500" /> 3. Hybrid Agents
                            </h3>
                            <p className="text-emerald-800 ml-6">Combine reactive and deliberative capabilities for optimal performance.</p>
                        </div>

                    </div>
                </section>

                <section id="best-practices" className="mb-16 scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 text-sm">04</span>
                        Agent Properties
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <PropertyCard title="Autonomy" desc="Operates without direct human intervention" />
                        <PropertyCard title="Reactivity" desc="Responds to environmental changes" />
                        <PropertyCard title="Proactivity" desc="Takes initiative to achieve goals" />
                        <PropertyCard title="Social Ability" desc="Interacts with other agents" />
                    </div>
                </section>

                <section id="next-steps" className="mb-12 scroll-mt-20">
                    <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                        <Bot className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Ready to Build?</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Now that you understand the theory, proceed to the interactive demo to verify your learning.
                        </p>
                    </div>
                </section>
            </main>

            {/* Demo Panel (Right Side on Desktop) */}
            <aside className="lg:w-96 xl:w-[28rem] px-6 lg:px-8 py-12 border-l border-slate-200 bg-slate-50/50">
                <InteractiveDemo />
            </aside>
        </div>
    );
}

// Helper Components

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="shrink-0 p-2 rounded-lg bg-slate-100">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function ArchItem({ title, desc, badge }: { title: string, desc: string, badge: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div>
                <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                <p className="text-sm text-slate-500">{desc}</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-white border border-slate-200 text-slate-600">
                {badge}
            </span>
        </div>
    );
}

function PropertyCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
            <h4 className="font-bold text-orange-900 mb-1">{title}</h4>
            <p className="text-sm text-orange-800">{desc}</p>
        </div>
    );
}
