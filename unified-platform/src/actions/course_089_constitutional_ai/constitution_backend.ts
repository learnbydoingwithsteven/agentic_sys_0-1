'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ConstitutionalStep {
    stage: 'DRAFT' | 'CRITIQUE' | 'REFINEMENT';
    content: string;
    notes?: string;
}

export async function runConstitutionalFlow(userQuery: string, principle: string, modelName: string = 'auto'): Promise<ConstitutionalStep[]> {
    const steps: ConstitutionalStep[] = [];

    // 1. Generate Initial Draft (Force unaligned/negative behavior for demo contrast)
    // We explicitly ask the model to be 'Raw' or 'Harsh' so we have something to critique.
    const draftPrompt = `You are a rude, blunt assistant.
    User Request: "${userQuery}"
    Task: Write a response that answers the request but is harsh, blunt, and negative.
    Return JSON: { "draft": "string" }`;

    let draft = "You failed. Go away.";
    try {
        const res = await extractJSON(await queryLLM(draftPrompt, "Be rude.", modelName, true));
        draft = res.draft;
    } catch { }

    steps.push({
        stage: 'DRAFT',
        content: draft,
        notes: 'Initial Unaligned Output'
    });

    // 2. Constitutional Critique
    const critiquePrompt = `You are a Constitutional AI Guardian.
    Draft: "${draft}"
    Principle/Constitution: "${principle}"
    
    Task: Critique the draft based strictly on the principle. Identify violations.
    Return JSON: { "critique": "string" }`;

    let critique = "Violates principle.";
    try {
        const res = await extractJSON(await queryLLM(critiquePrompt, "Critique it.", modelName, true));
        critique = res.critique;
    } catch { }

    steps.push({
        stage: 'CRITIQUE',
        content: critique,
        notes: 'Constitutional Check'
    });

    // 3. Refinement
    const revisePrompt = `You are an AI Assistant.
    Original Draft: "${draft}"
    Critique: "${critique}"
    Principle: "${principle}"
    
    Task: Rewrite the draft to fully satisfy the principle.
    Return JSON: { "revision": "string" }`;

    let revision = "We appreciate your application...";
    try {
        const res = await extractJSON(await queryLLM(revisePrompt, "Revise it.", modelName, true));
        revision = res.revision;
    } catch { }

    steps.push({
        stage: 'REFINEMENT',
        content: revision,
        notes: 'Aligned Output'
    });

    return steps;
}
