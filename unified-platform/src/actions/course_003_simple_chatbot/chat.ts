'use server'

import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import * as cheerio from 'cheerio';

export type OllamaModel = {
    name: string;
    model: string;
    size: number;
    digest: string;
    details: {
        format: string;
        family: string;
        families: string[] | null;
        parameter_size: string;
        quantization_level: string;
    }
};

export async function getOllamaModels(): Promise<string[]> {
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags', {
            next: { revalidate: 10 }
        });
        if (!res.ok) return [];

        const data = await res.json();
        return data.models.map((m: OllamaModel) => m.name);
    } catch (error) {
        console.warn("Could not fetch Ollama models:", error);
        return [];
    }
}

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

type ChatOptions = {
    pattern: 'stateless' | 'stateful' | 'system' | 'rag';
    systemPrompt?: string;
    searchProvider?: 'duckduckgo' | 'google' | 'bing';
};

// Simple Web Search (RAG Retriever)
async function performWebSearch(query: string, provider: string = 'duckduckgo'): Promise<string> {
    try {
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        let results = "";
        $('.result__body').each((i, el) => {
            if (i < 3) { // Top 3 results
                const title = $(el).find('.result__a').text().trim();
                const snippet = $(el).find('.result__snippet').text().trim();
                const link = $(el).find('.result__a').attr('href');
                results += `[Source ${i + 1} (${provider})]: ${title}\n"${snippet}"\nLink: ${link}\n\n`;
            }
        });

        return results || "No relevant search results found.";
    } catch (e) {
        console.error("Search failed:", e);
        return "Search functionality unavailable.";
    }
}

export async function sendMessage(
    history: ChatMessage[],
    message: string,
    model: string,
    options: ChatOptions = { pattern: 'stateful' }
): Promise<string> {
    // Default model fallback
    let targetModel = model;
    if (!targetModel) {
        const available = await getOllamaModels();
        targetModel = available.length > 0 ? available[0] : 'llama3.2';
    }

    // Initialize LangChain Chat Model
    const chat = new ChatOllama({
        model: targetModel,
        baseUrl: "http://127.0.0.1:11434",
    });

    try {
        let responseContent = "";

        // RAG Pattern
        if (options.pattern === 'rag') {
            // 1. Retrieval
            const context = await performWebSearch(message, options.searchProvider || 'duckduckgo');

            // 2. Augmentation & Generation
            const ragPrompt = `
You are a helpful assistant. Use the following context to answer the user's question.
If the answer is not in the context, say so, but try to answer based on your own knowledge if possible.
Cite the source if you use it.

CONTEXT:
${context}

USER QUESTION:
${message}
`;
            const res = await chat.invoke([new HumanMessage(ragPrompt)]);
            responseContent = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);

        } else {
            // Standard Patterns (Stateful, Stateless, System)
            let langchainHistory: BaseMessage[] = [];

            if (options.pattern === 'system') {
                langchainHistory.push(new SystemMessage(options.systemPrompt || "You are a helpful AI assistant."));
            }

            if (options.pattern !== 'stateless') {
                // Convert simple history to LangChain messages
                history.forEach(h => {
                    if (h.role === 'user') langchainHistory.push(new HumanMessage(h.content));
                    else if (h.role === 'assistant') langchainHistory.push(new AIMessage(h.content));
                    else if (h.role === 'system') langchainHistory.push(new SystemMessage(h.content));
                });
            }

            langchainHistory.push(new HumanMessage(message));

            const res = await chat.invoke(langchainHistory);
            responseContent = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
        }

        return responseContent;

    } catch (error) {
        console.error("LangChain Error:", error);
        return `[ERROR] Could not connect to Ollama or execute chain.\nDetails: ${error}`;
    }
}
