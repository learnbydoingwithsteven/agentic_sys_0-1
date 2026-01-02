'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface HealingLog {
    step: string;
    status: 'SUCCESS' | 'FAILURE' | 'HEALING';
    message: string;
    timestamp: number;
}

export interface CircuitState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    lastFailure: number;
}

// Pseudo-Circuit State (simulated per request flow for reliability demo)
// Real circuit state would be persistent.

export async function executeWithSelfHealing(
    userPrompt: string,
    modelName: string = 'auto'
): Promise<{ logs: HealingLog[], finalResponse: string, recovered: boolean }> {

    const logs: HealingLog[] = [];

    // 1. Initial Attempt
    logs.push({ step: 'Attempt 1', status: 'HEALING', message: 'Executing original prompt...', timestamp: Date.now() });

    let currentPrompt = userPrompt;
    let finalResponse = "";
    let recovered = false;

    try {
        // Simulation: If prompt contains "fail" or "error" or is empty, we force a failure to demo healing.
        // Otherwise we execute normally.
        if (userPrompt.toLowerCase().includes('fail') || userPrompt.toLowerCase().includes('error') || userPrompt.trim() === '') {
            throw new Error("Simulated RuntimeException: Invalid Input Syntax at line 1.");
        }

        // Happy Path
        finalResponse = await queryLLM("You are a helpful assistant.", currentPrompt, modelName);
        logs.push({ step: 'Attempt 1', status: 'SUCCESS', message: 'Execution successful.', timestamp: Date.now() });

    } catch (initialError: any) {
        logs.push({ step: 'Attempt 1', status: 'FAILURE', message: `Error: ${initialError.message}`, timestamp: Date.now() });

        // 2. Self-Healing Trigger
        logs.push({ step: 'Self-Healer', status: 'HEALING', message: 'Analyzing error and rewriting prompt...', timestamp: Date.now() });

        const healerSystem = `You are an AI Error Correction Agent.
        Analyze the Error Log and the Failed Prompt.
        Rewrite the Prompt to fix the issue or handle the edge case.
        Example: If error is 'Invalid Input', rewrite the prompt to be valid.
        
        Return JSON: { "fixed_prompt": "string", "explanation": "string" }`;

        try {
            const rawHeal = await queryLLM(healerSystem, `Failed Prompt: "${currentPrompt}"\nError: "${initialError.message}"`, modelName, true);
            const healPlan = await extractJSON(rawHeal);

            logs.push({ step: 'Self-Healer', status: 'HEALING', message: `Fix proposed: ${healPlan.explanation}`, timestamp: Date.now() });

            // 3. Retry with Fixed Prompt
            currentPrompt = healPlan.fixed_prompt;
            logs.push({ step: 'Attempt 2', status: 'HEALING', message: 'Retrying with fixed prompt...', timestamp: Date.now() });

            finalResponse = await queryLLM("You are a helpful assistant.", currentPrompt, modelName);
            logs.push({ step: 'Attempt 2', status: 'SUCCESS', message: 'Recovery successful.', timestamp: Date.now() });
            recovered = true;

        } catch (healError) {
            logs.push({ step: 'Self-Healer', status: 'FAILURE', message: 'Healing failed. Critical System Failure.', timestamp: Date.now() });
            finalResponse = "System could not recover.";
        }
    }

    return { logs, finalResponse, recovered };
}

// Keep existing mocks for compatibility if needed (but we prefer the new one)
export async function unreliableApiCall() { return { success: false, message: "Use executeWithSelfHealing instead", circuit: {} as any }; }
export async function resetCircuit() { }
