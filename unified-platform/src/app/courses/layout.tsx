import { CourseNavigation } from '@/components/CourseNavigation';
import fs from 'fs';
import path from 'path';
import React from 'react';

// Get sorted list of course slugs
function getCourseSlugs() {
    const coursesDir = path.join(process.cwd(), 'src/app/courses');
    if (!fs.existsSync(coursesDir)) return [];

    // Read dir, filter folders starting with course_
    const entries = fs.readdirSync(coursesDir, { withFileTypes: true });

    const slugs = entries
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('course_'))
        .map(dirent => dirent.name)
        .sort((a, b) => {
            // Extract number
            const numA = parseInt(a.match(/course_(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/course_(\d+)/)?.[1] || '0');
            return numA - numB;
        });

    return slugs;
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    const allCourses = getCourseSlugs();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 w-full">
                {children}
            </div>
            {/* Render Navigation Footer */}
            <div className="pb-8 w-full flex justify-center">
                <CourseNavigation allCourses={allCourses} />
            </div>
        </div>
    );
}
