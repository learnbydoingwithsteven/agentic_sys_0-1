import React from 'react';
import { AgiLab } from '@/components/demos/course_100_agi_prototype/AgiLab';
import { Eye, Cpu } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-black min-h-screen font-sans text-white">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full relative overflow-hidden">

                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

                <header className="mb-12 relative z-10 text-center">
                    <div className="text-sm font-bold tracking-[0.2em] text-indigo-400 uppercase mb-3 animate-pulse">Module 13.0 (Final)</div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
                        AGI Prototype
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                        The culmination of everything. Combine Perception, Memory, Planning, Tool Use, and Reflection into a single <strong>Universal Agent Architecture</strong>.
                    </p>
                </header>

                <section className="mb-24 relative z-10">
                    <div className="mb-8 max-w-3xl mx-auto text-center">
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 inline-flex items-center gap-3">
                            <Eye className="w-4 h-4 text-indigo-400" />
                            <span><strong>Final Lab:</strong> Initialize the Universal Agent loop. Give it any command.</span>
                        </div>
                    </div>
                    <AgiLab />
                </section>

                <footer className="text-center text-zinc-600 border-t border-zinc-900 pt-12">
                    <p>Congratulations, Agent Engineer. You have completed the curriculum.</p>
                </footer>
            </main>
        </div>
    );
}
