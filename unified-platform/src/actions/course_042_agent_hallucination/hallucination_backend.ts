'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface FactCheck {
    sentence: string;
    isHallucinated: boolean;
    reason?: string;
}

export async function checkHallucination(source: string, response: string, modelName: string = 'auto'): Promise<FactCheck[]> {
    const systemPrompt = `You are a Fact Checking Agent.
    Your job is to verify the 'Agent Response' against the 'Ground Truth Source'.
    
    For EACH sentence in the 'Agent Response':
    1. Determine if it is fully supported by the Source.
    2. If it contains facts (dates, names, events) NOT found in the source, mark it as a Hallucination.
    
    Return a strictly valid JSON array of objects:
    [
      { "sentence": "...", "isHallucinated": true, "reason": "Claimed John Glenn commanded, but source says Neil Armstrong." },
      { "sentence": "...", "isHallucinated": false }
    ]`;

    try {
        const rawResponse = await queryLLM(systemPrompt, `Source: "${source}"\n\nAgent Response: "${response}"`, modelName, false);
        const parsed = await extractJSON(rawResponse);

        if (!Array.isArray(parsed)) throw new Error("Parsed JSON is not an array");

        return parsed.map((item: any) => ({
            sentence: item.sentence || "Unknown sentence",
            isHallucinated: !!item.isHallucinated,
            reason: item.reason || (item.isHallucinated ? "Not found in source text." : undefined)
        }));

    } catch (e) {
        console.error("Fact Check Failed", e);
        // Fallback or Error reporting
        return [
            {
                sentence: "Error running fact check.",
                isHallucinated: true,
                reason: `Model (${modelName}) failed to return valid JSON analysis.`
            }
        ];
    }
}
