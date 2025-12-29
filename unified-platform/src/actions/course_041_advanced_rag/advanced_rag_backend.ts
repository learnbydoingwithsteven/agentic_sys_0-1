'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// --- Mock Data (Simulated Vector Store) ---
const MOCK_DOCS = [
    { id: 1, content: "The Golden Gate Bridge is in San Francisco. It is red.", relevance: "high" },
    { id: 2, content: "San Francisco is a city in California known for fog.", relevance: "medium" },
    { id: 3, content: "Pizza is a delicious dish from Italy.", relevance: "irrelevant" },
    { id: 4, content: "The bridge was completed in 1937.", relevance: "high" },
    { id: 5, content: "Python is a programming language.", relevance: "irrelevant" }
];

// --- Interfaces ---

export interface RetrievedDoc {
    id: number;
    content: string;
    rawScore?: number; // Initial similarity
    rerankScore?: number; // Reranker confidence
    keep: boolean; // Decision
}

export interface RagResult {
    query: string;
    originalDocs: RetrievedDoc[];
    refinedDocs: RetrievedDoc[];
    finalAnswer: string;
    selfCorrection: string;
}

// --- Main Action ---

export async function advancedRagPipeline(query: string): Promise<RagResult> {

    // 1. Retrieval (Simulated: Return all mock docs)
    // In real app: vectorStore.similaritySearch(query, k=5)
    let docs: RetrievedDoc[] = MOCK_DOCS.map(d => ({
        ...d,
        keep: false, // Default
        rawScore: Math.random() // Simulating vector distance
    }));

    // 2. Reranking (The "Advanced" Part)
    // We use an LLM-as-a-Judge to score relevance 0-10.
    const llm = new ChatOllama({
        model: "qwen2.5:1.5b",
        baseUrl: "http://127.0.0.1:11434",
        temperature: 0,
    });

    // We process each doc to score it (Parallel map)
    const scoredDocs = await Promise.all(docs.map(async (doc) => {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a relevance grader. Rate the relevance of the following document to the query on a scale of 0-10. Return ONLY the number."],
            ["user", `Query: ${query}\nDocument: ${doc.content}`]
        ]);

        try {
            const scoreStr = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
            const score = parseInt(scoreStr.match(/\d+/)?.[0] || "0");
            return { ...doc, rerankScore: score, keep: score >= 6 };
        } catch (e) {
            return { ...doc, rerankScore: 0, keep: false };
        }
    }));

    // 3. Filtering
    const refinedDocs = scoredDocs.filter(d => d.keep);

    // 4. Self-Correction / Generation
    let finalAnswer = "";
    let selfCorrection = "Pass";

    if (refinedDocs.length === 0) {
        selfCorrection = "Fail: No relevant documents found. Triggering fallback.";
        finalAnswer = "I couldn't find relevant information in the knowledge base to answer that.";
    } else {
        const context = refinedDocs.map(d => d.content).join("\n");
        const genPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Answer the question based ONLY on the context provided."],
            ["user", `Context: ${context}\n\nQuestion: ${query}`]
        ]);
        finalAnswer = await genPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
    }

    return {
        query,
        originalDocs: scoredDocs, // Return these to show the "before"
        refinedDocs,
        finalAnswer,
        selfCorrection
    };
}
