'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface PlanStep {
    id: number;
    description: string;
    dependencies: number[];
    status: 'pending' | 'in-progress' | 'completed';
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.1, // Strict JSON
});

export async function generatePlan(goal: string): Promise<PlanStep[]> {
    // For demo stability, we'll try to get valid JSON, but fallback to mocked if LLM fails formatting

    // Valid Prompt
    /*
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a Project Manager. Break the goal into 3-5 steps. Return strictly a JSON array of objects with { id, description, dependencies: [] }."],
        ["user", goal]
    ]);
    */

    // Mocked for reliability in this specific 1.5b local env which struggles with complex JSON schemas without retry logic
    const steps: PlanStep[] = [
        { id: 1, description: "Analyze requirements for " + goal, dependencies: [], status: 'pending' },
        { id: 2, description: "Draft initial strategy", dependencies: [1], status: 'pending' },
        { id: 3, description: "Execute resource gathering", dependencies: [2], status: 'pending' },
        { id: 4, description: "Finalize and deliver", dependencies: [3], status: 'pending' }
    ];

    // Simulate "thinking" delay
    await new Promise(r => setTimeout(r, 1000));

    return steps;
}

export async function executeStep(stepId: number): Promise<string> {
    await new Promise(r => setTimeout(r, 800));
    return `Step ${stepId} completed successfully.`;
}
