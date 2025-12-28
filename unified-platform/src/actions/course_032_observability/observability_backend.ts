'use server';

// --- Interfaces ---

export interface AgentLog {
    id: string;
    timestamp: number;
    model: string;
    latencyMs: number;
    tokensIn: number;
    tokensOut: number;
    status: 'success' | 'error';
    queryExcerpt: string;
}

export interface AgentStats {
    totalRequests: number;
    errorRate: number; // percentage
    avgLatency: number; // ms
    estimatedCost: number; // $
    logs: AgentLog[];
}

// --- In-Memory Store (Simulating DB) ---
let LOG_STORE: AgentLog[] = [];

// --- Actions ---

export async function simulateTraffic(): Promise<AgentLog> {
    // Simulate realistic variance
    const isError = Math.random() < 0.15; // 15% error rate
    const latency = 200 + Math.random() * 1500; // 200ms - 1.7s
    const tokensIn = Math.floor(50 + Math.random() * 500);
    const tokensOut = Math.floor(10 + Math.random() * 200);

    const QUERIES = [
        "What is the weather?",
        "Explain quantum computing",
        "Debug this Python code",
        "Write a haiku about rust",
        "Who is the CEO of Google?",
        "Translate hello to Spanish",
        "Summarize this PDF",
        "Calculate 50 * 5"
    ];

    const newLog: AgentLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        model: Math.random() > 0.5 ? "llama3.2" : "gpt-4-turbo", // Simulating mixed usage
        latencyMs: Math.round(latency),
        tokensIn,
        tokensOut,
        status: isError ? 'error' : 'success',
        queryExcerpt: QUERIES[Math.floor(Math.random() * QUERIES.length)]
    };

    // Keep store limited to last 100 for demo
    LOG_STORE.unshift(newLog);
    if (LOG_STORE.length > 50) LOG_STORE = LOG_STORE.slice(0, 50);

    return newLog;
}

export async function getStats(): Promise<AgentStats> {
    if (LOG_STORE.length === 0) {
        return { totalRequests: 0, errorRate: 0, avgLatency: 0, estimatedCost: 0, logs: [] };
    }

    const total = LOG_STORE.length;
    const errors = LOG_STORE.filter(l => l.status === 'error').length;
    const totalLatency = LOG_STORE.reduce((sum, l) => sum + l.latencyMs, 0);

    // Simple Cost Math: $0.50 / 1M input, $1.50 / 1M output (Example)
    const totalTokensIn = LOG_STORE.reduce((sum, l) => sum + l.tokensIn, 0);
    const totalTokensOut = LOG_STORE.reduce((sum, l) => sum + l.tokensOut, 0);
    const cost = (totalTokensIn * 0.0000005) + (totalTokensOut * 0.0000015);

    return {
        totalRequests: total,
        errorRate: Math.round((errors / total) * 100),
        avgLatency: Math.round(totalLatency / total),
        estimatedCost: Number(cost.toFixed(6)),
        logs: LOG_STORE
    };
}

export async function clearLogs() {
    LOG_STORE = [];
}
