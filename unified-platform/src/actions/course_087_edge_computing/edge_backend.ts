'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface EdgeResult {
    edgeDecision: 'LOCAL_PROCESS' | 'ROUTE_TO_CLOUD';
    edgeThinking: string;
    cloudResponse?: string;
    totalLatency: number;
    path: 'EDGE_ONLY' | 'EDGE_THEN_CLOUD';
}

export async function processEdgeRequest(input: string, modelName: string = 'auto'): Promise<EdgeResult> {
    const start = Date.now();

    // 1. Edge Agent (Simulated Small Model)
    // Role: Quickly classify if this needs immediate local action OR cloud intelligence.
    // Rule: Urgent safety/local alerts -> LOCAL. Knowledge/Complex -> CLOUD.

    const edgePrompt = `You are a Tiny Edge AI running on a router.
    Input: "${input}"
    
    Task: Classify Urgency.
    - If it's a critical safety alert, fire, intruder, or simple local command (light on), choose LOCAL_PROCESS.
    - If it's a general knowledge question, analysis, or complex query, choose ROUTE_TO_CLOUD.
    
    Return JSON: { "decision": "LOCAL_PROCESS" | "ROUTE_TO_CLOUD", "reason": "brief" }`;

    let edgeData = { decision: 'ROUTE_TO_CLOUD', reason: 'Default' };

    // Simulate "Edge" being fast/limited (we use regular LLM but prompt it to be edge)
    const rawEdge = await queryLLM(edgePrompt, "Classify.", modelName, true);
    try {
        edgeData = await extractJSON(rawEdge);
    } catch {
        edgeData = { decision: 'ROUTE_TO_CLOUD', reason: 'Edge Failure' };
    }

    if (edgeData.decision === 'LOCAL_PROCESS') {
        const latency = Date.now() - start; // Fast
        return {
            edgeDecision: 'LOCAL_PROCESS',
            edgeThinking: edgeData.reason,
            path: 'EDGE_ONLY',
            totalLatency: latency,
            cloudResponse: "🚨 LOCAL ALERT TRIGGERED: Immediate Action Taken."
        };
    } else {
        // 2. Cloud Agent (Simulated Large Model)
        // Simulate network latency
        await new Promise(r => setTimeout(r, 1000));

        const cloudPrompt = `You are the Cloud AI. Answer the user request: "${input}"`;
        const cloudRes = await queryLLM(cloudPrompt, "Answer clearly.", modelName);

        const latency = Date.now() - start; // Slow

        return {
            edgeDecision: 'ROUTE_TO_CLOUD',
            edgeThinking: edgeData.reason,
            path: 'EDGE_THEN_CLOUD',
            totalLatency: latency,
            cloudResponse: cloudRes
        };
    }
}
