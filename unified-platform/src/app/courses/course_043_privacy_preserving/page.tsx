import React from 'react';
import { PrivacyLab } from '@/components/demos/course_043_privacy_preserving/PrivacyLab';
import { Shield, Lock } from 'lucide-react';

export default function CoursePage() {
    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">
            <main className="flex-1 max-w-6xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
                <header className="mb-12">
                    <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 5.3</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        Privacy-Preserving Agents
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Data minimization first. Deploy a <strong>PII Redaction Layer</strong> that intercepts and sanitizes sensitive information (Emails, Credit Cards) before it ever hits the LLM context.
                    </p>
                </header>

                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: The Sanitizer</h2>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5"><Shield className="w-4 h-4" /></div>
                            <p><strong>Goal:</strong> Enter text with fake credit cards or emails. Watch the system automatically detect them and replace them with placeholders like [EMAIL_REDACTED].</p>
                        </div>
                    </div>
                    <PrivacyLab />
                </section>
            </main>
        </div>
    );
}
