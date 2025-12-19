'use server'

import { revalidatePath } from 'next/cache';

// Reusing helper
async function getOllamaModelName(): Promise<string> {
    try { // revalidate logic needed?
        const res = await fetch('http://127.0.0.1:11434/api/tags');
        if (!res.ok) return 'simulation';
        const data = await res.json();
        return data.models?.[0]?.name || 'simulation';
    } catch {
        return 'simulation';
    }
}

export async function classifyTextAction(text: string, categories: string[]): Promise<string> {
    const model = await getOllamaModelName();

    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 800));
        // Simple heuristic for simulation
        const lower = text.toLowerCase();
        if (lower.includes('buy') || lower.includes('offer')) return 'Sales';
        if (lower.includes('help') || lower.includes('issue')) return 'Support';
        if (lower.includes('win') || lower.includes('free')) return 'Spam';
        return 'General';
    }

    try {
        const prompt = `Classify this text into exactly one of these categories: ${categories.join(', ')}. Return ONLY the category name, no other text.\n\nText: "${text}"\nCategory:`;

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false })
        });
        const data = await res.json();
        return data.response.trim();
    } catch {
        return "Error";
    }
}
