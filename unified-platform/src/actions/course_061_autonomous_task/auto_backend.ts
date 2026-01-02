'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentLog {
    id: number;
    timestamp: string;
    action: string;
    details: string;
}

export async function runAutonomousAgent(goal: string, modelName: string = 'auto', maxSteps: number = 5): Promise<AgentLog[]> {
    const logs: AgentLog[] = [];
    let history: string[] = [];

    logs.push({
        id: 0,
        timestamp: new Date().toISOString(),
        action: "INIT",
        details: `Goal: ${goal}`
    });

    for (let step = 1; step <= maxSteps; step++) {
        // 1. Decide Next Step
        const systemPrompt = `You are an autonomous agent.
        Goal: ${goal}
        History: 
        ${history.join('\n')}
        
        Decide the next step.
        Available Actions: "SEARCH", "READ", "WRITE", "DONE".
        
        CRITICAL: Return ONLY valid JSON.
        Format:
        { "thought": "Reasoning...", "action": "ACTION_NAME", "details": "Parameter for action" }
        `;

        const decisionRaw = await queryLLM("You are a ReAct Agent.", systemPrompt, modelName, true);
        const decision = await extractJSON(decisionRaw);

        logs.push({
            id: step,
            timestamp: new Date().toISOString(),
            action: decision.action || "THINK",
            details: `[${decision.thought}] -> ${decision.details}`
        });

        // 2. Execute Action (Simulated)
        let observation = "";
        if (decision.action === "SEARCH") {
            observation = `Found 3 results for "${decision.details}".`;
        } else if (decision.action === "READ") {
            observation = `Read content of "${decision.details}". It contains relevant info.`;
        } else if (decision.action === "WRITE") {
            observation = `Successfully wrote to "${decision.details}".`;
        } else if (decision.action === "DONE") {
            logs.push({ id: step + 1, timestamp: new Date().toISOString(), action: "FINISH", details: "Task successfully completed." });
            break;
        } else {
            observation = "Unknown action.";
        }

        history.push(`Step ${step}: Action=${decision.action}, Details=${decision.details}, Obs=${observation}`);

        // Simuate latency
        await new Promise(r => setTimeout(r, 500));
    }

    if (logs[logs.length - 1].action !== "FINISH" && logs[logs.length - 1].action !== "DONE") {
        logs.push({ id: 99, timestamp: new Date().toISOString(), action: "STOP", details: "Max steps reached." });
    }

    return logs;
}
