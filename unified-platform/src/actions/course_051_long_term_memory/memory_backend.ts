'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

// Mock In-Memory Store (simulating a vector database)
// In production, this would be a real vector DB like Pinecone, Weaviate, or Chroma
let memoryStore: Array<{ id: string; content: string; timestamp: number }> = [];

export async function saveToMemory(fact: string, modelName: string = 'auto'): Promise<boolean> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    memoryStore.push({
        id,
        content: fact,
        timestamp: Date.now()
    });

    // In a real app with vector DB:
    // const embedding = await generateEmbedding(fact, modelName);
    // await vectorDB.insert({ id, content: fact, embedding });

    return true;
}

export async function recallFromMemory(query: string, modelName: string = 'auto'): Promise<string[]> {
    if (memoryStore.length === 0) {
        return ["No memories stored yet. Save some facts first!"];
    }

    try {
        // Use LLM to score relevance of each memory to the query
        const systemPrompt = `You are a memory retrieval system.
Given a query and a list of stored memories, score each memory's relevance to the query.

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, just the JSON array.

Format:
[
  { "index": 0, "relevance": 0.9, "reason": "Directly answers the question" },
  { "index": 1, "relevance": 0.3, "reason": "Tangentially related" },
  ...
]

Rules:
- relevance is a score from 0.0 to 1.0
- 1.0 = perfect match, 0.0 = completely unrelated
- Include ALL memories in the response
- Be strict: only high scores for truly relevant memories`;

        const memoriesText = memoryStore
            .map((m, i) => `[${i}] "${m.content}"`)
            .join('\n');

        const userPrompt = `Query: "${query}"

Memories:
${memoriesText}

Score each memory's relevance to the query.`;

        const rawResponse = await queryLLM(systemPrompt, userPrompt, modelName, false);
        const scores = await extractJSON(rawResponse);

        if (!Array.isArray(scores)) {
            throw new Error("Invalid response format");
        }

        // Sort by relevance and filter for relevant memories (score > 0.5)
        const relevantMemories = scores
            .filter((s: any) => s.relevance > 0.5)
            .sort((a: any, b: any) => b.relevance - a.relevance)
            .slice(0, 5) // Top 5 most relevant
            .map((s: any) => {
                const memory = memoryStore[s.index];
                return memory ? memory.content : null;
            })
            .filter(Boolean);

        if (relevantMemories.length === 0) {
            return ["No relevant memories found for this query."];
        }

        return relevantMemories as string[];

    } catch (error) {
        console.error("Memory recall failed:", error);

        // Fallback to simple keyword matching
        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        const relevant = memoryStore
            .filter(m => keywords.some(k => m.content.toLowerCase().includes(k)))
            .slice(0, 5)
            .map(m => m.content);

        return relevant.length > 0 ? relevant : ["No relevant memories found."];
    }
}

export async function clearMemory(): Promise<void> {
    memoryStore = [];
}

export async function getMemoryCount(): Promise<number> {
    return memoryStore.length;
}
