'use server';

import { OllamaEmbeddings } from "@langchain/ollama";

// --- Interfaces ---

export interface Route {
    name: string;
    description: string;
    examples: string[];
}

export interface RoutingResult {
    selectedRoute: string;
    confidence: number;
    scores: { route: string; score: number }[];
    latency: number;
}

// --- Configuration ---

const ROUTES: Route[] = [
    {
        name: "refund",
        description: "Billing inquiries and refund requests",
        examples: [
            "I want my money back",
            "cancel my subscription",
            "this is too expensive",
            "billing issue",
            "refund please"
        ]
    },
    {
        name: "technical_support",
        description: "Technical problems and bugs",
        examples: [
            "the app crashed",
            "I can't log in",
            "screen is black",
            "error message 500",
            "how do I fix this bug"
        ]
    },
    {
        name: "greeting",
        description: "Small talk and greetings",
        examples: [
            "hello",
            "hi there",
            "good morning",
            "how are you",
            "nice to meet you"
        ]
    }
];

// --- Helpers ---

// Manual Cosine Similarity (Robust & Dependency-free)
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
    const magB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}

// --- Main Action ---

export async function routeRequest(query: string): Promise<RoutingResult> {
    const start = Date.now();

    // 1. Initialize Embedder
    // Using 'nomic-embed-text' is best for this.
    const embedder = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://127.0.0.1:11434"
    });

    // 2. Embed Query
    let queryEmbedding: number[];
    try {
        queryEmbedding = await embedder.embedQuery(query);
    } catch (e) {
        console.error("Embedding failed", e);
        return { selectedRoute: "error", confidence: 0, scores: [], latency: 0 };
    }

    // 3. Compare against all examples (Brute force for clarity)
    // In production, you'd cache the example embeddings!
    // For this demo, we'll embed them on the fly (it's slow but simple stateless server action).
    // Optimization: We could pre-calculate them if we had a stateful backend. 
    // Let's assume for this demo ~15 embeddings is fast enough locally (~500ms).

    const allExamples: { route: string; text: string }[] = [];
    ROUTES.forEach(r => r.examples.forEach(ex => allExamples.push({ route: r.name, text: ex })));

    // Batch embed all examples
    const exampleEmbeddings = await embedder.embedDocuments(allExamples.map(x => x.text));

    // 4. Score
    const scoresMap = new Map<string, number>();

    // Initialize scores
    ROUTES.forEach(r => scoresMap.set(r.name, 0));

    // Find Max Similarity per Route
    allExamples.forEach((ex, idx) => {
        const score = cosineSimilarity(queryEmbedding, exampleEmbeddings[idx]);
        const currentMax = scoresMap.get(ex.route) || 0;
        if (score > currentMax) {
            scoresMap.set(ex.route, score);
        }
    });

    // Sort
    const sortedScores = Array.from(scoresMap.entries())
        .map(([route, score]) => ({ route, score }))
        .sort((a, b) => b.score - a.score);

    const winner = sortedScores[0];
    // Threshold check (e.g. 0.4)
    const THRESHOLD = 0.5;
    const selectedRoute = winner.score > THRESHOLD ? winner.route : "general_inquiry"; // Fallback

    return {
        selectedRoute,
        confidence: winner.score,
        scores: sortedScores,
        latency: Date.now() - start
    };
}
