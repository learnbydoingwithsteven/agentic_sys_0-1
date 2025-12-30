import React from 'react';
import { ToolCreationLab } from '@/components/demos/course_097_tool_creation/ToolCreationLab';
import { Hammer, Code } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3">Module 12.4</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        Agent Tool Creation
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Emergent Intelligence. Transition from using hard-coded tools to <strong>Writing New Tools</strong> (Code Functions) on the fly to solve novel problems.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Tool Smith</h2>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><Hammer className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Ask the agent to perform a task it has no tool for (e.g. "Calculate Circle Area"). Watch it write the Javascript function from scratch and then execute it.</p>
                        </div>
                    </div>
                    <ToolCreationLab />
                </section>
            </main>
        </div>
    );
}
