import React from 'react';
import { VisionLab } from '@/components/demos/course_068_computer_vision/VisionLab';
import { Eye, Image as ImageIcon } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase mb-3">Module 7.8</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
            Computer Vision Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Go beyond text descriptions. Use Object Detection (YOLO/SSD) to let agents finding specific items like cars, people, or products in images.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Object Detector</h2>
            <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-xl text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Eye className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Switch between Street and Office scenes. Run the detector to see bounding boxes drawn around identified objects.</p>
            </div>
          </div>
          <VisionLab />
        </section>
      </main>
    </div>
  );
}
