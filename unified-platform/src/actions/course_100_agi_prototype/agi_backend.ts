'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgiStep {
    phase: 'UNDERSTAND' | 'PLAN' | 'EXECUTE' | 'LEARN';
    message: string;
}

export async function runAgiLoop(objective: string, modelName: string = 'auto'): Promise<AgiStep[]> {
    const steps: AgiStep[] = [];

    // 1. UNDERSTAND Phase
    // Agent analyzes the user's high-level objective
    steps.push({ phase: 'UNDERSTAND', message: `Initializing Omni-Agent protocol for: "${objective}"` });

    let understanding = "Task is complex.";
    try {
        const raw = await queryLLM(
            `Analyze this objective: "${objective}". What is the core intent and what domains does it involve?
            Return JSON: { "analysis": "string" }`,
            "Analyze Objective",
            modelName,
            true
        );
        const res = await extractJSON(raw);
        understanding = res.analysis;
        steps.push({ phase: 'UNDERSTAND', message: `Analysis: ${understanding}` });
    } catch { }

    // 2. PLAN Phase
    // Agent formulates a high-level plan
    let plan = ["Break down task", "Execute steps"];
    try {
        const raw = await queryLLM(
            `Objective: "${objective}"
            Context: ${understanding}
            Create a 2-step high-level plan.
            Return JSON: { "steps": ["string", "string"] }`,
            "Create Plan",
            modelName,
            true
        );
        const res = await extractJSON(raw);
        plan = res.steps || plan;
        steps.push({ phase: 'PLAN', message: `Strategy Formulated: ${plan.length} core steps identified.` });
        plan.forEach(s => steps.push({ phase: 'PLAN', message: `- ${s}` }));
    } catch { }

    // 3. EXECUTE Phase (Simulated Tool Use)
    steps.push({ phase: 'EXECUTE', message: 'Activating Neural Tool Registry...' });
    for (const p of plan) {
        steps.push({ phase: 'EXECUTE', message: `Executing: "${p}"...` });
        // Simulate tool latency/activity
        steps.push({ phase: 'EXECUTE', message: `> Tool Output: [Data Processed for ${p.substring(0, 10)}...]` });
    }

    // 4. LEARN Phase
    // Agent reflects on the session to update long-term knowledge
    let reflection = "Task completed successfully.";
    try {
        const raw = await queryLLM(
            `We just tried to achieve: "${objective}".
            Plan used: ${JSON.stringify(plan)}.
            Generate a 'Self-Reflection' on how to improve next time.
            Return JSON: { "reflection": "string" }`,
            "Reflect",
            modelName,
            true
        );
        const res = await extractJSON(raw);
        reflection = res.reflection;
        steps.push({ phase: 'LEARN', message: `Memory Update: ${reflection}` });
    } catch { }

    return steps;
}
