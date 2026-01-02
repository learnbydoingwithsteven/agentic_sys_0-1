'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface TaskEconomics {
    id: string;
    taskName: string;
    inputTokens: number;
    outputTokens: number;
    cost: number; // in cents
    value: number; // in cents (business value)
    profit: number; // value - cost
}

export async function runEconomicSimulation(
    simulatedTier: 'cheap' | 'expensive',
    taskComplexity: 'low' | 'high',
    modelName: string = 'auto'
): Promise<TaskEconomics> {

    // 1. Define Task
    let systemPrompt = "You are a helpful assistant.";
    let userPrompt = "";
    let baseValue = 0;

    if (taskComplexity === 'low') {
        userPrompt = "Write a one-sentence email reply confirming receipt of the message.";
        baseValue = 1.0; // 1 cent value
    } else {
        systemPrompt = "You are a Market Research Analyst. Provide a detailed analysis.";
        userPrompt = "Analyze the potential impact of Quantum Computing on the Logistics industry. Provide 3 key trends and a risk assessment.";
        baseValue = 15.0; // 15 cents value
    }

    // 2. Execute LLM
    const start = Date.now();
    let response = "";
    try {
        response = await queryLLM(systemPrompt, userPrompt, modelName);
    } catch (e) {
        response = "Error generating response.";
    }

    // 3. Calculate Tokens (Approx 4 chars = 1 token)
    const inputTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4);
    const outputTokens = Math.ceil(response.length / 4);

    // 4. Apply Pricing (Simulated)
    // Cheap: $0.50 / 1M In, $1.50 / 1M Out  (e.g. Haiku) -> 0.00005 cents/in, 0.00015 cents/out
    // Expensive: $10 / 1M In, $30 / 1M Out (e.g. Opus) -> 0.001 cents/in, 0.003 cents/out

    const pricing = simulatedTier === 'cheap'
        ? { in: 0.00005, out: 0.00015 }
        : { in: 0.001, out: 0.003 };

    const costCents = (inputTokens * pricing.in) + (outputTokens * pricing.out);

    // 5. Value Adjustment
    // If output is too short for a high complexity task, value drops (Model failed)
    let realizedValue = baseValue;
    if (taskComplexity === 'high' && outputTokens < 50) {
        realizedValue = 0.5; // Failed attempt
    }

    return {
        id: Math.random().toString(),
        taskName: taskComplexity === 'low' ? 'Email Reply' : 'Market Analysis',
        inputTokens,
        outputTokens,
        cost: Number(costCents.toFixed(4)),
        value: realizedValue,
        profit: Number((realizedValue - costCents).toFixed(4))
    };
}
