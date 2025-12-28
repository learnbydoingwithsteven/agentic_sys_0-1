'use server';

import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Interfaces ---

export interface CacheEntry {
    query: string;
    embedding: number[];
    answer: string;
    timestamp: number;
}

export interface ProcessingResult {
    answer: string;
    isHit: boolean;
    similarity: number;
    latency: number;
    source: 'cache' | 'llm';
    matchedQuery?: string;
}

// --- In-Memory Store (Ephemeral) ---
// In production, use Redis (Vector) or pgvector.
let semanticCache: CacheEntry[] = [];

// --- Helpers ---

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
    const magB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}

// --- Main Action ---

export async function askWithCache(question: string): Promise<ProcessingResult> {
    const start = Date.now();
    const SIMILARITY_THRESHOLD = 0.85;

    // 1. Initialize Embedder & LLM
    const embedder = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://127.0.0.1:11434"
    });

    const llm = new ChatOllama({
        model: "qwen2.5:1.5b",
        baseUrl: "http://127.0.0.1:11434",
    });

    // 2. Embed Query
    let queryEmbedding: number[];
    try {
        queryEmbedding = await embedder.embedQuery(question);
    } catch (e) {
        return {
            answer: "Error: Embedding failed. Ensure 'nomic-embed-text' is installed.",
            isHit: false,
            similarity: 0,
            latency: Date.now() - start,
            source: 'llm'
        };
    }

    // 3. Check Cache
    let bestMatch: { entry: CacheEntry; score: number } | null = null;
    let maxScore = -1;

    for (const entry of semanticCache) {
        const score = cosineSimilarity(queryEmbedding, entry.embedding);
        if (score > maxScore) {
            maxScore = score;
            bestMatch = { entry, score };
        }
    }

    // 4. HIT: Return cached
    if (bestMatch && maxScore > SIMILARITY_THRESHOLD) {
        return {
            answer: bestMatch.entry.answer,
            isHit: true,
            similarity: maxScore,
            latency: Date.now() - start,
            source: 'cache',
            matchedQuery: bestMatch.entry.query
        };
    }

    // 5. MISS: Execute LLM (Simulate extra delay to emphasize difference)
    // We add a synthetic delay to represent a "tool call" or slow chain.
    await new Promise(r => setTimeout(r, 1500));

    const answer = await llm.pipe(new StringOutputParser()).invoke(question);

    // 6. Store in Cache
    semanticCache.push({
        query: question,
        embedding: queryEmbedding,
        answer: answer,
        timestamp: Date.now()
    });

    return {
        answer,
        isHit: false,
        similarity: maxScore > 0 ? maxScore : 0,
        latency: Date.now() - start,
        source: 'llm'
    };
}

export async function clearCache() {
    semanticCache = [];
    return { success: true };
}
