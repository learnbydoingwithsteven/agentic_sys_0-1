'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ProtocolResult {
    sloppyOutput: string;
    strictOutput: object | null;
    schemaUsed: string;
}

export async function runProtocolTest(userRequest: string, modelName: string = 'auto'): Promise<ProtocolResult> {

    // 1. Sloppy (Natural Language) Attempt
    const sloppyPrompt = `You are a waiter.
    The user says: "${userRequest}"
    Write down the order for the kitchen.`;

    const sloppyOutput = await queryLLM(sloppyPrompt, "Take the order.", modelName, false);

    // 2. Strict (Protocol) Attempt
    const schema = `{
  "items": [
    { "name": "string", "quantity": "number", "notes": "string" }
  ],
  "tableNumber": "number",
  "priority": "LOW" | "HIGH"
}`;

    const strictPrompt = `You are an Order API.
    The user says: "${userRequest}"
    
    You MUST extract the order into valid JSON matching this schema:
    ${schema}
    
    Return ONLY JSON.`;

    let strictOutput = null;
    try {
        const rawStrict = await queryLLM(strictPrompt, "Extract JSON.", modelName, false);
        strictOutput = await extractJSON(rawStrict);
    } catch (e) {
        console.error("Strict parsing failed", e);
    }

    return {
        sloppyOutput,
        strictOutput,
        schemaUsed: schema
    };
}
