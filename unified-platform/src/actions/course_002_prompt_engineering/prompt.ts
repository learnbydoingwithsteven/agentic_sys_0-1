'use server'

export type PromptResult = {
    response: string;
    tokens: number;
    latency: number;
    model: string;
    error?: string;
};

export type OllamaModel = {
    name: string;
    model: string;
    size: number;
    digest: string;
    details: {
        format: string;
        family: string;
        families: string[] | null;
        parameter_size: string;
        quantization_level: string;
    }
};

export async function getOllamaModels(): Promise<string[]> {
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags', {
            next: { revalidate: 10 } // Check every 10 seconds max
        });
        if (!res.ok) return [];

        const data = await res.json();
        return data.models.map((m: OllamaModel) => m.name);
    } catch (error) {
        console.warn("Could not fetch Ollama models:", error);
        return [];
    }
}

export async function runOllamaPrompt(formData: FormData): Promise<PromptResult> {
    const technique = formData.get('technique') as string;
    const prompt = formData.get('prompt') as string;
    const selectedModel = formData.get('model') as string;

    // Fallback logic if no model selected or passed
    let targetModel = selectedModel;

    if (!targetModel) {
        // Try to auto-detect if not provided
        const available = await getOllamaModels();
        if (available.length > 0) {
            targetModel = available[0];
        } else {
            targetModel = 'llama3.2'; // Default fallback
        }
    }

    let finalPrompt = prompt;


    if (technique === 'cot') {
        finalPrompt += "\n\nLet's think step by step.";
    } else if (technique === 'role') {
        // If the user hasn't specified a role in the prompt, this adds a generic expert wrapper
        // But if they have, it's cumulative. We'll make it generic.
        finalPrompt = "Act as an expert on this topic. " + finalPrompt;
    } else if (technique === 'socratic') {
        finalPrompt += "\n\nDo not give the answer directly. Instead, ask guiding questions to help the user discover the answer themselves.";
    } else if (technique === 'reflection') {
        finalPrompt += "\n\nAfter providing your answer, critique it. List 2 potential limitations or biases in your response.";
    }

    const start = Date.now();

    try {
        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: targetModel,
                prompt: finalPrompt,
                stream: false
            })
        });

        if (!res.ok) {
            throw new Error(`Ollama API returned ${res.status}`);
        }

        const data = await res.json();
        const end = Date.now();

        return {
            response: data.response,
            tokens: data.eval_count || 0,
            latency: end - start,
            model: data.model
        };
    } catch (e) {
        console.error("Ollama connection failed", e);
        // Fallback Simulation
        await new Promise(r => setTimeout(r, 800));
        return {
            response: `[SIMULATION MODE - OLLAMA ISSUE]\n\nI couldn't connect to Ollama or find model '${targetModel}'.\n\n1. Ensure Ollama is running (ollama serve).\n2. Ensure you have a model pulled (ollama pull ${targetModel}).\n\nSimulated output for '${technique}':\nBased on your prompt: "${prompt.substring(0, 50)}...", I would generate a response here.`,
            tokens: 0,
            latency: Date.now() - start,
            model: 'Simulated Environment',
            error: 'Connection/Model Failed'
        };
    }
}
