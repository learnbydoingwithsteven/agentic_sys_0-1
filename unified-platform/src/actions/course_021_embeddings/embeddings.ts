'use server'

import { OllamaEmbeddings } from "@langchain/ollama";

export interface EmbeddingResult {
    text: string;
    embedding: number[];
    dimensions: number;
}

export interface SimilarityResult {
    textA: string;
    textB: string;
    score: number;
}

/**
 * Generate embedding for a single text using Ollama
 */
export async function generateEmbedding(
    text: string,
    model: string = "nomic-embed-text"
): Promise<EmbeddingResult> {
    try {
        const embeddings = new OllamaEmbeddings({
            baseUrl: "http://127.0.0.1:11434",
            model: model,
        });

        const vector = await embeddings.embedQuery(text);

        return {
            text,
            embedding: vector,
            dimensions: vector.length
        };
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Generate multiple embeddings in batch
 */
export async function generateEmbeddingsBatch(
    texts: string[],
    model: string = "nomic-embed-text"
): Promise<EmbeddingResult[]> {
    try {
        const embeddings = new OllamaEmbeddings({
            baseUrl: "http://127.0.0.1:11434",
            model: model,
        });

        const vectors = await embeddings.embedDocuments(texts);

        return texts.map((text, i) => ({
            text,
            embedding: vectors[i],
            dimensions: vectors[i].length
        }));
    } catch (error) {
        console.error("Error generating batch embeddings:", error);
        throw new Error("Failed to generate batch embeddings");
    }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
}

/**
 * Compare a query against a list of target texts
 */
export async function findSimilarTexts(
    query: string,
    targets: string[],
    model: string = "nomic-embed-text"
): Promise<SimilarityResult[]> {
    const queryEmbedding = await generateEmbedding(query, model);
    const targetEmbeddings = await generateEmbeddingsBatch(targets, model);

    const results = targetEmbeddings.map(target => ({
        textA: query,
        textB: target.text,
        score: calculateCosineSimilarity(queryEmbedding.embedding, target.embedding)
    }));

    // Sort by similarity score descending
    return results.sort((a, b) => b.score - a.score);
}
