'use server';

export interface AgentLog {
    id: number;
    timestamp: string;
    action: string;
    details: string;
}

export async function pollAgentActivity(step: number): Promise<AgentLog> {
    // Simulates an async background process
    await new Promise(r => setTimeout(r, 800)); // Variable latency

    const logs = [
        { action: "INIT", details: "Agent initialized. Goal: 'Market Research'" },
        { action: "THINK", details: "Breaking down goal into search queries." },
        { action: "WebSearch", details: "Searching for 'Latest AI Trends 2024'" },
        { action: "READ", details: "Reading article 'Transformers v5 release'..." },
        { action: "THINK", details: "Found relevant info. Creating summary." },
        { action: "WRITE", details: "Writing draft to file: research.md" },
        { action: "CHECK", details: "Verifying output quality..." },
        { action: "DONE", details: "Task completed successfully." },
    ];

    if (step >= logs.length) return { id: step, timestamp: new Date().toISOString(), action: "IDLE", details: "Waiting for new tasks..." };

    return {
        id: step,
        timestamp: new Date().toISOString(),
        action: logs[step].action,
        details: logs[step].details
    };
}
