'use server'

type QAResponse = {
    answer: string;
    source?: string;
    confidence: number;
}

// Simulated knowledge base
const KNOWLEDGE_BASE = `
The Python standard library is extensive, offering a wide range of facilities.
React is a JavaScript library for building user interfaces, maintained by Meta.
SpaceX designs, manufactures and launches advanced rockets and spacecraft.
Ollama is a tool for running large language models locally.
`;

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

export async function askQuestionAction(question: string, contextProvided: boolean): Promise<QAResponse> {
    const model = await getOllamaModelName();

    if (model === 'simulation') {
        await new Promise(r => setTimeout(r, 1200));

        // Simulation logic
        const lowerQ = question.toLowerCase();
        if (contextProvided) {
            if (lowerQ.includes('react')) return { answer: "React is a JavaScript library for building UIs, maintained by Meta.", source: "Knowledge Base", confidence: 0.95 };
            if (lowerQ.includes('ollama')) return { answer: "Ollama is a tool for running LLMs locally.", source: "Knowledge Base", confidence: 0.92 };
            if (lowerQ.includes('spacex')) return { answer: "SpaceX designs and launches advanced rockets.", source: "Knowledge Base", confidence: 0.98 };
            return { answer: "I couldn't find a specific answer in the provided context, but I can try to answer generally.", source: "General Knowledge", confidence: 0.4 };
        } else {
            // Closed book - simplified
            return { answer: "Without external context, I'm relying on my training data. " + question + " is an interesting topic.", source: "Model Training", confidence: 0.6 };
        }
    }

    try {
        let prompt;
        if (contextProvided) {
            prompt = `Use the following context to answer the question. If the answer is not in the context, say "I don't know based on the context".\n\nContext:\n${KNOWLEDGE_BASE}\n\nQuestion: ${question}\n\nAnswer:`;
        } else {
            prompt = `Answer this question concisely based on your training data:\n\nQuestion: ${question}`;
        }

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false })
        });
        const data = await res.json();
        return {
            answer: data.response.trim(),
            source: contextProvided ? "Injected Context" : "Model Weights",
            confidence: 0.85 // Mock confidence for real LLM
        };
    } catch {
        return { answer: "Error processing request.", confidence: 0 };
    }
}
