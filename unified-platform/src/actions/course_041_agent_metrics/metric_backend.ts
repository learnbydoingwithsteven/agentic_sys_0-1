'use server';

export interface EvalRun {
    id: string;
    question: string;
    answer: string;
    metrics: {
        faithfulness: number; // 0-1
        answerRelevance: number; // 0-1
        contextPrecision: number; // 0-1
    };
}

export async function runEvaluation(dataset: string): Promise<EvalRun[]> {
    // Mock Evaluation Loop
    // In real life, this would run Ragas or TruLens

    return [
        {
            id: '1',
            question: "What is the capital of France?",
            answer: "Paris is the capital of France.",
            metrics: { faithfulness: 1.0, answerRelevance: 1.0, contextPrecision: 0.95 }
        },
        {
            id: '2',
            question: "How do I reset my password?",
            answer: "You can go to settings.", // Vague
            metrics: { faithfulness: 0.8, answerRelevance: 0.4, contextPrecision: 0.6 }
        },
        {
            id: '3',
            question: "Explain Quantum Physics",
            answer: "It involves cats and boxes.", // Poor faithfulness to actual science
            metrics: { faithfulness: 0.2, answerRelevance: 0.5, contextPrecision: 0.3 }
        }
    ];
}
