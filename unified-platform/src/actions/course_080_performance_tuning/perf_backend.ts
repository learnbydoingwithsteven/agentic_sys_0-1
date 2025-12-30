'use server';

export interface PerfMetrics {
    strategy: string;
    ttft: number; // Time to First Token
    totalTime: number;
    tokensPerSecond: number;
}

export async function runPerfTest(strategy: 'BASELINE' | 'CACHE' | 'TINY_MODEL'): Promise<PerfMetrics> {
    const delay = ms => new Promise(r => setTimeout(r, ms));

    if (strategy === 'CACHE') {
        await delay(50); // Simulated Cache Hit
        return { strategy, ttft: 50, totalTime: 60, tokensPerSecond: 9000 };
    }

    if (strategy === 'TINY_MODEL') {
        await delay(200); // Fast Inference
        return { strategy, ttft: 200, totalTime: 800, tokensPerSecond: 150 };
    }

    // Baseline (Huge Model)
    await delay(1200); // Slow load
    return { strategy, ttft: 1200, totalTime: 4000, tokensPerSecond: 25 };
}
