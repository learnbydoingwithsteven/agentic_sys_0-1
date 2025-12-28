'use server';

import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// --- Mock Data ---
const DB_HR = [
    "Employees are entitled to 20 days of paid vacation per year.",
    "Sick leave must be reported by 9:00 AM on the day of absence.",
    "Payroll is processed on the 25th of every month.",
    "Casual Friday allows jeans, but no sandals.",
    "Maternity leave is 16 weeks fully paid."
];

const DB_IT = [
    "To reset password, go to https://sso.company.com/reset.",
    "The office WiFi password is 'SecureNet2025!'.",
    "VPN requires 2FA using the Authenticator app.",
    "Hardware refresh cycles occur every 3 years for laptops.",
    "Report phishing emails to security@company.com immediately."
];

// --- Caching Embeddings (Singleton) ---
interface VectorEntry {
    content: string;
    embedding: number[];
    source: 'HR' | 'IT';
}

let vectors: VectorEntry[] = [];
let isIndexed = false;

// --- Helper: Cosine Similarity ---
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return magA && magB ? dotProduct / (magA * magB) : 0;
}

// --- Actions ---

export async function initializeSearchAgent(model: string = "nomic-embed-text") {
    if (isIndexed) return { status: "ready" };

    try {
        const embedder = new OllamaEmbeddings({
            baseUrl: "http://127.0.0.1:11434",
            model: model
        });

        // Batch embed HR
        const hrEmbeds = await embedder.embedDocuments(DB_HR);
        const hrEntries = DB_HR.map((text, i) => ({
            content: text,
            embedding: hrEmbeds[i],
            source: 'HR' as const
        }));

        // Batch embed IT
        const itEmbeds = await embedder.embedDocuments(DB_IT);
        const itEntries = DB_IT.map((text, i) => ({
            content: text,
            embedding: itEmbeds[i],
            source: 'IT' as const
        }));

        vectors = [...hrEntries, ...itEntries];
        isIndexed = true;
        return { status: "indexed", count: vectors.length };
    } catch (e) {
        console.error("Indexing failed", e);
        return { status: "error" };
    }
}

interface AgentResult {
    tool: 'HR_SEARCH' | 'IT_SEARCH' | 'GENERAL';
    thought: string;
    searchQuery?: string;
    retrieved?: string;
    finalAnswer: string;
}

export async function runSemanticAgent(
    query: string,
    chatModel: string = "llama3.2",
    embedModel: string = "nomic-embed-text"
): Promise<AgentResult> {
    // 0. Ensure indexed
    if (!isIndexed) await initializeSearchAgent(embedModel);

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: chatModel,
        temperature: 0
    });

    // 1. ROUTING (The "Brain")
    // We ask the LLM to classify the intent.
    const routerPrompt = PromptTemplate.fromTemplate(`
You are a routing agent. You have access to two databases:
1. HR_DB: Employee policies, vacation, payroll.
2. IT_DB: Technical support, wifi, passwords, hardware.

Given the user input, decide which database to search, or if you should answer generally (for greetings/chitchat).
Return ONLY a JSON object: {{ "tool": "HR" | "IT" | "GENERAL", "reason": "brief reasoning" }}

User Input: {input}
`);

    const routerChain = RunnableSequence.from([
        routerPrompt,
        llm,
        new StringOutputParser()
    ]);

    let routeStr = "";
    let toolChoice: 'HR' | 'IT' | 'GENERAL' = 'GENERAL';
    let thought = "";

    try {
        routeStr = await routerChain.invoke({ input: query });
        // Naive JSON parsing cleanup
        const cleanJson = routeStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const t = parsed.tool?.toUpperCase();
        if (t === 'HR') toolChoice = 'HR';
        else if (t === 'IT') toolChoice = 'IT';
        thought = parsed.reason || "Decided based on keyword analysis.";
    } catch (e) {
        // Fallback checks
        if (query.toLowerCase().includes("wifi") || query.toLowerCase().includes("password")) toolChoice = 'IT';
        else if (query.toLowerCase().includes("leave") || query.toLowerCase().includes("pay")) toolChoice = 'HR';
        thought = "JSON parsing failed, used fallback keywords.";
    }

    // 2. EXECUTION (The "Action")
    if (toolChoice === 'GENERAL') {
        const chatChain = RunnableSequence.from([
            PromptTemplate.fromTemplate("You are a helpful assistant. Reply to the user: {input}"),
            llm,
            new StringOutputParser()
        ]);
        const answer = await chatChain.invoke({ input: query });
        return {
            tool: 'GENERAL',
            thought: thought,
            finalAnswer: answer
        };
    }

    // Semantic Search
    const embedder = new OllamaEmbeddings({
        baseUrl: "http://127.0.0.1:11434",
        model: embedModel
    });
    const queryEmbed = await embedder.embedQuery(query);

    // Filter by source then sort by similarity
    const filtered = vectors.filter(v => v.source === toolChoice);
    const scored = filtered.map(v => ({
        content: v.content,
        score: cosineSimilarity(queryEmbed, v.embedding)
    })).sort((a, b) => b.score - a.score);

    const bestMatch = scored[0]; // Top 1

    // 3. SYNTHESIS (The "Response")
    const synthPrompt = PromptTemplate.fromTemplate(`
You are a helpful assistant. You just searched the {tool} database.
User Question: {query}
Retrieved Fact: "{fact}" (Confidence: {score})

Answer the user's question using the retrieved fact.
`);

    const synthChain = RunnableSequence.from([
        synthPrompt,
        llm,
        new StringOutputParser()
    ]);

    const finalAnswer = await synthChain.invoke({
        tool: toolChoice,
        query: query,
        fact: bestMatch.content,
        score: bestMatch.score.toFixed(2)
    });

    return {
        tool: toolChoice === 'HR' ? 'HR_SEARCH' : 'IT_SEARCH',
        thought: `${thought} Searched ${toolChoice} DB.`,
        searchQuery: query,
        retrieved: bestMatch.content,
        finalAnswer: finalAnswer
    };
}
