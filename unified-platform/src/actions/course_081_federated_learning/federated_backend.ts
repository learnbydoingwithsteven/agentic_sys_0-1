'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface FederatedRound {
    round: number;
    globalModel: string; // The aggregated insight
    nodeUpdates: { nodeId: string, insight: string }[];
}

// Private Data (Never leaves the node)
const NODE_DATA = {
    'Hospital A': "Patient 001: Fever, Cough. Patient 002: High Temp. Patient 003: Shivering. (Local outbreak of Flu).",
    'Hospital B': "Patient 004: Runny nose. Patient 005: Sneezing. Patient 006: Mild cough. (Seasonal Allergies).",
    'Hospital C': "Patient 007: Fatigue. Patient 008: Fever. Patient 009: Loss of smell. (Potential Viral Variant)."
};

// The Global Model starts empty
let globalState = "No insights yet.";

export async function runFederatedRound(roundNumber: number, modelName: string = 'auto'): Promise<FederatedRound> {

    // 1. Local Training (Simulation)
    // Each node acts as an Agent reading its PRIVATE data and the current GLOBAL state
    const nodeUpdates: { nodeId: string, insight: string }[] = [];

    const nodes = Object.keys(NODE_DATA);
    for (const node of nodes) {
        // Privacy: The Prompt contains PRIVATE_DATA, but the OUTPUT is just an INSIGHT (Gradient/Weights equivalent)
        const localPrompt = `
        You are a Local Learning Agent at ${node}.
        
        Your PRIVATE Data: "${NODE_DATA[node]}"
        Current Global Awareness: "${globalState}"
        
        Task: Analyze your private data. Provide a brief, anonymized insight to update the global model.
        Do NOT reveal specific patient IDs. Just report vectors/trends.
        `;

        const insight = await queryLLM("Summarize trends logically.", localPrompt, modelName);
        nodeUpdates.push({ nodeId: node, insight: insight });
    }

    // 2. Aggregation (Server)
    // The Server Agent sees ONLY the insights, NEVER the private data
    const aggregationPrompt = `
    You are the Federated Learning Server.
    
    Received Node Updates:
    ${nodeUpdates.map(n => `- ${n.nodeId}: ${n.insight}`).join('\n')}
    
    Task: Aggregate these insights into a new Global Disease Surveillance Report.
    Merge potential connecting patterns (e.g. Fever appearing in multiple places).
    `;

    const newGlobalState = await queryLLM("Aggregate insights.", aggregationPrompt, modelName);
    globalState = newGlobalState;

    return {
        round: roundNumber,
        globalModel: newGlobalState,
        nodeUpdates
    };
}
