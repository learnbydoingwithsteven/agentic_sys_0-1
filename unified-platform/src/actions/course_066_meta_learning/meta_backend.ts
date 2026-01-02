'use server';

import { queryLLM } from '@/lib/llm_helper';

export async function runFewShotTask(examples: { input: string, output: string }[], query: string, modelName: string = 'auto'): Promise<string> {

    // Construct the prompt dynamically with examples (In-Context Learning)
    const exampleText = examples.map(e => `Input: ${e.input}\nOutput: ${e.output}`).join('\n\n');

    const systemPrompt = `You are a pattern completion engine.
    Analyze the provided Examples to understand the transformation rule (e.g. translation, reformatting, sentiment reversal).
    Apply the SAME rule to the final Input.
    Output ONLY the result. No chat.`;

    const userPrompt = `Examples:
${exampleText}

Input: ${query}
Output:`;

    try {
        const response = await queryLLM(systemPrompt, userPrompt, modelName);
        return response.trim();
    } catch (e) {
        return "Error: Could not infer pattern.";
    }
}
