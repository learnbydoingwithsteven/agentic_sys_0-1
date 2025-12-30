'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface LegalClause {
    id: string;
    type: 'RISK' | 'OBLIGATION' | 'NEUTRAL';
    text: string;
    explanation: string;
}

export async function analyzeContract(text: string, modelName: string = 'auto'): Promise<LegalClause[]> {
    const systemPrompt = `You are an AI Legal Assistant. Analyze the provided contract text.
    Identify key clauses and classify them as 'RISK' (dangerous terms), 'OBLIGATION' (mandatory duties), or 'NEUTRAL' (standard).
    Return a strictly valid JSON array with objects containing: type, text (the exact clause snippet), and explanation (brief why).
    Example JSON: [{"type": "RISK", "text": "Terms...", "explanation": "Why..."}]
    Do not output any markdown or intro text, ONLY the JSON array.`;

    try {
        // We use jsonMode=false because we handle extraction manually, which is more robust for chatty models
        const rawResponse = await queryLLM(systemPrompt, text, modelName, false);

        const parsed = await extractJSON(rawResponse);

        // Ensure IDs exist and types match
        if (!Array.isArray(parsed)) throw new Error("Output is not an array");

        return parsed.map((item: any, idx: number) => ({
            id: String(idx),
            type: ['RISK', 'OBLIGATION', 'NEUTRAL'].includes(item.type) ? item.type : 'NEUTRAL',
            text: item.text || '',
            explanation: item.explanation || 'No explanation provided.'
        }));

    } catch (e) {
        console.error("Legal Analysis Failed", e);
        return [{
            id: 'error',
            type: 'NEUTRAL',
            text: 'Analysis Failed',
            explanation: `Model (${modelName}) failed to produce valid JSON. Try a larger model.`
        }];
    }
}
