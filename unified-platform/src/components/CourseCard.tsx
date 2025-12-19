"use client";

import { motion } from "framer-motion";
import { Course } from "@/lib/courses";
import { BadgeCheck, Clock, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CourseCardProps {
    course: Course;
    index: number;
}

const levelColors = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-orange-100 text-orange-700 border-orange-200",
    advanced: "bg-pink-100 text-pink-700 border-pink-200",
    expert: "bg-purple-100 text-purple-700 border-purple-200",
    master: "bg-blue-100 text-blue-700 border-blue-200",
};

export function CourseCard({ course, index }: CourseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span
                        className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide",
                            levelColors[course.level]
                        )}
                    >
                        {course.level}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">#{String(course.id).padStart(3, '0')}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.tags[0]}</span>
                    </div>
                </div>

                <Link
                    href={`/courses/${course.folder}`}
                    className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors gap-2 group/btn"
                >
                    Start Course
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
