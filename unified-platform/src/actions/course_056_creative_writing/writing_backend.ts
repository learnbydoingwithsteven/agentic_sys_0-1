'use server';

import { queryLLM } from '@/lib/llm_helper';

export async function generateCreativeText(topic: string, style: string, modelName: string = 'auto'): Promise<string> {
    try {
        const systemPrompt = `You are a creative writer specializing in style mimicry.
        
        Task: Write a short, engaging paragraph (approx. 50-75 words) about the given topic.
        Target Style: ${style}
        
        Requirements:
        - Deeply embody the persona, vocabulary, tone, and sentence structure of this style.
        - Be creative and original.
        - Do not just describe the style; WRITE IN IT.`;

        const userPrompt = `Topic: "${topic}"\n\nWrite the paragraph now.`;

        // Use a slightly higher temperature if the helper allows (default is typically balanced), 
        // but queryLLM abstracts this. The prompt instruction "creative writer" usually guides the model enough.
        const output = await queryLLM(systemPrompt, userPrompt, modelName, false);
        return output;

    } catch (error) {
        console.error("Creative writing failed:", error);
        return "Alas, my creative muse is silent. Please try again.";
    }
}
