'use server';

export interface TaskEconomics {
    id: string;
    taskName: string;
    inputTokens: number;
    outputTokens: number;
    cost: number; // in cents
    value: number; // in cents (business value)
    profit: number; // value - cost
}

export async function runEconomicSimulation(model: 'cheap' | 'expensive', taskComplexity: 'low' | 'high'): Promise<TaskEconomics> {
    // Pricing (mock) per 1k tokens
    // Cheap (Instant-1.0): $0.001 in, $0.002 out
    // Expensive (Reasoning-Pro): $0.01 in, $0.03 out

    // Low Complexity: 100 in, 50 out. Value: $0.05
    // High Complexity: 1000 in, 500 out. Value: $0.50

    const isCheap = model === 'cheap';
    const isLow = taskComplexity === 'low';

    const priceIn = isCheap ? 0.001 : 0.01;
    const priceOut = isCheap ? 0.002 : 0.03;

    const input = isLow ? 100 : 1500;
    const output = isLow ? 50 : 800;

    const costDollars = (input / 1000 * priceIn) + (output / 1000 * priceOut);
    const costCents = costDollars * 100;

    // Business Value Assumption
    let valueCents = isLow ? 1.0 : 15.0; // Higher tasks are worth more

    // Dynamic: If using Cheap model for High Complexity task, quality suffers -> Value drops!
    if (isCheap && !isLow) {
        valueCents = 2.0; // Failed to do it well
    }

    return {
        id: Math.random().toString(),
        taskName: isLow ? 'Email Reply' : 'Market Analysis',
        inputTokens: input,
        outputTokens: output,
        cost: Number(costCents.toFixed(4)),
        value: valueCents,
        profit: Number((valueCents - costCents).toFixed(4))
    };
}
