'use server'

type SentimentResult = {
    score: number;
    label: string;
    emotions: string[];
}

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

export async function analyzeSentimentAction(text: string): Promise<SentimentResult> {
    const model = await getOllamaModelName();

    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 800));
        const lower = text.toLowerCase();
        let score = 0;
        let label = 'Neutral';
        let emotions = ['calm'];

        if (lower.includes('good') || lower.includes('love') || lower.includes('happy') || lower.includes('great')) {
            score = 0.8;
            label = 'Positive';
            emotions = ['joy', 'excitement'];
        } else if (lower.includes('bad') || lower.includes('hate') || lower.includes('sad') || lower.includes('terrible')) {
            score = -0.8;
            label = 'Negative';
            emotions = ['anger', 'sadness'];
        }

        return { score, label, emotions };
    }

    try {
        const prompt = `Analyze sentiment of: "${text}". Return ONLY valid JSON matching this structure: { "score": <number between -1.0 and 1.0>, "label": "Positive"|"Negative"|"Neutral", "emotions": ["emotion1", "emotion2"] }`;

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, format: "json", stream: false })
        });
        const data = await res.json();
        return JSON.parse(data.response);
    } catch {
        return { score: 0, label: 'Error', emotions: [] };
    }
}
