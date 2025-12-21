'use server'

import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// --- Types ---

export interface VectorDocument {
    id: string;
    content: string;
    metadata: Record<string, any>;
    embedding: number[];
}

export interface SearchResult {
    document: VectorDocument;
    score: number;
}

export interface RagResult {
    query: string;
    retrievedContext: SearchResult[];
    answer: string;
    noRagAnswer?: string; // For comparison
    stats: {
        retrievalTime: number;
        generationTime: number;
        totalTime: number;
    };
}

// --- In-Memory Vector Store Logic ---

// We'll simulate a persistent store using a global variable for this educational demo.
// In a real app, this would be Pinecone, Chroma, etc.
// Note: In Next.js dev mode, this might reset on recompilation, which is fine for a demo lab.
let globalVectorStore: VectorDocument[] = [];

/**
 * Calculates Cosine Similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Adds documents to the simulated vector store
 */
export async function addDocumentsToStore(
    texts: string[],
    metadatas: Record<string, any>[] = [],
    model: string = "nomic-embed-text"
): Promise<VectorDocument[]> {
    const embeddingsModel = new OllamaEmbeddings({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
    });

    const embeddings = await embeddingsModel.embedDocuments(texts);

    const newDocs: VectorDocument[] = texts.map((text, i) => ({
        id: Math.random().toString(36).substring(7),
        content: text,
        metadata: metadatas[i] || {},
        embedding: embeddings[i]
    }));

    globalVectorStore = [...globalVectorStore, ...newDocs];
    return newDocs;
}

/**
 * Clears the simulated store
 */
export async function clearStore(): Promise<void> {
    globalVectorStore = [];
}

/**
 * Performs vector search
 */
export async function searchVectorStore(
    query: string,
    k: number = 3,
    model: string = "nomic-embed-text"
): Promise<SearchResult[]> {
    const embeddingsModel = new OllamaEmbeddings({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
    });

    const queryEmbedding = await embeddingsModel.embedQuery(query);

    const results = globalVectorStore
        .map(doc => ({
            document: doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

    return results;
}

// --- RAG Agent Workflow ---

/**
 * Runs a Retrieval-Augmented Generation workflow
 */
export async function runRagWorkflow(
    query: string,
    model: string = "llama3.2",
    embeddingModel: string = "nomic-embed-text"
): Promise<RagResult> {
    const startTime = Date.now();

    // 1. Retrieval Phase
    const retrievalStart = Date.now();
    const retrievedDocs = await searchVectorStore(query, 3, embeddingModel);
    const retrievalTime = Date.now() - retrievalStart;

    // Format context
    const contextText = retrievedDocs
        .map(r => `[Source Score: ${(r.score * 100).toFixed(1)}%]\n${r.document.content}`)
        .join("\n\n");

    // 2. Generation Phase (RAG)
    const genStart = Date.now();
    const chatModel = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.2, // Lower temp for factual grounding
    });

    const ragPrompt = PromptTemplate.fromTemplate(`
You are a helpful assistant. Use the following retrieved context to answer the user's question.
If the answer is not in the context, say "I don't have enough information in my knowledge base."

Context:
{context}

Question: 
{question}

Answer:`);

    const ragChain = RunnableSequence.from([
        ragPrompt,
        chatModel,
        new StringOutputParser()
    ]);

    const ragAnswer = await ragChain.invoke({
        context: contextText,
        question: query
    });

    // 3. Comparison Generation (No RAG / Direct LLM)
    const directChain = RunnableSequence.from([
        PromptTemplate.fromTemplate(`Question: {question}\nAnswer:`),
        chatModel,
        new StringOutputParser()
    ]);

    const noRagAnswer = await directChain.invoke({
        question: query
    });

    const generationTime = Date.now() - genStart;
    const totalTime = Date.now() - startTime;

    return {
        query,
        retrievedContext: retrievedDocs,
        answer: ragAnswer,
        noRagAnswer,
        stats: {
            retrievalTime,
            generationTime,
            totalTime
        }
    };
}

/**
 * Get current store stats
 */
export async function getStoreStats(): Promise<{ count: number; sampleDocs: VectorDocument[] }> {
    return {
        count: globalVectorStore.length,
        sampleDocs: globalVectorStore.slice(0, 5)
    };
}
