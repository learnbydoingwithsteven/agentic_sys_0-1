'use server';

import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
// Removed broken import: import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
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

// --- Helper: Simple Recursive Splitter (Manual Implementation) ---
class SimpleTextSplitter {
    chunkSize: number;
    chunkOverlap: number;

    constructor(options: { chunkSize: number; chunkOverlap: number }) {
        this.chunkSize = options.chunkSize;
        this.chunkOverlap = options.chunkOverlap;
    }

    async createDocuments(texts: string[]): Promise<Document[]> {
        const docs: Document[] = [];
        for (const text of texts) {
            const chunks = this.splitText(text);
            chunks.forEach(chunk => {
                docs.push(new Document({ pageContent: chunk }));
            });
        }
        return docs;
    }

    splitText(text: string): string[] {
        const chunks: string[] = [];
        let startIndex = 0;

        while (startIndex < text.length) {
            // Find end index logic
            let endIndex = Math.min(startIndex + this.chunkSize, text.length);

            // If not at end, try to find a natural break (newline or space) backwards
            if (endIndex < text.length) {
                // Try to split at double newline
                const lastDoubleNewline = text.lastIndexOf('\n\n', endIndex);
                if (lastDoubleNewline > startIndex) {
                    endIndex = lastDoubleNewline;
                } else {
                    // Try single newline
                    const lastNewline = text.lastIndexOf('\n', endIndex);
                    if (lastNewline > startIndex) {
                        endIndex = lastNewline;
                    } else {
                        // Try space
                        const lastSpace = text.lastIndexOf(' ', endIndex);
                        if (lastSpace > startIndex) {
                            endIndex = lastSpace;
                        }
                    }
                }
            }

            chunks.push(text.slice(startIndex, endIndex).trim());

            // Move start index, considering overlap (but not re-reading same full chunk)
            startIndex = endIndex - this.chunkOverlap;
            // Avoid infinite loop if overlap is too big or no split found
            if (startIndex >= endIndex) startIndex = endIndex;
            if (endIndex === text.length) break;
        }

        return chunks.filter(c => c.length > 0);
    }
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

        // Split text using our custom/resilient splitter
        const splitter = new SimpleTextSplitter({
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
    // If empty store, return empty
    if (ragVectorStore.length === 0) return [];

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
    history: ChatMessage[], // Not used in simple RAG yet
    model: string = "llama3.2",
    embedModel: string = "nomic-embed-text"
): Promise<RagResponse> {
    const start = Date.now();

    // A. Retrieve
    const contextDocs = await retrieveContext(query, 3, embedModel);

    // Default context if nothing found (to avoid empty prompt issues)
    const contextText = contextDocs.length > 0
        ? contextDocs.map(d => d.content).join("\n---\n")
        : "No relevant documents found.";

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
