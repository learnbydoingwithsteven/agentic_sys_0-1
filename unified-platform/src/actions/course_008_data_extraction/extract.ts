'use server'

type ExtractedData = {
    name?: string;
    date?: string;
    location?: string;
    email?: string;
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

export async function extractDataAction(text: string): Promise<ExtractedData> {
    const model = await getOllamaModelName();

    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 1000));
        // Simple regex heuristics for simulation
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const dateMatch = text.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}/);

        return {
            email: emailMatch ? emailMatch[0] : undefined,
            date: dateMatch ? dateMatch[0] : undefined,
            name: "John Doe (Simulated)",
            location: "New York (Simulated)"
        };
    }

    try {
        const prompt = `Extract entities from this text. Return JSON with keys: "name", "date", "location", "email". If missing, set to null.\n\nText: "${text}"`;

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, format: "json", stream: false })
        });
        const data = await res.json();
        return JSON.parse(data.response);
    } catch {
        return {};
    }
}
