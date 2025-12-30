'use server';

export interface Pod {
    id: string;
    name: string;
    status: 'Running' | 'Pending' | 'Terminating' | 'CrashLoopBackOff';
    age: number; // seconds
}

let podList: Pod[] = [
    { id: '1', name: 'agent-worker-x8z1', status: 'Running', age: 3400 },
    { id: '2', name: 'agent-worker-92ka', status: 'Running', age: 3200 },
    { id: '3', name: 'agent-worker-pp2l', status: 'Running', age: 100 },
    { id: '4', name: 'agent-worker-11mm', status: 'Running', age: 50 }
];

export async function fetchPods(): Promise<Pod[]> {
    // Auto-heal logic mock
    podList = podList.map(p => {
        if (p.status === 'Terminating') {
            // Remove it? No, usually it disappears and a new one appears.
            // Simplified: Terminating -> Gone.
            return null;
        }
        if (p.status === 'Pending') {
            // Pending -> Running
            return { ...p, status: 'Running', age: 0 };
        }
        return { ...p, age: p.age + 5 }; // Age up
    }).filter(Boolean) as Pod[];

    // ReplicaSet Logic: If count < 4, create new
    while (podList.length < 4) {
        podList.push({
            id: Math.random().toString(36).substr(2, 5),
            name: `agent-worker-${Math.random().toString(36).substr(2, 4)}`,
            status: 'Pending',
            age: 0
        });
    }

    return podList;
}

export async function terminatePod(id: string): Promise<Pod[]> {
    podList = podList.map(p => p.id === id ? { ...p, status: 'Terminating' } : p);
    return podList;
}
