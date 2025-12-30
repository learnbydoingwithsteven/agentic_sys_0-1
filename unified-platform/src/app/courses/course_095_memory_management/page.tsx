import React from 'react';
import { MemoryLab } from '@/components/demos/course_095_memory_management/MemoryLab';
import { HardDrive, Brain } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-pink-600 dark:text-pink-400 uppercase mb-3">Module 12.2</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                        Agent Memory Management
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Infinite Context. distinct <strong>Short-Term (RAM)</strong> vs <strong>Long-Term (Disk)</strong> memory tiers (MemGPT style) to handle long-running agent conversations.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: Memory Hierarchy</h2>
                        <div className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800 rounded-xl text-sm text-pink-800 dark:text-pink-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><HardDrive className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Chat with the agent. Watch as the "Context Window" fills up and evicts old messages, while important facts ("My name is...") are automatically saved to Long-Term storage.</p>
                        </div>
                    </div>
                    <MemoryLab />
                </section>
            </main>
        </div>
    );
}
