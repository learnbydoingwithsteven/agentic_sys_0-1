'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ServerInstance {
    id: string;
    name: string;
    type: 'FAST' | 'GENERAL' | 'REASONING';
    load: number;
    description: string;
}

export interface RouterDecision {
    targetId: string;
    reasoning: string;
    complexityScore: number;
}

export async function routeAndExecute(query: string, servers: ServerInstance[], modelName: string = 'auto'): Promise<{ decision: RouterDecision, response: string }> {

    // 1. Semantic Router Step
    const routerSystem = `You are a Semantic Load Balancer.
    Analyze the User Query complexity and routing requirements.
    
    Available Server Types:
    - FAST: Simple greetings, factual lookups, short tasks. (Complexity 1-3)
    - GENERAL: Standard summarization, email writing, explanations. (Complexity 4-7)
    - REASONING: Complex analysis, math, logic puzzles, coding. (Complexity 8-10)
    
    Return JSON:
    {
      "target_type": "FAST" | "GENERAL" | "REASONING",
      "complexity_score": number,
      "reasoning": "Short explanation"
    }`;

    // We assume the frontend passed us the 3 servers. We just need to map TYPE to ID.
    // In strict sense, we route to a TYPE, then pick an ID (Round Robin within Type if multiple).

    let decision = { target_type: 'GENERAL', complexity_score: 5, reasoning: 'Default' };

    try {
        const raw = await queryLLM(routerSystem, `Query: "${query}"`, modelName, true);
        decision = await extractJSON(raw);
    } catch (e) {
        console.error("Router failed", e);
    }

    // Map Type to ID
    // Find matching servers
    const candidates = servers.filter(s => s.type === decision.target_type);
    // Fallback to General if none
    const targetServer = candidates.length > 0 ? candidates[0] : servers.find(s => s.type === 'GENERAL') || servers[0];

    // 2. Execution Step (Simulated Worker capabilities using System Prompts)
    let workerSystem = "You are a helpful assistant.";
    if (targetServer.type === 'FAST') workerSystem = "You are a Fast Response Bot. Answer as briefly as possible. Max 1 sentence.";
    if (targetServer.type === 'REASONING') workerSystem = "You are a Deep Reasoning Bot. Think step by step. Be verbose.";

    const response = await queryLLM(workerSystem, query, modelName);

    return {
        decision: {
            targetId: targetServer.id,
            reasoning: decision.reasoning,
            complexityScore: decision.complexity_score
        },
        response
    };
}
