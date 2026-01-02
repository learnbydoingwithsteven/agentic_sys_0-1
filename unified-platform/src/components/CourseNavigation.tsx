'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export function CourseNavigation({ allCourses }: { allCourses: string[] }) {
    const pathname = usePathname();
    // pathname e.g. "/courses/course_001_intro..."
    // extract slug
    const currentSlug = pathname?.split('/').pop() || '';

    // Find index of current slug in sorted list
    const currentIndex = allCourses.findIndex(c => c === currentSlug);

    if (currentIndex === -1) return null; // Not a course page or not found

    const prev = currentIndex > 0 ? allCourses[currentIndex - 1] : null;
    const next = currentIndex < allCourses.length - 1 ? allCourses[currentIndex + 1] : null;

    return (
        <div className="flex justify-between items-center py-6 px-8 bg-zinc-950/80 backdrop-blur border-t border-zinc-900 mt-12 w-full max-w-7xl mx-auto rounded-t-3xl shadow-2xl">
            {prev ? (
                <Link href={`/courses/${prev}`} className="flex items-center gap-4 text-zinc-400 hover:text-white transition-all group p-2 rounded-xl hover:bg-zinc-900/50">
                    <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">Previous</div>
                        <div className="font-medium text-sm truncate max-w-[150px]">{formatName(prev)}</div>
                    </div>
                </Link>
            ) : <div className="w-32" />}

            {/* Indicator */}
            <div className="flex flex-col items-center">
                <div className="bg-zinc-900 text-zinc-500 px-4 py-1 rounded-full text-[10px] font-mono border border-zinc-800">
                    MODULE {currentIndex + 1} OF {allCourses.length}
                </div>
            </div>

            {next ? (
                <Link href={`/courses/${next}`} className="flex items-center gap-4 text-zinc-400 hover:text-white transition-all group p-2 rounded-xl hover:bg-zinc-900/50">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">Next</div>
                        <div className="font-medium text-sm truncate max-w-[150px]">{formatName(next)}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </Link>
            ) : <div className="w-32" />}
        </div>
    );
}

function formatName(slug: string) {
    // course_001_intro_agents -> Intro Agents
    // course_068_computer_vision -> Computer Vision
    return slug.replace(/course_\d+_/, '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
