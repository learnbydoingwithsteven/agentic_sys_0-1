'use server';

import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";

// --- Interfaces ---

export interface QAResult {
    answer: string;
    sourceNodes: string[];
}

// --- Helpers ---

// 1. Manual Text Splitter (Dependency-free & Robust)
class SimpleTextSplitter {
    chunkSize: number;
    chunkOverlap: number;

    constructor(options: { chunkSize: number; chunkOverlap: number }) {
        this.chunkSize = options.chunkSize;
        this.chunkOverlap = options.chunkOverlap;
    }

    createDocuments(text: string): Document[] {
        const docs: Document[] = [];
        const chunks = this.splitText(text);
        chunks.forEach(chunk => {
            docs.push(new Document({ pageContent: chunk }));
        });
        return docs;
    }

    splitText(text: string): string[] {
        const chunks: string[] = [];
        let startIndex = 0;

        while (startIndex < text.length) {
            let endIndex = Math.min(startIndex + this.chunkSize, text.length);

            // Try to find natural break
            if (endIndex < text.length) {
                const breaks = ['\n\n', '\n', '. ', ' '];
                for (const b of breaks) {
                    const lastBreak = text.lastIndexOf(b, endIndex);
                    if (lastBreak > startIndex) {
                        endIndex = lastBreak + b.length;
                        break;
                    }
                }
            }

            const chunk = text.slice(startIndex, endIndex).trim();
            if (chunk.length > 0) chunks.push(chunk);

            // Move start index for overlap
            // CRITICAL FIX: Ensure we advance by at least 1 character to avoid infinite loops
            const nextStart = Math.max(startIndex + 1, endIndex - this.chunkOverlap);
            startIndex = nextStart;

            // If we reached the end, stop
            if (startIndex >= text.length || endIndex === text.length) break;
        }
        return chunks;
    }
}

// 2. Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
    const magB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}

// --- Main Action ---

export async function processAndAnswer(
    documentText: string,
    question: string,
    model: string = "llama3.2"
): Promise<QAResult> {

    // 1. Chunking
    const splitter = new SimpleTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
    const docs = splitter.createDocuments(documentText);
    const texts = docs.map(d => d.pageContent);

    // 2. Embedding (Ephemeral)
    const embedder = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://127.0.0.1:11434"
    });

    let embeddings: number[][] = [];
    try {
        embeddings = await embedder.embedDocuments(texts);
    } catch (e) {
        return {
            answer: "Error: Embedding failed. Please ensure you have 'nomic-embed-text' pulled in Ollama (`ollama pull nomic-embed-text`).",
            sourceNodes: []
        };
    }

    const queryEmbedding = await embedder.embedQuery(question);

    // 3. Retrieval (Manual Vector Search)
    const scoredDocs = texts.map((text, i) => ({
        content: text,
        score: cosineSimilarity(queryEmbedding, embeddings[i])
    }));

    // Top 3
    const topChunks = scoredDocs.sort((a, b) => b.score - a.score).slice(0, 3);
    const context = topChunks.map(c => c.content).join("\n---\n");

    // 4. Generation
    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful assistant answering questions about a provided text.
Use ONLY the following context to answer. If the answer is missing, say so.

Context:
{context}

Question: {question}
`);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const answer = await chain.invoke({
        context,
        question
    });

    return {
        answer,
        sourceNodes: topChunks.map(c => c.content)
    };
}
