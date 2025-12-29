'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Configuration (Simulated Pricing) ---
const COST_PER_1K_INPUT = 0.0015; // $1.50 / 1M input tokens
const COST_PER_1K_OUTPUT = 0.0020; // $2.00 / 1M output tokens

export interface CostReport {
    inputTokens: number;
    outputTokens: number;
    inputCost: number;
    outputCost: number;
    totalCost: number;
    response: string;
}

// --- Helper: Token Approximation ---
// Real apps use 'tiktoken'. Here we approximate 1 token ~= 4 chars
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

// --- Main Action ---

export async function generateWithCostTracking(prompt: string, history: string[] = []): Promise<CostReport> {
    const start = Date.now();

    // 1. Calculate Input Tokens (Prompt + History Context)
    const context = history.join("\n");
    const fullInput = `${context}\nUser: ${prompt}`;
    const inputTokens = estimateTokens(fullInput);

    // 2. Call LLM
    const llm = new ChatOllama({
        model: "qwen2.5:1.5b",
        baseUrl: "http://127.0.0.1:11434",
    });

    const response = await llm.pipe(new StringOutputParser()).invoke(prompt);

    // 3. Calculate Output Tokens
    const outputTokens = estimateTokens(response);

    // 4. Calculate Costs
    const inputCost = (inputTokens / 1000) * COST_PER_1K_INPUT;
    const outputCost = (outputTokens / 1000) * COST_PER_1K_OUTPUT;

    return {
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
        response
    };
}
