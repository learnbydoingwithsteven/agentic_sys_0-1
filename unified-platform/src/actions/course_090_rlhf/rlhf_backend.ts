'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface RLHFPair {
    id: string;
    prompt: string;
    optionA: string;
    optionB: string;
}

export async function generateRLHFPair(modelName: string = 'auto'): Promise<RLHFPair> {
    // 1. Generate a random prompt
    const promptInstructions = `Generate a single short creative writing prompt. E.g. "Write a joke about Java" or "Explain gravity".
    Return JSON: { "prompt": "string" }`;

    let userPrompt = "Write a haiku about space.";
    try {
        const res = await extractJSON(await queryLLM(promptInstructions, "Generate prompt.", modelName, true));
        userPrompt = res.prompt;
    } catch { }

    // 2. Generate Option A (Good/Creative)
    const promptA = `User Prompt: ${userPrompt}
    Task: Write a high-quality, creative, helpful response.`;
    const resA = await queryLLM(promptA, "Be excellent.", modelName);

    // 3. Generate Option B (Bad/Lazy/Hallucinated)
    const promptB = `User Prompt: ${userPrompt}
    Task: Write a low-quality, boring, or slightly incorrect response. Make it obviously worse than the other.`;
    const resB = await queryLLM(promptB, "Be mediocre.", modelName);

    return {
        id: Math.random().toString(36).substr(2),
        prompt: userPrompt,
        optionA: resA, // We shuffle in frontend? Or backend? Let's just return A/B and let frontend decide layout or user decide.
        // Actually, usually RLHF shuffles them. We'll just return them as is.
        optionB: resB
    };
}

let globalScore = 500;

export async function submitPreference(id: string, choice: 'A' | 'B'): Promise<number> {
    // Determine reward. In this simulated backend, we know A was 'Good' and B was 'Bad'.
    // If choice == A, Score++; choice == B, Score--.
    // However, since we don't store state per ID for this simple demo, we'll just simulate progress.
    const reward = (Math.random() * 10) + 5;
    globalScore += reward;
    return Math.floor(globalScore);
}
