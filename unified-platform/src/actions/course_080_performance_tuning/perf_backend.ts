'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface PerfMetrics {
    strategy: string;
    ttft: number; // Time to First Token (Approximated as Total Time for now since we don't stream yet)
    totalTime: number;
    tokensPerSecond: number;
    output: string;
}

// Simple In-Memory Cache
const CACHE = new Map<string, string>();

export async function runPerfTest(strategy: 'BASELINE' | 'OPTIMIZED_PROMPT' | 'CACHE', modelName: string = 'auto'): Promise<PerfMetrics> {
    const longText = `
    The Apollo 11 mission was the spaceflight that first landed humans on the Moon. Commander Neil Armstrong and lunar module pilot Buzz Aldrin formed the American crew that landed the Apollo Lunar Module Eagle on July 20, 1969, at 20:17 UTC. Armstrong became the first person to step onto the lunar surface six hours and 39 minutes later on July 21 at 02:56 UTC; Aldrin joined him 19 minutes later. They spent about two and a quarter hours together outside the spacecraft, and they collected 47.5 pounds (21.5 kg) of lunar material to bring back to Earth. Michael Collins piloted the Command Module Columbia alone in lunar orbit while they were on the Moon's surface. Armstrong and Aldrin spent 21 hours and 36 minutes on the lunar surface at a site they named Tranquility Base before lifting off to rejoin Columbia in lunar orbit.
    `;

    const start = performance.now();
    let output = "";

    // Simulate Work
    if (strategy === 'BASELINE') {
        // Full Context Query
        output = await queryLLM("Summarize the following text in one sentence:", longText, modelName);
    } else if (strategy === 'OPTIMIZED_PROMPT') {
        // Optimized: We simulate an agent that pre-summarized/shortened the prompt context to just key facts
        const shortText = "Apollo 11, Neil Armstrong, Buzz Aldrin, landed Moon July 20 1969. Collected rocks. Returned safe.";
        output = await queryLLM("Make a sentence from these facts:", shortText, modelName);
    } else if (strategy === 'CACHE') {
        // Check Cache
        const cacheKey = "apollo_summary";
        if (CACHE.has(cacheKey)) {
            output = CACHE.get(cacheKey)!;
        } else {
            output = await queryLLM("Summarize Apollo 11 in 5 words.", "", modelName); // Fallback if empty (warmup)
            CACHE.set(cacheKey, output);
        }
    }

    const end = performance.now();
    const totalTime = Math.round(end - start);

    // Calc pseudo-metrics
    const estTokens = output.length / 4;
    const tps = Math.round((estTokens / (totalTime / 1000)) * 100) / 100;

    return {
        strategy,
        ttft: totalTime, // Non-streaming -> TTFT ~ Total
        totalTime,
        tokensPerSecond: tps,
        output
    };
}
