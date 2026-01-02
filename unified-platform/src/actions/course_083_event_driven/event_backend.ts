'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentAction {
    agentName: string;
    role: string;
    didAct: boolean;
    reason: string;
    output?: string;
}

const AGENTS = [
    { name: 'FinancialBot', role: 'Analyze stock market trends, earnings, and economy.' },
    { name: 'SportsBot', role: 'Report on football, basketball, and scores.' },
    { name: 'TechBot', role: 'Cover software releases, AI, and hardware.' }
];

export async function publishEvent(headline: string, modelName: string = 'auto'): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    // Simulate Event Bus Broadcast
    // In a real system, this would be an N-fanout
    for (const agent of AGENTS) {
        const systemPrompt = `You are ${agent.name}. Your role is: ${agent.role}.
        You are monitoring a news feed.
        Receive the headline. Decide if it is relevant to your niche.
        If RELEVANT, set "act": true and write a 1-sentence tweet in "output".
        If NOT RELEVANT, set "act": false.
        
        Return JSON: { "act": boolean, "reason": "string", "output": "string" (optional) }`;

        let result = { act: false, reason: "Error", output: "" };
        try {
            const raw = await queryLLM(systemPrompt, `Headline: "${headline}"`, modelName, true);
            result = await extractJSON(raw);
        } catch (e) {
            result.reason = "LLM Failed";
        }

        actions.push({
            agentName: agent.name,
            role: agent.role,
            didAct: result.act,
            reason: result.reason,
            output: result.output
        });
    }

    return actions;
}
