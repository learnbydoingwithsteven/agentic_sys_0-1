'use server';

const OLLAMA_BASE = 'http://localhost:11434/api';

export async function getAvailableModels(): Promise<string[]> {
    try {
        const response = await fetch(`${OLLAMA_BASE}/tags`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.models.map((m: any) => m.name).filter((n: string) => !n.includes('embed'));
    } catch (e) {
        console.error("Failed to fetch Ollama models:", e);
        return [];
    }
}

export async function extractJSON(text: string): Promise<any> {
    try {
        // 1. Try straightforward parse
        return JSON.parse(text);
    } catch (e) {
        // 2. Extract content between ```json and ``` or just ```
        const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            try { return JSON.parse(match[1]); } catch (e2) { /* continue */ }
        }

        // 3. Regex for Array [...]
        const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
            try { return JSON.parse(arrayMatch[0]); } catch (e3) { /* continue */ }
        }

        // 4. Regex for Object {...}
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            try { return JSON.parse(objectMatch[0]); } catch (e4) { /* continue */ }
        }

        throw new Error("No JSON found in response");
    }
}

export async function queryLLM(systemPrompt: string, userPrompt: string, model: string, jsonMode: boolean = false): Promise<string> {

    // Auto-select if model is explicitly 'auto' or empty
    let selectedModel = model;
    if (!selectedModel || selectedModel === 'auto') {
        const models = await getAvailableModels();
        if (models.length > 0) {
            selectedModel = models[0];
        } else {
            return "Error: No local Ollama models found. Please pull a model (e.g., 'ollama pull llama3').";
        }
    }

    try {
        const response = await fetch(`${OLLAMA_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: selectedModel,
                prompt: `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`,
                stream: false,
                format: jsonMode ? 'json' : undefined,
                options: {
                    temperature: 0.1 // Lowered to 0.1 for maximum determinism
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("LLM Query Failed:", error);
        return `Error: Failed to query model ${selectedModel}. Is Ollama running?`;
    }
}
