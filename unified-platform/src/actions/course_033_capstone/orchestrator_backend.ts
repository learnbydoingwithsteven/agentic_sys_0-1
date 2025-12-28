'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Interfaces ---

export interface AgentAction {
    type: 'delegate' | 'answer';
    targetAgent?: string; // e.g. 'researcher', 'coder'
    input?: string;       // Instructions for the sub-agent
    finalResponse?: string;
    thought?: string;     // Orchestrator's reasoning
}

export interface WorkflowStep {
    step: number;
    agentName: string; // 'Orchestrator' | 'Researcher' | ...
    content: string;
    type: 'thought' | 'action' | 'result';
}

// --- Specialized Prompts ---

const ORCHESTRATOR_PROMPT = `
You are the Chief Orchestrator. Your goal is to route user requests to the correct specialist agent.
Available Agents:
1. "researcher": specialized in finding facts, history, and general knowledge.
2. "coder": specialized in writing, debugging, or explaining code.
3. "analyst": specialized in logical breakdown, math, or pro/con analysis.

Rules:
- If the user asks a simple greeting or general chat, answer directly.
- If the user asks for information, code, or analysis, DELEGATE to the specialist.
- Return a JSON object ONLY with no markdown.

Format 1 (Delegation):
{{
  "thought": "User needs factual info, delegating to researcher.",
  "type": "delegate",
  "targetAgent": "researcher",
  "input": "Summarize the history of..."
}}

Format 2 (Direct Answer):
{{
  "thought": "User is just saying hello.",
  "type": "answer",
  "finalResponse": "Hello! How can I help you today?"
}}

User Input: {input}
`;

const RESEARCHER_PROMPT = `
You are a Research Agent.
Task: {input}
Provide a concise, factual summary of the topic.
`;

const CODER_PROMPT = `
You are a Coding Agent.
Task: {input}
Provide a code snippet or technical explanation.
`;

const ANALYST_PROMPT = `
You are an Analyst Agent.
Task: {input}
Provide a logical breakdown, pros/cons, or mathematical analysis.
`;

// --- Helpers ---

async function callSubAgent(agentName: string, input: string, model: string): Promise<string> {
    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3,
    });

    let prompt = "";
    switch (agentName) {
        case 'researcher': prompt = RESEARCHER_PROMPT; break;
        case 'coder': prompt = CODER_PROMPT; break;
        case 'analyst': prompt = ANALYST_PROMPT; break;
        default: return "Error: Unknown agent.";
    }

    const chain = ChatPromptTemplate.fromTemplate(prompt)
        .pipe(llm)
        .pipe(new StringOutputParser());

    return await chain.invoke({ input });
}

// --- Main Action ---

export async function runOrchestration(userQuery: string, model: string = "llama3.2") {
    const steps: WorkflowStep[] = [];
    let stepCount = 0;

    // 1. Orchestrator Decides
    const orchestratorLLM = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        format: "json",
        temperature: 0,
    });

    const orchChain = ChatPromptTemplate.fromTemplate(ORCHESTRATOR_PROMPT)
        .pipe(orchestratorLLM)
        .pipe(new StringOutputParser());

    let decision: AgentAction;
    try {
        const res = await orchChain.invoke({ input: userQuery });
        const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();
        decision = JSON.parse(clean);

        steps.push({
            step: ++stepCount,
            agentName: 'Orchestrator',
            content: decision.thought || "Routing request...",
            type: 'thought'
        });

    } catch (e) {
        return { steps, error: "Orchestrator failed to route." };
    }

    // 2. Execute Action
    if (decision.type === 'answer') {
        steps.push({
            step: ++stepCount,
            agentName: 'Orchestrator',
            content: decision.finalResponse || "Done.",
            type: 'result'
        });
    }
    else if (decision.type === 'delegate' && decision.targetAgent) {
        // Log delegation
        steps.push({
            step: ++stepCount,
            agentName: 'Orchestrator',
            content: `Delegating to ${decision.targetAgent}...`,
            type: 'action'
        });

        // Call Sub-Agent
        const subResult = await callSubAgent(decision.targetAgent, decision.input || userQuery, model);

        steps.push({
            step: ++stepCount,
            agentName: decision.targetAgent,
            content: subResult,
            type: 'result'
        });
    }

    return { steps };
}
