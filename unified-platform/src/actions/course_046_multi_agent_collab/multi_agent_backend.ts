'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentStep {
    agent: 'MANAGER' | 'RESEARCHER' | 'WRITER';
    status: 'working' | 'done';
    output: string;
}

export async function runMultiAgentSystem(topic: string, modelName: string = 'auto'): Promise<AgentStep[]> {
    const steps: AgentStep[] = [];

    // --- STEP 1: MANAGER AGENT ---
    steps.push({ agent: 'MANAGER', status: 'working', output: 'Decomposing task...' });

    // We can't stream via server actions easily without robust setup, 
    // so we will return the "Done" steps sequentially to the UI via a polling array 
    // or just return the final sequence. 
    // For this demo, let's just run them and push to an array that we return at the end? 
    // No, the UI expects to animate them. 
    // Wait, previous modules returned the *Full History* and the UI mimicked the delay. 
    // I will stick to that pattern for simplicity: Return FULL execution log.

    const managerPrompt = `You are a Project Manager.
    Goal: Plan a short article about: "${topic}".
    Output a JSON object with:
    - "search_query": What the researcher should look for.
    - "guidelines": Instructions for the writer.
    `;

    let plan = { search_query: topic, guidelines: "Make it good." };
    try {
        const rawPlan = await queryLLM(managerPrompt, "Create plan.", modelName, false); // false = manual extract
        const parsed = await extractJSON(rawPlan);
        if (parsed.search_query) plan = parsed;
    } catch (e) {
        console.error("Manager failed", e);
    }

    const managerStep: AgentStep = {
        agent: 'MANAGER',
        status: 'done',
        output: `Plan Created:\n- Research: "${plan.search_query}"\n- Guidelines: "${plan.guidelines}"`
    };

    // --- STEP 2: RESEARCHER AGENT ---
    // Mocking the "Browsing" part, or asking LLM to simulate knowledge retrieval
    const researcherPrompt = `You are a Research Analyst.
    Task: Find key facts about: "${plan.search_query}".
    Provide 3-4 bullet points of high-level information.
    Be concise.`;

    const researchOutput = await queryLLM("You are a Researcher.", researcherPrompt, modelName, false);

    const researcherStep: AgentStep = {
        agent: 'RESEARCHER',
        status: 'done',
        output: researchOutput
    };

    // --- STEP 3: WRITER AGENT ---
    const writerPrompt = `You are a Content Writer.
    Write a short article (1 paragraph) based on these research notes:
    "${researchOutput}"
    
    Follow these guidelines:
    "${plan.guidelines}"`;

    const writerOutput = await queryLLM("You are a Writer.", writerPrompt, modelName, false);

    const writerStep: AgentStep = {
        agent: 'WRITER',
        status: 'done',
        output: writerOutput
    };

    return [managerStep, researcherStep, writerStep];
}
