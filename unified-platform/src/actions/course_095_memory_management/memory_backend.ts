'use server';

export interface MemoryState {
    shortTerm: string[];
    longTerm: string[];
    logs: string[];
}

let state: MemoryState = {
    shortTerm: [],
    longTerm: [],
    logs: []
};

export async function processMemoryChat(input: string): Promise<MemoryState> {
    // 1. Add to Short Term
    state.shortTerm.push(input);
    state.logs.push(`Received: "${input}"`);

    // 2. Mock Agent Logic: Check for prominent facts to "Archive"
    if (input.toLowerCase().includes('name is') || input.toLowerCase().includes('i like')) {
        state.longTerm.push(input); // Persist
        state.logs.push(`Detected user fact. Moving "${input}" to Long-Term Storage.`);
    }

    // 3. FIFO Eviction (Simulate small context window)
    if (state.shortTerm.length > 3) {
        const removed = state.shortTerm.shift();
        state.logs.push(`Context Window Full. Evicting "${removed}" from Short-Term.`);
    }

    return { ...state };
}

export async function resetMemory() {
    state = { shortTerm: [], longTerm: [], logs: [] };
    return state;
}
