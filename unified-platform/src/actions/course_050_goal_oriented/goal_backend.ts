'use server';

export interface GoalNode {
    id: string;
    description: string;
    subGoals: GoalNode[];
}

export async function decomposeGoal(goal: string): Promise<GoalNode> {
    // Simulated decomposition tree
    // In a real app, this is recursive calls to LLM

    await new Promise(r => setTimeout(r, 1200));

    // Hardcoded logic for demo robustness (User asks for generic goals usually)
    return {
        id: 'main',
        description: goal,
        subGoals: [
            {
                id: 'sub1',
                description: "Research Requirements",
                subGoals: [
                    { id: 'sub1_1', description: "Read official docs", subGoals: [] },
                    { id: 'sub1_2', description: "Consult experts", subGoals: [] }
                ]
            },
            {
                id: 'sub2',
                description: "Acquire Necessary Resources",
                subGoals: [
                    { id: 'sub2_1', description: "Secure funding", subGoals: [] },
                    { id: 'sub2_2', description: "Buy equipment", subGoals: [] }
                ]
            },
            {
                id: 'sub3',
                description: "Execute Strategy",
                subGoals: []
            }
        ]
    };
}
