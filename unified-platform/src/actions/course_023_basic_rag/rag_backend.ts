'use server';

import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// --- Types ---
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface RagResponse {
    answer: string;
    sources: string[]; // Snippets used
    latency: number;
}

// --- In-Memory Store (Singleton for Demo) ---
interface VectorEntry {
    content: string;
    embedding: number[];
    metadata: any;
}

let ragVectorStore: VectorEntry[] = [];

// --- Helper: Cosine Similarity ---
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return magA && magB ? dotProduct / (magA * magB) : 0;
}

// --- Actions ---

/**
 * 1. Ingest: Takes raw text, splits it, embeds it, and stores it.
 */
export async function ingestDocument(
    text: string, 
    model: string = "nomic-embed-text"
): Promise<{ chunks: number, success: boolean }> {
    try {
        // Reset store for fresh demo
        ragVectorStore = [];

        // Split text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });
        const docs = await splitter.createDocuments([text]);

        // Embed
        const embeddingsModel = new OllamaEmbeddings({
            baseUrl: "http://127.0.0.1:11434",
            model: model,
        });

        const embeddings = await embeddingsModel.embedDocuments(docs.map(d => d.pageContent));

        // Store
        ragVectorStore = docs.map((doc, i) => ({
            content: doc.pageContent,
            embedding: embeddings[i],
            metadata: doc.metadata
        }));

        return { chunks: docs.length, success: true };
    } catch (err) {
        console.error("Ingestion failed:", err);
        return { chunks: 0, success: false };
    }
}

/**
 * 2. Retrieve: Finds relevant chunks
 */
async function retrieveContext(query: string, k: number = 3, model: string = "nomic-embed-text") {
    const embeddingsModel = new OllamaEmbeddings({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
    });
    
    const queryEmbed = await embeddingsModel.embedQuery(query);

    const scored = ragVectorStore.map(entry => ({
        content: entry.content,
        score: cosineSimilarity(queryEmbed, entry.embedding)
    }));

    // Sort by score desc, take top k
    return scored.sort((a, b) => b.score - a.score).slice(0, k);
}

/**
 * 3. Chat: RAG generation
 */
export async function chatWithRag(
    query: string,
    history: ChatMessage[], // Not used in simple RAG yet, but prepared for future
    model: string = "llama3.2",
    embedModel: string = "nomic-embed-text"
): Promise<RagResponse> {
    const start = Date.now();

    // A. Retrieve
    const contextDocs = await retrieveContext(query, 3, embedModel);
    const contextText = contextDocs.map(d => d.content).join("\n---\n");
    const sources = contextDocs.map(d => d.content);

    // B. Generate
    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3, // Low temp for grounded answers
    });

    const prompt = PromptTemplate.fromTemplate(`
You are an intelligent assistant answering questions based STRICTLY on the provided context.
If the answer is not in the context, politely state that you strictly don't know based on the documents.

Context:
{context}

Question: 
{question}

Answer (concise and helpful):`);

    const chain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser()
    ]);

    const answer = await chain.invoke({
        context: contextText,
        question: query
    });

    return {
        answer,
        sources,
        latency: Date.now() - start
    };
}
