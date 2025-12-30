'use server';

export interface FederatedRound {
    round: number;
    globalAccuracy: number;
    nodeUpdates: { nodeId: string, contribution: number }[];
}

let accuracy = 50; // Starting %

export async function runFederatedRound(roundNumber: number): Promise<FederatedRound> {
    // Simulate Local Training improvement
    // Each round adds diminishing returns
    const improvement = Math.random() * 5 * (1 / roundNumber);
    accuracy = Math.min(99.9, accuracy + improvement);

    return {
        round: roundNumber,
        globalAccuracy: Number(accuracy.toFixed(1)),
        nodeUpdates: [
            { nodeId: 'Hospital A', contribution: Math.random() },
            { nodeId: 'Hospital B', contribution: Math.random() },
            { nodeId: 'Hospital C', contribution: Math.random() }
        ]
    };
}
