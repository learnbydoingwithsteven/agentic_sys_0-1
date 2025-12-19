"use client";

import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure you have this utility or remove/replace

interface Section {
    title: string;
    content: string; // HTML string
}

interface StaticCoursePageProps {
    id: string; // e.g., "course_050"
    title: string;
    description: string;
    level: string;
    sections: Section[];
    demoId: string; // course_050
}

export default function StaticCoursePage({ id, title, description, level, sections, demoId }: StaticCoursePageProps) {

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Content Area */}
            <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className={cn(
                        "text-sm font-bold tracking-wider uppercase mb-3",
                        level === "beginner" ? "text-green-600" :
                            level === "intermediate" ? "text-orange-600" :
                                level === "advanced" ? "text-pink-600" : "text-purple-600"
                    )}>
                        {id.replace(/_/g, ' ').replace('course', '').trim().toUpperCase()} • {level.toUpperCase()}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                        {description}
                    </p>
                </header>

                {sections.map((section, idx) => (
                    <section key={idx} className="mb-12 scroll-mt-20 prose prose-slate max-w-none legacy-content">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 text-sm font-mono">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            {section.title}
                        </h2>
                        {/* Safe interpretation of the HTML content extracted */}
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    </section>
                ))}

            </main>

            {/* Legacy Demo Area - Iframe Implementation */}
            <aside className="lg:w-96 xl:w-[28rem] px-6 lg:px-8 py-12 border-l border-slate-200 bg-slate-50/50">
                <div className="sticky top-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50/50 backdrop-blur-sm">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Zap className="w-5 h-5 text-orange-500" />
                                Interactive Demo
                            </h3>
                        </div>
                        <div className="bg-slate-50 w-full h-[600px]">
                            <iframe
                                src={`/legacy_demos/${demoId}.html`}
                                className="w-full h-full border-none"
                                title="Course Demo"
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
