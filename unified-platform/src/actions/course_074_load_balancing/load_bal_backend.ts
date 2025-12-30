'use server';

export interface ServerInstance {
    id: string;
    name: string;
    load: number; // 0-100%
    status: 'idle' | 'busy';
}

// Pseudo-state
let instances: ServerInstance[] = [
    { id: '1', name: 'Worker-A (US-East)', load: 0, status: 'idle' },
    { id: '2', name: 'Worker-B (EU-West)', load: 0, status: 'idle' },
    { id: '3', name: 'Worker-C (Asia-Pac)', load: 0, status: 'idle' }
];

export async function getLoadStats(): Promise<ServerInstance[]> {
    // Randomly fluctuate load to simulate activity
    instances = instances.map(i => ({
        ...i,
        load: Math.max(0, i.load - 5) // Decay
    }));
    return instances;
}

export async function sendBalancedRequest(strategy: 'ROUND_ROBIN' | 'LEAST_LOAD'): Promise<{ routedTo: string }> {
    // 1. Pick instance based on strategy
    let target = instances[0];

    if (strategy === 'ROUND_ROBIN') {
        // Just pick random for stateless demo, or use timestamp
        const idx = Math.floor(Date.now() / 1000) % 3;
        target = instances[idx];
    } else {
        // Least Load
        target = instances.reduce((prev, curr) => (prev.load < curr.load ? prev : curr));
    }

    // 2. Add load
    instances = instances.map(i => i.id === target.id ? { ...i, load: Math.min(100, i.load + 30) } : i);

    return { routedTo: target.id };
}
