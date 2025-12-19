'use server'

type Memory = {
    key: string;
    value: string;
    type: 'short-term' | 'long-term';
    timestamp: string;
}

// Simulated "Database"
let memoryStore: Memory[] = [];

export async function saveMemoryAction(key: string, value: string, type: 'short-term' | 'long-term'): Promise<Memory> {
    // Simulate DB Latency
    await new Promise(r => setTimeout(r, 600));

    const newMemory: Memory = {
        key,
        value,
        type,
        timestamp: new Date().toLocaleTimeString()
    };

    // Upsert logic simulation
    const existingIndex = memoryStore.findIndex(m => m.key === key);
    if (existingIndex >= 0) {
        memoryStore[existingIndex] = newMemory;
    } else {
        memoryStore.push(newMemory);
    }

    return newMemory;
}

export async function retrieveMemoryAction(key: string): Promise<Memory | null> {
    await new Promise(r => setTimeout(r, 400));
    const memory = memoryStore.find(m => m.key === key);
    return memory || null;
}

export async function getAllMemoriesAction(): Promise<Memory[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...memoryStore];
}

export async function clearMemoriesAction() {
    memoryStore = [];
    return true;
}
