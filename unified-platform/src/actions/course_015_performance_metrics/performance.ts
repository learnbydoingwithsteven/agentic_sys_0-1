'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export interface PerformanceMetrics {
    durationMs: number;
    firstTokenMs?: number; // Time to first token (TTFT)
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    tokensPerSecond: number;
    costEstimate: number; // Simulated cost in $ (e.g. based on simplified GPT-4 pricing for comparison)
    model: string;
    success: boolean;
    output?: string;
    error?: string;
    timestamp: number;
}

export async function runBenchmark(
    promptText: string,
    model: string = "llama3.2",
    iterations: number = 1
): Promise<PerformanceMetrics[]> {

    const results: PerformanceMetrics[] = [];

    // Simulated Pricing (per 1k tokens) - purely educational comparison
    // Standard "High End" model pricing (e.g. GPT-4o class)
    const COST_INPUT_1K = 0.005;
    const COST_OUTPUT_1K = 0.015;

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();

        try {
            const llm = new ChatOllama({
                baseUrl: "http://127.0.0.1:11434",
                model: model,
                temperature: 0.7,
            });

            // We use a basic chain
            const prompt = PromptTemplate.fromTemplate("{input}");
            const chain = prompt.pipe(llm).pipe(new StringOutputParser());

            // Execute
            const response = await chain.invoke({ input: promptText });
            const end = performance.now();

            // METRICS CALCULATION
            const durationMs = end - start;

            // Token Estimation (LangChain Ollama usage info is sometimes spotty, so we estimate closely if missing)
            // Rule of thumb: 1 token ~= 4 characters for English
            const inputChars = promptText.length;
            const outputChars = response.length;
            const inputTokens = Math.ceil(inputChars / 4);
            const outputTokens = Math.ceil(outputChars / 4);
            const totalTokens = inputTokens + outputTokens;

            const tokensPerSecond = outputTokens / (durationMs / 1000);

            const cost = (inputTokens / 1000 * COST_INPUT_1K) + (outputTokens / 1000 * COST_OUTPUT_1K);

            results.push({
                durationMs,
                inputTokens,
                outputTokens,
                totalTokens,
                tokensPerSecond,
                costEstimate: cost,
                model,
                success: true,
                output: response,
                timestamp: Date.now()
            });

        } catch (error) {
            results.push({
                durationMs: performance.now() - start,
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                tokensPerSecond: 0,
                costEstimate: 0,
                model,
                success: false,
                error: String(error),
                timestamp: Date.now()
            });
        }
    }

    return results;
}

export async function compareModels(
    promptText: string,
    models: string[],
    iterations: number = 1
): Promise<Record<string, PerformanceMetrics[]>> {
    const results: Record<string, PerformanceMetrics[]> = {};

    // Run benchmarks sequentially to avoid overwhelming the system
    for (const model of models) {
        results[model] = await runBenchmark(promptText, model, iterations);
    }

    return results;
}
