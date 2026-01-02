'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface StrategyResult {
    strategy: 'Efficiency' | 'Reasoning';
    response: string;
    tokens: number;
    cost: number;
    score: number;
    roi: number;
}

export async function runEconomicComparison(
    taskPrompt: string,
    modelName: string = 'auto'
): Promise<StrategyResult[]> {

    // 1. Define Strategies
    // A. Efficiency: Direct, concise. Represents "Cheap/Fast" models.
    const promptA = `You are an Efficient Assistant. Answer the user's request as briefly and directly as possible. Do not use Chain of Thought.`;

    // B. Reasoning: Verbose, detailed. Represents "Expensive/Smart" models.
    const promptB = `You are a Deep Reasoning Assistant. Think step-by-step. Analyze the problem from multiple angles before providing a comprehensive answer. Breakdown your logic.`;

    // 2. Execute Parallel
    const [resA, resB] = await Promise.all([
        queryLLM(promptA, taskPrompt, modelName),
        queryLLM(promptB, taskPrompt, modelName)
    ]);

    // 3. LLM Judge for Quality Scoring
    const judgeSystem = `You are an AI Quality Judge.
    Evaluate the quality of the answer for the given task.
    Assign a score from 1 to 10 based on Accuracy, Completeness, and Depth.
    Return JSON: { "score": number }`;

    const scoreA_Promise = queryLLM(judgeSystem, `Task: ${taskPrompt}\nAnswer: ${resA}`, modelName, true);
    const scoreB_Promise = queryLLM(judgeSystem, `Task: ${taskPrompt}\nAnswer: ${resB}`, modelName, true);

    const [rawScoreA, rawScoreB] = await Promise.all([scoreA_Promise, scoreB_Promise]);

    const parsedScoreA = await extractJSON(rawScoreA).catch(() => ({ score: 5 }));
    const parsedScoreB = await extractJSON(rawScoreB).catch(() => ({ score: 5 }));

    // 4. Economics Calculation
    // Efficiency Model Simulation: $0.50 / 1M tokens (Cheap)
    // Reasoning Model Simulation: $10.00 / 1M tokens (Expensive) -> 20x Cost
    const priceA = 0.0001; // cents per token
    const priceB = 0.002;  // cents per token

    const tokensA = Math.ceil(resA.length / 4);
    const tokensB = Math.ceil(resB.length / 4);

    const costA = tokensA * priceA;
    const costB = tokensB * priceB;

    // Value = Score * Business Multiplier (e.g., each score point is worth 1 cent)
    const valueA = parsedScoreA.score * 0.5;
    const valueB = parsedScoreB.score * 0.5;

    return [
        {
            strategy: 'Efficiency',
            response: resA,
            tokens: tokensA,
            cost: Number(costA.toFixed(4)),
            score: parsedScoreA.score,
            roi: Number(((valueA - costA) / costA * 100).toFixed(0))
        },
        {
            strategy: 'Reasoning',
            response: resB,
            tokens: tokensB,
            cost: Number(costB.toFixed(4)),
            score: parsedScoreB.score,
            roi: Number(((valueB - costB) / costB * 100).toFixed(0))
        }
    ];
}
