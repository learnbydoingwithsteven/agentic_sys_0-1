'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface VoiceResponse {
    transcript: string; // Echo back for confirmation
    reply: string;
    audio: boolean;
}

export async function processVoiceInput(userText: string, modelName: string = 'auto'): Promise<VoiceResponse> {

    // System Prompt for a conversational voice assistant
    const systemPrompt = "You are a helpful, concise Voice Assistant. Keep responses short (1-2 sentences) and conversational, as they will be spoken aloud.";

    try {
        const reply = await queryLLM(systemPrompt, userText, modelName);

        return {
            transcript: userText,
            reply: reply,
            audio: true
        };
    } catch (e) {
        return {
            transcript: userText,
            reply: "I'm having trouble thinking right now.",
            audio: false
        };
    }
}
