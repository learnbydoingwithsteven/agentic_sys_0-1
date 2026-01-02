'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface Pod {
    id: string;
    name: string;
    status: 'Running' | 'Pending' | 'Terminating';
    age: number;
}

export interface ClusterState {
    pods: Pod[];
    queueLength: number;
    decision: string; // "Scaled Up by 2", "Maintained", etc.
}

let podList: Pod[] = [
    { id: '1', name: 'agent-1', status: 'Running', age: 100 },
    { id: '2', name: 'agent-2', status: 'Running', age: 100 }
];

export async function manageCluster(queueLength: number, modelName: string = 'auto'): Promise<ClusterState> {
    // 1. Simulation Tick (Age update, Transitions)
    podList = podList.map(p => {
        if (p.status === 'Terminating') return null; // Remove
        if (p.status === 'Pending') return { ...p, status: 'Running' };
        return { ...p, age: p.age + 1 };
    }).filter(Boolean) as Pod[];

    const activePods = podList.filter(p => p.status !== 'Terminating').length;

    // 2. LLM Orchestrator Decision
    const systemPrompt = `You are a Kubernetes Auto-Scaler Agent.
    Your Goal: Maintain optimal cluster health.
    Capacity Rule: Each Pod can handle 10 tasks.
    
    Current State:
    - Queue Length: ${queueLength}
    - Active Pods: ${activePods}
    
    Decide:
    - If Queue > (ActivePods * 10), SCALE UP.
    - If Queue < ((ActivePods - 1) * 10), SCALE DOWN.
    - Otherwise, MAINTAIN.
    
    Return JSON: { "action": "SCALE_UP" | "SCALE_DOWN" | "MAINTAIN", "count": number (0 if maintain), "reason": "string" }`;

    let decisionText = "Maintained";
    try {
        const raw = await queryLLM(systemPrompt, "Analyze metrics.", modelName, true);
        const plan = await extractJSON(raw);

        if (plan.action === 'SCALE_UP') {
            const count = Math.min(plan.count, 5); // Safety limit
            for (let i = 0; i < count; i++) {
                podList.push({
                    id: Math.random().toString(36).substr(2, 5),
                    name: `agent-${Math.random().toString(36).substr(2, 4)}`,
                    status: 'Pending',
                    age: 0
                });
            }
            decisionText = `Scaling UP +${count}: ${plan.reason}`;
        } else if (plan.action === 'SCALE_DOWN') {
            const count = Math.min(plan.count, activePods);
            let removed = 0;
            // Terminate oldest
            for (let i = 0; i < podList.length; i++) {
                if (removed >= count) break;
                if (podList[i].status === 'Running') {
                    podList[i].status = 'Terminating';
                    removed++;
                }
            }
            decisionText = `Scaling DOWN -${count}: ${plan.reason}`;
        } else {
            decisionText = `Maintained: ${plan.reason}`;
        }
    } catch (e) {
        decisionText = "Orchestrator Error";
    }

    return {
        pods: podList,
        queueLength,
        decision: decisionText
    };
}
