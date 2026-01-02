'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface DebateTurn {
    speaker: 'Pro' | 'Con';
    text: string;
}

export async function runDebateRound(topic: string, history: DebateTurn[], modelName: string = 'auto'): Promise<DebateTurn> {
    const nextSpeaker = history.length % 2 === 0 ? 'Pro' : 'Con';
    const lastTurn = history.length > 0 ? history[history.length - 1] : null;

    const systemPrompt = `You are an expert Debater arguing the ${nextSpeaker} position on the topic: "${topic}".
    
    Rules:
    - If this is the Opening Statement, set the stage and define your core arguments.
    - If responding, you MUST directly address the opponent's last point.
    - Be persuasive, logical, and concise (under 100 words).
    - Do NOT be polite or agreeable; this is a competitive debate.
    - Maintain a professional but firm tone.`;

    const userPrompt = lastTurn
        ? `Opponent's Argument: "${lastTurn.text}"\n\nYour Rebuttal:`
        : `Make your opening statement for the ${nextSpeaker} side.`;

    try {
        const reply = await queryLLM(systemPrompt, userPrompt, modelName, false);

        return {
            speaker: nextSpeaker,
            text: reply
        };
    } catch (error) {
        console.error("Debate turn failed:", error);
        return {
            speaker: nextSpeaker,
            text: "I cannot formulate a response at this time."
        };
    }
}
