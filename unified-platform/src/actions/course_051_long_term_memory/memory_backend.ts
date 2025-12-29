'use server';

// Mock In-Memory Vector Store for the session (Simulating Persisted DB)
let memoryStore: string[] = [];

export async function saveToMemory(fact: string): Promise<boolean> {
    memoryStore.push(fact);
    // In real app: await vectorDB.insert(embeddings(fact))
    return true;
}

export async function recallFromMemory(query: string): Promise<string[]> {
    // Naive keyword search simulation for demo
    // In real app: return await vectorDB.similaritySearch(query)

    if (memoryStore.length === 0) return [];

    // Simulate randomness of retrieval
    const relevant = memoryStore.filter(f => {
        const words = query.toLowerCase().split(' ');
        return words.some(w => f.toLowerCase().includes(w) && w.length > 3);
    });

    return relevant.length > 0 ? relevant : ["No relevant memories found."];
}

export async function clearMemory() {
    memoryStore = [];
}
