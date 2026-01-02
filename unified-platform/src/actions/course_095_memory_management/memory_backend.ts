'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

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

export async function processMemoryChat(input: string, modelName: string = 'auto'): Promise<MemoryState> {
    // 1. Add to Short Term (Working Memory)
    state.shortTerm.push(input);
    state.logs.push(`📥 Received: "${input}"`);

    // 2. LLM-based Memory Triage: Decide what to archive
    const triagePrompt = `You are a Memory Management Agent.

Current Short-Term Memory: ${JSON.stringify(state.shortTerm)}
Current Long-Term Memory: ${JSON.stringify(state.longTerm)}
New Input: "${input}"

Task: Determine if this input contains important information that should be archived to Long-Term Memory.
Examples of important info: user preferences, facts about the user, key decisions, important context.

Return JSON: { "should_archive": boolean, "reason": "string" }`;

    let shouldArchive = false;
    let reason = "Not significant enough";

    try {
        const raw = await queryLLM(triagePrompt, "Triage memory.", modelName, true);
        const res = await extractJSON(raw);
        shouldArchive = res.should_archive;
        reason = res.reason;
    } catch { }

    if (shouldArchive) {
        state.longTerm.push(input);
        state.logs.push(`💾 Archived to Long-Term: "${input}" (${reason})`);
    } else {
        state.logs.push(`⏭️ Kept in Short-Term only (${reason})`);
    }

    // 3. Context Window Management (FIFO Eviction)
    const MAX_SHORT_TERM = 4;
    if (state.shortTerm.length > MAX_SHORT_TERM) {
        const evicted = state.shortTerm.shift();
        state.logs.push(`🗑️ Context overflow: Evicted "${evicted}" from Short-Term`);
    }

    return { ...state };
}

export async function resetMemory() {
    state = { shortTerm: [], longTerm: [], logs: [] };
    return state;
}
