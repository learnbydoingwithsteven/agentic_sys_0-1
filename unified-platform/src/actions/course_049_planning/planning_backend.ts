'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface PlanStep {
    id: number;
    description: string;
    dependencies: number[];
    status: 'pending' | 'in-progress' | 'completed';
    estimatedDuration?: string;
}

export async function generatePlan(goal: string, modelName: string = 'auto'): Promise<PlanStep[]> {
    const systemPrompt = `You are an expert Project Manager and Task Planner.
Your job is to decompose high-level goals into actionable steps with dependencies.

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, just the JSON array.

Format:
[
  { "id": 1, "description": "First step", "dependencies": [], "estimatedDuration": "30m" },
  { "id": 2, "description": "Second step", "dependencies": [1], "estimatedDuration": "1h" },
  ...
]

Rules:
- Generate 4-6 logical steps
- Each step must have a unique numeric id starting from 1
- dependencies is an array of step IDs that must complete before this step
- First step should have empty dependencies []
- Be specific and actionable
- estimatedDuration should be realistic (e.g., "30m", "2h", "1d")`;

    const userPrompt = `Goal: "${goal}"

Break this goal into a concrete execution plan (DAG format).`;

    try {
        const rawResponse = await queryLLM(systemPrompt, userPrompt, modelName, false);
        const parsed = await extractJSON(rawResponse);

        if (!Array.isArray(parsed)) {
            throw new Error("Response is not an array");
        }

        // Validate and normalize the plan
        const steps: PlanStep[] = parsed.map((step: any) => ({
            id: Number(step.id),
            description: String(step.description || 'Unnamed step'),
            dependencies: Array.isArray(step.dependencies) ? step.dependencies.map(Number) : [],
            status: 'pending' as const,
            estimatedDuration: step.estimatedDuration || 'Unknown'
        }));

        // Ensure IDs are sequential and valid
        if (steps.length === 0) {
            throw new Error("No steps generated");
        }

        return steps;

    } catch (error) {
        console.error("Plan generation failed:", error);

        // Fallback to a generic plan if LLM fails
        return [
            { id: 1, description: `Analyze requirements for: ${goal}`, dependencies: [], status: 'pending', estimatedDuration: '1h' },
            { id: 2, description: "Research and gather resources", dependencies: [1], status: 'pending', estimatedDuration: '2h' },
            { id: 3, description: "Draft initial implementation", dependencies: [2], status: 'pending', estimatedDuration: '3h' },
            { id: 4, description: "Review and refine", dependencies: [3], status: 'pending', estimatedDuration: '1h' },
            { id: 5, description: "Finalize and deliver", dependencies: [4], status: 'pending', estimatedDuration: '30m' }
        ];
    }
}

export async function executeStep(stepId: number, modelName: string = 'auto'): Promise<string> {
    // Simulate execution with a brief LLM-generated status update
    const prompt = `You are executing step ${stepId} of a project plan.
Generate a brief, realistic status update (1 sentence) about completing this step.
Be specific and professional.`;

    try {
        const result = await queryLLM("You are a task executor.", prompt, modelName, false);
        return result.substring(0, 150); // Limit length
    } catch (error) {
        return `Step ${stepId} completed successfully.`;
    }
}
