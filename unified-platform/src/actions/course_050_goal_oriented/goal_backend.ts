'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface GoalNode {
    id: string;
    description: string;
    subGoals: GoalNode[];
}

let nodeIdCounter = 0;

export async function decomposeGoal(goal: string, modelName: string = 'auto', depth: number = 0, maxDepth: number = 2): Promise<GoalNode> {
    // Reset counter on root call
    if (depth === 0) {
        nodeIdCounter = 0;
    }

    const nodeId = `goal_${nodeIdCounter++}`;

    // Base case: max depth reached
    if (depth >= maxDepth) {
        return {
            id: nodeId,
            description: goal,
            subGoals: []
        };
    }

    try {
        const systemPrompt = `You are an expert at goal decomposition and task planning.
Your job is to break down high-level goals into 2-4 concrete sub-goals.

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, just the JSON array.

Format:
["Sub-goal 1 description", "Sub-goal 2 description", "Sub-goal 3 description"]

Rules:
- Generate 2-4 actionable sub-goals
- Each sub-goal should be specific and measurable
- Sub-goals should be logical steps toward achieving the parent goal
- Use clear, concise language
- Return ONLY the JSON array, nothing else`;

        const userPrompt = `Goal: "${goal}"

Break this goal into 2-4 concrete sub-goals that would help achieve it.`;

        const rawResponse = await queryLLM(systemPrompt, userPrompt, modelName, false);
        const parsed = await extractJSON(rawResponse);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("Invalid response format");
        }

        // Recursively decompose each sub-goal
        const subGoals: GoalNode[] = [];
        for (const subGoalDesc of parsed.slice(0, 4)) { // Limit to 4 sub-goals
            const subGoal = await decomposeGoal(
                String(subGoalDesc),
                modelName,
                depth + 1,
                maxDepth
            );
            subGoals.push(subGoal);
        }

        return {
            id: nodeId,
            description: goal,
            subGoals
        };

    } catch (error) {
        console.error(`Goal decomposition failed at depth ${depth}:`, error);

        // Fallback to a simple decomposition
        if (depth === 0) {
            return {
                id: nodeId,
                description: goal,
                subGoals: [
                    {
                        id: `goal_${nodeIdCounter++}`,
                        description: "Research and planning phase",
                        subGoals: [
                            { id: `goal_${nodeIdCounter++}`, description: "Gather requirements", subGoals: [] },
                            { id: `goal_${nodeIdCounter++}`, description: "Define success criteria", subGoals: [] }
                        ]
                    },
                    {
                        id: `goal_${nodeIdCounter++}`,
                        description: "Execution phase",
                        subGoals: [
                            { id: `goal_${nodeIdCounter++}`, description: "Implement solution", subGoals: [] },
                            { id: `goal_${nodeIdCounter++}`, description: "Test and validate", subGoals: [] }
                        ]
                    },
                    {
                        id: `goal_${nodeIdCounter++}`,
                        description: "Completion and review",
                        subGoals: []
                    }
                ]
            };
        }

        // For deeper levels, just return the goal without sub-goals
        return {
            id: nodeId,
            description: goal,
            subGoals: []
        };
    }
}
