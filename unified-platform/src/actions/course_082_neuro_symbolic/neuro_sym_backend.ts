'use server';

export interface MethodResult {
    method: 'PURE_LLM' | 'NEURO_SYMBOLIC';
    answer: string;
    isCorrect: boolean;
    logs: string[];
}

export async function solveSymbolicProblem(problem: string): Promise<MethodResult[]> {
    // Problem: "What is 4321 * 1234?"
    const correctAnswer = (4321 * 1234).toString(); // "5332114"
    const hallucinatedAnswer = "5330342"; // Incorrect guess

    return [
        {
            method: 'PURE_LLM',
            answer: hallucinatedAnswer,
            isCorrect: false,
            logs: [
                "Thinking: 'Okay, multiply 4321 by 1234...'",
                "Approximating: 4000 * 1200 is roughly 4.8 million...",
                "Output generation: 5,330,342"
            ]
        },
        {
            method: 'NEURO_SYMBOLIC',
            answer: correctAnswer,
            isCorrect: true,
            logs: [
                "Thinking: 'I need to calculate 4321 * 1234'",
                "Action: Delegate to <CalculatorTool>",
                "Tool Input: 4321 * 1234",
                "Tool Output: 5332114",
                "Final Answer: 5332114"
            ]
        }
    ];
}
