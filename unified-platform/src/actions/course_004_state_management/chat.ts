'use server'

import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export type OllamaModel = {
    name: string;
    model: string;
};

// Reuse or re-implement for independence
export async function getOllamaModels(): Promise<string[]> {
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags', { next: { revalidate: 10 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.models.map((m: any) => m.name);
    } catch {
        return [];
    }
}

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

type MemoryType = 'no-memory' | 'buffer' | 'window' | 'summary' | 'vector';

// Simulated Vector Database (Knowledge Base)
export type VectorDoc = {
    id: string;
    content: string;
    keywords: string[];
};

let mockVectorStore: VectorDoc[] = [
    { id: '1', content: "The user's favorite color is blue.", keywords: ['color', 'blue', 'favorite'] },
    { id: '2', content: "Project Apollo was the NASA program that landed the first humans on the Moon.", keywords: ['nasa', 'apollo', 'moon'] },
    { id: '3', content: "React is a JavaScript library for building user interfaces.", keywords: ['react', 'javascript', 'library', 'ui'] },
];

export async function getVectorStore(): Promise<VectorDoc[]> {
    return [...mockVectorStore];
}

export async function addFactToVectorStore(content: string): Promise<VectorDoc> {
    await new Promise(r => setTimeout(r, 500)); // Simulate embedding latency
    const newDoc: VectorDoc = {
        id: Math.random().toString(36).substring(7),
        content,
        // Simple keyword extraction for simulation
        keywords: content.toLowerCase().split(' ').filter(w => w.length > 3)
    };
    mockVectorStore.push(newDoc);
    return newDoc;
}

export async function testVectorSearch(query: string): Promise<{ doc: VectorDoc, score: number }[]> {
    await new Promise(r => setTimeout(r, 600)); // Simulate search latency
    const queryTerms = query.toLowerCase().split(' ');

    // Simulate Cosine Similarity Scoring
    return mockVectorStore.map(doc => {
        let score = 0;
        // Term overlap score
        const termMatches = doc.keywords.filter(k => queryTerms.some(qt => qt.includes(k) || k.includes(qt))).length;
        if (termMatches > 0) score += 0.5 + (termMatches * 0.1);

        // Exact substring boost
        if (doc.content.toLowerCase().includes(query.toLowerCase())) score += 0.4;

        return { doc, score: Math.min(score, 0.99) }; // Cap at 0.99
    })
        .filter(r => r.score > 0.1) // Filter low relevance
        .sort((a, b) => b.score - a.score); // Sort by score desc
}

export async function sendStatefulMessage(
    fullHistory: ChatMessage[],
    newMessage: string,
    model: string,
    memoryType: MemoryType
): Promise<{ response: string; usedContext: string }> { // Return context for visualization

    let targetModel = model;
    if (!targetModel) {
        const models = await getOllamaModels();
        targetModel = models[0] || 'llama3.2';
    }

    const chat = new ChatOllama({
        model: targetModel,
        baseUrl: "http://127.0.0.1:11434",
    });

    let contextMessages: BaseMessage[] = [];
    let contextDescription = "";

    // 1. Construct Context based on Memory Type
    if (memoryType === 'no-memory') {
        contextMessages = [new HumanMessage(newMessage)];
        contextDescription = "Only the current user message.";
    }
    else if (memoryType === 'buffer') {
        // Full History
        contextMessages = fullHistory.map(h =>
            h.role === 'user' ? new HumanMessage(h.content) : new AIMessage(h.content)
        );
        contextMessages.push(new HumanMessage(newMessage));
        contextDescription = `Full history (${fullHistory.length} previous messages).`;
    }
    else if (memoryType === 'window') {
        // Last 2 messages only
        const windowSize = 2;
        const recent = fullHistory.slice(-windowSize);
        contextMessages = recent.map(h =>
            h.role === 'user' ? new HumanMessage(h.content) : new AIMessage(h.content)
        );
        contextMessages.push(new HumanMessage(newMessage));
        contextDescription = `Sliding Window (Last ${recent.length} messages only).`;
    }
    else if (memoryType === 'summary') {
        // Basic Summary Simulation
        // In a real app, we'd maintain a running summary.
        // Here, we'll quickly summarize the older history if it exists.

        if (fullHistory.length > 2) {
            const olderHistory = fullHistory.slice(0, -2);
            const recentHistory = fullHistory.slice(-2);

            // On-the-fly summarization (expensive but demonstrates the point)
            const summaryPrompt = `Summarize the following conversation briefly:\n\n${olderHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`;
            const summaryRes = await chat.invoke([new HumanMessage(summaryPrompt)]);
            const summary = typeof summaryRes.content === 'string' ? summaryRes.content : JSON.stringify(summaryRes.content);

            const systemMsg = new SystemMessage(`Current Conversation Summary: ${summary}`);
            contextMessages = [systemMsg];

            recentHistory.forEach(h => {
                contextMessages.push(h.role === 'user' ? new HumanMessage(h.content) : new AIMessage(h.content));
            });
            contextDescription = `Generated Summary of ${olderHistory.length} old msgs + Last 2 raw msgs.`;
        } else {
            // Behave like buffer if short
            contextMessages = fullHistory.map(h =>
                h.role === 'user' ? new HumanMessage(h.content) : new AIMessage(h.content)
            );
            contextDescription = "History too short to summarize yet. Using full buffer.";
        }
        contextMessages.push(new HumanMessage(newMessage));
    }
    else if (memoryType === 'vector') {
        // Simulated RAG / Vector Retrieval
        const hits = await testVectorSearch(newMessage);
        const topHits = hits.slice(0, 3); // Take top 3

        if (topHits.length > 0) {
            const contextBlock = topHits.map(h => `- ${h.doc.content} (Score: ${h.score.toFixed(2)})`).join('\n');
            contextMessages.push(new SystemMessage(`Relevant Facts retrieved from Vector DB:\n${contextBlock}`));
            contextDescription = `Retrieved ${topHits.length} facts from Vector DB.`;
        } else {
            contextDescription = "No relevant facts found in Vector DB for this query.";
        }
        contextMessages.push(new HumanMessage(newMessage));
    }

    try {
        const res = await chat.invoke(contextMessages);
        const responseText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
        return { response: responseText, usedContext: contextDescription };
    } catch (e) {
        return { response: "Error connecting to AI.", usedContext: "Error" };
    }
}
