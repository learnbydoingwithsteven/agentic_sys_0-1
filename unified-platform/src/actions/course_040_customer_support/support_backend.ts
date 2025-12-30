'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface Ticket {
    id: string;
    message: string;
    category: 'REFUND' | 'TECHNICAL' | 'GENERAL';
    sentiment: 'ANGRY' | 'NEUTRAL' | 'HAPPY';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function triageTicket(message: string, modelName: string = 'auto'): Promise<Ticket> {
    const systemPrompt = `You are an AI Customer Support Agent.
    Analyze the incoming message.
    1. Classify Category: REFUND, TECHNICAL, or GENERAL.
    2. Analyze Sentiment: ANGRY, NEUTRAL, or HAPPY.
    3. Assign Priority: HIGH (if Angry or Refund), MEDIUM (Technical), LOW (General/Happy).
    
    Return pure JSON: {"category": "...", "sentiment": "...", "priority": "..."}`;

    try {
        const rawResponse = await queryLLM(systemPrompt, message, modelName, false);
        const parsed = await extractJSON(rawResponse);

        return {
            id: Math.random().toString(36).substr(2, 9),
            message,
            category: parsed.category || 'GENERAL',
            sentiment: parsed.sentiment || 'NEUTRAL',
            priority: parsed.priority || 'LOW'
        };
    } catch (e) {
        console.error("Triage Failed", e);
        // Fallback
        return {
            id: 'error',
            message,
            category: 'GENERAL',
            sentiment: 'NEUTRAL',
            priority: 'LOW'
        };
    }
}
