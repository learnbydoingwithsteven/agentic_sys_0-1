'use server';

export interface EdgeTask {
    id: string;
    data: string;
    synced: boolean;
}

export async function processEdge(input: string): Promise<EdgeTask> {
    // Instant local processing
    return {
        id: Math.random().toString(36).substr(2, 5),
        data: `Processed: ${input}`,
        synced: false
    };
}

export async function syncBatch(tasks: EdgeTask[]): Promise<EdgeTask[]> {
    // Simulate Cloud Latency
    await new Promise(r => setTimeout(r, 1500));

    return tasks.map(t => ({ ...t, synced: true }));
}
