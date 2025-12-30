'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ReflectionStep {
    attempt: number;
    content: string;
    critique: string;
    score: number; // 0-10
}

export async function runReflexionLoop(topic: string, modelName: string = 'auto'): Promise<ReflectionStep[]> {
    const steps: ReflectionStep[] = [];
    const maxAttempts = 3;

    let currentDraft = "";

    // Initial Draft Prompt
    const draftPrompt = `Write a short, descriptive paragraph about: ${topic}. Be creative.`;

    // Attempt 1
    currentDraft = await queryLLM("You are a Creative Writer.", draftPrompt, modelName, false);

    for (let i = 1; i <= maxAttempts; i++) {
        // Critique step
        const critiquePrompt = `You are a Strict Editor. Critique the following text:
        "${currentDraft}"
        
        Provide a concise critique of style, grammar, and imagery.
        Also provide a quality score (1-10).
        
        Return STRICT JSON: {"critique": "...", "score": 7}`;

        let critique = "No critique available.";
        let score = 5;

        try {
            const rawCritique = await queryLLM("Answer in JSON.", critiquePrompt, modelName, false);
            const parsed = await extractJSON(rawCritique);
            critique = parsed.critique || critique;
            score = Number(parsed.score) || score;
        } catch (e) {
            console.error("Critique failed", e);
        }

        steps.push({
            attempt: i,
            content: currentDraft,
            critique,
            score
        });

        // If score is perfect or last attempt, stop
        if (score >= 9 || i === maxAttempts) break;

        // Revise step for next loop
        const revisePrompt = `You are a Creative Writer. Rewrite the following text based on the critique to improve it.
        Original: "${currentDraft}"
        Critique: "${critique}"
        
        Output ONLY the rewritten paragraph.`;

        currentDraft = await queryLLM("You are an expert writer.", revisePrompt, modelName, false);
    }

    return steps;
}
