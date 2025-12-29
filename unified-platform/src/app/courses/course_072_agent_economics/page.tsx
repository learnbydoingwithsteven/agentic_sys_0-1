import React from 'react';
import { EconomicsLab } from '@/components/demos/course_072_agent_economics/EconomicsLab';
import { DollarSign, PieChart } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">Module 7.12</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                        Agent Economics
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Intelligence isn't free. Master the art of <strong>Token Budgeting</strong> and ROI. Learn when to use "Cheap & Fast" vs "Expensive & Smart" models.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: Profit & Loss</h2>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><DollarSign className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Simulate business tasks. Pick the right model for the job to maximize your Net Profit. Don't overpay for simple tasks!</p>
                        </div>
                    </div>
                    <EconomicsLab />
                </section>
            </main>
        </div>
    );
}
