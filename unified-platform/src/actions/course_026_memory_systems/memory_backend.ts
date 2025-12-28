'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// --- Types ---
export type MemoryType = 'buffer' | 'window' | 'summary';

// --- Manual History Implementation (No Dependency) ---
class SimpleChatMessageHistory {
    messages: BaseMessage[] = [];

    async getMessages(): Promise<BaseMessage[]> {
        return this.messages;
    }

    async addMessage(message: BaseMessage): Promise<void> {
        this.messages.push(message);
    }

    async clear(): Promise<void> {
        this.messages = [];
    }
}

// --- In-Memory Storage (Session -> History) ---
const MEMORY_STORE = new Map<string, SimpleChatMessageHistory>();

function getSessionHistory(sessionId: string): SimpleChatMessageHistory {
    if (!MEMORY_STORE.has(sessionId)) {
        MEMORY_STORE.set(sessionId, new SimpleChatMessageHistory());
    }
    return MEMORY_STORE.get(sessionId)!;
}

// --- Helper: Get Visible Messages (Simulation for UI) ---
export async function getMemoryState(sessionId: string, k: number = 2): Promise<BaseMessage[]> {
    const history = getSessionHistory(sessionId);
    const messages = await history.getMessages();

    // Simulate Window Memory logic for visualization
    // If we only send last k*2 (user+ai) messages
    if (k > 0) {
        return messages.slice(-k * 2);
    }
    return messages;
}

export async function clearMemory(sessionId: string) {
    if (MEMORY_STORE.has(sessionId)) {
        await MEMORY_STORE.get(sessionId)?.clear();
    }
}

// --- Action: Chat with Memory ---
export interface MemoryResponse {
    answer: string;
    contextUsed: { role: string, content: string }[]; // For visualization
}

export async function chatWithMemory(
    sessionId: string,
    input: string,
    model: string = "llama3.2",
    windowSize: number = 2 // Pairs of exchanges (User+AI)
): Promise<MemoryResponse> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.7,
    });

    // 1. Define Prompt
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a friendly assistant with good memory. Keep answers concise."],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
    ]);

    // 2. Chain with specific logic to Handle Windowing *Manually* for precise control/demo
    // LangChain's RunnableWithMessageHistory is great but sometimes opaque for demos.
    // We will manually slice the history to ensure the UI matches the Backend reality exactly.

    const fullHistory = await getSessionHistory(sessionId).getMessages();

    // Apply Window Logic: Take last N messages
    // windowSize is number of *pairs*. So *2.
    const windowMessages = fullHistory.slice(-(windowSize * 2));

    // 3. Invoke LLM
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const response = await chain.invoke({
        history: windowMessages,
        input: input
    });

    // 4. Save *Full* History (so window can slide)
    const historyStore = getSessionHistory(sessionId);
    await historyStore.addMessage(new HumanMessage(input));
    await historyStore.addMessage(new AIMessage(response));

    return {
        answer: response,
        contextUsed: [
            ...windowMessages.map(m => ({
                role: m._getType() === 'human' ? 'user' : 'assistant',
                content: m.content as string
            })),
            { role: 'user', content: input } // The current input is part of context too
        ]
    };
}
