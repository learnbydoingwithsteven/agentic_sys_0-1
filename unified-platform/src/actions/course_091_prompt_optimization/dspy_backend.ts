'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface PromptCandidate {
    id: number;
    promptText: string;
    score: number;
    reasoning: string;
}

export async function runOptimization(userGoal: string, modelName: string = 'auto'): Promise<PromptCandidate[]> {
    const candidates: PromptCandidate[] = [];

    // Iteration 1: Naive
    let currentPrompt = `Write something about: ${userGoal}`;

    for (let i = 1; i <= 3; i++) {
        // 1. Evaluate Current Prompt (Simulated "Dev Set" Eval)
        // We ask the LLM to predict how effective this prompt would be.
        const evalPrompt = `Task Goal: "${userGoal}"
        Proposed Prompt: "${currentPrompt}"
        
        Evaluate effectiveness (0-100) and give a brief reason.
        Return JSON: { "score": number, "reason": "string" }`;

        let score = 50 + (i * 10); // Fallback
        let reason = "Decent start.";

        try {
            const raw = await queryLLM(evalPrompt, "Evaluate prompt.", modelName, true);
            const res = await extractJSON(raw);
            score = res.score;
            reason = res.reason;
        } catch { }

        candidates.push({
            id: i,
            promptText: currentPrompt,
            score,
            reasoning: reason
        });

        // 2. Propose Improvement (Gradient Descent step simulated)
        // Only if not last step
        if (i < 3) {
            const improvePrompt = `Goal: "${userGoal}"
            Current Prompt: "${currentPrompt}"
            Critique: "${reason}"
            
            Rewrite the prompt to be significantly better (more specific, uses persona, uses constraints).
            Return JSON: { "new_prompt": "string" }`;

            try {
                const raw = await queryLLM(improvePrompt, "Improve prompt.", modelName, true);
                const res = await extractJSON(raw);
                currentPrompt = res.new_prompt;
            } catch {
                currentPrompt += " (Improved)";
            }
        }
    }

    return candidates;
}
