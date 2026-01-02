'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface SwarmMessage {
    sender: string;
    text: string;
}

export async function runSwarmStep(history: SwarmMessage[], modelName: string = 'auto'): Promise<SwarmMessage> {
    const context = history.map(h => `${h.sender}: ${h.text}`).join("\n");

    // AutoGen-style Hand-off Pattern
    // We let the LLM decide who speaks next and what they say.
    // Roles: 
    // - Manager: Breaks down tasks.
    // - Coder: Writes code/solutions.
    // - Reviewer: Critiques and approves.

    const systemPrompt = `You are a Swarm Orchestrator for a software team.
    
    Roles:
    - Manager: Coordinates, breaks down 'User' request.
    - Coder: Implements solution.
    - Reviewer: Checks code for bugs/safety.
    
    Current Conversation History:
    ${context}
    
    Task:
    1. Analyze the history.
    2. Decide WHO should speak next (Manager, Coder, or Reviewer).
       - If User just spoke, usually Manager should speak.
       - If Manager spoke, usually Coder.
       - If Coder spoke, usually Reviewer.
       - If Reviewer rejected, Coder fixes. If accepted, Manager concludes.
    3. Generate their response.
    
    Output JSON ONLY:
    {
        "nextSender": "Manager" | "Coder" | "Reviewer",
        "response": "The text of their message..."
    }`;

    try {
        const raw = await queryLLM(systemPrompt, "Continue the conversation.", modelName, true);
        const result = await extractJSON(raw);

        return {
            sender: result.nextSender || 'Manager',
            text: result.response || "..."
        };
    } catch (e) {
        return { sender: 'Manager', text: "I'm having trouble connecting to the team. (LLM Error)" };
    }
}
