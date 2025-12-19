'use server'

export type ChainStep = {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    output?: string;
}

export type ChainResult = {
    steps: ChainStep[];
    finalOutput: string;
}

// Helper to fetch models (reused logic)
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

async function callOllama(model: string, prompt: string): Promise<string> {
    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 1000));
        return `[Simulated Output for: ${prompt.slice(0, 20)}...]`;
    }
    try {
        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false })
        });
        const data = await res.json();
        return data.response;
    } catch {
        return "Error calling Ollama";
    }
}

export async function runSequentialChainAction(topic: string): Promise<ReadableStream> {
    // We can't return a stream directly easily in Next.js Server Actions without using specific stream APIs.
    // For simplicity in this demo, let's just return the full result or use a "step-by-step" approach where the client calls for each step?
    // Actually, Server Actions can return async generators or streams in newer Next.js patterns, 
    // but the safest standard way for a "Lab" effect is to have the client trigger steps or return a full object.

    // Let's implement a single-step runner for the client to orchestrate, 
    // giving the client full control over the visual "stepper".
    return new ReadableStream(); // Placeholder
}

// Client will call this for each step

// Client will call this for each step (simulating a "Sequential Chain" logic manually)
// In a full LangChain implementation, this would be `chain.run(topic)`.
export async function executeStepAction(stepName: string, inputContext: string): Promise<string> {
    const model = await getOllamaModelName();

    let prompt = "";
    if (stepName === 'Research') {
        prompt = `You are a Research Agent. Provide exactly 3 key facts about: "${inputContext}". Keep it concise.`;
    } else if (stepName === 'Draft') {
        prompt = `You are a Writer Agent. Using these facts, write a short, engaging introductory paragraph:\nFacts: ${inputContext}`;
    } else if (stepName === 'Translate') {
        prompt = `You are a Translator Agent. Translate the following text into professional Spanish:\nText: "${inputContext}"`;
    } else {
        prompt = inputContext;
    }

    return await callOllama(model, prompt);
}
