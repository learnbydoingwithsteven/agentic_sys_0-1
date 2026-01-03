'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentTask {
    id: string;
    description: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED';
    subtasks?: AgentTask[];
}

export async function recursiveDecomposition(goal: string, modelName: string = 'auto'): Promise<AgentTask> {

    // 1. Root Task
    const root: AgentTask = {
        id: 'root',
        description: goal,
        status: 'RUNNING',
        subtasks: []
    };

    // 2. Planning Agent: Break goal into 2-3 high level steps
    const planPrompt = `You are a Recursive Task Planner.
    Goal: "${goal}"
    
    Task: Break this goal down into 2 to 4 sequential high-level sub-tasks.
    Return JSON: { "subtasks": ["string", "string"] }`;

    let highLevelTasks: string[] = ["Analyze Requirements", "Execute Plan", "Verify Results"];
    try {
        const raw = await queryLLM(planPrompt, "Plan Subtasks", modelName, true);
        const res = await extractJSON(raw);
        highLevelTasks = res.subtasks || highLevelTasks;
    } catch { }

    // 3. Recursive Step: For each high-level task, decompose further (simulate depth 2)
    const subtasks: AgentTask[] = [];

    for (let i = 0; i < highLevelTasks.length; i++) {
        const taskDesc = highLevelTasks[i];
        const taskId = `t${i + 1}`;

        // Let's decompose the FIRST task only to show recursion without waiting too long
        let children: AgentTask[] = [];

        if (i === 0) {
            const nestedPrompt = `You are a Recursive Task Planner.
            Parent Task: "${taskDesc}" (Context: ${goal})
            
            Task: Break this task down into 2 atomic steps.
            Return JSON: { "subtasks": ["string", "string"] }`;

            try {
                const raw = await queryLLM(nestedPrompt, "Decompose Task", modelName, true);
                const res = await extractJSON(raw);
                children = (res.subtasks || []).map((desc: string, idx: number) => ({
                    id: `${taskId}.${idx + 1}`,
                    description: desc,
                    status: 'PENDING' // Leaf nodes pending
                }));
            } catch { }
        }

        subtasks.push({
            id: taskId,
            description: taskDesc,
            status: i === 0 ? 'RUNNING' : 'PENDING',
            subtasks: children.length > 0 ? children : undefined
        });
    }

    root.subtasks = subtasks;
    return root;
}
