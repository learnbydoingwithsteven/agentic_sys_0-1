import React from 'react';
import { VoiceLab } from '@/components/demos/course_069_voice_agent/VoiceLab';
import { Mic, Volume2 } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
        <header className="mb-12">
          <div className="text-sm font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase mb-3">Module 7.9</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent">
            Voice-Enabled Agents
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Break the keyboard barrier. Implement Speech-to-Text (STT) and Text-to-Speech (TTS) pipelines for real-time conversational agents.
          </p>
        </header>

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Lab: Talk to the AI</h2>
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800 rounded-xl text-sm text-cyan-800 dark:text-cyan-200 flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Mic className="w-4 h-4" /></div>
              <p><strong>Goal:</strong> Hold the button to "speak". Watch the waveform visualize the pipeline: Listen -&gt; Transcribe -&gt; Think -&gt; Speak.</p>
            </div>
          </div>
          <VoiceLab />
        </section>
      </main>
    </div>
  );
}
