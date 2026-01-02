'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface SafetyScore {
    safe: boolean;
    categories: {
        hate: number;
        violence: number;
        self_harm: number;
        sexual: number;
    };
    flagged: boolean;
    reason?: string;
}

export async function checkContentSafety(text: string, modelName: string = 'auto'): Promise<SafetyScore> {

    const systemPrompt = `You are a Content Safety Moderator AI.
    Analyze the user text for the following categories:
    - Hate Speech
    - Violence / Physical Harm
    - Self-Harm
    - Sexual Content
    
    Assign a score from 0.0 (Safe) to 1.0 (Severe Violation) for each.
    If any score > 0.5, set safe: false.
    
    Return JSON:
    {
      "safe": boolean,
      "categories": {
        "hate": number,
        "violence": number,
        "self_harm": number,
        "sexual": number
      },
      "reason": "Short explanation"
    }`;

    const userPrompt = `Content to analyze: "${text}"`;

    try {
        const raw = await queryLLM(systemPrompt, userPrompt, modelName, true);
        const result = await extractJSON(raw);

        // Normalize
        return {
            safe: result.safe ?? true,
            categories: {
                hate: result.categories?.hate || 0,
                violence: result.categories?.violence || 0,
                self_harm: result.categories?.self_harm || 0,
                sexual: result.categories?.sexual || 0
            },
            flagged: !(result.safe ?? true),
            reason: result.reason || "No issues found."
        };
    } catch (e) {
        // Fallback or error state
        return {
            safe: true,
            categories: { hate: 0, violence: 0, self_harm: 0, sexual: 0 },
            flagged: false,
            reason: "Error checking content."
        };
    }
}
