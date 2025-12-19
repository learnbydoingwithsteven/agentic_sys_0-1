'use server'

async function getOllamaModelName(): Promise<string> {
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags');
        if (!res.ok) return 'simulation';
        const data = await res.json();
        return data.models?.[0]?.name || 'simulation';
    } catch {
        return 'simulation';
    }
}

export async function summarizeTextAction(text: string, length: 'short' | 'medium' | 'long'): Promise<string> {
    const model = await getOllamaModelName();

    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 1500));
        // Simple heuristic for simulation
        const sentences = text.split('. ');
        if (length === 'short') return sentences.slice(0, 1).join('. ') + '...';
        if (length === 'medium') return sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '...';
        return text; // Long = mostly full text in simulation
    }

    try {
        let instruction = "";
        if (length === 'short') instruction = "Summarize this in one concise sentence.";
        if (length === 'medium') instruction = "Summarize this in a short paragraph (3-4 sentences).";
        if (length === 'long') instruction = "Provide a detailed summary, covering all key points.";

        const prompt = `${instruction}\n\nText: "${text}"\n\nSummary:`;

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false })
        });
        const data = await res.json();
        return data.response.trim();
    } catch {
        return "Error generating summary.";
    }
}
